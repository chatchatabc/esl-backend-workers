import { Env } from "../..";
import {
  Student,
  StudentCreate,
  StudentPagination,
} from "../models/StudentModel";
import { utilFailedResponse } from "../services/utilService";
import { v4 as uuidv4 } from "uuid";
import { userDbCreate } from "./userRepo";

export async function studentDbGet(
  params: Partial<{ studentId: number; uuid: string }>,
  env: Env
) {
  const { studentId, uuid } = params;

  const queryParams = [];
  let query = "SELECT * FROM students";
  let queryWhere = "";

  if (studentId) {
    queryWhere += `id = ?`;
    queryParams.push(studentId);
  }

  if (uuid) {
    queryWhere += queryWhere ? " AND " : "";
    queryWhere += `uuid = ?`;
    queryParams.push(uuid);
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

export async function studentDbGetByUser(
  params: Partial<{ userId: number; username: string }>,
  env: Env
) {
  const { userId, username } = params;

  const queryParams = [];
  let query = "SELECT * FROM students";
  let queryWhere = "";

  if (userId) {
    queryWhere += `userId = ?`;
    queryParams.push(userId);
  }

  if (username) {
    queryWhere += queryWhere ? " AND " : "";
    queryWhere += `userId = (SELECT id FROM users WHERE username = ?)`;
    queryParams.push(username);
  }

  if (queryWhere) {
    query += ` WHERE ${queryWhere}`;
  }

  query += " LIMIT 1";

  try {
    const stmt = env.DB.prepare(query).bind(...queryParams);
    const results = await stmt.first<Student>();
    return results;
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

export async function studentDbCreate(
  params: StudentCreate,
  env: Env,
  createdBy: number
) {
  const { bio, status, alias, ...user } = params;
  const now = Date.now();
  const uuid = uuidv4();

  try {
    const userStmt = await userDbCreate(
      { ...user, status, alias },
      env,
      createdBy
    );
    const studentStmt = env.DB.prepare(
      "INSERT INTO students (uuid, bio, status, userId, alias, createdBy, createdAt, updatedAt) VALUES (?, ?, ?, last_insert_rowid(), ?, ?, ?, ?)"
    ).bind(uuid, bio, status, alias, createdBy, now, now);
    return [userStmt, studentStmt];
  } catch (e) {
    console.log(e);
    throw utilFailedResponse("Cannot generate student statement", 500);
  }
}
