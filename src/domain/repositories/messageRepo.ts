import { Env } from "../..";
import { Message, MessageCreate } from "../models/MessageModel";

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

export async function messageDbGetAll(
  params: { page: number; size: number },
  env: Env
) {
  const { page, size } = params;
  try {
    const stmt = env.DB.prepare(
      "SELECT * FROM messages ORDER BY updatedAt DESC LIMIT ? OFFSET ?"
    ).bind(size, (page - 1) * size);
    const results = await stmt.all<Message>();
    return results;
  } catch (e) {
    console.log(e);
    return undefined;
  }
}

export async function messageDbGetAllByDate(
  params: { start: number; end: number },
  env: Env
) {
  const { start, end } = params;
  try {
    const stmt = env.DB.prepare(
      "SELECT * FROM messages WHERE sendAt >= ? AND sendAt <= ?"
    ).bind(start, end);
    const results = await stmt.all<Message>();
    return results;
  } catch (e) {
    console.log(e);
    return undefined;
  }
}

export async function messageDbGetAllWithCron(env: Env) {
  try {
    const stmt = env.DB.prepare("SELECT * FROM messages WHERE sendAt is NULL");
    const results = await stmt.all<Message>();
    return results;
  } catch (e) {
    console.log(e);
    return undefined;
  }
}

export async function messageDbGetAllTotal(env: Env) {
  try {
    const stmt = env.DB.prepare("SELECT COUNT(*) AS total FROM messages");
    const total = await stmt.first("total");
    return total;
  } catch (e) {
    console.log(e);
    return undefined;
  }
}
