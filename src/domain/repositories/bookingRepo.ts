import { safeParse } from "valibot";
import { Env } from "../..";
import {
  Booking,
  BookingCreate,
  BookingPagination,
} from "../models/BookingModel";
import { LogsCreditCreate } from "../models/LogsModel";
import { MessageCreate } from "../models/MessageModel";
import { User } from "../models/UserModel";
import {
  utilFailedResponse,
  utilQueryAddWhere,
  utilQueryCreate,
  utilQuerySelect,
} from "../services/utilService";
import { BookingCreateSchema } from "../schemas/BookingSchema";
import { bookingColumns } from "../services/bookingService";
import { userColumns } from "../services/userService";
import { roleColumns } from "../services/roleService";
import { courseColumns } from "../services/courseService";
import { teacherColumns } from "../services/teacherService";
import { studentColumns } from "../services/studentService";

export function bookingDbCreate(
  params: BookingCreate,
  env: Env,
  createdById: number
) {
  const data = safeParse(BookingCreateSchema, params);
  if (!data.success) {
    throw utilFailedResponse("Invalid booking data", 400);
  }

  const { fields, values, queryParams } = utilQueryCreate(data.data, "BOOKING");
  let query = "INSERT INTO bookings";
  const now = Date.now();
  query += ` (${fields}, createdAt, updatedAt, createdById) VALUES (${values}, ?, ?, ?)`;
  queryParams.push(now, now, createdById);

  try {
    const stmt = env.DB.prepare(query).bind(...queryParams);
    return stmt;
  } catch (e) {
    console.log(e);
    throw utilFailedResponse("Unable to generate user update statement", 500);
  }
}

export async function bookingDbGetAll(params: BookingPagination, env: Env) {
  const {
    studentId,
    page,
    size,
    status,
    teacherId,
    sort,
    day,
    start,
    end,
    bookingIds,
  } = params;

  const queryParams = [];
  let querySelect = utilQuerySelect({
    bookings: bookingColumns(),
    courses: courseColumns(),
    teachers: teacherColumns(),
    students: studentColumns(),
    teacherUsers: userColumns(),
    teacherRoles: roleColumns(),
    studentUsers: userColumns(),
    studentRoles: roleColumns(),
  });
  const queryFrom =
    "bookings LEFT JOIN courses ON bookings.courseId = courses.id LEFT JOIN students ON bookings.studentId = students.id LEFT JOIN users AS studentUsers ON students.userId = studentUsers.id LEFT JOIN roles AS studentRoles ON studentUsers.roleId = studentRoles.id LEFT JOIN teachers ON bookings.teacherId = teachers.id LEFT JOIN users AS teacherUsers ON teachers.userId = teacherUsers.id LEFT JOIN roles AS teacherRoles ON teacherUsers.roleId = teacherRoles.id";
  let queryWhere = "";
  let queryEnd = " ORDER BY createdAt DESC";

  if (studentId && teacherId) {
    queryWhere += queryWhere ? " AND " : "";
    queryWhere += "(bookings_studentId = ? OR bookings_teacherId = ?)";
    queryParams.push(studentId, teacherId);
  } else if (teacherId) {
    queryWhere += queryWhere ? " AND " : "";
    queryWhere += "bookings_teacherId = ?";
    queryParams.push(teacherId);
  } else if (studentId) {
    queryWhere += queryWhere ? " AND " : "";
    queryWhere += "bookings_studentId = ?";
    queryParams.push(studentId);
  }

  if (status) {
    queryWhere += queryWhere ? " AND " : "";
    queryWhere += "bookings_status IN (";
    queryWhere += status.map(() => "?").join(",");
    queryWhere += ")";
    queryParams.push(...status);
  }

  if (day !== undefined) {
    queryWhere += queryWhere ? " AND " : "";
    queryWhere +=
      "strftime('%w', datetime(bookings_start / 1000, 'unixepoch', '+8 hours')) = ?";
    queryParams.push(String(day));
  }

  if (start !== undefined) {
    queryWhere += queryWhere ? " AND " : "";
    queryWhere += "bookings_start > ?";
    queryParams.push(start);
  }

  if (end !== undefined) {
    queryWhere += queryWhere ? " AND " : "";
    queryWhere += "bookings_end < ?";
    queryParams.push(end);
  }

  if (bookingIds) {
    queryWhere += queryWhere ? " AND " : "";
    queryWhere += "bookings_id IN (";
    queryWhere += bookingIds.map(() => "?").join(",");
    queryWhere += ")";
    queryParams.push(...bookingIds);
  }

  if (sort) {
    const sortArr = sort.split(",");
    const sortField = sortArr[0];
    const sortType = (sortArr[1] || "DESC").toUpperCase();
    queryEnd = ` ORDER BY ${sortField} ${sortType}`;
  }
  queryEnd += " LIMIT ?, ?";
  queryParams.push((page - 1) * size, size);

  let query = `SELECT ${querySelect} FROM ${queryFrom}`;
  if (queryWhere) {
    query += " WHERE " + queryWhere;
  }
  query += queryEnd;

  try {
    const results = await env.DB.prepare(query)
      .bind(...queryParams)
      .all();
    const bookings = results.results.map((booking) => {
      const data = {
        course: {
          teacher: {
            user: {
              role: {} as any,
            } as any,
          } as any,
        } as any,
        teacher: {
          user: {
            role: {} as any,
          } as any,
        } as any,
        student: {
          user: {
            role: {} as any,
          } as any,
        } as any,
      } as any;
      Object.keys(booking).forEach((key) => {
        const value = booking[key];
        if (key.startsWith("courses_")) {
          const newKey = key.replace("courses_", "");
          data.course[newKey] = value;
        } else if (key.startsWith("teachers_")) {
          const newKey = key.replace("teachers_", "");
          data.teacher[newKey] = value;
          data.course.teacher[newKey] = value;
        } else if (key.startsWith("students_")) {
          const newKey = key.replace("students_", "");
          data.student[newKey] = value;
        } else if (key.startsWith("teacherUsers_")) {
          const newKey = key.replace("teacherUsers_", "");
          data.course.teacher.user[newKey] = value;
          data.teacher.user[newKey] = value;
        } else if (key.startsWith("studentUsers_")) {
          const newKey = key.replace("studentUsers_", "");
          data.student.user[newKey] = value;
        } else if (key.startsWith("teacherRoles_")) {
          const newKey = key.replace("teacherRoles_", "");
          data.course.teacher.user.role[newKey] = value;
          data.teacher.user.role[newKey] = value;
        } else if (key.startsWith("studentRoles_")) {
          const newKey = key.replace("studentRoles_", "");
          data.student.user.role[newKey] = value;
        } else if (key.startsWith("bookings_")) {
          const newKey = key.replace("bookings_", "");
          data[newKey] = value;
        }
      });
      return data as Booking;
    });

    return bookings;
  } catch (e) {
    console.log(e);
    throw utilFailedResponse("Cannot get bookings", 500);
  }
}

export async function bookingDbGetAllTotal(
  params: BookingPagination,
  env: Env
) {
  const { studentId, status, teacherId, day } = params;

  const queryParams = [];
  let query = "SELECT COUNT(*) AS total FROM bookings";
  let whereQuery = "";

  if (studentId && teacherId) {
    whereQuery += whereQuery ? " AND " : "";
    whereQuery += "(studentId = ? OR teacherId = ?)";
    queryParams.push(studentId, teacherId);
  } else if (teacherId) {
    whereQuery += whereQuery ? " AND " : "";
    whereQuery += "teacherId = ?";
    queryParams.push(teacherId);
  } else if (studentId) {
    whereQuery += whereQuery ? " AND " : "";
    whereQuery += "studentId = ?";
    queryParams.push(studentId);
  }

  if (status) {
    whereQuery += whereQuery ? " AND " : "";
    whereQuery += "status IN (";
    whereQuery += status.map(() => "?").join(",");
    whereQuery += ")";
    queryParams.push(...status);
  }

  if (day !== undefined) {
    whereQuery += whereQuery ? " AND " : "";
    whereQuery +=
      "strftime('%w', datetime(start / 1000, 'unixepoch', '+8 hours')) = ?";
    queryParams.push(String(day));
  }

  if (whereQuery) {
    query += " WHERE " + whereQuery;
  }

  try {
    const results = await env.DB.prepare(query)
      .bind(...queryParams)
      .first<number>("total");
    return results ?? 0;
  } catch (e) {
    console.log(e);
    throw utilFailedResponse("Cannot get total bookings", 500);
  }
}

export async function bookingDbGet(params: { bookingId: number }, env: Env) {
  const { bookingId } = params;

  let querySelect = utilQuerySelect({
    bookings: bookingColumns(),
    courses: courseColumns(),
    teachers: teacherColumns(),
    students: studentColumns(),
    teacherUsers: userColumns(),
    teacherRoles: roleColumns(),
    studentUsers: userColumns(),
    studentRoles: roleColumns(),
  });
  let queryWhere = "";
  const queryFrom =
    "bookings LEFT JOIN courses ON bookings.courseId = courses.id LEFT JOIN students ON bookings.studentId = students.id LEFT JOIN users AS studentUsers ON students.userId = studentUsers.id LEFT JOIN roles AS studentRoles ON studentUsers.roleId = studentRoles.id LEFT JOIN teachers ON bookings.teacherId = teachers.id LEFT JOIN users AS teacherUsers ON teachers.userId = teacherUsers.id LEFT JOIN roles AS teacherRoles ON teacherUsers.roleId = teacherRoles.id";
  const queryParams = [];

  if (bookingId) {
    queryWhere += queryWhere ? " AND " : "";
    queryWhere += "id = ?";
    queryParams.push(bookingId);
  }

  let query = `SELECT ${querySelect} FROM ${queryFrom}`;
  if (queryWhere) {
    query += " WHERE " + queryWhere;
  }
  query += " LIMIT 1";

  try {
    const stmt = env.DB.prepare(query).bind(...queryParams);
    const booking = await stmt.first();
    if (!booking) {
      return null;
    }
    const data = {
      course: {
        teacher: {
          user: {
            role: {} as any,
          } as any,
        } as any,
      } as any,
      teacher: {
        user: {
          role: {} as any,
        } as any,
      } as any,
      student: {
        user: {
          role: {} as any,
        } as any,
      } as any,
    } as any;
    Object.keys(booking).forEach((key) => {
      const value = booking[key];
      if (key.startsWith("courses_")) {
        const newKey = key.replace("courses_", "");
        data.course[newKey] = value;
      } else if (key.startsWith("teachers_")) {
        const newKey = key.replace("teachers_", "");
        data.teacher[newKey] = value;
        data.course.teacher[newKey] = value;
      } else if (key.startsWith("students_")) {
        const newKey = key.replace("students_", "");
        data.student[newKey] = value;
      } else if (key.startsWith("teacherUsers_")) {
        const newKey = key.replace("teacherUsers_", "");
        data.course.teacher.user[newKey] = value;
        data.teacher.user[newKey] = value;
      } else if (key.startsWith("studentUsers_")) {
        const newKey = key.replace("studentUsers_", "");
        data.student.user[newKey] = value;
      } else if (key.startsWith("teacherRoles_")) {
        const newKey = key.replace("teacherRoles_", "");
        data.course.teacher.user.role[newKey] = value;
        data.teacher.user.role[newKey] = value;
      } else if (key.startsWith("studentRoles_")) {
        const newKey = key.replace("studentRoles_", "");
        data.student.user.role[newKey] = value;
      } else if (key.startsWith("bookings_")) {
        const newKey = key.replace("bookings_", "");
        data[newKey] = value;
      }
    });
    return data as Booking;
  } catch (e) {
    console.log(e);
    throw utilFailedResponse("Cannot get booking", 500);
  }
}

export async function bookingDbCancel(
  params: {
    booking: Booking;
    user: User;
    logsCredit: LogsCreditCreate;
    teacher?: User;
  },
  env: Env
) {
  const { booking, user, logsCredit } = params;
  const date = Date.now();

  try {
    const userStmt = env.DB.prepare(
      "UPDATE users SET credits = ?, updatedAt = ? WHERE id = ?"
    );
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
    const stmts = [
      userStmt.bind(user.credits, date, user.id),
      bookingStmt,
      logsCreditStmt,
    ];

    if (params.teacher) {
      stmts.push(
        userStmt.bind(params.teacher.credits, date, params.teacher.id)
      );
    }
    await env.DB.batch(stmts);

    return true;
  } catch (e) {
    console.log(e);
    return null;
  }
}

export async function bookingDbComplete(
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
      "UPDATE bookings SET status = 3, updatedAt = ? WHERE id = ?"
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
  let query = "SELECT * FROM bookings";
  if (status) {
    query = utilQueryAddWhere(query, "status = ?");
    queryParams.push(status);
  }
  query = utilQueryAddWhere(query, "start >= ? AND start <= ?");
  queryParams.push(start, end);

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
  const { start, end, teacherId, studentId } = values;
  try {
    const stmt = env.DB.prepare(
      "SELECT COUNT(*) AS total FROM bookings WHERE ((start <= ? AND end > ?) OR (start < ? AND end >= ?)) AND (teacherId = ? OR studentId = ?) AND status = 1"
    ).bind(start, start, end, end, teacherId, studentId);
    const total = await stmt.first("total");
    return total ?? 0;
  } catch (e) {
    console.log(e);
    throw utilFailedResponse("Cannot get overlap bookings", 500);
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

export async function bookingDbConfirmMany(
  params: {
    bookings: Booking[];
    logsCredits: LogsCreditCreate[];
    teachers: User[];
    messages: MessageCreate[];
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
    const messageStmt = env.DB.prepare(
      "INSERT INTO messages (sendAt, userId, status, cron, messageTemplateId, phone, templateValues, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"
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
      ...params.messages.map((message) => {
        const date = Date.now();
        return messageStmt.bind(
          message.sendAt,
          message.userId,
          message.status,
          message.cron,
          message.messageTemplateId,
          message.phone,
          message.templateValues,
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

export function bookingDbUpdate(params: Booking, env: Env) {
  const { id } = params;
  const date = new Date().getTime();

  let query = "UPDATE bookings";
  let querySet = "";
  const queryParams = [];

  Object.keys(params).forEach((key) => {
    const value = params[key as keyof Booking];
    if (value !== undefined && typeof value !== "object") {
      querySet += querySet ? ", " : "";
      querySet += `${key} = ?`;
      queryParams.push(params[key as keyof Booking]);
    }
  });

  if (!querySet) {
    throw utilFailedResponse("No update data for booking", 400);
  } else {
    querySet += `, updatedAt = ?`;
    queryParams.push(date);

    query += ` SET ${querySet}`;
    query += ` WHERE id = ?`;
    queryParams.push(id);
  }

  try {
    const stmt = env.DB.prepare(query).bind(...queryParams);
    return stmt;
  } catch (e) {
    console.log(e);
    throw utilFailedResponse(
      "Unable to generate booking update statement",
      500
    );
  }
}

export async function bookingDbUpdateStatusMany(
  params: {
    bookings: Booking[];
    users: User[];
    logsCredits: LogsCreditCreate[];
  },
  env: Env
) {
  const { bookings, users, logsCredits } = params;
  const date = Date.now();

  try {
    const userStmt = env.DB.prepare(
      "UPDATE users SET credits = ?, updatedAt = ? WHERE id = ?"
    );
    const bookingStmt = env.DB.prepare(
      "UPDATE bookings SET status = ?, updatedAt = ? WHERE id = ?"
    );
    const logsCreditStmt = env.DB.prepare(
      "INSERT INTO logsCredit (title, userId, amount, details, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?)"
    );

    await env.DB.batch([
      ...users.map((user) => {
        return userStmt.bind(user.credits, date, user.id);
      }),
      ...bookings.map((booking) => {
        return bookingStmt.bind(booking.status, date, booking.id);
      }),
      ...logsCredits.map((logsCredit) => {
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
    return null;
  }
}
