import { trpcProcedureUser, trpcRouterCreate } from "../../domain/infra/trpc";
import { CommonPaginationInput } from "../../domain/schemas/CommonSchema";
import { courseGetAll } from "../../domain/services/courseService";

export default trpcRouterCreate({
  getAll: trpcProcedureUser.input(CommonPaginationInput).query((opts) => {
    return courseGetAll(opts.input, opts.ctx.env);
  }),
});
