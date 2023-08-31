import { Input } from "valibot";
import { CreditAddInput } from "../schemas/CreditSchema";

export type CreditAdd = {
  amount: number;
  credits: number;
  userId: number;
  currency: string;
};

export type CreditAddInput = Input<typeof CreditAddInput>;
