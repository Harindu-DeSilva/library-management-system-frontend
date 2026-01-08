import React, { useState } from "react";
import { 
  Shield, 
  Users, 
  Library, 
  FileDown, 
  Zap, 
  Bell, 
  BookOpen, 
  ArrowRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet
} from "lucide-react";
import useUsers from "../../hooks/useUsers";
import useLibraries from "../../hooks/useLibraries";
import { useStore } from "../../context/useStore";
import { downloadLendRecordsApi } from "../../api/lendApi";

export default function SuperAdminHome() {
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState(null);
  
  const { user } = useStore();
  const { superAdminCount, adminCount, userCount } = useUsers();
  // -------- FETCH LIBRARIES --------
  const { totalLibraries} = useLibraries();

  const handleDownload = async () => {
  try {
    setError(null);
    setDownloading(true);

    const res = await downloadLendRecordsApi();

    const url = window.URL.createObjectURL(new Blob([res.data]));

    const a = document.createElement("a");
    a.href = url;
    a.download = "LendRecords.xlsx";
    document.body.appendChild(a);
    a.click();
    a.remove();

    window.URL.revokeObjectURL(url);

  } catch (err) {
    console.error("DOWNLOAD ERROR:", err);

    if (err.response) {
      console.error("Status:", err.response.status);
      console.error("Backend says:", err.response.data);
    }

    setError("Download failed. Please try again.");
  }finally {
    setDownloading(false);
  }
};


  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6 md:p-10 font-sans relative overflow-hidden">
      
      {/* Background Decorative Grid */}
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none -z-10 text-slate-900">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Personalized Welcome Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="animate-in fade-in slide-in-from-left-4 duration-500">
            <div className="flex items-center gap-2 mb-2">
              <div className="px-3 py-1 bg-indigo-50 text-indigo-700 text-[10px] font-bold uppercase tracking-widest rounded-full border border-indigo-100 flex items-center gap-1.5">
                <div className="w-1 h-1 rounded-full bg-indigo-500 animate-ping" />
                System Active
              </div>
              <span className="text-slate-300">|</span>
              <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" /> {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long' })}
              </span>
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">
              {getGreeting()}, <span className="text-indigo-600">{user.name.split(' ')[1]}</span>
            </h1>
            <p className="text-slate-500 mt-2 font-medium">
              Manage library operations & monitor global lending activity from your command center.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-3 bg-white border border-slate-200 text-slate-400 hover:text-indigo-600 rounded-2xl shadow-sm hover:shadow-md transition-all">
              <Bell className="w-6 h-6" />
            </button>
            <div className="h-10 w-px bg-slate-200 mx-2 hidden md:block" />
            <div className="text-right hidden md:block">
              <p className="text-sm font-bold text-slate-900 leading-none mb-1">Access Level</p>
              <p className="text-xs text-indigo-600 font-bold uppercase tracking-widest">{user.role}</p>
            </div>
          </div>
        </header>

        {/* Quick Stats Grid */}
        {user.role === "superAdmin" && (
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
            {[
              { 
                label: 'Super Administrators', 
                value: superAdminCount, 
                icon: <Shield className="text-fuchsia-600" />, 
                bg: 'bg-fuchsia-50', 
                border: 'border-fuchsia-100',
              },
              { 
                label: 'Library Managers', 
                value: adminCount, 
                icon: <Library className="text-emerald-600" />, 
                bg: 'bg-emerald-50', 
                border: 'border-emerald-100',
                trend: `accross total ${totalLibraries} branches`
              },
              { 
                label: 'Enrolled Members', 
                value: userCount, 
                icon: <Users className="text-blue-600" />, 
                bg: 'bg-blue-50', 
                border: 'border-blue-100',
                trend: `accross total ${totalLibraries} branches`                                           
              },
            ].map((stat, i) => (
              <div key={i} className={`bg-white p-8 rounded-[2.5rem] border ${stat.border} shadow-xl shadow-slate-200/40 relative overflow-hidden group hover:scale-[1.02] transition-transform`}>
                <div className="flex items-center justify-between relative z-10">
                  <div className={`${stat.bg} w-16 h-16 rounded-2xl flex items-center justify-center shadow-inner`}>
                    {React.cloneElement(stat.icon, { className: 'w-8 h-8' })}
                  </div>
                  <div className="text-right">
                    <div className="flex items-center justify-end gap-1 text-emerald-600 font-bold text-[10px] uppercase tracking-wider mb-1">
                      <TrendingUp className="w-3 h-3" /> {stat.trend}
                    </div>
                    <p className="text-4xl font-black text-slate-900 leading-none">{stat.value}</p>
                  </div>
                </div>
                <div className="mt-6 flex items-center justify-between">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
                  <ArrowRight className="w-4 h-4 text-slate-200 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            ))}
          </section>
        )}

        {/* Dashboard Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Quick Actions & Health */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/40 border border-slate-100 p-8 md:p-10">
              <h3 className="text-xl font-bold text-slate-900 mb-8 flex items-center gap-3">
                <Zap className="text-amber-500 w-6 h-6" />
                Quick Operations
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { label: 'Register User', desc: 'Add new students or faculty', icon: <Users />, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                  { label: 'Inventory Audit', desc: 'Verify book counts & condition', icon: <BookOpen />, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                  { label: 'Branch Settings', desc: 'Configure library locations', icon: <Library />, color: 'text-amber-600', bg: 'bg-amber-50' },
                  { label: 'Security Logs', desc: 'Review system access history', icon: <Shield />, color: 'text-rose-600', bg: 'bg-rose-50' },
                ].map((action, i) => (
                  <button key={i} className="flex items-center gap-5 p-5 rounded-2xl bg-slate-50 border border-transparent hover:border-slate-200 hover:bg-white hover:shadow-lg transition-all text-left group">
                    <div className={`${action.bg} ${action.color} p-3.5 rounded-xl group-hover:scale-110 transition-transform`}>
                      {React.cloneElement(action.icon, { className: 'w-6 h-6' })}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{action.label}</p>
                      <p className="text-xs text-slate-400 font-medium">{action.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* System Status Banner */}
            <div className="bg-slate-900 rounded-[2.5rem] p-8 md:p-10 text-white flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[100px]" />
               <div className="flex items-center gap-6 relative z-10">
                 <div className="w-16 h-16 bg-white/10 rounded-2xl backdrop-blur-md flex items-center justify-center">
                   <CheckCircle2 className="text-emerald-400 w-8 h-8" />
                 </div>
                 <div>
                   <h4 className="text-xl font-bold">System Status: Optimal</h4>
                   <p className="text-slate-400 text-sm">All library database syncs completed successfully.</p>
                 </div>
               </div>
               <button className="px-8 py-3.5 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-bold transition-all shadow-xl shadow-indigo-500/20 whitespace-nowrap">
                 View Server Logs
               </button>
            </div>
          </div>

          {/* Right Column: Analytics Export Tool */}
          {user.role === "admin" && (
            <div className="lg:col-span-1">
              <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/40 border border-slate-100 p-8 flex flex-col h-full sticky top-8">
                <div className="mb-8">
                  <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6">
                    <FileSpreadsheet className="text-indigo-600 w-7 h-7" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Data Intelligence</h3>
                  <p className="text-slate-500 text-sm mt-2 font-medium">
                    Generate comprehensive Excel reports for external audits or monthly reporting.
                  </p>
                </div>

                <div className="space-y-4 mb-10">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">All lending logs included</span>
                  </div>
                </div>

                {error && (
                  <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3 animate-shake">
                    <AlertCircle className="w-5 h-5 text-rose-500" />
                    <p className="text-xs text-rose-800 font-bold">{error}</p>
                  </div>
                )}

                <button
                  onClick={handleDownload}
                  disabled={downloading}
                  className={`mt-auto w-full py-5 rounded-3xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 shadow-2xl transition-all active:scale-[0.98] ${
                    downloading 
                    ? "bg-slate-100 text-slate-400" 
                    : "bg-indigo-600 text-white shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-1"
                  }`}
                >
                  {downloading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-slate-300 border-t-indigo-600 rounded-full animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <FileDown className="w-5 h-5" />
                      Export Global Data
                    </>
                  )}
                </button>
                
                <p className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-6">
                  LMS Report Generator v4.2
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
        .animate-shake {
          animation: shake 0.4s ease-in-out;
        }
      `}} />
    </div>
  );
}