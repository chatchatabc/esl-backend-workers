import { CommonPagination } from "./CommonModel";
import type { User } from "./UserModel";

export type Booking = {
  createdAt: number;
  updatedAt: number;

  student?: User;
  teacher?: User;
} & BookingUpdate;

export type BookingUpdate = {
  id: number;
} & BookingCreate;

export type BookingCreate = {
  teacherId: number;
  start: number;
  end: number;
  studentId: number;
  status: number;
  amount: number;

  message?: string;
};

export type BookingPagination = {
  userId?: number;
  status?: number;
} & CommonPagination;
