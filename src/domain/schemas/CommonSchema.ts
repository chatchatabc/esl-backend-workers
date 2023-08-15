import { coerce, minValue, number, object, withDefault } from "valibot";

export const CommonPaginationInput = object({
  page: withDefault(
    coerce(
      number("Invalid page value, should be a number", [
        minValue(1, "Page should be greater than 0"),
      ]),
      Number
    ),
    1
  ),
  size: withDefault(
    coerce(
      number("Invalid size value, should be a number", [
        minValue(1, "Size should be greater than 0"),
      ]),
      Number
    ),
    10
  ),
});
