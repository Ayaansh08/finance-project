import { env } from "../config/env";
import type { HealthStatus } from "../types/api";

export const getHealthStatus = (): HealthStatus => ({
  status: "ok",
  timestamp: new Date().toISOString(),
  uptime: Number(process.uptime().toFixed(2)),
  environment: env.NODE_ENV,
});
