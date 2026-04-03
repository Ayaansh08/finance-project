import { Router } from "express";

import {
  dashboardCategory,
  dashboardSummary,
  dashboardTrends,
} from "../controllers/dashboard.controller";
import { allowRoles } from "../middleware/allow-roles.middleware";
import { authenticate } from "../middleware/auth.middleware";

const dashboardRouter = Router();

dashboardRouter.get(
  "/dashboard/summary",
  authenticate,
  allowRoles("VIEWER", "ANALYST", "ADMIN"),
  dashboardSummary,
);
dashboardRouter.get(
  "/dashboard/category",
  authenticate,
  allowRoles("VIEWER", "ANALYST", "ADMIN"),
  dashboardCategory,
);
dashboardRouter.get(
  "/dashboard/trends",
  authenticate,
  allowRoles("VIEWER", "ANALYST", "ADMIN"),
  dashboardTrends,
);

export { dashboardRouter };
