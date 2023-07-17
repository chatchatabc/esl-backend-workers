import { Context } from "hono";
import { CommonContext } from "../models/CommonModel";
import { User } from "../models/UserModel";

export async function userDbInsert(
  c: Context<CommonContext>,
  body: Record<string, any>
) {
  const { username, password, phone } = body;
  const date = new Date();

  try {
    const results = await c.env.DB.prepare(
      "INSERT INTO users (username, password, phone, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?)"
    )
      .bind(username, password, phone, date.toISOString(), date.toISOString())
      .run<User>();

    console.log(results.success);
    return results;
  } catch (e) {
    console.log(e);
    return null;
  }
}

export async function userDbGetByUsername(
  c: Context<CommonContext>,
  value: string
) {
  const results = (await c.env.DB.prepare(
    "SELECT * FROM users WHERE username = ?"
  )
    .bind(value)
    .first()) as User | null;

  return results;
}

export async function userDbGetByPhone(
  c: Context<CommonContext>,
  value: string
) {
  const results = (await c.env.DB.prepare("SELECT * FROM users WHERE phone = ?")
    .bind(value)
    .first()) as User | null;

  return results;
}
