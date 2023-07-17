import { Hono } from "hono";
import { CommonContext } from "../../domain/models/CommonModel";
import { userCreate } from "../../domain/services/userService";

const auth = new Hono<CommonContext>();

auth.post("/register", async (c) => {
  let body = await c.req.json();

  // Check if required fields are present
  if (!body.username || body.username === "") {
    return c.json({ error: "Username is required." }, 400);
  } else if (!body.password || body.password === "") {
    return c.json({ error: "Password is required." }, 400);
  } else if (!body.phone || body.phone === "") {
    return c.json({ error: "Phone is required." }, 400);
  } else if (!body.role || body.role === "") {
    return c.json({ error: "Role is required." }, 400);
  }

  return userCreate(c, body);
});

auth.all("/", (c) => {
  return c.text("Hello, Auth!");
});

export default auth;
