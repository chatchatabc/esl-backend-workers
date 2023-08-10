import { trpcProcedureUser, trpcRouterCreate } from "../../domain/infra/trpc";
import { teacherGet } from "../../domain/services/teacherService";
import { utilFailedResponse } from "../../domain/services/utilService";

export default trpcRouterCreate({
  get: trpcProcedureUser
    .input((values: any = {}) => {
      if (!values.userId) {
        throw utilFailedResponse("Missing user ID", 400);
      }

      return { userId: values.userId as number };
    })
    .query((opts) => {
      return teacherGet(opts.input, opts.ctx.env);
    }),
});
