import { Env } from "../..";
import { MessageTemplateCreate } from "../models/MessageModel";
import { messageTemplateDbCreate } from "../repositories/messageTemplateRepo";
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
