import { Prisma, RecordType } from "@prisma/client";

import { db } from "../config/db";

export interface DashboardSummary {
  totalIncome: number;
  totalExpense: number;
  netBalance: number;
}

export interface DashboardCategoryItem {
  category: string;
  total: number;
}

export interface DashboardTrendItem {
  month: string;
  income: number;
  expense: number;
}

export const getDashboardSummary = async (userId: string): Promise<DashboardSummary> => {
  const [income, expense] = await Promise.all([
    db.record.aggregate({
      where: { userId, type: "INCOME" },
      _sum: { amount: true },
    }),
    db.record.aggregate({
      where: { userId, type: "EXPENSE" },
      _sum: { amount: true },
    }),
  ]);

  const totalIncome = Number(income._sum.amount ?? 0);
  const totalExpense = Number(expense._sum.amount ?? 0);

  return {
    totalIncome,
    totalExpense,
    netBalance: totalIncome - totalExpense,
  };
};

export const getCategoryBreakdown = async (
  userId: string,
  type?: RecordType,
): Promise<DashboardCategoryItem[]> => {
  const rows = await db.record.groupBy({
    by: ["category"],
    where: {
      userId,
      ...(type ? { type } : {}),
    },
    _sum: { amount: true },
    orderBy: { category: "asc" },
  });

  return rows.map((row) => ({
    category: row.category,
    total: Number(row._sum.amount ?? 0),
  }));
};

export const getMonthlyTrends = async (userId: string): Promise<DashboardTrendItem[]> => {
  const rows = await db.$queryRaw<
    Array<{ month: Date; income: Prisma.Decimal | null; expense: Prisma.Decimal | null }>
  >`
    SELECT
      DATE_TRUNC('month', "date") AS month,
      SUM(CASE WHEN "type" = 'INCOME' THEN "amount" ELSE 0 END) AS income,
      SUM(CASE WHEN "type" = 'EXPENSE' THEN "amount" ELSE 0 END) AS expense
    FROM "Record"
    WHERE "userId" = ${userId}
    GROUP BY DATE_TRUNC('month', "date")
    ORDER BY DATE_TRUNC('month', "date") ASC
  `;

  return rows.map((row) => ({
    month: row.month.toISOString().slice(0, 7),
    income: Number(row.income ?? 0),
    expense: Number(row.expense ?? 0),
  }));
};
