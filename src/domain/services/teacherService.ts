import { Env } from "../..";
import { CommonPagination } from "../models/CommonModel";
import { Teacher } from "../models/TeacherModel";
import {
  teacherDbGet,
  teacherDbGetAll,
  teacherDbGetAllTotal,
} from "../repositories/teacherRepo";
import { utilFailedResponse } from "./utilService";

export async function teacherGet(params: { userId: number }, env: Env) {
  const teacher = await teacherDbGet(params, env);
  if (!teacher) {
    throw utilFailedResponse("Cannot get teacher", 500);
  }

  return teacher as Teacher;
}

export async function teacherGetAll(params: CommonPagination, env: Env) {
  const teachers = await teacherDbGetAll(params, env);
  if (!teachers) {
    throw utilFailedResponse("Cannot get teachers", 500);
  }

  const totalElements = await teacherDbGetAllTotal(env);
  if (totalElements === null) {
    throw utilFailedResponse("Cannot get total elements", 500);
  }

  return {
    content: teachers.results as Teacher[],
    totalElements,
    ...params,
  };
}
