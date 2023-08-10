import type { Schedule, ScheduleCreate } from "../models/ScheduleModel";
import type { BookingCreate } from "../models/BookingModel";
import { Env } from "../..";
import { utilGetTimestampTimeOnly } from "../services/utilService";

export async function scheduleDbGetAllByUser(
  params: { userId: number },
  env: Env
) {
  const { userId } = params;

  try {
    const results = await env.DB.prepare(
      "SELECT * FROM schedules WHERE teacherId = ?"
    )
      .bind(userId)
      .all<Schedule>();
    return results;
  } catch (e) {
    console.log(e);
    return null;
  }
}

export async function scheduleDbUpdateMany(schedules: Schedule[], env: Env) {
  try {
    const stmt = env.DB.prepare(
      "UPDATE schedules SET startTime = ?, endTime = ?, updatedAt = ?, teacherId = ?, day = ? WHERE id = ?"
    );
    await env.DB.batch(
      schedules.map((schedule) => {
        return stmt.bind(
          schedule.startTime,
          schedule.endTime,
          Date.now(),
          schedule.teacherId,
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

export async function scheduleDbGetAllTotalByUser(id: number, env: Env) {
  try {
    const stmt = env.DB.prepare(
      "SELECT COUNT(*) AS total FROM schedules WHERE teacherId = ?"
    ).bind(id);
    const total = await stmt.first("total");
    return total as number;
  } catch (e) {
    console.log(e);
    return null;
  }
}

export async function scheduleDbValidateBooking(
  booking: BookingCreate,
  env: Env
) {
  const { start, end, teacherId } = booking;
  const day = new Date(start).getDay();

  try {
    const stmt = env.DB.prepare(
      "SELECT COUNT(*) AS total FROM schedules WHERE teacherId = ? AND startTime <= ? AND endTime >= ? AND day = ?"
    ).bind(
      teacherId,
      utilGetTimestampTimeOnly(start),
      utilGetTimestampTimeOnly(end),
      day
    );
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

export async function scheduleDbDeleteMany(schedules: Schedule[], env: Env) {
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
          "SELECT COUNT(*) AS total FROM schedules WHERE (teacherId = ? AND day = ? AND ((startTime <= ? AND endTime > ?) OR (startTime < ? AND endTime >= ?)))"
        ).bind(
          schedule.teacherId,
          schedule.day,
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
      "INSERT INTO schedules (teacherId, startTime, endTime, day, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?)"
    );
    await env.DB.batch(
      schedules.map((schedule) => {
        const date = Date.now();
        return stmt.bind(
          schedule.teacherId,
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
