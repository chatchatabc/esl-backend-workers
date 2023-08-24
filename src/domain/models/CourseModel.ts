import { CommonPagination } from "./CommonModel";
import { Teacher } from "./TeacherModel";

export type Course = {
  id: number;
  teacherId: number;
  price: number;
  createdAt: number;
  updatedAt: number;

  name: string;
  description: string | null;

  teacher: Teacher | null;
};

export type CoursePagination = CommonPagination & {};
