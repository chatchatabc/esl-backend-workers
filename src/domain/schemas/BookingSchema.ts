import {
  array,
  custom,
  merge,
  minLength,
  minValue,
  nullish,
  number,
  object,
  optional,
  partial,
  pick,
  string,
  transform,
} from "valibot";
import { v4 as uuidv4 } from "uuid";

const Schema = object({
  uuid: string("UUID must be a string", [minLength(1, "UUID is required")]),
  teacherId: number("Teacher ID must be a number", [
    minValue(1, "Teacher ID must be greater than 0"),
  ]),
  start: number("Start date must be a timestamp", [
    minValue(Date.now(), "Start date must be greater than current time"),
    custom((value) => {
      return value % 1800 === 0;
    }, "Start date must be a multiple of 30 minutes"),
  ]),
  end: number("End date must be a timestamp", [
    minValue(Date.now(), "End date must be greater than current time"),
    custom((value) => {
      return value % 1800 === 0;
    }, "End date must be a multiple of 30 minutes"),
  ]),
  courseId: number("Course ID must be a number", [
    minValue(1, "Course ID must be greater than 0"),
  ]),
  userId: number("User ID must be a number", [
    minValue(1, "User ID must be greater than 0"),
  ]),
  studentId: number("Student ID must be a number", [
    minValue(1, "Student ID must be greater than 0"),
  ]),
  status: number("Status must be a number", [
    minValue(1, "Status must be greater than 0"),
  ]),
  amount: number("Amount must be a number", [
    minValue(0, "Amount must be greater than 0"),
  ]),
  id: number("ID must be a number", [minValue(1, "ID must be greater than 0")]),
  message: nullish(string("Message must be a string")),
  advanceBooking: optional(
    number("Advance booking must be a number", [
      minValue(1, "Advance booking must be greater than 0"),
    ])
  ),
  bookingIds: array(
    number("Booking ID must be a number", [
      minValue(1, "Booking ID must be greater than 0"),
    ])
  ),
});

export const BookingCreateSchema = transform(
  merge([
    pick(Schema, [
      "uuid",
      "courseId",
      "teacherId",
      "studentId",
      "amount",
      "start",
      "end",
      "status",
    ]),
    partial(pick(Schema, ["message"])),
  ]),
  (input) => {
    return { ...input, message: input.message ?? null };
  }
);

export const BookingCreateInput = transform(
  pick(Schema, ["teacherId", "start", "end", "courseId"]),
  (input) => {
    return {
      ...input,
      status: 1,
      message: null,
      amount: 0,
      uuid: uuidv4(),
    };
  }
);

export const BookingCreateByAdminInput = transform(
  merge([
    pick(Schema, ["teacherId", "start", "end", "studentId", "courseId"]),
    partial(pick(Schema, ["amount", "advanceBooking", "status", "message"])),
  ]),
  (input) => {
    return {
      ...input,
      status: input.status ?? 1,
      message: input.message ?? null,
      uuid: uuidv4(),
    };
  }
);

export const BookingCancelInput = pick(Schema, ["id"]);

export const BookingCancelInputAdmin = pick(Schema, ["id", "userId"]);

export const BookingCompleteInputAdmin = pick(Schema, ["id"]);

export const BookingUpdateStatusManyInput = pick(Schema, [
  "bookingIds",
  "status",
]);

export const BookingUpdateInput = pick(Schema, ["status", "id"]);

export const BookingStatisticsTeacherSchema = transform(
  merge([pick(Schema, ["teacherId"]), partial(pick(Schema, ["start", "end"]))]),
  (input) => {
    return {
      ...input,
      start: input.start ?? Date.now() - 1000 * 60 * 60 * 24 * 30,
      end: input.end ?? Date.now(),
    };
  }
);
