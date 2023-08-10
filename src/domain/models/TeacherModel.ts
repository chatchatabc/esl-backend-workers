import type { User } from "./UserModel";

export type Teacher = {
  id: number;
  userId: number;
  price: number;
  interval: number;
  createdAt: number;
  updatedAt: number;

  name?: string | null;
  alias?: string | null;

  user?: User;
};
