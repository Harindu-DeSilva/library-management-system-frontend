import { useState, useEffect, useCallback } from "react";
import { getUsersApi, createUserApi, deleteUserApi, updateUserApi, getUserByIdApi } from "../api/usersApi";
import { meApi, updatePasswordApi } from "../api/authApi";

export default function useUsers() {

  const [users, setUsers] = useState([]);

  // ---- Pagination ----
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);

  // ---- Search ----
  const [searchText, setSearchText] = useState("");

  // ---- Stats ----
  const [superAdminCount, setSuperAdminCount] = useState(0);
  const [adminCount, setAdminCount] = useState(0);
  const [userCount, setUserCount] = useState(0);

  // ---- UI States ----
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // ---- Create Form ----
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
    library_id: ""
  });

   const [PasswordFormData, setPasswordFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  // FETCH USERS
  const fetchUsers = useCallback(async (pageNum = 1, search = "") => {
    try {
      setLoading(true);

      const res = await getUsersApi(pageNum, pageSize, search);

      setUsers(res.data.users);
      setTotalPages(res.data.pagination.totalPages);
      setTotalUsers(res.data.pagination.totalUsers);
      setPageSize(res.data.pagination.pageSize);

      setSuperAdminCount(res.data.stats.superAdmins);
      setAdminCount(res.data.stats.admins);
      setUserCount(res.data.stats.users);

    } catch (err) {
      console.error(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  }, [pageSize]);


  // CREATE USER
  const createUser = async () => {
    try {
      setActionLoading(true);

      const res = await createUserApi(formData);
      await fetchUsers(page, searchText);

      return { success: true };

    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || err.message
      };
    } finally {
      setActionLoading(false);
    }
  };


   // UPDATE USER
  const updateUser = async (id) => {
    try {
      setActionLoading(true);

      await updateUserApi(id,formData);

      await getUserByIdApi(id);

      return { success: true };

    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || err.message
      };
    } finally {
      setActionLoading(false);
    }
  };



   // UPDATE USER PASSWORD
  const updateUserPassword = async () => {
    try {
      setActionLoading(true);

      await updatePasswordApi(PasswordFormData);

      await meApi();

      return { success: true };

    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || err.message
      };
    } finally {
      setActionLoading(false);
    }
  };



  // DELETE USER
  const deleteUser = async (id) => {
    try {
      setActionLoading(true);

      await deleteUserApi(id);
      await fetchUsers(page, searchText);

      return { success: true };

    } catch (err) {
      console.error(err.response?.data || err.message);

      return { 
      success: false,
      message: err.response?.data?.message || err.message 
    };

    } finally {
      setActionLoading(false);
    }
  };


  // INIT FETCH
  useEffect(() => {
    fetchUsers(page, searchText);
  }, [page, searchText, fetchUsers]);

  return {
    users,

    page,
    setPage,

    totalPages,
    totalUsers,
    pageSize,

    searchText,
    setSearchText,

    superAdminCount,
    adminCount,
    userCount,

    loading,
    actionLoading,

    PasswordFormData, 
    setPasswordFormData,

    formData,
    setFormData,

    updateUserPassword,
    fetchUsers,
    updateUser,
    createUser,
    deleteUser
  };
}
