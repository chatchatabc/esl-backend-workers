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
  bookingDbCancel,
  bookingDbComplete,
  bookingDbCreate,
  bookingDbCreateMany,
  bookingDbGet,
  bookingDbGetAll,
  bookingDbGetAllTotal,
  bookingDbGetOverlap,
  bookingDbUpdate,
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

/*
 * Can only update booking status for now.
 */
export async function bookingUpdate(params: BookingUpdate, env: Env) {
  const booking = await bookingGet({ bookingId: params.id }, env);
  const teacher = await teacherGet({ teacherId: booking.teacherId }, env);
  teacher.user = await userGet({ userId: teacher.userId }, env);
  const user = await userGet({ userId: booking.userId }, env);

  if (booking.status === params.status) {
    throw utilFailedResponse("Cannot update to same status", 400);
  }

  if (booking.status === 4) {
    throw utilFailedResponse("Cannot update a cancelled booking", 400);
  }

  // Create LogsCredit and update teacher's credits
  const logsCredits: LogsCreditCreate[] = [];
  if (booking.status !== 3 && params.status === 3) {
    teacher.user.credits += booking.amount;
    logsCredits.push({
      title: "Class Completed",
      details: `Class ${utilDateFormatter(
        "zh-CN",
        new Date(booking.start)
      )} ${utilTimeFormatter("zh-CN", new Date(booking.start))} Completed`,
      userId: teacher.user.id,
      amount: booking.amount,
    });
  } else if (booking.status === 3 && params.status !== 3) {
    teacher.user.credits -= booking.amount;
    logsCredits.push({
      title: "Cancelled Class",
      details: `Cancelled Class ${utilDateFormatter(
        "zh-CN",
        new Date(booking.start)
      )} ${utilTimeFormatter("zh-CN", new Date(booking.start))}`,
      userId: teacher.user.id,
      amount: -booking.amount,
    });
  }

  // Update user's credits if booking is cancelled
  if (params.status === 4) {
    user.credits += booking.amount;
    logsCredits.push({
      title: "Cancelled Class",
      details: `Cancelled Class ${utilDateFormatter(
        "zh-CN",
        new Date(booking.start)
      )} ${utilTimeFormatter("zh-CN", new Date(booking.start))}`,
      userId: user.id,
      amount: booking.amount,
    });
  }

  // Update booking status
  booking.status = params.status;

  // Perform transaction query
  const query = await bookingDbUpdate(
    {
      booking,
      user,
      teacher: teacher.user,
      logsCredits,
    },
    env
  );
  if (!query) {
    throw utilFailedResponse("Failed to update Booking", 500);
  }

  return true;
}

export async function bookingCreate(
  params: Omit<BookingCreate, "amount"> & {
    amount: number | null;
  },
  env: Env
) {
  // Get all the data needed to create a booking
  const user = await userGet({ userId: params.userId }, env);
  const teacher = await teacherGet({ teacherId: params.teacherId }, env);
  const course = await courseGet({ courseId: params.courseId }, env);
  teacher.user = await userGet({ userId: params.teacherId }, env);

  // Check if the course belongs to the teacher
  if (course.teacherId !== teacher.id) {
    throw utilFailedResponse("Course does not belong to teacher", 500);
  }

  // Check if the user has enough credit
  const start = new Date(params.start).getTime();
  const end = new Date(params.end).getTime();
  const amount = (params.amount ?? course.price) * ((end - start) / 1800000);
  if (amount > user.credits) {
    throw utilFailedResponse("Not enough credit", 400);
  } else {
    user.credits -= amount;
  }

  // Create booking
  const booking = { ...params, amount };

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

export async function bookingCreateMany(
  params: Omit<BookingCreate, "amount"> & {
    amount: number | null;
    advanceBooking: number;
  },
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

  // Calculate base amount
  let start = new Date(params.start).getTime();
  let end = new Date(params.end).getTime();
  const amount = (params.amount ?? course.price) * ((end - start) / 1800000);
  const totalAmount = amount * params.advanceBooking;

  // Check if the user has enough credit
  if (totalAmount > user.credits) {
    throw utilFailedResponse("Not enough credit", 400);
  } else {
    user.credits -= totalAmount;
  }

  // Check if schedule exists
  const validSchedule = await scheduleDbValidateBooking(
    { ...params, amount },
    env
  );
  if (!validSchedule) {
    throw utilFailedResponse("Schedule does not exist", 400);
  }

  // Create bookings
  const bookings: BookingCreate[] = [];
  while (bookings.length < params.advanceBooking) {
    const booking = { ...params, amount, start, end };

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
    userId: user.id,
    amount: -totalAmount,
    title: `Recurring Class from ${startDateFormat} to ${endDateFormat} @ ${startTimeFormat} - ${endTimeFormat}`,
    details: `Recurring Class from ${startDateFormat} to ${endDateFormat} @ ${startTimeFormat} - ${endTimeFormat}`,
  };

  // Perform transaction query
  const query = await bookingDbCreateMany(
    {
      bookings,
      user,
      logsCredit,
    },
    env
  );
  if (!query) {
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
  const teacher = await teacherGet({ teacherId: booking.teacherId }, env);

  // Check if user is the owner
  if (booking.userId !== userId) {
    throw utilFailedResponse("Unauthorized", 403);
  }

  // Update user credit
  const user = await userGet({ userId }, env);
  user.credits += booking.amount;

  // Check if booking is already completed
  if (booking.status === 3) {
    // Update teacher credit
    teacher.user = await userGet({ userId: teacher.userId }, env);
    teacher.user.credits -= booking.amount;
  }

  // Create LogsCredit
  const logsCredit: LogsCreditCreate = {
    title: "Cancelled Class",
    details: `Cancelled Class ${utilDateFormatter(
      "zh-CN",
      new Date(booking.start)
    )} ${utilTimeFormatter("zh-CN", new Date(booking.start))}`,
    userId: user.id,
    amount: booking.amount,
  };

  // Perform transaction query
  const query = await bookingDbCancel(
    { booking, user, logsCredit, teacher: teacher.user },
    env
  );
  if (!query) {
    throw utilFailedResponse("Was not able to cancel booking", 500);
  }

  return true;
}

export async function bookingComplete(
  params: { bookingId: number; userId: number },
  env: Env
) {
  const { bookingId, userId } = params;
  const booking = await bookingGet({ bookingId }, env);

  // Check if user is the owner
  if (booking.userId !== userId) {
    throw utilFailedResponse("Unauthorized", 403);
  }

  // Update teacher credit
  const teacher = await teacherGet({ teacherId: booking.teacherId }, env);
  teacher.user = await userGet({ userId: teacher.userId }, env);
  teacher.user.credits += booking.amount;

  // Create LogsCredit
  const logsCredit: LogsCreditCreate = {
    title: "Class Completed",
    details: `Class ${utilDateFormatter(
      "zh-CN",
      new Date(booking.start)
    )} ${utilTimeFormatter("zh-CN", new Date(booking.start))} Completed`,
    userId: teacher.user.id,
    amount: booking.amount,
  };

  console.log(logsCredit);

  // Perform transaction query
  const query = await bookingDbComplete(
    { booking, user: teacher.user, logsCredit },
    env
  );
  if (!query) {
    throw utilFailedResponse("Was not able to complete booking", 500);
  }

  return true;
}
