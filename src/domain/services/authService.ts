import { UserRegister, UserRegisterInput } from "../models/UserModel";
import { Env } from "../..";
import { userDbGetByUsername, userDbInsert } from "../repositories/userRepo";
import {
  utilDecodeBase64,
  utilEncodeBase64,
  utilFailedResponse,
  utilHashHmac256,
} from "./utilService";

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

  const authSignature = utilHashHmac256(`${header}.${payload}`).toString();
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
  return user;
}
