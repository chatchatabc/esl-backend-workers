import { Env } from "../..";
import {
  Student,
  StudentCreate,
  StudentPagination,
} from "../models/StudentModel";
import { utilFailedResponse } from "../services/utilService";
import { v4 as uuidv4 } from "uuid";
import { userDbCreate } from "./userRepo";
import { User } from "../models/UserModel";

export async function studentDbGet(
  params: Partial<{
    studentId: number;
    uuid: string;
    userUsername: string;
    userId: number;
  }>,
  env: Env,
  users?: (keyof User)[]
) {
  const { studentId, uuid, userUsername, userId } = params;

  const select = {
    users: users ?? ["id", "username", "alias"],
  };

  const queryParams = [];
  let querySelect = "students.*";
  let queryWhere = "";

  Object.keys(select).forEach((table) => {
    select[table as keyof typeof select].forEach((column) => {
      querySelect += querySelect ? ", " : "";
      querySelect += `${table}.${column} AS ${table}_${column}`;
    });
  });

  let query = `SELECT ${querySelect} FROM students JOIN users ON students.userId = users.id`;

  if (studentId) {
    queryWhere += `id = ?`;
    queryParams.push(studentId);
  }

  if (uuid) {
    queryWhere += queryWhere ? " AND " : "";
    queryWhere += `uuid = ?`;
    queryParams.push(uuid);
  }

  if (userId) {
    queryWhere += queryWhere ? " AND " : "";
    queryWhere += `userId = ?`;
    queryParams.push(userId);
  }

  if (userUsername) {
    queryWhere += queryWhere ? " AND " : "";
    queryWhere += `userId = (SELECT id FROM users WHERE username = ?)`;
    queryParams.push(userUsername);
  }

  if (queryWhere) {
    query += ` WHERE ${queryWhere}`;
  }

  query += " LIMIT 1";

  try {
    const stmt = env.DB.prepare(query).bind(...queryParams);
    return await stmt.first<Student>();
  } catch (e) {
    console.log(e);
    throw utilFailedResponse("Cannot generate student statement", 500);
  }
}

export async function studentDbGetAll(params: StudentPagination, env: Env) {
  const { page, size } = params;

  let query = "SELECT * FROM students";
  let queryParams = [];

  query += ` LIMIT ?, ?`;
  queryParams.push((page - 1) * size, size);

  try {
    const stmt = env.DB.prepare(query).bind(...queryParams);
    const results = await stmt.all<Student>();
    return results;
  } catch (e) {
    console.log(e);
    throw utilFailedResponse("Cannot get all students", 500);
  }
}

export async function studentDbGetAllTotal(env: Env) {
  const query = "SELECT COUNT(*) as total FROM students";

  try {
    const stmt = env.DB.prepare(query);
    const total = await stmt.first<number>("total");
    return total ?? 0;
  } catch (e) {
    console.log(e);
    throw utilFailedResponse("Cannot generate student statement", 500);
  }
}

export function studentDbCreate(
  params: StudentCreate,
  env: Env,
  createdById: number
) {
  const { bio, status, alias, ...user } = params;
  const now = Date.now();
  const uuid = uuidv4();

  try {
    const userStmt = userDbCreate({ ...user, status, alias }, env, createdById);
    const studentStmt = env.DB.prepare(
      "INSERT INTO students (uuid, bio, status, userId, alias, createdById, createdAt, updatedAt) VALUES (?, ?, ?, last_insert_rowid(), ?, ?, ?, ?)"
    ).bind(uuid, bio, status, alias, createdById, now, now);
    return [userStmt, studentStmt];
  } catch (e) {
    console.log(e);
    throw utilFailedResponse("Cannot generate student statement", 500);
  }
}
