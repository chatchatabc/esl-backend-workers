import { trpcProcedureUser, trpcRouterCreate } from "../../domain/infra/trpc";
import { userGet } from "../../domain/services/userService";
import { utilFailedResponse } from "../../domain/services/utilService";

export default trpcRouterCreate({
  get: trpcProcedureUser
    .input((values: any = {}) => {
      if (!values.userId) {
        throw utilFailedResponse("Missing values", 400);
      }

      return {
        userId: values.userId,
      } as { userId: number };
    })
    .query((opts) => {
      const { userId } = opts.input;
      return userGet({ userId }, opts.ctx.env);
    }),
});
