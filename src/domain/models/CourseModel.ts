import { Input } from "valibot";
import { CommonPagination } from "./CommonModel";
import { Teacher } from "./TeacherModel";
import { CourseCreateInput, CourseUpdateInput } from "../schemas/CourseSchema";

export type Course = {
  id: number;
  teacherId: number;
  price: number;
  createdAt: number;
  updatedAt: number;

  name: string;
  description: string | null;

  teacher?: Teacher;
};

export type CoursePagination = CommonPagination & {
  teacherId?: number;
};

export type CourseCreate = Pick<
  Course,
  "name" | "price" | "teacherId" | "description"
>;

export type CourseUpdate = Pick<
  Course,
  "name" | "price" | "teacherId" | "description" | "id"
>;

export type CourseCreateInput = Input<typeof CourseCreateInput>;

export type CourseUpdateInput = Input<typeof CourseUpdateInput>;
