import {
  merge,
  minLength,
  number,
  object,
  partial,
  pick,
  string,
  transform,
} from "valibot";
import { v4 as uuidv4 } from "uuid";

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

export const FundCreateSchema = transform(
  merge([
    pick(FundSchema, ["amount", "credits", "details", "title", "userId"]),
    partial(pick(FundSchema, ["currency", "status", "uuid"])),
  ]),
  (input) => {
    return {
      ...input,
      currency: input.currency ?? "CNY",
      status: input.status ?? 1,
      uuid: input.uuid ?? uuidv4(),
    };
  }
);
