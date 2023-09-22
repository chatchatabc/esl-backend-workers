import {
  merge,
  minLength,
  minValue,
  nullable,
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
  alias: nullable(
    string("Alias must be a string or null", [
      minLength(1, "Alias is required"),
    ])
  ),
  username: string("Username must be a string", [
    minLength(1, "Username is required"),
  ]),
  password: string("Password must be a string", [
    minLength(1, "Password is required"),
  ]),
  confirmPassword: string("Confirm password must be a string", [
    minLength(1, "Confirm password is required"),
  ]),
  firstName: nullable(
    string("First name must be a string or null", [
      minLength(1, "First name is required"),
    ])
  ),
  lastName: nullable(
    string("Last name must be a string or null", [
      minLength(1, "Last name is required"),
    ])
  ),
  phone: nullable(
    string("Phone must be a string or null", [
      minLength(1, "Phone is required"),
    ])
  ),
  email: nullable(
    string("Email must be a string or null", [
      minLength(1, "Email is required"),
    ])
  ),
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
  phoneVerifiedAt: nullable(
    number("Phone verified at must be a number or null", [
      minValue(0, "Phone verified timestamp must not be negative"),
    ])
  ),
  emailVerifiedAt: nullable(
    number("Email verified at must be a number or null", [
      minValue(0, "Email verified timestamp must not be negative"),
    ])
  ),
});

export const User = omit(UserSchema, ["confirmPassword"]);

export const UserDbCreateSchema = transform(
  merge([
    pick(UserSchema, ["username", "password", "roleId", "status", "credits"]),
    partial(
      pick(UserSchema, [
        "alias",
        "firstName",
        "lastName",
        "phone",
        "email",
        "phoneVerifiedAt",
        "emailVerifiedAt",
      ])
    ),
  ]),
  (input) => {
    return {
      ...input,
      alias: input.alias ?? null,
      firstName: input.firstName ?? null,
      lastName: input.lastName ?? null,
      phone: input.phone ?? null,
      email: input.email ?? null,
      phoneVerifiedAt: input.phoneVerifiedAt ?? null,
      emailVerifiedAt: input.emailVerifiedAt ?? null,
    };
  }
);

export const UserUpdateInput = pick(UserSchema, [
  "id",
  "roleId",
  "status",
  "credits",
  "alias",
  "firstName",
  "lastName",
  "phone",
  "username",
]);

export const UserCreateInput = transform(
  merge([
    pick(UserSchema, ["confirmPassword", "password", "username"]),
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
        "roleId",
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
      roleId: input.roleId ?? 2,
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

export const UserRegisterInput = transform(
  merge([
    pick(UserSchema, ["username", "password", "confirmPassword"]),
    partial(
      pick(UserSchema, ["firstName", "lastName", "phone", "alias", "email"])
    ),
  ]),
  (input) => {
    return {
      ...input,
      firstName: input.firstName ?? null,
      lastName: input.lastName ?? null,
      alias: input.alias ?? null,
      phone: input.phone ?? null,
      email: input.email ?? null,
      credits: 0,
      roleId: 2,
      status: 1,
    };
  }
);

export const UserGetInput = partial(pick(UserSchema, ["id", "username"]));
