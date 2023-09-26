import {
  array,
  coerce,
  merge,
  minValue,
  number,
  object,
  partial,
  pick,
} from "valibot";

export const ScheduleSchema = object({
  id: coerce(
    number("Invalid schedule id", [minValue(1, "ID must be greater than 0")]),
    Number
  ),
  teacherId: coerce(
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
  schedules: array(pick(ScheduleSchema, ["startTime", "endTime"])),
});

export const ScheduleUpdateSchema = merge([
  pick(ScheduleSchema, ["id"]),
  partial(pick(ScheduleSchema, ["startTime", "endTime", "teacherId"])),
]);

export const ScheduleCreateManyInputAdmin = merge([
  object({
    schedules: array(pick(ScheduleSchema, ["startTime", "endTime"])),
  }),
  pick(ScheduleSchema, ["teacherId"]),
]);

export const ScheduleUpdateInput = pick(ScheduleSchema, [
  "startTime",
  "endTime",
  "id",
  "teacherId",
]);

export const ScheduleUpdateManyInput = object({
  schedules: array(ScheduleSchema),
});

export const ScheduleUpdateManyInputAdmin = merge([
  object({
    schedules: array(ScheduleSchema),
  }),
  pick(ScheduleSchema, ["teacherId"]),
]);

export const ScheduleDeleteManyInput = object({ scheduleIds: array(number()) });

export const ScheduleDeleteManyInputAdmin = merge([
  object({
    scheduleIds: array(number()),
  }),
  pick(ScheduleSchema, ["teacherId"]),
]);
