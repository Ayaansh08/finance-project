import { Router } from "express";

import { getUsers, patchUserRole, patchUserStatus } from "../controllers/users.controller";
import { allowRoles } from "../middleware/allow-roles.middleware";
import { authenticate } from "../middleware/auth.middleware";

const usersRouter = Router();

usersRouter.get("/users", authenticate, allowRoles("ADMIN"), getUsers);
usersRouter.patch("/users/:id/role", authenticate, allowRoles("ADMIN"), patchUserRole);
usersRouter.patch("/users/:id/status", authenticate, allowRoles("ADMIN"), patchUserStatus);

export { usersRouter };
