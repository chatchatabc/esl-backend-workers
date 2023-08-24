import { Env } from "../..";
import { Course, CoursePagination } from "../models/CourseModel";
import {
  courseDbGet,
  courseDbGetAll,
  courseDbGetAllTotal,
} from "../repositories/courseRepo";
import { utilFailedResponse } from "./utilService";

export async function courseGet(params: { courseId: number }, env: Env) {
  const course = await courseDbGet(params, env);
  if (!course) {
    throw utilFailedResponse("Course does not exist", 400);
  }

  return course;
}

export async function courseGetAll(params: CoursePagination, env: Env) {
  const courses = await courseDbGetAll(params, env);
  if (!courses) {
    throw utilFailedResponse("Cannot get courses", 500);
  }

  const totalElements = await courseDbGetAllTotal(params, env);
  if (totalElements === null) {
    throw utilFailedResponse("Cannot get total elements", 500);
  }

  return {
    content: courses.results as Course[],
    totalElements: totalElements as number,
    ...params,
  };
}
