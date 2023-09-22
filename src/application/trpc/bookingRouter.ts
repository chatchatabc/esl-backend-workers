import { parse } from "valibot";
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
  bookingCreate,
  bookingCreateMany,
  bookingGetAll,
  bookingUpdate,
  bookingUpdateStatusMany,
} from "../../domain/services/bookingService";
import { studentGetByUser } from "../../domain/services/studentService";
import { utilFailedResponse } from "../../domain/services/utilService";
import { courseGet } from "../../domain/services/courseService";

export default trpcRouterCreate({
  getAll: trpcProcedureUser
    .input((input) => parse(CommonPaginationInput, input))
    .query((opts) => {
      const { input, ctx } = opts;
      const { userId, env } = ctx;
      input.userId = userId;

      return bookingGetAll(input, env);
    }),

  getAllAdmin: trpcProcedureAdmin
    .input((input) => parse(CommonPaginationInput, input))
    .query((opts) => {
      const { env } = opts.ctx;

      return bookingGetAll(opts.input, env);
    }),

  create: trpcProcedureUser
    .input((input) => parse(BookingCreateInput, input))
    .mutation(async (opts) => {
      const { start, end, courseId } = opts.input;
      if (start >= end) {
        throw utilFailedResponse("Start time must be before end time", 400);
      }

      const { userId, env } = opts.ctx;
      const student = await studentGetByUser({ userId }, opts.ctx.env);
      const course = await courseGet({ courseId }, opts.ctx.env);
      const amount = course.price * ((end - start) / (1000 * 60 * 30));

      return bookingCreate(
        { ...opts.input, studentId: student.id, amount },
        env,
        userId
      );
    }),

  createByAdmin: trpcProcedureAdmin
    .input((input) => parse(BookingCreateInputAdmin, input))
    .mutation(async (opts) => {
      const { env, userId } = opts.ctx;
      const { start, end, advanceBooking, ...booking } = opts.input;
      if (start >= end) {
        throw utilFailedResponse("Start time must be before end time", 400);
      }

      const course = await courseGet({ courseId: booking.courseId }, env);
      let amount = course.price * ((end - start) / (1000 * 60 * 30));

      if (advanceBooking) {
        amount = booking.amount ?? amount * advanceBooking;
        return bookingCreateMany(
          { ...booking, start, end, amount },
          opts.ctx.env,
          advanceBooking,
          userId
        );
      }

      return bookingCreate({ ...opts.input, amount }, env, userId);
    }),

  completeAdmin: trpcProcedureAdmin
    .input((input) => parse(BookingCompleteInputAdmin, input))
    .mutation((opts) => {
      const { env, user } = opts.ctx;
      return bookingUpdate({ ...opts.input, status: 3 }, env, user);
    }),

  cancel: trpcProcedureUser
    .input((input) => parse(BookingCancelInput, input))
    .mutation((opts) => {
      const { env, user } = opts.ctx;
      const { id } = opts.input;
      return bookingUpdate({ id, status: 4 }, env, user);
    }),

  updateStatusMany: trpcProcedureUser
    .input((input) => parse(BookingUpdateStatusManyInput, input))
    .mutation((opts) => {
      const { env, user } = opts.ctx;
      return bookingUpdateStatusMany(opts.input, env, user);
    }),

  update: trpcProcedureAdmin
    .input((input) => parse(BookingUpdateInput, input))
    .mutation((opts) => {
      const { env, user } = opts.ctx;
      return bookingUpdate(opts.input, env, user);
    }),
});
