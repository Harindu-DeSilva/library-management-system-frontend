import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useStore } from "./context/useStore";
import { useEffect } from "react";

import LoginPage from "./pages/LoginPage";
import ResetPassword from "./pages/ResetPassword";
import ErrorPage from "./pages/ErrorPage";
import Layout from './components/Layout';

import SuperAdminHome from "./pages/superAdmin/SuperAdminHome";
import ManageLibraries from "./pages/superAdmin/ManageLibraries";
import Books from "./pages/superAdmin/Books";
import Categories from "./pages/superAdmin/Categories";
import ManageUsers from "./pages/superAdmin/ManageUsers";
import Profile from "./pages/superAdmin/Profile";

import AdminHome from "./pages/admin/AdminHome";

import UserHome from "./pages/user/UserHome";



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

   // Role-based protection (skip for 404 page)
  if (role && user.role !== role && window.location.pathname !== "/404-error") {
    return <Navigate to="/404-error" />;
  }

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
          path="/super-admin"
          element={
            <Private role="superAdmin">
              <Layout>
                <SuperAdminHome />
              </Layout>
            </Private>
          }
        />

        {/* super admin routes  */}
        <Route
          path="/super-admin/books"
          element={
            <Private role="superAdmin">
              <Layout>
                <Books />
              </Layout>
            </Private>
          }
        />

        <Route
          path="/super-admin/categories"
          element={
            <Private role="superAdmin">
              <Layout>
                <Categories />
              </Layout>
            </Private>
          }
        />

        <Route
          path="/super-admin/libraries"
          element={
            <Private role="superAdmin">
              <Layout>
                <ManageLibraries />
              </Layout>
            </Private>
          }
        />

        <Route
          path="/super-admin/users"
          element={
            <Private role="superAdmin">
              <Layout>
                <ManageUsers />
              </Layout>
            </Private>
          }
        />

        <Route
          path="/super-admin/profile"
          element={
            <Private role="superAdmin">
              <Layout>
                <Profile />
              </Layout>
            </Private>
          }
        />


        {/* admin routes  */}
        <Route
          path="/admin"
          element={
            <Private role="admin">
              <Layout>
                <AdminHome />
              </Layout>
            </Private>
          }
        />

         <Route
          path="/admin/books"
          element={
            <Private role="admin">
              <Layout>
                <Books />
              </Layout>
            </Private>
          }
        />

        <Route
          path="/admin/categories"
          element={
            <Private role="admin">
              <Layout>
                <Categories />
              </Layout>
            </Private>
          }
        />


         <Route
          path="/admin/profile"
          element={
            <Private role="admin">
              <Layout>
                <Profile />
              </Layout>
            </Private>
          }
        />

         <Route
          path="/admin/users"
          element={
            <Private role="admin">
              <Layout>
                <ManageUsers />
              </Layout>
            </Private>
          }
        />

        {/* user routes  */}
        <Route
          path="/dashboard"
          element={
            <Private role="user">
              <Layout>
                <UserHome />
              </Layout>
            </Private>
          }
        />


        {/* error  */}
        <Route
          path="*"
          element={
            <Private>
                <ErrorPage />
            </Private>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}
