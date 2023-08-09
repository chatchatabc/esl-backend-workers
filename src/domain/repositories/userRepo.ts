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
