import React, { useState, useRef } from "react";
import { 
  User, 
  Mail, 
  ShieldCheck, 
  Key, 
  Edit3, 
  Camera, 
  CheckCircle2, 
  X, 
  BookOpen,
  Lock,
  ArrowRight
} from "lucide-react";

import { useStore } from '../../context/useStore';
import useUsers from "../../hooks/useUsers";

// ---------- ENHANCED MODAL COMPONENT ----------
function Modal({ title, icon: Icon, children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md relative z-10 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="h-2 w-full bg-gradient-to-r from-indigo-600 via-emerald-500 to-teal-500" />
        <div className="p-8 md:p-10">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-50 rounded-lg">
                <Icon className="w-5 h-5 text-indigo-600" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">{title}</h2>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400">
              <X className="w-5 h-5" />
            </button>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}

export default function Profile() {
  const { user } = useStore();

    const { updateUser, formData, setFormData , PasswordFormData, setPasswordFormData, updateUserPassword,} = useUsers();
  
  // State for modals
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isPassOpen, setIsPassOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const [errorPasswordMessage, setErrorPasswordMessage] = useState("");
  const [successPasswordMessage, setSuccessPasswordMessage] = useState("");
  const [successUpdateMessage, setSuccessUpdateMessage] = useState("");

  const [selectedUserId, setSelectedUserId] = useState(null);

  // Profile Image State
  const [imagePreview, setImagePreview] = useState(user?.image);



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


  //update
  const onSubmitUpdateGeneralInfo = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setErrorMessage("");
      setSuccessUpdateMessage("");
      const res = await updateUser(selectedUserId);

      if(res?.success){
        setSuccessUpdateMessage('General info updated successfully');
        setIsEditOpen(false);
      }else{
        setErrorMessage(res?.message || "Error updating info");
      }

    } catch (err) {
      setErrorMessage(err?.message || "update failed!");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setErrorPasswordMessage("");
      setSuccessPasswordMessage("");
      const res = await updateUserPassword(selectedUserId);

      if(res?.success){
        setSuccessPasswordMessage('password changed successfully');
        setIsEditOpen(false);
      }else{
        setErrorPasswordMessage(res?.message || "Error updating category");
      }

    } catch (err) {
      setErrorPasswordMessage(err?.message || "update failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6 md:p-12 font-sans relative overflow-hidden">
      
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

      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="px-3 py-1 bg-indigo-50 text-indigo-700 text-[10px] font-bold uppercase tracking-widest rounded-full border border-indigo-100">
              System Registry
            </div>
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">
            {user?.role === "superAdmin" ? "Chief Administrator" : "Account Profile"}
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 p-8 text-center relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-24 bg-slate-900 -z-0" />
              
              {/* Profile Image Section */}
              <div className="relative mt-4 mb-6 flex justify-center">
                <div className="w-32 h-32 bg-white p-1 rounded-full border-4 border-white shadow-xl relative z-10 overflow-hidden">
                  <div className="w-full h-full bg-indigo-600 rounded-full flex items-center justify-center text-white text-4xl font-black overflow-hidden">
                    {imagePreview ? (
                      <img 
                        src={imagePreview} 
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
                    onChange={handleImageChange}
                  />
                </label>
              </div>

              <h2 className="text-xl font-bold text-slate-900 mb-1">{user?.name}</h2>
              <p className="text-sm font-medium text-slate-400 mb-6">{user?.email}</p>
              
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-2xl border border-slate-100">
                <ShieldCheck className="w-4 h-4 text-indigo-600" />
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  {user.oneTime === false ? `Verified ${user.role}` : user.role}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Information & Settings */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* General Info Box */}
            <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 p-8 md:p-10">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-3">
                  <User className="text-indigo-600 w-5 h-5" />
                  General Information
                </h3>
                <button 
                   onClick={() => {
                            setSelectedUserId(user.id);
                            setFormData({
                              name: user.name,
                              email: user.email
                            });
                            setIsEditOpen(true);
                          }}
                  className="p-3 bg-slate-50 hover:bg-indigo-50 text-slate-400 hover:text-indigo-600 rounded-2xl transition-all"
                >
                  <Edit3 className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">User Name</p>
                  <p className="px-5 py-4 bg-slate-50 rounded-2xl text-slate-900 font-semibold border border-transparent">
                    {user?.name}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Account Role</p>
                  <p className="px-5 py-4 bg-slate-50 rounded-2xl text-slate-900 font-semibold border border-transparent capitalize">
                    {user?.role}
                  </p>
                </div>
                <div className="md:col-span-2 space-y-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Official Email</p>
                  <p className="px-5 py-4 bg-slate-50 rounded-2xl text-slate-900 font-semibold border border-transparent">
                    {user?.email}
                  </p>
                </div>
              </div>
            </div>

            {/* Security Settings Box */}
            <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 bg-rose-50 rounded-2xl flex items-center justify-center">
                  <Lock className="text-rose-600 w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Account Security</h3>
                  <p className="text-sm text-slate-500 font-medium">Update your access key and password.</p>
                </div>
              </div>
              <button 
                 onClick={() => {
                            setSelectedUserId(user.id);
                            setIsPassOpen(true);
                          }}
                className="w-full md:w-auto px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-3"
              >
                <span>Change Password</span>
                <Key className="w-4 h-4 text-emerald-400" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* EDIT PROFILE MODAL */}
      {isEditOpen && (
        <Modal title="Edit Profile Details" icon={Edit3} onClose={() => setIsEditOpen(false)}>
          <form onSubmit={onSubmitUpdateGeneralInfo} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Display Name</label>
              <div className="relative">
                <User className="absolute left-4 top-3.5 w-5 h-5 text-slate-300" />
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-100 outline-none font-medium" 
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 w-5 h-5 text-slate-300" />
                <input 
                  type="email" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-100 outline-none font-medium" 
                />
              </div>
            </div>
             {errorMessage && (
              <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm font-medium">
                {errorMessage}
              </div>
            )}
             {successUpdateMessage && (
              <div className="px-4 py-3 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm font-medium">
                {successUpdateMessage}
              </div>
            )}
            <button className="w-full py-4 bg-indigo-600 text-white font-bold rounded-2xl flex items-center justify-center gap-3 shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all">
              {loading ? "Saving Changes..." : "Save Information"}
              {!loading && <CheckCircle2 className="w-5 h-5" />}
            </button>
          </form>
        </Modal>
      )}

      {/* PASSWORD MODAL */}
      {isPassOpen && (
        <Modal title="Update Password" icon={Key} onClose={() => setIsPassOpen(false)}>
          <form onSubmit={handleUpdatePassword} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Current Password</label>
              <input 
                type="password" 
                value={PasswordFormData.currentPassword}
                onChange={(e) => setPasswordFormData({...PasswordFormData, currentPassword: e.target.value})}
                placeholder="••••••••"
                className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-rose-50 outline-none" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">New Password</label>
              <input 
                type="password" 
                value={PasswordFormData.newPassword}
                onChange={(e) => setPasswordFormData({...PasswordFormData, newPassword: e.target.value})}
                placeholder="At least 8 characters"
                className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-emerald-50 outline-none" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Confirm Password</label>
              <input 
                type="password" 
                value={PasswordFormData.confirmPassword}
                onChange={(e) => setPasswordFormData({...PasswordFormData, confirmPassword: e.target.value})}
                placeholder="••••••••"
                className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-emerald-50 outline-none" 
              />
            </div>
            {errorPasswordMessage && (
              <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm font-medium">
                {errorPasswordMessage}
              </div>
            )}
            {successPasswordMessage && (
              <div className="px-4 py-3 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm font-medium">
                {successPasswordMessage}
              </div>
            )}
            <button className="w-full py-4 bg-slate-900 text-white font-bold rounded-2xl flex items-center justify-center gap-3 shadow-xl hover:bg-slate-800 transition-all">
              {loading ? "Updating Security..." : "Reset Password"}
              {!loading && <ArrowRight className="w-5 h-5 text-emerald-400" />}
            </button>
          </form>
        </Modal>
      )}

    </div>
  );
}