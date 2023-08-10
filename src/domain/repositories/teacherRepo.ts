import { Env } from "../..";
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
    return undefined;
  }
}
