import { Hono } from "hono";
import { CommonEnv } from "../../domain/models/CommonModel";

const auth = new Hono<CommonEnv>();

auth.all("/", (c) => {
  return c.text("Hello, Auth!");
});

export default auth;
