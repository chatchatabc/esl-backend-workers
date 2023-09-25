import { Env } from "../..";
import type {
  LogsCredit,
  LogsCreditCreate,
  LogsMoneyCreate,
} from "../models/LogsModel";
import { utilFailedResponse } from "../services/utilService";

export async function logsDbGetAllCredit(
  params: { userId: number; page: number; size: number },
  env: Env
) {
  const { userId, page, size } = params;
  try {
    const results = await env.DB.prepare(
      "SELECT * FROM logsCredit WHERE userId = ? ORDER BY createdAt DESC LIMIT ? OFFSET ?"
    )
      .bind(userId, size, (page - 1) * size)
      .all<LogsCredit>();

    return results;
  } catch (e) {
    console.log(e);
    return null;
  }
}

export async function logsDbGetTotalCredit(
  params: { userId: number },
  bindings: Env
) {
  const { userId } = params;
  try {
    const stmt = bindings.DB.prepare(
      "SELECT COUNT(*) as total FROM logsCredit WHERE userId = ?"
    ).bind(userId);
    const total = await stmt.first("total");
    return total as number;
  } catch (e) {
    console.log(e);
    return null;
  }
}

export async function logsDbGetCredit(
  params: { logId: number },
  bindings: Env
) {
  const { logId } = params;
  try {
    const results = await bindings.DB.prepare(
      "SELECT * FROM logsCredit WHERE id = ?"
    )
      .bind(logId)
      .first<LogsCredit>();

    return results;
  } catch (e) {
    console.log(e);
    return null;
  }
}

export async function logsDbCreateMoney(params: LogsMoneyCreate, env: Env) {
  const { title, details, amount, userId, currency, credits } = params;
  const date = Date.now();
  try {
    const stmt = env.DB.prepare(
      "INSERT INTO logsMoney (title, details, amount, userId, currency, credits, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
    ).bind(title, details, amount, userId, currency, credits, date, date);

    await stmt.run();
    return true;
  } catch (e) {
    console.log(e);
    return null;
  }
}

export async function logsDbGetMoney(
  params: { logsMoneyId: number },
  env: Env
) {}

export function logsDbCreateCredit(
  params: LogsCreditCreate,
  env: Env,
  createdById: number
) {
  let query = "INSERT INTO logsCredit";
  let fields = "";
  let values = "";
  const queryParams: (string | null | number)[] = [];
  const now = Date.now();

  Object.keys(params).forEach((key, index) => {
    if (index !== 0) {
      fields += ", ";
      values += ", ";
    }
    fields += key;
    values += "?";
    queryParams.push(params[key as keyof LogsCreditCreate]);
  });

  if (queryParams.length) {
    fields += ", createdAt, updatedAt, createdById";
    values += ", ?, ?, ?";
    queryParams.push(now, now, createdById);

    query += ` (${fields}) VALUES (${values})`;
  } else {
    throw utilFailedResponse("No data to insert", 400);
  }

  try {
    const stmt = env.DB.prepare(query).bind(...queryParams);
    return stmt;
  } catch (e) {
    console.log(e);
    throw utilFailedResponse(
      "Unable to generate logsCredit insert statement",
      500
    );
  }
}
