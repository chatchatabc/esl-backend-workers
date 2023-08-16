import { Input } from "valibot";
import { CommonPagination } from "./CommonModel";
import { ScheduleUpdateInput } from "../schemas/ScheduleSchema";

export type Schedule = {
  id: number;
  userId: number;
  day: number;
  startTime: number;
  endTime: number;
  createdAt: number;
  updatedAt: number;
};

export type ScheduleCreate = Omit<Schedule, "id" | "createdAt" | "updatedAt">;
export type ScheduleCreateInput = Pick<Schedule, "startTime" | "endTime">;

export type ScheduleUpdateInput = Input<typeof ScheduleUpdateInput>;

export type SchedulePagination = {
  userId?: number;
} & CommonPagination;
