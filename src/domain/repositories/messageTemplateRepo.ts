import { Env } from "../..";
import { MessageTemplateCreate } from "../models/MessageModel";

export async function messageTemplateDbCreate(
  params: MessageTemplateCreate,
  env: Env
) {
  try {
    const { title, message, status } = params;
    const date = Date.now();
    const stmt = env.DB.prepare(
      "INSERT INTO messageTemplates (title, message, status, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?)"
    ).bind(title, message, status, date, date);
    await stmt.run();
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
}
