import { Env } from "../..";
import { CommonPagination } from "../models/CommonModel";
import { Teacher, TeacherCreate, TeacherUpdate } from "../models/TeacherModel";
import {
  teacherDBCreate,
  teacherDbGet,
  teacherDbGetAll,
  teacherDbGetAllTotal,
  teacherDbUpdate,
  teacherDbValidateCourse,
} from "../repositories/teacherRepo";
import { userGet } from "./userService";
import { utilFailedResponse } from "./utilService";

export async function teacherGet(
  params: { teacherId?: number; userId?: number; userUsername?: string },
  env: Env
) {
  if (!params.teacherId && !params.userId && !params.userUsername) {
    throw utilFailedResponse("Invalid params", 400);
  }

  const teacher = await teacherDbGet(params, env);
  if (!teacher) {
    throw utilFailedResponse("Cannot get teacher", 500);
  }

  return teacher as Teacher;
}

export async function teacherGetAll(params: CommonPagination, env: Env) {
  const content: Teacher[] = await teacherDbGetAll(params, env);
  const totalElements: number = await teacherDbGetAllTotal(env);

  return {
    content,
    totalElements,
    page: params.page,
    size: params.size,
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

export async function teacherCreate(
  params: TeacherCreate,
  env: Env,
  createdById: number
) {
  const stmts = await teacherDBCreate(params, env, createdById);
  try {
    await env.DB.batch(stmts);
    return true;
  } catch (e) {
    console.log(e);
    throw utilFailedResponse("Cannot create teacher", 500);
  }
}

export async function teacherUpdate(params: TeacherUpdate, env: Env) {
  await teacherGet({ teacherId: params.id }, env);

  const query = await teacherDbUpdate(params, env);
  if (!query) {
    throw utilFailedResponse("Cannot update teacher", 500);
  }

  return true;
}
