import { parse } from "valibot";
import {
  trpcProcedureAdmin,
  trpcProcedureUser,
  trpcRouterCreate,
} from "../../domain/infra/trpc";
import { CommonPaginationInput } from "../../domain/schemas/CommonSchema";
import {
  CourseCreateInput,
  CourseUpdateInput,
} from "../../domain/schemas/CourseSchema";
import {
  courseCreate,
  courseGetAll,
  courseUpdate,
} from "../../domain/services/courseService";

export default trpcRouterCreate({
  getAll: trpcProcedureUser.input(CommonPaginationInput).query((opts) => {
    return courseGetAll(opts.input, opts.ctx.env);
  }),

  create: trpcProcedureAdmin.input(CourseCreateInput).mutation((opts) => {
    return courseCreate(opts.input, opts.ctx.env);
  }),

  update: trpcProcedureAdmin.input(CourseUpdateInput).mutation((opts) => {
    return courseUpdate(opts.input, opts.ctx.env);
  }),
});
