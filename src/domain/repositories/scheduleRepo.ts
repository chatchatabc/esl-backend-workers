import type {
  Schedule,
  ScheduleCreate,
  SchedulePagination,
} from "../models/ScheduleModel";
import type { BookingCreate } from "../models/BookingModel";
import { Env } from "../..";
import {
  utilFailedResponse,
  utilGetScheduleTimeAndDay,
  utilQueryAddWhere,
  utilQueryUpdate,
} from "../services/utilService";
import { CommonPaginationInput } from "../models/CommonModel";
import { Input, safeParse } from "valibot";
import { ScheduleUpdateSchema } from "../schemas/ScheduleSchema";

export async function scheduleDbGetAll(params: SchedulePagination, env: Env) {
  const { teacherId, page, size } = params;

  const queryParams = [];
  let query = "SELECT * FROM schedules";
  let queryWhere = "";

  if (teacherId) {
    queryWhere += `teacherId = ?`;
    queryParams.push(teacherId);
  }

  if (queryWhere) {
    query += ` WHERE ${queryWhere}`;
  }

  query += " ORDER BY createdAt DESC";
  query += " LIMIT ?, ?";
  queryParams.push((page - 1) * size, size);

  try {
    const results = await env.DB.prepare(query)
      .bind(...queryParams)
      .all<Schedule>();
    return results.results;
  } catch (e) {
    console.log(e);
    throw utilFailedResponse("Cannot get schedules", 500);
  }
}

export async function scheduleDbGetAllTotal(
  params: CommonPaginationInput,
  env: Env
) {
  const { teacherId } = params;

  const queryParams = [];
  let query = "SELECT COUNT(*) AS total FROM schedules";

  if (teacherId) {
    query = utilQueryAddWhere(query, "teacherId = ?");
    queryParams.push(teacherId);
  }

  try {
    const total = await env.DB.prepare(query)
      .bind(...queryParams)
      .first<number>("total");
    return total;
  } catch (e) {
    console.log(e);
    throw utilFailedResponse("Cannot get total schedules", 500);
  }
}

export function scheduleDbUpdate(
  params: Input<typeof ScheduleUpdateSchema>,
  env: Env
) {
  const parse = safeParse(ScheduleUpdateSchema, params);
  if (!parse.success) {
    throw utilFailedResponse("Invalid schedule update params", 400);
  }

  const data = parse.data;
  const { id, ...schedule } = data;
  let query = "UPDATE schedules";

  let { queryParams, querySet } = utilQueryUpdate(schedule, "schedules");

  query += ` SET ${querySet}`;
  query += " WHERE id = ?";
  queryParams.push(id);

  try {
    const stmt = env.DB.prepare(query).bind(...queryParams);
    return stmt;
  } catch (e) {
    console.log(e);
    throw utilFailedResponse(
      "Unable to generate schedule update statement",
      500
    );
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
          schedule.weekDay,
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
  booking: BookingCreate,
  env: Env
) {
  const { start, end, teacherId } = booking;
  const [startTime, endTime] = utilGetScheduleTimeAndDay(start, end);

  try {
    const stmt = env.DB.prepare(
      "SELECT COUNT(*) AS total FROM schedules WHERE teacherId = ? AND startTime <= ? AND endTime >= ?"
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

export async function scheduleDbDeleteMany(schedulesIds: number[], env: Env) {
  try {
    const stmt = env.DB.prepare("DELETE FROM schedules WHERE id = ?");
    await env.DB.batch(
      schedulesIds.map((id) => {
        return stmt.bind(id);
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
          "SELECT COUNT(*) AS total FROM schedules WHERE (teacherId = ? AND ((startTime <= ? AND endTime > ?) OR (startTime < ? AND endTime >= ?)))"
        ).bind(
          schedule.teacherId,
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

export function scheduleDbCreate(
  params: ScheduleCreate,
  env: Env,
  createdById: number
) {
  let query = "INSERT INTO schedules";
  let fields = "";
  let values = "";
  const queryParams: (string | null | number)[] = [];
  const now = Date.now();

  Object.keys(params).forEach((key, index) => {
    if (index !== 0) {
      fields += ", ";
      values += ", ";
    }
    fields += key;
    values += "?";
    queryParams.push(params[key as keyof ScheduleCreate]);
  });

  if (queryParams.length) {
    fields += ", createdAt, updatedAt, createdById";
    values += ", ?, ?, ?";
    queryParams.push(now, now, createdById);

    query += ` (${fields}) VALUES (${values})`;
  } else {
    throw utilFailedResponse("No data to insert", 400);
  }

  try {
    const stmt = env.DB.prepare(query).bind(...queryParams);
    return stmt;
  } catch (e) {
    console.log(e);
    throw utilFailedResponse(
      "Unable to generate schedule create statement",
      500
    );
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
          schedule.weekDay,
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
