import { Env } from "../..";
import type { LogsCredit, LogsMoneyCreate } from "../models/LogsModel";

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
