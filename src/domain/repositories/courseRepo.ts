import { Env } from "../..";
import {
  Course,
  CourseCreate,
  CoursePagination,
  CourseUpdate,
} from "../models/CourseModel";
import { courseColumns } from "../services/courseService";
import { roleColumns } from "../services/roleService";
import { teacherColumns } from "../services/teacherService";
import { userColumns } from "../services/userService";
import {
  utilFailedResponse,
  utilQueryAddWhere,
  utilQuerySelect,
} from "../services/utilService";

export async function courseDbGet(params: { courseId: number }, env: Env) {
  const { courseId } = params;

  let querySelect = utilQuerySelect({
    courses: courseColumns(),
    teachers: teacherColumns(),
    users: userColumns(),
    roles: roleColumns(),
  });
  const queryFrom =
    "courses LEFT JOIN teachers ON courses.teacherId = teachers.id LEFT JOIN users ON teachers.userId = users.id LEFT JOIN roles ON users.roleId = roles.id";
  const queryParams = [];
  let queryWhere = "";

  if (courseId) {
    queryWhere += "courses_id = ?";
    queryParams.push(courseId);
  }

  let query = `SELECT ${querySelect} FROM ${queryFrom}`;
  if (queryWhere) {
    query += ` WHERE ${queryWhere}`;
  }
  query += " LIMIT 1";

  try {
    const stmt = env.DB.prepare(query).bind(...queryParams);
    const course = await stmt.first();
    if (!course) {
      return null;
    }
    const data = {
      teacher: {
        user: {
          role: {} as any,
        } as any,
      } as any,
    } as any;

    Object.keys(course).forEach((key) => {
      const value = course[key];
      if (key.startsWith("courses_")) {
        const newKey = key.replace("courses_", "");
        data[newKey] = value;
      } else if (key.startsWith("teachers_")) {
        const newKey = key.replace("teachers_", "");
        data.teacher[newKey] = value;
      } else if (key.startsWith("users_")) {
        const newKey = key.replace("users_", "");
        data.teacher.user[newKey] = value;
      } else if (key.startsWith("roles_")) {
        const newKey = key.replace("roles_", "");
        data.teacher.user.role[newKey] = value;
      }
    });

    return data as Course;
  } catch (e) {
    console.log(e);
    throw utilFailedResponse("Cannot get course", 500);
  }
}

export async function courseDbGetAll(params: CoursePagination, env: Env) {
  const { page, size, teacherId } = params;

  let querySelect = utilQuerySelect({
    courses: courseColumns(),
    teachers: teacherColumns(),
    users: userColumns(),
    roles: roleColumns(),
  });
  const queryFrom =
    "courses LEFT JOIN teachers ON courses.teacherId = teachers.id LEFT JOIN users ON teachers.userId = users.id LEFT JOIN roles ON users.roleId = roles.id";
  const queryParams = [];
  let queryWhere = "";

  if (teacherId) {
    queryWhere += "teacherId = ?";
    queryParams.push(teacherId);
  }

  let query = `SELECT ${querySelect} FROM ${queryFrom}`;
  if (queryWhere) {
    query += ` WHERE ${queryWhere}`;
  }
  query += " LIMIT ?, ?";
  queryParams.push((page - 1) * size, size);

  try {
    const stmt = env.DB.prepare(query).bind(...queryParams);
    const results = await stmt.all();
    const courses = results.results.map((course) => {
      const data = {
        teacher: {
          user: {
            role: {} as any,
          } as any,
        } as any,
      } as any;
      Object.keys(course).forEach((key) => {
        const value = course[key];
        if (key.startsWith("courses_")) {
          const newKey = key.replace("courses_", "");
          data[newKey] = value;
        } else if (key.startsWith("teachers_")) {
          const newKey = key.replace("teachers_", "");
          data.teacher[newKey] = value;
        } else if (key.startsWith("users_")) {
          const newKey = key.replace("users_", "");
          data.teacher.user[newKey] = value;
        } else if (key.startsWith("roles_")) {
          const newKey = key.replace("roles_", "");
          data.teacher.user.role[newKey] = value;
        }
      });
      return data as Course;
    });
    return courses;
  } catch (e) {
    console.log(e);
    throw utilFailedResponse("Cannot get courses", 500);
  }
}

export async function courseDbGetAllTotal(
  params: { teacherId?: number },
  env: Env
) {
  const { teacherId } = params;

  const queryParams = [];
  let query = "SELECT COUNT(*) AS total FROM courses";

  if (teacherId) {
    query = utilQueryAddWhere(query, "teacherId = ?");
    queryParams.push(teacherId);
  }

  try {
    const stmt = env.DB.prepare(query).bind(...queryParams);
    const total = await stmt.first<number>("total");
    return total ?? 0;
  } catch (e) {
    console.log(e);
    throw utilFailedResponse("Cannot get total courses", 500);
  }
}

export async function courseDbCreate(params: CourseCreate, env: Env) {
  try {
    const date = Date.now();
    const stmt = env.DB.prepare(
      "INSERT INTO courses (name, price, teacherId, description, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?)"
    ).bind(
      params.name,
      params.price,
      params.teacherId,
      params.description,
      date,
      date
    );
    await stmt.run();

    return true;
  } catch (e) {
    console.log(e);
    return null;
  }
}

export async function courseDbUpdate(params: CourseUpdate, env: Env) {
  try {
    const stmt = env.DB.prepare(
      "UPDATE courses SET name = ?, price = ?, teacherId = ?, description = ?, updatedAt = ? WHERE id = ?"
    ).bind(
      params.name,
      params.price,
      params.teacherId,
      params.description,
      Date.now(),
      params.id
    );
    await stmt.run();

    return true;
  } catch (e) {
    console.log(e);
    return null;
  }
}
