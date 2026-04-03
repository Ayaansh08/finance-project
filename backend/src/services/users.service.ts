import type { Role } from "@prisma/client";

import { db } from "../config/db";

const userSelect = {
  id: true,
  email: true,
  role: true,
  isActive: true,
  createdAt: true,
} as const;

export const listUsers = async () => {
  return db.user.findMany({
    orderBy: { createdAt: "desc" },
    select: userSelect,
  });
};

export const updateUserRole = async (id: string, role: Role) => {
  return db.user.update({
    where: { id },
    data: { role },
    select: userSelect,
  });
};

export const updateUserStatus = async (id: string, isActive: boolean) => {
  return db.user.update({
    where: { id },
    data: { isActive },
    select: userSelect,
  });
};
