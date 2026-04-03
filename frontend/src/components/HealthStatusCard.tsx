import type { HealthCheckData } from "../types/api";

interface HealthStatusCardProps {
  apiBaseUrl: string;
  data: HealthCheckData | null;
  error: string | null;
  isLoading: boolean;
}

export const HealthStatusCard = ({
  apiBaseUrl,
  data,
  error,
  isLoading,
}: HealthStatusCardProps) => {
  return (
    <section className="status-card">
      <div className="status-header">
        <div>
          <p className="eyebrow">Backend connection</p>
          <h2>Health endpoint</h2>
        </div>
        <span className={`pill ${data ? "pill--success" : "pill--neutral"}`}>
          {data?.status ?? (isLoading ? "checking" : "unknown")}
        </span>
      </div>

      <dl className="status-grid">
        <div>
          <dt>Base URL</dt>
          <dd>{apiBaseUrl}</dd>
        </div>
        <div>
          <dt>Environment</dt>
          <dd>{data?.environment ?? "n/a"}</dd>
        </div>
        <div>
          <dt>Uptime</dt>
          <dd>{data ? `${data.uptime}s` : "n/a"}</dd>
        </div>
        <div>
          <dt>Timestamp</dt>
          <dd>{data?.timestamp ?? "n/a"}</dd>
        </div>
      </dl>

      {isLoading && <p className="status-message">Requesting `/health` from the backend.</p>}
      {error && <p className="status-message status-message--error">{error}</p>}
    </section>
  );
};
