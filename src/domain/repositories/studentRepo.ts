import { Env } from "../..";
import { utilFailedResponse } from "../services/utilService";

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
