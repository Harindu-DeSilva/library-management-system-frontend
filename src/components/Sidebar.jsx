import { Link, useLocation } from "react-router-dom";
import { useStore } from "../context/useStore";
import { useState } from "react";
import { BookOpen, Library, Users, Book, Tags, UserCircle, LayoutDashboard, LogOut, Menu, X,ChevronRight,ShieldCheck} from 'lucide-react';
export default function Sidebar() {

  
  const { user, logout } = useStore();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const iconMap = {
    "Manage Libraries": <Library className="w-5 h-5" />,
    "Manage Users": <Users className="w-5 h-5" />,
    "Users": <Users className="w-5 h-5" />,
    "View Books": <Book className="w-5 h-5" />,
    "Books": <Book className="w-5 h-5" />,
    "View Categories": <Tags className="w-5 h-5" />,
    "Categories": <Tags className="w-5 h-5" />,
    "Profile": <UserCircle className="w-5 h-5" />,
    "Home": <LayoutDashboard className="w-5 h-5" />,
    "Library": <BookOpen className="w-5 h-5" />,
  };


  const menu = {
    superAdmin: [
      { label: "Home", path: "/super-admin"},
      { label: "Manage Libraries", path: "/super-admin/libraries" },
      { label: "Manage Users", path: "/super-admin/users" },
      { label: "View Books", path: "/super-admin/books" },
      { label: "View Categories", path: "/super-admin/categories" },
      { label: "Profile", path: "/super-admin/profile" },
    ],

    admin: [
      { label: "Home", path: "/admin" },
      { label: "Users", path: "/admin/users" },
      { label: "Books", path: "/admin/books" },
      { label: "Categories", path: "/admin/categories" },
      { label: "Profile", path: "/admin/profile" },
    ],

    user: [
      { label: "Home", path: "/dashboard" },
      { label: "Library", path: "/dashboard/library" },
      { label: "Books", path: "/dashboard/books" },
    ],
  };

  const currentMenu = menu[user?.role] || menu.user;

  const isActive = (path) => location.pathname === path;

   return (
    <>
      {/* Mobile Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-slate-900 text-white rounded-lg shadow-lg"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={`
        fixed inset-y-0 left-0 z-45 w-72 bg-white border-r border-slate-100 flex flex-col transition-transform duration-300 ease-in-out
        lg:relative lg:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        
        {/* Branding Header */}
        <div className="p-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-100">
              <BookOpen className="text-emerald-400 w-6 h-6" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 leading-none">LMS Portal</h2>
              <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Happy Reading!</span>
            </div>
          </div>
        </div>

        {/* User Quick Info */}
        <div className="px-6 mb-6">
          <div className="bg-slate-50 rounded-2xl p-4 flex items-center gap-3 border border-slate-100">
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-900 truncate">{user?.name || 'User'}</p>
              <p className="text-xs text-slate-500 capitalize">{user?.role || 'Guest'}</p>
              <p className="text-xs text-slate-500">{user?.email || 'example@gmail.com'}</p>
            </div>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="flex-1 px-4 space-y-8 overflow-y-auto custom-scrollbar">
          <nav className="space-y-1.5">
            <p className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">Main Menu</p>
            {currentMenu.map((item) => (
              <Link 
                key={item.path} 
                to={item.path} 
                className={`
                  group flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200
                  ${isActive(item.path) 
                    ? 'bg-indigo-50 text-indigo-700 shadow-sm shadow-indigo-50' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}
                `}
              >
                <div className="flex items-center gap-3">
                  <span className={`transition-colors ${isActive(item.path) ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'}`}>
                    {iconMap[item.label] || <ChevronRight className="w-4 h-4" />}
                  </span>
                  <span className="text-sm font-semibold">{item.label}</span>
                </div>
                {isActive(item.path) && (
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
                )}
              </Link>
            ))}
          </nav>
        </div>

        {/* Footer / Logout */}
        <div className="p-6 mt-auto border-t border-slate-50 space-y-4">
          <div className="flex items-center gap-2 px-4 py-2 opacity-50">
             <ShieldCheck className="w-4 h-4 text-slate-400" />
             <span className="text-[10px] font-bold text-slate-400 uppercase">Secure Session</span>
          </div>
          
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3.5 text-rose-600 font-bold text-sm bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors group"
          >
            <LogOut className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
      `}} />
    </>
  );
}
