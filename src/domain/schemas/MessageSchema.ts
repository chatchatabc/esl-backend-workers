import { number, object, optional, pick, string, transform } from "valibot";

const Schema = object({
  userId: optional(number("User ID must be a number")),
  messageTemplateId: number("Message template ID must be a number"),
  phone: string("Phone number must be a number"),
  templateValues: optional(string("Template values must be a string")),
  sendAt: optional(number("Send at must be a number")),
  cron: string("Cron must be a string"),
});

export const MessageSendInput = transform(
  pick(Schema, ["userId", "messageTemplateId", "phone", "templateValues"]),
  (input) => {
    return {
      ...input,
      templateValues: input.templateValues ?? null,
      userId: input.userId ?? null,
    };
  }
);

export const MessageCreateInput = transform(
  pick(Schema, [
    "userId",
    "messageTemplateId",
    "phone",
    "templateValues",
    "sendAt",
    "cron",
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
