import { Input } from "valibot";
import { CommonPagination } from "./CommonModel";
import type { User } from "./UserModel";
import {
  BookingCancelInputAdmin,
  BookingCompleteInputAdmin,
  BookingCreateInput,
  BookingCreateInputAdmin,
  BookingUpdateInput,
  BookingUpdateStatusManyInput,
} from "../schemas/BookingSchema";
import { Course } from "./CourseModel";
import { Teacher } from "./TeacherModel";

export type Booking = {
  id: number;
  uuid: string;
  teacherId: number;
  courseId: number;
  studentId: number;
  start: number;
  end: number;
  amount: number;
  status: number;
  createdAt: number;
  updatedAt: number;
  createdBy: number;

  message: string | null;

  student: User;
  teacher: Teacher;
  course: Course;
};

export type BookingUpdate = Pick<Booking, "id" | "status">;

export type BookingCreate = Pick<
  Booking,
  | "teacherId"
  | "courseId"
  | "studentId"
  | "start"
  | "end"
  | "status"
  | "message"
  | "amount"
>;

export type BookingCreateInput = Input<typeof BookingCreateInput>;

export type BookingCreateInputAdmin = Input<typeof BookingCreateInputAdmin>;

export type BookingPagination = {
  studentId?: number;
  status?: number[];
  day?: number;
  teacherId?: number;
  sort?: string;
  start?: number;
  end?: number;
  bookingIds?: number[];
} & CommonPagination;

export type BookingCancelInputAdmin = Input<typeof BookingCancelInputAdmin>;

export type BookingCompleteInputAdmin = Input<typeof BookingCompleteInputAdmin>;

export type BookingUpdateInput = Input<typeof BookingUpdateInput>;

export type BookingUpdateStatusManyInput = Input<
  typeof BookingUpdateStatusManyInput
>;
