import { Env } from "../..";
import type { LogsCredit, LogsCreditCreate } from "../models/LogsModel";
import type { User } from "../models/UserModel";

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

export async function logsDbUpdateCredit(
  logsCredit: LogsCredit,
  bindings: Env
) {
  const { id, senderId, receiverId, status, amount, title = null } = logsCredit;
  const date = Date.now();
  try {
    const results = await bindings.DB.prepare(
      "UPDATE logsCredit SET updatedAt = ?, senderId = ?, receiverId = ?, status = ?, amount = ?, title = ? WHERE id = ?"
    )
      .bind(date, senderId, receiverId, status, amount, title, id)
      .run();

    return results;
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

export async function logsDbCreateCredit(
  logsCredit: LogsCreditCreate,
  bindings: Env
) {
  try {
    const date = Date.now();
    await bindings.DB.prepare(
      "INSERT INTO logsCredit (title, senderId, receiverId, amount, status, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)"
    )
      .bind(
        logsCredit.title,
        logsCredit.senderId,
        logsCredit.receiverId,
        logsCredit.amount,
        logsCredit.status,
        date,
        date
      )
      .run();

    return true;
  } catch (e) {
    console.log(e);
    return null;
  }
}

export async function logsDbApproveCredit(
  logsCredit: LogsCredit,
  sender: User,
  receiver: User,
  bindings: Env
) {
  try {
    const logsCreditStmt = bindings.DB.prepare(
      "UPDATE logsCredit SET status = ? WHERE id = ?"
    ).bind(logsCredit.status, logsCredit.id);
    const senderStmt = bindings.DB.prepare(
      "UPDATE users SET credit = ? WHERE id = ?"
    ).bind(sender.credit, sender.id);
    const receiverStmt = bindings.DB.prepare(
      "UPDATE users SET credit = ? WHERE id = ?"
    ).bind(receiver.credit, receiver.id);

    await bindings.DB.batch([logsCreditStmt, senderStmt, receiverStmt]);

    return true;
  } catch (e) {
    console.log(e);
    return null;
  }
}
