import { parse } from "valibot";
import {
  trpcProcedureAdmin,
  trpcProcedureUser,
  trpcRouterCreate,
} from "../../domain/infra/trpc";
import { CommonPaginationInput } from "../../domain/schemas/CommonSchema";
import { logsGetAllCredit } from "../../domain/services/logsService";
import { utilFailedResponse } from "../../domain/services/utilService";

export default trpcRouterCreate({
  getCreditAll: trpcProcedureUser
    .input((values: any = {}) => {
      return values as { page?: number; size?: number };
    })
    .query((opts) => {
      const { userId, env } = opts.ctx;
      const data = {
        page: opts.input.page ?? 1,
        size: opts.input.size ?? 10,
        userId: userId ?? 0,
      };

      return logsGetAllCredit(data, env);
    }),

  getCreditAllByUser: trpcProcedureAdmin
    .input((input) => parse(CommonPaginationInput, input))
    .query((opts) => {
      const { userId } = opts.input;
      if (!userId) {
        throw utilFailedResponse("Missing fields", 400);
      }

      return logsGetAllCredit({ ...opts.input, userId }, opts.ctx.env);
    }),
});
