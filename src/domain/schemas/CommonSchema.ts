import {
  coerce,
  minValue,
  number,
  object,
  optional,
  string,
  transform,
  union,
} from "valibot";

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
    status: optional(
      union([
        number("Invalid status value, should be a number"),
        string("Invalid status value, should be a string"),
      ])
    ),
    userId: optional(
      coerce(
        number("Invalid userId value, should be a number", [
          minValue(1, "userId should be greater than 0"),
        ]),
        Number
      )
    ),
    roleId: optional(
      coerce(
        number("Invalid roleId value, should be a number", [
          minValue(1, "roleId should be greater than 0"),
        ]),
        Number
      )
    ),
    teacherId: optional(
      coerce(
        number("Invalid teacherId value, should be a number", [
          minValue(1, "teacherId should be greater than 0"),
        ]),
        Number
      )
    ),
  }),
  (input) => {
    return {
      ...input,
      page: input.page ?? 1,
      size: input.size ?? 10,
    };
  }
);
