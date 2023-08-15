export type User = {
  id: number;
  createdAt: number;
  updatedAt: number;
  credit: number;
  status: number;
  roleId: number;
  username: string;
  password?: string;

  phoneVerifiedAt: number | null;
  emailVerifiedAt: number | null;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  email: string | null;

  role?: UserRole;
};

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

export type UserUpdateInput = Omit<
  UserUpdate,
  "createdAt" | "updatedAt" | "password" | "phoneVerifiedAt" | "emailVerifiedAt"
>;

export type UserRole = {
  name: string;
  createdAt: string;
  updatedAt: string;
  id: number;
};
