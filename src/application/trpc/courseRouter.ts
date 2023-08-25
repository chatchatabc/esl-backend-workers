import {
  trpcProcedureAdmin,
  trpcProcedureUser,
  trpcRouterCreate,
} from "../../domain/infra/trpc";
import { CommonPaginationInput } from "../../domain/schemas/CommonSchema";
import { CourseCreateInput } from "../../domain/schemas/CourseSchema";
import {
  courseCreate,
  courseGetAll,
} from "../../domain/services/courseService";

export default trpcRouterCreate({
  getAll: trpcProcedureUser.input(CommonPaginationInput).query((opts) => {
    return courseGetAll(opts.input, opts.ctx.env);
  }),

  create: trpcProcedureAdmin.input(CourseCreateInput).mutation((opts) => {
    return courseCreate(opts.input, opts.ctx.env);
  }),
});
