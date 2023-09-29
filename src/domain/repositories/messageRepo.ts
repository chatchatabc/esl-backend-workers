import { safeParse } from "valibot";
import { Env } from "../..";
import { Message, MessageCreate, MessageUpdate } from "../models/MessageModel";
import { MessageCreateSchema } from "../schemas/MessageSchema";
import {
  utilFailedResponse,
  utilQueryCreate,
  utilQuerySelect,
} from "../services/utilService";
import { userColumns } from "../services/userService";
import { roleColumns } from "../services/roleService";
import { messageColumns } from "../services/messageService";
import { messageTemplateColumns } from "../services/messageTemplate";

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
  params: {
    page: number;
    size: number;
    start?: number;
    end?: number;
    status?: number[];
  },
  env: Env
) {
  const { page, size, start, end, status } = params;

  let querySelect = utilQuerySelect({
    users: userColumns(),
    roles: roleColumns(),
    messages: messageColumns(),
    messageTemplates: messageTemplateColumns(),
  });
  let queryFrom =
    "messages LEFT JOIN users ON messages.userId = users.id LEFT JOIN roles ON users.roleId = roles.id LEFT JOIN messageTemplates ON messages.messageTemplateId = messageTemplates.id";
  let queryWhere = "";
  const queryParams = [];

  if (start !== undefined) {
    queryWhere += "messages_sendAt >= ?";
    queryParams.push(start);
  }

  if (end !== undefined) {
    queryWhere += queryWhere ? " AND " : "";
    queryWhere += "messages_sendAt <= ?";
    queryParams.push(end);
  }

  if (status !== undefined) {
    queryWhere += queryWhere ? " AND " : "";
    queryWhere += "messages_status IN (";
    status.forEach((value, index) => {
      queryWhere += "?";
      if (index < status.length - 1) {
        queryWhere += ", ";
      }
      queryParams.push(value);
    });
    queryWhere += ")";
  }

  let query = `SELECT ${querySelect} FROM ${queryFrom}`;

  if (queryWhere) {
    query += ` WHERE ${queryWhere}`;
  }
  query += " ORDER BY messages_updatedAt DESC";
  query += " LIMIT ?, ?";
  queryParams.push((page - 1) * size, size);

  try {
    const stmt = env.DB.prepare(query).bind(...queryParams);
    const results = await stmt.all();
    const messages = results.results.map((message) => {
      const data = {
        messageTemplate: {} as any,
        user: {
          role: {} as any,
        } as any,
      } as any;
      Object.keys(message).forEach((key) => {
        const value = message[key];
        if (key.startsWith("users_")) {
          const newKey = key.replace("users_", "");
          data.user[newKey] = value;
        } else if (key.startsWith("roles_")) {
          const newKey = key.replace("roles_", "");
          data.user.role[newKey] = value;
        } else if (key.startsWith("messages_")) {
          const newKey = key.replace("messages_", "");
          data[newKey] = value;
        } else if (key.startsWith("messageTemplates_")) {
          const newKey = key.replace("messageTemplates_", "");
          data.messageTemplate[newKey] = value;
        }
      });
      return data as Message;
    });
    return messages;
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
