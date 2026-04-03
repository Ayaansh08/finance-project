export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
}

export interface HealthStatus {
  status: "ok";
  timestamp: string;
  uptime: number;
  environment: string;
}
