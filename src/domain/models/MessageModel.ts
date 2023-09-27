import { Input } from "valibot";
import { User } from "./UserModel";
import {
  MessageCreateInput,
  MessageCreateSchema,
  MessageSendInput,
  MessageUpdateInput,
} from "../schemas/MessageSchema";
import {
  MessageTemplateCreateInput,
  MessageTemplateCreateSchema,
  MessageTemplateUpdateInput,
} from "../schemas/MessageTemplateSchema";

export type Message = {
  id: number;
  messageTemplateId: number;
  userId: number | null;
  createdAt: number;
  updatedAt: number;
  status: number;
  sendAt: number | null;

  phone: string;
  cron: string;
  templateValues: string | null; // stringified JSON

  user?: User;
  messageTemplate?: MessageTemplate;
};

export type MessageUpdate = Omit<Message, "createdAt" | "updatedAt">;

export type MessageUpdateInput = Input<typeof MessageUpdateInput>;

export type MessageCreate = Input<typeof MessageCreateSchema>;

export type MessageCreateInput = Input<typeof MessageCreateInput>;

export type MessageSend = Pick<
  Message,
  "userId" | "messageTemplateId" | "templateValues" | "phone"
>;

export type MessageSendInput = Input<typeof MessageSendInput>;

export type MessageTemplate = {
  id: number;
  smsId: string;
  createdAt: number;
  updatedAt: number;
  status: number;

  title: string;
  signature: string;
  message: string;
  variables: string | null; // Separated by comma
};

export type MessageTemplateCreate = Input<typeof MessageTemplateCreateSchema>;

export type MessageTemplateCreateInput = Input<
  typeof MessageTemplateCreateInput
>;

export type MessageTemplateUpdate = Omit<
  MessageTemplate,
  "createdAt" | "updatedAt"
>;

export type MessageTemplateUpdateInput = Input<
  typeof MessageTemplateUpdateInput
>;
