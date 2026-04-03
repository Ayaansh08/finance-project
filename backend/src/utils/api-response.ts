import type { ApiSuccessResponse } from "../types/api";

export const successResponse = <T>(data: T): ApiSuccessResponse<T> => ({
  success: true,
  data,
});
