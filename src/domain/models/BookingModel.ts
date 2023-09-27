import { Input } from "valibot";
import { CommonPagination } from "./CommonModel";
import {
  BookingCancelInputAdmin,
  BookingCompleteInputAdmin,
  BookingCreateByAdminInput,
  BookingCreateInput,
  BookingCreateSchema,
  BookingStatisticsTeacherSchema,
  BookingUpdateInput,
  BookingUpdateStatusManyInput,
} from "../schemas/BookingSchema";
import { Course } from "./CourseModel";
import { Teacher } from "./TeacherModel";
import { Student } from "./StudentModel";

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
  createdById: number;

  message: string | null;

  student: Student;
  teacher: Teacher;
  course: Course;
};

export type BookingUpdate = Pick<Booking, "id" | "status">;

export type BookingCreate = Input<typeof BookingCreateSchema>;

export type BookingCreateInput = Input<typeof BookingCreateInput>;

export type BookingCreateByAdminInput = Input<typeof BookingCreateByAdminInput>;

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

export type BookingStatisticsTeacher = Input<
  typeof BookingStatisticsTeacherSchema
>;
