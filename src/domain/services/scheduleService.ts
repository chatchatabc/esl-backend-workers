import { Env } from "../..";
import { Schedule, ScheduleCreateInput } from "../models/ScheduleModel";
import {
  scheduleDbDeleteMany,
  scheduleDbGetAllByUser,
  scheduleDbGetAllTotalByUser,
  scheduleDbGetOverlapMany,
  scheduleDbInsertMany,
  scheduleDbUpdateMany,
} from "../repositories/scheduleRepo";
import {
  utilCheckScheduleOverlap,
  utilFailedResponse,
  utilGetScheduleTimeAndDay,
} from "./utilService";

export async function scheduleUpdateMany(
  params: { userId: number; schedules: Schedule[] },
  env: Env
) {
  let { userId, schedules } = params;

  // Get old schedules
  const query = await scheduleDbGetAllByUser({ userId }, env);
  if (!query) {
    throw utilFailedResponse("Cannot GET Schedules", 500);
  }

  // Check if all schedules are owned by user
  const oldSchedules = query.results;
  if (
    !schedules.every((schedule) => {
      const oldSchedule = oldSchedules.find((s) => s.id === schedule.id);
      return oldSchedule ? true : false;
    })
  ) {
    throw utilFailedResponse("Unauthorized", 401);
  }

  // Fix day & time format
  const newSchedules = schedules.map((schedule) => {
    const [startTime, endTime, day] = utilGetScheduleTimeAndDay(
      schedule.startTime,
      schedule.endTime
    );
    return {
      ...schedule,
      teacherId: userId,
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

export async function scheduleDeleteMany(schedules: Schedule[], env: Env) {
  const success = await scheduleDbDeleteMany(schedules, env);
  if (!success) {
    throw utilFailedResponse("Failed to delete schedules", 500);
  }

  return true;
}

export async function scheduleCreateMany(
  data: { userId: number; schedules: ScheduleCreateInput[] },
  bindings: Env
) {
  let { userId, schedules } = data;

  // Fix day & time format
  const newSchedules = schedules.map((schedule) => {
    const [startTime, endTime, day] = utilGetScheduleTimeAndDay(
      schedule.startTime,
      schedule.endTime
    );

    return {
      teacherId: userId,
      startTime,
      endTime,
      day,
    };
  });

  let overlapped =
    (await scheduleDbGetOverlapMany(newSchedules, bindings)) ||
    utilCheckScheduleOverlap(newSchedules);
  if (overlapped) {
    throw utilFailedResponse("Schedule overlaps", 400);
  }

  const success = await scheduleDbInsertMany(newSchedules, bindings);
  if (!success) {
    throw utilFailedResponse("Failed to create schedules", 500);
  }

  return true;
}

export async function scheduleGetAllByUser(
  params: { userId: number; page: number; size: number },
  env: Env
) {
  const { page, size } = params;

  const query = await scheduleDbGetAllByUser(params, env);
  if (!query) {
    throw utilFailedResponse("Cannot GET Schedules", 500);
  }
  const total = await scheduleDbGetAllTotalByUser(params.userId, env);
  if (total === null) {
    throw utilFailedResponse("Cannot GET Total Schedules", 500);
  }

  return {
    content: query.results as Schedule[],
    total,
    page,
    size,
  };
}
