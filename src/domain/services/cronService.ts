import { Env } from "../..";
import {
  bookingDbGetAllByDateStart,
  bookingDbConfirmMany,
} from "../repositories/bookingRepo";
import { messageGetAllByDate, messageGetAllWithCron } from "./messageService";
import cron from "cron-parser";
import { userGet } from "./userService";
import { LogsCreditCreate } from "../models/LogsModel";
import { User } from "../models/UserModel";
import { teacherGet } from "./teacherService";
import { utilDateFormatter, utilTimeFormatter } from "./utilService";
import { MessageCreate, MessageSend } from "../models/MessageModel";
import { smsSend } from "../infra/sms";
import { SmsSend } from "../models/SmsModel";
import { messageTemplateGet } from "./messageTemplate";
import { messageDbUpdateMany } from "../repositories/messageRepo";

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
    const userId = booking.userId ?? 0;
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

export async function cronService(timestamp: number, env: Env) {
  await cronConfirmBooking(timestamp, env);
  await cronSendScheduledMessages(timestamp, env);

  return true;
}

/**
 * Send all current scheduled messages when cron job is triggered
 * @param env { Env }
 * @returns { boolean }
 */
export async function cronSendScheduledMessages(timestamp: number, env: Env) {
  const start = 0;
  const end = timestamp + 30 * 60 * 1000;
  const messages = await messageGetAllByDate({ start, end }, env);
  if (!messages) {
    throw new Error("Failed to get messages");
  }

  const newMesssages = [];
  for (const message of messages) {
    const messageTemplate = await messageTemplateGet(
      { messageTemplateId: message.messageTemplateId },
      env
    );
    const sms: SmsSend = {
      phoneNumbers: message.phone,
      signName: messageTemplate.signature,
      templateCode: messageTemplate.smsId,
      templateParam: message.templateValues,
    };

    const resSms = await smsSend(sms);
    if (!resSms || resSms.Code !== "OK") {
      message.status = 3;
    } else {
      message.status = 2;
      await env.KV.put("scheduledMessage", messageTemplate.message);
      console.log("Scheduled message sent: ", messageTemplate.message);
    }
    // message.status = 2;

    newMesssages.push(message);
  }

  const update = await messageDbUpdateMany({ messages: newMesssages }, env);
  if (!update) {
    throw new Error("Failed to update messages");
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

  for (const message of messages) {
    const parsedCron = cron.parseExpression(message.cron);
    const next = parsedCron.next().toDate().getTime();

    if (next === timestamp) {
      // const receiver = await userGet({ userId: message.receiverId }, env);
      // if (receiver && receiver.phone) {
      //   // await smsSend({
      //   //   content: message.message,
      //   //   mobile: receiver.phone!,
      //   // });
      //   await env.KV.put("cronMessage", message.message);
      //   console.log("Cron message sent: ", message.message);
      // }
    }
  }

  return true;
}

/**
 * Validate class when class is finished
 * @param bindings { Env }
 * @returns { boolean }
 */
export async function cronConfirmBooking(timestsamp: number, bindings: Env) {
  const start = 0;
  const end = timestsamp + 30 * 60 * 1000;

  // Get all bookings with pending status
  const bookings = await bookingDbGetAllByDateStart(
    { start, end, status: 1 },
    bindings
  );
  if (!bookings) {
    throw new Error("Failed to get bookings");
  }

  // Get the related users within this booking
  const newBookingsPromise = bookings.map(async (booking) => {
    const teacher = await teacherGet(
      { teacherId: booking.teacherId },
      bindings
    );
    const user = await userGet({ userId: teacher.userId }, bindings);
    teacher.user = user;

    booking.teacher = teacher;
    booking.user = await userGet({ userId: booking.userId }, bindings);

    return booking;
  });
  const newBookings = await Promise.all(newBookingsPromise);

  // Create logs credit for the teachers
  const logsCredits: LogsCreditCreate[] = [];
  newBookings.forEach(async (booking) => {
    const logsCredit: LogsCreditCreate = {
      userId: booking.teacher!.userId,
      amount: booking.amount,
      title: `Booked class from student ${booking.user?.alias}`,
      details: `Booked class at ${utilDateFormatter(
        "en-US",
        new Date(booking.start)
      )} ${utilTimeFormatter("en-US", new Date(booking.start))}`,
    };
    logsCredits.push(logsCredit);
  });

  // Update teacher's credits
  const teachers: User[] = [];
  newBookings.forEach(async (booking) => {
    const user = booking.teacher!.user;
    if (!user) {
      throw new Error("Failed to get teacher");
    }
    user.credits += booking.amount ?? 0;

    teachers.push(user);
  });

  const messages: MessageCreate[] = [];
  newBookings.forEach(async (booking) => {
    const startDate = utilDateFormatter("zh-CN", new Date(booking.start));
    const startTime = utilTimeFormatter("zh-CN", new Date(booking.start));
    const message: MessageCreate = {
      userId: booking.userId,
      messageTemplateId: 1,
      phone: booking.user!.phone!,
      cron: "0 0 1 1 1",
      status: 1,
      sendAt: booking.start - 10 * 60 * 1000,
      templateValues: JSON.stringify({
        datetime: `${startDate} ${startTime}`,
      }),
    };
    messages.push(message);
  });

  // Update bookings, logs credits, and teachers
  const update = await bookingDbConfirmMany(
    { bookings: newBookings, logsCredits, teachers, messages },
    bindings
  );
  if (!update) {
    throw new Error("Failed to update bookings");
  }

  return true;
}
