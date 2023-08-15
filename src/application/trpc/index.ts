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

// tRPC Main Router
const trpcRouter = trpcRouterCreate({
  auth: authRouter,
  booking: bookingRouter,
  logs: logsRouter,
  schedule: scheduleRouter,
  user: userRouter,
  teacher: teacherRouter,
  message: messageRouter,
  messageTemplate: messageTemplateRouter,
  role: roleRouter,
});

export default trpcRouter;
export type TrpcRouter = typeof trpcRouter;
