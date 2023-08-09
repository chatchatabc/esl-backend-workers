import { TRPCError } from "@trpc/server";
import type { TRPC_ERROR_CODE_KEY } from "@trpc/server/dist/rpc";

export function utilFailedResponse(message: string, status: number = 500) {
  let code: TRPC_ERROR_CODE_KEY = "INTERNAL_SERVER_ERROR";
  switch (status) {
    case 400:
      code = "BAD_REQUEST";
      break;
    case 401:
      code = "UNAUTHORIZED";
      break;
    case 403:
      code = "FORBIDDEN";
      break;
    case 404:
      code = "NOT_FOUND";
      break;
  }

  return new TRPCError({
    code,
    message,
  });
}

export function utilValidateOrigin(origin: string) {
  const allowedOrigins = ["https://esl-cca.pages.dev", "http://localhost:3000"];
  return allowedOrigins.includes(origin);
}
