import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { DashboardTrendItem } from "../../types/api";

interface MonthlyTrendChartProps {
  data: DashboardTrendItem[];
}

const formatCurrency = (value: unknown) => `$${Number(value ?? 0).toFixed(2)}`;

export const MonthlyTrendChart = ({ data }: MonthlyTrendChartProps) => {
  if (data.length === 0) {
    return <p className="status">No monthly trend data yet.</p>;
  }

  return (
    <div className="chart-container">
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="month" tick={{ fill: "#cbd5e1", fontSize: 12 }} axisLine={{ stroke: "#334155" }} tickLine={{ stroke: "#334155" }} />
          <YAxis tick={{ fill: "#cbd5e1", fontSize: 12 }} axisLine={{ stroke: "#334155" }} tickLine={{ stroke: "#334155" }} />
          <Tooltip formatter={formatCurrency} />
          <Legend wrapperStyle={{ color: "#cbd5e1" }} />
          <Line
            type="monotone"
            dataKey="income"
            stroke="#16a34a"
            strokeWidth={2}
            dot={false}
            name="Income"
          />
          <Line
            type="monotone"
            dataKey="expense"
            stroke="#dc2626"
            strokeWidth={2}
            dot={false}
            name="Expense"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
