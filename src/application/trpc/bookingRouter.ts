import {
  trpcProcedureAdmin,
  trpcProcedureUser,
  trpcRouterCreate,
} from "../../domain/infra/trpc";
import {
  BookingCancelInput,
  BookingCompleteInput,
  BookingCompleteInputAdmin,
  BookingCreateByAdminInput,
  BookingCreateInput,
  BookingStatisticsTeacherSchema,
  BookingUpdateInput,
  BookingUpdateStatusManyInput,
} from "../../domain/schemas/BookingSchema";
import { CommonPaginationInput } from "../../domain/schemas/CommonSchema";
import {
  bookingCreate,
  bookingCreateMany,
  bookingGetAll,
  bookingStatisticsTeacher,
  bookingUpdate,
  bookingUpdateStatusMany,
} from "../../domain/services/bookingService";
import { utilFailedResponse } from "../../domain/services/utilService";
import { courseGet } from "../../domain/services/courseService";
import { studentGet } from "../../domain/services/studentService";
import { teacherGet } from "../../domain/services/teacherService";

export default trpcRouterCreate({
  getAll: trpcProcedureUser.input(CommonPaginationInput).query(async (opts) => {
    const { input, ctx } = opts;
    const { user, env } = ctx;

    if (user.roleId === 2) {
      const student = await studentGet({ userId: user.id }, env);
      opts.input.studentId = student.id;
      opts.input.teacherId = undefined;
    } else if (user.roleId === 3) {
      const teacher = await teacherGet({ userId: user.id }, env);
      opts.input.teacherId = teacher.id;
      opts.input.studentId = undefined;
    }

    return bookingGetAll(input, env);
  }),

  getAllAdmin: trpcProcedureAdmin.input(CommonPaginationInput).query((opts) => {
    const { env } = opts.ctx;

    return bookingGetAll(opts.input, env);
  }),

  create: trpcProcedureUser.input(BookingCreateInput).mutation(async (opts) => {
    const { start, end, courseId } = opts.input;
    if (start >= end) {
      throw utilFailedResponse("Start time must be before end time", 400);
    }

    const { userId, env } = opts.ctx;
    const student = await studentGet({ userId }, opts.ctx.env);
    const course = await courseGet({ courseId }, opts.ctx.env);
    const amount = course.price * ((end - start) / (1000 * 60 * 30));

    return bookingCreate(
      { ...opts.input, studentId: student.id, amount },
      env,
      userId
    );
  }),

  createByAdmin: trpcProcedureAdmin
    .input(BookingCreateByAdminInput)
    .mutation(async (opts) => {
      const { env, userId } = opts.ctx;
      const { start, end, advanceBooking, ...booking } = opts.input;
      if (start >= end) {
        throw utilFailedResponse("Start time must be before end time", 400);
      }

      const course = await courseGet({ courseId: booking.courseId }, env);
      let amount = course.price * ((end - start) / (1000 * 60 * 30));

      if (advanceBooking) {
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
    .input(BookingCompleteInputAdmin)
    .mutation((opts) => {
      const { env, user } = opts.ctx;
      return bookingUpdate({ ...opts.input, status: 3 }, env, user);
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

  statisticsTeacher: trpcProcedureAdmin
    .input(BookingStatisticsTeacherSchema)
    .query(async (opts) => {
      const { env } = opts.ctx;
      return bookingStatisticsTeacher(opts.input, env);
    }),

  complete: trpcProcedureUser.input(BookingCompleteInput).mutation((opts) => {
    const { env, user } = opts.ctx;
    const { id, status, message } = opts.input;
    if (status !== 3 && status !== 5) {
      throw utilFailedResponse("Invalid status", 400);
    }
    return bookingUpdate({ id, status, message }, env, user);
  }),
});
