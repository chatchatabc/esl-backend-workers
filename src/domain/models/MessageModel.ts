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

export type MessageCreate = {
  status: number;
  senderId: number;
} & MessageCreateInput;

export type MessageCreateInput = {
  receiverId: number;
  sendAt?: number;
  title: string;
  message: string;
  cron: string;
};

export type MessageSend = {
  senderId: number;
} & MessageSendInput;

export type MessageSendInput = {
  receiverId: number;
  title: string;
  message: string;
};
