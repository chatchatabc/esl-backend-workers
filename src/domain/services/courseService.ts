import { Env } from "../..";
import { Course, CourseCreate, CoursePagination } from "../models/CourseModel";
import {
  courseDbCreate,
  courseDbGet,
  courseDbGetAll,
  courseDbGetAllTotal,
} from "../repositories/courseRepo";
import { teacherGet } from "./teacherService";
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

export async function courseCreate(params: CourseCreate, env: Env) {
  // Check if teacher exists
  await teacherGet({ teacherId: params.teacherId }, env);

  const query = await courseDbCreate(params, env);
  if (!query) {
    throw utilFailedResponse("Cannot create course", 500);
  }

  return query;
}
