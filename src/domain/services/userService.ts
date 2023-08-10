import { Env } from "../..";
import { CommonPagination } from "../models/CommonModel";
import {
  User,
  UserContactInformation,
  UserPersonalInformation,
} from "../models/UserModel";
import {
  userDbGet,
  userDbGetAll,
  userDbGetAllTotal,
  userDbUpdate,
} from "../repositories/userRepo";
import { utilFailedResponse } from "./utilService";

export async function userGet(params: { userId: number }, env: Env) {
  const user = await userDbGet(params, env);
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

export async function userUpdateProfile(
  params: UserPersonalInformation & UserContactInformation & { userId: number },
  env: Env
) {
  let user = await userDbGet({ userId: params.userId ?? 0 }, env);
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
