import { CommonPagination } from "./CommonModel";

export type Schedule = {
  id: number;
  teacherId: number;
  day: number;
  startTime: number;
  endTime: number;
  createdAt: number;
  updatedAt: number;
};

export type ScheduleCreate = Omit<Schedule, "id" | "createdAt" | "updatedAt">;
export type ScheduleCreateInput = Omit<ScheduleCreate, "day">;

export type ScheduleUpdateInput = Omit<
  Schedule,
  "createdAt" | "updatedAt" | "day"
>;

export type SchedulePagination = {
  userId?: number;
} & CommonPagination;
