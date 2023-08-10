export type Message = {
  id: number;
  createdAt: number;
  updatedAt: number;
} & MessageCreate;

export type MessageCreate = {
  senderId: number;
  receiverId: number;
  status: number;
  sendAt?: number | null;

  cron: string;
  title: string;
  message: string;
};
