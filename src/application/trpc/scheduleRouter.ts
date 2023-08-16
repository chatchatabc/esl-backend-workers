import { trpcProcedureUser, trpcRouterCreate } from "../../domain/infra/trpc";
import { Schedule } from "../../domain/models/ScheduleModel";
import { CommonPaginationInput } from "../../domain/schemas/CommonSchema";
import {
  ScheduleCreateManyInput,
  ScheduleUpdateManyInput,
} from "../../domain/schemas/ScheduleSchema";
import {
  scheduleCreateMany,
  scheduleDeleteMany,
  scheduleGetAll,
  scheduleUpdateMany,
} from "../../domain/services/scheduleService";
import { utilFailedResponse } from "../../domain/services/utilService";

export default trpcRouterCreate({
  get: trpcProcedureUser.query(() => {
    return "Get Schedule";
  }),

  getAll: trpcProcedureUser.input(CommonPaginationInput).query((opts) => {
    return scheduleGetAll(opts.input, opts.ctx.env);
  }),

  updateMany: trpcProcedureUser
    .input(ScheduleUpdateManyInput)
    .mutation((opts) => {
      const { userId, env } = opts.ctx;
      const { schedules } = opts.input;

      if (
        !schedules.every((schedule) => {
          return schedule.startTime < schedule.endTime;
        })
      ) {
        throw utilFailedResponse("Invalid time range");
      }

      return scheduleUpdateMany({ userId, schedules }, env);
    }),

  createMany: trpcProcedureUser
    .input(ScheduleCreateManyInput)
    .mutation((opts) => {
      const { userId, env } = opts.ctx;
      const { schedules } = opts.input;

      return scheduleCreateMany({ userId, schedules }, env);
    }),

  deleteMany: trpcProcedureUser
    .input((value) => {
      const data = value as Schedule[];
      return data;
    })
    .mutation((opts) => {
      return scheduleDeleteMany(opts.input, opts.ctx.env);
    }),
});
