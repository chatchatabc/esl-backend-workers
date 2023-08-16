import { trpcProcedureUser, trpcRouterCreate } from "../../domain/infra/trpc";
import { BookingCreate } from "../../domain/models/BookingModel";
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
      const { userId, env } = opts.ctx;
      opts.input.studentId = userId;
      return bookingCreate(opts.input, env);
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
