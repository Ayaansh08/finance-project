import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import type { DashboardCategoryItem } from "../../types/api";

interface CategoryPieChartProps {
  data: DashboardCategoryItem[];
}

const COLORS = ["#1d4ed8", "#16a34a", "#64748b", "#dc2626", "#334155", "#94a3b8"];
const formatCurrency = (value: unknown) => `$${Number(value ?? 0).toFixed(2)}`;

export const CategoryPieChart = ({ data }: CategoryPieChartProps) => {
  if (data.length === 0) {
    return <p className="status">No category data yet.</p>;
  }

  return (
    <div className="chart-container">
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie
            data={data}
            dataKey="total"
            nameKey="category"
            cx="50%"
            cy="50%"
            outerRadius={90}
            labelLine={false}
            label={{ fill: "#cbd5e1", fontSize: 12 }}
          >
            {data.map((entry, index) => (
              <Cell key={entry.category} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={formatCurrency} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
