import React, { useState } from "react";
import { format } from "date-fns";
import useLibraries from "../../hooks/useLibraries";
import { 
  IdCardLanyardIcon,
  ChevronDown,
  LibraryBigIcon as Library,
  Search, 
  AlertCircle,
  EditIcon,
  Trash2,
  BookOpen,
  Tags,
  User2,
  X,CheckCircle2,Loader2,
  Book,
  ChevronLeft, 
  ChevronRight, 
  Camera, 
} from "lucide-react";
import useBooks from "../../hooks/useBooks";
import useCategories from "../../hooks/useCategories";
import { useStore } from "../../context/useStore";


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

export default function Books() {

  const { user } = useStore();
  const [loading, setLoading] = useState(false);
  
  const [deleteBookId, setDeleteBookId] = useState(null);
  const [selectedBookId, setSelectedBookId] = useState("");

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [errorCreateMessage, setErrorCreateMessage] = useState("");
  const [errorUpdateMessage, setErrorUpdateMessage] = useState("");
  const [errorDeleteMessage, setErrorDeleteMessage] = useState("");

  // -------- FETCH BOOKS --------
  const { page, setPage, totalPages, totalBooks, pageSize, books, catLoading,formData, setFormData,catError, selectedCategory, selectedBook,setSelectedBook,setSelectedCategory, createBook, updateBook,deleteBook } = useBooks();


  const {  categories, selectedLibrary, setSelectedLibrary } = useCategories();

  const [imagePreview, setImagePreview] = useState(user?.image);
  

  // -------- FETCH LIBRARIES --------
  const { libraries, libLoading, libError } = useLibraries();

  const getLibraryName = (id) => {
    const lib = libraries?.find(l => l.id === id);
    return lib ? lib.name : "N/A";
  };



    // ---------------- CREATE BOOK SUBMIT ----------------
  const onSubmitCreate = async (e) => {
    e.preventDefault();
    setErrorCreateMessage("");
    const res = await createBook();

    if (res?.success) {
      setShowCreateModal(false);
    } else {
      setErrorCreateMessage(res?.message || "Error creating user");
    }
  };


  // -----------update book------------
  const onSubmitUpdate = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setErrorUpdateMessage("");
      const res = await updateBook(selectedBookId);

      if(res?.success){
        setShowUpdateModal(false);
      }else{
        setErrorUpdateMessage(res?.message || "Error updating book");
      }

    } catch (err) {
      setErrorUpdateMessage(err?.message || "update failed!");
    } finally {
      setLoading(false);
    }
  };
  

  // Handle Image Upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        // Here you would typically call your upload API
        console.log("File ready for upload:", file.name);
      };
      reader.readAsDataURL(file);
    }
  };


  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8 font-sans">
      
      {/* Header & Stats Section */}
      <div className="max-w-7xl mx-auto space-y-8">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Book Management</h1>
            <p className="text-slate-500 mt-1 font-medium">Manage books.</p>
          </div>
          {user.role === "admin" && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-100 transition-all active:scale-[0.98]"
            >
              <Tags className="w-5 h-5" />
              <span>Add New Book</span>
            </button>
          )}
        </div>
        

        {/* Quick Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
             { 
              label: `Books`, 
              value:  books.length,
              icon: <Book className="text-blue-600" />, 
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
          <div className="p-6 border-b border-slate-50 flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-50/50">
      
            {/* Search Input - Left Side */}
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
              <input
                type="text"
                placeholder="Search by name..."
                className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400 font-medium shadow-sm"
              />
            </div>

            {/* Library Selection - middle*/}
            <div className="flex items-center gap-3 w-full md:w-auto">
              <span className="hidden lg:block text-xs font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">
                Filter Library:
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

            {/* Category Selection - Right Side */}
            <div className="flex items-center gap-3 w-full md:w-auto">
              <span className="hidden lg:block text-xs font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">
                Filter Category:
              </span>
              
              <div className="relative w-full md:w-64 group">
                <Library className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors pointer-events-none z-10" />
                
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full pl-11 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 outline-none transition-all cursor-pointer appearance-none font-medium text-slate-700 shadow-sm"
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.category_name}
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
                  <th className="px-8 py-5">Book Identity</th>
                  <th className="px-6 py-5">category</th>
                  <th className="px-6 py-5">library</th>
                  <th className="px-6 py-5">quantity</th>
                  <th className="px-6 py-5">status</th>
                  {user.role === "admin" &&(
                  <th className="px-6 py-5 text-right">actions</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
               
                {loading ? (
                  Array(3).fill(0).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan={6} className="px-8 py-6">
                        <div className="h-10 bg-slate-100 rounded-xl w-full" />
                      </td>
                    </tr>
                  ))

                  ) : books.length === 0 ? (

                    <tr>
                      <td colSpan={6} className="px-8 py-10 text-center">
                        <div className="flex flex-col items-center gap-2 text-slate-500">
                          <AlertCircle className="w-6 h-6 text-slate-400" />
                          <p className="font-semibold">
                            {catError || "No books found"}
                          </p>
                        </div>
                      </td>
                    </tr>

                  ) : (

                  books.map((book) => (
                    <tr key={book.id} className="group hover:bg-slate-50/50 transition-colors">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-full  flex items-center justify-center font-bold bg-amber-50 text-amber-700 border-amber-200`}>
                            <img src={book.image} alt={book.title} className="w-full h-full object-cover" /> 
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">{book.title}</p>
                            <p className="text-xs text-slate-400 font-medium">{book.author}</p>
                          </div>
                        </div>
                      </td> 
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2 text-slate-600 font-medium text-sm">
                          <Tags className="w-4 h-4 text-slate-300" />
                          {categories.find(c => c.id === book.category_id)?.category_name || "N/A"}
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center  text-slate-600 font-medium text-sm">
                          <BookOpen className="w-4 h-4 text-slate-300" />
                          {libraries.find(l => l.id === book.library_id)?.name || "N/A"}
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center  text-slate-600 font-medium text-sm">
                          <IdCardLanyardIcon className="w-4 h-4 text-slate-300" />
                          {book.quantity}
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center  text-slate-600 font-medium text-sm">
                          <IdCardLanyardIcon className="w-4 h-4 text-slate-300" />
                          {book.status}
                        </div>
                      </td>
                      {user.role === "admin" && (
                        <td className="px-8 py-5 text-right">
                          <button
                            onClick={() => {
                              setSelectedBookId(book.id);
                              setFormData({
                                image:book.image,
                                title: book.title,
                                author:book.author,
                                category_id:book.category_id,
                                quantity:book.quantity,
                                status:book.status
                              });
                              setShowUpdateModal(true);
                            }}
                            className="p-2 text-slate-300 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all"
                          > 
                          < EditIcon className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => setDeleteBookId(book.id)}
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
              Showing <span className="text-slate-900 font-bold">{(page-1)*pageSize + 1}-{Math.min(page*pageSize, totalBooks)}</span> of <span className="text-slate-900 font-bold">{totalBooks}</span> Books
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
        <Modal title="Register New Book" onClose={() => setShowCreateModal(false)}>
          <form onSubmit={onSubmitCreate} className="space-y-5" >
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Title</label>
              <div className="relative group">
                <Book className="absolute left-4 top-3.5 w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                <input
                  type="text" placeholder="e.g. Harry Potter"
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-50 focus:border-indigo-600 outline-none transition-all"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Author</label>
              <div className="relative group">
                <User2 className="absolute left-4 top-3.5 w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                <input
                  type="text" placeholder="J.K. Rowling"
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-50 focus:border-indigo-600 outline-none transition-all"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Quantity</label>
              <div className="relative group">
                <User2 className="absolute left-4 top-3.5 w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                <input
                  type="number" placeholder="1"
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-50 focus:border-indigo-600 outline-none transition-all"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Select Library</label>
              <div className="relative group">
                <select
                  value={selectedLibrary}
                  onChange={(e) => setSelectedLibrary(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-50 outline-none transition-all appearance-none cursor-pointer"
                  required
                  disabled={libLoading}

                >
                  <option value="">{libLoading ? "Loading..." : "Select Library"}</option>
                  
                  {user.role === "admin" && ( 
                      <option key={user.library_id} value={user.library_id}>{getLibraryName(user.library_id)}</option>
                  )}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Assign Category</label>
                <select
                  value={formData.category_id}
                  onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-50 outline-none transition-all appearance-none cursor-pointer"
                  required
                  disabled={libLoading}

                >
                  <option value="">{libLoading ? "Loading..." : "Select Category"}</option>
                  
                  {user.role === "admin" && ( 
                    <>
                    {categories.map((cat) => 
                      <option key={cat.id} value={cat.id}>{cat.category_name}</option>
                    )}
                    </>
                  )}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
                 Book Cover
                </label>
                
                <div className="relative group">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setFormData({ ...formData, image: e.target.files[0] })
                    }
                    className="block w-full text-sm text-slate-500
                      file:mr-4 file:py-3 file:px-6
                      file:rounded-xl file:border-0
                      file:text-sm file:font-bold
                      file:bg-slate-900 file:text-white
                      hover:file:bg-slate-800
                      file:cursor-pointer cursor-pointer
                      bg-white border border-slate-200 rounded-xl
                      focus:ring-4 focus:ring-indigo-50 focus:border-indigo-600
                      transition-all outline-none"
                  />
                </div>
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
                <span>Register new book</span>
              </button>
            </div>
            {errorCreateMessage && (
              <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm font-medium">
                {errorCreateMessage}
              </div>
            )}
          </form>
        </Modal>
      )}


      {/* update model  */}
      {showUpdateModal && (
        <Modal
          title="Update Book"
          onClose={() => setShowUpdateModal(false)}
        >
          <form onSubmit={onSubmitUpdate} className="space-y-5">

            {/* Profile Image Section */}
              <div className="relative mt-4 mb-6 flex justify-center">
                <div className="w-32 h-32 bg-white p-1 rounded-full border-4 border-white shadow-xl relative z-10 overflow-hidden">
                  <div className="w-full h-full bg-indigo-600 rounded-full flex items-center justify-center text-white text-4xl font-black overflow-hidden">
                    {imagePreview ? (
                      <img 
                        src={imagePreview || formData.image} 
                        alt="Profile" 
                        className="w-full h-full object-cover" 
                      />
                    ) : (
                      <span>{user?.name?.charAt(0)}</span>
                    )}
                  </div>
                </div>
                
                {/* Functional Upload Button */}
                <label className="absolute bottom-1 right-1/2 translate-x-12 z-20 cursor-pointer group/cam">
                  <div className="p-2.5 bg-emerald-500 text-white rounded-full shadow-lg border-2 border-white hover:bg-emerald-600 transition-all active:scale-90 group-hover/cam:scale-110">
                    <Camera className="w-4 h-4" />
                  </div>
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="image/*"
                    onChange={(e) =>{
                      handleImageChange(e)
                      setFormData({ ...formData, image: e.target.files[0] })
                    }
                    }
                  />
                </label>
              </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
                Book Title
              </label>

              <div className="relative group">
                <Tags className="absolute left-4 top-3.5 w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                <input
                  type="text"
                  placeholder="e.g. Harry Potter"
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-50 focus:border-indigo-600 outline-none transition-all"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      title: e.target.value
                    })
                  }
                  required
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
                Author
              </label>

              <div className="relative group">
                <Tags className="absolute left-4 top-3.5 w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                <input
                  type="text"
                  placeholder="e.g. J.K.Rowling"
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-50 focus:border-indigo-600 outline-none transition-all"
                  value={formData.author}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      author: e.target.value
                    })
                  }
                  required
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
                Quantity
              </label>

              <div className="relative group">
                <Tags className="absolute left-4 top-3.5 w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                <input
                  type="number"
                  placeholder="e.g. 1"
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-50 focus:border-indigo-600 outline-none transition-all"
                  value={formData.quantity}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      quantity: Number(e.target.value)
                    })
                  }
                  required
                />
              </div>
            </div>
            <div className="space-y-1 hidden">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
                Category
              </label>

              <div className="relative group">
                <Tags className="absolute left-4 top-3.5 w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                <input
                  type="text"
                  placeholder="e.g. 1"
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-50 focus:border-indigo-600 outline-none transition-all"
                  value={formData.category_id}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      category_id: e.target.value
                    })
                  }
                  required
                />
              </div>
            </div>

            <div className="relative group">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1"> Select Status</label>
                <div className="relative group">
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({
                      ...formData,
                      status: e.target.value
                    })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-50 outline-none transition-all appearance-none cursor-pointer"
                    required

                  >
                    <option value="available">Available</option>
                    <option value="borrowed">Borrowed</option>
                    <option value="damaged">Damaged</option>
                  </select>
                </div>
              </div>
            </div>
            {errorUpdateMessage && (
              <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm font-medium">
                {errorUpdateMessage}
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
      {deleteBookId && (
        <Modal title="Revoke Access?" onClose={() => setDeleteBookId(null)}>
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mb-2">
              <AlertCircle className="w-8 h-8 text-rose-600" />
            </div>
            <p className="text-slate-600 leading-relaxed font-medium">
              Are you sure you want to remove this book? This action is <span className="text-rose-600 font-bold">permanent</span> and will immediately revoke their system access.
            </p>
            <div className="flex w-full gap-3 mt-4">
              <button
                onClick={() => setDeleteBookId(null)}
                className="flex-1 py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl transition-colors"
              >
                Keep Book
              </button>
              <button
                onClick={async () => {
                  setErrorDeleteMessage("");
                  const res = await deleteBook(deleteBookId);
                  if(!res.success) setErrorDeleteMessage(res.message);
                  setDeleteBookId(null);
                }}
                className="flex-1 py-3 px-4 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-lg shadow-rose-100 transition-all"
              >
                Revoke Access
              </button>
            </div>
            {errorDeleteMessage && (
              <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm font-medium">
                {errorDeleteMessage}
              </div>
            )}
          </div>
        </Modal>
      )}

    </div>
  );
}