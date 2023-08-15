import {
  coerce,
  email,
  minLength,
  minValue,
  nullable,
  number,
  object,
  omit,
  pick,
  string,
  withDefault,
} from "valibot";

const Schema = object({
  id: coerce(
    number("Invalid ID, must be a number", [
      minValue(1, "ID must be greater than 0"),
    ]),
    Number
  ),
  username: string("Invalid username, must be a string", [
    minLength(1, "Username must be at least 1 character long"),
  ]),
  password: string("Invalid password, must be a string", [
    minLength(1, "Password must be at least 1 character long"),
  ]),
  confirmPassword: string("Invalid confirm password", [
    minLength(1, "Confirm password must be at least 1 character long"),
  ]),
  firstName: withDefault(
    nullable(string("Invalid first name, must be a string")),
    null
  ),
  lastName: withDefault(
    nullable(string("Invalid last name, must be a string")),
    null
  ),
  phone: withDefault(nullable(string("Invalid phone, must be a string")), null),
  email: withDefault(
    nullable(
      string("Invalid email data type, must be a string", [
        email("Invalid email format"),
      ])
    ),
    null
  ),
  roleId: coerce(
    number("Invalid role ID", [minValue(1, "Role ID must be greater than 0")]),
    Number
  ),
  status: coerce(
    number("Invalid status", [minValue(1, "Status must be greater than 0")]),
    Number
  ),
  createdAt: number("Invalid createdAt, should be a timestamp", [
    minValue(0, "Created timestamp must not be negative"),
  ]),
  updatedAt: number("Invalid updatedAt, should be a timestamp", [
    minValue(0, "Updated timestamp must not be negative"),
  ]),
  credit: coerce(
    number("Invalid credit", [minValue(0, "Credit must not be negative")]),
    Number
  ),
  phoneVerifiedAt: withDefault(
    nullable(
      number("Invalid phone verified at, should be a timestamp", [
        minValue(0, "Phone verified timestamp must not be negative"),
      ])
    ),
    null
  ),
  emailVerifiedAt: withDefault(
    nullable(
      number("Invalid email verified at, should be a timestamp", [
        minValue(0, "Email verified timestamp must not be negative"),
      ])
    ),
    null
  ),
});

export const User = omit(Schema, ["confirmPassword"]);

export const UserUpdateInput = omit(User, [
  "updatedAt",
  "createdAt",
  "phoneVerifiedAt",
  "emailVerifiedAt",
  "password",
]);

export const UserCreateInput = omit(Schema, ["updatedAt", "createdAt", "id"]);

export const UserRegister = pick(Schema, [
  "username",
  "password",
  "confirmPassword",
]);

export const UserRegisterProfile = pick(Schema, [
  "firstName",
  "lastName",
  "phone",
  "email",
]);
