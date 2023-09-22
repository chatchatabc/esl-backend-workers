import type { User } from "./UserModel";

export type LogsCredit = {
  id: number;
  userId: number;
  title: string;
  details: string;
  amount: number;
  createdAt: number;
  updatedAt: number;
  createdBy: number;

  user: User;
  createdByUser: User;
};

export type LogsCreditCreate = Pick<
  LogsCredit,
  "title" | "details" | "amount" | "userId"
>;

export type LogsMoney = {
  id: number;
  userId: number;
  title: string;
  details: string;
  credits: number;
  amount: number;
  currency: string;
  createdAt: number;
  updatedAt: number;
};

export type LogsMoneyCreate = Pick<
  LogsMoney,
  "title" | "details" | "amount" | "userId" | "currency" | "credits"
>;
