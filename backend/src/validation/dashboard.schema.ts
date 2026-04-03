import { RecordType } from "@prisma/client";
import { z } from "zod";

export const dashboardCategoryQuerySchema = z.object({
  type: z.nativeEnum(RecordType).optional(),
});

export type DashboardCategoryQuery = z.infer<typeof dashboardCategoryQuerySchema>;
