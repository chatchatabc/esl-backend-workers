import { parse } from "valibot";
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

  getAll: trpcProcedureUser
    .input((input) => parse(CommonPaginationInput, input))
    .query((opts) => {
      return scheduleGetAll(opts.input, opts.ctx.env);
    }),

  updateMany: trpcProcedureUser
    .input((input) => parse(ScheduleUpdateManyInput, input))
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
    .input((input) => parse(ScheduleUpdateManyInputAdmin, input))
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
    .input((input) => parse(ScheduleCreateManyInput, input))
    .mutation(async (opts) => {
      const { userId, env } = opts.ctx;
      const { schedules } = opts.input;

      const teacher = await teacherGet({ userId }, env);

      return scheduleCreateMany(
        { teacherId: teacher.id, schedules },
        env,
        userId
      );
    }),

  createManyAdmin: trpcProcedureAdmin
    .input((input) => parse(ScheduleCreateManyInputAdmin, input))
    .mutation((opts) => {
      const { env, userId } = opts.ctx;
      const { schedules } = opts.input;

      if (
        !schedules.every((schedule) => {
          return schedule.startTime < schedule.endTime;
        })
      ) {
        throw utilFailedResponse("Invalid time range");
      }

      return scheduleCreateMany(opts.input, env, userId);
    }),

  deleteMany: trpcProcedureUser
    .input((input) => parse(ScheduleDeleteManyInput, input))
    .mutation(async (opts) => {
      const { userId, env } = opts.ctx;
      const { scheduleIds } = opts.input;

      const teacher = await teacherGet({ userId }, env);

      return scheduleDeleteMany({ scheduleIds, teacherId: teacher.id }, env);
    }),

  deleteManyAdmin: trpcProcedureAdmin
    .input((input) => parse(ScheduleDeleteManyInputAdmin, input))
    .mutation((opts) => {
      const { env } = opts.ctx;

      return scheduleDeleteMany(opts.input, env);
    }),
});
