import { User } from "./UserModel";

export type Message = {
  id: number;
  createdAt: number;
  updatedAt: number;
  userId: number;
  status: number;
  sendAt?: number;

  phone: string;
  subject: string;
  message: string;
  cron: string;

  user?: User;
};

export type MessageCreate = Omit<Message, "id" | "createdAt" | "updatedAt">;

export type MessageCreateInput = Omit<MessageCreate, "status" | "senderId">;

export type MessageSend = Pick<Message, "userId" | "subject" | "message">;

export type MessageSendInput = Omit<MessageSend, "senderId">;

export type MessageTemplate = {
  id: number;
  createdAt: number;
  updatedAt: number;

  smsId: number;
  title: string;
  signature: string;
  message: string;
  status: number;
};

export type MessageTemplateCreate = Omit<
  MessageTemplate,
  "id" | "createdAt" | "updatedAt"
>;

export type MessageTemplateCreateInput = Omit<
  MessageTemplateCreate,
  "status" | "smsId"
>;
