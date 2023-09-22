import { number, object, optional, parse, string } from "valibot";
import {
  trpcProcedureAdmin,
  trpcProcedureUser,
  trpcRouterCreate,
} from "../../domain/infra/trpc";
import { CommonPaginationInput } from "../../domain/schemas/CommonSchema";
import {
  teacherCreate,
  teacherGet,
  teacherGetAll,
  teacherUpdate,
} from "../../domain/services/teacherService";
import {
  TeacherCreateInput,
  TeacherUpdateInput,
} from "../../domain/schemas/TeacherSchema";

export default trpcRouterCreate({
  get: trpcProcedureUser
    .input((input) =>
      parse(
        object({
          teacherId: optional(number("Teacher ID must be a number")),
          userId: optional(number("User ID must be a number")),
          userUsername: optional(string("Username must be a string")),
        }),
        input
      )
    )
    .query((opts) => {
      return teacherGet(opts.input, opts.ctx.env);
    }),

  getAll: trpcProcedureUser
    .input((input) => parse(CommonPaginationInput, input))
    .query((opts) => {
      return teacherGetAll(opts.input, opts.ctx.env);
    }),

  create: trpcProcedureAdmin
    .input((input) => parse(TeacherCreateInput, input))
    .query((opts) => {
      const { userId, env } = opts.ctx;

      return teacherCreate(opts.input, env, userId);
    }),

  update: trpcProcedureAdmin
    .input((input) => parse(TeacherUpdateInput, input))
    .mutation((opts) => {
      return teacherUpdate(opts.input, opts.ctx.env);
    }),
});
