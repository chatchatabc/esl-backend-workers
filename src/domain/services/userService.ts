import { Env } from "../..";
import { LogsCreditCreate, LogsMoneyCreate } from "../models/LogsModel";
import {
  User,
  UserCreate,
  UserPagination,
  UserUpdate,
} from "../models/UserModel";
import {
  userDbAddCredit,
  userDbCreate,
  userDbGet,
  userDbGetAll,
  userDbGetAllTotal,
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

export async function userUpdate(params: UserUpdate, env: Env) {
  const query = await userDbUpdate(params, env);

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
  createdById: number
) {
  params.password = utilHashHmac256(params.password);
  const create = await userDbCreate(params, env, createdById);

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

export function userColumns() {
  return [
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
  ] as (keyof User)[];
}
