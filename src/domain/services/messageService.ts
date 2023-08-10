import { Env } from "../..";
import { Message, MessageCreate } from "../models/MessageModel";
import {
  messageDbCreate,
  messageDbGetAll,
  messageDbGetAllTotal,
} from "../repositories/messageRepo";
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
