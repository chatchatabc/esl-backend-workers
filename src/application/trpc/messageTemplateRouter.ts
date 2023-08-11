import { trpcProcedureAdmin, trpcRouterCreate } from "../../domain/infra/trpc";
import { CommonPaginationInput } from "../../domain/models/CommonModel";
import { MessageTemplateCreateInput } from "../../domain/models/MessageModel";
import { messageTemplateCreate } from "../../domain/services/messageTemplate";
import { utilFailedResponse } from "../../domain/services/utilService";

export default trpcRouterCreate({
  create: trpcProcedureAdmin
    .input((values: any = {}) => {
      if (!values.title || !values.message) {
        throw utilFailedResponse("Missing input fields", 400);
      }

      return {
        title: values.title,
        message: values.message,
      } as MessageTemplateCreateInput;
    })
    .query((opts) => {
      const data = {
        ...opts.input,
        status: 1,
      };
      messageTemplateCreate(data, opts.ctx.env);
    }),
});
