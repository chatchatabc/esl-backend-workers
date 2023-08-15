import { Env } from "../..";
import { CommonPagination } from "../models/CommonModel";
import { User, UserCreate, UserRole } from "../models/UserModel";

export async function userDbGetByUsername(
  params: { username: string },
  env: Env
) {
  const { username } = params;

  const results = (await env.DB.prepare(
    "SELECT * FROM users WHERE username = ?"
  )
    .bind(username)
    .first()) as User | null;

  return results;
}

export async function userDbInsert(body: UserCreate, env: Env) {
  const {
    username,
    password,
    roleId,
    credit,
    status,
    email,
    phone,
    firstName,
    lastName,
    phoneVerifiedAt,
    emailVerifiedAt,
  } = body;
  const date = Date.now();
  try {
    await env.DB.prepare(
      "INSERT INTO users (username, password, createdAt, updatedAt, roleId, credit, email, phone, firstName, lastName, phoneVerifiedAt, emailVerifiedAt, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
    )
      .bind(
        username,
        password,
        date,
        date,
        roleId,
        credit,
        email,
        phone,
        firstName,
        lastName,
        phoneVerifiedAt,
        emailVerifiedAt,
        status
      )
      .run();
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
}

export async function userDbGet(params: { userId: number }, env: Env) {
  const { userId } = params;

  try {
    const user = await env.DB.prepare("SELECT * FROM users WHERE id = ?")
      .bind(userId)
      .first<User>();

    return user;
  } catch (e) {
    console.log(e);
    return null;
  }
}

export async function userDbGetAll(params: CommonPagination, env: Env) {
  const { page, size } = params;
  try {
    const users = await env.DB.prepare("SELECT * FROM users LIMIT ? OFFSET ?")
      .bind(size, (page - 1) * size)
      .all<User>();

    return users;
  } catch (e) {
    console.log(e);
    return undefined;
  }
}

export async function userDbGetAllRole(params: CommonPagination, env: Env) {
  const { page, size } = params;
  try {
    const roles = await env.DB.prepare("SELECT * FROM roles LIMIT ? OFFSET ?")
      .bind(size, (page - 1) * size)
      .all<UserRole>();

    return roles;
  } catch (e) {
    console.log(e);
    return undefined;
  }
}

export async function userDbGetAllTotal(env: Env) {
  try {
    const stmt = env.DB.prepare("SELECT COUNT(*) AS total FROM users");
    const total = await stmt.first("total");
    return Number(total);
  } catch (e) {
    console.log(e);
    return undefined;
  }
}

export async function userDbGetAllRoleTotal(env: Env) {
  try {
    const stmt = env.DB.prepare("SELECT COUNT(*) AS total FROM roles");
    const total = await stmt.first("total");
    return Number(total);
  } catch (e) {
    console.log(e);
    return undefined;
  }
}

export async function userDbUpdate(params: User, env: Env) {
  const {
    id,
    username,
    password,
    roleId,
    firstName,
    lastName,
    phone,
    email,
    phoneVerifiedAt,
    emailVerifiedAt,
    status,
    credit,
  } = params;

  const date = new Date().getTime();
  try {
    await env.DB.prepare(
      "UPDATE users SET username = ?, password = ?, roleId = ?, updatedAt = ?, firstName = ?, lastName = ?, phone = ?, email = ?, phoneVerifiedAt = ?, emailVerifiedAt = ?, status = ?, credit = ? WHERE id = ?"
    )
      .bind(
        username,
        password,
        roleId,
        date,
        firstName,
        lastName,
        phone,
        email,
        phoneVerifiedAt,
        emailVerifiedAt,
        status,
        credit,
        id
      )
      .run();

    return true;
  } catch (e) {
    console.log(e);
    return null;
  }
}

export async function userDbGetRole(params: { roleId: number }, env: Env) {
  const { roleId } = params;

  try {
    const role = await env.DB.prepare("SELECT * FROM roles WHERE id = ?")
      .bind(roleId)
      .first<UserRole>();

    return role;
  } catch (e) {
    console.log(e);
    return null;
  }
}
