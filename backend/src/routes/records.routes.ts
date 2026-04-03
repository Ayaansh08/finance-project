import { Router } from "express";

import {
  createRecord,
  deleteRecord,
  getRecord,
  listRecords,
  updateRecord,
} from "../controllers/records.controller";
import { allowRoles } from "../middleware/allow-roles.middleware";
import { authenticate } from "../middleware/auth.middleware";

const recordsRouter = Router();

recordsRouter.get("/records", authenticate, allowRoles("ANALYST", "ADMIN"), listRecords);
recordsRouter.get("/records/:id", authenticate, allowRoles("ANALYST", "ADMIN"), getRecord);
recordsRouter.post("/records", authenticate, allowRoles("ADMIN"), createRecord);
recordsRouter.patch("/records/:id", authenticate, allowRoles("ADMIN"), updateRecord);
recordsRouter.delete("/records/:id", authenticate, allowRoles("ADMIN"), deleteRecord);

export { recordsRouter };
