import { Env } from "../..";
import { CommonPagination } from "../models/CommonModel";
import { UserRole } from "../models/UserModel";
import {
  roleDbGet,
  roleDbGetAll,
  roleDbGetAllTotal,
} from "../repositories/roleRepo";
import { utilFailedResponse } from "./utilService";

export async function roleGet(params: { roleId: number }, env: Env) {
  const role = await roleDbGet(params, env);
  if (!role) {
    throw utilFailedResponse("Role not found", 404);
  }

  return role as UserRole;
}

export async function roleGetAll(params: CommonPagination, env: Env) {
  const roles = await roleDbGetAll(params, env);
  if (!roles) {
    throw utilFailedResponse("Roles not found", 404);
  }

  const total = await roleDbGetAllTotal(env);
  if (!total && total !== 0) {
    throw utilFailedResponse("Roles total not found", 404);
  }

  return {
    content: roles.results as UserRole[],
    totalElements: total,
    ...params,
  };
}

export function roleColumns() {
  return ["createdAt", "id", "name", "updatedAt"] as (keyof UserRole)[];
}
