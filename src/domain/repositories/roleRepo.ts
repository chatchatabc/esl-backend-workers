import { Context } from "hono";
import { CommonContext } from "../models/CommonModel";
import { UserRole } from "../models/UserModel";

export async function roleDbGet(c: Context<CommonContext>, id: number) {
  try {
    const role = (await c.env.DB.prepare("SELECT * FROM roles WHERE id = ?")
      .bind(id)
      .first()) as UserRole | null;

    return role;
  } catch (e) {
    console.log(e);
    return null;
  }
}
