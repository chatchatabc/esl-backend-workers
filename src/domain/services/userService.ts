import { Env } from "../..";
import { LogsCreditCreate, LogsMoneyCreate } from "../models/LogsModel";
import {
  User,
  UserCreate,
  UserPagination,
  UserRole,
  UserUpdate,
  UserUpdateInput,
} from "../models/UserModel";
import {
  userDbAddCredit,
  userDbCreate,
  userDbGet,
  userDbGetAll,
  userDbGetAllRole,
  userDbGetAllTotal,
  userDbGetByUsername,
  userDbInsert,
  userDbUpdate,
} from "../repositories/userRepo";
import { roleGet } from "./roleService";
import { utilFailedResponse, utilHashHmac256 } from "./utilService";

export async function userGet(
  params: { userId?: number; username?: string },
  env: Env
) {
  if (!params.userId && !params.username) {
    throw utilFailedResponse("User ID or username is required", 400);
  }

  const user = await userDbGet(params, env);
  if (!user) {
    throw utilFailedResponse("User not found", 404);
  }
  user.role = await roleGet({ roleId: user.roleId }, env);

  delete user.password;
  return user as User;
}

export async function userGetAll(params: UserPagination, env: Env) {
  const query = await userDbGetAll(params, env);
  if (!query) {
    throw utilFailedResponse("Unable to get users", 500);
  }

  const total = await userDbGetAllTotal(params, env);
  if (total === null) {
    throw utilFailedResponse("Unable to get users total", 500);
  }

  const users = query.results.map((user) => {
    delete user.password;
    return user;
  });

  return {
    ...params,
    content: users as User[],
    totalElements: Number(total),
  };
}

export async function userGetAllRole(params: UserPagination, env: Env) {
  const roles = await userDbGetAllRole(params, env);
  if (!roles) {
    throw utilFailedResponse("Unable to get roles", 500);
  }

  const totalElements = await userDbGetAllTotal(params, env);
  if (!totalElements && totalElements !== 0) {
    throw utilFailedResponse("Unable to get roles total", 500);
  }

  return {
    ...params,
    content: roles.results as UserRole[],
    totalElements,
  };
}

export async function userUpdateProfile(params: UserUpdateInput, env: Env) {
  let user = await userDbGet({ userId: params.id ?? 0 }, env);
  if (!user) {
    throw utilFailedResponse("Unable to get user", 500);
  }
  user = { ...user, ...params };

  const query = await userDbUpdate(user, env);
  if (!query) {
    throw utilFailedResponse("Error", 500);
  }

  delete user.password;
  return user;
}

export async function userUpdate(params: UserUpdate, env: Env) {
  let user = await userDbGet({ userId: params.id }, env);
  if (!user) {
    throw utilFailedResponse("User not found", 404);
  }
  user = { ...user, ...params };
  const query = await userDbUpdate(user, env);

  try {
    await env.DB.batch([query]);
    return true;
  } catch (e) {
    console.log(e);
    throw utilFailedResponse("Unable to update user", 500);
  }
}

export async function userCreate(
  params: UserCreate,
  env: Env,
  createdBy: number
) {
  params.password = utilHashHmac256(params.password);
  const create = await userDbCreate(params, env, createdBy);

  try {
    await env.DB.batch([create]);
    return true;
  } catch (e) {
    console.log(e);
    throw utilFailedResponse("Unable to create user", 500);
  }
}

export async function userAddCredit(
  params: {
    userId: number;
    credits: number;
    amount: number;
    currency: string;
  },
  env: Env
) {
  const user = await userGet({ userId: params.userId }, env);
  user.credits += params.amount;

  const logsCredit: LogsCreditCreate = {
    userId: params.userId,
    amount: params.credits,
    title: "Top-up",
    details: "Top-up",
  };

  const logsMoney: LogsMoneyCreate = {
    userId: params.userId,
    amount: params.amount,
    credits: params.credits,
    currency: params.currency,
    title: "Top-up",
    details: "Top-up",
  };

  const query = await userDbAddCredit({ user, logsCredit, logsMoney }, env);
  if (!query) {
    throw utilFailedResponse("Unable to add credit", 500);
  }

  delete user.password;
  return user as User;
}
