import {
  trpcProcedureAdmin,
  trpcProcedureUser,
  trpcRouterCreate,
} from "../../domain/infra/trpc";
import {
  BookingCancelInput,
  BookingCancelInputAdmin,
  BookingCreateInput,
  BookingCreateInputAdmin,
} from "../../domain/schemas/BookingSchema";
import { CommonPaginationInput } from "../../domain/schemas/CommonSchema";
import {
  bookingCancel,
  bookingCreate,
  bookingCreateMany,
  bookingGetAll,
} from "../../domain/services/bookingService";
import { utilFailedResponse } from "../../domain/services/utilService";

export default trpcRouterCreate({
  getAll: trpcProcedureUser.input(CommonPaginationInput).query((opts) => {
    const { userId, env } = opts.ctx;
    opts.input.userId = userId;

    return bookingGetAll(opts.input, env);
  }),

  getAllAdmin: trpcProcedureAdmin.input(CommonPaginationInput).query((opts) => {
    const { env } = opts.ctx;

    return bookingGetAll(opts.input, env);
  }),

  create: trpcProcedureUser.input(BookingCreateInput).mutation(async (opts) => {
    const { start, end } = opts.input;
    if (start >= end) {
      throw utilFailedResponse("Invalid time", 400);
    }

    const { userId, env } = opts.ctx;
    return bookingCreate({ ...opts.input, userId }, env);
  }),

  createAdmin: trpcProcedureAdmin
    .input(BookingCreateInputAdmin)
    .mutation(async (opts) => {
      const { start, end, advanceBooking } = opts.input;
      if (start >= end) {
        throw utilFailedResponse("Start time must be before end time", 400);
      }

      if (advanceBooking) {
        return bookingCreateMany(
          { ...opts.input, advanceBooking },
          opts.ctx.env
        );
      }

      return bookingCreate(opts.input, opts.ctx.env);
    }),

  cancel: trpcProcedureUser.input(BookingCancelInput).mutation((opts) => {
    const { userId, env } = opts.ctx;
    return bookingCancel({ ...opts.input, userId }, env);
  }),

  cancelAdmin: trpcProcedureAdmin
    .input(BookingCancelInputAdmin)
    .mutation((opts) => {
      const { env } = opts.ctx;
      return bookingCancel(opts.input, env);
    }),
});
