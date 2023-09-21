import { Env } from "../..";
import { CommonPagination } from "../models/CommonModel";
import { LogsCreditCreate, LogsMoneyCreate } from "../models/LogsModel";
import {
  User,
  UserCreate,
  UserPagination,
  UserRole,
} from "../models/UserModel";
import { utilFailedResponse, utilQueryAddWhere } from "../services/utilService";

export async function userDbGetByUsername(
  params: { username: string },
  env: Env
) {
  const { username } = params;

  const results = (await env.DB.prepare(
    "SELECT * FROM users WHERE username = ?"
  )
    .bind(username)
    .first()) as User | null;

  return results;
}

export async function userDbCreate(
  user: UserCreate,
  env: Env,
  createdBy: number
) {
  const {
    username,
    password,
    roleId,
    firstName,
    lastName,
    phone,
    phoneVerifiedAt,
    status,
    credits,
    alias,
    email,
    emailVerifiedAt,
  } = user;
  const now = Date.now();
  try {
    const stmt = await env.DB.prepare(
      "INSERT INTO users (username, password, createdAt, updatedAt, roleId, credits, phone, firstName, lastName, phoneVerifiedAt, status, alias, email, emailVerifiedAt, createdBy) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
    ).bind(
      username,
      password,
      now,
      now,
      roleId,
      credits,
      phone,
      firstName,
      lastName,
      phoneVerifiedAt,
      status,
      alias,
      email,
      emailVerifiedAt,
      createdBy
    );
    return stmt;
  } catch (e) {
    console.log(e);
    throw utilFailedResponse("Cannot generate user statement", 500);
  }
}

export async function userDbInsert(body: UserCreate, env: Env) {
  const {
    username,
    password,
    roleId,
    credits,
    status,
    phone,
    firstName,
    lastName,
    phoneVerifiedAt,
    alias,
  } = body;
  const date = Date.now();
  try {
    await env.DB.prepare(
      "INSERT INTO users (username, password, createdAt, updatedAt, roleId, credits, phone, firstName, lastName, phoneVerifiedAt, status, alias) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
    )
      .bind(
        username,
        password,
        date,
        date,
        roleId,
        credits,
        phone,
        firstName,
        lastName,
        phoneVerifiedAt,
        status,
        alias
      )
      .run();
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
}

export async function userDbGet(
  params: { userId?: number; username?: string },
  env: Env
) {
  const { userId, username } = params;

  const queryParams = [];
  let query = "SELECT * FROM users";
  let queryWhere = "";

  if (userId) {
    queryWhere += `id = ?`;
    queryParams.push(userId);
  }

  if (username) {
    queryWhere += queryWhere ? " AND " : "";
    queryWhere += `username = ?`;
    queryParams.push(username);
  }

  if (queryWhere) {
    query += ` WHERE ${queryWhere}`;
  }

  query += " LIMIT 1";

  try {
    const stmt = env.DB.prepare(query).bind(...queryParams);
    const user = await stmt.first<User>();
    return user;
  } catch (e) {
    throw utilFailedResponse("Cannot get user", 500);
  }
}

export async function userDbGetAll(params: UserPagination, env: Env) {
  const { page, size, roleId, teacherId } = params;

  const queryParams = [];
  let query = "SELECT * FROM users";

  if (teacherId) {
    query =
      "SELECT users.* FROM users JOIN (SELECT * FROM bookings WHERE teacherId = ? AND bookings.status IN (1,2) GROUP BY userId) as uniqueBookings ON users.id = uniqueBookings.userId";
    queryParams.push(teacherId);
  }

  if (roleId) {
    query = utilQueryAddWhere(query, "roleId = ?");
    queryParams.push(roleId);
  }

  query += " LIMIT ?, ?";
  queryParams.push((page - 1) * size, size);

  try {
    const stmt = await env.DB.prepare(query).bind(...queryParams);
    const users = await stmt.all<User>();
    return users;
  } catch (e) {
    console.log(e);
    return undefined;
  }
}

export async function userDbGetAllRole(params: CommonPagination, env: Env) {
  const { page, size } = params;
  try {
    const roles = await env.DB.prepare("SELECT * FROM roles LIMIT ? OFFSET ?")
      .bind(size, (page - 1) * size)
      .all<UserRole>();

    return roles;
  } catch (e) {
    console.log(e);
    return undefined;
  }
}

export async function userDbGetAllTotal(params: UserPagination, env: Env) {
  const { teacherId, roleId } = params;

  try {
    let query = "SELECT COUNT(*) AS total FROM users";
    const queryParams = [];

    if (teacherId) {
      query =
        "SELECT COUNT(*) AS total FROM users JOIN (SELECT * FROM bookings WHERE teacherId = ? AND bookings.status IN (1,2) GROUP BY userId) as uniqueBookings ON users.id = uniqueBookings.userId";
      queryParams.push(teacherId);
    }

    if (roleId) {
      query = utilQueryAddWhere(query, "roleId = ?");
      queryParams.push(roleId);
    }

    const stmt = env.DB.prepare(query).bind(...queryParams);
    const total = await stmt.first("total");
    return Number(total);
  } catch (e) {
    console.log(e);
    return null;
  }
}

export async function userDbGetAllRoleTotal(env: Env) {
  try {
    const stmt = env.DB.prepare("SELECT COUNT(*) AS total FROM roles");
    const total = await stmt.first("total");
    return Number(total);
  } catch (e) {
    console.log(e);
    return undefined;
  }
}

export async function userDbUpdate(params: User, env: Env) {
  const {
    id,
    username,
    password,
    roleId,
    firstName,
    lastName,
    phone,
    phoneVerifiedAt,
    status,
    credits,
    alias,
  } = params;

  const date = new Date().getTime();
  try {
    const stmt = env.DB.prepare(
      "UPDATE users SET username = ?, password = ?, roleId = ?, firstName = ?, lastName = ?, phone = ?, phoneVerifiedAt = ?, status = ?, credits = ?, alias = ?, updatedAt = ? WHERE id = ?"
    ).bind(
      username,
      password,
      roleId,
      firstName,
      lastName,
      phone,
      phoneVerifiedAt,
      status,
      credits,
      alias,
      date,
      id
    );
    await stmt.run();

    return true;
  } catch (e) {
    console.log(e);
    return null;
  }
}

export async function userDbAddCredit(
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
      "UPDATE users SET credits = ?, updatedAt = ? WHERE id = ?"
    ).bind(user.credits, date, user.id);
    const logCreditStmt = env.DB.prepare(
      "INSERT INTO logsCredit (userId, amount, title, details, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)"
    ).bind(
      logsCredit.userId,
      logsCredit.amount,
      logsCredit.title,
      logsCredit.details,
      date,
      date
    );
    const logsMoneyStmt = env.DB.prepare(
      "INSERT INTO logsMoney (userId, amount, title, details, credits, currency, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
    ).bind(
      logsMoney.userId,
      logsMoney.amount,
      logsMoney.title,
      logsMoney.details,
      logsMoney.credits,
      logsMoney.currency,
      date,
      date
    );

    await env.DB.batch([userStmt, logCreditStmt, logsMoneyStmt]);
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
}

export async function userDbGetRole(params: { roleId: number }, env: Env) {
  const { roleId } = params;

  try {
    const role = await env.DB.prepare("SELECT * FROM roles WHERE id = ?")
      .bind(roleId)
      .first<UserRole>();

    return role;
  } catch (e) {
    console.log(e);
    return null;
  }
}
