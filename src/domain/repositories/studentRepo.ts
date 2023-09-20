import { Env } from "../..";
import { StudentCreate } from "../models/StudentModel";
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
    return stmt;
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
    return stmt;
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
