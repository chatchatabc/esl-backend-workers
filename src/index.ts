import { Hono } from "hono";
import rest from "./application/rest";
import { CommonEnv } from "./domain/models/CommonModel";
import { honoFailedResponse } from "./domain/services/honoService";

const app = new Hono<{ Bindings: CommonEnv }>();

app.route("/api", rest);

app.all("*", (c) => honoFailedResponse(c, "Route not found.", 404));

export default app;
