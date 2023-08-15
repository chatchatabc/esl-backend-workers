import { Env } from "../..";
import { CommonPagination } from "../models/CommonModel";
import { roleDbGet, roleDbGetAll } from "../repositories/roleRepo";
import { utilFailedResponse } from "./utilService";

export async function roleGet(params: { roleId: number }, env: Env) {
  const role = await roleDbGet(params, env);
  if (!role) {
    throw utilFailedResponse("Role not found", 404);
  }

  return role;
}

export async function roleGetAll(params: CommonPagination, env: Env) {
  const roles = await roleDbGetAll(params, env);
  if (!roles) {
    throw utilFailedResponse("Roles not found", 404);
  }

  return roles;
}
