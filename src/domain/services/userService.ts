import { Env } from "../..";
import { CommonPagination } from "../models/CommonModel";
import { LogsCreditCreate } from "../models/LogsModel";
import {
  User,
  UserCreate,
  UserRole,
  UserUpdateInput,
} from "../models/UserModel";
import {
  userDbAddCredit,
  userDbGet,
  userDbGetAll,
  userDbGetAllRole,
  userDbGetAllTotal,
  userDbGetByUsername,
  userDbInsert,
  userDbUpdate,
} from "../repositories/userRepo";
import { utilFailedResponse, utilHashHmac256 } from "./utilService";

export async function userGet(params: { userId: number }, env: Env) {
  const user = await userDbGet(params, env);
  if (!user) {
    throw utilFailedResponse("Unable to get user", 500);
  }

  delete user.password;
  return user;
}

export async function userGetByUsername(
  params: { username: string },
  env: Env
) {
  const user = await userDbGetByUsername(params, env);
  if (!user) {
    throw utilFailedResponse("Unable to get user", 500);
  }

  delete user.password;
  return user;
}

export async function userGetAll(params: CommonPagination, env: Env) {
  const query = await userDbGetAll(params, env);
  if (!query) {
    throw utilFailedResponse("Unable to get users", 500);
  }

  const total = await userDbGetAllTotal(env);
  if (!total && total !== 0) {
    throw utilFailedResponse("Unable to get users total", 500);
  }

  const users = query.results.map((user) => {
    delete user.password;
    return user;
  });

  return {
    ...params,
    content: users as User[],
    totalElements: total,
  };
}

export async function userGetAllRole(params: CommonPagination, env: Env) {
  const roles = await userDbGetAllRole(params, env);
  if (!roles) {
    throw utilFailedResponse("Unable to get roles", 500);
  }

  const totalElements = await userDbGetAllTotal(env);
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

export async function userUpdate(params: UserUpdateInput, env: Env) {
  let user = await userDbGet({ userId: params.id }, env);
  if (!user) {
    throw utilFailedResponse("Unable to get user", 500);
  }
  user = { ...user, ...params };

  const query = await userDbUpdate(user, env);
  if (!query) {
    throw utilFailedResponse("Error, unable to update user", 500);
  }

  delete user.password;
  return user;
}

export async function userCreate(params: UserCreate, env: Env) {
  let user = await userDbGetByUsername({ username: params.username }, env);
  if (user) {
    throw utilFailedResponse("Username already exists", 400);
  }

  params.password = utilHashHmac256(params.password);
  const create = await userDbInsert(params, env);
  if (!create) {
    throw utilFailedResponse("Error, unable to create user", 500);
  }

  user = await userDbGetByUsername({ username: params.username }, env);
  if (!user) {
    throw utilFailedResponse("Error, unable to get user", 500);
  }

  delete user.password;
  return user;
}

export async function userAddCredit(
  params: {
    receiverId: number;
    senderId: number;
    amount: number;
  },
  env: Env
) {
  const user = await userGet({ userId: params.receiverId }, env);
  if (!user) {
    throw utilFailedResponse("Unable to get user", 500);
  }

  user.credit += params.amount;
  if (user.credit < 0) {
    throw utilFailedResponse("Insufficient credit", 400);
  }

  const logsCredit: LogsCreditCreate = {
    receiverId: params.receiverId,
    senderId: params.senderId,
    amount: params.amount,
    status: 2,
    title: "Top-up",
  };

  const query = await userDbAddCredit({ user, logsCredit }, env);
  if (!query) {
    throw utilFailedResponse("Unable to add credit", 500);
  }

  delete user.password;
  return user as User;
}
