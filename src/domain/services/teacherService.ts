import { Env } from "../..";
import { CommonPagination } from "../models/CommonModel";
import { Teacher, TeacherCreate, TeacherUpdate } from "../models/TeacherModel";
import {
  teacherDBCreate,
  teacherDbGet,
  teacherDbGetAll,
  teacherDbGetAllTotal,
  teacherDbGetByUser,
  teacherDbUpdate,
  teacherDbValidateCourse,
} from "../repositories/teacherRepo";
import { userGet } from "./userService";
import { utilFailedResponse } from "./utilService";

export async function teacherGet(params: { teacherId: number }, env: Env) {
  const teacher = await teacherDbGet(params, env);
  if (!teacher) {
    throw utilFailedResponse("Cannot get teacher", 500);
  }
  const user = await userGet({ userId: teacher.userId }, env);
  teacher.user = user;

  return teacher as Teacher;
}

export async function teacherGetByUser(params: { userId: number }, env: Env) {
  const teacher = await teacherDbGetByUser(params, env);
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
    totalElements: totalElements as number,
    ...params,
  };
}

export async function teacherValidateCourse(
  params: { teacherId: number; courseId: number },
  env: Env
) {
  const { teacherId, courseId } = params;
  const isValid = await teacherDbValidateCourse({ teacherId, courseId }, env);
  if (isValid === null) {
    throw utilFailedResponse("Cannot validate course", 500);
  }

  return isValid;
}

export async function teacherCreate(params: TeacherCreate, env: Env) {
  const user = await userGet({ userId: params.userId }, env);
  if (user.roleId !== 3) {
    throw utilFailedResponse("User is not a teacher", 500);
  }

  const teacher = await teacherDbGetByUser({ userId: params.userId }, env);
  if (teacher) {
    throw utilFailedResponse("Teacher already exists", 500);
  }

  const query = await teacherDBCreate(params, env);
  if (!query) {
    throw utilFailedResponse("Cannot create teacher", 500);
  }

  return true;
}

export async function teacherUpdate(params: TeacherUpdate, env: Env) {
  await teacherGet({ teacherId: params.id }, env);

  const query = await teacherDbUpdate(params, env);
  if (!query) {
    throw utilFailedResponse("Cannot update teacher", 500);
  }

  return true;
}
