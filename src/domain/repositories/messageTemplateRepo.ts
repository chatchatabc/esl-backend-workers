import { safeParse } from "valibot";
import { Env } from "../..";
import { CommonPagination } from "../models/CommonModel";
import {
  MessageTemplate,
  MessageTemplateCreate,
  MessageTemplateUpdate,
} from "../models/MessageModel";
import { MessageTemplateCreateSchema } from "../schemas/MessageTemplateSchema";
import { utilFailedResponse, utilQueryCreate } from "../services/utilService";

export function messageTemplateDbCreate(
  params: MessageTemplateCreate,
  env: Env,
  createdById: number
) {
  const parse = safeParse(MessageTemplateCreateSchema, params);
  if (!parse.success) {
    throw utilFailedResponse("Invalid message template repo params", 500);
  }

  const dateNow = Date.now();
  let query = "INSERT INTO messageTemplates";
  let { fields, values, queryParams } = utilQueryCreate(
    parse.data,
    "MessageTemplate"
  );
  fields += ", createdAt, updatedAt, createdById";
  values += ", ?, ?, ?";
  queryParams.push(dateNow, dateNow, createdById);
  query += ` (${fields}) VALUES (${values})`;

  try {
    const stmt = env.DB.prepare(query).bind(...queryParams);
    return stmt;
  } catch (e) {
    console.log(e);
    throw utilFailedResponse("Failed to create message template", 500);
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
  params: MessageTemplateUpdate,
  env: Env
) {
  try {
    const { id, title, message, signature, status, smsId, variables } = params;
    const date = Date.now();

    const stmt = env.DB.prepare(
      "UPDATE messageTemplates SET title = ?, message = ?, signature = ?, status = ?, smsId = ?, variables = ?, updatedAt = ? WHERE id = ?"
    ).bind(title, message, signature, status, smsId, variables, date, id);
    await stmt.run();

    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
}
