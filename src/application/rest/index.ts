import { Hono } from "hono";
import { cors } from "hono/cors";
import { CommonEnv } from "../../domain/models/CommonModel";
import auth from "./authController";
import { honoFailedResponse } from "../../domain/services/honoService";

const rest = new Hono<{ Bindings: CommonEnv }>();

rest.use(
  "*",
  cors({
    origin: ["http://localhost:3000"],
    allowMethods: ["*"],
    allowHeaders: ["Content-Type", "Authorization"],
  })
);

rest.route("/auth", auth);

rest.all("*", (c) => honoFailedResponse(c, "Route not found.", 404));

export default rest;
