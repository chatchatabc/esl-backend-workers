import { Env } from "../..";
import { LogsCreditCreate, LogsMoneyCreate } from "../models/LogsModel";
import { User } from "../models/UserModel";

export async function CreditDbAdd(
  params: {
    user: User;
    logsCredit: LogsCreditCreate;
    logsMoney: LogsMoneyCreate;
  },
  env: Env
) {
  const { user, logsCredit, logsMoney } = params;
  const date = Date.now();
  try {
    const userStmt = env.DB.prepare(
      `UPDATE users SET credits = ?, updatedAt = ? WHERE id = ?`
    );
    const logsCreditStmt = env.DB.prepare(
      `INSERT INTO logsCredit (userId, amount, title, details, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?)`
    );
    const logsMoneyStmt = env.DB.prepare(
      `INSERT INTO logsMoney (userId, amount, title, details, currency, credits, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    );

    await env.DB.batch([
      userStmt.bind(user.credits, date, user.id),
      logsCreditStmt.bind(
        logsCredit.userId,
        logsCredit.amount,
        logsCredit.title,
        logsCredit.details,
        date,
        date
      ),
      logsMoneyStmt.bind(
        logsMoney.userId,
        logsMoney.amount,
        logsMoney.title,
        logsMoney.details,
        logsMoney.currency,
        logsMoney.credits,
        date,
        date
      ),
    ]);

    return true;
  } catch (e) {
    console.log(e);
    return null;
  }
}
