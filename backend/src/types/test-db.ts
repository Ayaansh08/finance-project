export interface TestDbResult {
  total: number;
  rows: Array<{
    id: number;
    name: string;
    createdAt: string;
  }>;
}
