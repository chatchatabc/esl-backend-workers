import authRouter from "./authRouter";
import { trpcRouterCreate } from "../../domain/infra/trpc";

// tRPC Main Router
const trpcRouter = trpcRouterCreate({
  auth: authRouter,
});

export default trpcRouter;
export type TrpcRouter = typeof trpcRouter;
