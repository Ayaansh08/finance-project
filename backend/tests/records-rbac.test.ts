import jwt from "jsonwebtoken";
import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";

const recordsServiceMock = vi.hoisted(() => ({
  listRecordsForUser: vi.fn(),
  createRecordForUser: vi.fn(),
  getRecordForUser: vi.fn(),
  updateRecordForUser: vi.fn(),
  deleteRecordForUser: vi.fn(),
}));

vi.mock("../src/services/records.service", () => recordsServiceMock);

import { app } from "../src/app";

const signToken = (id: string, role: "VIEWER" | "ANALYST" | "ADMIN") =>
  jwt.sign({ id, role }, process.env.JWT_SECRET as string, { expiresIn: "1h" });

describe("Records API + RBAC", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates a record for admin", async () => {
    recordsServiceMock.createRecordForUser.mockResolvedValue({
      id: "rec-1",
      amount: "1200.50",
      type: "INCOME",
      category: "Salary",
      date: "2026-01-01T00:00:00.000Z",
      notes: "Monthly salary",
      userId: "admin-1",
      createdAt: "2026-01-01T00:00:00.000Z",
    });

    const response = await request(app)
      .post("/records")
      .set("Authorization", `Bearer ${signToken("admin-1", "ADMIN")}`)
      .send({
        amount: 1200.5,
        type: "INCOME",
        category: "Salary",
        date: "2026-01-01",
        notes: "Monthly salary",
      });

    expect(response.status).toBe(201);
    expect(response.body.id).toBe("rec-1");
    expect(recordsServiceMock.createRecordForUser).toHaveBeenCalled();
  });

  it("gets records for analyst", async () => {
    recordsServiceMock.listRecordsForUser.mockResolvedValue({
      data: [],
      pagination: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 1,
      },
    });

    const response = await request(app)
      .get("/records")
      .set("Authorization", `Bearer ${signToken("analyst-1", "ANALYST")}`);

    expect(response.status).toBe(200);
    expect(response.body.pagination.total).toBe(0);
    expect(recordsServiceMock.listRecordsForUser).toHaveBeenCalled();
  });

  it("rejects unauthorized access without token", async () => {
    const response = await request(app).get("/records");

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("No token");
  });

  it("blocks viewer from creating a record", async () => {
    const response = await request(app)
      .post("/records")
      .set("Authorization", `Bearer ${signToken("viewer-1", "VIEWER")}`)
      .send({
        amount: 300,
        type: "EXPENSE",
        category: "Food",
        date: "2026-01-02",
      });

    expect(response.status).toBe(403);
    expect(response.body.message).toBe("Forbidden");
    expect(recordsServiceMock.createRecordForUser).not.toHaveBeenCalled();
  });

  it("allows admin to delete a record", async () => {
    recordsServiceMock.deleteRecordForUser.mockResolvedValue({
      id: "rec-1",
    });

    const response = await request(app)
      .delete("/records/rec-1")
      .set("Authorization", `Bearer ${signToken("admin-1", "ADMIN")}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Record deleted");
    expect(recordsServiceMock.deleteRecordForUser).toHaveBeenCalled();
  });
});
