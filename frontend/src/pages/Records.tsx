import { useEffect, useMemo, useState } from "react";

import { SummaryCard } from "../components/dashboard/SummaryCard";
import { RecordsFilters } from "../components/records/RecordsFilters";
import { RecordForm, type RecordFormState } from "../components/records/RecordForm";
import { RecordsTable } from "../components/records/RecordsTable";
import { useAuth } from "../context/AuthContext";
import {
  createRecord,
  deleteRecord,
  fetchRecords,
  updateRecord,
} from "../services/records.service";
import type { RecordItem, RecordType } from "../types/api";
import { parseApiError } from "../utils/api-error";

const emptyForm: RecordFormState = {
  amount: "",
  type: "EXPENSE",
  category: "",
  date: "",
  notes: "",
};

export default function Records() {
  const [records, setRecords] = useState<RecordItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [category, setCategory] = useState("ALL");
  const [type, setType] = useState<RecordType | "ALL">("ALL");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [createForm, setCreateForm] = useState<RecordFormState>(emptyForm);
  const [editForm, setEditForm] = useState<RecordFormState>(emptyForm);
  const [editingRecordId, setEditingRecordId] = useState<string | null>(null);
  const { user } = useAuth();

  const canAddRecord = user?.role === "ADMIN";
  const canEditDelete = user?.role === "ADMIN";

  const validateForm = (form: RecordFormState): string | null => {
    if (!form.amount || Number(form.amount) <= 0) {
      return "Amount must be greater than 0";
    }

    if (!form.category.trim()) {
      return "Category is required";
    }

    if (!form.date) {
      return "Date is required";
    }

    return null;
  };

  const loadRecords = async () => {
    try {
      const result = await fetchRecords({
        type,
        category,
        startDate,
        endDate,
        page,
        limit,
      });

      setRecords(result.data);
      setTotalPages(result.pagination.totalPages);
      setError(null);
    } catch (requestError) {
      setError(parseApiError(requestError, "Failed to load records"));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadRecords();
  }, [type, category, startDate, endDate, page, limit]);

  const categoryOptions = useMemo(
    () => Array.from(new Set(records.map((row) => row.category))).sort(),
    [records],
  );

  const visibleIncome = useMemo(
    () =>
      records
        .filter((record) => record.type === "INCOME")
        .reduce((sum, record) => sum + Number(record.amount), 0),
    [records],
  );

  const visibleExpense = useMemo(
    () =>
      records
        .filter((record) => record.type === "EXPENSE")
        .reduce((sum, record) => sum + Number(record.amount), 0),
    [records],
  );

  const visibleBalance = visibleIncome - visibleExpense;

  const handleCreate = async () => {
    const validationError = validateForm(createForm);
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      await createRecord({
        amount: Number(createForm.amount),
        type: createForm.type,
        category: createForm.category.trim(),
        date: createForm.date,
        notes: createForm.notes.trim() || undefined,
      });
      setCreateForm(emptyForm);
      setShowCreateForm(false);
      setPage(1);
      await loadRecords();
    } catch (requestError) {
      setError(parseApiError(requestError, "Failed to create record"));
    }
  };

  const handleEditStart = (recordId: string) => {
    const record = records.find((item) => item.id === recordId);
    if (!record) {
      return;
    }

    setEditingRecordId(recordId);
    setEditForm({
      amount: String(Number(record.amount)),
      type: record.type,
      category: record.category,
      date: record.date.slice(0, 10),
      notes: record.notes ?? "",
    });
  };

  const handleEditCancel = () => {
    setEditingRecordId(null);
    setEditForm(emptyForm);
  };

  const handleEditSubmit = async () => {
    if (!editingRecordId) {
      return;
    }

    const validationError = validateForm(editForm);
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      await updateRecord(editingRecordId, {
        amount: Number(editForm.amount),
        type: editForm.type,
        category: editForm.category.trim(),
        date: editForm.date,
        notes: editForm.notes.trim() || null,
      });
      handleEditCancel();
      await loadRecords();
    } catch (requestError) {
      setError(parseApiError(requestError, "Failed to update record"));
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this record?")) {
      return;
    }

    try {
      await deleteRecord(id);
      await loadRecords();
    } catch (requestError) {
      setError(parseApiError(requestError, "Failed to delete record"));
    }
  };

  return (
    <section className="page-section">
      <RecordsFilters
        categories={categoryOptions}
        selectedCategory={category}
        selectedType={type}
        startDate={startDate}
        endDate={endDate}
        onCategoryChange={(value) => {
          setCategory(value);
          setPage(1);
        }}
        onTypeChange={(value) => {
          setType(value);
          setPage(1);
        }}
        onStartDateChange={(value) => {
          setStartDate(value);
          setPage(1);
        }}
        onEndDateChange={(value) => {
          setEndDate(value);
          setPage(1);
        }}
        canAddRecord={canAddRecord}
        onAddRecordClick={() => setShowCreateForm((state) => !state)}
      />

      {!isLoading && !error && records.length > 0 && (
        <div className="summary-grid">
          <SummaryCard label="Visible Income" value={`$${visibleIncome.toFixed(2)}`} tone="positive" />
          <SummaryCard label="Visible Expense" value={`$${visibleExpense.toFixed(2)}`} tone="danger" />
          <SummaryCard label="Visible Balance" value={`$${visibleBalance.toFixed(2)}`} />
        </div>
      )}

      {canAddRecord && showCreateForm && (
        <RecordForm
          title="Add Record"
          value={createForm}
          submitLabel="Save Record"
          onChange={setCreateForm}
          onSubmit={handleCreate}
        />
      )}

      {canEditDelete && editingRecordId && (
        <RecordForm
          title="Edit Record"
          value={editForm}
          submitLabel="Update Record"
          onChange={setEditForm}
          onSubmit={handleEditSubmit}
          onCancel={handleEditCancel}
        />
      )}

      {isLoading && <p>Loading records...</p>}
      {error && <p className="status status--error">{error}</p>}

      {!isLoading && !error && records.length === 0 && (
        <section className="panel">
          <p className="status">No records found for the selected filters.</p>
        </section>
      )}

      {!isLoading && !error && records.length > 0 && (
        <>
          <RecordsTable
            rows={records.map((row) => ({ ...row, amount: Number(row.amount) }))}
            canEditDelete={canEditDelete}
            onEdit={handleEditStart}
            onDelete={handleDelete}
          />
          <section className="panel panel--inline">
            <div className="pagination">
              <button
                type="button"
                className="button button--ghost"
                onClick={() => setPage((current) => Math.max(1, current - 1))}
                disabled={page === 1}
              >
                Previous
              </button>
              <span className="status">
                Page {page} of {totalPages}
              </span>
              <button
                type="button"
                className="button button--ghost"
                onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                disabled={page >= totalPages}
              >
                Next
              </button>
            </div>
          </section>
        </>
      )}
    </section>
  );
}
