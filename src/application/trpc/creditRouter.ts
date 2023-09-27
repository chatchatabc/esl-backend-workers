import { trpcProcedureAdmin, trpcRouterCreate } from "../../domain/infra/trpc";
import { CreditAddInput } from "../../domain/schemas/CreditSchema";
import { creditAdd } from "../../domain/services/creditService";

export default trpcRouterCreate({
  add: trpcProcedureAdmin.input(CreditAddInput).mutation((opts) => {
    const { userId, env } = opts.ctx;

    return creditAdd(opts.input, env, userId);
  }),
});
