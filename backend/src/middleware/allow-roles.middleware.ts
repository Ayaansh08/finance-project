import type { Role } from "@prisma/client";
import type { NextFunction, Response } from "express";

import type { AuthenticatedRequest } from "../types/auth";

export const allowRoles =
  (...roles: Role[]) =>
  (request: AuthenticatedRequest, response: Response, next: NextFunction): void => {
    const role = request.user?.role;

    if (!role) {
      response.status(401).json({ message: "Unauthorized" });
      return;
    }

    if (!roles.includes(role)) {
      response.status(403).json({ message: "Forbidden" });
      return;
    }

    next();
  };
