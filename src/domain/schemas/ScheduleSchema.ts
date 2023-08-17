import { array, coerce, merge, minValue, number, object, pick } from "valibot";

export const Schedule = object({
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
  schedules: array(pick(Schedule, ["startTime", "endTime"])),
});

export const ScheduleCreateManyInputAdmin = merge([
  object({
    schedules: array(pick(Schedule, ["startTime", "endTime"])),
  }),
  pick(Schedule, ["userId"]),
]);

export const ScheduleUpdateInput = pick(Schedule, [
  "startTime",
  "endTime",
  "id",
  "userId",
]);

export const ScheduleUpdateManyInput = object({
  schedules: array(Schedule),
});

export const ScheduleUpdateManyInputAdmin = merge([
  object({
    schedules: array(Schedule),
  }),
  pick(Schedule, ["userId"]),
]);

export const ScheduleDeleteManyInput = object({ scheduleIds: array(number()) });

export const ScheduleDeleteManyInputAdmin = merge([
  object({
    scheduleIds: array(number()),
  }),
  pick(Schedule, ["userId"]),
]);
