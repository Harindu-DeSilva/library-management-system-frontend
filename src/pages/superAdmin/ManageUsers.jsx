import React, { useState, useEffect, useCallback } from "react";
import { debounce } from "lodash";
import { format } from "date-fns";
import { getUsersApi, createUserApi, deleteUserApi } from "../../api/usersApi";
import { getLibrariesApi } from "../../api/libraryApi";
import { 
  Users, 
  UserPlus, 
  Trash2, 
  Mail, 
  Shield, 
  Library as LibraryIcon, 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  X,
  Clock, 
  Key,
  CheckCircle2,
  AlertCircle,
  Loader2
} from "lucide-react";

// ---------- ENHANCED MODAL COMPONENT ----------
function Modal({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={onClose} />
      <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md relative z-10 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="h-1.5 w-full bg-gradient-to-r from-indigo-600 to-emerald-500" />
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900">{title}</h2>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600">
              <X className="w-5 h-5" />
            </button>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}

// ---------- MAIN COMPONENT ----------
export default function ManageUsers() {
  const [users, setUsers] = useState([]);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [superAdminCount, setsuperAdminCount] = useState();
  const [adminCount, setAdminCount] = useState();
  const [userCount, setUserCount] = useState();
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(false);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState(null);

  const [libraries, setLibraries] = useState([]);
  const [libLoading, setLibLoading] = useState(false);
  const [libError, setLibError] = useState(null);


  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "admin",
    password: "",
    library_id: "",
  });

  // -------- FETCH USERS --------
  const fetchUsers = useCallback(
    async (pageNum = 1, searchText = "") => {
      setLoading(true);
      try {
        const res = await getUsersApi(pageNum, pageSize, searchText);

        setUsers(res.data.users);
        setTotalPages(res.data.pagination.totalPages);
        setTotalUsers(res.data.pagination.totalUsers);
        setPageSize(res.data.pagination.pageSize);
        setAdminCount(res.data.stats.admins);
        setsuperAdminCount(res.data.stats.superAdmins);
        setUserCount(res.data.stats.users);
      } catch (err) {
        console.error(err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    },
    [pageSize]
  );

  useEffect(() => {
    fetchUsers(page, search);
  }, [page, fetchUsers, search]);

  const debouncedFetch = useCallback(
  debounce((value) => {
    fetchUsers(1, value); // always reset to page 1 when searching
    setPage(1);
  }, 500), // 500ms delay
  [fetchUsers]
);

// handle search input change
const handleSearchChange = (e) => {
  setSearch(e.target.value);
  debouncedFetch(e.target.value);
};



  // -------- FETCH LIBRARIES --------
  useEffect(() => {
    const fetchLibraries = async () => {
      setLibLoading(true);
      try {
        const res = await getLibrariesApi();
        setLibraries(res.data.libraries || []);
      } catch (err) {
        setLibError("Failed to load libraries");
      } finally {
        setLibLoading(false);
      }
    };

    fetchLibraries();
  }, []);

  const getLibraryName = (id) => {
    const lib = libraries.find(l => l.id === id);
    return lib ? lib.name : "N/A";
  };


  // -------- CREATE USER --------
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createUserApi({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        library_id: formData.library_id,
        role: formData.role,
      });

      setShowCreateModal(false);

      setFormData({
        name: "",
        email: "",
        role: "admin",
        password: "",
        library_id: "",
      });

      fetchUsers(page);
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert(err.response?.data?.message || "Failed to create user");
    }
  };

  // -------- DELETE USER --------
  const handleDelete = async (id) => {
    try {
      await deleteUserApi(id);
      fetchUsers(page);
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert(err.response?.data?.message || "Failed to delete user");
    }
  };
  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8 font-sans">
      
      {/* Header & Stats Section */}
      <div className="max-w-7xl mx-auto space-y-8">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Staff Management</h1>
            <p className="text-slate-500 mt-1 font-medium">Manage library administrators and access levels.</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-100 transition-all active:scale-[0.98]"
          >
            <UserPlus className="w-5 h-5" />
            <span>Add New Staff</span>
          </button>
        </div>

        {/* Quick Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
             { 
              label: 'Active Super Admins', 
              value: superAdminCount,
              icon: <Shield className="text-fuchsia-600" />, 
              bg: 'bg-fuchsia-50' 
          },
          { 
            label: 'Active Admins', 
            value: adminCount,
            icon: <Shield className="text-emerald-600" />, 
            bg: 'bg-emerald-50' 
          },
          { 
            label: 'Active Users', 
            value: userCount,
            icon: <Shield className="text-blue-600" />, 
            bg: 'bg-blue-50' 
          },
          ].map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-5">
              <div className={`${stat.bg} w-14 h-14 rounded-2xl flex items-center justify-center`}>
                {React.cloneElement(stat.icon, { className: `w-7 h-7 ${stat.icon.props.className}` })}
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
                <p className="text-2xl font-black text-slate-900">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>


        {/* Data Table Section */}
        <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={handleSearchChange}
                placeholder="Search by name or email..."
                className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 outline-none transition-all"
              />


            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-slate-400 text-xs font-bold uppercase tracking-widest border-b border-slate-50">
                  <th className="px-8 py-5">Staff Identity</th>
                  <th className="px-6 py-5">Access Level</th>
                  <th className="px-6 py-5">Assigned Library</th>
                  <th className="px-6 py-5">Created Time</th>
                  <th className="px-8 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  Array(3).fill(0).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan={4} className="px-8 py-6"><div className="h-10 bg-slate-100 rounded-xl w-full" /></td>
                    </tr>
                  ))
                ) : (
                  users.map((user) => (
                    <tr key={user.id} className="group hover:bg-slate-50/50 transition-colors">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-full  flex items-center justify-center font-bold 
                            ${
                              user.role === "superAdmin"
                                ? "bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200"
                                : user.role === "admin"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : "bg-blue-50 text-blue-700 border-slate-200"
                              }
                            `}>
                            {user.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">{user.name}</p>
                            <p className="text-xs text-slate-400 font-medium">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span
                          className={`
                            inline-flex items-center gap-1.5 px-3 py-1 rounded-full 
                            text-[10px] font-bold uppercase tracking-wider
                            border
                            ${
                              user.role === "superAdmin"
                                ? "bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200"
                                : user.role === "admin"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : "bg-blue-50 text-blue-700 border-slate-200"
                            }
                          `}
                        >
                          <Shield className="w-3 h-3" />
                          {user.role}
                        </span>

                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2 text-slate-600 font-medium text-sm">
                          <LibraryIcon className="w-4 h-4 text-slate-300" />
                          {getLibraryName(user.library_id)}
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2 text-slate-600 font-medium text-sm">
                          <Clock className="w-4 h-4 text-slate-300" />
                          {format(new Date(user.createdAt), "dd MMM yyyy, HH:mm")}
                        </div>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <button
                          onClick={() => setDeleteUserId(user.id)}
                          className="p-2 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Styled Pagination */}
          <div className="px-8 py-6 border-t border-slate-50 flex items-center justify-between bg-slate-50/30">
            <p className="text-sm text-slate-500 font-medium">
              Showing <span className="text-slate-900 font-bold">{(page-1)*pageSize + 1}-{Math.min(page*pageSize, totalUsers)}</span> of <span className="text-slate-900 font-bold">{totalUsers}</span> users
            </p>
            <div className="flex gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="p-2 border border-slate-200 rounded-lg hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="flex items-center px-4 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-700">
                {page} / {totalPages}
              </div>
              <button
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
                className="p-2 border border-slate-200 rounded-lg hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ---------- CREATE MODAL ---------- */}
      {showCreateModal && (
        <Modal title="Register New Staff" onClose={() => setShowCreateModal(false)}>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
              <div className="relative group">
                <Users className="absolute left-4 top-3.5 w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                <input
                  type="text" placeholder="e.g. John Doe"
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-50 focus:border-indigo-600 outline-none transition-all"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-3.5 w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                <input
                  type="email" placeholder="name@library.edu"
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-50 focus:border-indigo-600 outline-none transition-all"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Temporary Password</label>
              <div className="relative group">
                <Key className="absolute left-4 top-3.5 w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                <input
                  type="password" placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-50 focus:border-indigo-600 outline-none transition-all"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Assign Library</label>
                <select
                  value={formData.library_id}
                  onChange={(e) => setFormData({ ...formData, library_id: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-50 outline-none transition-all appearance-none cursor-pointer"
                  required
                  disabled={libLoading}

                >
                  <option value="">{libLoading ? "Loading..." : "Select Branch"}</option>
                  {libraries.map((lib) => <option key={lib.id} value={lib.id}>{lib.name}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">System Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-50 outline-none transition-all appearance-none cursor-pointer"
                >
                  <option value="admin">Admin</option>
                  <option value="librarian">Librarian</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button" onClick={() => setShowCreateModal(false)}
                className="flex-1 py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl transition-colors"
              >
                Discard
              </button>
              <button
                type="submit" disabled={loading}
                className="flex-2 py-3 px-8 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-100 transition-all flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
                <span>Create Staff Account</span>
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* ---------- DELETE CONFIRM MODAL ---------- */}
      {deleteUserId && (
        <Modal title="Revoke Access?" onClose={() => setDeleteUserId(null)}>
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mb-2">
              <AlertCircle className="w-8 h-8 text-rose-600" />
            </div>
            <p className="text-slate-600 leading-relaxed font-medium">
              Are you sure you want to remove this staff member? This action is <span className="text-rose-600 font-bold">permanent</span> and will immediately revoke their system access.
            </p>
            <div className="flex w-full gap-3 mt-4">
              <button
                onClick={() => setDeleteUserId(null)}
                className="flex-1 py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl transition-colors"
              >
                Keep User
              </button>
              <button
                onClick={async () => {
                  await handleDelete(deleteUserId);
                  setDeleteUserId(null);
                }}
                className="flex-1 py-3 px-4 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-lg shadow-rose-100 transition-all"
              >
                Revoke Access
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}