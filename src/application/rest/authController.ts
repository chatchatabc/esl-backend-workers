import { Hono } from "hono";
import { CommonEnv } from "../../domain/models/CommonModel";

const auth = new Hono<{ Bindings: CommonEnv }>();

auth.all("/", (c) => {
  return c.text("Hello, Auth!");
});

export default auth;
