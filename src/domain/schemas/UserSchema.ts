import {
  merge,
  minLength,
  minValue,
  number,
  object,
  omit,
  partial,
  pick,
  string,
  transform,
} from "valibot";

export const UserSchema = object({
  id: number("ID must be a number", [minValue(1, "ID must be greater than 0")]),
  alias: string("Alias must be a string", [minLength(1, "Alias is required")]),
  username: string("Username must be a string", [
    minLength(1, "Username is required"),
  ]),
  password: string("Password must be a string", [
    minLength(1, "Password is required"),
  ]),
  confirmPassword: string("Confirm password must be a string", [
    minLength(1, "Confirm password is required"),
  ]),
  firstName: string("First name must be a string", [
    minLength(1, "First name is required"),
  ]),
  lastName: string("Last name must be a string", [
    minLength(1, "Last name is required"),
  ]),
  phone: string("Phone must be a string", [minLength(1, "Phone is required")]),
  email: string("Email must be a string", [minLength(1, "Email is required")]),
  roleId: number("Role ID must be a number", [
    minValue(1, "Role ID must be greater than 0"),
  ]),
  status: number("Status must be a number", [
    minValue(1, "Status must be greater than 0"),
  ]),
  createdAt: number("Created at must be a number", [
    minValue(0, "Created timestamp must not be negative"),
  ]),
  updatedAt: number("Updated at must be a number", [
    minValue(0, "Updated timestamp must not be negative"),
  ]),
  credits: number("Credits must be a number", [
    minValue(0, "Credits must be not be negative"),
  ]),
  phoneVerifiedAt: number("Phone verified at must be a number", [
    minValue(0, "Phone verified timestamp must not be negative"),
  ]),
  emailVerifiedAt: number("Email verified at must be a number", [
    minValue(0, "Email verified timestamp must not be negative"),
  ]),
});

export const User = omit(UserSchema, ["confirmPassword"]);

export const UserUpdateInput = omit(User, [
  "updatedAt",
  "createdAt",
  "phoneVerifiedAt",
  "password",
]);

export const UserCreateInput = transform(
  merge([
    pick(UserSchema, ["confirmPassword", "password", "username", "roleId"]),
    partial(
      pick(UserSchema, [
        "phone",
        "emailVerifiedAt",
        "firstName",
        "lastName",
        "alias",
        "phoneVerifiedAt",
        "credits",
        "email",
      ])
    ),
  ]),
  (input) => {
    return {
      ...input,
      phoneVerifiedAt: input.phoneVerifiedAt ?? null,
      emailVerifiedAt: input.emailVerifiedAt ?? null,
      credits: input.credits ?? 0,
      status: 1,
      firstName: input.firstName ?? null,
      lastName: input.lastName ?? null,
      alias: input.alias ?? null,
      phone: input.phone ?? null,
      email: input.email ?? null,
    };
  }
);

export const UserRegister = pick(UserSchema, [
  "username",
  "password",
  "confirmPassword",
]);

export const UserRegisterProfile = pick(UserSchema, [
  "firstName",
  "lastName",
  "phone",
  "alias",
]);

export const UserRegisterInput = pick(UserSchema, [
  "username",
  "password",
  "confirmPassword",
]);
