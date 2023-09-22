import { minLength, object, pick, string } from "valibot";

export const AuthSchema = object({
  username: string("Username must be a string", [
    minLength(1, "Username is required"),
  ]),
  password: string("Password must be a string", [
    minLength(1, "Password is required"),
  ]),
  confirmPassword: string("Confirm password must be a string", [
    minLength(1, "Confirm password is required"),
  ]),
});

export const AuthLoginInput = pick(AuthSchema, ["username", "password"]);

export const AuthRegisterInput = pick(AuthSchema, [
  "username",
  "password",
  "confirmPassword",
]);
