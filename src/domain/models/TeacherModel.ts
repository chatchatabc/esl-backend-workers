import { Input } from "valibot";
import type { User } from "./UserModel";
import { TeacherCreateInput } from "../schemas/TeacherSchema";

export type Teacher = {
  id: number;
  userId: number;
  bio: string | null;
  alias: string | null;
  createdAt: number;
  updatedAt: number;
  status: number;

  user?: User;
};

export type TeacherCreate = Pick<
  Teacher,
  "userId" | "bio" | "alias" | "status"
>;
export type TeacherCreateInput = Input<typeof TeacherCreateInput>;
