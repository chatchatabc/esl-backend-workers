import { coerce, minValue, number, object, optional, transform } from "valibot";

export const CommonPaginationInput = transform(
  object({
    page: optional(
      coerce(
        number("Invalid page value, should be a number", [
          minValue(1, "Page should be greater than 0"),
        ]),
        Number
      )
    ),
    size: optional(
      coerce(
        number("Invalid size value, should be a number", [
          minValue(1, "Size should be greater than 0"),
        ]),
        Number
      )
    ),
  }),
  (input) => {
    return {
      page: input.page ?? 1,
      size: input.size ?? 10,
    };
  }
);
