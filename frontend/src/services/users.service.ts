import { api } from "./api";
import type { Role, UserAdminItem } from "../types/api";

export const fetchUsers = async (): Promise<UserAdminItem[]> => {
  const response = await api.get<UserAdminItem[]>("/users");
  return response.data;
};

export const patchUserRole = async (id: string, role: Role): Promise<UserAdminItem> => {
  const response = await api.patch<UserAdminItem>(`/users/${id}/role`, { role });
  return response.data;
};

export const patchUserStatus = async (
  id: string,
  isActive: boolean,
): Promise<UserAdminItem> => {
  const response = await api.patch<UserAdminItem>(`/users/${id}/status`, { isActive });
  return response.data;
};
