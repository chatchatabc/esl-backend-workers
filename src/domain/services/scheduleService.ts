import { Input } from "valibot";
import { Env } from "../..";
import {
  Schedule,
  ScheduleCreateInput,
  SchedulePagination,
  ScheduleUpdateInput,
} from "../models/ScheduleModel";
import {
  scheduleDbCreate,
  scheduleDbDeleteMany,
  scheduleDbGetAll,
  scheduleDbGetAllTotal,
  scheduleDbGetOverlapMany,
  scheduleDbUpdate,
  scheduleDbUpdateMany,
} from "../repositories/scheduleRepo";
import {
  utilCheckScheduleOverlap,
  utilFailedResponse,
  utilGetScheduleTimeAndDay,
} from "./utilService";
import { ScheduleUpdateSchema } from "../schemas/ScheduleSchema";

export async function scheduleUpdateMany(
  params: {
    teacherId: number;
    schedules: Input<typeof ScheduleUpdateSchema>[];
  },
  env: Env
) {
  let { teacherId, schedules } = params;

  // Get old schedules
  const oldSchedules = await scheduleDbGetAll(
    { teacherId, page: 1, size: 10000 },
    env
  );

  // Fix ScheduleUpdateInput
  const newSchedules = schedules.map((schedule) => {
    const oldSchedule = oldSchedules.find((s) => s.id === schedule.id);
    if (!oldSchedule) {
      throw utilFailedResponse("Schedule not found", 404);
    } else if (oldSchedule.teacherId !== teacherId) {
      throw utilFailedResponse("Unauthorized", 401);
    }

    let startTime = oldSchedule.startTime,
      endTime = oldSchedule.endTime,
      weekDay = oldSchedule.weekDay;

    if (schedule.startTime) {
      const date = new Date(schedule.startTime);
      weekDay = date.getUTCDay();
      startTime = (date.getTime() % 86400000) + weekDay * 86400000;
    }

    if (schedule.endTime) {
      const date = new Date(schedule.endTime);
      const endDay = date.getUTCDay();
      endTime = (date.getTime() % 86400000) + endDay * 86400000;
    }

    return {
      ...oldSchedule,
      startTime,
      endTime,
      weekDay,
    };
  });

  // Merge old and new schedules
  const combinedSchedules = oldSchedules.map((schedule) => {
    const newSchedule = newSchedules.find((s) => s.id === schedule.id);
    return newSchedule ?? schedule;
  });

  // Check if schedules overlap
  let overlapped = utilCheckScheduleOverlap(combinedSchedules);
  if (overlapped) {
    throw utilFailedResponse("Schedule overlaps", 400);
  }

  const stmts = newSchedules.map((schedule) => {
    return scheduleDbUpdate(schedule, env);
  });

  try {
    await env.DB.batch(stmts);
    return true;
  } catch (e) {
    console.log(e);
    throw utilFailedResponse("Failed to update schedules", 500);
  }
}

export async function scheduleDeleteMany(
  params: { scheduleIds: number[]; teacherId: number },
  env: Env
) {
  const { teacherId, scheduleIds } = params;

  const schedules = await scheduleDbGetAll(
    { teacherId, page: 1, size: 10000 },
    env
  );

  // Check if all schedules are owned by user
  if (
    !scheduleIds.every((scheduleId) => {
      const schedule = schedules.find((s) => s.id === scheduleId);
      return schedule ? true : false;
    })
  ) {
    throw utilFailedResponse("Unauthorized", 401);
  }

  const success = await scheduleDbDeleteMany(scheduleIds, env);
  if (!success) {
    throw utilFailedResponse("Failed to delete schedules", 500);
  }

  return true;
}

export async function scheduleCreateMany(
  data: { teacherId: number; schedules: ScheduleCreateInput[] },
  env: Env,
  createdById: number
) {
  let { teacherId, schedules } = data;

  // Fix day & time format
  const newSchedules = schedules.map((schedule) => {
    const [startTime, endTime, weekDay] = utilGetScheduleTimeAndDay(
      schedule.startTime,
      schedule.endTime
    );

    return {
      teacherId,
      startTime,
      endTime,
      weekDay,
    };
  });

  let overlapped =
    (await scheduleDbGetOverlapMany(newSchedules, env)) ||
    utilCheckScheduleOverlap(newSchedules);
  if (overlapped) {
    throw utilFailedResponse("Schedule overlaps", 400);
  }

  const stmts = newSchedules.map((schedule) => {
    return scheduleDbCreate(schedule, env, createdById);
  });

  try {
    await env.DB.batch(stmts);
    return true;
  } catch (e) {
    console.log(e);
    throw utilFailedResponse("Failed to create schedules", 500);
  }
}

export async function scheduleGetAll(params: SchedulePagination, env: Env) {
  const schedules = await scheduleDbGetAll(params, env);
  const totalElements = await scheduleDbGetAllTotal(params, env);

  return {
    content: schedules as Schedule[],
    totalElements: totalElements as number,
    page: params.page,
    size: params.size,
  };
}
