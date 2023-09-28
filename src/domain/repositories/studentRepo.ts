import { Env } from "../..";
import {
  Student,
  StudentCreate,
  StudentPagination,
} from "../models/StudentModel";
import { utilFailedResponse, utilQuerySelect } from "../services/utilService";
import { v4 as uuidv4 } from "uuid";
import { userDbCreate } from "./userRepo";
import { userColumns } from "../services/userService";
import { roleColumns } from "../services/roleService";
import { studentColumns } from "../services/studentService";

export async function studentDbGet(
  params: Partial<{
    studentId: number;
    uuid: string;
    userUsername: string;
    userId: number;
  }>,
  env: Env
) {
  const { studentId, uuid, userUsername, userId } = params;

  const queryParams = [];
  let querySelect = utilQuerySelect({
    users: userColumns(),
    roles: roleColumns(),
    students: studentColumns(),
  });
  let queryFrom =
    "students LEFT JOIN users ON students.userId = users.id LEFT JOIN roles ON users.roleId = roles.id";
  let queryWhere = "";

  if (studentId) {
    queryWhere += `students_id = ?`;
    queryParams.push(studentId);
  }

  if (uuid) {
    queryWhere += queryWhere ? " AND " : "";
    queryWhere += `students_uuid = ?`;
    queryParams.push(uuid);
  }

  if (userId) {
    queryWhere += queryWhere ? " AND " : "";
    queryWhere += `students_userId = ?`;
    queryParams.push(userId);
  }

  if (userUsername) {
    queryWhere += queryWhere ? " AND " : "";
    queryWhere += `students_userId = (SELECT id FROM users WHERE username = ?)`;
    queryParams.push(userUsername);
  }

  let query = `SELECT ${querySelect} FROM ${queryFrom}`;
  if (queryWhere) {
    query += ` WHERE ${queryWhere}`;
  }
  query += " LIMIT 1";

  try {
    const stmt = env.DB.prepare(query).bind(...queryParams);
    const student = await stmt.first();
    if (!student) {
      return null;
    }
    const data = {
      user: {
        role: {} as any,
      } as any,
    } as any;
    Object.keys(student).forEach((key) => {
      const value = student[key];
      if (key.startsWith("users_")) {
        const newKey = key.replace("users_", "");
        data.user[newKey] = value;
      } else if (key.startsWith("roles_")) {
        const newKey = key.replace("roles_", "");
        data.user.role[newKey] = value;
      } else if (key.startsWith("students_")) {
        const newKey = key.replace("students_", "");
        data[newKey] = value;
      }
    });
    return data as Student;
  } catch (e) {
    console.log(e);
    throw utilFailedResponse("Cannot generate student statement", 500);
  }
}

export async function studentDbGetAll(params: StudentPagination, env: Env) {
  const { page, size } = params;

  let querySelect = utilQuerySelect({
    users: userColumns(),
    roles: roleColumns(),
    students: studentColumns(),
  });
  const queryParams = [];

  let query = `SELECT ${querySelect} FROM students LEFT JOIN users ON students.userId = users.id LEFT JOIN roles ON users.roleId = roles.id`;
  query += ` LIMIT ?, ?`;
  queryParams.push((page - 1) * size, size);

  try {
    const stmt = env.DB.prepare(query).bind(...queryParams);
    const results = await stmt.all();
    const students = results.results.map((student) => {
      const data = {
        user: {
          role: {} as any,
        },
      } as any;
      Object.keys(student).forEach((key) => {
        const value = student[key];
        if (key.startsWith("users_")) {
          const newKey = key.replace("users_", "");
          data.user[newKey] = value;
        } else if (key.startsWith("roles_")) {
          const newKey = key.replace("roles_", "");
          data.user.role[newKey] = value;
        } else if (key.startsWith("students_")) {
          const newKey = key.replace("students_", "");
          data[newKey] = value;
        }
      });
      return data;
    });
    return students as Student[];
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
