import {
  trpcProcedureAdmin,
  trpcProcedureUser,
  trpcRouterCreate,
} from "../../domain/infra/trpc";
import { CommonPaginationInput } from "../../domain/schemas/CommonSchema";
import {
  ScheduleCreateManyInput,
  ScheduleCreateManyInputAdmin,
  ScheduleDeleteManyInput,
  ScheduleDeleteManyInputAdmin,
  ScheduleUpdateManyByAdminInput,
  ScheduleUpdateManyInput,
} from "../../domain/schemas/ScheduleSchema";
import {
  scheduleCreateMany,
  scheduleDeleteMany,
  scheduleGetAll,
  scheduleUpdateMany,
} from "../../domain/services/scheduleService";
import { teacherGet } from "../../domain/services/teacherService";
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
    .mutation(async (opts) => {
      const { env, user } = opts.ctx;
      const { schedules } = opts.input;

      if (
        !schedules.every((schedule) => {
          return schedule.startTime < schedule.endTime;
        })
      ) {
        throw utilFailedResponse("Invalid time range");
      }

      return scheduleUpdateMany(opts.input, env, user);
    }),

  createMany: trpcProcedureUser
    .input(ScheduleCreateManyInput)
    .mutation(async (opts) => {
      const { userId, env, user } = opts.ctx;
      if (user.roleId !== 1) {
        const teacher = await teacherGet({ userId }, env);
        opts.input.teacherId = teacher?.id;
      }
      if (
        !opts.input.schedules.every((schedule) => {
          return schedule.startTime < schedule.endTime;
        })
      ) {
        throw utilFailedResponse("Invalid time range");
      }

      return scheduleCreateMany(opts.input, env, userId);
    }),

  deleteMany: trpcProcedureUser
    .input(ScheduleDeleteManyInput)
    .mutation(async (opts) => {
      const { env, user } = opts.ctx;

      return scheduleDeleteMany(opts.input, env, user);
    }),
});
