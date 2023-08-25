import { number, object, pick, string } from "valibot";

const Schema = object({
  teacherId: number("Teacher ID is required"),
  price: number("Price is required"),
  name: string("Name is required"),
  description: string("Description is required"),
});

export const CourseCreateInput = pick(Schema, [
  "teacherId",
  "price",
  "name",
  "description",
]);
