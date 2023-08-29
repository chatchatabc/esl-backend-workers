import { nullish, number, object, pick, string, transform } from "valibot";

const Schema = object({
  id: number("ID must be a number"),
  smsId: string("SMS ID must be a string"),
  signature: string("Signature must be a string"),
  title: string("Title must be a string"),
  message: string("Message must be a string"),
  variables: nullish(string("Variables must be a string")),
  status: number("Status must be a number"),
});

export const MessageTemplateCreateInput = transform(
  pick(Schema, [
    "message",
    "signature",
    "smsId",
    "status",
    "title",
    "variables",
  ]),
  (input) => {
    return {
      ...input,
      variables: input.variables ?? null,
    };
  }
);

export const MessageTemplateUpdateInput = transform(
  pick(Schema, [
    "message",
    "signature",
    "smsId",
    "status",
    "title",
    "variables",
    "id",
  ]),
  (input) => {
    return {
      ...input,
      variables: input.variables ?? null,
    };
  }
);
