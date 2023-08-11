import {
  trpcProcedure,
  trpcProcedureUser,
  trpcRouterCreate,
} from "../../domain/infra/trpc";
import {
  Schedule,
  ScheduleCreateInput,
  ScheduleUpdateInput,
} from "../../domain/models/ScheduleModel";
import {
  scheduleCreateMany,
  scheduleDeleteMany,
  scheduleGetAllByUser,
  scheduleUpdateMany,
} from "../../domain/services/scheduleService";
import { utilFailedResponse } from "../../domain/services/utilService";

export default trpcRouterCreate({
  get: trpcProcedureUser.query(() => {
    return "Get Schedule";
  }),

  getAllByUser: trpcProcedureUser
    .input((values: any = {}) => {
      if (!values.userId) {
        throw utilFailedResponse("Missing values", 400);
      }

      return {
        userId: values.userId,
        page: values.page,
        size: values.size,
      } as {
        userId: number;
        page?: number;
        size?: number;
      };
    })
    .query((opts) => {
      const { page, size, ...others } = opts.input;
      const data = {
        page: page ?? 1,
        size: size ?? 10,
        ...others,
      };
      return scheduleGetAllByUser(data, opts.ctx.env);
    }),

  updateManyByTeacher: trpcProcedureUser
    .input((values: any = {}) => {
      if (!values.schedules || values.schedules.length === 0) {
        throw utilFailedResponse("Missing schedules", 400);
      }

      // Clean up the schedules input
      values.schedule = values.schedules.map((schedule: Schedule) => {
        if (
          !schedule.id ||
          !schedule.endTime ||
          !schedule.startTime ||
          !schedule.teacherId
        ) {
          throw utilFailedResponse("Missing fields in schedules", 400);
        } else if (schedule.startTime > schedule.endTime) {
          throw utilFailedResponse("Start time should not be after end time");
        }

        return {
          id: schedule.id,
          teacherId: schedule.teacherId,
          startTime: schedule.startTime,
          endTime: schedule.endTime,
        };
      });

      return values as {
        userId?: number;
        schedules: ScheduleUpdateInput[];
      };
    })
    .mutation((opts) => {
      const { userId = 0, env } = opts.ctx;

      // If admin is updating a user's schedule
      if (opts.input.userId && userId === 1) {
        return scheduleUpdateMany(
          { userId: opts.input.userId, schedules: opts.input.schedules },
          env
        );
      }

      return scheduleUpdateMany({ ...opts.input, userId }, env);
    }),

  createMany: trpcProcedureUser
    .input((values: any = {}) => {
      if (!values.schedules || values.schedules.length === 0) {
        throw utilFailedResponse("Missing schedules", 400);
      }

      values.schedules = values.schedules.map((value: any) => {
        if (!value.teacherId || !value.startTime || !value.endTime) {
          throw utilFailedResponse(
            "Missing fields teacherId, startTime, and endTime",
            400
          );
        } else if (value.startTime > value.endTime) {
          throw utilFailedResponse("Start time cannot be after end time", 400);
        }

        return {
          teacherId: value.teacherId,
          startTime: value.startTime,
          endTime: value.endTime,
        };
      });

      return values as {
        schedules: ScheduleCreateInput[];
        userId?: number;
      };
    })
    .mutation((opts) => {
      const { userId = 0, env } = opts.ctx;
      const { schedules } = opts.input;

      // If admin is creating a user's schedule
      if (opts.input.userId && userId === 1) {
        return scheduleCreateMany(
          { userId: opts.input.userId, schedules },
          env
        );
      }

      return scheduleCreateMany({ userId, schedules }, opts.ctx.env);
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
