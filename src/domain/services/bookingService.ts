import { Input, Output } from "valibot";
import { Env } from "../..";
import {
  Booking,
  BookingCreate,
  BookingPagination,
  BookingUpdate,
} from "../models/BookingModel";
import { LogsCreditCreate } from "../models/LogsModel";
import { User } from "../models/UserModel";
import {
  bookingDbCreate,
  bookingDbGet,
  bookingDbGetAll,
  bookingDbGetAllTotal,
  bookingDbGetOverlap,
  bookingDbUpdate,
} from "../repositories/bookingRepo";
import { logsDbCreateCredit } from "../repositories/logsRepo";
import { scheduleDbValidateBooking } from "../repositories/scheduleRepo";
import { userDbUpdate } from "../repositories/userRepo";
import { courseGet } from "./courseService";
import { roleGet } from "./roleService";
import { studentGet } from "./studentService";
import { teacherGet } from "./teacherService";
import {
  utilDateFormatter,
  utilFailedResponse,
  utilTimeFormatter,
} from "./utilService";
import { v4 as uuidv4 } from "uuid";
import { BookingCreateSchema } from "../schemas/BookingSchema";

export async function bookingGet(params: { bookingId: number }, env: Env) {
  const booking = await bookingDbGet(params, env);
  if (!booking) {
    throw utilFailedResponse("Booking not found", 404);
  }

  return booking as Booking;
}

/*
 * Can only update booking status for now.
 */
export async function bookingUpdate(
  params: BookingUpdate,
  env: Env,
  performedBy: User
) {
  const booking = await bookingGet({ bookingId: params.id }, env);
  const teacher = await teacherGet({ teacherId: booking.teacherId }, env);
  const student = await studentGet({ studentId: booking.studentId }, env);

  const bookingStart = new Date(booking.start);
  const bookingStartDate = utilDateFormatter("zh-CN", bookingStart);
  const bookingStartTime = utilTimeFormatter("zh-CN", bookingStart);

  if (booking.status === params.status) {
    throw utilFailedResponse("Cannot update to same status", 400);
  }

  if (booking.status === 4) {
    throw utilFailedResponse("Cannot update a cancelled booking", 400);
  }

  const role = await roleGet({ roleId: performedBy.roleId }, env);

  // Create LogsCredit and update teacher's credits
  const logsCredits: LogsCreditCreate[] = [];
  if (booking.status !== 3 && params.status === 3) {
    teacher.user.credits += booking.amount;
    logsCredits.push({
      title: `Class ${bookingStartDate} ${bookingStartTime} Completed`,
      details: `Class ${bookingStartDate} ${bookingStartTime} Completed`,
      userId: teacher.user.id,
      amount: booking.amount,
    });
  } else if (booking.status === 3 && params.status !== 3) {
    teacher.user.credits -= booking.amount;
    logsCredits.push({
      title: `Class ${bookingStartDate} ${bookingStartTime} - Cancelled by ${role.name}`,
      details: `Cancelled Class ${bookingStartDate} ${bookingStartTime}`,
      userId: teacher.user.id,
      amount: -booking.amount,
    });
  }

  // Update user's credits if booking is cancelled
  if (params.status === 4) {
    student.user.credits += booking.amount;
    logsCredits.push({
      title: `Class ${bookingStartDate} ${bookingStartTime} - Cancelled by ${role.name}`,
      details: `Cancelled Class ${bookingStartDate} ${bookingStartTime}`,
      userId: student.user.id,
      amount: booking.amount,
    });
  }

  // Update booking status
  booking.status = params.status;

  const logsCreditStmts = logsCredits.map((logsCredit) => {
    return logsDbCreateCredit(logsCredit, env, performedBy.id);
  });
  const studentStmt = userDbUpdate(student.user, env);
  const teacherStmt = userDbUpdate(teacher.user, env);
  const bookingStmt = bookingDbUpdate(booking, env);

  try {
    await env.DB.batch([
      ...logsCreditStmts,
      studentStmt,
      teacherStmt,
      bookingStmt,
    ]);
    return true;
  } catch (e) {
    console.log(e);
    throw utilFailedResponse("Failed to update Booking", 500);
  }
}

export async function bookingCreate(
  params: Output<typeof BookingCreateSchema>,
  env: Env,
  createdById: number
) {
  // Get all the data needed to create a booking
  const student = await studentGet({ studentId: params.studentId }, env);
  const teacher = await teacherGet({ teacherId: params.teacherId }, env);
  const course = await courseGet({ courseId: params.courseId }, env);

  // Check if the course belongs to the teacher
  if (course.teacherId !== teacher.id) {
    throw utilFailedResponse("Course does not belong to teacher", 500);
  }

  // Check if the user has enough credit
  if (params.amount > student.user.credits) {
    throw utilFailedResponse("Not enough credit", 400);
  } else {
    student.user.credits -= params.amount;
  }

  // Check if the booked schedule exists
  const validSchedule = await scheduleDbValidateBooking(params, env);
  if (!validSchedule) {
    throw utilFailedResponse("Schedule does not exist", 400);
  }

  // Check if the booking overlaps with another booking
  const overlap = await bookingDbGetOverlap(params, env);
  if (overlap) {
    throw utilFailedResponse("Booking overlaps", 400);
  }

  // Create LogsCredit
  const start = new Date(params.start).getTime();
  const startDateFormat = utilDateFormatter("zh-CN", new Date(start));
  const startTimeFormat = utilTimeFormatter("zh-CN", new Date(start));
  const logsCredit: LogsCreditCreate = {
    userId: student.userId,
    amount: -params.amount,
    title: `Class ${startDateFormat} ${startTimeFormat}`,
    details: `Class ${startDateFormat} ${startTimeFormat}`,
  };

  const bookingStmt = await bookingDbCreate(params, env, createdById);
  const userStmt = await userDbUpdate(student.user, env);
  const logsCreditStmt = await logsDbCreateCredit(logsCredit, env, createdById);

  try {
    await env.DB.batch([bookingStmt, userStmt, logsCreditStmt]);
    return true;
  } catch (e) {
    console.log(e);
    throw utilFailedResponse("Failed to create Booking", 500);
  }
}

export async function bookingCreateMany(
  params: Output<typeof BookingCreateSchema>,
  env: Env,
  advanceBooking: number,
  createdById: number
) {
  // Get all the data needed to create a booking
  const student = await studentGet({ studentId: params.studentId }, env);
  const teacher = await teacherGet({ teacherId: params.teacherId }, env);
  const course = await courseGet({ courseId: params.courseId }, env);

  // Check if the course belongs to the teacher
  if (course.teacherId !== teacher.id) {
    throw utilFailedResponse("Course does not belong to teacher", 500);
  }

  // Calculate base amount
  let start = new Date(params.start).getTime();
  let end = new Date(params.end).getTime();

  // Check if the user has enough credit
  if (params.amount > student.user.credits) {
    throw utilFailedResponse("Not enough credit", 400);
  } else {
    student.user.credits -= params.amount;
  }

  // Check if schedule exists
  const validSchedule = await scheduleDbValidateBooking(params, env);
  if (!validSchedule) {
    throw utilFailedResponse("Schedule does not exist", 400);
  }

  // Create bookings
  const bookings: Output<typeof BookingCreateSchema>[] = [];
  while (bookings.length < advanceBooking) {
    const booking = {
      ...params,
      start,
      end,
      uuid: uuidv4(),
    };

    // Check if the booking overlaps with another booking
    const overlap = await bookingDbGetOverlap(booking, env);
    if (!overlap) {
      // Add booking to array
      bookings.push(booking);
    }

    // Increment start and end time by 7 days
    start += 604800000;
    end += 604800000;
  }

  // Create LogsCredit
  const startDateFormat = utilDateFormatter("zh-CN", new Date(params.start));
  const endDateFormat = utilDateFormatter("zh-CN", new Date(end));
  const startTimeFormat = utilTimeFormatter("zh-CN", new Date(params.start));
  const endTimeFormat = utilTimeFormatter("zh-CN", new Date(params.end));
  const logsCredit: LogsCreditCreate = {
    userId: student.user.id,
    amount: -params.amount,
    title: `Recurring Class from ${startDateFormat} to ${endDateFormat} @ ${startTimeFormat} - ${endTimeFormat}`,
    details: `Recurring Class from ${startDateFormat} to ${endDateFormat} @ ${startTimeFormat} - ${endTimeFormat}`,
  };

  const bookingStmts = bookings.map((booking) => {
    return bookingDbCreate({ ...booking }, env, createdById);
  });
  const userStmt = userDbUpdate(student.user, env);
  const logsCreditStmt = logsDbCreateCredit(logsCredit, env, createdById);

  try {
    await env.DB.batch([userStmt, logsCreditStmt, ...bookingStmts]);
    return true;
  } catch (e) {
    console.log(e);
    throw utilFailedResponse("Failed to create Bookings", 500);
  }
}

export async function bookingGetAll(params: BookingPagination, env: Env) {
  const bookings = await bookingDbGetAll(params, env);
  const content: Booking[] = await Promise.all(
    bookings.map(async (booking) => {
      const teacher = await teacherGet({ teacherId: booking.teacherId }, env);
      const course = await courseGet({ courseId: booking.courseId }, env);
      const student = await studentGet({ studentId: booking.studentId }, env);

      return {
        ...booking,
        teacher,
        course,
        student,
      };
    })
  );
  const totalElements: number = await bookingDbGetAllTotal(params, env);

  return {
    content,
    totalElements,
    page: params.page,
    size: params.size,
  };
}

export async function bookingUpdateStatusMany(
  params: { bookingIds: number[]; status: number },
  env: Env,
  performedBy: User
) {
  const { content: bookingsOld } = await bookingGetAll(
    { bookingIds: params.bookingIds, page: 1, size: 10000 },
    env
  );
  const bookings: Booking[] = [];
  const users: User[] = [];
  const logsCredits: LogsCreditCreate[] = [];

  const role = await roleGet({ roleId: performedBy.roleId }, env);

  for (const booking of bookingsOld) {
    const student = await studentGet({ studentId: booking.studentId }, env);
    const teacher = await teacherGet({ teacherId: booking.teacherId }, env);

    // Check if user is not an admin
    if (performedBy.roleId !== 1) {
      // Check if the user is the owner or the teacher
      if (student.id !== performedBy.id && teacher.userId !== performedBy.id) {
        throw utilFailedResponse("Unauthorized", 403);
      }
    }

    const bookingStart = new Date(booking.start);
    const bookingStartDate = utilDateFormatter("zh-CN", bookingStart);
    const bookingStartTime = utilTimeFormatter("zh-CN", bookingStart);

    if (booking.status === 4) {
      throw utilFailedResponse("Cannot update a cancelled booking", 400);
    }

    // Check if booking is already completed
    if (booking.status === 3 && params.status !== 3) {
      teacher.user.credits -= booking.amount;
      logsCredits.push({
        title: `Class ${bookingStartDate} ${bookingStartTime} - Cancelled by ${role.name}`,
        details: `Cancelled Class ${bookingStartDate} ${bookingStartTime}`,
        userId: teacher.user.id,
        amount: -booking.amount,
      } as LogsCreditCreate);
    }

    // Check if booking will be completed
    else if (params.status === 3) {
      teacher.user.credits += booking.amount;
      logsCredits.push({
        title: `Class ${bookingStartDate} ${bookingStartTime} Completed`,
        details: `Class ${bookingStartDate} ${bookingStartTime} Completed`,
        userId: teacher.user.id,
        amount: booking.amount,
      } as LogsCreditCreate);
    }

    // If booking is cancelled, update user credit
    if (params.status === 4) {
      student.user.credits += booking.amount;
      logsCredits.push({
        title: `Class ${bookingStartDate} ${bookingStartTime} - Cancelled by ${role.name}`,
        details: `Cancelled Class ${bookingStartDate} ${bookingStartTime}`,
        userId: student.id,
        amount: booking.amount,
      } as LogsCreditCreate);
    }

    // Update booking status
    booking.status = params.status;

    // Add to array
    bookings.push(booking);
    users.push(student.user);
    users.push(teacher.user!);
  }

  const logsCreditStmts = logsCredits.map((logsCredit) => {
    return logsDbCreateCredit(logsCredit, env, performedBy.id);
  });
  const userStmts = users.map((user) => {
    return userDbUpdate(user, env);
  });
  const bookingStmts = bookings.map((booking) => {
    return bookingDbUpdate(booking, env);
  });

  try {
    await env.DB.batch([...logsCreditStmts, ...userStmts, ...bookingStmts]);
    return true;
  } catch (e) {
    console.log(e);
    throw utilFailedResponse("Failed to update bookings", 500);
  }
}
