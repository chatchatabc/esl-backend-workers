import { Env } from "../..";
import {
  UserContactInformation,
  UserPersonalInformation,
} from "../models/UserModel";
import { userDbGet, userDbUpdate } from "../repositories/userRepo";
import { utilFailedResponse } from "./utilService";

export async function userGet(params: { userId: number }, env: Env) {
  const user = await userDbGet(params, env);
  if (!user) {
    throw utilFailedResponse("Unable to get user", 500);
  }

  delete user.password;
  return user;
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
