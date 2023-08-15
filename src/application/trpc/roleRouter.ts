import { number, object, string } from "valibot";
import {
  trpcProcedureAdmin,
  trpcProcedureUser,
  trpcRouterCreate,
} from "../../domain/infra/trpc";
import { userGetByUsername } from "../../domain/services/userService";
import { roleGet } from "../../domain/services/roleService";

export default trpcRouterCreate({
  get: trpcProcedureUser.input(object({ roleId: number() })).query((opts) => {
    return roleGet(opts.input, opts.ctx.env);
  }),

  getAll: trpcProcedureAdmin
    .input(object({ username: string() }))
    .query((opts) => {
      return userGetByUsername(opts.input, opts.ctx.env);
    }),
});
