import { Env } from "../..";
import { Student } from "../models/StudentModel";
import { studentDbGet } from "../repositories/studentRepo";
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
