import { type FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";
import type { LoginResponse } from "../types/api";
import { parseApiError } from "../utils/api-error";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { setSession } = useAuth();
  const navigate = useNavigate();

  const performLogin = async (nextEmail: string, nextPassword: string) => {
    setError(null);
    setIsLoading(true);

    try {
      const response = await api.post<LoginResponse>("/auth/login", {
        email: nextEmail,
        password: nextPassword,
      });
      setSession(response.data.token, response.data.user);
      navigate("/");
    } catch (requestError) {
      setError(parseApiError(requestError, "Login failed"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (event: FormEvent) => {
    event.preventDefault();
    await performLogin(email, password);
  };

  const handleQuickLogin = async (nextEmail: string) => {
    setEmail(nextEmail);
    setPassword("123456");
    await performLogin(nextEmail, "123456");
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleLogin}>
        <div>
          <h2 className="auth-card__title">Sign in to Finance Project</h2>
          <p className="auth-card__subtitle">Use your account to access the dashboard.</p>
        </div>

        <label className="field">
          <span className="field__label">Email</span>
          <input
            className="field__control"
            type="email"
            placeholder="admin@test.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </label>

        <label className="field">
          <span className="field__label">Password</span>
          <input
            className="field__control"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </label>

        <div className="quick-login">
          <p className="quick-login__label">Quick mock login</p>
          <div className="quick-login__actions">
            <button
              type="button"
              className="button button--secondary"
              onClick={() => void handleQuickLogin("admin@test.com")}
              disabled={isLoading}
            >
              Admin
            </button>
            <button
              type="button"
              className="button button--secondary"
              onClick={() => void handleQuickLogin("analyst@test.com")}
              disabled={isLoading}
            >
              Analyst
            </button>
            <button
              type="button"
              className="button button--secondary"
              onClick={() => void handleQuickLogin("viewer@test.com")}
              disabled={isLoading}
            >
              Viewer
            </button>
          </div>
        </div>

        <button type="submit" className="button button--primary auth-card__button" disabled={isLoading}>
          {isLoading ? "Signing in..." : "Sign in"}
        </button>

        {error && <p className="status status--error">{error}</p>}

        <p className="auth-card__hint">Test user: admin@test.com / 123456</p>
      </form>
    </div>
  );
}
