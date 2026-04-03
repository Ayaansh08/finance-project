import { Router } from "express";

import { healthCheck, uptimePing } from "../controllers/health.controller";

const healthRouter = Router();

healthRouter.get("/health", healthCheck);
healthRouter.get("/uptime", uptimePing);

export { healthRouter };
