import { Prisma } from "@prisma/client";
import type { NextFunction, Request, Response } from "express";

import { fetchTestDbData } from "../services/test-db.service";

export const getTestDb = async (
  _request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const users = await fetchTestDbData();
    response.status(200).json(users);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientInitializationError) {
      response.status(503).json({
        success: false,
        error: "Database unavailable. Start PostgreSQL and run Prisma migration.",
      });
      return;
    }

    next(error);
  }
};
