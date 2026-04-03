import type { Role } from "../types/api";

export interface SessionUser {
  id: string;
  email: string;
  role: Role;
}

export const getSessionUser = (): SessionUser | null => {
  const raw = localStorage.getItem("user");

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as SessionUser;
  } catch {
    return null;
  }
};

export const clearSession = (): void => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};
