# Finance Project

Full-stack finance dashboard built as a monorepo with a TypeScript backend and frontend.  
The system supports authentication, role-based access control, financial record management, and analytics for dashboard insights.

## Project Overview

Finance Project is a role-aware dashboard where users can:

- authenticate using JWT
- access features based on role (VIEWER, ANALYST, ADMIN)
- manage and filter financial records
- view summary analytics (income, expense, net, trends, category distributions)

Key implemented capabilities:

- JWT authentication (`/auth/register`, `/auth/login`)
- RBAC at backend route level and frontend route/UI level
- Records CRUD with validation and pagination
- Dashboard analytics endpoints
- centralized error handling and auth rate limiting
- clean, responsive frontend UI

## Tech Stack

Backend:

- Node.js
- Express
- TypeScript
- Prisma ORM
- PostgreSQL
- Zod (validation)
- JSON Web Token
- Vitest + Supertest (API tests)

Frontend:

- React
- Vite
- TypeScript
- Axios
- React Router
- Recharts (charts)

## Project Structure

```text
finance-project/
  backend/
    prisma/
      schema.prisma
      seed.ts
    src/
      config/
      controllers/
      middleware/
      routes/
      services/
      validation/
      errors/
      types/
      app.ts
      server.ts
    tests/
      auth.test.ts
      records-rbac.test.ts
      setup-env.ts
    docs/
      api-docs.json
  frontend/
    src/
      components/
      context/
      pages/
      services/
      types/
      utils/
```

## Application Flow (How It Works)

### 1. Authentication Flow

1. User submits credentials from frontend `Login` page.
2. Backend validates payload with Zod.
3. Backend verifies user/password and account status.
4. Backend signs JWT (`id`, `role`) and returns token + user profile.
5. Frontend stores token and attaches it to all API calls via Axios interceptor.

### 2. Authorization Flow (RBAC)

1. Protected routes pass through `authenticate` middleware.
2. JWT is verified and decoded into `req.user`.
3. `allowRoles(...)` middleware checks if user role is allowed for the route.
4. Request is rejected with `401/403` when invalid.

### 3. Records Flow

1. Frontend sends filter/pagination query (`type`, `category`, `startDate`, `endDate`, `page`, `limit`).
2. Controller validates query/body with Zod schemas.
3. Service builds Prisma query (`where`, `skip`, `take`).
4. API returns records with pagination metadata.

### 4. Insights Flow

1. Frontend calls summary/category/trends endpoints.
2. Service computes:
   - total income/expense/net via Prisma `aggregate`
   - category totals via `groupBy`
   - monthly trends via SQL aggregation query
3. UI renders cards and charts.

### 5. Error Flow

1. Service/controller throws typed errors (`AppError`) or validation errors.
2. Global error middleware maps errors to HTTP status and consistent response shape.
3. Frontend shows user-friendly messages.

## Quick Evaluation Walkthrough (Suggested)

Use this sequence for internship review:

1. Run backend + frontend.
2. Login as `viewer@test.com` and verify:
   - dashboard/insights visible
   - no records write actions
3. Login as `analyst@test.com` and verify:
   - records listing works
   - create/update/delete not available
4. Login as `admin@test.com` and verify:
   - full records CRUD
   - user management routes and UI
5. Check API behavior with invalid payload/token and confirm proper status codes.
6. Run backend tests (`npm run test:backend`) and build (`npm run build`).

## Architecture Notes for Evaluation

- Layered backend design: `routes -> controllers -> services -> prisma`
- Controllers are thin (validation + orchestration), business logic is in services.
- Validation is centralized with Zod schemas.
- Access control is centralized in auth and role middlewares.
- Prisma schema uses enums, relations, and indexes suitable for dashboard queries.

## Setup Instructions

### 1. Install Dependencies (Root)

```bash
npm install
```

### 2. Environment Files

Copy examples:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

If `cp` is unavailable on Windows PowerShell:

```powershell
Copy-Item backend/.env.example backend/.env
Copy-Item frontend/.env.example frontend/.env
```

### 3. Database Setup (PostgreSQL)

Use local PostgreSQL or Docker Compose.

Docker option:

```bash
docker compose up -d
```

Expected `DATABASE_URL` format:

```env
DATABASE_URL="postgresql://<user>:<password>@localhost:5432/<db_name>?schema=public"
```

Default local example used in this project:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/finance_project?schema=public"
```

### 4. Backend Setup

```bash
cd backend
npm install
npx prisma migrate dev --name init_models
npx prisma generate
npm run seed
npm run dev
```

Backend runs on `http://localhost:4000`.

### 5. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`.

### 6. Run via Root Scripts

Open two terminals:

```bash
npm run dev:backend
npm run dev:frontend
```

## Seeded Accounts

- `admin@test.com` / `123456`
- `analyst@test.com` / `123456`
- `viewer@test.com` / `123456`

## API Documentation

Machine-readable endpoint list is available at:

- `backend/docs/api-docs.json`

### Auth

`POST /auth/register`

Request:

```json
{
  "email": "new.user@test.com",
  "password": "123456"
}
```

Response `201`:

```json
{
  "id": "clx123...",
  "email": "new.user@test.com",
  "role": "VIEWER",
  "isActive": true
}
```

`POST /auth/login`

Request:

```json
{
  "email": "admin@test.com",
  "password": "123456"
}
```

Response `200`:

```json
{
  "token": "<jwt-token>",
  "user": {
    "id": "clx123...",
    "email": "admin@test.com",
    "role": "ADMIN",
    "isActive": true
  }
}
```

### Records

- `POST /records` (ADMIN)
- `GET /records` (ANALYST, ADMIN)
- `GET /records/:id` (ANALYST, ADMIN)
- `PATCH /records/:id` (ADMIN)
- `DELETE /records/:id` (ADMIN)

Filters / pagination for `GET /records`:

- `type=INCOME|EXPENSE`
- `category=<string>`
- `startDate=YYYY-MM-DD`
- `endDate=YYYY-MM-DD`
- `page=<number>`
- `limit=<number>`

Example:

```http
GET /records?type=EXPENSE&startDate=2025-01-01&endDate=2025-12-31&page=1&limit=10
Authorization: Bearer <jwt-token>
```

Response `200`:

```json
{
  "data": [
    {
      "id": "rec_1",
      "amount": "250.00",
      "type": "EXPENSE",
      "category": "Groceries",
      "date": "2025-05-08T00:00:00.000Z",
      "notes": "Weekly groceries",
      "userId": "usr_1"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 42,
    "totalPages": 5
  }
}
```

### Dashboard

- `GET /dashboard/summary`
- `GET /dashboard/category` (optional `type=INCOME|EXPENSE`)
- `GET /dashboard/trends`

### Uptime / Health

- `GET /health` (detailed JSON health response)
- `GET /uptime` (lightweight `200 ok` text response for uptime monitors)

Response example (`GET /dashboard/summary`):

```json
{
  "totalIncome": 120000,
  "totalExpense": 84000,
  "netBalance": 36000
}
```

## Role Permissions

| Role    | Dashboard/Insights | Read Records | Create/Update/Delete Records | Manage Users |
|---------|--------------------|--------------|-------------------------------|--------------|
| VIEWER  | Yes                | No           | No                            | No           |
| ANALYST | Yes                | Yes (all records) | No                        | No           |
| ADMIN   | Yes                | Yes          | Yes                           | Yes          |

## Testing

Backend testing stack:

- Vitest
- Supertest

Run backend tests:

```bash
npm run test:backend
```

Included test coverage (API-level):

- Auth
  - register user
  - login success
  - login failure
- Records
  - create record
  - get records
  - unauthorized access
- RBAC
  - viewer cannot create record
  - admin can delete record

Test files:

- `backend/tests/auth.test.ts`
- `backend/tests/records-rbac.test.ts`

Frontend testing:

- No automated frontend tests yet.
- Manual validation checklist is recommended before submission:
  - login as all roles
  - verify role-based menu visibility
  - verify records permissions
  - verify insights charts load
  - verify empty/error states

## Error Handling

Error handling is centralized via global middleware.

Handled categories:

- validation errors (`400`)
- auth errors (`401`, `403`)
- not found (`404`)
- conflicts (`409`, Prisma unique constraint)
- fallback internal errors (`500`)

Sample error response:

```json
{
  "success": false,
  "error": "Validation failed",
  "details": {
    "fieldErrors": {
      "amount": ["Number must be greater than 0"]
    }
  }
}
```

## Assumptions

- Each record belongs to a single user.
- Analysts have read access to all records; admins have full access.
- Admin is trusted with full records and user management operations.
- Seed data is deterministic and intended for local/demo evaluation.
- PostgreSQL is available locally or through Docker.

## Improvements (Future Work)

- Redis caching for dashboard aggregations and frequently used queries
- advanced analytics (forecasting, anomaly detection, comparative periods)
- notifications/alerts (budget threshold breaches, unusual spending)
- soft-delete and audit trail for records
- deployment hardening (container orchestration, observability, autoscaling)
- CI pipeline with lint/test/build gates and coverage reports

## Delivery Readiness Notes

- Monorepo scripts are provided for quick startup and build.
- Environment templates are provided:
  - `.env.example`
  - `backend/.env.example`
  - `frontend/.env.example`
- Docker Compose is included for PostgreSQL local setup.

## Useful Commands

From repo root:

```bash
npm run dev:backend
npm run dev:frontend
npm run build
npm run test:backend
```
