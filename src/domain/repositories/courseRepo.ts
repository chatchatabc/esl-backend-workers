import { Env } from "../..";
import {
  Course,
  CourseCreate,
  CoursePagination,
  CourseUpdate,
} from "../models/CourseModel";
import { utilQueryAddWhere } from "../services/utilService";

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

export async function courseDbGetAll(params: CoursePagination, env: Env) {
  const { page, size, teacherId } = params;

  const queryParams = [];
  let query = "SELECT * FROM courses";

  if (teacherId) {
    query = utilQueryAddWhere(query, "teacherId = ?");
    queryParams.push(teacherId);
  }
  query += " LIMIT ?, ?";
  queryParams.push((page - 1) * size, size);

  try {
    const stmt = env.DB.prepare(query).bind(...queryParams);
    const courses = await stmt.all<Course>();
    return courses;
  } catch (e) {
    console.log(e);
    return null;
  }
}

export async function courseDbGetAllTotal(
  params: { teacherId?: number },
  env: Env
) {
  const { teacherId } = params;

  const queryParams = [];
  let query = "SELECT COUNT(*) AS total FROM courses";

  if (teacherId) {
    query = utilQueryAddWhere(query, "teacherId = ?");
    queryParams.push(teacherId);
  }

  try {
    const stmt = env.DB.prepare(query).bind(...queryParams);
    const total = await stmt.first<number>("total");

    return total;
  } catch (e) {
    console.log(e);
    return null;
  }
}

export async function courseDbCreate(params: CourseCreate, env: Env) {
  try {
    const date = Date.now();
    const stmt = env.DB.prepare(
      "INSERT INTO courses (name, price, teacherId, description, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?)"
    ).bind(
      params.name,
      params.price,
      params.teacherId,
      params.description,
      date,
      date
    );
    await stmt.run();

    return true;
  } catch (e) {
    console.log(e);
    return null;
  }
}

export async function courseDbUpdate(params: CourseUpdate, env: Env) {
  try {
    const stmt = env.DB.prepare(
      "UPDATE courses SET name = ?, price = ?, teacherId = ?, description = ?, updatedAt WHERE id = ?"
    ).bind(
      params.name,
      params.price,
      params.teacherId,
      params.description,
      Date.now(),
      params.id
    );
    await stmt.run();

    return true;
  } catch (e) {
    console.log(e);
    return null;
  }
}
