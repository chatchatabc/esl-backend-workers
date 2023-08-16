import {
  custom,
  minValue,
  number,
  object,
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
  studentId: number("Student ID must be a number", [
    minValue(1, "Student ID must be greater than 0"),
  ]),
  status: number("Status must be a number", [
    minValue(1, "Status must be greater than 0"),
  ]),
  amount: number("Amount must be a number", [
    minValue(1, "Amount must be greater than 0"),
  ]),
  message: string("Message must be a string"),
});

export const BookingCreateInput = transform(
  pick(Schema, ["teacherId", "start", "end"]),
  (input) => {
    return {
      ...input,
      status: 1,
    };
  }
);
