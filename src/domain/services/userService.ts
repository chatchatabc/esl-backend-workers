import { Context } from "hono";
import { CommonContext } from "../models/CommonModel";
import {
  userDbGetByPhone,
  userDbGetByUsername,
  userDbInsert,
} from "../repositories/userRepo";

export async function userCreate(
  c: Context<CommonContext>,
  body: Record<string, any>
) {
  // Check if user exists by username
  let user = await userDbGetByUsername(c, body.username);
  if (user) {
    return c.json({ error: "Username already exists." }, 400);
  }

  // Check if user exists by phone
  user = await userDbGetByPhone(c, body.phone);
  if (user) {
    return c.json({ error: "Phone already exists." }, 400);
  }

  // Insert user
  const insert = await userDbInsert(c, body);
  if (!insert) {
    return c.json({ error: "Failed to create user." }, 500);
  }

  // Return user and remove password
  user = await userDbGetByUsername(c, body.username);
  delete user?.password;
  return c.json({ data: user });
}

export async function userGet(
  c: Context<CommonContext>,
  body: Record<string, any>
) {
  const { username, phone } = body;

  const user =
    (await userDbGetByPhone(c, phone)) ??
    (await userDbGetByUsername(c, username));

  return user;
}
