import { trpcProcedureAdmin, trpcRouterCreate } from "../../domain/infra/trpc";
import { messageCreate } from "../../domain/services/messageService";
import { utilFailedResponse } from "../../domain/services/utilService";

export default trpcRouterCreate({
  send: trpcProcedureAdmin
    .input((values: any = {}) => {
      if (
        !values.message ||
        !values.receiverId ||
        !values.title ||
        !values.cron
      ) {
        throw utilFailedResponse("Missing input fields", 400);
      } else if (values.sendAt && values.sendAt % (10 * 60 * 1000) !== 0) {
        throw utilFailedResponse("Invalid schedule to send message", 400);
      }

      return {
        message: values.message,
        receiverId: values.receiverId,
        title: values.title,
        cron: values.cron,
        sendAt: values.sendAt,
      } as {
        message: string;
        receiverId: number;
        title: string;
        cron: string;
        sendAt?: number;
      };
    })
    .mutation((opts) => {
      const { userId, env } = opts.ctx;
      const data = {
        ...opts.input,
        senderId: userId,
        status: 1,
      };
      return messageCreate(data, env);
    }),
});
