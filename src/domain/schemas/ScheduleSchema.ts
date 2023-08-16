import { array, coerce, minValue, number, object, pick } from "valibot";

const Schema = object({
  id: coerce(
    number("Invalid schedule id", [minValue(1, "ID must be greater than 0")]),
    Number
  ),
  userId: coerce(
    number("Invalid teacher id", [minValue(1, "ID must be greater than 0")]),
    Number
  ),
  startTime: coerce(
    number("Invalid start time timestamp", [minValue(0, "Invalid timestamp")]),
    Number
  ),
  endTime: coerce(
    number("Invalid end time timestamp", [minValue(0, "Invalid timestamp")]),
    Number
  ),
});

export const ScheduleCreateManyInput = object({
  schedules: array(pick(Schema, ["startTime", "endTime"])),
});

export const ScheduleCreateManyInputAdmin = object({
  schedules: array(pick(Schema, ["startTime", "endTime"])),
  userId: pick(Schema, ["userId"]),
});

export const ScheduleUpdateInput = pick(Schema, [
  "startTime",
  "endTime",
  "id",
  "userId",
]);

export const ScheduleUpdateManyInput = object({
  schedules: array(Schema),
});
