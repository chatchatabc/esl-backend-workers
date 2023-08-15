import { Env } from "../..";
import { CommonPagination } from "../models/CommonModel";
import { UserRole } from "../models/UserModel";

export async function roleDbGet(params: { roleId: number }, env: Env) {
  try {
    const stmt = env.DB.prepare("SELECT * FROM roles WHERE id = ?").bind(
      params.roleId
    );
    return await stmt.first<UserRole>();
  } catch (e) {
    console.log(e);
    return null;
  }
}

export async function roleDbGetAll(params: CommonPagination, env: Env) {
  try {
    const stmt = env.DB.prepare("SELECT * FROM roles LIMIT ? OFFSET ?").bind(
      params.size,
      (params.page - 1) * params.size
    );
    return await stmt.all<UserRole>();
  } catch (e) {
    console.log(e);
    return null;
  }
}

export async function roleDbGetAllTotal(env: Env) {
  try {
    const stmt = env.DB.prepare("SELECT COUNT(*) AS total FROM roles");
    const total = await stmt.first("total");
    return Number(total);
  } catch (e) {
    console.log(e);
    return null;
  }
}
