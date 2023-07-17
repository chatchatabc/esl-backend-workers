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
  // Check if user exists
  let user = await userDbGetByUsername(c, body.username);
  if (user) {
    return c.json({ error: "Username already exists." }, 400);
  }
  user = await userDbGetByPhone(c, body.phone);
  if (user) {
    return c.json({ error: "Phone already exists." }, 400);
  }
  await userDbInsert(c, body);

  user = await userDbGetByUsername(c, body.username);
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
