import { Env } from "../..";
import { smsSend } from "../infra/sms";
import {
  Message,
  MessageCreate,
  MessageSend,
  MessageUpdate,
} from "../models/MessageModel";
import {
  messageDbCreate,
  messageDbGetAll,
  messageDbGetAllByDate,
  messageDbGetAllTotal,
  messageDbGetAllWithCron,
  messageDbUpdate,
} from "../repositories/messageRepo";
import { messageTemplateGet } from "./messageTemplate";
import { userGet } from "./userService";
import { utilFailedResponse } from "./utilService";

export async function messageCreate(
  params: MessageCreate,
  env: Env,
  createdById: number
) {
  const stmt = messageDbCreate(params, env, createdById);

  try {
    await env.DB.batch([stmt]);
    return true;
  } catch (e) {
    console.log(e);
    throw utilFailedResponse("Unable to create message", 500);
  }
}

export async function messageGetAll(
  params: { page: number; size: number },
  env: Env
) {
  const messages: Message[] = await messageDbGetAll(params, env);
  const totalElements: number = await messageDbGetAllTotal(env);

  const messagesComplete = await Promise.all(
    messages.map(async (message) => {
      message.messageTemplate = await messageTemplateGet(
        { messageTemplateId: message.messageTemplateId },
        env
      );
      if (message.userId) {
        message.user = await userGet({ userId: message.userId }, env);
      }
      return message;
    })
  );

  return {
    page: params.page,
    size: params.size,
    content: messagesComplete,
    totalElements,
  };
}

export async function messageGetAllByDate(
  params: { start: number; end: number },
  env: Env
) {
  const query = await messageDbGetAllByDate(params, env);
  if (!query) {
    throw utilFailedResponse("Unable to get messages", 500);
  }

  return query.results as Message[];
}

export async function messageGetAllWithCron(env: Env) {
  const query = await messageDbGetAllWithCron(env);
  if (!query) {
    throw utilFailedResponse("Unable to get messages", 500);
  }

  return query.results as Message[];
}

export async function messageUpdate(params: MessageUpdate, env: Env) {
  const query = await messageDbUpdate(params, env);
  if (!query) {
    throw utilFailedResponse("Unable to update message", 500);
  }

  return true;
}

export async function messageSend(
  params: MessageSend,
  env: Env,
  createdById: number
) {
  const messageTemplate = await messageTemplateGet(params, env);

  const sms = await smsSend(
    {
      phoneNumbers: params.phone,
      signName: messageTemplate.signature,
      templateCode: messageTemplate.smsId,
      templateParam: params.templateValues,
    },
    env
  );

  if (!sms || sms.Code !== "OK") {
    throw utilFailedResponse("Failed to send message", 500);
  }

  const message: MessageCreate = {
    ...params,
    sendAt: Date.now(),
    status: 2,
    cron: "0 0 1 1 1",
  };

  return await messageCreate(message, env, createdById);
}
