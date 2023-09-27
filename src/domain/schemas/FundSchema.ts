import { minLength, number, object, string } from "valibot";

export const FundSchema = object({
  uuid: string("UUID must be a string", [minLength(1, "UUID is required")]),
  userId: number("User ID must be a number"),
  title: string("Title must be a string", [minLength(1, "Title is required")]),
  details: string("Details must be a string", [
    minLength(1, "Details is required"),
  ]),
  credits: number("Credits must be a number"),
  currency: string("Currency must be a string", [
    minLength(1, "Currency is required"),
  ]),
  amount: number("Amount must be a number"),
  status: number("Status must be a number"),
});
