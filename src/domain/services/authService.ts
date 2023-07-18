import { SHA256 } from "crypto-js";
import { Context } from "hono";
import { CommonContext } from "../models/CommonModel";
import { userDbGetByUsername } from "../repositories/userRepo";
import { honoFailedResponse } from "./honoService";

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
