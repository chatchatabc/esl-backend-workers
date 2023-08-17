import { Input } from "valibot";
import { CommonPagination } from "./CommonModel";
import type { User } from "./UserModel";
import { BookingCancelInputAdmin } from "../schemas/BookingSchema";

export type Booking = {
  id: number;
  teacherId: number;
  start: number;
  end: number;
  studentId: number;
  status: number;
  amount: number;
  createdAt: number;
  updatedAt: number;

  message: string | null;

  student?: User;
  teacher?: User;
};

export type BookingUpdate = Omit<Booking, "student" | "teacher">;

export type BookingCreate = Omit<
  Booking,
  "createdAt" | "updatedAt" | "id" | "teacher" | "student"
>;

export type BookingCreateInput = Omit<
  BookingCreate,
  "amount" | "status" | "message"
> &
  Partial<Pick<BookingCreate, "amount" | "status" | "message">>;

export type BookingPagination = {
  userId?: number;
  status?: number;
} & CommonPagination;

export type BookingCancelInputAdmin = Input<typeof BookingCancelInputAdmin>;
