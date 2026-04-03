import type { NextFunction, Request, Response } from "express";

import { loginUser, registerUser } from "../services/auth.service";
import { authPayloadSchema } from "../validation/auth.schema";

export async function register(
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { email, password } = authPayloadSchema.parse(request.body);

    const user = await registerUser(email, password);
    response.status(201).json(user);
  } catch (error) {
    next(error);
  }
}

export async function login(
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { email, password } = authPayloadSchema.parse(request.body);

    const data = await loginUser(email, password);
    response.json(data);
  } catch (error) {
    next(error);
  }
}
