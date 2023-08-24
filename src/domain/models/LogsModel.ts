import type { User } from "./UserModel";

export type LogsCredit = {
  id: number;
  userId: number;
  title: string;
  details: string;
  amount: number;
  createdAt: number;
  updatedAt: number;

  user?: User;
};

export type LogsCreditCreate = Pick<
  LogsCredit,
  "title" | "details" | "amount" | "userId"
>;
