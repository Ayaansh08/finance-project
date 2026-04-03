import type { Request, Response } from "express";

export const notFoundHandler = (_request: Request, response: Response): void => {
  response.status(404).json({
    success: false,
    error: "Route not found",
  });
};
