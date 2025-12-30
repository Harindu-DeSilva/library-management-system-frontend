import React, { useState } from "react";
import { format } from "date-fns";
import useLibraries from "../../hooks/useLibraries";
import { 
  IdCardLanyardIcon,
  ChevronDown,
  LibraryBigIcon as Library,
  Search, 
  AlertCircle,
  Tags,
  ChevronLeft, 
  ChevronRight, 
  Clock, 
} from "lucide-react";
import useCategories from "../../hooks/useCategories";



export default function Categories() {

  const [loading, setLoading] = useState(false);

  // -------- FETCH CATEGORIES --------
  const { page, setPage, totalPages, totalCategories, pageSize, categories, catLoading, catError, selectedLibrary, setSelectedLibrary } = useCategories();

  // -------- FETCH LIBRARIES --------
  const { libraries, libLoading, libError } = useLibraries();


  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8 font-sans">
      
      {/* Header & Stats Section */}
      <div className="max-w-7xl mx-auto space-y-8">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Category Management</h1>
            <p className="text-slate-500 mt-1 font-medium">Manage categories.</p>
          </div>
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
      
          {/* Search Input - Left Side */}
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
            <input
              type="text"
              placeholder="Search by name or email..."
              className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400 font-medium shadow-sm"
            />
          </div>

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
                <option value="">All Library Branches</option>
                {libraries.map((lib) => (
                  <option key={lib.id} value={lib.id}>
                    {lib.name}
                  </option>
                ))}
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
                  <th className="px-6 py-5">library id</th>
                  <th className="px-6 py-5">admin id</th>
                  <th className="px-6 py-5">Created Time</th>
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
                            <p className="text-xs text-slate-400 font-medium">{category.id}</p>
                          </div>
                        </div>
                      </td> 
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2 text-slate-600 font-medium text-sm">
                          <IdCardLanyardIcon className="w-4 h-4 text-slate-300" />
                          {category.library_id}
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center  text-slate-600 font-medium text-sm">
                          <IdCardLanyardIcon className="w-4 h-4 text-slate-300" />
                          {category.admin_id}
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2 text-slate-600 font-medium text-sm">
                          <Clock className="w-4 h-4 text-slate-300" />
                          {format(new Date(category.createdAt), "dd MMM yyyy, HH:mm")}
                        </div>
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
    </div>
  );
}