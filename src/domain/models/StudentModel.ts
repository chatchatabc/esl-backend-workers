import { Input } from "valibot";
import { CommonPagination } from "./CommonModel";
import { User, UserCreate } from "./UserModel";
import { StudentCreateInput } from "../schemas/StudentSchema";

export type Student = {
  id: number;
  uuid: string;
  userId: number;
  alias: string | null;
  bio: string | null;
  status: number;
  createdById: number;
  createdAt: string;
  updatedAt: string;

  user: User;
};

export type StudentCreate = Pick<Student, "bio" | "status" | "alias"> &
  UserCreate;

export type StudentUpdate = Pick<
  Student,
  "id" | "alias" | "bio" | "status" | "userId" | "uuid"
>;

export type StudentPagination = CommonPagination & {};

export type StudentCreateInput = Input<typeof StudentCreateInput>;
