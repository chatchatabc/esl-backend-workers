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
  studentDbGetByUser,
} from "../repositories/studentRepo";
import { userGet } from "./userService";
import { utilFailedResponse } from "./utilService";

export async function studentGet(
  params: Partial<{ studentId: number; uuid: string }>,
  env: Env
) {
  const { studentId, uuid } = params;
  if (!studentId && !uuid) {
    throw utilFailedResponse("Student ID or UUID is required", 400);
  }
  const studentStmt = await studentDbGet(params, env);

  try {
    const query = await studentStmt.run<Student>();
    const students = query.results;
    if (!students.length) {
      throw utilFailedResponse("Student not found", 404);
    }
    const student = students[0];
    student.user = await userGet({ userId: student.userId }, env);
    return student;
  } catch (e) {
    console.log(e);
    throw utilFailedResponse("Cannot get student", 500);
  }
}

export async function studentGetByUser(
  params: Partial<{ userId: number; username: string }>,
  env: Env
) {
  const { userId, username } = params;
  if (!userId && !username) {
    throw utilFailedResponse("User ID or username is required", 400);
  }
  const student = await studentDbGetByUser(params, env);
  if (!student) {
    throw utilFailedResponse("Student not found", 404);
  }
  student.user = await userGet({ userId: student.userId }, env);
  return student as Student;
}

export async function studentGetAll(params: StudentPagination, env: Env) {
  const studentsQuery = await studentDbGetAll(params, env);
  const totalElements: number = await studentDbGetAllTotal(env);

  const students: Student[] = [];
  for (const student of studentsQuery.results) {
    student.user = await userGet({ userId: student.userId }, env);
    students.push(student);
  }

  return {
    content: students,
    totalElements,
    page: params.page,
    size: params.size,
  };
}

export async function studentCreate(
  params: StudentCreate,
  env: Env,
  createdBy: number
) {
  const studentStmt = await studentDbCreate(params, env, createdBy);
  try {
    await env.DB.batch(studentStmt);
    return true;
  } catch (e) {
    console.log(e);
    throw utilFailedResponse("Cannot create student", 500);
  }
}
