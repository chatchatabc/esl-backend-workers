import { Env } from "../..";
import {
  Booking,
  BookingCreate,
  BookingPagination,
} from "../models/BookingModel";
import { LogsCreditCreate } from "../models/LogsModel";
import { MessageCreate } from "../models/MessageModel";
import { User } from "../models/UserModel";
import { utilQueryAddWhere } from "../services/utilService";

export async function bookingDbGetAll(params: BookingPagination, env: Env) {
  const { userId, page, size, status } = params;

  const queryParams = [];
  let query = "SELECT * FROM bookings";
  if (userId) {
    query = utilQueryAddWhere(query, "teacherId = ? OR userId = ?");
    queryParams.push(userId, userId);
  }
  if (status) {
    query = utilQueryAddWhere(query, "status = ?");
    queryParams.push(status);
  } else {
    query = utilQueryAddWhere(query, "status = 0 OR status = 1");
  }
  query += " LIMIT ?, ?";
  queryParams.push((page - 1) * size, size);

  try {
    const results = await env.DB.prepare(query)
      .bind(...queryParams)
      .all<Booking>();

    return results;
  } catch (e) {
    console.log(e);
    return null;
  }
}

export async function bookingDbGetAllTotal(
  params: BookingPagination,
  env: Env
) {
  const { userId, status } = params;

  const queryParams = [];
  let query = "SELECT COUNT(*) AS total FROM bookings";

  if (userId) {
    query = utilQueryAddWhere(query, "teacherId = ? OR userId = ?");
    queryParams.push(userId, userId);
  }
  if (status) {
    query = utilQueryAddWhere(query, "status = ?");
    queryParams.push(status);
  }

  try {
    const results = await env.DB.prepare(query)
      .bind(...queryParams)
      .first<number>("total");
    return results;
  } catch (e) {
    console.log(e);
    return null;
  }
}

export async function bookingDbGet(params: { bookingId: number }, env: Env) {
  const { bookingId } = params;

  try {
    const results = await env.DB.prepare("SELECT * FROM bookings WHERE id = ?")
      .bind(bookingId)
      .first<Booking>();

    return results;
  } catch (e) {
    console.log(e);
    return null;
  }
}

export async function bookingDbCancel(
  params: { booking: Booking; user: User; logsCredit: LogsCreditCreate },
  env: Env
) {
  const { booking, user, logsCredit } = params;
  const date = Date.now();

  try {
    const studentStmt = env.DB.prepare(
      "UPDATE users SET credits = ?, updatedAt = ? WHERE id = ?"
    ).bind(user.credits, date, user.id);
    const bookingStmt = env.DB.prepare(
      "UPDATE bookings SET status = 4, updatedAt = ? WHERE id = ?"
    ).bind(date, booking.id);
    const logsCreditStmt = env.DB.prepare(
      "INSERT INTO logsCredit (title, userId, amount, details, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?)"
    ).bind(
      logsCredit.title,
      logsCredit.userId,
      logsCredit.amount,
      logsCredit.details,
      date,
      date
    );

    await env.DB.batch([studentStmt, bookingStmt, logsCreditStmt]);

    return true;
  } catch (e) {
    console.log(e);
    return null;
  }
}

export async function bookingDbCreate(
  params: {
    booking: BookingCreate;
    user: User;
    logsCredit: LogsCreditCreate;
  },
  bindings: Env
) {
  const { booking, user, logsCredit } = params;
  const { start, end, teacherId, userId, status, courseId, message, amount } =
    booking;
  const date = Date.now();

  try {
    const userStmt = bindings.DB.prepare(
      "UPDATE users SET credits = ?, updatedAt = ? WHERE id = ?"
    ).bind(user.credits, date, user.id);
    const bookingStmt = bindings.DB.prepare(
      "INSERT INTO bookings (courseId, teacherId, userId, amount, start, end, status, message, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
    ).bind(
      courseId,
      teacherId,
      userId,
      amount,
      start,
      end,
      status,
      message,
      date,
      date
    );
    const logsStmt = bindings.DB.prepare(
      "INSERT INTO logsCredit (title, userId, amount, details, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?)"
    ).bind(
      logsCredit.title,
      userId,
      logsCredit.amount,
      logsCredit.details,
      date,
      date
    );

    await bindings.DB.batch([bookingStmt, userStmt, logsStmt]);
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
}

/**
 * Get all bookings by date range based on start date
 * @param params { start: number, end: number } - timestamp in milliseconds
 */
export async function bookingDbGetAllByDateStart(
  params: { start: number; end: number; status?: number },
  bindings: Env
) {
  const { start, end, status } = params;

  const queryParams = [];
  let query = "SELECT * FROM bookings WHERE (start >= ? AND start <= ?)";
  queryParams.push(start, end);
  if (status) {
    query += " AND status = ?";
    queryParams.push(status);
  }

  try {
    const stmt = bindings.DB.prepare(query).bind(...queryParams);
    const results = await stmt.all<Booking>();
    return results.results;
  } catch (e) {
    console.log(e);
    return undefined;
  }
}

/**
 * Get all bookings by date range based on end date
 * @param params { start: number, end: number } - timestamp in milliseconds
 */
export async function bookingDbGetAllByDateEnd(
  params: { start: number; end: number },
  bindings: Env
) {
  const { start, end } = params;
  try {
    const stmt = bindings.DB.prepare(
      "SELECT * FROM bookings WHERE (end >= ? AND end <= ?) AND status = 1"
    ).bind(start, end);
    const results = await stmt.all<Booking>();
    return results.results;
  } catch (e) {
    console.log(e);
    return undefined;
  }
}

export async function bookingDbGetOverlap(values: BookingCreate, env: Env) {
  const { start, end, teacherId, userId } = values;
  try {
    const stmt = env.DB.prepare(
      "SELECT COUNT(*) AS total FROM bookings WHERE ((start <= ? AND end > ?) OR (start < ? AND end >= ?)) AND (teacherId = ? OR userId = ?) AND status = 1"
    ).bind(start, start, end, end, teacherId, userId);
    const total = await stmt.first("total");
    return total as number;
  } catch (e) {
    console.log(e);
    return null;
  }
}

export async function bookingDbGetTotalByUser(
  params: { userId?: number },
  env: Env
) {
  const { userId } = params;
  try {
    const stmt = env.DB.prepare(
      "SELECT COUNT(*) AS total FROM bookings WHERE ((teacherId = ? OR studentId = ?) AND status = 1)"
    ).bind(userId, userId);
    const total = await stmt.first("total");
    return total as number;
  } catch (e) {
    console.log(e);
    return null;
  }
}

export async function bookingDbUpdateMany(bookings: Booking[], bindings: Env) {
  try {
    const stmt = bindings.DB.prepare(
      "UPDATE bookings SET courseId = ?, teacherId = ?, userId = ?, amount = ?, start = ?, end = ?, status = ?, message = ?, updatedAt = ? WHERE id = ?"
    );

    await bindings.DB.batch(
      bookings.map((b) => {
        const {
          id,
          courseId,
          teacherId,
          userId,
          amount,
          start,
          end,
          status,
          message,
        } = b;
        const date = Date.now();
        return stmt.bind(
          courseId,
          teacherId,
          userId,
          amount,
          start,
          end,
          status,
          message,
          date,
          id
        );
      })
    );

    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
}

export async function bookingDbConfirmMany(
  params: {
    bookings: Booking[];
    logsCredits: LogsCreditCreate[];
    teachers: User[];
  },
  env: Env
) {
  try {
    const { bookings, logsCredits, teachers } = params;

    const teacherStmt = env.DB.prepare(
      "UPDATE users SET credits = ?, updatedAt = ? WHERE id = ?"
    );
    const bookingStmt = env.DB.prepare(
      "UPDATE bookings SET status = 2, updatedAt = ? WHERE id = ?"
    );
    const logsCreditStmt = env.DB.prepare(
      "INSERT INTO logsCredit (title, userId, amount, details, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?)"
    );

    await env.DB.batch([
      ...teachers.map((teacher) => {
        return teacherStmt.bind(teacher.credits, Date.now(), teacher.id);
      }),
      ...bookings.map((booking) => {
        return bookingStmt.bind(Date.now(), booking.id);
      }),
      ...logsCredits.map((logsCredit) => {
        const date = Date.now();
        return logsCreditStmt.bind(
          logsCredit.title,
          logsCredit.userId,
          logsCredit.amount,
          logsCredit.details,
          date,
          date
        );
      }),
    ]);

    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
}
