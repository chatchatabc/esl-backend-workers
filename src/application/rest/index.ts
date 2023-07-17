import { Hono } from "hono";
import { CommonEnv } from "../../domain/models/CommonModel";
import auth from "./authController";

const rest = new Hono<{ Bindings: CommonEnv }>();

rest.route("/auth", auth);

rest.all("*", (c) =>
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

export default rest;
