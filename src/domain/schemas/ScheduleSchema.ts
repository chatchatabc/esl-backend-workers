import { array, merge, minValue, number, object, partial, pick } from "valibot";

export const ScheduleSchema = object({
  id: number("ID must be a number", [minValue(1, "ID must be greater than 0")]),
  teacherId: number("Teacher ID must be a number", [
    minValue(1, "ID must be greater than 0"),
  ]),
  startTime: number("Start time must be a number", [
    minValue(0, "Invalid timestamp"),
  ]),
  endTime: number("End time must be a number", [
    minValue(0, "Invalid timestamp"),
  ]),
  weekDay: number("Weekday must be a number"),
});

export const ScheduleCreateManyInput = merge([
  object({
    schedules: array(pick(ScheduleSchema, ["startTime", "endTime"])),
  }),
  pick(ScheduleSchema, ["teacherId"]),
]);

export const ScheduleUpdateSchema = merge([
  pick(ScheduleSchema, ["id"]),
  partial(
    pick(ScheduleSchema, ["startTime", "endTime", "teacherId", "weekDay"])
  ),
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
  schedules: array(ScheduleUpdateInput),
});

export const ScheduleUpdateManyByAdminInput = merge([
  object({
    schedules: array(ScheduleUpdateInput),
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
