import { Env } from "../..";
import {
  Student,
  StudentCreate,
  StudentPagination,
} from "../models/StudentModel";
import {
  studentDbCreate,
  studentDbGet,
  studentDbGetAll,
  studentDbGetAllTotal,
} from "../repositories/studentRepo";
import { utilFailedResponse } from "./utilService";

export async function studentGet(
  params: Partial<{
    studentId: number;
    uuid: string;
    userUsername: string;
    userId: number;
  }>,
  env: Env
) {
  const student = await studentDbGet(params, env);

  return student as Student;
}

export async function studentGetAll(params: StudentPagination, env: Env) {
  const students = await studentDbGetAll(params, env);
  const totalElements: number = await studentDbGetAllTotal(env);

  return {
    content: students as Student[],
    totalElements,
    page: params.page,
    size: params.size,
  };
}

export async function studentCreate(
  params: StudentCreate,
  env: Env,
  createdById: number
) {
  const studentStmt = await studentDbCreate(params, env, createdById);
  try {
    await env.DB.batch(studentStmt);
    return true;
  } catch (e) {
    console.log(e);
    throw utilFailedResponse("Cannot create student", 500);
  }
}
