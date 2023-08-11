import { User } from "./UserModel";

export type Message = {
  id: number;
  createdAt: number;
  updatedAt: number;
  receiverId: number;
  senderId: number;
  status: number;
  sendAt?: number;

  title: string;
  message: string;
  cron: string;

  receiver?: User;
  sender?: User;
};

export type MessageCreate = Omit<Message, "id" | "createdAt" | "updatedAt">;

export type MessageCreateInput = Omit<MessageCreate, "status" | "senderId">;

export type MessageSend = Pick<
  Message,
  "senderId" | "receiverId" | "title" | "message"
>;

export type MessageSendInput = Omit<MessageSend, "senderId">;

export type MessageTemplate = {
  id: number;
  createdAt: number;
  updatedAt: number;

  templateId: number;
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
  "status" | "templateId"
>;
