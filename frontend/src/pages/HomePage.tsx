import { HealthStatusCard } from "../components/HealthStatusCard";
import { useAppConfig } from "../context/AppConfigContext";
import { useHealthCheck } from "../hooks/useHealthCheck";

export const HomePage = () => {
  const { apiBaseUrl, appName } = useAppConfig();
  const { data, error, isLoading } = useHealthCheck();

  return (
    <main className="page-shell">
      <section className="hero-panel">
        <p className="eyebrow">Stage 0</p>
        <h1>{appName}</h1>
        <p className="hero-copy">
          Full-stack monorepo foundation with a React frontend, Express backend, and
          Prisma ready for future domain models.
        </p>
      </section>

      <HealthStatusCard
        apiBaseUrl={apiBaseUrl}
        data={data}
        error={error}
        isLoading={isLoading}
      />
    </main>
  );
};
