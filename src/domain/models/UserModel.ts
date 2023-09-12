import { Input } from "valibot";
import { UserCreateInput, UserUpdateInput } from "../schemas/UserSchema";
import { CommonPagination } from "./CommonModel";

export type User = {
  id: number;
  roleId: number;
  createdAt: number;
  updatedAt: number;
  credits: number;
  status: number;
  username: string;
  password?: string;

  phoneVerifiedAt: number | null;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  alias: string | null;

  role?: UserRole;
};

export type UserCreateInput = Input<typeof UserCreateInput>;

export type UserCreate = Omit<
  User,
  "id" | "createdAt" | "updatedAt" | "role" | "password"
> & { password: string };

export type UserUpdate = Omit<User, "role">;

export type UserLogin = {
  username: string;
  password: string;
};

export type UserRegister = UserLogin & {
  confirmPassword: string;
};

export type UserUpdateInput = Input<typeof UserUpdateInput>;

export type UserRole = {
  name: string;
  createdAt: string;
  updatedAt: string;
  id: number;
};

export type UserPagination = CommonPagination & {
  roleId?: number;
  teacherId?: number;
};
