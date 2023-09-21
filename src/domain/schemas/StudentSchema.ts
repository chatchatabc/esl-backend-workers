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
import { UserCreateInput } from "./UserSchema";

export const StudentSchema = object({
  userId: number("User ID must be a number", [
    minValue(1, "User ID must be greater than 0"),
  ]),
  uuid: string("UUID must be a string", [minLength(1, "UUID is required")]),
  id: number("ID must be a number", [minValue(1, "ID must be greater than 0")]),
  username: string("Username must be a string", [
    minLength(1, "Username is required"),
  ]),
  status: number("Status must be a number", [
    minValue(0, "Status must not be negative"),
  ]),
  alias: string("Alias must be a string", [minLength(1, "Alias is required")]),
  bio: string("Bio must be a string", [minLength(1, "Bio is required")]),
});

export const StudentGetInput = pick(StudentSchema, ["id", "uuid"]);

export const StudentGetByUserInput = partial(
  pick(StudentSchema, ["userId", "username"])
);

export const StudentCreateInput = transform(
  merge([UserCreateInput, partial(pick(StudentSchema, ["bio"]))]),
  (input) => {
    return {
      ...input,
      status: 1,
      alias: input.alias ?? null,
      bio: input.bio ?? null,
      firstName: input.firstName ?? null,
      lastName: input.lastName ?? null,
      phone: input.phone ?? null,
      email: input.email ?? null,
      credits: input.credits ?? 0,
      phoneVerifiedAt: input.phoneVerifiedAt ?? null,
      emailVerifiedAt: input.emailVerifiedAt ?? null,
    };
  }
);

export const StudentUpdateInput = pick(StudentSchema, [
  "id",
  "alias",
  "bio",
  "status",
  "userId",
  "uuid",
]);
