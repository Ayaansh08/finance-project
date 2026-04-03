import { useEffect, useState } from "react";

import { SummaryCard } from "../components/dashboard/SummaryCard";
import { fetchDashboardSummary } from "../services/dashboard.service";
import type { DashboardSummary } from "../types/api";
import { parseApiError } from "../utils/api-error";

export default function Dashboard() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      try {
        const response = await fetchDashboardSummary();
        if (!isMounted) {
          return;
        }
        setSummary(response);
        setError(null);
      } catch (requestError) {
        if (!isMounted) {
          return;
        }
        setError(parseApiError(requestError, "Failed to load dashboard summary"));
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void load();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="page-section">
      <div className="page-section__header">
        <h2 className="page-section__title">Dashboard</h2>
        <p className="page-section__subtitle">Financial totals at a glance</p>
      </div>

      {isLoading && (
        <div className="summary-grid">
          <div className="summary-card skeleton" />
          <div className="summary-card skeleton" />
          <div className="summary-card skeleton" />
        </div>
      )}

      {error && <p className="status status--error">{error}</p>}

      {!isLoading && !error && summary && (
        <div className="summary-grid">
          <SummaryCard label="Total Income" value={`$${summary.totalIncome.toFixed(2)}`} tone="positive" />
          <SummaryCard label="Total Expense" value={`$${summary.totalExpense.toFixed(2)}`} tone="danger" />
          <SummaryCard label="Net Balance" value={`$${summary.netBalance.toFixed(2)}`} />
        </div>
      )}
    </section>
  );
}
