import { Input } from "valibot";
import { CommonPagination } from "./CommonModel";
import { ScheduleUpdateInput } from "../schemas/ScheduleSchema";

export type Schedule = {
  id: number;
  teacherId: number;
  startTime: number;
  endTime: number;
  weekDay: number;
  createdAt: number;
  updatedAt: number;
  createdById: number;
};

export type ScheduleCreate = Omit<
  Schedule,
  "id" | "createdAt" | "updatedAt" | "createdById"
>;
export type ScheduleCreateInput = Pick<Schedule, "startTime" | "endTime">;

export type ScheduleUpdateInput = Input<typeof ScheduleUpdateInput>;

export type SchedulePagination = {
  teacherId?: number;
} & CommonPagination;
