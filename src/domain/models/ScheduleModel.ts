export type Schedule = {
  id: number;
} & ScheduleCreate;

export type ScheduleCreate = {
  day: number;
} & ScheduleCreateInput;

export type ScheduleDayAndUser = {
  day: number;
  userId: number;
};

export type ScheduleTime = {
  startTime: number;
  endTime: number;
};

export type ScheduleUpdateInput = {
  id: number;
  teacherId: number;
} & ScheduleTime;

export type ScheduleCreateInput = {
  teacherId: number;
} & ScheduleTime;
