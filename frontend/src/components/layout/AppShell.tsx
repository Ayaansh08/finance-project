import { NavLink, Outlet, useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import type { Role } from "../../types/api";

interface NavItem {
  to: string;
  label: string;
  end: boolean;
  roles: Role[];
}

const navItems: NavItem[] = [
  { to: "/", label: "Dashboard", end: true, roles: ["VIEWER", "ANALYST", "ADMIN"] },
  { to: "/insights", label: "Insights", end: false, roles: ["VIEWER", "ANALYST", "ADMIN"] },
  { to: "/records", label: "Records", end: false, roles: ["ANALYST", "ADMIN"] },
  { to: "/users", label: "Users", end: false, roles: ["ADMIN"] },
];

export const AppShell = () => {
  const navigate = useNavigate();
  const { user, clearSession } = useAuth();

  const handleLogout = () => {
    clearSession();
    navigate("/login");
  };

  const allowedNavItems = navItems.filter((item) => (user ? item.roles.includes(user.role) : false));

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar__brand">Finance Project</div>
        <nav className="sidebar__nav">
          {allowedNavItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                isActive ? "sidebar__link sidebar__link--active" : "sidebar__link"
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <button type="button" className="button button--ghost sidebar__logout" onClick={handleLogout}>
          Logout
        </button>
      </aside>

      <div className="app-shell__content">
        <header className="topbar">
          <h1 className="topbar__title">Finance Project</h1>
          <div className="topbar__user">
            <span>{user?.email ?? "Unknown user"}</span>
            <span className="topbar__role">{user?.role ?? "VIEWER"}</span>
          </div>
        </header>

        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
