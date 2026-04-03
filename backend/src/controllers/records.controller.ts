import type { NextFunction, Response } from "express";

import { AppError } from "../errors/app-error";
import type { AuthenticatedRequest } from "../types/auth";
import {
  createRecordForUser,
  deleteRecordForUser,
  getRecordForUser,
  listRecordsForUser,
  type RecordsActor,
  updateRecordForUser,
} from "../services/records.service";
import {
  createRecordSchema,
  listRecordsQuerySchema,
  updateRecordSchema,
} from "../validation/record.schema";

const getActor = (request: AuthenticatedRequest): RecordsActor => {
  if (!request.user?.id || !request.user.role) {
    throw new AppError("Unauthorized", 401);
  }

  return {
    id: request.user.id,
    role: request.user.role,
  };
};

export const listRecords = async (
  request: AuthenticatedRequest,
  response: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const actor = getActor(request);
    const query = listRecordsQuerySchema.parse(request.query);
    const result = await listRecordsForUser(actor, query);
    response.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const createRecord = async (
  request: AuthenticatedRequest,
  response: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const actor = getActor(request);
    const payload = createRecordSchema.parse(request.body);
    const record = await createRecordForUser(actor, payload);
    response.status(201).json(record);
  } catch (error) {
    next(error);
  }
};

export const getRecord = async (
  request: AuthenticatedRequest,
  response: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const actor = getActor(request);
    const recordId = String(request.params.id);
    const record = await getRecordForUser(actor, recordId);
    response.status(200).json(record);
  } catch (error) {
    next(error);
  }
};

export const updateRecord = async (
  request: AuthenticatedRequest,
  response: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const actor = getActor(request);
    const recordId = String(request.params.id);
    const payload = updateRecordSchema.parse(request.body);
    const updated = await updateRecordForUser(actor, recordId, payload);
    response.status(200).json(updated);
  } catch (error) {
    next(error);
  }
};

export const deleteRecord = async (
  request: AuthenticatedRequest,
  response: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const actor = getActor(request);
    const recordId = String(request.params.id);
    await deleteRecordForUser(actor, recordId);
    response.status(200).json({ message: "Record deleted" });
  } catch (error) {
    next(error);
  }
};
