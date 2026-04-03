import type { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";

import { env } from "../config/env";
import type { AuthenticatedRequest } from "../types/auth";

export function authenticate(
  request: AuthenticatedRequest,
  response: Response,
  next: NextFunction,
): void {
  const token = request.headers.authorization?.split(" ")[1];

  if (!token) {
    response.status(401).json({ message: "No token" });
    return;
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET);
    request.user = decoded as AuthenticatedRequest["user"];
    next();
  } catch {
    response.status(401).json({ message: "Invalid token" });
  }
}
