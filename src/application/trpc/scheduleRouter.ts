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
  ScheduleUpdateManyInput,
  ScheduleUpdateManyInputAdmin,
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
      const { userId, env } = opts.ctx;
      const { schedules } = opts.input;

      if (
        !schedules.every((schedule) => {
          return schedule.startTime < schedule.endTime;
        })
      ) {
        throw utilFailedResponse("Invalid time range");
      }

      const teacher = await teacherGet({ userId }, env);
      return scheduleUpdateMany({ teacherId: teacher.id, schedules }, env);
    }),

  updateManyAdmin: trpcProcedureAdmin
    .input(ScheduleUpdateManyInputAdmin)
    .mutation((opts) => {
      const { env } = opts.ctx;
      const { schedules } = opts.input;

      if (
        !schedules.every((schedule) => {
          return schedule.startTime < schedule.endTime;
        })
      ) {
        throw utilFailedResponse("Invalid time range");
      }

      return scheduleUpdateMany(opts.input, env);
    }),

  createMany: trpcProcedureUser
    .input(ScheduleCreateManyInput)
    .mutation(async (opts) => {
      const { userId, env } = opts.ctx;
      const { schedules } = opts.input;

      const teacher = await teacherGet({ userId }, env);

      return scheduleCreateMany({ teacherId: teacher.id, schedules }, env);
    }),

  createManyAdmin: trpcProcedureAdmin
    .input(ScheduleCreateManyInputAdmin)
    .mutation((opts) => {
      const { env } = opts.ctx;
      const { schedules } = opts.input;

      if (
        !schedules.every((schedule) => {
          return schedule.startTime < schedule.endTime;
        })
      ) {
        throw utilFailedResponse("Invalid time range");
      }

      return scheduleCreateMany(opts.input, env);
    }),

  deleteMany: trpcProcedureUser
    .input(ScheduleDeleteManyInput)
    .mutation(async (opts) => {
      const { userId, env } = opts.ctx;
      const { scheduleIds } = opts.input;

      const teacher = await teacherGet({ userId }, env);

      return scheduleDeleteMany({ scheduleIds, teacherId: teacher.id }, env);
    }),

  deleteManyAdmin: trpcProcedureAdmin
    .input(ScheduleDeleteManyInputAdmin)
    .mutation((opts) => {
      const { env } = opts.ctx;

      return scheduleDeleteMany(opts.input, env);
    }),
});
