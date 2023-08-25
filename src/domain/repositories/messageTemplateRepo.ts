import { Env } from "../..";
import { CommonPagination } from "../models/CommonModel";
import { MessageTemplate, MessageTemplateCreate } from "../models/MessageModel";

export async function messageTemplateDbCreate(
  params: MessageTemplateCreate,
  env: Env
) {
  try {
    const { title, message, status, signature, smsId } = params;
    const date = Date.now();
    const stmt = env.DB.prepare(
      "INSERT INTO messageTemplates (title, message, signature, smsId, status, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)"
    ).bind(title, message, signature, smsId, status, date, date);
    await stmt.run();
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
}

export async function messageTemplateDbGetAll(
  params: CommonPagination,
  env: Env
) {
  try {
    const { page, size } = params;
    const stmt = env.DB.prepare(
      "SELECT * FROM messageTemplates LIMIT ? OFFSET ?"
    ).bind(size, (page - 1) * size);
    return await stmt.all<MessageTemplate>();
  } catch (e) {
    console.log(e);
    return undefined;
  }
}

export async function messageTemplateDbGetAllTotal(env: Env) {
  try {
    const stmt = env.DB.prepare(
      "SELECT COUNT(*) AS total FROM messageTemplates"
    );
    const total = await stmt.first("total");
    return Number(total);
  } catch (e) {
    console.log(e);
    return undefined;
  }
}

export async function messageTemplateDbGet(
  params: { messageTemplateId: number },
  env: Env
) {
  try {
    const stmt = env.DB.prepare(
      "SELECT * FROM messageTemplates WHERE id = ?"
    ).bind(params.messageTemplateId);
    return await stmt.first<MessageTemplate>();
  } catch (e) {
    console.log(e);
    return undefined;
  }
}

export async function messageTemplateDbUpdate(
  params: MessageTemplate,
  env: Env
) {
  try {
    const { id, title, message, signature, status } = params;
    const date = Date.now();
    const stmt = env.DB.prepare(
      "UPDATE messageTemplates SET title = ?, message = ?, signature = ?, status = ?, updatedAt = ? WHERE id = ?"
    ).bind(title, message, signature, status, date, id);
    await stmt.run();
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
}
