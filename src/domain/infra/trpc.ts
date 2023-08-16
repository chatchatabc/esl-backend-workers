import { inferAsyncReturnType, initTRPC } from "@trpc/server";
import { Env } from "../..";
import { authGetTokenPayload } from "../services/authService";
import { utilFailedResponse } from "../services/utilService";
import { userDbGet } from "../repositories/userRepo";

type Props = {
  req: Request;
  resHeaders: Headers;
  env: Env;
  ctx: ExecutionContext;
};

// tRPC Router context
export async function trpcContext({ resHeaders, req, env, ...props }: Props) {
  const origin = req.headers.get("Origin") ?? "";

  // Get token from cookie
  const setCookieHeader = req.headers.get("Cookie");
  const tokenCookie = setCookieHeader
    ?.split(";")
    .find((c) => c.includes("token="));
  const token = tokenCookie?.trim()?.slice(6);

  // Get userID from token
  const userId = authGetTokenPayload(token ?? "") ?? 0;
  const user = await userDbGet({ userId }, env);

  // Clear cookie if token is invalid
  if (!user && token) {
    resHeaders.append("Set-Cookie", "token=; Max-Age=0");
  }

  // Set CORS headers if origin is valid
  resHeaders.append("Access-Control-Allow-Origin", origin);
  resHeaders.append("Access-Control-Allow-Methods", "*");
  resHeaders.append("Access-Control-Allow-Headers", "Content-Type");
  resHeaders.append("Access-Control-Allow-Credentials", "true");

  return { ...props, resHeaders, env, req, user };
}

// Initialize tRPC with context
export const trpc = initTRPC
  .context<inferAsyncReturnType<typeof trpcContext>>()
  .create();

// tRPC create router
export const trpcRouterCreate = trpc.router;

// tRPC procedure
export const trpcProcedure = trpc.procedure;

// tRPC procedure with user middleware
export const trpcProcedureUser = trpcProcedure.use(
  trpc.middleware((opts) => {
    if (!opts.ctx.user) {
      throw utilFailedResponse("Invalid Token", 403);
    }
    return opts.next(opts);
  })
);

// tRPC procedure with admin middleware
export const trpcProcedureAdmin = trpcProcedure.use(
  trpc.middleware((opts) => {
    if (opts.ctx.user?.roleId !== 1) {
      throw utilFailedResponse("Forbidden Access", 403);
    }
    return opts.next(opts);
  })
);
