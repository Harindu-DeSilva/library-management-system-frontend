import React, { useState } from "react";
import { format } from "date-fns";
import useLibraries from "../../hooks/useLibraries";
import { useStore } from "../../context/useStore";
import { 
  IdCardLanyardIcon,
  ChevronDown,
  LibraryBigIcon as Library,
  AlertCircle,
  Tags,
  Trash2,
  X,
  EditIcon,
  ChevronLeft, 
  ChevronRight, 
  Clock,  
  Users, 
  CheckCircle2,
  Loader2,
} from "lucide-react";
import useCategories from "../../hooks/useCategories";
import useUsers from "../../hooks/useUsers";

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


export default function Categories() {

  
  const { user } = useStore();

  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);


  const [loading, setLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  const [deleteCategoryId, setDeleteCategoryId] = useState(null);

  const [errorMessage, setErrorMessage] = useState("");


  const { users } = useUsers();


  // -------- FETCH CATEGORIES --------
  const { page, setPage, totalPages, totalCategories, pageSize, categories,  catError, selectedLibrary,formData,
    setFormData, 
    createCategory,
    deleteCategory, setSelectedLibrary, updateCategory } = useCategories();


  // -------- FETCH LIBRARIES --------
  const { libraries, } = useLibraries();

    // ---------------- CREATE CATEGORY SUBMIT ----------------
  const onSubmitCreate = async (e) => {
    e.preventDefault();

    setErrorMessage("");
    const res = await createCategory();

    if (res?.success) {
      setShowCreateModal(false);
    } else {
      setErrorMessage(res?.message || "Error creating category");
    }
  };

  const onSubmitUpdate = async (e) => {
  e.preventDefault();

  try {
    setLoading(true);
    setErrorMessage("");
    const res = await updateCategory(selectedCategoryId);

    if(res?.success){
      setShowUpdateModal(false);
    }else{
      setErrorMessage(res?.message || "Error updating category");
    }

  } catch (err) {
    setErrorMessage(err?.message || "update failed!");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8 font-sans">
      
      {/* Header & Stats Section */}
      <div className="max-w-7xl mx-auto space-y-8">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Category Management</h1>
            <p className="text-slate-500 mt-1 font-medium">Manage categories.</p>
          </div>
          {user.role === "admin" && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-100 transition-all active:scale-[0.98]"
            >
              <Tags className="w-5 h-5" />
              <span>Add New Category</span>
            </button>
          )}
        </div>

        {/* Quick Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
             { 
              label: `Categories`, 
              value:  categories.length,
              icon: <Tags className="text-amber-600" />, 
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
          <div className="p-6 border-b border-slate-50 flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-50/50">

          {/* Library Selection - Right Side */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <span className="hidden lg:block text-xs font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">
              Filter By:
            </span>
            
            <div className="relative w-full md:w-64 group">
              <Library className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors pointer-events-none z-10" />
              
              <select
                value={selectedLibrary}
                onChange={(e) => setSelectedLibrary(e.target.value)}
                className="w-full pl-11 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 outline-none transition-all cursor-pointer appearance-none font-medium text-slate-700 shadow-sm"
              >
                {user.role === "superAdmin" && (
                  <>
                  <option value="">All Library Branches</option>
                  
                  {libraries.map((lib) => (
                    <option key={lib.id} value={lib.id}>
                      {lib.name}
                    </option>
                  ))}
                  </>
                )}
                {user.role === "admin" && (
                  <>
                  <option value="">All Library Branches</option>
                  <option value={user.library_id}>
                    {libraries.find(l => l.id === user.library_id)?.name || "My Library"}
                  </option>
                  </>
                )}
              </select>

              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none transition-transform group-focus-within:rotate-180" />
            </div>
            </div>
          </div>


          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-slate-400 text-xs font-bold uppercase tracking-widest border-b border-slate-50">
                  <th className="px-8 py-5">Category Identity</th>
                  <th className="px-6 py-5">library name</th>
                  {user.role === "superAdmin" && (
                  <th className="px-6 py-5">library admin</th>
                  )}
                  <th className="px-6 py-5">Created Time</th>
                  {user.role === "admin" && (
                  <th className="px-8 py-5 text-right">Actions</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
               
                {loading ? (
                  Array(3).fill(0).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan={4} className="px-8 py-6">
                        <div className="h-10 bg-slate-100 rounded-xl w-full" />
                      </td>
                    </tr>
                  ))

                  ) : categories.length === 0 ? (

                    <tr>
                      <td colSpan={4} className="px-8 py-10 text-center">
                        <div className="flex flex-col items-center gap-2 text-slate-500">
                          <AlertCircle className="w-6 h-6 text-slate-400" />
                          <p className="font-semibold">
                            {catError || "No categories found"}
                          </p>
                        </div>
                      </td>
                    </tr>

                  ) : (

                  categories.map((category) => (
                    <tr key={category.id} className="group hover:bg-slate-50/50 transition-colors">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-full  flex items-center justify-center font-bold bg-amber-50 text-amber-700 border-amber-200`}>
                            {category.category_name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">{category.category_name}</p>
                          </div>
                        </div>
                      </td> 
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2 text-slate-600 font-medium text-sm">
                          <IdCardLanyardIcon className="w-4 h-4 text-slate-300" />
                          {libraries.find(l => l.id === category.library_id)?.name || "My Library"}
                        </div>
                      </td>
                      {user.role === "superAdmin" && (
                      <td className="px-6 py-5">
                        <div className="flex items-center  text-slate-600 font-medium text-sm">
                          <IdCardLanyardIcon className="w-4 h-4 text-slate-300" />
                           {users?.length > 0
                            ? users.find(u => u.id === category.admin_id)?.name || "N/A"
                            : "Loading..."}
                        </div>
                      </td>
                      )}
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2 text-slate-600 font-medium text-sm">
                          <Clock className="w-4 h-4 text-slate-300" />
                          {format(new Date(category.createdAt), "dd MMM yyyy, HH:mm")}
                        </div>
                      </td>
                       {user.role === "admin" && (
                       <td className="px-8 py-5 text-right">
                         <button
                         onClick={() => {
                            setSelectedCategoryId(category.id);
                            setFormData({
                              category_name: category.category_name
                            });
                            setShowUpdateModal(true);
                          }}
                          className="p-2 text-slate-300 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all"
                        >
                          <EditIcon className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => setDeleteCategoryId(category.id)}
                          className="p-2 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </td>
                       )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Styled Pagination */}
          <div className="px-8 py-6 border-t border-slate-50 flex items-center justify-between bg-slate-50/30">
            <p className="text-sm text-slate-500 font-medium">
              Showing <span className="text-slate-900 font-bold">{(page-1)*pageSize + 1}-{Math.min(page*pageSize, totalCategories)}</span> of <span className="text-slate-900 font-bold">{totalCategories}</span> Categories
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
        <Modal title="Register New Category" onClose={() => setShowCreateModal(false)}>
          <form onSubmit={onSubmitCreate} className="space-y-5">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Category Name</label>
              <div className="relative group">
                <Users className="absolute left-4 top-3.5 w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                <input
                  type="text" placeholder="e.g. Fictions"
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-50 focus:border-indigo-600 outline-none transition-all"
                  value={formData.category_name}
                  onChange={(e) => setFormData({ ...formData, category_name: e.target.value })}
                  required
                />
              </div>
            </div>
            {errorMessage && (
              <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm font-medium">
                {errorMessage}
              </div>
            )}
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
                <span>Create</span>
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* update model  */}
      {showUpdateModal && (
        <Modal
          title="Update Category"
          onClose={() => setShowUpdateModal(false)}
        >
          <form onSubmit={onSubmitUpdate} className="space-y-5">

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
                Category Name
              </label>

              <div className="relative group">
                <Tags className="absolute left-4 top-3.5 w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                <input
                  type="text"
                  placeholder="e.g. Fictions"
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-50 focus:border-indigo-600 outline-none transition-all"
                  value={formData.category_name}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      category_name: e.target.value
                    })
                  }
                  required
                />
              </div>
            </div>
            {errorMessage && (
              <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm font-medium">
                {errorMessage}
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => setShowUpdateModal(false)}
                className="flex-1 py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl transition-colors"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="flex-2 py-3 px-8 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-100 transition-all flex items-center justify-center gap-2"
              >
                {loading
                  ? <Loader2 className="w-5 h-5 animate-spin" />
                  : <CheckCircle2 className="w-5 h-5" />}
                <span>Update</span>
              </button>
            </div>
          </form>
        </Modal>
      )}


      {/* ---------- DELETE CONFIRM MODAL ---------- */}
      {deleteCategoryId && (
        <Modal title="Revoke Access?" onClose={() => setDeleteCategoryId(null)}>
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mb-2">
              <AlertCircle className="w-8 h-8 text-rose-600" />
            </div>
            <p className="text-slate-600 leading-relaxed font-medium">
              Are you sure you want to remove this category? This action is <span className="text-rose-600 font-bold">permanent</span> and will immediately revoke their system access.
            </p>
            <div className="flex w-full gap-3 mt-4">
              <button
                onClick={() => setDeleteCategoryId(null)}
                className="flex-1 py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl transition-colors"
              >
                Keep Category
              </button>
              <button
                onClick={async () => {
                  const res = await deleteCategory(deleteCategoryId);
                  setErrorMessage("");
                  if(!res.success) setErrorMessage(res.message || "Error deleting category");
                  setDeleteCategoryId(null);
                }}
                className="flex-1 py-3 px-4 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-lg shadow-rose-100 transition-all"
              >
                Revoke Access
              </button>
            </div>
            {errorMessage && (
              <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm font-medium">
                {errorMessage}
              </div>
            )}
          </div>
        </Modal>
      )}
      
    </div>
  );
}