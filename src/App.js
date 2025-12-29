import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useStore } from "./context/useStore";
import { useEffect } from "react";

import LoginPage from "./pages/LoginPage";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import SuperAdmin from "./pages/SuperAdmin";
import AdminDashboard from "./pages/AdminDashboard";

function Private({ children, role }) {
  const { user, loading } = useStore();

  if (loading) return <div>Loading...</div>;

  if (!user) return <Navigate to="/" />;

  // First login → must reset
  if (user.oneTime && window.location.pathname !== "/reset-password") {
    return <Navigate to="/reset-password" />;
  }

  // Block reset page for normal users
  if (!user.oneTime && window.location.pathname === "/reset-password") {
    if (user.role === "superAdmin") return <Navigate to="/super-admin" />;
    if (user.role === "admin") return <Navigate to="/admin" />;
    return <Navigate to="/dashboard" />;
  }

  // Role-restricted routes
  if (role && user.role !== role) return <Navigate to="/dashboard" />;

  return children;
}


export default function App() {

  const { fetchUser } = useStore();

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />

        <Route
          path="/reset-password"
          element={
            <Private>
              <ResetPassword />
            </Private>
          }
        />

        <Route
          path="/dashboard"
          element={
            <Private>
              <Dashboard />
            </Private>
          }
        />

        <Route
          path="/admin"
          element={
            <Private role="admin">
              <AdminDashboard />
            </Private>
          }
        />

        <Route
          path="/super-admin"
          element={
            <Private role="superAdmin">
              <SuperAdmin />
            </Private>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
