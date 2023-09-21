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

export const TeacherSchema = object({
  id: number("ID must be a number", [minValue(1, "ID must be greater than 0")]),
  bio: string("Bio must be a string", [minLength(1, "Bio is required")]),
  alias: string("Alias must be a string", [minLength(1, "Alias is required")]),
  status: number("Status must be a number", [
    minValue(0, "Status must not be negative"),
  ]),
});

export const TeacherCreateInput = transform(
  merge([UserCreateInput, partial(pick(TeacherSchema, ["bio"]))]),
  (input) => {
    return {
      ...input,
      status: 1,
      roleId: 2,
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

export const TeacherUpdateInput = transform(
  pick(TeacherSchema, ["alias", "bio", "status", "id"]),
  (input) => {
    return {
      ...input,
      bio: input.bio ?? null,
      alias: input.alias ?? null,
    };
  }
);
