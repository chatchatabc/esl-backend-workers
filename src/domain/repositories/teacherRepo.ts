import { Env } from "../..";
import { CommonPagination } from "../models/CommonModel";
import { Teacher } from "../models/TeacherModel";

export async function teacherDbGet(params: { userId: number }, env: Env) {
  const { userId } = params;

  try {
    const user = await env.DB.prepare("SELECT * FROM teachers WHERE userId = ?")
      .bind(userId)
      .first<Teacher>();

    return user;
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
    const total = await stmt.first<{ total: number }>("total");
    return total;
  } catch (e) {
    console.log(e);
    return null;
  }
}
