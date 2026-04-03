process.env.NODE_ENV = process.env.NODE_ENV ?? "test";
process.env.PORT = process.env.PORT ?? "4000";
process.env.JWT_SECRET = process.env.JWT_SECRET ?? "test-jwt-secret";
process.env.DATABASE_URL =
  process.env.DATABASE_URL ??
  "postgresql://postgres:postgres@localhost:5432/finance_project?schema=public";
process.env.FRONTEND_URL = process.env.FRONTEND_URL ?? "http://localhost:5173";
