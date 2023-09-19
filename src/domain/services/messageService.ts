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
import { utilFailedResponse } from "./utilService";

export async function messageCreate(params: MessageCreate, env: Env) {
  const query = messageDbCreate(params, env);
  if (!query) {
    throw utilFailedResponse("Unable to save message", 500);
  }

  return true;
}

export async function messageGetAll(
  params: { page: number; size: number },
  env: Env
) {
  const query = await messageDbGetAll(params, env);
  if (!query) {
    throw utilFailedResponse("Unable to get messages", 500);
  }

  const total = await messageDbGetAllTotal(env);
  if (!total && total !== 0) {
    throw utilFailedResponse("Unable to get total messages", 500);
  }

  return {
    ...params,
    content: query.results as Message[],
    totalElements: total as number,
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

export async function messageSend(params: MessageSend, env: Env) {
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
  const query = await messageDbCreate(message, env);
  if (!query) {
    throw utilFailedResponse("Unable save the message", 500);
  }

  return true;
}
