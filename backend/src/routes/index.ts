import { Router } from "express";

import { authRouter } from "./auth.routes";
import { dashboardRouter } from "./dashboard.routes";
import { healthRouter } from "./health.routes";
import { recordsRouter } from "./records.routes";
import { testDbRouter } from "./test-db.routes";
import { usersRouter } from "./users.routes";

const apiRouter = Router();

apiRouter.use("/auth", authRouter);
apiRouter.use(healthRouter);
apiRouter.use(testDbRouter);
apiRouter.use(recordsRouter);
apiRouter.use(dashboardRouter);
apiRouter.use(usersRouter);

export { apiRouter };
