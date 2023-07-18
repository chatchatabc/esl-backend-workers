import { SHA256 } from "crypto-js";
import { Context } from "hono";
import { CommonContext } from "../models/CommonModel";
import {
  userDbGetByPhone,
  userDbGetByUsername,
  userDbInsert,
} from "../repositories/userRepo";
import { honoFailedResponse } from "./honoService";
import { roleDbGet } from "../repositories/roleRepo";

const secret = "secret";

export function authCreateHashPassword(password: string) {
  return SHA256(password + secret).toString();
}

export async function authLogin(
  c: Context<CommonContext>,
  body: Record<string, any>
) {
  let user = await userDbGetByUsername(c, body.username);
  if (!user) {
    return honoFailedResponse(c, "User not found.", 404);
  }

  if (user.password !== authCreateHashPassword(body.password)) {
    return honoFailedResponse(c, "Invalid password.", 401);
  }

  delete user.password;
  return c.json({ data: user }, 200);
}

export async function authRegister(
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
