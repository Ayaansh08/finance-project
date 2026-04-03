import axios from "axios";

interface ApiErrorResponse {
  message?: string;
  error?: string;
}

export const parseApiError = (error: unknown, fallback: string): string => {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    const data = error.response?.data;
    return data?.message ?? data?.error ?? error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
};
