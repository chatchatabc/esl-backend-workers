export type User = {
  username: string;
  password?: string;

  id: number;
  roleId: number;
  createdAt: number;
  updatedAt: number;
  credit: number;

  role?: UserRole;
} & UserPersonalInformation &
  UserContactInformation;

export type UserPersonalInformation = {
  firstName?: string | null;
  lastName?: string | null;
};

export type UserContactInformation = {
  phone?: string | null;
  email?: string | null;
  phoneVerifiedAt?: number | null;
  emailVerifiedAt?: number | null;
};

export type UserRole = {
  name: string;
  createdAt: string;
  updatedAt: string;

  id: number;
};

export type UserRegister = {
  roleId: number;
  credit: number;
} & UserRegisterInput;

export type UserRegisterInput = {
  confirmPassword: string;
} & UserLogin;

export type UserLogin = {
  username: string;
  password: string;
};
