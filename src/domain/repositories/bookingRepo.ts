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

export async function bookingDbTotalByUser(id: number, env: Env) {
  try {
    const stmt = env.DB.prepare(
      "SELECT COUNT(*) AS total FROM bookings WHERE teacherId = ? OR studentId = ?"
    ).bind(id, id);
    const total = await stmt.first("total");
    return total as number;
  } catch (e) {
    console.log(e);
    return null;
  }
}

export async function bookingDbGetAllByUser(
  params: BookingPagination,
  env: Env
) {
  const { userId, page, size, status } = params;

  const queryParams = [userId, userId];
  let query = "SELECT * FROM bookings WHERE (teacherId = ? OR studentId = ?)";
  if (status) {
    query += " AND status = ?";
    queryParams.push(status);
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

export async function bookingDbGetAll(params: BookingPagination, env: Env) {
  const { userId, page, size, status } = params;

  console.log(params);
  const queryParams = [];
  let query = "SELECT * FROM bookings";
  if (userId) {
    query = utilQueryAddWhere(query, "teacherId = ? OR studentId = ?");
    queryParams.push(userId, userId);
  }
  if (status) {
    query = utilQueryAddWhere(query, "status = ?");
    queryParams.push(status);
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
    query = utilQueryAddWhere(query, "teacherId = ? OR studentId = ?");
    queryParams.push(userId, userId);
  }
  if (status) {
    query = utilQueryAddWhere(query, "status = ?");
    queryParams.push(status);
  }

  try {
    const results = await env.DB.prepare(query)
      .bind(...queryParams)
      .first("total");
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
  booking: Booking,
  teacher: User,
  student: User,
  logsCredit: LogsCreditCreate,
  env: Env
) {
  const date = Date.now();

  try {
    const studentStmt = env.DB.prepare(
      "UPDATE users SET credit = ?, updatedAt = ? WHERE id = ?"
    ).bind(student.credit, date, student.id);
    const teacherStmt = env.DB.prepare(
      "UPDATE users SET credit = ?, updatedAt = ? WHERE id = ?"
    ).bind(teacher.credit, date, teacher.id);
    const bookingStmt = env.DB.prepare(
      "UPDATE bookings SET status = 2, updatedAt = ? WHERE id = ?"
    ).bind(date, booking.id);
    const logsCreditStmt = env.DB.prepare(
      "INSERT INTO logsCredit (title, senderId, receiverId, amount, status, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)"
    ).bind(
      logsCredit.title,
      logsCredit.senderId,
      logsCredit.receiverId,
      logsCredit.amount,
      logsCredit.status,
      date,
      date
    );

    await env.DB.batch([studentStmt, teacherStmt, bookingStmt, logsCreditStmt]);

    return true;
  } catch (e) {
    console.log(e);
    return null;
  }
}

export async function bookingDbInsert(
  params: {
    booking: BookingCreate;
    teacher: User;
    student: User;
    logsCredit: LogsCreditCreate;
    message: MessageCreate;
  },
  bindings: Env
) {
  const { booking, teacher, student, logsCredit, message } = params;

  const {
    start = null,
    end = null,
    teacherId = null,
    studentId = null,
    status = null,
  } = booking;
  const date = Date.now();

  try {
    const userStmt = bindings.DB.prepare(
      "UPDATE users SET credit = ? WHERE id = ?"
    ).bind(student.credit, student.id);
    const teacherStmt = bindings.DB.prepare(
      "UPDATE users SET credit = ? WHERE id = ?"
    ).bind(teacher.credit, teacher.id);
    const bookingStmt = bindings.DB.prepare(
      "INSERT INTO bookings (start, end, teacherId, status, studentId, amount, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
    ).bind(
      start,
      end,
      teacherId,
      status,
      studentId,
      logsCredit.amount,
      date,
      date
    );
    const logsStmt = bindings.DB.prepare(
      "INSERT INTO logsCredit (title, senderId, receiverId, amount, status, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)"
    ).bind(
      logsCredit.title,
      studentId,
      teacherId,
      logsCredit.amount,
      logsCredit.status,
      date,
      date
    );
    const messageStmt = bindings.DB.prepare(
      "INSERT INTO messages (senderId, receiverId, title, message, status, cron, sendAt, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"
    ).bind(
      message.senderId,
      message.receiverId,
      message.title,
      message.message,
      message.status,
      message.cron,
      message.sendAt,
      date,
      date
    );

    await bindings.DB.batch([
      bookingStmt,
      userStmt,
      logsStmt,
      teacherStmt,
      messageStmt,
    ]);
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
  params: { start: number; end: number },
  bindings: Env
) {
  const { start, end } = params;
  try {
    const stmt = bindings.DB.prepare(
      "SELECT * FROM bookings WHERE (start >= ? AND start <= ?) AND status = 1"
    ).bind(start, end);
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

export async function bookingDbGetOverlap(
  values: BookingCreate & { id?: number },
  env: Env
) {
  const { start, end, teacherId, studentId, id } = values;
  try {
    const stmt = env.DB.prepare(
      "SELECT COUNT(*) AS total FROM bookings WHERE ((start <= ? AND end > ?) OR (start < ? AND end >= ?)) AND (teacherId = ? OR studentId = ?) AND id != ? AND status = 1"
    ).bind(start, start, end, end, teacherId, studentId, id ?? 0);
    const total = await stmt.first("total");
    return total as number;
  } catch (e) {
    console.log(e);
    return 0;
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
      "UPDATE bookings SET start = ?, end = ?, teacherId = ?, status = ?, studentId = ?, updatedAt = ? WHERE id = ?"
    );

    await bindings.DB.batch(
      bookings.map((b) => {
        const { start, end, teacherId, studentId, status, id } = b;
        const date = Date.now();
        return stmt.bind(start, end, teacherId, status, studentId, date, id);
      })
    );

    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
}
