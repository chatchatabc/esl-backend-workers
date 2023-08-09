import { inferAsyncReturnType, initTRPC } from "@trpc/server";
import { Env } from "../..";
import { utilFailedResponse } from "../../domain/services/utilService";

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
  const token = tokenCookie?.split("=")[1] ?? "";

  // Get userID from token
  // const userId = authGetTokenPayload(token);

  // Set CORS headers if origin is valid
  resHeaders.append("Access-Control-Allow-Origin", origin);
  resHeaders.append("Access-Control-Allow-Methods", "*");
  resHeaders.append("Access-Control-Allow-Headers", "Content-Type");
  resHeaders.append("Access-Control-Allow-Credentials", "true");

  return { ...props, resHeaders, req, userId: 1 };
}

// Initialize tRPC with context
export const trpc = initTRPC
  .context<inferAsyncReturnType<typeof trpcContext>>()
  .create();

// tRPC create router
export const trpcRouterCreate = trpc.router;

// tRPC procedure
export const trpcProcedure = trpc.procedure;

// tRPC middleware for logged in users
export const trpcMiddlewareUser = trpc.middleware((opts) => {
  if (!opts.ctx.userId) {
    throw utilFailedResponse("Invalid Token", 403);
  }
  return opts.next(opts);
});

// tRPC middleware for admin users
export const trpcMiddlewareAdmin = trpc.middleware((opts) => {
  if (opts.ctx.userId !== 1) {
    throw utilFailedResponse("Forbidden Access", 403);
  }
  return opts.next(opts);
});

// tRPC Main Router
const trpcRouter = trpcRouterCreate({});
export default trpcRouter;
export type TrpcRouter = typeof trpcRouter;
