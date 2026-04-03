import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { AppShell } from "./components/layout/AppShell";
import AccessDenied from "./pages/AccessDenied";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Insights from "./pages/Insights";
import Records from "./pages/Records";
import Users from "./pages/Users";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AppShell />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route
            path="insights"
            element={
              <ProtectedRoute allowedRoles={["VIEWER", "ANALYST", "ADMIN"]}>
                <Insights />
              </ProtectedRoute>
            }
          />
          <Route
            path="records"
            element={
              <ProtectedRoute allowedRoles={["ANALYST", "ADMIN"]}>
                <Records />
              </ProtectedRoute>
            }
          />
          <Route
            path="users"
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <Users />
              </ProtectedRoute>
            }
          />
          <Route path="access-denied" element={<AccessDenied />} />
        </Route>
        <Route path="/access-denied" element={<AccessDenied />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
