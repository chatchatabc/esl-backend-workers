import { Hono } from "hono";
import { CommonContext } from "../../domain/models/CommonModel";
import { userCreate } from "../../domain/services/userService";
import { honoFailedResponse } from "../../domain/services/honoService";

const auth = new Hono<CommonContext>();

auth.post("/register", async (c) => {
  let body = await c.req.json();

  // Check if required fields are present
  if (!body.username || body.username === "") {
    return honoFailedResponse(c, "Username is required.", 400);
  } else if (!body.password || body.password === "") {
    return honoFailedResponse(c, "Password is required.", 400);
  } else if (!body.phone || body.phone === "") {
    return honoFailedResponse(c, "Phone is required.", 400);
  } else if (!body.role || body.role === "") {
    return honoFailedResponse(c, "Role is required.", 400);
  }

  return userCreate(c, body);
});

auth.all("*", (c) => {
  return honoFailedResponse(c, "Not Found", 404);
});

export default auth;
