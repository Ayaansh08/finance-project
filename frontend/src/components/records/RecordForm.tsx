import type { RecordType } from "../../types/api";

export interface RecordFormState {
  amount: string;
  type: RecordType;
  category: string;
  date: string;
  notes: string;
}

interface RecordFormProps {
  title: string;
  value: RecordFormState;
  submitLabel: string;
  onChange: (value: RecordFormState) => void;
  onSubmit: () => void;
  onCancel?: () => void;
}

export const RecordForm = ({
  title,
  value,
  submitLabel,
  onChange,
  onSubmit,
  onCancel,
}: RecordFormProps) => {
  return (
    <section className="panel">
      <h3 className="panel__title">{title}</h3>
      <div className="form-grid">
        <label className="field">
          <span className="field__label">Amount</span>
          <input
            className="field__control"
            type="number"
            min="0"
            step="0.01"
            value={value.amount}
            onChange={(event) => onChange({ ...value, amount: event.target.value })}
          />
        </label>
        <label className="field">
          <span className="field__label">Type</span>
          <select
            className="field__control"
            value={value.type}
            onChange={(event) => onChange({ ...value, type: event.target.value as RecordType })}
          >
            <option value="EXPENSE">EXPENSE</option>
            <option value="INCOME">INCOME</option>
          </select>
        </label>
        <label className="field">
          <span className="field__label">Category</span>
          <input
            className="field__control"
            value={value.category}
            onChange={(event) => onChange({ ...value, category: event.target.value })}
          />
        </label>
        <label className="field">
          <span className="field__label">Date</span>
          <input
            className="field__control"
            type="date"
            value={value.date}
            onChange={(event) => onChange({ ...value, date: event.target.value })}
          />
        </label>
        <label className="field">
          <span className="field__label">Notes</span>
          <input
            className="field__control"
            value={value.notes}
            onChange={(event) => onChange({ ...value, notes: event.target.value })}
          />
        </label>
        <div className="field field--actions">
          <button type="button" className="button button--primary" onClick={onSubmit}>
            {submitLabel}
          </button>
          {onCancel && (
            <button type="button" className="button button--ghost" onClick={onCancel}>
              Cancel
            </button>
          )}
        </div>
      </div>
    </section>
  );
};
