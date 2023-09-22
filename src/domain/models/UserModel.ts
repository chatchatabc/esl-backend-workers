import { Input } from "valibot";
import {
  UserCreateInput,
  UserDbCreateSchema,
  UserGetInput,
  UserRegisterInput,
  UserUpdateInput,
} from "../schemas/UserSchema";
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
  emailVerifiedAt: number | null;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  email: string | null;
  alias: string | null;

  role: UserRole;
};

export type UserCreateInput = Input<typeof UserCreateInput>;

export type UserDbCreate = Input<typeof UserDbCreateSchema>;

export type UserCreate = Pick<
  User,
  | "roleId"
  | "credits"
  | "status"
  | "username"
  | "phoneVerifiedAt"
  | "emailVerifiedAt"
  | "phone"
  | "email"
  | "firstName"
  | "lastName"
  | "alias"
> & {
  password: string;
};

export type UserUpdate = Pick<
  User,
  | "id"
  | "alias"
  | "username"
  | "credits"
  | "firstName"
  | "lastName"
  | "phone"
  | "roleId"
  | "status"
>;

export type UserUpdateInput = Input<typeof UserUpdateInput>;

export type UserLogin = {
  username: string;
  password: string;
};

export type UserRegister = UserLogin & {
  confirmPassword: string;
};

export type UserRegisterInput = Input<typeof UserRegisterInput>;

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

export type UserGetInput = Input<typeof UserGetInput>;
