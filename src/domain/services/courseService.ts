import { Env } from "../..";
import { courseDbGet } from "../repositories/courseRepo";
import { utilFailedResponse } from "./utilService";

export async function courseGet(params: { courseId: number }, env: Env) {
  const course = await courseDbGet(params, env);
  if (!course) {
    throw utilFailedResponse("Course does not exist", 400);
  }

  return course;
}
