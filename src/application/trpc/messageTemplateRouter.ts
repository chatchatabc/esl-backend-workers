import { number, object, parse } from "valibot";
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
    .input((input) => parse(MessageTemplateCreateInput, input))
    .mutation((opts) => {
      return messageTemplateCreate(opts.input, opts.ctx.env);
    }),

  update: trpcProcedureAdmin
    .input((input) => parse(MessageTemplateUpdateInput, input))
    .mutation((opts) => {
      return messageTemplateUpdate(opts.input, opts.ctx.env);
    }),

  get: trpcProcedureAdmin
    .input((input) =>
      parse(
        object({
          messageTemplateId: number("Message Template ID must be a number"),
        }),
        input
      )
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
