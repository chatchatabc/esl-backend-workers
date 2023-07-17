import { Hono } from "hono";
import { CommonEnv } from "../../domain/models/CommonModel";
import auth from "./authController";

const rest = new Hono<CommonEnv>();

rest.route("/auth", auth);

export default rest;
