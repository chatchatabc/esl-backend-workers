import { SHA256 } from "crypto-js";

const secret = "secret";

export function authCreateHashPassword(password: string) {
  return SHA256(password + secret).toString();
}
