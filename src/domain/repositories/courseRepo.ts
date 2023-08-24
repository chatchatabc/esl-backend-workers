import { Env } from "../..";
import { Course } from "../models/CourseModel";

export async function courseDbGet(params: { courseId: number }, env: Env) {
  try {
    const stmt = env.DB.prepare("SELECT * FROM courses WHERE id = ?").bind(
      params.courseId
    );
    return await stmt.first<Course>();
  } catch (e) {
    console.log(e);
    return null;
  }
}

export async function courseDbGetAll() {}
