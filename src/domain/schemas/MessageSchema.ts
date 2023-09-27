import {
  merge,
  nullable,
  number,
  object,
  partial,
  pick,
  string,
  transform,
} from "valibot";
import { v4 as uuidv4 } from "uuid";

export const MessageSchema = object({
  id: number("ID must be a number"),
  uuid: string("UUID must be a string"),
  messageTemplateId: number("Message template ID must be a number"),
  userId: nullable(number("User ID must be a number")),
  phone: string("Phone number must be a number"),
  templateValues: nullable(string("Template values must be a string")),
  cron: string("Cron must be a string"),
  sendAt: nullable(number("Send at must be a number")),
  status: number("Status must be a number"),
});

export const MessageSendInput = transform(
  pick(MessageSchema, [
    "userId",
    "messageTemplateId",
    "phone",
    "templateValues",
  ]),
  (input) => {
    return {
      ...input,
      templateValues: input.templateValues ?? null,
      userId: input.userId ?? null,
    };
  }
);

export const MessageCreateSchema = transform(
  merge([
    pick(MessageSchema, ["messageTemplateId", "phone", "cron", "status"]),
    partial(
      pick(MessageSchema, ["sendAt", "userId", "templateValues", "uuid"])
    ),
  ]),
  (input) => {
    return {
      ...input,
      templateValues: input.templateValues ?? null,
      sendAt: input.sendAt ?? null,
      userId: input.userId ?? null,
      uuid: input.uuid ?? uuidv4(),
    };
  }
);

export const MessageCreateInput = transform(
  merge([
    pick(MessageSchema, ["messageTemplateId", "phone", "cron"]),
    partial(
      pick(MessageSchema, ["userId", "templateValues", "sendAt", "status"])
    ),
  ]),
  (input) => {
    return {
      ...input,
      templateValues: input.templateValues ?? null,
      userId: input.userId ?? null,
      sendAt: input.sendAt ?? null,
      status: input.status ?? 1,
    };
  }
);
export const MessageUpdateInput = transform(
  pick(MessageSchema, [
    "id",
    "userId",
    "messageTemplateId",
    "phone",
    "templateValues",
    "sendAt",
    "cron",
    "status",
  ]),
  (input) => {
    return {
      ...input,
      templateValues: input.templateValues ?? null,
      userId: input.userId ?? null,
      sendAt: input.sendAt ?? null,
    };
  }
);
