import { Env } from "../..";
import { Student } from "../models/StudentModel";
import { studentDbGet, studentDbGetByUser } from "../repositories/studentRepo";
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
