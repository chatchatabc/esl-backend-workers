import { Input } from "valibot";
import { CommonPagination } from "./CommonModel";
import type { User } from "./UserModel";
import {
  BookingCancelInputAdmin,
  BookingCreateInput,
} from "../schemas/BookingSchema";
import { Course } from "./CourseModel";

export type Booking = {
  id: number;
  teacherId: number;
  courseId: number;
  userId: number;
  start: number;
  end: number;
  status: number;
  createdAt: number;
  updatedAt: number;

  message: string | null;

  user?: User;
  teacher?: User;
  course?: Course;
};

export type BookingUpdate = Omit<Booking, "student" | "teacher">;

export type BookingCreate = Pick<
  Booking,
  "teacherId" | "courseId" | "userId" | "start" | "end" | "status" | "message"
>;

export type BookingCreateInput = Input<typeof BookingCreateInput>;

export type BookingPagination = {
  userId?: number;
  status?: number;
} & CommonPagination;

export type BookingCancelInputAdmin = Input<typeof BookingCancelInputAdmin>;
