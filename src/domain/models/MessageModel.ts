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
};

export type MessageCreate = Omit<Message, "id" | "createdAt" | "updatedAt">;

export type MessageCreateInput = Omit<MessageCreate, "status" | "senderId">;

export type MessageSend = Pick<
  Message,
  "senderId" | "receiverId" | "title" | "message"
>;

export type MessageSendInput = Omit<MessageSend, "senderId">;
