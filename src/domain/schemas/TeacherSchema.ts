import {
  minValue,
  number,
  object,
  optional,
  pick,
  string,
  transform,
} from "valibot";

const Schema = object({
  id: number("ID is required", [minValue(1, "ID must be greater than 0")]),
  userId: number("User ID is required", [
    minValue(1, "User ID must be greater than 0"),
  ]),
  bio: optional(string("Bio is required")),
  alias: optional(string("Alias is required")),
  status: number("Status is required"),
});

export const TeacherCreateInput = transform(
  pick(Schema, ["userId", "bio", "alias", "status"]),
  (input) => {
    return {
      ...input,
      bio: input.bio ?? null,
      alias: input.alias ?? null,
    };
  }
);

export const TeacherUpdateInput = transform(
  pick(Schema, ["alias", "bio", "status", "id"]),
  (input) => {
    return {
      ...input,
      bio: input.bio ?? null,
      alias: input.alias ?? null,
    };
  }
);
