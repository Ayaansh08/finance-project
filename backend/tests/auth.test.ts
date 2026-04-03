import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { AppError } from "../src/errors/app-error";

const authServiceMock = vi.hoisted(() => ({
  registerUser: vi.fn(),
  loginUser: vi.fn(),
}));

vi.mock("../src/services/auth.service", () => authServiceMock);

import { app } from "../src/app";

describe("Auth API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("registers a user", async () => {
    authServiceMock.registerUser.mockResolvedValue({
      id: "user-1",
      email: "newuser@test.com",
      role: "VIEWER",
      isActive: true,
      createdAt: new Date("2026-01-01T00:00:00.000Z"),
    });

    const response = await request(app).post("/auth/register").send({
      email: "newuser@test.com",
      password: "123456",
    });

    expect(response.status).toBe(201);
    expect(response.body.email).toBe("newuser@test.com");
    expect(authServiceMock.registerUser).toHaveBeenCalledWith("newuser@test.com", "123456");
  });

  it("logs in successfully", async () => {
    authServiceMock.loginUser.mockResolvedValue({
      token: "jwt-token",
      user: {
        id: "admin-1",
        email: "admin@test.com",
        role: "ADMIN",
        isActive: true,
        createdAt: new Date("2026-01-01T00:00:00.000Z"),
      },
    });

    const response = await request(app).post("/auth/login").send({
      email: "admin@test.com",
      password: "123456",
    });

    expect(response.status).toBe(200);
    expect(response.body.token).toBe("jwt-token");
    expect(response.body.user.role).toBe("ADMIN");
  });

  it("fails login with invalid credentials", async () => {
    authServiceMock.loginUser.mockRejectedValue(new AppError("Invalid credentials", 401));

    const response = await request(app).post("/auth/login").send({
      email: "admin@test.com",
      password: "wrong-password",
    });

    expect(response.status).toBe(401);
    expect(response.body).toMatchObject({
      success: false,
      error: "Invalid credentials",
    });
  });
});
