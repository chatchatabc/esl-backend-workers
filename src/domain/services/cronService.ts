import { Env } from "../..";
import {
  bookingDbGetAllByDateEnd,
  bookingDbGetAllByDateStart,
  bookingDbUpdateMany,
} from "../repositories/bookingRepo";
import { userDbGet } from "../repositories/userRepo";

export async function cronRemindClass(env: Env) {
  const start = Date.now();
  const end = start + 20 * 60 * 1000;

  const bookings = await bookingDbGetAllByDateStart({ start, end }, env);
  if (!bookings) {
    throw new Error("Failed to get bookings");
  }

  // Chinese time
  const timeFormatter = new Intl.DateTimeFormat("zh-CN", {
    timeStyle: "short",
  });
  const dateFormatter = new Intl.DateTimeFormat("zh-CN", {
    timeStyle: "short",
    dateStyle: "medium",
  });
  const userIds: number[] = [];

  for (const booking of bookings) {
    const userId = booking.studentId ?? 0;
    const student = await userDbGet({ userId }, env);
    const teacher = await userDbGet({ userId: booking.teacherId }, env);

    if (!userIds.includes(userId) && student && teacher && student.phone) {
      const startTime = dateFormatter.format(new Date(booking.start));
      const endTime = timeFormatter.format(new Date(booking.end));
      const message = `你好，${student.firstName} ${student.lastName}，提醒您：您与${teacher.firstName} ${teacher.lastName}的课程安排在${startTime}-${endTime}。`;

      console.log(message);
      await env.KV.put("message", message);

      // await messageSend({
      //   content: message,
      //   mobile: student.phone,
      // });
      userIds.push(userId);
    }
  }

  return true;
}

/**
 * Validate class when class is finished
 * @param bindings { Env }
 * @returns { boolean }
 */
export async function cronValidateClass(bindings: Env) {
  const start = 0;
  const end = Date.now() + 10 * 60 * 1000;

  const bookings = await bookingDbGetAllByDateEnd({ start, end }, bindings);
  if (!bookings) {
    throw new Error("Failed to get bookings");
  }

  const newBookings = bookings.map((booking) => {
    return {
      ...booking,
      status: 2,
    };
  });

  const update = bookingDbUpdateMany(newBookings, bindings);
  if (!update) {
    throw new Error("Failed to update bookings");
  }

  return true;
}
