import { useEffect, useState } from "react";

import type { HealthCheckData } from "../types/api";
import { fetchHealthStatus } from "../services/health.service";

interface UseHealthCheckState {
  data: HealthCheckData | null;
  error: string | null;
  isLoading: boolean;
}

export const useHealthCheck = (): UseHealthCheckState => {
  const [data, setData] = useState<HealthCheckData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadHealthStatus = async () => {
      try {
        const result = await fetchHealthStatus();

        if (!isMounted) {
          return;
        }

        setData(result);
      } catch (requestError) {
        if (!isMounted) {
          return;
        }

        const message =
          requestError instanceof Error ? requestError.message : "Unable to reach backend";

        setError(message);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadHealthStatus();

    return () => {
      isMounted = false;
    };
  }, []);

  return {
    data,
    error,
    isLoading,
  };
};
