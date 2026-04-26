import { useState } from "react";
import { PageTransition } from "../components/PageTransition";
import { Bell, Key, Shield, ShieldCheck, CreditCard, LayoutDashboard, Smartphone, UserX, AlertTriangle, ExternalLink, X } from "lucide-react";
import { toast } from "sonner";
import { useAppStore } from "../store/useAppStore";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";

export function Settings() {
  const navigate = useNavigate();
  const { emailNotifications, setEmailNotifications, profileVisibility, setProfileVisibility, theme, toggleTheme, twoFactorEnabled, setTwoFactorEnabled, deleteAccount } = useAppStore();
  const [activeTab, setActiveTab] = useState("general");

  // Modal States
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmittingPassword, setIsSubmittingPassword] = useState(false);

  const [is2FAModalOpen, setIs2FAModalOpen] = useState(false);
  const [isSubmitting2FA, setIsSubmitting2FA] = useState(false);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    setIsSubmittingPassword(true);
    setTimeout(() => {
      toast.success("Password changed successfully");
      setIsSubmittingPassword(false);
      setIsPasswordModalOpen(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }, 1000);
  };

  const handleToggle2FA = () => {
    setIsSubmitting2FA(true);
    setTimeout(() => {
      const newState = !twoFactorEnabled;
      setTwoFactorEnabled(newState);
      toast.success(newState ? "Two-Factor Authentication enabled" : "Two-Factor Authentication disabled");
      setIsSubmitting2FA(false);
      setIs2FAModalOpen(false);
    }, 1000);
  };

  const handleDeleteAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (deleteConfirmation !== "DELETE") {
      toast.error("Please type DELETE to confirm");
      return;
    }
    setIsDeleting(true);
    setTimeout(() => {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
      toast.success("Account deleted successfully");
      deleteAccount();
      navigate("/login");
    }, 1500);
  };

  const TABS = [
    { id: "general", label: "General", icon: LayoutDashboard },
    { id: "security", label: "Security & Login", icon: Key },
    { id: "notifications", label: "Notifications", icon: Bell },
  ];

  return (
    <PageTransition>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-200 dark:border-gray-700/60 pb-6 px-1">
          <div>
            <h1 className="text-3xl font-bold font-serif tracking-tight text-gray-900 dark:text-gray-100">Account Settings</h1>
            <p className="mt-2 text-[15px] text-gray-500 dark:text-gray-400 font-medium">Manage your preferences, security, and billing details.</p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-64 flex-shrink-0 space-y-1.5">
            {TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    isActive 
                      ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400" 
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-gray-200"
                  }`}
                >
                  <Icon className={`h-5 w-5 ${isActive ? "text-emerald-600 dark:text-emerald-400" : "text-gray-400 dark:text-gray-500"}`} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="flex-1 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700/60 shadow-sm shadow-gray-200/50 dark:shadow-none overflow-hidden">
            {activeTab === "general" && (
              <div className="p-8 space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Appearance</h3>
                  <div className="flex items-center justify-between py-4 border-b border-gray-100 dark:border-gray-700/50">
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">Dark Mode</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Switch between light and dark themes</p>
                    </div>
                    <button 
                      onClick={toggleTheme}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${theme === 'dark' ? 'bg-emerald-600' : 'bg-gray-200 dark:bg-gray-700'}`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${theme === 'dark' ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Privacy</h3>
                  <div className="flex items-center justify-between py-4 border-b border-gray-100 dark:border-gray-700/50">
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">Public Profile</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Allow anyone to view your certificates</p>
                    </div>
                    <button 
                      onClick={() => setProfileVisibility(!profileVisibility)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${profileVisibility ? 'bg-emerald-600' : 'bg-gray-200 dark:bg-gray-700'}`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${profileVisibility ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between py-4">
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">Analytics Data</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Share usage data to improve app experience</p>
                    </div>
                    <button 
                      className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors bg-emerald-600"
                    >
                      <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "security" && (
              <div className="p-8 space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Password & Authentication</h3>
                  <div className="space-y-4">
                    <button 
                      onClick={() => setIsPasswordModalOpen(true)}
                      className="w-full flex items-center justify-between rounded-xl border border-gray-200 dark:border-gray-700 p-4 transition-all hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:border-gray-300 dark:hover:border-gray-600 text-left"
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                           <Key className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                        </div>
                        <div>
                           <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">Change Password</p>
                           <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Updated 2 months ago</p>
                        </div>
                      </div>
                      <span className="text-gray-400">&rarr;</span>
                    </button>
                    
                    <button 
                      onClick={() => setIs2FAModalOpen(true)}
                      className="w-full flex items-center justify-between rounded-xl border border-gray-200 dark:border-gray-700 p-4 transition-all hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:border-gray-300 dark:hover:border-gray-600 text-left"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-lg ${twoFactorEnabled ? 'bg-emerald-50 dark:bg-emerald-500/10' : 'bg-gray-100 dark:bg-gray-800'}`}>
                           {twoFactorEnabled ? (
                             <ShieldCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                           ) : (
                             <Shield className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                           )}
                        </div>
                        <div>
                           <div className="flex items-center gap-2">
                             <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">Two-Factor Authentication</p>
                             {twoFactorEnabled && <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 text-[10px] uppercase tracking-wider font-bold rounded-md">Enabled</span>}
                           </div>
                           <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{twoFactorEnabled ? 'Authenticator app configured' : 'Not configured'}</p>
                        </div>
                      </div>
                      <span className="text-gray-400">&rarr;</span>
                    </button>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-100 dark:border-gray-700/50">
                  <h3 className="text-lg font-bold text-red-600 mb-4 flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" /> Danger Zone
                  </h3>
                  <div className="rounded-xl border border-red-200 dark:border-red-900/30 bg-red-50/50 dark:bg-red-900/10 p-5">
                    <p className="text-sm text-red-800 dark:text-red-300 font-medium mb-4">Once you delete your account, there is no going back. Please be certain.</p>
                    <button 
                      onClick={() => setIsDeleteModalOpen(true)}
                      className="rounded-lg bg-red-600 px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 flex items-center gap-2"
                    >
                      <UserX className="h-4 w-4" /> Delete Account
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "notifications" && (
              <div className="p-8 space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Email Notifications</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700/50">
                      <div>
                        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">Learning Reminders</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Email me when I haven't studied for 3 days</p>
                      </div>
                      <button 
                        onClick={() => setEmailNotifications(!emailNotifications)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${emailNotifications ? 'bg-emerald-600' : 'bg-gray-200 dark:bg-gray-700'}`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${emailNotifications ? 'translate-x-6' : 'translate-x-1'}`} />
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700/50">
                      <div>
                        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">Weekly Progress Report</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Send a summary of my weekly activity</p>
                      </div>
                      <button 
                        className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors bg-emerald-600"
                      >
                        <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between py-2">
                      <div>
                        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">New Modules Available</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Notify me when new content is added</p>
                      </div>
                      <button 
                        className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors bg-gray-200 dark:bg-gray-700"
                      >
                        <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-1" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      <AnimatePresence>
        {isPasswordModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 dark:bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white dark:bg-gray-800 rounded-3xl p-6 w-full max-w-md shadow-2xl relative"
            >
              <button 
                onClick={() => setIsPasswordModalOpen(false)}
                className="absolute right-5 top-5 p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
              
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6 font-serif">Change Password</h2>
              
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 ml-1">Current Password</label>
                  <input 
                    type="password" 
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 px-4 py-3 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all font-medium"
                    placeholder="••••••••"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 ml-1">New Password</label>
                  <input 
                    type="password" 
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 px-4 py-3 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all font-medium"
                    placeholder="••••••••"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 ml-1">Confirm New Password</label>
                  <input 
                    type="password" 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 px-4 py-3 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all font-medium"
                    placeholder="••••••••"
                  />
                </div>
                
                <button 
                  type="submit"
                  disabled={isSubmittingPassword}
                  className="w-full mt-4 rounded-xl bg-emerald-600 dark:bg-emerald-500 py-3 text-sm font-bold text-white shadow-md shadow-emerald-500/30 transition-all hover:bg-emerald-700 dark:hover:bg-emerald-600 hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center h-12"
                >
                  {isSubmittingPassword ? (
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  ) : (
                    "Update Password"
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        )}

        {/* 2FA Modal */}
        {is2FAModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 dark:bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white dark:bg-gray-800 rounded-3xl p-6 w-full max-w-md shadow-2xl relative text-center"
            >
              <button 
                onClick={() => setIs2FAModalOpen(false)}
                className="absolute right-5 top-5 p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
              
              <div className="mx-auto w-16 h-16 bg-emerald-100 dark:bg-emerald-900/40 rounded-full flex items-center justify-center mb-6">
                <ShieldCheck className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
              </div>
              
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2 font-serif">
                {twoFactorEnabled ? "Disable Two-Factor Authentication" : "Enable Two-Factor Authentication"}
              </h2>
              
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-8 mx-4">
                {twoFactorEnabled 
                  ? "Are you sure you want to disable 2FA? This will reduce your account security." 
                  : "Protect your account with an extra layer of security. Once configured, you'll be required to enter both your password and an authentication code from your mobile app in order to sign in."}
              </p>
              
              <button 
                onClick={handleToggle2FA}
                disabled={isSubmitting2FA}
                className={`w-full rounded-xl py-3 text-sm font-bold text-white shadow-md transition-all hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center h-12 ${
                  twoFactorEnabled 
                    ? "bg-red-600 hover:bg-red-700 shadow-red-500/30" 
                    : "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/30 dark:bg-emerald-500 dark:hover:bg-emerald-600"
                }`}
              >
                {isSubmitting2FA ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                ) : (
                  twoFactorEnabled ? "Disable 2FA" : "Enable 2FA"
                )}
              </button>
            </motion.div>
          </div>
        )}

        {/* Delete Account Modal */}
        {isDeleteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 dark:bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white dark:bg-gray-800 rounded-3xl p-6 w-full max-w-md shadow-2xl relative"
            >
              <button 
                onClick={() => setIsDeleteModalOpen(false)}
                className="absolute right-5 top-5 p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
              
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-red-100 dark:bg-red-900/40 rounded-full flex items-center justify-center">
                  <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 font-serif">Delete Account</h2>
              </div>
              
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                You are about to permanently delete your account. This action cannot be undone and will immediately remove:
              </p>
              
              <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400 mb-6 space-y-1">
                <li>Your profile and settings</li>
                <li>All completed modules and quiz progress</li>
                <li>Your earned certificates</li>
              </ul>
              
              <form onSubmit={handleDeleteAccount}>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  To confirm, type <span className="font-bold text-black dark:text-white select-all">DELETE</span> below
                </label>
                <input 
                  type="text" 
                  value={deleteConfirmation}
                  onChange={(e) => setDeleteConfirmation(e.target.value)}
                  className="w-full rounded-xl border border-red-200 dark:border-red-900/50 bg-white dark:bg-gray-900 px-4 py-3 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 mb-6 font-mono font-bold tracking-widest text-center"
                  placeholder="DELETE"
                  required
                />
                
                <div className="flex gap-3">
                  <button 
                    type="button"
                    onClick={() => setIsDeleteModalOpen(false)}
                    className="flex-1 rounded-xl bg-gray-100 dark:bg-gray-800 py-3 text-sm font-bold text-gray-900 dark:text-gray-100 transition-all hover:bg-gray-200 dark:hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={isDeleting || deleteConfirmation !== "DELETE"}
                    className="flex-1 rounded-xl bg-red-600 py-3 text-sm font-bold text-white shadow-md shadow-red-500/30 transition-all hover:bg-red-700 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
                  >
                    {isDeleting ? (
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    ) : (
                      "Delete Account"
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </PageTransition>
  );
}
