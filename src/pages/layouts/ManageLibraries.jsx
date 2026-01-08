import React, { useState} from "react";
import { format } from "date-fns";
import {createLibraryApi, deleteLibraryApi } from "../../api/libraryApi";
import useLibraries from "../../hooks/useLibraries";
import { 
  LibraryBigIcon,
  Trash2, 
  Mail, 
  Library as LibraryIcon, 
  Search, 
  MailIcon,
  ChevronLeft, 
  ChevronRight, 
  LocationEdit,
  X,
  Clock, 
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


export default function ManageLibraries() {

  const [loading] = useState(false);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [deleteLibraryId, setDeleteLibraryId] = useState(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");


  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
  });

  // -------- FETCH LIBRARIES --------
  const {
    libraries,
    totalPages,
    totalLibraries,
    pageSize,
    fetchLibraries
  } = useLibraries(page, search);


  // -------- CREATE LIBRARY --------
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createLibraryApi({
        name: formData.name,
        email: formData.email,
        address: formData.address,
      });

      setShowCreateModal(false);

      setFormData({
        name: "",
        email: "",
        address: "",
      });

      fetchLibraries();
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  // -------- DELETE LIBRARY --------
  const handleDelete = async (id) => {
    try {
      await deleteLibraryApi(id);
      fetchLibraries();
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };
  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8 font-sans">
      
      {/* Header & Stats Section */}
      <div className="max-w-7xl mx-auto space-y-8">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Library Management</h1>
            <p className="text-slate-500 mt-1 font-medium">Manage libraries.</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-100 transition-all active:scale-[0.98]"
          >
            <LibraryBigIcon className="w-5 h-5" />
            <span>Add New Library</span>
          </button>
        </div>

        {/* Quick Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
             { 
              label: 'Active Libraries', 
              value:  libraries.length,
              icon: <LibraryBigIcon className="text-amber-600" />, 
              bg: 'bg-amber-50' 
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
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1); // reset pagination
                }}
                placeholder="Search by name or email..."
                className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 outline-none transition-all"
              />


            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-slate-400 text-xs font-bold uppercase tracking-widest border-b border-slate-50">
                  <th className="px-8 py-5">Library Identity</th>
                  <th className="px-6 py-5">Email</th>
                  <th className="px-6 py-5">Address</th>
                  <th className="px-6 py-5">Created Time</th>
                  <th className="px-8 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  Array(3).fill(0).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan={6} className="px-8 py-6"><div className="h-10 bg-slate-100 rounded-xl w-full" /></td>
                    </tr>
                  ))
                ) : (
                  libraries.map((library) => (
                    <tr key={library.id} className="group hover:bg-slate-50/50 transition-colors">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-full  flex items-center justify-center font-bold bg-amber-50 text-amber-700 border-amber-200`}>
                            {library.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">{library.name}</p>
                          </div>
                        </div>
                      </td> 
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2 text-slate-600 font-medium text-sm">
                          <MailIcon className="w-4 h-4 text-slate-300" />
                          {library.email}
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center  text-slate-600 font-medium text-sm">
                          <LocationEdit className="w-4 h-4 text-slate-300" />
                          {library.address}
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2 text-slate-600 font-medium text-sm">
                          <Clock className="w-4 h-4 text-slate-300" />
                          {format(new Date(library.createdAt), "dd MMM yyyy, HH:mm")}
                        </div>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <button
                          onClick={() => setDeleteLibraryId(library.id)}
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
              Showing <span className="text-slate-900 font-bold">{(page-1)*pageSize + 1}-{Math.min(page*pageSize, totalLibraries)}</span> of <span className="text-slate-900 font-bold">{totalLibraries}</span> Libraries
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
        <Modal title="Register New Library" onClose={() => setShowCreateModal(false)}>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Name</label>
              <div className="relative group">
                <LibraryIcon className="absolute left-4 top-3.5 w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                <input
                  type="text" placeholder="e.g. Knowledge Tree"
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
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Address</label>
              <div className="relative group">
                <LocationEdit className="absolute left-4 top-3.5 w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                <input
                  type="text" placeholder="Address"
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-50 focus:border-indigo-600 outline-none transition-all"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  required
                />
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
                <span>Create Library</span>
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* ---------- DELETE CONFIRM MODAL ---------- */}
      {deleteLibraryId && (
        <Modal title="Revoke Access?" onClose={() => setDeleteLibraryId(null)}>
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mb-2">
              <AlertCircle className="w-8 h-8 text-rose-600" />
            </div>
            <p className="text-slate-600 leading-relaxed font-medium">
              Are you sure you want to remove this library? This action is <span className="text-rose-600 font-bold">permanent</span> and will immediately revoke their system access.
            </p>
            <div className="flex w-full gap-3 mt-4">
              <button
                onClick={() => setDeleteLibraryId(null)}
                className="flex-1 py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl transition-colors"
              >
                Keep Library
              </button>
              <button
                onClick={async () => {
                  await handleDelete(deleteLibraryId);
                  setDeleteLibraryId(null);
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