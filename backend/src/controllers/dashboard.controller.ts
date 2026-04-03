import type { NextFunction, Response } from "express";

import { AppError } from "../errors/app-error";
import type { AuthenticatedRequest } from "../types/auth";
import {
  getCategoryBreakdown,
  getDashboardSummary,
  getMonthlyTrends,
} from "../services/dashboard.service";
import { dashboardCategoryQuerySchema } from "../validation/dashboard.schema";

const getUserId = (request: AuthenticatedRequest): string => {
  const userId = request.user?.id;

  if (!userId) {
    throw new AppError("Unauthorized", 401);
  }

  return userId;
};

export const dashboardSummary = async (
  request: AuthenticatedRequest,
  response: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = getUserId(request);
    const data = await getDashboardSummary(userId);
    response.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

export const dashboardCategory = async (
  request: AuthenticatedRequest,
  response: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = getUserId(request);
    const query = dashboardCategoryQuerySchema.parse(request.query);
    const data = await getCategoryBreakdown(userId, query.type);
    response.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

export const dashboardTrends = async (
  request: AuthenticatedRequest,
  response: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = getUserId(request);
    const data = await getMonthlyTrends(userId);
    response.status(200).json(data);
  } catch (error) {
    next(error);
  }
};
