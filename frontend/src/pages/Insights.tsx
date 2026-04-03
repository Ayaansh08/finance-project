import { useEffect, useState } from "react";

import { CategoryPieChart } from "../components/dashboard/CategoryPieChart";
import { MonthlyTrendChart } from "../components/dashboard/MonthlyTrendChart";
import { SummaryCard } from "../components/dashboard/SummaryCard";
import {
  fetchDashboardCategory,
  fetchDashboardSummary,
  fetchDashboardTrends,
} from "../services/dashboard.service";
import type {
  DashboardCategoryItem,
  DashboardSummary,
  DashboardTrendItem,
} from "../types/api";
import { parseApiError } from "../utils/api-error";

export default function Insights() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [incomeCategoryData, setIncomeCategoryData] = useState<DashboardCategoryItem[]>([]);
  const [expenseCategoryData, setExpenseCategoryData] = useState<DashboardCategoryItem[]>([]);
  const [trendData, setTrendData] = useState<DashboardTrendItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      try {
        const [summaryResponse, incomeCategoryResponse, expenseCategoryResponse, trendsResponse] =
          await Promise.all([
            fetchDashboardSummary(),
            fetchDashboardCategory("INCOME"),
            fetchDashboardCategory("EXPENSE"),
            fetchDashboardTrends(),
          ]);

        if (!isMounted) {
          return;
        }

        setSummary(summaryResponse);
        setIncomeCategoryData(incomeCategoryResponse);
        setExpenseCategoryData(expenseCategoryResponse);
        setTrendData(trendsResponse);
        setError(null);
      } catch (requestError) {
        if (!isMounted) {
          return;
        }

        setError(parseApiError(requestError, "Failed to load insights"));
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
        <h2 className="page-section__title">Insights</h2>
        <p className="page-section__subtitle">
          Distribution and trend analytics for your financial records
        </p>
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
        <>
          <div className="summary-grid">
            <SummaryCard label="Total Income" value={`$${summary.totalIncome.toFixed(2)}`} tone="positive" />
            <SummaryCard label="Total Expense" value={`$${summary.totalExpense.toFixed(2)}`} tone="danger" />
            <SummaryCard label="Net Balance" value={`$${summary.netBalance.toFixed(2)}`} />
          </div>

          <div className="chart-grid">
            <section className="panel">
              <div className="panel__header">
                <div>
                  <h3 className="panel__title">Income Distribution</h3>
                  <p className="panel__subtitle">Income totals grouped by category</p>
                </div>
              </div>
              <CategoryPieChart data={incomeCategoryData} />
            </section>

            <section className="panel">
              <div className="panel__header">
                <div>
                  <h3 className="panel__title">Expense Distribution</h3>
                  <p className="panel__subtitle">Expense totals grouped by category</p>
                </div>
              </div>
              <CategoryPieChart data={expenseCategoryData} />
            </section>
          </div>

          <section className="panel">
            <div className="panel__header">
              <div>
                <h3 className="panel__title">Monthly Trends</h3>
                <p className="panel__subtitle">Income vs expense over time</p>
              </div>
            </div>
            <MonthlyTrendChart data={trendData} />
          </section>
        </>
      )}
    </section>
  );
}
