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
    queryWhere += `id = ${studentId}`;
    queryParams.push(studentId);
  }

  if (uuid) {
    queryWhere += queryWhere ? " AND " : "";
    queryWhere += `uuid = ${uuid}`;
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
    throw utilFailedResponse("Cannot generate student statement", 500);
  }
}
