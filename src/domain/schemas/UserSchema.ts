import {
  custom,
  minLength,
  minValue,
  number,
  object,
  omit,
  pick,
  string,
} from "valibot";

const Schema = object({
  id: number("ID is required", [minValue(1, "ID must be greater than 0")]),
  alias: string("Alias must be string", [minLength(1, "Alias is required")]),
  username: string("Username is required", [
    minLength(1, "Username must be at least 1 character long"),
  ]),
  password: string("Password is required", [
    minLength(1, "Password must be at least 1 character long"),
  ]),
  confirmPassword: string("Confirm password is required", [
    minLength(1, "Confirm password must be at least 1 character long"),
  ]),
  firstName: string("First name is required", [
    minLength(1, "First name must be at least 1 character long"),
  ]),
  lastName: string("Last name is required", [
    minLength(1, "Last name must be at least 1 character long"),
  ]),
  phone: string("Phone is required", [
    minLength(1, "Phone must be at least 1 character long"),
  ]),
  roleId: number("Role ID is required", [
    minValue(1, "Role ID must be greater than 0"),
  ]),
  status: number("Status is required", [
    minValue(1, "Status must be greater than 0"),
  ]),
  createdAt: number("Created at is required", [
    minValue(0, "Created timestamp must not be negative"),
  ]),
  updatedAt: number("Updated at is required", [
    minValue(0, "Updated timestamp must not be negative"),
  ]),
  credits: number("Credits is required", [
    minValue(0, "Credits must be not be negative"),
  ]),
  phoneVerifiedAt: number("Phone verified at is required", [
    minValue(0, "Phone verified timestamp must not be negative"),
  ]),
});

export const User = omit(Schema, ["confirmPassword"]);

export const UserUpdateInput = omit(User, [
  "updatedAt",
  "createdAt",
  "phoneVerifiedAt",
  "password",
]);

export const UserCreateInput = omit(Schema, [
  "updatedAt",
  "createdAt",
  "id",
  "phoneVerifiedAt",
]);

export const UserRegister = pick(Schema, [
  "username",
  "password",
  "confirmPassword",
]);

export const UserRegisterProfile = pick(Schema, [
  "firstName",
  "lastName",
  "phone",
  "alias",
]);

export const UserRegisterInput = pick(Schema, [
  "username",
  "password",
  "confirmPassword",
]);
