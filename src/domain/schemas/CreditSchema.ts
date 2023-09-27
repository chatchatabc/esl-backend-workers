import {
  merge,
  minLength,
  minValue,
  number,
  object,
  partial,
  pick,
  string,
  transform,
} from "valibot";

export const CreditSchema = object({
  userId: number("User ID must be a number", [
    minValue(1, "User ID must be greater than 0"),
  ]),
  amount: number("Amount must be a number", [
    minValue(1, "Amount must be greater than 0"),
  ]),
  credits: number("Credits must be a number", [
    minValue(1, "Credits must be greater than 0"),
  ]),
  currency: string("Currency must be a number", [
    minLength(3, "Currency must be greater than 2"),
  ]),
});

export const CreditAddInput = transform(
  merge([
    pick(CreditSchema, ["userId", "amount", "credits"]),
    partial(pick(CreditSchema, ["currency"])),
  ]),
  (input) => {
    return { ...input, currency: input.currency ?? "CNY" };
  }
);
