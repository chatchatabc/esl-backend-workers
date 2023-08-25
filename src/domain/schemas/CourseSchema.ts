import { coerce, number, object, pick, string } from "valibot";

const Schema = object({
  id: number("ID is required"),
  teacherId: number("Teacher ID is required"),
  price: coerce(number("Price is required"), Number),
  name: string("Name is required"),
  description: string("Description is required"),
});

export const CourseCreateInput = pick(Schema, [
  "teacherId",
  "price",
  "name",
  "description",
]);

export const CourseUpdateInput = pick(Schema, [
  "id",
  "teacherId",
  "price",
  "name",
  "description",
]);
