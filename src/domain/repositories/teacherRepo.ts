import { Env } from "../..";
import { CommonPagination } from "../models/CommonModel";
import { Teacher, TeacherCreate, TeacherUpdate } from "../models/TeacherModel";

export async function teacherDbGet(
  params: { teacherId?: number; userId?: number; userUsername?: string },
  env: Env
) {
  const { teacherId, userId, userUsername } = params;

  const queryParams = [];
  let query = "SELECT * FROM teachers";
  let whereQuery = "";

  if (teacherId) {
    whereQuery += "id = ?";
    queryParams.push(teacherId);
  }

  if (userId) {
    whereQuery += whereQuery ? " AND " : "";
    whereQuery += "userId = ?";
    queryParams.push(userId);
  }

  if (userUsername) {
    whereQuery += whereQuery ? " AND " : "";
    whereQuery += "userId = (SELECT id FROM users WHERE username = ?)";
    queryParams.push(userUsername);
  }

  if (whereQuery) {
    query += ` WHERE ${whereQuery}`;
  }

  try {
    const teacher = await env.DB.prepare(query)
      .bind(...queryParams)
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

export async function teacherDbUpdate(params: TeacherUpdate, env: Env) {
  const { id, bio, alias, status } = params;
  const date = Date.now();

  try {
    const stmt = env.DB.prepare(
      "UPDATE teachers SET bio = ?, alias = ?, status = ?, updatedAt = ? WHERE id = ?"
    ).bind(bio, alias, status, date, id);
    await stmt.run();

    return true;
  } catch (e) {
    console.log(e);
    return null;
  }
}
