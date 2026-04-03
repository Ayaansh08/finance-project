import type { ChangeEvent } from "react";
import type { RecordType } from "../../types/api";

interface RecordsFiltersProps {
  categories: string[];
  selectedCategory: string;
  selectedType: RecordType | "ALL";
  startDate: string;
  endDate: string;
  onCategoryChange: (value: string) => void;
  onTypeChange: (value: RecordType | "ALL") => void;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
  canAddRecord: boolean;
  onAddRecordClick: () => void;
}

export const RecordsFilters = ({
  categories,
  selectedCategory,
  selectedType,
  startDate,
  endDate,
  onCategoryChange,
  onTypeChange,
  onStartDateChange,
  onEndDateChange,
  canAddRecord,
  onAddRecordClick,
}: RecordsFiltersProps) => {
  const handleType = (event: ChangeEvent<HTMLSelectElement>) => {
    onTypeChange(event.target.value as RecordType | "ALL");
  };

  return (
    <section className="panel">
      <div className="panel__header">
        <div>
          <h2 className="panel__title">Records</h2>
          <p className="panel__subtitle">Filter and review transactions</p>
        </div>
        {canAddRecord && (
          <button type="button" className="button button--primary" onClick={onAddRecordClick}>
            Add Record
          </button>
        )}
      </div>

      <div className="filters-grid">
        <label className="field">
          <span className="field__label">Category</span>
          <select
            className="field__control"
            value={selectedCategory}
            onChange={(event) => onCategoryChange(event.target.value)}
          >
            <option value="ALL">All categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span className="field__label">Type</span>
          <select className="field__control" value={selectedType} onChange={handleType}>
            <option value="ALL">All types</option>
            <option value="INCOME">Income</option>
            <option value="EXPENSE">Expense</option>
          </select>
        </label>

        <label className="field">
          <span className="field__label">Start Date</span>
          <input
            type="date"
            className="field__control"
            value={startDate}
            onChange={(event) => onStartDateChange(event.target.value)}
          />
        </label>

        <label className="field">
          <span className="field__label">End Date</span>
          <input
            type="date"
            className="field__control"
            value={endDate}
            onChange={(event) => onEndDateChange(event.target.value)}
          />
        </label>
      </div>
    </section>
  );
};
