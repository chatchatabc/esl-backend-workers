import { Context } from "hono";
import { CommonContext } from "../models/CommonModel";

export function honoFailedResponse(
  c: Context<CommonContext>,
  message: string,
  status: number
) {
  let title = "Internal Server Error";

  switch (status) {
    case 400: {
      title = "Bad Request";
      break;
    }
    case 401: {
      title = "Unauthorized";
      break;
    }
    case 403: {
      title = "Forbidden";
      break;
    }
    case 404: {
      title = "Not Found";
      break;
    }
  }

  return c.json(
    {
      errors: [
        {
          title,
          message,
        },
      ],
    },
    status
  );
}
