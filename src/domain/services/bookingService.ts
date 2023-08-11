import { Env } from "../..";
import { Booking, BookingCreate } from "../models/BookingModel";
import { LogsCreditCreate } from "../models/LogsModel";
import { MessageCreate } from "../models/MessageModel";
import {
  bookingDbCancel,
  bookingDbGet,
  bookingDbGetAllByUser,
  bookingDbGetOverlap,
  bookingDbGetTotalByUser,
  bookingDbInsert,
} from "../repositories/bookingRepo";
import { scheduleDbValidateBooking } from "../repositories/scheduleRepo";
import { teacherGet } from "./teacherService";
import { userGet } from "./userService";
import {
  utilDateFormatter,
  utilFailedResponse,
  utilTimeFormatter,
} from "./utilService";

export async function bookingCreate(values: BookingCreate, env: Env) {
  if (values.studentId === values.teacherId) {
    throw utilFailedResponse("Cannot booked own schedule", 400);
  }

  const student = await userGet({ userId: values.studentId ?? 0 }, env);
  if (!student) {
    throw utilFailedResponse("Student does not exist", 400);
  }

  const teacher = await teacherGet({ userId: values.teacherId }, env);
  if (!teacher) {
    throw utilFailedResponse("Teacher does not exist", 400);
  }

  teacher.user = await userGet({ userId: values.teacherId }, env);
  if (!teacher.user) {
    throw utilFailedResponse("Teacher does not exist", 400);
  }

  const validSchedule = await scheduleDbValidateBooking(values, env);
  if (!validSchedule) {
    throw utilFailedResponse("Schedule does not exist", 400);
  }

  const overlap = await bookingDbGetOverlap(values, env);
  if (overlap) {
    throw utilFailedResponse("Booking overlaps", 400);
  }

  const dateTimeFormatter = new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  });
  const start = new Date(values.start).getTime();
  const end = new Date(values.end).getTime();
  const price = teacher.price * ((end - start) / 1800000);
  if (price > student.credit) {
    throw utilFailedResponse("Not enough credit", 400);
  }

  const logsCredit = {
    senderId: student.id,
    receiverId: teacher.user.id,
    amount: price,
    title: `Class ${dateTimeFormatter.format(new Date(values.start))}`,
    status: 1,
  };

  teacher.user.credit += price;
  student.credit -= price;

  const message: MessageCreate = {
    senderId: 1,
    receiverId: student.id,
    title: "Class Reminder",
    message: `【恰恰英语】您好，${student.firstName}！\n提醒您：您与${
      teacher.alias
    }的课程安排如下：\n日期：${utilDateFormatter(
      "zh-CN",
      new Date(start)
    )}\n时间：${utilTimeFormatter(
      "zh-CN",
      new Date(start)
    )}\n课程：口语练习\n请您按时准备好，参加课程。`,
    status: 1,
    cron: "0 0 1 1 1",
    sendAt: values.start - 10 * 60 * 1000,
  };

  const success = await bookingDbInsert(
    {
      booking: values,
      teacher: teacher.user,
      student,
      logsCredit,
      message,
    },
    env
  );
  if (!success) {
    throw utilFailedResponse("Failed to create Booking", 500);
  }

  return true;
}

export async function bookingGetAllByUser(
  params: { userId: number; page: number; size: number },
  env: Env
) {
  const { page, size, userId } = params;

  const bookings = await bookingDbGetAllByUser(params, env);
  if (!bookings) {
    throw utilFailedResponse("Cannot GET", 500);
  }

  const totalElements = await bookingDbGetTotalByUser({ userId }, env);
  if (totalElements === null) {
    throw utilFailedResponse("Cannot GET total", 500);
  }

  return {
    content: bookings.results as Booking[],
    totalElements,
    page,
    size,
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
  const teacher = await userGet({ userId: booking.teacherId ?? 0 }, env);

  student.credit += booking.amount ?? 0;
  teacher.credit -= booking.amount ?? 0;

  const logs: LogsCreditCreate = {
    title: "Cancelled Class",
    senderId: teacher.id,
    receiverId: student.id,
    amount: booking.amount ?? 0,
    status: 1,
  };

  const cancel = await bookingDbCancel(booking, teacher, student, logs, env);

  if (!cancel) {
    throw utilFailedResponse("Was not able to cancel booking", 500);
  }

  return true;
}
