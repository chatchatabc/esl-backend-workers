import { number, object } from "valibot";
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
  teacherGetByUser,
  teacherUpdate,
} from "../../domain/services/teacherService";
import {
  TeacherCreateInput,
  TeacherUpdateInput,
} from "../../domain/schemas/TeacherSchema";

export default trpcRouterCreate({
  get: trpcProcedureUser
    .input(object({ teacherId: number() }))
    .query((opts) => {
      return teacherGet(opts.input, opts.ctx.env);
    }),

  getByUser: trpcProcedureAdmin
    .input(object({ userId: number() }))
    .query((opts) => {
      return teacherGetByUser(opts.input, opts.ctx.env);
    }),

  getAll: trpcProcedureUser.input(CommonPaginationInput).query((opts) => {
    return teacherGetAll(opts.input, opts.ctx.env);
  }),

  create: trpcProcedureAdmin.input(TeacherCreateInput).query((opts) => {
    return teacherCreate(opts.input, opts.ctx.env);
  }),

  update: trpcProcedureAdmin.input(TeacherUpdateInput).mutation((opts) => {
    return teacherUpdate(opts.input, opts.ctx.env);
  }),
});
