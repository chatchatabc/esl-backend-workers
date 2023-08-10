import { Env } from "../..";
import { User, UserRegister } from "../models/UserModel";

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

export async function userDbInsert(body: UserRegister, env: Env) {
  const { username, password, roleId, credit } = body;
  const date = Date.now();
  try {
    await env.DB.prepare(
      "INSERT INTO users (username, password, createdAt, updatedAt, roleId, credit) VALUES (?, ?, ?, ?, ?, ?)"
    )
      .bind(username, password, date, date, roleId, credit)
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
