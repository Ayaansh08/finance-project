import { useEffect, useState } from "react";

import { fetchUsers, patchUserRole, patchUserStatus } from "../services/users.service";
import type { Role, UserAdminItem } from "../types/api";
import { parseApiError } from "../utils/api-error";

const roles: Role[] = ["VIEWER", "ANALYST", "ADMIN"];

export default function Users() {
  const [users, setUsers] = useState<UserAdminItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadUsers = async () => {
    try {
      const result = await fetchUsers();
      setUsers(result);
      setError(null);
    } catch (requestError) {
      setError(parseApiError(requestError, "Failed to load users"));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadUsers();
  }, []);

  const handleRoleChange = async (userId: string, role: Role) => {
    try {
      await patchUserRole(userId, role);
      await loadUsers();
    } catch (requestError) {
      setError(parseApiError(requestError, "Failed to update role"));
    }
  };

  const handleStatusToggle = async (userId: string, isActive: boolean) => {
    try {
      await patchUserStatus(userId, !isActive);
      await loadUsers();
    } catch (requestError) {
      setError(parseApiError(requestError, "Failed to update status"));
    }
  };

  return (
    <section className="page-section">
      <div className="page-section__header">
        <h2 className="page-section__title">Users</h2>
        <p className="page-section__subtitle">Admin-only user role and status management</p>
      </div>

      {isLoading && <p>Loading users...</p>}
      {error && <p className="status status--error">{error}</p>}

      {!isLoading && !error && (
        <section className="panel">
          <div className="table-wrap">
            <table className="records-table">
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.email}</td>
                    <td>
                      <select
                        className="field__control"
                        value={user.role}
                        onChange={(event) => handleRoleChange(user.id, event.target.value as Role)}
                      >
                        {roles.map((role) => (
                          <option key={role} value={role}>
                            {role}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>{user.isActive ? "Active" : "Inactive"}</td>
                    <td>
                      <button
                        type="button"
                        className="button button--ghost"
                        onClick={() => handleStatusToggle(user.id, user.isActive)}
                      >
                        {user.isActive ? "Deactivate" : "Activate"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </section>
  );
}
