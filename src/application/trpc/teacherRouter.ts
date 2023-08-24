import { number, object } from "valibot";
import {
  trpcProcedureAdmin,
  trpcProcedureUser,
  trpcRouterCreate,
} from "../../domain/infra/trpc";
import { CommonPaginationInput } from "../../domain/schemas/CommonSchema";
import {
  teacherGet,
  teacherGetAll,
} from "../../domain/services/teacherService";

export default trpcRouterCreate({
  get: trpcProcedureUser
    .input(object({ teacherId: number() }))
    .query((opts) => {
      return teacherGet(opts.input, opts.ctx.env);
    }),

  getAll: trpcProcedureAdmin.input(CommonPaginationInput).query((opts) => {
    return teacherGetAll(opts.input, opts.ctx.env);
  }),
});
