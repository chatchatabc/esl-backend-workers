import { Context } from "hono";
import { CommonContext } from "../models/CommonModel";
import {
  userDbGetByPhone,
  userDbGetByUsername,
} from "../repositories/userRepo";

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
