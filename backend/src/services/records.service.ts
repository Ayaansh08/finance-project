import type { Prisma, Role } from "@prisma/client";

import { db } from "../config/db";
import { AppError } from "../errors/app-error";
import type {
  CreateRecordInput,
  ListRecordsQuery,
  UpdateRecordInput,
} from "../validation/record.schema";

export interface ListRecordsResult {
  data: Array<{
    id: string;
    amount: Prisma.Decimal;
    type: "INCOME" | "EXPENSE";
    category: string;
    date: Date;
    notes: string | null;
    userId: string;
    createdAt: Date;
  }>;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface RecordsActor {
  id: string;
  role: Role;
}

const publicRecordSelect = {
  id: true,
  amount: true,
  type: true,
  category: true,
  date: true,
  notes: true,
  userId: true,
  createdAt: true,
} as const satisfies Prisma.RecordSelect;

const getRecordById = async (id: string) => {
  return db.record.findUnique({
    where: { id },
    select: publicRecordSelect,
  });
};

const ensureAccessToRecord = async (recordId: string, actor: RecordsActor) => {
  const record = await getRecordById(recordId);

  if (!record) {
    throw new AppError("Record not found", 404);
  }

  const canReadAll = actor.role === "ADMIN" || actor.role === "ANALYST";

  if (!canReadAll && record.userId !== actor.id) {
    throw new AppError("Forbidden", 403);
  }

  return record;
};

export const listRecordsForUser = async (
  actor: RecordsActor,
  query: ListRecordsQuery,
): Promise<ListRecordsResult> => {
  const { type, category, startDate, endDate, page, limit } = query;
  const canReadAll = actor.role === "ADMIN" || actor.role === "ANALYST";

  const where: Prisma.RecordWhereInput = {
    ...(canReadAll ? {} : { userId: actor.id }),
    ...(type ? { type } : {}),
    ...(category ? { category } : {}),
    ...(startDate || endDate
      ? {
          date: {
            ...(startDate ? { gte: startDate } : {}),
            ...(endDate ? { lte: endDate } : {}),
          },
        }
      : {}),
  };

  const [total, records] = await Promise.all([
    db.record.count({ where }),
    db.record.findMany({
      where,
      orderBy: { date: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      select: publicRecordSelect,
    }),
  ]);

  return {
    data: records,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    },
  };
};

export const getRecordForUser = async (actor: RecordsActor, recordId: string) => {
  return ensureAccessToRecord(recordId, actor);
};

export const createRecordForUser = async (actor: RecordsActor, data: CreateRecordInput) => {
  return db.record.create({
    data: {
      ...data,
      userId: actor.id,
    },
    select: publicRecordSelect,
  });
};

export const updateRecordForUser = async (
  actor: RecordsActor,
  recordId: string,
  data: UpdateRecordInput,
) => {
  await ensureAccessToRecord(recordId, actor);

  return db.record.update({
    where: { id: recordId },
    select: publicRecordSelect,
    data,
  });
};

export const deleteRecordForUser = async (actor: RecordsActor, recordId: string) => {
  await ensureAccessToRecord(recordId, actor);

  return db.record.delete({
    where: { id: recordId },
    select: publicRecordSelect,
  });
};
