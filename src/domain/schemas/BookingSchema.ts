import {
  custom,
  minValue,
  nullish,
  number,
  object,
  optional,
  pick,
  string,
  transform,
} from "valibot";

const Schema = object({
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
  status: optional(
    number("Status must be a number", [
      minValue(1, "Status must be greater than 0"),
    ])
  ),
  amount: optional(
    number("Amount must be a number", [
      minValue(1, "Amount must be greater than 0"),
    ])
  ),
  bookingId: number("ID must be a number", [
    minValue(1, "ID must be greater than 0"),
  ]),
  message: nullish(string("Message must be a string")),
});

export const BookingCreateInput = transform(
  pick(Schema, ["teacherId", "start", "end", "courseId"]),
  (input) => {
    return {
      ...input,
      status: 1,
      amount: null,
      message: null,
    };
  }
);

export const BookingCreateInputAdmin = transform(
  pick(Schema, [
    "teacherId",
    "start",
    "end",
    "userId",
    "courseId",
    "message",
    "status",
    "amount",
  ]),
  (input) => {
    const { message = null, status = 1, amount = null } = input;
    return { ...input, status, message, amount };
  }
);

export const BookingCancelInput = pick(Schema, ["bookingId"]);

export const BookingCancelInputAdmin = pick(Schema, ["bookingId", "userId"]);
