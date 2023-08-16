import { trpcProcedureUser, trpcRouterCreate } from "../../domain/infra/trpc";
import { BookingCreate } from "../../domain/models/BookingModel";
import { CommonPaginationInput } from "../../domain/schemas/CommonSchema";
import {
  bookingCancel,
  bookingCreate,
  bookingGetAll,
  bookingGetAllByUser,
} from "../../domain/services/bookingService";
import { utilFailedResponse } from "../../domain/services/utilService";

export default trpcRouterCreate({
  getAll: trpcProcedureUser.input(CommonPaginationInput).query((opts) => {
    if (opts.ctx.user?.roleId !== 1) {
      opts.input.userId = opts.ctx.user?.id;
    }

    return bookingGetAll(opts.input, opts.ctx.env);
  }),

  getAllByUser: trpcProcedureUser
    .input((values: any = {}) => {
      return {
        userId: values.userId,
        page: values.page,
        size: values.size,
      } as { userId: number; page?: number; size?: number };
    })
    .query((opts) => {
      const { page, size, ...others } = opts.input;
      const data = {
        page: page ?? 1,
        size: size ?? 10,
        ...others,
      };

      return bookingGetAllByUser(data, opts.ctx.env);
    }),

  create: trpcProcedureUser
    .input((values: any = {}) => {
      if (
        !values.end ||
        !values.start ||
        !values.studentId ||
        !values.teacherId
      ) {
        throw utilFailedResponse("Missing fields", 400);
      } else if (values.start > values.end) {
        throw utilFailedResponse("Incorrect start and end date", 400);
      } else if (values.start % 1800 !== 0) {
        throw utilFailedResponse("Incorrect start date", 400);
      } else if (values.end % 1800 !== 0) {
        throw utilFailedResponse("Incorrect end date", 400);
      } else if (values.start <= Date.now() || values.end <= Date.now()) {
        throw utilFailedResponse(
          "Cannot booked schedule past the current time.",
          400
        );
      }

      return {
        end: values.end,
        start: values.start,
        teacherId: values.teacherId,
        status: 1,
      } as BookingCreate;
    })
    .mutation(async (opts) => {
      opts.input.studentId = opts.ctx.user?.id ?? 0;
      return bookingCreate(opts.input, opts.ctx.env);
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
      opts.input.studentId = opts.ctx.user?.id ?? 0;
      return bookingCancel(opts.input, opts.ctx.env);
    }),
});
