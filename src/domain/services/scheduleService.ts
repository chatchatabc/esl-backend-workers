import { Input } from "valibot";
import { Env } from "../..";
import {
  Schedule,
  ScheduleCreateInput,
  SchedulePagination,
  ScheduleUpdateInput,
} from "../models/ScheduleModel";
import {
  scheduleDbDeleteMany,
  scheduleDbGetAll,
  scheduleDbGetAllTotal,
  scheduleDbGetOverlapMany,
  scheduleDbInsertMany,
  scheduleDbUpdateMany,
} from "../repositories/scheduleRepo";
import {
  utilCheckScheduleOverlap,
  utilFailedResponse,
  utilGetScheduleTimeAndDay,
} from "./utilService";
import { ScheduleDeleteManyInputAdmin } from "../schemas/ScheduleSchema";

export async function scheduleUpdateMany(
  params: { userId: number; schedules: ScheduleUpdateInput[] },
  env: Env
) {
  let { userId, schedules } = params;

  // Get old schedules
  const query = await scheduleDbGetAll({ userId, page: 1, size: 10000 }, env);
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

export async function scheduleDeleteMany(
  params: { scheduleIds: number[]; userId: number },
  env: Env
) {
  const { userId, scheduleIds } = params;

  const query = await scheduleDbGetAll({ userId, page: 1, size: 10000 }, env);
  if (!query) {
    throw utilFailedResponse("Cannot GET Schedules", 500);
  }
  const schedules = query.results;

  // Check if all schedules are owned by user
  if (
    !scheduleIds.every((scheduleId) => {
      const schedule = schedules.find((s) => s.id === scheduleId);
      return schedule ? true : false;
    })
  ) {
    throw utilFailedResponse("Unauthorized", 401);
  }

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
      userId,
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

export async function scheduleGetAll(params: SchedulePagination, env: Env) {
  const query = await scheduleDbGetAll(params, env);
  if (!query) {
    throw utilFailedResponse("Cannot GET Schedules", 500);
  }
  const totalElements = await scheduleDbGetAllTotal(params, env);
  if (totalElements === null) {
    throw utilFailedResponse("Cannot GET Total Schedules", 500);
  }

  return {
    content: query.results as Schedule[],
    totalElements: totalElements as number,
    page: params.page,
    size: params.size,
  };
}
