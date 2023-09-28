import { safeParse } from "valibot";
import { Env } from "../..";
import { CommonPagination } from "../models/CommonModel";
import { LogsCreditCreate, LogsMoneyCreate } from "../models/LogsModel";
import {
  User,
  UserCreate,
  UserPagination,
  UserRole,
  UserUpdate,
} from "../models/UserModel";
import {
  utilFailedResponse,
  utilQueryAddWhere,
  utilQueryCreate,
  utilQuerySelect,
  utilQueryUpdate,
} from "../services/utilService";
import { UserCreateSchema, UserUpdateSchema } from "../schemas/UserSchema";
import { userColumns } from "../services/userService";
import { roleColumns } from "../services/roleService";

export function userDbCreate(user: UserCreate, env: Env, createdById: number) {
  const parse = safeParse(UserCreateSchema, user);
  if (!parse.success) {
    throw utilFailedResponse("Invalid user data", 400);
  }
  user = parse.data;

  let query = "INSERT INTO users";
  let { fields, values, queryParams } = utilQueryCreate(user, "USER");
  const now = Date.now();

  query += ` (${fields}, createdAt, updatedAt, createdById) VALUES (${values}, ?, ?, ?)`;
  queryParams.push(now, now, createdById);

  try {
    const stmt = env.DB.prepare(query).bind(...queryParams);
    return stmt;
  } catch (e) {
    console.log(e);
    throw utilFailedResponse("Cannot generate user statement", 500);
  }
}

export async function userDbGet(
  params: { userId?: number; username?: string },
  env: Env
) {
  const { userId, username } = params;

  const queryParams = [];
  let querySelect = utilQuerySelect({
    users: [...userColumns(), "password"],
    roles: roleColumns(),
  });
  let queryFrom = "users JOIN roles ON users.roleId = roles.id";
  let queryWhere = "";

  if (userId) {
    queryWhere += `users_id = ?`;
    queryParams.push(userId);
  }

  if (username) {
    queryWhere += queryWhere ? " AND " : "";
    queryWhere += `users_username = ?`;
    queryParams.push(username);
  }

  let query = `SELECT ${querySelect} FROM ${queryFrom}`;
  if (queryWhere) {
    query += ` WHERE ${queryWhere}`;
  }
  query += " LIMIT 1";

  try {
    const stmt = env.DB.prepare(query).bind(...queryParams);
    const user = await stmt.first();
    if (!user) {
      return null;
    }
    const data = { role: {} as any } as any;
    Object.keys(user).forEach((key) => {
      const value = user[key];
      if (key.startsWith("users_")) {
        const newKey = key.replace("users_", "");
        data[newKey] = value;
      } else if (key.startsWith("roles_")) {
        const newKey = key.replace("roles_", "");
        data.role[newKey] = value;
      }
    });
    return data as User;
  } catch (e) {
    console.log(e);
    throw utilFailedResponse("Cannot get user", 500);
  }
}

export async function userDbGetAll(params: UserPagination, env: Env) {
  const { page, size, roleId } = params;

  let querySelect = utilQuerySelect({
    users: userColumns(),
    roles: roleColumns(),
  });
  let queryFrom = "users JOIN roles ON users.roleId = roles.id";
  let queryWhere = "";
  const queryParams = [];

  if (roleId) {
    queryWhere += `roleId = ?`;
    queryParams.push(roleId);
  }

  let query = `SELECT ${querySelect} FROM ${queryFrom}`;
  if (queryWhere) {
    query += ` WHERE ${queryWhere}`;
  }
  query += " LIMIT ?, ?";
  queryParams.push((page - 1) * size, size);

  try {
    const stmt = await env.DB.prepare(query).bind(...queryParams);
    const results = await stmt.all();
    const users = results.results.map((user) => {
      const data = { role: {} as any } as any;
      Object.keys(user).forEach((key) => {
        const value = user[key];
        if (key.startsWith("users_")) {
          const newKey = key.replace("users_", "");
          data[newKey] = value;
        } else if (key.startsWith("roles_")) {
          const newKey = key.replace("roles_", "");
          data.role[newKey] = value;
        }
      });
      return data as User;
    });
    return users;
  } catch (e) {
    console.log(e);
    throw utilFailedResponse("Cannot get users", 500);
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
  const { roleId } = params;

  try {
    let query = "SELECT COUNT(*) AS total FROM users";
    const queryParams = [];

    if (roleId) {
      query = utilQueryAddWhere(query, "roleId = ?");
      queryParams.push(roleId);
    }

    const stmt = env.DB.prepare(query).bind(...queryParams);
    const total = await stmt.first<number>("total");
    return total ?? 0;
  } catch (e) {
    console.log(e);
    throw utilFailedResponse("Cannot get total users", 500);
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

export function userDbUpdate(params: UserUpdate, env: Env) {
  const data = safeParse(UserUpdateSchema, params);
  if (!data.success) {
    throw utilFailedResponse("Invalid user data", 400);
  }
  const { id, ...user } = data.data;

  let { querySet, queryParams } = utilQueryUpdate(user, "USER");
  querySet += `, updatedAt = ?`;
  queryParams.push(Date.now());

  const query = `UPDATE users SET ${querySet} WHERE id = ?`;
  queryParams.push(id);

  try {
    const stmt = env.DB.prepare(query).bind(...queryParams);
    return stmt;
  } catch (e) {
    console.log(e);
    throw utilFailedResponse("Unable to generate user update statement", 500);
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
