import { Context, Hono } from "hono";
import { CommonEnv } from "../../domain/models/CommonModel";
import auth from "./AuthController";

const rest = new Hono<CommonEnv>();

rest.route("/auth", auth);

export default rest;
