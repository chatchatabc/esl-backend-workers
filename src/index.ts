import { Hono } from "hono";
import rest from "./application/rest";
import { CommonEnv } from "./domain/models/CommonModel";

const app = new Hono<{ Bindings: CommonEnv }>();

app.route("/api", rest);

app.all("*", (c) =>
  c.json(
    {
      errors: [
        {
          title: "Not Found",
          message: "The requested resource could not be found.",
        },
      ],
    },
    404
  )
);

export default app;
