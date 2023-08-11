import { Env } from "../..";
import { smsSend } from "../infra/sms";
import {
  bookingDbGetAllByDateEnd,
  bookingDbGetAllByDateStart,
  bookingDbUpdateMany,
} from "../repositories/bookingRepo";
import { messageGetAllByDate, messageGetAllWithCron } from "./messageService";
import cron from "cron-parser";
import { userGet } from "./userService";

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
    const student = await userGet({ userId }, env);
    const teacher = await userGet({ userId: booking.teacherId }, env);

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
 * Send all current scheduled messages when cron job is triggered
 * @param env { Env }
 * @returns { boolean }
 */
export async function cronSendScheduledMessages(timestamp: number, env: Env) {
  const start = timestamp - 1 * 60 * 1000;
  const end = timestamp + 1 * 60 * 1000;
  const messages = await messageGetAllByDate({ start, end }, env);
  if (!messages) {
    throw new Error("Failed to get messages");
  }

  for (const message of messages) {
    const receiver = await userGet({ userId: message.receiverId }, env);
    if (receiver && receiver.phone) {
      // await smsSend({
      //   content: message.message,
      //   mobile: receiver.phone!,
      // });
      await env.KV.put("scheduledMessage", message.message);
      console.log("Scheduled message sent: ", message.message);
    }
  }

  return true;
}

/**
 * Send all cron messages when cron job is triggered
 * @param timestamp { number }
 * @param env { Env }
 * @returns { boolean }
 */
export async function cronSendCronMessages(timestamp: number, env: Env) {
  const messages = await messageGetAllWithCron(env);
  if (!messages) {
    throw new Error("Failed to get messages");
  }

  console.log("Cron Messages: ", messages);

  for (const message of messages) {
    const parsedCron = cron.parseExpression(message.cron);
    const next = parsedCron.next().toDate().getTime();

    if (next === timestamp) {
      const receiver = await userGet({ userId: message.receiverId }, env);
      if (receiver && receiver.phone) {
        // await smsSend({
        //   content: message.message,
        //   mobile: receiver.phone!,
        // });
        await env.KV.put("cronMessage", message.message);
        console.log("Cron message sent: ", message.message);
      }
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
