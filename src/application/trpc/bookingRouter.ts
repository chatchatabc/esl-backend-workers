import {
  trpcProcedureAdmin,
  trpcProcedureUser,
  trpcRouterCreate,
} from "../../domain/infra/trpc";
import {
  BookingCancelInput,
  BookingCompleteInputAdmin,
  BookingCreateInput,
  BookingCreateInputAdmin,
  BookingUpdateInput,
  BookingUpdateStatusManyInputByAdmin,
} from "../../domain/schemas/BookingSchema";
import { CommonPaginationInput } from "../../domain/schemas/CommonSchema";
import {
  bookingComplete,
  bookingCreate,
  bookingCreateMany,
  bookingGetAll,
  bookingUpdate,
  bookingUpdateStatusMany,
} from "../../domain/services/bookingService";
import { utilFailedResponse } from "../../domain/services/utilService";

export default trpcRouterCreate({
  getAll: trpcProcedureUser.input(CommonPaginationInput).query((opts) => {
    const { input, ctx } = opts;
    const { userId, env } = ctx;
    input.userId = userId;

    return bookingGetAll(input, env);
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

  completeAdmin: trpcProcedureAdmin
    .input(BookingCompleteInputAdmin)
    .mutation((opts) => {
      const { env } = opts.ctx;
      const bookingId = opts.input.id;
      return bookingComplete({ ...opts.input, bookingId }, env);
    }),

  cancel: trpcProcedureUser.input(BookingCancelInput).mutation((opts) => {
    const { env, user } = opts.ctx;
    const { id } = opts.input;
    return bookingUpdate({ id, status: 4 }, env, user);
  }),

  updateStatusManyByAdmin: trpcProcedureAdmin
    .input(BookingUpdateStatusManyInputByAdmin)
    .mutation((opts) => {
      const { env, user } = opts.ctx;
      return bookingUpdateStatusMany(opts.input, env, user);
    }),

  update: trpcProcedureAdmin.input(BookingUpdateInput).mutation((opts) => {
    const { env, user } = opts.ctx;
    return bookingUpdate(opts.input, env, user);
  }),
});
