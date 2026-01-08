import React, { useState} from "react";
import { format } from "date-fns";
import { 
  Trash2, 
  Mail, 
  Library as LibraryIcon, 
  Search,  
  Book, 
  Layers,
  Tag,
  Calendar,
  EditIcon,
  BookUserIcon,
  ChevronLeft, 
  ChevronRight, 
  LocationEdit,
  X,
  Clock, 
  CheckCircle2,
  AlertCircle,
  Loader2
} from "lucide-react";
import useLends from "../../hooks/useLends";

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

  // Helper to render status badges
  const getStatusBadge = (status) => {
    const s = status?.toLowerCase();
    if (s === 'overdue') return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-100">
        <AlertCircle className="w-3 h-3" /> Overdue
      </span>
    );
    if (s === 'returned') return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-100">
        <CheckCircle2 className="w-3 h-3" /> Returned
      </span>
    );
    return ( // Borrowed / Pending
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-100">
        <Clock className="w-3 h-3" /> Borrowed
      </span>
    );
  };


export default function Lends() {

  const [loading, setLoading] = useState(false);

  const [showLendUpdateModal, setShowLendUpdateModal] = useState(false);
  const [updateLendBookId, setUpdateLendBookId] = useState(null);
  const [page, setPage] = useState(1);

  
  const [errorLendingMessage, setErrorLendingMessage] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
  });

  const { 
    actionLoading,

    lendBooks,
    lendLoading,
    lendError,
    totalLendPages,
    totalLends,
    lendPageSize,
    formLendingData,
    setFormLendingData,updateLend } = useLends();


  // -----------update Lend------------
  const onSubmitUpdateLend = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setErrorLendingMessage("");
      const res = await updateLend(updateLendBookId);

      if(res?.success){
        setShowLendUpdateModal(false);
      }else{
        setErrorLendingMessage(res?.message || "Error updating record");
      }

    } catch (err) {
      setErrorLendingMessage(err?.message || "update failed!");
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
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Book Lending Management</h1>
            <p className="text-slate-500 mt-1 font-medium">Manage Book lendings...</p>
          </div>
        </div>

        {/* Quick Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
             { 
              label: 'Book Lending Records', 
              value:  lendBooks.length,
              icon: <BookUserIcon className="text-blue-600" />, 
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
                placeholder="Search by name or email..."
                className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 outline-none transition-all"
              />


            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.15em] border-b border-slate-50 bg-slate-50/30">
                  <th className="px-8 py-5">Borrower</th>
                  <th className="px-5 py-5">Resource</th>
                  <th className="px-6 py-5">Qty</th>
                  <th className="px-6 py-5">Classification</th>
                  <th className="px-6 py-5">Branch</th>
                  <th className="px-6 py-5">Due Date</th>
                  <th className="px-6 py-5">Status</th>
                  <th className="px-6 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {lendLoading ? (
                  // Fixed colSpan to 9 to cover the whole table
                  Array(3).fill(0).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan={8} className="px-8 py-6">
                        <div className="h-12 bg-slate-100 rounded-2xl w-full" />
                      </td>
                    </tr>
                  ))
                ) : (
                  lendBooks.map((lendBook) => (
                    <tr key={lendBook.id} className="group hover:bg-indigo-50/30 transition-all duration-200">
                      {/* User Info */}
                      <td className="px-8 py-5">
                        <div className="items-center gap-1.5">
                            <p className="font-bold text-slate-900 text-sm leading-none mb-1">{lendBook.lendUser.name}</p>
                            <p className="text-[11px] text-slate-400 font-medium">{lendBook.lendUser.email}</p>
                        </div>
                      </td>

                      {/* Book Title */}
                      <td className="px-5 py-5">
                        <div className="flex items-center gap-1.5 text-slate-700 font-semibold text-sm">
                          <Book className="w-4 h-4 text-indigo-400" />
                          <span className="truncate max-w-[150px]">{lendBook.Book.title}</span>
                        </div>
                      </td>

                      {/* Quantity */}
                      <td className="px-6 py-5">
                        <div className="inline-flex items-center gap-1.5 text-slate-600 font-bold text-xs bg-slate-100 px-2.5 py-1 rounded-lg">
                          <Layers className="w-3.5 h-3.5 text-slate-400" />
                          {lendBook.quantity}
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2 text-slate-600 font-medium text-sm">
                          <Tag className="w-4 h-4 text-emerald-400/70" />
                          {lendBook.Category.category_name}
                        </div>
                      </td>

                      {/* Library */}
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2 text-slate-600 font-medium text-sm">
                          <LibraryIcon className="w-4 h-4 text-indigo-400/70" />
                          {lendBook.Library.name}
                        </div>
                      </td>

                      {/* Due Date */}
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2 text-slate-900 font-bold text-xs">
                          <Clock className="w-3.5 h-3.5 text-rose-400" />
                          {format(new Date(lendBook.due_date), "dd MMM yyyy")}
                        </div>
                      </td>

                      {/* Status Badge */}
                      <td className="px-6 py-5">
                        {getStatusBadge(lendBook.status)}
                      </td>

                      {/* Update Action */}
                      <td className="px-8 py-5 text-right">
                        {lendBook.status !== "RETURNED" && (
                        <button
                          onClick={() => {
                            setUpdateLendBookId(lendBook.id);
                            setFormLendingData({
                              book_id:lendBook.book_id,
                              quantity: lendBook.quantity,
                              library_id: lendBook.library_id,
                              status: lendBook.status,
                              return_date: lendBook.return_date?.slice(0,10) || new Date().toISOString().slice(0,10)
                            });
                            setShowLendUpdateModal(true);

                          }}
                          className="p-2.5 text-slate-300 hover:text-amber-600 hover:bg-amber-50 rounded-xl transition-all active:scale-90"
                          title="Update Record"
                        >
                          <EditIcon className="w-5 h-5" />
                        </button>
                        )}
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
              Showing <span className="text-slate-900 font-bold">{(page-1)*lendPageSize + 1}-{Math.min(page*lendPageSize, totalLends)}</span> of <span className="text-slate-900 font-bold">{totalLends}</span> Book Lend Records
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
                {page} / {totalLendPages}
              </div>
              <button
                disabled={page === totalLendPages}
                onClick={() => setPage(page + 1)}
                className="p-2 border border-slate-200 rounded-lg hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ---------- LEND UPDATE MODAL ---------- */}
      {showLendUpdateModal && (
        <Modal title="Update Lend Records" onClose={() => setShowLendUpdateModal(false)}>
          <form className="space-y-5" onSubmit={onSubmitUpdateLend}>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Status</label>
              <select
                value={formLendingData.status}
                onChange={(e) => setFormLendingData({ ...formLendingData, status: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-50 outline-none transition-all appearance-none cursor-pointer"
                required
              >
                <option value="BORROWED">BORROWED</option>
                <option value="RETURNED">RETURNED</option>
                <option value="OVERDUE">OVERDUE</option>
              </select>
            </div>

            {errorLendingMessage && (
              <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm font-medium">
                {errorLendingMessage}
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <button
                type="button" onClick={() => setShowLendUpdateModal(false)}
                className="flex-1 py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl transition-colors"
              >
                Discard
              </button>
              <button
                type="submit" disabled={loading}
                className="flex-2 py-3 px-8 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-100 transition-all flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
                <span>Update</span>
              </button>
            </div>
          </form>
        </Modal>
      )}

    </div>
  );
}