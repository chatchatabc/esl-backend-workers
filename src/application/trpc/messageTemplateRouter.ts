import { number, object } from "valibot";
import { trpcProcedureAdmin, trpcRouterCreate } from "../../domain/infra/trpc";
import { CommonPaginationInput } from "../../domain/models/CommonModel";
import {
  messageTemplateCreate,
  messageTemplateGet,
  messageTemplateGetAll,
  messageTemplateUpdate,
} from "../../domain/services/messageTemplate";
import {
  MessageTemplateCreateInput,
  MessageTemplateUpdateInput,
} from "../../domain/schemas/MessageTemplateSchema";

export default trpcRouterCreate({
  create: trpcProcedureAdmin
    .input(MessageTemplateCreateInput)
    .mutation((opts) => {
      return messageTemplateCreate(opts.input, opts.ctx.env);
    }),

  update: trpcProcedureAdmin
    .input(MessageTemplateUpdateInput)
    .mutation((opts) => {
      return messageTemplateUpdate(opts.input, opts.ctx.env);
    }),

  get: trpcProcedureAdmin
    .input(
      object({
        messageTemplateId: number("Message Template ID must be a number"),
      })
    )
    .query((opts) => {
      return messageTemplateGet(opts.input, opts.ctx.env);
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
