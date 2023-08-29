import { Env } from "../..";
import { smsCreateTemplate } from "../infra/sms(old)";
import { CommonPagination } from "../models/CommonModel";
import {
  MessageTemplate,
  MessageTemplateCreate,
  MessageTemplateUpdate,
} from "../models/MessageModel";
import {
  messageTemplateDbCreate,
  messageTemplateDbGet,
  messageTemplateDbGetAll,
  messageTemplateDbGetAllTotal,
  messageTemplateDbUpdate,
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

export async function messageTemplateUpdate(
  params: MessageTemplateUpdate,
  env: Env
) {
  const query = await messageTemplateDbUpdate(params, env);
  if (!query) {
    throw utilFailedResponse("Cannot update message template", 500);
  }

  return true;
}

// export async function messageTemplateVerify(
//   params: { templateId: number },
//   env: Env
// ) {
//   const template = await messageTemplateDbGet(params, env);
//   if (!template) {
//     throw utilFailedResponse("Cannot get message template", 500);
//   }

//   // TODO: Verify message template
//   const verify = true; // Manually verify for now
//   if (!verify) {
//     throw utilFailedResponse("Cannot verify message template", 500);
//   } else {
//     template.status = 2;
//   }

//   const update = await messageTemplateDbUpdate(template, env);
//   if (!update) {
//     throw utilFailedResponse("Cannot update message template", 500);
//   }

//   return true;
// }

export async function messageTemplateGet(
  params: { messageTemplateId: number },
  env: Env
) {
  const messageTemplate = await messageTemplateDbGet(params, env);
  if (!messageTemplate) {
    throw utilFailedResponse("Cannot get message template", 500);
  }

  return messageTemplate as MessageTemplate;
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
