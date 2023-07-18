import { Context } from "hono";
import { CommonContext } from "../models/CommonModel";
import {
  userDbGetByPhone,
  userDbGetByUsername,
  userDbInsert,
} from "../repositories/userRepo";
import { roleDbGet } from "../repositories/roleRepo";
import { honoFailedResponse } from "./honoService";

export async function userCreate(
  c: Context<CommonContext>,
  body: Record<string, any>
) {
  // Check if user exists by username
  let user = await userDbGetByUsername(c, body.username);
  if (user) {
    return honoFailedResponse(c, "Username already exists.", 400);
  }

  // Check if user exists by phone
  user = await userDbGetByPhone(c, body.phone);
  if (user) {
    return honoFailedResponse(c, "Phone already exists.", 400);
  }

  // Check if role exist
  const role = await roleDbGet(c, body.role);
  if (!role) {
    return honoFailedResponse(c, "Role does not exist.", 400);
  }

  // Insert user
  const insert = await userDbInsert(c, body);
  if (!insert) {
    return honoFailedResponse(c, "Failed to create user.", 500);
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
