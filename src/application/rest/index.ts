import { Hono } from "hono";
import { CommonEnv } from "../../domain/models/CommonModel";
import auth from "./authController";
import { honoFailedResponse } from "../../domain/services/honoService";

const rest = new Hono<{ Bindings: CommonEnv }>();

rest.route("/auth", auth);

rest.all("*", (c) => honoFailedResponse(c, "Route not found.", 404));

export default rest;
