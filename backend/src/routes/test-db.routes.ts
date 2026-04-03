import { Router } from "express";

import { getTestDb } from "../controllers/test-db.controller";
import { authenticate } from "../middleware/auth.middleware";

const testDbRouter = Router();

testDbRouter.get("/test-db", authenticate, getTestDb);

export { testDbRouter };
