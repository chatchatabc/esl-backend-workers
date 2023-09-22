import { parse } from "valibot";
import { trpcProcedureAdmin, trpcRouterCreate } from "../../domain/infra/trpc";
import { CommonPaginationInput } from "../../domain/schemas/CommonSchema";
import {
  StudentCreateInput,
  StudentGetByUserInput,
  StudentGetInput,
} from "../../domain/schemas/StudentSchema";
import {
  studentCreate,
  studentGet,
  studentGetAll,
  studentGetByUser,
} from "../../domain/services/studentService";

export default trpcRouterCreate({
  get: trpcProcedureAdmin
    .input((input) => parse(StudentGetInput, input))
    .query((opts) => {
      return studentGet(opts.input, opts.ctx.env);
    }),

  getByUser: trpcProcedureAdmin
    .input((input) => parse(StudentGetByUserInput, input))
    .query((opts) => {
      return studentGetByUser(opts.input, opts.ctx.env);
    }),

  getAll: trpcProcedureAdmin
    .input((input) => parse(CommonPaginationInput, input))
    .query((opts) => {
      return studentGetAll(opts.input, opts.ctx.env);
    }),

  create: trpcProcedureAdmin
    .input((input) => parse(StudentCreateInput, input))
    .mutation((opts) => {
      const { userId, env } = opts.ctx;

      return studentCreate(opts.input, env, userId);
    }),
});
