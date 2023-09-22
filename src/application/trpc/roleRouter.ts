import { number, object, parse } from "valibot";
import {
  trpcProcedureAdmin,
  trpcProcedureUser,
  trpcRouterCreate,
} from "../../domain/infra/trpc";
import { roleGet, roleGetAll } from "../../domain/services/roleService";
import { CommonPaginationInput } from "../../domain/schemas/CommonSchema";

export default trpcRouterCreate({
  get: trpcProcedureUser
    .input((input) => parse(object({ roleId: number() }), input))
    .query((opts) => {
      return roleGet(opts.input, opts.ctx.env);
    }),

  getAll: trpcProcedureAdmin
    .input((input) => parse(CommonPaginationInput, input))
    .query((opts) => {
      return roleGetAll(opts.input, opts.ctx.env);
    }),
});
