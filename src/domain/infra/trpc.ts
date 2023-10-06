import { inferAsyncReturnType, initTRPC } from "@trpc/server";
import { Env } from "../..";
import { utilFailedResponse, utilGetJwtData } from "../services/utilService";

type Props = {
  req: Request;
  resHeaders: Headers;
  env: Env;
  ctx: ExecutionContext;
};

// tRPC Router context
export function trpcContext({ resHeaders, req, ...props }: Props) {
  const origin = req.headers.get("Origin") ?? "";

  // Set CORS headers
  resHeaders.append("Access-Control-Allow-Origin", origin);
  resHeaders.append("Access-Control-Allow-Methods", "*");
  resHeaders.append("Access-Control-Allow-Headers", "Content-Type");
  resHeaders.append("Access-Control-Allow-Credentials", "true");

  // Get token from cookie
  const getCookieHeader = req.headers.get("Cookie");
  const tokenCookie = getCookieHeader
    ?.split(";")
    .find((c) => c.includes("token="));
  const token = tokenCookie?.trim()?.slice(6);

  // Get userID from token
  const user = utilGetJwtData(token ?? "");

  // Clear cookie if token is invalid
  if (!user && token) {
    resHeaders.append("Set-Cookie", "token=; Max-Age=0");
  }

  return { ...props, resHeaders, req, user };
}

// Initialize tRPC with context
export const trpc = initTRPC
  .context<inferAsyncReturnType<typeof trpcContext>>()
  .create();

// tRPC create router
export const trpcRouterCreate = trpc.router;

// tRPC procedure
export const trpcProcedure = trpc.procedure;

export const trpcProcedureUser = trpcProcedure.use(
  trpc.middleware(async (opts) => {
    const { user } = opts.ctx;
    if (!user) {
      throw utilFailedResponse("Unauthorized", 401);
    }
    return opts.next({ ...opts, ctx: { ...opts.ctx, user } });
  })
);

// tRPC procedure with admin middleware
export const trpcProcedureAdmin = trpcProcedure.use(
  trpc.middleware(async (opts) => {
    const { user } = opts.ctx;

    if (!user) {
      throw utilFailedResponse("Unauthorized", 401);
    }

    if (user.roleId !== 1) {
      throw utilFailedResponse("Forbidden Access", 403);
    }

    return opts.next({ ...opts, ctx: { ...opts.ctx, user } });
  })
);
