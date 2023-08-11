import { Env } from "../..";
import { CommonPagination } from "../models/CommonModel";
import { MessageTemplate, MessageTemplateCreate } from "../models/MessageModel";
import {
  messageTemplateDbCreate,
  messageTemplateDbGetAll,
  messageTemplateDbGetAllTotal,
} from "../repositories/messageTemplateRepo";
import { utilFailedResponse } from "./utilService";

export async function messageTemplateCreate(
  params: MessageTemplateCreate,
  env: Env
) {
  const query = await messageTemplateDbCreate(params, env);
  if (!query) {
    throw utilFailedResponse("Cannot create message template", 500);
  }

  return true;
}

export async function messageTemplateGetAll(
  params: CommonPagination,
  env: Env
) {
  const messageTemplates = await messageTemplateDbGetAll(params, env);
  if (!messageTemplates) {
    throw utilFailedResponse("Cannot get message templates", 500);
  }

  const totalElements = await messageTemplateDbGetAllTotal(env);
  if (!totalElements && totalElements !== 0) {
    throw utilFailedResponse("Cannot get message templates", 500);
  }

  return {
    ...params,
    content: messageTemplates.results as MessageTemplate[],
    totalElements,
  };
}
