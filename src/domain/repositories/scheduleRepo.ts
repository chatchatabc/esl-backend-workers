import type {
  Schedule,
  ScheduleCreate,
  SchedulePagination,
} from "../models/ScheduleModel";
import type { BookingCreateInput } from "../models/BookingModel";
import { Env } from "../..";
import {
  utilGetScheduleTimeAndDay,
  utilQueryAddWhere,
} from "../services/utilService";
import { CommonPaginationInput } from "../models/CommonModel";

export async function scheduleDbGetAll(params: SchedulePagination, env: Env) {
  const { userId, page, size } = params;

  const queryParams = [];
  let query = "SELECT * FROM schedules";

  if (userId) {
    query = utilQueryAddWhere(query, "userId = ?");
    queryParams.push(userId);
  }

  query += " ORDER BY createdAt DESC";
  query += " LIMIT ?, ?";
  queryParams.push((page - 1) * size, size);

  try {
    const results = await env.DB.prepare(query)
      .bind(...queryParams)
      .all<Schedule>();
    return results;
  } catch (e) {
    console.log(e);
    return null;
  }
}

export async function scheduleDbGetAllTotal(
  params: CommonPaginationInput,
  env: Env
) {
  const { userId } = params;

  const queryParams = [];
  let query = "SELECT COUNT(*) AS total FROM schedules";

  if (userId) {
    query = utilQueryAddWhere(query, "userId = ?");
    queryParams.push(userId);
  }

  try {
    const total = await env.DB.prepare(query)
      .bind(...queryParams)
      .first<number>("total");
    return total;
  } catch (e) {
    console.log(e);
    return null;
  }
}

export async function scheduleDbUpdateMany(schedules: Schedule[], env: Env) {
  try {
    const stmt = env.DB.prepare(
      "UPDATE schedules SET startTime = ?, endTime = ?, updatedAt = ?, userId = ?, day = ? WHERE id = ?"
    );
    await env.DB.batch(
      schedules.map((schedule) => {
        return stmt.bind(
          schedule.startTime,
          schedule.endTime,
          Date.now(),
          schedule.userId,
          schedule.day,
          schedule.id
        );
      })
    );
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
}

export async function scheduleDbValidateBooking(
  booking: BookingCreateInput,
  env: Env
) {
  const { start, end, teacherId } = booking;
  const [startTime, endTime] = utilGetScheduleTimeAndDay(start, end);

  try {
    const stmt = env.DB.prepare(
      "SELECT COUNT(*) AS total FROM schedules WHERE userId = ? AND startTime <= ? AND endTime >= ?"
    ).bind(teacherId, startTime, endTime);
    const total = await stmt.first("total");
    if (total === 0) {
      return false;
    }
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
}

export async function scheduleDbDeleteMany(
  schedules: { id: number }[],
  env: Env
) {
  try {
    const stmt = env.DB.prepare("DELETE FROM schedules WHERE id = ?");
    await env.DB.batch(
      schedules.map((schedule) => {
        return stmt.bind(schedule.id);
      })
    );
    return true;
  } catch (e) {
    console.log(e);
    return null;
  }
}

export async function scheduleDbGetOverlapMany(
  schedules: ScheduleCreate[],
  env: Env
) {
  try {
    const totals = await env.DB.batch<Record<string, any>>(
      schedules.map((schedule) => {
        return env.DB.prepare(
          "SELECT COUNT(*) AS total FROM schedules WHERE (userId = ? AND ((startTime <= ? AND endTime > ?) OR (startTime < ? AND endTime >= ?)))"
        ).bind(
          schedule.userId,
          schedule.startTime,
          schedule.startTime,
          schedule.endTime,
          schedule.endTime
        );
      })
    );
    const total = totals.reduce((acc, curr) => {
      return acc + curr.results[0].total;
    }, 0);

    if (total === 0) {
      return false;
    }

    return true;
  } catch (e) {
    console.log(e);
    return true;
  }
}

export async function scheduleDbInsertMany(
  schedules: ScheduleCreate[],
  env: Env
) {
  try {
    const stmt = env.DB.prepare(
      "INSERT INTO schedules (userId, startTime, endTime, day, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?)"
    );
    await env.DB.batch(
      schedules.map((schedule) => {
        const date = Date.now();
        return stmt.bind(
          schedule.userId,
          schedule.startTime,
          schedule.endTime,
          schedule.day,
          date,
          date
        );
      })
    );
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
}
