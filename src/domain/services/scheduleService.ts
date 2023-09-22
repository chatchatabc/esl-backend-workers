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
  scheduleDbUpdateMany,
} from "../repositories/scheduleRepo";
import {
  utilCheckScheduleOverlap,
  utilFailedResponse,
  utilGetScheduleTimeAndDay,
} from "./utilService";

export async function scheduleUpdateMany(
  params: { teacherId: number; schedules: ScheduleUpdateInput[] },
  env: Env
) {
  let { teacherId, schedules } = params;

  // Get old schedules
  const query = await scheduleDbGetAll(
    { teacherId, page: 1, size: 10000 },
    env
  );
  if (!query) {
    throw utilFailedResponse("Cannot GET Schedules", 500);
  }

  // Check if all schedules are owned by user
  const oldSchedules = query;
  if (
    !schedules.every((schedule) => {
      const oldSchedule = oldSchedules.find((s) => s.id === schedule.id);
      return oldSchedule ? true : false;
    })
  ) {
    throw utilFailedResponse("Unauthorized", 401);
  }

  // Fix ScheduleUpdateInput
  const newSchedules = schedules.map((schedule) => {
    const oldSchedule = oldSchedules.find((s) => s.id === schedule.id);
    if (!oldSchedule) {
      throw utilFailedResponse("Individual schedule not found", 404);
    }

    const [startTime, endTime, day] = utilGetScheduleTimeAndDay(
      schedule.startTime,
      schedule.endTime
    );

    return {
      ...oldSchedule,
      teacherId,
      startTime,
      endTime,
      day,
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

  // Update schedules
  const transaction = await scheduleDbUpdateMany(newSchedules, env);
  if (!transaction) {
    throw utilFailedResponse("Failed to update schedules", 500);
  }

  return true;
}

export async function scheduleDeleteMany(
  params: { scheduleIds: number[]; teacherId: number },
  env: Env
) {
  const { teacherId, scheduleIds } = params;

  const query = await scheduleDbGetAll(
    { teacherId, page: 1, size: 10000 },
    env
  );
  if (!query) {
    throw utilFailedResponse("Cannot GET Schedules", 500);
  }
  const schedules = query;

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
  createdBy: number
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
    return scheduleDbCreate(schedule, env, createdBy);
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
