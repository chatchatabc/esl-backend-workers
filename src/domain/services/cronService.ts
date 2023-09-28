import { Env } from "../..";
import { bookingDbGetAll, bookingDbUpdate } from "../repositories/bookingRepo";
import { messageGetAllByDate, messageGetAllWithCron } from "./messageService";
import cron from "cron-parser";
import { utilDateFormatter, utilTimeFormatter } from "./utilService";
import { MessageCreate } from "../models/MessageModel";
import { smsSend } from "../infra/sms";
import { SmsSend } from "../models/SmsModel";
import { messageTemplateGet } from "./messageTemplate";
import {
  messageDbCreate,
  messageDbUpdateMany,
} from "../repositories/messageRepo";

export async function cronService(timestamp: number, env: Env) {
  await cronConfirmBooking(timestamp, env);
  // await cronSendScheduledMessages(timestamp, env);

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

    let errorAttempts = 0;
    while (errorAttempts < 5 && message.status !== 2) {
      const resSms = await smsSend(sms, env);
      if (!resSms || resSms.Code !== "OK") {
        message.status = 3;
        errorAttempts++;
      } else {
        message.status = 2;
        break;
      }
    }

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
  const bookings = await bookingDbGetAll(
    { start, end, status: [1], page: 1, size: 10000 },
    bindings
  );

  const messages: MessageCreate[] = [];
  bookings.forEach(async (booking) => {
    const startDate = utilDateFormatter("zh-CN", new Date(booking.start));
    const startTime = utilTimeFormatter("zh-CN", new Date(booking.start));
    const message: MessageCreate = {
      userId: booking.student.userId,
      messageTemplateId: 1,
      phone: booking.student.user!.phone!,
      cron: "0 0 1 1 1",
      status: 1,
      sendAt: booking.start - 30 * 60 * 1000,
      templateValues: JSON.stringify({
        datetime: `${startDate} ${startTime}`,
      }),
    };
    messages.push(message);
  });

  const messageStmts = messages.map((message) => {
    return messageDbCreate(message, bindings, 1);
  });
  const bookingStmts = bookings.map((booking) => {
    return bookingDbUpdate({ id: booking.id, status: 2 }, bindings);
  });

  try {
    await bindings.DB.batch([...messageStmts, ...bookingStmts]);
    return true;
  } catch (e) {
    console.log(e);
    throw new Error("Failed to create messages");
  }
}
