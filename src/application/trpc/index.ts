import { trpcRouterCreate } from "../../domain/infra/trpc";
import authRouter from "./authRouter";
import bookingRouter from "./bookingRouter";
import logsRouter from "./logsRouter";
import userRouter from "./userRouter";
import scheduleRouter from "./scheduleRouter";
import teacherRouter from "./teacherRouter";

// tRPC Main Router
const trpcRouter = trpcRouterCreate({
  auth: authRouter,
  booking: bookingRouter,
  logs: logsRouter,
  schedule: scheduleRouter,
  user: userRouter,
  teacher: teacherRouter,
});

export default trpcRouter;
export type TrpcRouter = typeof trpcRouter;
