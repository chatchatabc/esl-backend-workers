import { number, object } from "valibot";
import {
  trpcProcedureAdmin,
  trpcProcedureUser,
  trpcRouterCreate,
} from "../../domain/infra/trpc";
import { roleGet, roleGetAll } from "../../domain/services/roleService";
import { CommonPaginationInput } from "../../domain/schemas/CommonSchema";

export default trpcRouterCreate({
  get: trpcProcedureUser.input(object({ roleId: number() })).query((opts) => {
    return roleGet(opts.input, opts.ctx.env);
  }),

  getAll: trpcProcedureAdmin.input(CommonPaginationInput).query((opts) => {
    return roleGetAll(opts.input, opts.ctx.env);
  }),
});
