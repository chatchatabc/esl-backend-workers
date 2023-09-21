import { number, object, optional, string } from "valibot";
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
    .input(
      object({
        teacherId: optional(number("Teacher ID must be a number")),
        userId: optional(number("User ID must be a number")),
        userUsername: optional(string("Username must be a string")),
      })
    )
    .query((opts) => {
      return teacherGet(opts.input, opts.ctx.env);
    }),

  getAll: trpcProcedureUser.input(CommonPaginationInput).query((opts) => {
    return teacherGetAll(opts.input, opts.ctx.env);
  }),

  create: trpcProcedureAdmin.input(TeacherCreateInput).query((opts) => {
    const { userId, env } = opts.ctx;

    return teacherCreate(opts.input, env, userId);
  }),

  update: trpcProcedureAdmin.input(TeacherUpdateInput).mutation((opts) => {
    return teacherUpdate(opts.input, opts.ctx.env);
  }),
});
