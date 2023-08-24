import { Env } from "../..";
import {
  Booking,
  BookingCreate,
  BookingPagination,
} from "../models/BookingModel";
import { LogsCreditCreate } from "../models/LogsModel";
import {
  bookingDbCancel,
  bookingDbCreate,
  bookingDbGet,
  bookingDbGetAll,
  bookingDbGetAllTotal,
  bookingDbGetOverlap,
} from "../repositories/bookingRepo";
import { scheduleDbValidateBooking } from "../repositories/scheduleRepo";
import { courseGet } from "./courseService";
import { teacherGet, teacherValidateCourse } from "./teacherService";
import { userGet } from "./userService";
import {
  utilDateFormatter,
  utilFailedResponse,
  utilTimeFormatter,
} from "./utilService";

export async function bookingGet(params: { bookingId: number }, env: Env) {
  const booking = await bookingDbGet(params, env);
  if (!booking) {
    throw utilFailedResponse("Cannot GET", 500);
  }

  return booking;
}

export async function bookingCreate(
  params: Omit<BookingCreate, "amount"> & { amount: number | null },
  env: Env
) {
  // Get all the data needed to create a booking
  const user = await userGet({ userId: params.userId }, env);
  const teacher = await teacherGet({ teacherId: params.teacherId }, env);
  const course = await courseGet({ courseId: params.courseId }, env);
  teacher.user = await userGet({ userId: params.teacherId }, env);

  // Check if the course belongs to the teacher
  const courseValid = await teacherValidateCourse(
    { teacherId: teacher.id, courseId: course.id },
    env
  );
  if (!courseValid) {
    throw utilFailedResponse("Course does not belong to teacher", 400);
  }

  // Check if the user has enough credit
  const start = new Date(params.start).getTime();
  const end = new Date(params.end).getTime();
  const amount = course.price * ((end - start) / 1800000);
  if (amount > user.credits) {
    throw utilFailedResponse("Not enough credit", 400);
  } else {
    user.credits -= amount;
  }

  // Create booking
  const booking = { ...params, amount: params.amount ?? amount };

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

  // Create LogsCredit
  const startDateFormat = utilDateFormatter("zh-CN", new Date(start));
  const startTimeFormat = utilTimeFormatter("zh-CN", new Date(start));
  const logsCredit: LogsCreditCreate = {
    userId: user.id,
    amount: -amount,
    title: `Class ${startDateFormat} ${startTimeFormat}`,
    details: `Class ${startDateFormat} ${startTimeFormat}`,
  };

  // Perform transaction query
  const success = await bookingDbCreate(
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
    userId: number;
  },
  env: Env
) {
  const { bookingId, userId } = values;
  const booking = await bookingGet({ bookingId }, env);

  // Check if booking is cancellable
  if (booking.status !== 1) {
    throw utilFailedResponse("Booking is not cancellable anymore.", 400);
  }

  // Check if user is the owner
  if (booking.userId !== userId) {
    throw utilFailedResponse("Unauthorized", 403);
  }

  // Update user credit
  const user = await userGet({ userId }, env);
  user.credits += booking.amount;

  // Create LogsCredit
  const logsCredit: LogsCreditCreate = {
    title: "Cancelled Class",
    details: `Cancelled Class ${utilDateFormatter(
      "zh-CN",
      new Date(booking.start)
    )} ${utilTimeFormatter("zh-CN", new Date(booking.start))}`,
    userId: 1,
    amount: booking.amount,
  };

  // Perform transaction query
  const query = await bookingDbCancel({ booking, user, logsCredit }, env);
  if (!query) {
    throw utilFailedResponse("Was not able to cancel booking", 500);
  }

  return true;
}
