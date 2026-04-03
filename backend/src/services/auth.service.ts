import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { env } from "../config/env";
import { prisma } from "../config/db";
import { AppError } from "../errors/app-error";

type PublicUser = {
  id: string;
  email: string;
  role: "VIEWER" | "ANALYST" | "ADMIN";
  isActive: boolean;
  createdAt: Date;
};

const toPublicUser = (user: {
  id: string;
  email: string;
  role: "VIEWER" | "ANALYST" | "ADMIN";
  isActive: boolean;
  createdAt: Date;
}): PublicUser => ({
  id: user.id,
  email: user.email,
  role: user.role,
  isActive: user.isActive,
  createdAt: user.createdAt,
});

export async function registerUser(email: string, password: string): Promise<PublicUser> {
  const normalizedEmail = email.trim().toLowerCase();
  const existingUser = await prisma.user.findUnique({
    where: { email: normalizedEmail },
    select: { id: true },
  });

  if (existingUser) {
    throw new AppError("Email already in use", 409);
  }

  const hashed = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { email: normalizedEmail, password: hashed },
  });

  return toPublicUser(user);
}

export async function loginUser(
  email: string,
  password: string,
): Promise<{ token: string; user: PublicUser }> {
  const normalizedEmail = email.trim().toLowerCase();
  const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });
  if (!user) {
    throw new AppError("Invalid credentials", 401);
  }

  if (!user.isActive) {
    throw new AppError("Account is inactive", 403);
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new AppError("Invalid credentials", 401);
  }

  const token = jwt.sign({ id: user.id, role: user.role }, env.JWT_SECRET, {
    expiresIn: "1d",
  });

  return { token, user: toPublicUser(user) };
}
