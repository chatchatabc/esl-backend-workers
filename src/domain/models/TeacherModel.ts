import { Input } from "valibot";
import type { User, UserCreate } from "./UserModel";
import {
  TeacherCreateInput,
  TeacherUpdateInput,
} from "../schemas/TeacherSchema";

export type Teacher = {
  id: number;
  userId: number;
  bio: string | null;
  alias: string | null;
  createdAt: number;
  updatedAt: number;
  status: number;

  user: User;
};

export type TeacherCreate = Pick<Teacher, "bio" | "alias" | "status"> &
  UserCreate;

export type TeacherCreateInput = Input<typeof TeacherCreateInput>;

export type TeacherUpdate = Pick<Teacher, "id" | "bio" | "alias" | "status">;

export type TeacherUpdateInput = Input<typeof TeacherUpdateInput>;
