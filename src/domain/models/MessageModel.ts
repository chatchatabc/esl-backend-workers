export type Message = {
  id: number;
  createdAt: number;
  updatedAt: number;
} & MessageCreate;

export type MessageCreate = {
  status: number;
  sendAt?: number | null;

  cron: string;
} & MessageSend;

export type MessageSend = {
  senderId: number;
  receiverId: number;
  title: string;
  message: string;
};
