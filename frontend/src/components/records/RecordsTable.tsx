import type { RecordType } from "../../types/api";

interface RecordsTableRow {
  id: string;
  date: string;
  category: string;
  type: RecordType;
  amount: number;
}

interface RecordsTableProps {
  rows: RecordsTableRow[];
  canEditDelete?: boolean;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export const RecordsTable = ({ rows, canEditDelete = false, onEdit, onDelete }: RecordsTableProps) => {
  return (
    <section className="panel">
      <div className="table-wrap">
        <table className="records-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Category</th>
              <th>Type</th>
              <th className="is-numeric">Amount</th>
              {canEditDelete && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td>{new Date(row.date).toLocaleDateString()}</td>
                <td>{row.category}</td>
                <td>
                  <span
                    className={row.type === "INCOME" ? "pill pill--income" : "pill pill--expense"}
                  >
                    {row.type}
                  </span>
                </td>
                <td className="is-numeric">{row.amount.toFixed(2)}</td>
                {canEditDelete && (
                  <td className="row-actions">
                    <button
                      type="button"
                      className="button button--ghost"
                      onClick={() => onEdit?.(row.id)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="button button--ghost button--danger"
                      onClick={() => onDelete?.(row.id)}
                    >
                      Delete
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};
