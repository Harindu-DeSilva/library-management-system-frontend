import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useStore } from "./context/useStore";

import LoginPage from "./pages/LoginPage";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import SuperAdmin from "./pages/SuperAdmin";
import AdminDashboard from "./pages/AdminDashboard";

function Private({ children, role }) {

  const { user } = useStore();

  if (!user) return <Navigate to="/" />;

  if (role && user.role !== role) return <Navigate to="/dashboard" />;

  return children;
}

export default function App() {
  return (
    <BrowserRouter>

      <Routes>

        <Route path="/" element={<LoginPage />} />

        <Route path="/reset-password" element={
          <Private>
            <ResetPassword />
          </Private>
        }/>

        <Route path="/dashboard" element={
          <Private>
            <Dashboard />
          </Private>
        }/>

        <Route path="/admin" element={
          <Private role="admin">
            <AdminDashboard />
          </Private>
        }/>

        <Route path="/super-admin" element={
          <Private role="superAdmin">
            <SuperAdmin />
          </Private>
        }/>

      </Routes>

    </BrowserRouter>
  );
}
