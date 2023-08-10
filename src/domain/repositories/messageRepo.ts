import { Env } from "../..";
import { MessageCreate } from "../models/MessageModel";

export async function messageDbCreate(params: MessageCreate, env: Env) {
  try {
    const {
      message,
      title,
      sendAt = null,
      receiverId,
      senderId,
      status,
      cron,
    } = params;
    const date = Date.now();
    const stmt = await env.DB.prepare(
      "INSERT INTO messages (message, title, sendAt, receiverId, senderId, createdAt, updatedAt, cron, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"
    ).bind(
      message,
      title,
      sendAt,
      receiverId,
      senderId,
      date,
      date,
      cron,
      status
    );
    await stmt.run();
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
}
