import { Env } from "../..";
import {
  Booking,
  BookingCreate,
  BookingPagination,
} from "../models/BookingModel";
import { LogsCreditCreate } from "../models/LogsModel";
import { MessageCreate } from "../models/MessageModel";
import {
  bookingDbCancel,
  bookingDbGet,
  bookingDbGetAll,
  bookingDbGetAllTotal,
  bookingDbGetOverlap,
  bookingDbInsert,
} from "../repositories/bookingRepo";
import { scheduleDbValidateBooking } from "../repositories/scheduleRepo";
import { courseGet } from "./courseService";
import { teacherGet } from "./teacherService";
import { userGet } from "./userService";
import {
  utilDateFormatter,
  utilFailedResponse,
  utilGenerateUuid,
  utilTimeFormatter,
} from "./utilService";

export async function bookingCreate(booking: BookingCreate, env: Env) {
  // Get all the data needed to create a booking
  const user = await userGet({ userId: booking.userId }, env);
  const teacher = await teacherGet({ userId: booking.teacherId }, env);
  const course = await courseGet({ courseId: booking.courseId }, env);
  teacher.user = await userGet({ userId: booking.teacherId }, env);

  // Check if the course belongs to the teacher
  if (course.teacherId !== teacher.id) {
    throw utilFailedResponse("Course does not belong to teacher", 400);
  }

  // Check if the booked schedule exists
  const validSchedule = await scheduleDbValidateBooking(booking, env);
  if (!validSchedule) {
    throw utilFailedResponse("Schedule does not exist", 400);
  }

  // Check if the booking overlaps with another booking
  const overlap = await bookingDbGetOverlap(booking, env);
  if (overlap) {
    throw utilFailedResponse("Booking overlaps", 400);
  }

  // Check if the user has enough credit
  const start = new Date(booking.start).getTime();
  const end = new Date(booking.end).getTime();
  const amount = course.price * ((end - start) / 1800000);
  if (amount > user.credit) {
    throw utilFailedResponse("Not enough credit", 400);
  } else {
    user.credit -= amount;
  }

  // Create LogsCredit
  const startDateFormat = utilDateFormatter("zh-CN", new Date(start));
  const startTimeFormat = utilTimeFormatter("zh-CN", new Date(start));
  const logsCredit: LogsCreditCreate = {
    userId: user.id,
    amount,
    title: `Class ${startDateFormat} ${startTimeFormat}`,
    details: `Class ${startDateFormat} ${startTimeFormat}`,
  };

  // Perform transaction query
  const success = await bookingDbInsert(
    {
      booking,
      user,
      logsCredit,
    },
    env
  );
  if (!success) {
    throw utilFailedResponse("Failed to create Booking", 500);
  }

  return true;
}

export async function bookingGetAll(params: BookingPagination, env: Env) {
  const bookings = await bookingDbGetAll(params, env);
  if (!bookings) {
    throw utilFailedResponse("Cannot GET", 500);
  }

  const totalElements: null | number = await bookingDbGetAllTotal(params, env);
  if (totalElements === null) {
    throw utilFailedResponse("Cannot GET total", 500);
  }

  return {
    content: bookings.results as Booking[],
    totalElements,
    page: params.page,
    size: params.size,
  };
}

export async function bookingCancel(
  values: {
    bookingId: number;
    studentId?: number;
  },
  env: Env
) {
  const { bookingId, studentId } = values;
  const booking = await bookingDbGet({ bookingId }, env);
  if (!booking) {
    throw utilFailedResponse("Can't get booking", 400);
  }

  if (booking.status !== 1) {
    throw utilFailedResponse("Can't cancel booking", 400);
  }

  if (booking.studentId !== studentId) {
    throw utilFailedResponse("Can't get booking", 403);
  }

  if (booking.start < Date.now() + 60 * 60 * 6 * 1000) {
    throw utilFailedResponse(
      "Can't cancel booking before 6 hours of the starting class.",
      400
    );
  }

  const student = await userGet({ userId: studentId ?? 0 }, env);

  student.credit += booking.amount ?? 0;

  const logs: LogsCreditCreate = {
    title: "Cancelled Class",
    senderId: 1,
    receiverId: booking.studentId,
    amount: booking.amount ?? 0,
    status: 2,
    uuid: utilGenerateUuid(),
  };

  const cancel = await bookingDbCancel(booking, student, logs, env);

  if (!cancel) {
    throw utilFailedResponse("Was not able to cancel booking", 500);
  }

  return true;
}
