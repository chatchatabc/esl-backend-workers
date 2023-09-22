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
  BookingUpdateStatusManyInput,
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
import { studentGetByUser } from "../../domain/services/studentService";
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
    const student = await studentGetByUser({ userId }, opts.ctx.env);

    return bookingCreate({ ...opts.input, studentId: student.id }, env, userId);
  }),

  createAdmin: trpcProcedureAdmin
    .input(BookingCreateInputAdmin)
    .mutation(async (opts) => {
      const { env, userId } = opts.ctx;
      const { start, end, advanceBooking, ...booking } = opts.input;
      if (start >= end) {
        throw utilFailedResponse("Start time must be before end time", 400);
      }

      if (advanceBooking) {
        return bookingCreateMany(
          { ...booking, start, end },
          opts.ctx.env,
          advanceBooking,
          userId
        );
      }

      return bookingCreate(opts.input, env, userId);
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

  updateStatusMany: trpcProcedureUser
    .input(BookingUpdateStatusManyInput)
    .mutation((opts) => {
      const { env, user } = opts.ctx;
      return bookingUpdateStatusMany(opts.input, env, user);
    }),

  update: trpcProcedureAdmin.input(BookingUpdateInput).mutation((opts) => {
    const { env, user } = opts.ctx;
    return bookingUpdate(opts.input, env, user);
  }),
});
