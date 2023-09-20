import { Env } from "../..";
import { Student, StudentCreate } from "../models/StudentModel";
import {
  studentDbCreate,
  studentDbGet,
  studentDbGetByUser,
} from "../repositories/studentRepo";
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
    return students[0];
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
  const studentStmt = await studentDbGetByUser(params, env);

  try {
    const query = await studentStmt.run<Student>();
    const students = query.results;
    if (!students.length) {
      throw utilFailedResponse("Student not found", 404);
    }
    return students[0];
  } catch (e) {
    console.log(e);
    throw utilFailedResponse("Cannot get student", 500);
  }
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
