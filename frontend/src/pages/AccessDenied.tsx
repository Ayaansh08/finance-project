import { Link } from "react-router-dom";

export default function AccessDenied() {
  return (
    <section className="panel">
      <h2 className="panel__title">Access Denied</h2>
      <p className="panel__subtitle">You do not have permission to access this page.</p>
      <div className="page-actions">
        <Link className="button button--primary" to="/">
          Go to Dashboard
        </Link>
      </div>
    </section>
  );
}
