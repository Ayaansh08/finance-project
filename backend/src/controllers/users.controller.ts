import { Prisma, Role } from "@prisma/client";
import type { NextFunction, Request, Response } from "express";
import { z } from "zod";

import { listUsers, updateUserRole, updateUserStatus } from "../services/users.service";

const roleSchema = z.object({
  role: z.nativeEnum(Role),
});

const statusSchema = z.object({
  isActive: z.coerce.boolean(),
});

export const getUsers = async (_request: Request, response: Response, next: NextFunction): Promise<void> => {
  try {
    const users = await listUsers();
    response.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

export const patchUserRole = async (
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = String(request.params.id);
    const parsed = roleSchema.safeParse(request.body);

    if (!parsed.success) {
      response.status(400).json({ message: "Invalid payload", issues: parsed.error.flatten() });
      return;
    }

    const user = await updateUserRole(userId, parsed.data.role);
    response.status(200).json(user);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      response.status(404).json({ message: "User not found" });
      return;
    }

    next(error);
  }
};

export const patchUserStatus = async (
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = String(request.params.id);
    const parsed = statusSchema.safeParse(request.body);

    if (!parsed.success) {
      response.status(400).json({ message: "Invalid payload", issues: parsed.error.flatten() });
      return;
    }

    const user = await updateUserStatus(userId, parsed.data.isActive);
    response.status(200).json(user);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      response.status(404).json({ message: "User not found" });
      return;
    }

    next(error);
  }
};
