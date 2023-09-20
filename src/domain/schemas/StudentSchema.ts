import { minLength, minValue, number, object, pick, string } from "valibot";

export const StudentSchema = object({
  userId: number("User ID must be a number", [
    minValue(1, "User ID must be greater than 0"),
  ]),
  uuid: string("UUID must be a string", [minLength(1, "UUID is required")]),
  id: number("ID must be a number", [minValue(1, "ID must be greater than 0")]),
  username: string("Username must be a string", [
    minLength(1, "Username is required"),
  ]),
});

export const StudentGetInput = pick(StudentSchema, ["id", "uuid"]);

export const StudentGetByUserInput = pick(StudentSchema, [
  "userId",
  "username",
]);
