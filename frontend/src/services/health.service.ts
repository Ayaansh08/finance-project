import type { ApiResponse, HealthCheckData } from "../types/api";
import { apiClient } from "./api";

export const fetchHealthStatus = async (): Promise<HealthCheckData> => {
  const response = await apiClient.get<ApiResponse<HealthCheckData>>("/health");
  return response.data.data;
};
