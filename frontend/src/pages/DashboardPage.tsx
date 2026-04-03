import { useEffect, useState } from "react";

import { API_BASE_URL } from "../services/api";
import { fetchUsersWithRecords } from "../services/test-db.service";
import type { TestDbData } from "../types/api";

export const DashboardPage = () => {
  const [data, setData] = useState<TestDbData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        const result = await fetchUsersWithRecords();

        if (!mounted) {
          return;
        }

        setData({
          total: result.reduce((sum, user) => sum + user.records.length, 0),
          rows: result.flatMap((user) =>
            user.records.map((record) => ({
              id: record.id,
              name: user.email,
              createdAt: record.createdAt,
            })),
          ),
        });
      } catch (requestError) {
        if (!mounted) {
          return;
        }

        setError(
          requestError instanceof Error ? requestError.message : "Failed to fetch /test-db",
        );
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    void load();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <main>
      <h1>Dashboard</h1>
      <p>API Base URL: {API_BASE_URL}</p>

      {isLoading && <p>Loading test data...</p>}
      {error && <p>Error: {error}</p>}

      {!isLoading && !error && (
        <>
          <p>Total rows: {data?.total ?? 0}</p>
          <ul>
            {(data?.rows ?? []).map((row) => (
              <li key={row.id}>
                #{row.id} {row.name} ({row.createdAt})
              </li>
            ))}
          </ul>
        </>
      )}
    </main>
  );
};
