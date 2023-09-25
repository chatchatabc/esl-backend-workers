import { trpcProcedureAdmin, trpcRouterCreate } from "../../domain/infra/trpc";
import { CommonPaginationInput } from "../../domain/schemas/CommonSchema";
import {
  MessageCreateInput,
  MessageSendInput,
  MessageUpdateInput,
} from "../../domain/schemas/MessageSchema";
import {
  messageCreate,
  messageGetAll,
  messageSend,
  messageUpdate,
} from "../../domain/services/messageService";

export default trpcRouterCreate({
  create: trpcProcedureAdmin.input(MessageCreateInput).mutation((opts) => {
    const { userId, env } = opts.ctx;
    const data = {
      ...opts.input,
      senderId: userId,
      status: 1,
    };
    return messageCreate(data, env);
  }),

  getAll: trpcProcedureAdmin.input(CommonPaginationInput).query((opts) => {
    const { page = 1, size = 10 } = opts.input;
    return messageGetAll({ page, size }, opts.ctx.env);
  }),

  send: trpcProcedureAdmin.input(MessageSendInput).mutation((opts) => {
    const { env } = opts.ctx;

    return messageSend(opts.input, env);
  }),

  update: trpcProcedureAdmin.input(MessageUpdateInput).mutation((opts) => {
    return messageUpdate(opts.input, opts.ctx.env);
  }),
});
