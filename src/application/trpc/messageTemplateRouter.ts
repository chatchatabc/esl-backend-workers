import { trpcProcedureAdmin, trpcRouterCreate } from "../../domain/infra/trpc";
import { CommonPaginationInput } from "../../domain/models/CommonModel";
import { MessageTemplateCreateInput } from "../../domain/models/MessageModel";
import {
  messageTemplateCreate,
  messageTemplateGetAll,
} from "../../domain/services/messageTemplate";
import { utilFailedResponse } from "../../domain/services/utilService";

export default trpcRouterCreate({
  create: trpcProcedureAdmin
    .input((values: any = {}) => {
      if (!values.title || !values.message || !values.signature) {
        throw utilFailedResponse("Missing input fields", 400);
      }

      return {
        title: values.title,
        message: values.message,
        signature: values.signature,
      } as MessageTemplateCreateInput;
    })
    .mutation((opts) => {
      const data = {
        ...opts.input,
        status: 1,
        templateId: 0,
      };

      return messageTemplateCreate(data, opts.ctx.env);
    }),

  getAll: trpcProcedureAdmin
    .input((values: any = {}) => {
      return {
        page: values.page,
        size: values.size,
      } as CommonPaginationInput;
    })
    .query((opts) => {
      const { page = 1, size = 10 } = opts.input;
      return messageTemplateGetAll({ page, size }, opts.ctx.env);
    }),
});
