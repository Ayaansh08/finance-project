import type { Role } from "@prisma/client";
import type { Request } from "express";

export interface AuthUserPayload {
  id: string;
  role: Role;
  iat?: number;
  exp?: number;
}

export type AuthenticatedRequest = Request & {
  user?: AuthUserPayload;
};
