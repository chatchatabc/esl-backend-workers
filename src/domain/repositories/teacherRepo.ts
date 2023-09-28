import { Env } from "../..";
import { CommonPagination } from "../models/CommonModel";
import { Teacher, TeacherCreate, TeacherUpdate } from "../models/TeacherModel";
import { User, UserRole } from "../models/UserModel";
import { roleColumns } from "../services/roleService";
import { teacherColumns } from "../services/teacherService";
import { userColumns } from "../services/userService";
import { utilFailedResponse, utilQuerySelect } from "../services/utilService";
import { userDbCreate } from "./userRepo";

export async function teacherDbGet(
  params: { teacherId?: number; userId?: number; userUsername?: string },
  env: Env
) {
  const { teacherId, userId, userUsername } = params;

  const queryParams = [];
  let querySelect = utilQuerySelect({
    teachers: teacherColumns(),
    roles: roleColumns(),
    users: userColumns(),
  });
  let whereQuery = "";

  if (teacherId) {
    whereQuery += "teachers_id = ?";
    queryParams.push(teacherId);
  }

  if (userId) {
    whereQuery += whereQuery ? " AND " : "";
    whereQuery += "teachers_userId = ?";
    queryParams.push(userId);
  }

  if (userUsername) {
    whereQuery += whereQuery ? " AND " : "";
    whereQuery += "teachers_userId = (SELECT id FROM users WHERE username = ?)";
    queryParams.push(userUsername);
  }

  let query = `SELECT ${querySelect} FROM teachers LEFT JOIN users ON teachers.userId = users.id LEFT JOIN roles ON users.roleId = roles.id`;

  if (whereQuery) {
    query += ` WHERE ${whereQuery}`;
  }

  try {
    const teacher = await env.DB.prepare(query)
      .bind(...queryParams)
      .first();
    if (!teacher) {
      return null;
    }

    const data = {
      user: {
        role: {} as any,
      } as any,
    } as any;
    Object.keys(teacher).forEach((key) => {
      const value = teacher[key];
      if (key.startsWith("users_")) {
        const newKey = key.replace("users_", "");
        data.user[newKey] = value;
      } else if (key.startsWith("roles_")) {
        const newKey = key.replace("roles_", "");
        data.user.role[newKey] = value;
      } else if (key.startsWith("teachers_")) {
        const newKey = key.replace("teachers_", "");
        data[newKey] = teacher[key];
      }
    });
    return data as Teacher;
  } catch (e) {
    console.log(e);
    return null;
  }
}

export async function teacherDbGetAll(params: CommonPagination, env: Env) {
  const { page, size } = params;

  const tables = {
    roles: ["id", "name", "createdAt", "updatedAt"] as (keyof UserRole)[],
    users: [
      "id",
      "username",
      "alias",
      "createdAt",
      "credits",
      "email",
      "emailVerifiedAt",
      "firstName",
      "lastName",
      "phone",
      "phoneVerifiedAt",
      "roleId",
      "status",
      "updatedAt",
    ] as (keyof User)[],
  };

  let querySelect = "teachers.*";
  let queryWhere = "";
  const queryParams = [];

  Object.keys(tables).forEach((table) => {
    tables[table as keyof typeof tables].forEach((column) => {
      querySelect += querySelect ? ", " : "";
      querySelect += `${table}.${column} AS ${table}_${column}`;
    });
  });

  let query = `SELECT ${querySelect} FROM teachers JOIN users ON teachers.userId = users.id JOIN roles ON users.roleId = roles.id`;

  if (queryWhere) {
    query += ` WHERE ${queryWhere}`;
  }

  query += " LIMIT ?, ?";
  queryParams.push((page - 1) * size, size);

  try {
    const teachersStmt = await env.DB.prepare(query).bind(...queryParams);
    const results = await teachersStmt.all();
    const teachers = results.results.map((teacher: any) => {
      const data: Record<string, any> = {};
      const user: Record<string, any> = {} as any;
      Object.keys(teacher).forEach((key) => {
        if (key.startsWith("users_")) {
          const value = teacher[key];
          const newKey = key.replace("users_", "");
          user[newKey] = value;
        } else if (key.startsWith("roles_")) {
          const value = teacher[key];
          const newKey = key.replace("roles_", "");
          user.role = user.role ?? {};
          user.role[newKey] = value;
        } else {
          data[key] = teacher[key];
        }
      });
      data.user = user;
      return data as Teacher;
    });
    return teachers;
  } catch (e) {
    console.log(e);
    throw utilFailedResponse("Cannot get teachers", 500);
  }
}

export async function teacherDbGetAllTotal(env: Env) {
  let query = "SELECT COUNT(*) as total FROM teachers";
  let queryWhere = "";
  const queryParams: string[] = [];

  if (queryWhere) {
    query += ` WHERE ${queryWhere}`;
  }

  try {
    const stmt = env.DB.prepare(query).bind(...queryParams);
    const total = await stmt.first<number>("total");
    return total ?? 0;
  } catch (e) {
    console.log(e);
    throw utilFailedResponse("Cannot get total teachers", 500);
  }
}

export async function teacherDbValidateCourse(
  params: { teacherId: number; courseId: number },
  env: Env
) {
  try {
    const { teacherId, courseId } = params;
    const stmt = env.DB.prepare(
      "SELECT COUNT(*) as total FROM teachersCourses WHERE teacherId = ? AND courseId = ?"
    );
    const total = await stmt.bind(teacherId, courseId).first<number>("total");

    return total !== null && total > 0;
  } catch (e) {
    console.log(e);
    return null;
  }
}

export async function teacherDBCreate(
  params: TeacherCreate,
  env: Env,
  createdById: number
) {
  const { bio, ...user } = params;
  const date = Date.now();

  try {
    const userStmt = await userDbCreate(user, env, createdById);
    const teacherStmt = env.DB.prepare(
      "INSERT INTO teachers (bio, alias, uuid, userId, status, createdAt, updatedAt, createdById) VALUES (?, ?, ?, last_insert_rowid(), ?, ?, ?, ?)"
    ).bind(
      bio,
      user.alias,
      user.username,
      user.status,
      date,
      date,
      createdById
    );

    return [userStmt, teacherStmt];
  } catch (e) {
    console.log(e);
    throw utilFailedResponse("Cannot generate teacher statement", 500);
  }
}

export async function teacherDbUpdate(params: TeacherUpdate, env: Env) {
  const { id, bio, alias, status } = params;
  const date = Date.now();

  try {
    const stmt = env.DB.prepare(
      "UPDATE teachers SET bio = ?, alias = ?, status = ?, updatedAt = ? WHERE id = ?"
    ).bind(bio, alias, status, date, id);
    await stmt.run();

    return true;
  } catch (e) {
    console.log(e);
    return null;
  }
}
