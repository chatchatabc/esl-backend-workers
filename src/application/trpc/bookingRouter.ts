import { trpcProcedureUser, trpcRouterCreate } from "../../domain/infra/trpc";
import { BookingCreateInput } from "../../domain/schemas/BookingSchema";
import { CommonPaginationInput } from "../../domain/schemas/CommonSchema";
import {
  bookingCancel,
  bookingCreate,
  bookingGetAll,
} from "../../domain/services/bookingService";
import { utilFailedResponse } from "../../domain/services/utilService";

export default trpcRouterCreate({
  getAll: trpcProcedureUser.input(CommonPaginationInput).query((opts) => {
    const { userId, env } = opts.ctx;
    opts.input.userId = userId;

    return bookingGetAll(opts.input, env);
  }),

  create: trpcProcedureUser.input(BookingCreateInput).mutation(async (opts) => {
    const { userId, env } = opts.ctx;
    const studentId = userId;
    return bookingCreate({ ...opts.input, studentId, amount: 0 }, env);
  }),

  cancel: trpcProcedureUser
    .input((values: any = {}) => {
      if (!values.bookingId) {
        throw utilFailedResponse("Missing fields", 400);
      }

      return { bookingId: values.bookingId } as {
        bookingId: number;
        studentId?: number;
      };
    })
    .mutation((opts) => {
      const { userId, env } = opts.ctx;
      opts.input.studentId = userId;
      return bookingCancel(opts.input, env);
    }),
});
