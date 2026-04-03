import type { Request, Response } from "express";

import { getHealthStatus } from "../services/health.service";
import { successResponse } from "../utils/api-response";

export const healthCheck = (_request: Request, response: Response): void => {
  response.status(200).json(successResponse(getHealthStatus()));
};

export const uptimePing = (_request: Request, response: Response): void => {
  response.status(200).type("text/plain").send("ok");
};
