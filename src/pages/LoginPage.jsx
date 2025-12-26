import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff, LogIn, BookOpen, AlertCircle, CheckCircle2 } from "lucide-react";


import { loginApi } from "../api/authApi";
import { useStore } from "../context/useStore";
import { useNavigate, Link } from "react-router-dom";
 

export default function LoginPage() {
  const { setUser } = useStore();
  const navigate = useNavigate();

  // State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Handle Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const res = await loginApi(
        { email, password }
      );

      const user = res.data.user;
      setUser(user);

      // First-time login logic
      if (user.oneTime === true) {
        setMessage({
          type: "success",
          text: "First-time login: Password update required.",
        });
        setTimeout(() => navigate("/reset-password"), 1200);
        return;
      }

      // Redirect by role
      if (user.role === "superAdmin") navigate("/super-admin");
      else if (user.role === "admin") navigate("/admin");
      else navigate("/dashboard");

    } catch (err) {
      setMessage({
        type: "error",
        text: err?.response?.data?.message || "Invalid credentials. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] p-6 font-sans relative overflow-hidden">
      
      {/* Background */}
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

      <div className="w-full max-w-lg">
        <div className="bg-white rounded-[2rem] shadow-2xl shadow-slate-200/60 border border-slate-100 overflow-hidden relative">
          <div className="h-2 w-full bg-gradient-to-r from-indigo-600 via-emerald-500 to-teal-500"></div>

          <div className="p-8 md:p-12">
            
            {/* Header */}
            <div className="flex flex-col items-center mb-10">
              <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center shadow-xl mb-6 group transition-transform hover:scale-105">
                <BookOpen className="text-emerald-400 w-8 h-8" />
              </div>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Library Portal</h1>
              <p className="text-slate-500 text-center mt-2 font-medium">
                Sign in to manage your collection and resources.
              </p>
            </div>

            {/* Notification Messages */}
            {message.text && (
              <div className={`mb-8 p-4 rounded-2xl border flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300 ${
                message.type === "success" 
                  ? "bg-emerald-50 border-emerald-100 text-emerald-800" 
                  : "bg-rose-50 border-rose-100 text-rose-800 animate-shake"
              }`}>
                {message.type === "success" ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                )}
                <p className="text-sm font-semibold">{message.text}</p>
              </div>
            )}

            <form className="space-y-6" onSubmit={handleLogin}>
              
              {/* Email Input */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Email</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                  </div>
                  <input
                    required
                    type="email"
                    placeholder="librarian@institution.edu"
                    className="block w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 text-slate-900 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-600 focus:bg-white outline-none transition-all placeholder:text-slate-400 font-medium"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-sm font-bold text-slate-700">Password</label>
                 
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-emerald-600 transition-colors" />
                  </div>
                  <input
                    required
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="block w-full pl-11 pr-12 py-3.5 bg-slate-50 border border-slate-200 text-slate-900 rounded-xl focus:ring-4 focus:ring-emerald-100 focus:border-emerald-600 focus:bg-white outline-none transition-all placeholder:text-slate-400"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>

                <Link
                  to="/forgot-password"
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-500 transition-colors"
                >
                  Forgot Password?
                </Link>
              </div>

              {/* Submit Button */}
              <button
                disabled={loading}
                className="relative w-full group overflow-hidden py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl shadow-xl shadow-slate-200 transition-all active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed mt-2"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-emerald-400" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Verifying Credentials...</span>
                  </div>
                ) : (
                  <>
                    <span>Enter Library Vault</span>
                    <LogIn className="w-5 h-5 text-emerald-400 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

          </div>
        </div>

        <p className="mt-8 text-center text-slate-400 text-xs font-semibold uppercase tracking-[0.2em]">
          Library Management System &copy; 2025
        </p>
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