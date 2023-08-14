import { Env } from "../..";
import { CommonPagination } from "../models/CommonModel";
import { User, UserCreate } from "../models/UserModel";

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
    email = null,
    phone = null,
    firstName = null,
    lastName = null,
    phoneVerifiedAt = null,
    emailVerifiedAt = null,
  } = body;
  const date = Date.now();
  try {
    await env.DB.prepare(
      "INSERT INTO users (username, password, createdAt, updatedAt, roleId, credit, email, phone, firstName, lastName, phoneVerifiedAt, emailVerifiedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
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
        emailVerifiedAt
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

export async function userDbGetAllTotal(env: Env) {
  try {
    const stmt = env.DB.prepare("SELECT COUNT(*) AS total FROM messages");
    const total = await stmt.first("total");
    return Number(total);
  } catch (e) {
    console.log(e);
    return undefined;
  }
}

export async function userDbUpdate(params: User, env: Env) {
  const {
    id = null,
    username = null,
    password = null,
    roleId = null,
    firstName = null,
    lastName = null,
    phone = null,
    email = null,
    phoneVerifiedAt = null,
    emailVerifiedAt = null,
  } = params;

  const date = new Date().getTime();
  try {
    const query = await env.DB.prepare(
      "UPDATE users SET username = ?, password = ?, roleId = ?, updatedAt = ?, firstName = ?, lastName = ?, phone = ?, email = ?, phoneVerifiedAt = ?, emailVerifiedAt = ? WHERE id = ?"
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
        id
      )
      .run();

    return true;
  } catch (e) {
    console.log(e);
    return null;
  }
}
