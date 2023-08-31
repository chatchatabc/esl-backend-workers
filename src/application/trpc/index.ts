import { trpcRouterCreate } from "../../domain/infra/trpc";
import authRouter from "./authRouter";
import bookingRouter from "./bookingRouter";
import logsRouter from "./logsRouter";
import userRouter from "./userRouter";
import scheduleRouter from "./scheduleRouter";
import teacherRouter from "./teacherRouter";
import messageRouter from "./messageRouter";
import messageTemplateRouter from "./messageTemplateRouter";
import roleRouter from "./roleRouter";
import courseRouter from "./courseRouter";
import creditRouter from "./creditRouter";

// tRPC Main Router
const trpcRouter = trpcRouterCreate({
  auth: authRouter,
  booking: bookingRouter,
  course: courseRouter,
  credit: creditRouter,
  logs: logsRouter,
  message: messageRouter,
  messageTemplate: messageTemplateRouter,
  role: roleRouter,
  schedule: scheduleRouter,
  teacher: teacherRouter,
  user: userRouter,
});

export default trpcRouter;
export type TrpcRouter = typeof trpcRouter;
