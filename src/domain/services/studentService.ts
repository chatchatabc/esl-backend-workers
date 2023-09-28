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
  if (!student) {
    throw utilFailedResponse("Student not found", 404);
  }

  const data: Record<string, any> = {};
  const user: Record<string, any> = {} as any;

  Object.keys(student).forEach((key) => {
    if (key.startsWith("users_")) {
      const value = student[key as keyof Student];
      const newKey = key.replace("users_", "");
      user[newKey] = value;
    } else if (key.startsWith("roles_")) {
      const value = student[key as keyof Student];
      const newKey = key.replace("roles_", "");
      user.role = user.role ?? {};
      user.role[newKey] = value;
    } else {
      data[key] = student[key as keyof Student];
    }
  });
  data.user = user;

  return data as Student;
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
