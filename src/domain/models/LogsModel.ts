import type { User } from "./UserModel";

export type LogsCredit = {
  id: number;
  createdAt: number;
  updatedAt: number;

  sender?: User;
  receiver?: User;
} & LogsCreditCreate;

export type LogsCreditCreate = {
  senderId: number;
  receiverId: number;
  amount: number;
  status: number;

  title: string | null;
};
