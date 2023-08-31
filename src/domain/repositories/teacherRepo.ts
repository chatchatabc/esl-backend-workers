import { Env } from "../..";
import { CommonPagination } from "../models/CommonModel";
import { Teacher, TeacherCreate } from "../models/TeacherModel";

export async function teacherDbGet(params: { teacherId: number }, env: Env) {
  const { teacherId } = params;

  try {
    const teacher = await env.DB.prepare("SELECT * FROM teachers WHERE id = ?")
      .bind(teacherId)
      .first<Teacher>();

    return teacher;
  } catch (e) {
    console.log(e);
    return null;
  }
}

export async function teacherDbGetByUser(params: { userId: number }, env: Env) {
  const { userId } = params;

  try {
    const teacher = await env.DB.prepare(
      "SELECT * FROM teachers WHERE userId = ?"
    )
      .bind(userId)
      .first<Teacher>();

    return teacher;
  } catch (e) {
    console.log(e);
    return null;
  }
}

export async function teacherDbGetAll(params: CommonPagination, env: Env) {
  const { page, size } = params;

  try {
    const teachers = await env.DB.prepare("SELECT * FROM teachers LIMIT ?, ?")
      .bind((page - 1) * size, size)
      .all<Teacher>();

    return teachers;
  } catch (e) {
    console.log(e);
    return null;
  }
}

export async function teacherDbGetAllTotal(env: Env) {
  try {
    const stmt = env.DB.prepare("SELECT COUNT(*) as total FROM teachers");
    const total = await stmt.first<number>("total");
    return total;
  } catch (e) {
    console.log(e);
    return null;
  }
}

export async function teacherDbValidateCourse(
  params: { teacherId: number; courseId: number },
  env: Env
) {
  try {
    const { teacherId, courseId } = params;
    const stmt = env.DB.prepare(
      "SELECT COUNT(*) as total FROM teachersCourses WHERE teacherId = ? AND courseId = ?"
    );
    const total = await stmt.bind(teacherId, courseId).first<number>("total");

    return total !== null && total > 0;
  } catch (e) {
    console.log(e);
    return null;
  }
}

export async function teacherDBCreate(params: TeacherCreate, env: Env) {
  const { userId, bio, alias, status } = params;
  const date = Date.now();

  try {
    const stmt = env.DB.prepare(
      "INSERT INTO teachers (userId, bio, alias, status, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?)"
    ).bind(userId, bio, alias, status, date, date);
    await stmt.run();

    return true;
  } catch (e) {
    console.log(e);
    return null;
  }
}
