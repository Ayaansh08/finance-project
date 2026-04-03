import { api } from "./api";
import type {
  CreateRecordPayload,
  RecordItem,
  RecordsListResponse,
  RecordType,
  UpdateRecordPayload,
} from "../types/api";

export interface FetchRecordsQuery {
  type?: RecordType | "ALL";
  category?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export const fetchRecords = async (
  query: FetchRecordsQuery = {},
): Promise<RecordsListResponse> => {
  const params = {
    ...(query.type && query.type !== "ALL" ? { type: query.type } : {}),
    ...(query.category && query.category !== "ALL" ? { category: query.category } : {}),
    ...(query.startDate ? { startDate: query.startDate } : {}),
    ...(query.endDate ? { endDate: query.endDate } : {}),
    ...(query.page ? { page: query.page } : {}),
    ...(query.limit ? { limit: query.limit } : {}),
  };

  const response = await api.get<RecordsListResponse>("/records", { params });
  return response.data;
};

export const createRecord = async (payload: CreateRecordPayload): Promise<RecordItem> => {
  const response = await api.post<RecordItem>("/records", payload);
  return response.data;
};

export const updateRecord = async (
  id: string,
  payload: UpdateRecordPayload,
): Promise<RecordItem> => {
  const response = await api.patch<RecordItem>(`/records/${id}`, payload);
  return response.data;
};

export const deleteRecord = async (id: string): Promise<void> => {
  await api.delete(`/records/${id}`);
};
