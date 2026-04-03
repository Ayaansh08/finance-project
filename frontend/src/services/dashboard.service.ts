import { api } from "./api";
import type {
  DashboardCategoryItem,
  DashboardSummary,
  RecordType,
  DashboardTrendItem,
} from "../types/api";

export const fetchDashboardSummary = async (): Promise<DashboardSummary> => {
  const response = await api.get<DashboardSummary>("/dashboard/summary");
  return response.data;
};

export const fetchDashboardCategory = async (
  type?: RecordType,
): Promise<DashboardCategoryItem[]> => {
  const response = await api.get<DashboardCategoryItem[]>("/dashboard/category", {
    params: type ? { type } : undefined,
  });
  return response.data;
};

export const fetchDashboardTrends = async (): Promise<DashboardTrendItem[]> => {
  const response = await api.get<DashboardTrendItem[]>("/dashboard/trends");
  return response.data;
};
