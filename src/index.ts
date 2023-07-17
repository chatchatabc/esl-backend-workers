import { Hono } from "hono";
import rest from "./application/rest";
import { CommonEnv } from "./domain/models/CommonModel";

const app = new Hono<{ Bindings: CommonEnv }>();

app.route("/api", rest);

app.all("*", (c) => c.text("Not Found", 404));

export default app;
