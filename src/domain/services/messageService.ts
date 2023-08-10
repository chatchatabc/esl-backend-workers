import { Env } from "../..";
import { smsSend } from "../infra/sms";
import { Message, MessageCreate, MessageSend } from "../models/MessageModel";
import {
  messageDbCreate,
  messageDbGetAll,
  messageDbGetAllTotal,
} from "../repositories/messageRepo";
import { userGet } from "./userService";
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
  if (!total) {
    throw utilFailedResponse("Unable to get messages", 500);
  }

  return {
    ...params,
    content: query.results as Message[],
    total,
  };
}

export async function messageSend(params: MessageSend, env: Env) {
  const receiver = await userGet({ userId: params.receiverId }, env);
  if (!receiver) {
    throw utilFailedResponse("Unable to get the receiver information", 500);
  }

  const sms = await smsSend({
    mobile: receiver.phone ?? "",
    content: params.message,
  });
  if (!sms) {
    throw utilFailedResponse("Unable to send the message", 500);
  }

  const message: MessageCreate = {
    ...params,
    sendAt: Date.now(),
    status: 2,
    cron: "0 0 1 1 1",
  };
  const query = messageDbCreate(message, env);
  if (!query) {
    throw utilFailedResponse("Unable save the message", 500);
  }

  return true;
}
