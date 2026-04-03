import { RecordType } from "@prisma/client";
import { z } from "zod";

export const createRecordSchema = z.object({
  amount: z.coerce.number().positive(),
  type: z.nativeEnum(RecordType),
  category: z.string().trim().min(1),
  date: z.coerce.date(),
  notes: z.string().trim().optional(),
});

export const updateRecordSchema = z
  .object({
    amount: z.coerce.number().positive().optional(),
    type: z.nativeEnum(RecordType).optional(),
    category: z.string().trim().min(1).optional(),
    date: z.coerce.date().optional(),
    notes: z.string().trim().nullable().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "No fields provided for update",
  });

export const listRecordsQuerySchema = z.object({
  type: z.nativeEnum(RecordType).optional(),
  category: z.string().trim().min(1).optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
}).refine(
  (query) =>
    !query.startDate ||
    !query.endDate ||
    query.startDate.getTime() <= query.endDate.getTime(),
  {
    message: "startDate must be before or equal to endDate",
    path: ["startDate"],
  },
);

export type CreateRecordInput = z.infer<typeof createRecordSchema>;
export type UpdateRecordInput = z.infer<typeof updateRecordSchema>;
export type ListRecordsQuery = z.infer<typeof listRecordsQuerySchema>;
