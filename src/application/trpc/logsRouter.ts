import { merge, number, object } from "valibot";
import {
  trpcProcedureAdmin,
  trpcProcedureUser,
  trpcRouterCreate,
} from "../../domain/infra/trpc";
import { CommonPaginationInput } from "../../domain/schemas/CommonSchema";
import {
  logsApproveCredit,
  logsGetAllCredit,
  logsRejectCredit,
  logsRequestCredit,
} from "../../domain/services/logsService";
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
    .input(merge([CommonPaginationInput, object({ userId: number() })]))
    .query((opts) => {
      return logsGetAllCredit(opts.input, opts.ctx.env);
    }),

  approveCredit: trpcProcedureAdmin
    .input((values: any = {}) => {
      if (!values.logId) {
        throw utilFailedResponse("Missing fields", 400);
      }
      const data = {
        logId: values.logId,
      } as { logId: number };
      return data;
    })
    .mutation((opts) => {
      return logsApproveCredit(opts.input, opts.ctx.env);
    }),

  rejectCredit: trpcProcedureAdmin
    .input((values: any = {}) => {
      if (!values.logId) {
        throw utilFailedResponse("Missing fields", 400);
      }
      const data = {
        logId: values.logId,
      } as { logId: number };
      return data;
    })
    .mutation((opts) => {
      return logsRejectCredit(opts.input, opts.ctx.env);
    }),

  requestCredit: trpcProcedureAdmin
    .input((values: any = {}) => {
      if (!values.amount) {
        throw utilFailedResponse("Missing fields", 400);
      }
      const data = {
        amount: values.amount,
      } as { amount: number };
      return data;
    })
    .mutation((opts) => {
      const { userId, env } = opts.ctx;
      return logsRequestCredit({ ...opts.input, userId: userId ?? 0 }, env);
    }),
});
