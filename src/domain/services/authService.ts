import {
  UserLogin,
  UserRegister,
  UserRegisterInput,
} from "../models/UserModel";
import { Env } from "../..";
import {
  userDbGet,
  userDbGetByUsername,
  userDbInsert,
  userDbUpdate,
} from "../repositories/userRepo";
import {
  utilDecodeBase64,
  utilEncodeBase64,
  utilFailedResponse,
  utilGenerateRandomCode,
  utilHashHmac256,
} from "./utilService";
import { messageSend } from "./messageService";

const jwtHeader = JSON.stringify({ alg: "HS256", typ: "JWT" });
const base64Header = utilEncodeBase64(jwtHeader);

export function authCreateJsonWebToken(id: number) {
  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + 60 * 60 * 24 * 7; // 7 days

  const jwtPayload = JSON.stringify({ exp, id });
  const base64Payload = utilEncodeBase64(jwtPayload);
  const signature = utilHashHmac256(`${base64Header}.${base64Payload}`);

  return `${base64Header}.${base64Payload}.${signature}`;
}

export function authValidateToken(token: string) {
  const [header, payload, signature] = token.split(".");
  if (!header || !payload || !signature) {
    return false;
  }
  console.log(header, payload, signature);
  const authSignature = utilHashHmac256(`${header}.${payload}`).toString();
  console.log(authSignature, signature);
  if (signature !== authSignature) {
    return false;
  }

  return true;
}

export function authGetTokenPayload(token: string) {
  if (token.startsWith("Bearer ")) {
    token = token.slice("bearer ".length);
  }

  if (!authValidateToken(token)) {
    return undefined;
  }

  const payload = utilDecodeBase64(token.split(".")[1]);
  const data = JSON.parse(payload) as { id: number; exp: number };

  if (data.exp < Date.now() / 1000) {
    return undefined;
  }

  return data.id;
}

export async function authRegister(input: UserRegisterInput, env: Env) {
  let user = await userDbGetByUsername(input, env);
  if (user) {
    throw utilFailedResponse("User already exists", 400);
  }

  // Create user registration
  const password = utilHashHmac256(input.password).toString();
  const register: UserRegister = {
    ...input,
    password,
    roleId: 2,
    credit: 0,
  };

  // Insert user registration
  const query = await userDbInsert(register, env);
  if (!query) {
    throw utilFailedResponse("Failed to register user", 400);
  }

  user = await userDbGetByUsername(input, env);
  if (!user) {
    throw utilFailedResponse("Failed to register user", 400);
  }

  delete user.password;
  return user;
}

export async function authLogin(params: UserLogin, env: Env) {
  let user = await userDbGetByUsername(params, env);
  if (!user) {
    throw utilFailedResponse("Invalid username or password", 401);
  } else if (user.password !== utilHashHmac256(params.password)) {
    throw utilFailedResponse("Invalid username or password", 401);
  }

  delete user.password;
  return user;
}

export async function authGetPhoneToken(params: { userId: number }, env: Env) {
  // Get user
  const user = await userDbGet(params, env);
  if (!user) {
    throw utilFailedResponse("Cannot find user", 404);
  }

  // Check if user has phone number
  if (!user.phone) {
    throw utilFailedResponse("Cannot find phone number", 404);
  }

  // Generate 6 digits token
  const randomToken = utilGenerateRandomCode();

  // Save token to KV
  const data = {
    type: "phone",
    userId: user.id,
    exp: new Date().getTime() + 1000 * 60 * 5,
  };
  await env.KV.put(randomToken, JSON.stringify(data));

  // Send message
  const message = {
    mobile: user.phone,
    content: `【恰恰英语】您的手机验证码是${randomToken}，有效期仅5分钟。`,
  };
  const response = await messageSend(message);

  return response;
}

export async function authValidatePhoneToken(
  params: { token: string; userId: number },
  env: Env
) {
  // Get token from KV
  const data = await env.KV.get(params.token);
  if (!data) {
    throw utilFailedResponse("Invalid token", 400);
  }

  // Validate token
  const parsedData = JSON.parse(data);
  if (parsedData.type !== "phone") {
    throw utilFailedResponse("Invalid token", 400);
  } else if (parsedData.exp < new Date().getTime()) {
    throw utilFailedResponse("Expired token", 400);
  } else if (parsedData.userId !== params.userId) {
    throw utilFailedResponse("Invalid token", 400);
  }

  // Get user
  const user = await userDbGet({ userId: params.userId }, env);
  if (!user) {
    throw utilFailedResponse("Cannot find user", 404);
  }
  // Verify user phone
  user.phoneVerifiedAt = new Date().getTime();
  // Update user
  const update = await userDbUpdate(user, env);
  if (!update) {
    throw utilFailedResponse("Error", 500);
  }

  // Delete token from KV
  await env.KV.delete(params.token);

  return true;
}
