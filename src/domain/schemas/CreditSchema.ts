import { number, object, pick } from "valibot";

const Schema = object({
  userId: number("User ID is required"),
  amount: number("Amount is required"),
  credits: number("Credits is required"),
});

export const CreditAddInput = pick(Schema, ["userId", "amount", "credits"]);
