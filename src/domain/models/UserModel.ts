export type User = {
  id: number;
  username: string;
  password?: string;
  phone: string;
  createdAt: string;
  updatedAt: string;

  roles: UserRole[];
};

export type UserRole = {
  id: number;
  name: string;
};
