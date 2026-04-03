import type { UserWithRecords } from "../types/api";
import { apiClient } from "./api";

export const fetchUsersWithRecords = async (): Promise<UserWithRecords[]> => {
  const response = await apiClient.get<UserWithRecords[]>("/test-db");
  return response.data;
};
