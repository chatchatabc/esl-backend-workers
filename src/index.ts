import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { utilValidateOrigin } from "./domain/services/utilService";
import trpcRouter from "./application/trpc";
import { trpcContext } from "./domain/infra/trpc";
import {
  cronSendCronMessages,
  cronSendScheduledMessages,
} from "./domain/services/cronService";
import cron from "cron-parser";

export type Env = {
  DB: D1Database;
  KV: KVNamespace;
};

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext
  ): Promise<Response> {
    // Validate origin
    const origin = request.headers.get("Origin") ?? "";
    if (!utilValidateOrigin(origin)) {
      return new Response("Invalid origin", { status: 403 });
    }

    // Handle CORS preflight requests
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": origin,
          "Access-Control-Allow-Methods": "*",
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Allow-Credentials": "true",
        },
        status: 204,
      });
    }

    // Handle tRPC requests
    const { pathname } = new URL(request.url);
    if (pathname.startsWith("/trpc")) {
      return fetchRequestHandler({
        endpoint: "/trpc",
        req: request,
        router: trpcRouter,
        createContext: (e) => trpcContext({ ...e, env, ctx }),
      });
    }

    // Handle unknown requests
    return new Response("Not found", { status: 404 });
  },
  async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext) {
    if (event.cron === "9,19,29,39,49,59 * * * *") {
      const parsedCron = cron.parseExpression("*/10 * * * *");
      const timestamp = parsedCron.next().toDate().getTime();

      ctx.waitUntil(cronSendScheduledMessages(timestamp, env));
      ctx.waitUntil(cronSendCronMessages(timestamp, env));
    }
  },
};
