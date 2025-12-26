import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Lock, ShieldCheck, ArrowLeft, BookOpen, Eye, EyeOff, CheckCircle2, AlertCircle } from "lucide-react";
import { resetPasswordApi } from "../api/authApi";
import { useStore } from "../context/useStore";
import { useNavigate } from "react-router-dom";

export default function ResetPassword() {

  const { setUser } = useStore();
  const navigate = useNavigate();

  // API + logic states
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // UI-only states
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await resetPasswordApi({
        oldPassword,
        newPassword
      });

      const user = res.data.user;

      setUser(user);

      if (user.role === "superAdmin") navigate("/super-admin");
      else if(user.role === "admin") navigate("/admin");
      else navigate("/dashboard");

    } catch (err) {
      setErrorMsg(
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Reset failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] p-6 font-sans relative overflow-hidden">

      {/*  Background */}
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none -z-10">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="w-full max-w-lg">

        <button className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors mb-8 group">
          <Link 
            to="/" 
            className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors group"
          >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span className="text-sm font-medium">Back to Login Page</span>
          </Link>
        </button>

        <div className="bg-white rounded-[2rem] shadow-2xl border border-slate-100 overflow-hidden">

          <div className="h-2 w-full bg-gradient-to-r from-indigo-600 via-emerald-500 to-teal-500"></div>

          <div className="p-10">

            <div className="flex flex-col items-center mb-10">
              <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center shadow-xl mb-6">
                <BookOpen className="text-emerald-400 w-8 h-8" />
              </div>
              <h1 className="text-3xl font-bold">Update Credentials</h1>
              <p className="text-slate-500 text-center mt-2">
                Ensure your account stays secure with a strong password.
              </p>
            </div>

            {errorMsg && (
              <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-2xl flex gap-3 animate-shake">
                <AlertCircle className="w-5 h-5 text-rose-500" />
                <p className="text-sm text-rose-700 font-medium">{errorMsg}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Old Password */}
              <div>
                <label className="text-sm font-bold ml-1">Current Password</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <ShieldCheck className="h-5 w-5 text-slate-400" />
                  </div>

                  <input
                    type={showOld ? "text" : "password"}
                    className="block w-full pl-11 pr-12 py-3.5 bg-slate-50 border rounded-xl"
                    placeholder="Enter current password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    required
                  />

                  <button
                    type="button"
                    onClick={() => setShowOld(!showOld)}
                    className="absolute inset-y-0 right-0 pr-4 text-slate-400"
                  >
                    {showOld ? <EyeOff /> : <Eye />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="text-sm font-bold ml-1">New Password</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-400" />
                  </div>

                  <input
                    type={showNew ? "text" : "password"}
                    className="block w-full pl-11 pr-12 py-3.5 bg-slate-50 border rounded-xl"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />

                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute inset-y-0 right-0 pr-4 text-slate-400"
                  >
                    {showNew ? <EyeOff /> : <Eye />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold flex justify-center gap-2 disabled:opacity-70"
              >
                {loading ? "Updating..." : "Confirm Password Reset"}
                {!loading && <CheckCircle2 className="text-emerald-400" />}
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
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
        .animate-shake {
          animation: shake .3s;
        }
      `}} />
    </div>
  );
}
