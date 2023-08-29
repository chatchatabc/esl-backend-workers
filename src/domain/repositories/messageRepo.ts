import { Env } from "../..";
import { Message, MessageCreate } from "../models/MessageModel";

export async function messageDbCreate(params: MessageCreate, env: Env) {
  try {
    const {
      sendAt,
      userId,
      status,
      cron,
      messageTemplateId,
      phone,
      templateValues,
    } = params;
    const date = Date.now();
    const stmt = await env.DB.prepare(
      "INSERT INTO messages (sendAt, userId, status, cron, messageTemplateId, phone, templateValues, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"
    ).bind(
      sendAt,
      userId,
      status,
      cron,
      messageTemplateId,
      phone,
      templateValues,
      date,
      date
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
      "SELECT * FROM messages WHERE sendAt >= ? AND sendAt <= ? AND status = 1"
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
    const stmt = env.DB.prepare(
      "SELECT * FROM messages WHERE sendAt is NULL AND status = 1"
    );
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

export async function messageDbUpdateMany(
  params: {
    messages: Message[];
  },
  env: Env
) {
  try {
    const stmt = env.DB.prepare(
      "UPDATE messages SET status = ?, sendAt = ?, updatedAt = ? WHERE id = ?"
    );
    await env.DB.batch([
      ...params.messages.map((message) => {
        return stmt.bind(
          message.status,
          message.sendAt,
          Date.now(),
          message.id
        );
      }),
    ]);

    return true;
  } catch (e) {
    console.log(e);
    return null;
  }
}
