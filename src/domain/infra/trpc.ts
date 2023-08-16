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
export function trpcContext({ resHeaders, req, ...props }: Props) {
  const origin = req.headers.get("Origin") ?? "";

  // Get token from cookie
  const setCookieHeader = req.headers.get("Cookie");
  const tokenCookie = setCookieHeader
    ?.split(";")
    .find((c) => c.includes("token="));
  const token = tokenCookie?.trim()?.slice(6);

  // Get userID from token
  const userId = authGetTokenPayload(token ?? "") ?? 0;

  // Clear cookie if token is invalid
  if (!userId && token) {
    resHeaders.append("Set-Cookie", "token=; Max-Age=0");
  }

  // Set CORS headers if origin is valid
  resHeaders.append("Access-Control-Allow-Origin", origin);
  resHeaders.append("Access-Control-Allow-Methods", "*");
  resHeaders.append("Access-Control-Allow-Headers", "Content-Type");
  resHeaders.append("Access-Control-Allow-Credentials", "true");

  return { ...props, resHeaders, req, userId };
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
    if (opts.ctx.userId === 0) {
      throw utilFailedResponse("Invalid Token", 403);
    }
    return opts.next(opts);
  })
);

// tRPC procedure with admin middleware
export const trpcProcedureAdmin = trpcProcedure.use(
  trpc.middleware(async (opts) => {
    const { userId, env } = opts.ctx;
    if (userId === 0) {
      throw utilFailedResponse("Invalid Token", 403);
    }

    const user = await userDbGet({ userId }, env);
    if (!user) {
      throw utilFailedResponse("User Not Found", 404);
    }

    if (user.roleId !== 1) {
      throw utilFailedResponse("Forbidden Access", 403);
    }
    return opts.next(opts);
  })
);
