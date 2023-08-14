export type User = {
  username: string;
  password?: string;
  firstName?: string | null;
  lastName?: string | null;
  phone?: string | null;
  email?: string | null;

  id: number;
  roleId: number;
  createdAt: number;
  updatedAt: number;
  credit: number;
  phoneVerifiedAt?: number | null;
  emailVerifiedAt?: number | null;

  role?: UserRole;
};

export type UserPersonalInformation = Pick<User, "firstName" | "lastName">;

export type UserContactInformation = Pick<
  User,
  "phone" | "email" | "phoneVerifiedAt" | "emailVerifiedAt"
>;

export type UserRole = {
  name: string;
  createdAt: string;
  updatedAt: string;

  id: number;
};

export type UserRegisterInput = UserLogin & {
  confirmPassword: string;
};

export type UserLogin = Pick<User, "username"> & {
  password: string;
};

export type UserCreate = Omit<
  User,
  "id" | "createdAt" | "updatedAt" | "role"
> & {
  password: string;
};

export type UserCreateInput = UserCreate & {
  confirmPassword: string;
};
