import { Env } from "../..";
import { teacherDbGet } from "../repositories/teacherRepo";
import { utilFailedResponse } from "./utilService";

export async function teacherGet(params: { userId: number }, env: Env) {
  const teacher = await teacherDbGet(params, env);
  if (!teacher) {
    throw utilFailedResponse("Cannot get teacher", 500);
  }

  return teacher;
}
