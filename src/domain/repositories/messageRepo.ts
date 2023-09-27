import { safeParse } from "valibot";
import { Env } from "../..";
import { Message, MessageCreate, MessageUpdate } from "../models/MessageModel";
import { MessageCreateSchema } from "../schemas/MessageSchema";
import { utilFailedResponse, utilQueryCreate } from "../services/utilService";

export function messageDbCreate(
  params: MessageCreate,
  env: Env,
  createdById: number
) {
  const parse = safeParse(MessageCreateSchema, params);
  if (!parse.success) {
    throw utilFailedResponse("Invalid message create repo input", 500);
  }

  const dateNow = Date.now();
  let { fields, values, queryParams } = utilQueryCreate(
    parse.data,
    "MessageCreate"
  );
  fields += ", createdAt, updatedAt, createdById";
  values += ", ?, ?, ?";
  queryParams.push(dateNow, dateNow, createdById);
  const query = `INSERT INTO messages (${fields}) VALUES (${values})`;

  try {
    const stmt = env.DB.prepare(query).bind(...queryParams);
    return stmt;
  } catch (e) {
    console.log(e);
    throw utilFailedResponse(
      "Failed to generate query for message create",
      500
    );
  }
}

export async function messageDbGetAll(
  params: { page: number; size: number },
  env: Env
) {
  const { page, size } = params;

  let query = "SELECT * FROM messages";
  const queryParams = [];

  query += " ORDER BY updatedAt DESC";
  query += " LIMIT ?, ?";
  queryParams.push((page - 1) * size, size);

  try {
    const stmt = env.DB.prepare(query).bind(...queryParams);
    const results = await stmt.all<Message>();
    return results.results;
  } catch (e) {
    console.log(e);
    throw utilFailedResponse("Unable to get messages", 500);
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
    const total = await stmt.first<number>("total");
    return total ?? 0;
  } catch (e) {
    console.log(e);
    throw utilFailedResponse("Unable to get total messages", 500);
  }
}

export async function messageDbUpdate(params: MessageUpdate, env: Env) {
  try {
    const {
      id,
      sendAt,
      userId,
      status,
      cron,
      messageTemplateId,
      phone,
      templateValues,
    } = params;
    const stmt = env.DB.prepare(
      "UPDATE messages SET sendAt = ?, userId = ?, status = ?, cron = ?, messageTemplateId = ?, phone = ?, templateValues = ?, updatedAt = ? WHERE id = ?"
    ).bind(
      sendAt,
      userId,
      status,
      cron,
      messageTemplateId,
      phone,
      templateValues,
      Date.now(),
      id
    );
    await stmt.run();
    return true;
  } catch (e) {
    console.log(e);
    return null;
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
