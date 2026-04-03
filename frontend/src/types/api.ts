export type Role = "VIEWER" | "ANALYST" | "ADMIN";
export type RecordType = "INCOME" | "EXPENSE";

export interface ApiResponse<T> {
  success: true;
  data: T;
}

export interface HealthCheckData {
  status: "ok";
  timestamp: string;
  uptime: number;
  environment: string;
}

export interface RecordItem {
  id: string;
  amount: string;
  type: RecordType;
  category: string;
  date: string;
  notes: string | null;
  userId: string;
  createdAt: string;
}

export interface CreateRecordPayload {
  amount: number;
  type: RecordType;
  category: string;
  date: string;
  notes?: string;
}

export interface UpdateRecordPayload {
  amount?: number;
  type?: RecordType;
  category?: string;
  date?: string;
  notes?: string | null;
}

export interface AppUser {
  id: string;
  email: string;
  role: Role;
  isActive?: boolean;
  createdAt?: string;
}

export interface LoginResponse {
  token: string;
  user: AppUser;
}

export interface UserWithRecords {
  id: string;
  email: string;
  password: string;
  role: Role;
  isActive: boolean;
  createdAt: string;
  records: RecordItem[];
}

export interface UserAdminItem {
  id: string;
  email: string;
  role: Role;
  isActive: boolean;
  createdAt: string;
}

export interface RecordsListResponse {
  data: RecordItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface DashboardSummary {
  totalIncome: number;
  totalExpense: number;
  netBalance: number;
}

export interface DashboardCategoryItem {
  category: string;
  total: number;
}

export interface DashboardTrendItem {
  month: string;
  income: number;
  expense: number;
}

export interface TestDbData {
  total: number;
  rows: Array<{
    id: string;
    name: string;
    createdAt: string;
  }>;
}
