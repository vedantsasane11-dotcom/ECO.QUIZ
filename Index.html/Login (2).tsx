import { useState } from "react";
import { Leaf, ArrowLeft } from "lucide-react";
import { useAppStore } from "../store/useAppStore";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResetMode, setIsResetMode] = useState(false);
  const login = useAppStore(state => state.login);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter email and password");
      return;
    }
    
    setIsLoading(true);
    // Simulate network request
    setTimeout(() => {
      login(email);
      toast.success("Welcome back!");
      setIsLoading(false);
    }, 1000);
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email address to reset password");
      return;
    }
    
    setIsLoading(true);
    // Simulate network request
    setTimeout(() => {
      toast.success("Password reset instructions sent to your email!");
      setIsResetMode(false);
      setIsLoading(false);
      setPassword(""); // Clear password field if they were partially typing
    }, 1500);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F9FAFB] dark:bg-gray-900 px-4">
      <div className="absolute inset-x-0 top-0 h-96 bg-gradient-to-b from-emerald-100/40 dark:from-emerald-900/20 to-transparent pointer-events-none" />
      
      <div className="w-full max-w-md relative z-10 overflow-hidden">
      <AnimatePresence mode="wait">
        {!isResetMode ? (
        <motion.div 
          key="login"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-700/60 p-8"
        >
          <div className="flex justify-center mb-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-lg shadow-emerald-600/30">
              <Leaf className="h-7 w-7" />
            </div>
          </div>
          
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 font-serif">Welcome Back</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">Sign in to continue your learning journey</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 ml-1">Email</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 px-4 py-3 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all font-medium"
                placeholder="you@example.com"
              />
            </div>
            
            <div>
              <div className="flex items-center justify-between pl-1 pr-1 mb-1.5">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
                <button 
                  type="button" 
                  onClick={() => setIsResetMode(true)}
                  className="text-sm font-bold text-emerald-600 hover:text-emerald-700 dark:text-emerald-500 transition-colors"
                >
                  Forgot Password?
                </button>
              </div>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 px-4 py-3 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all font-medium"
                placeholder="••••••••"
              />
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 rounded-xl bg-emerald-600 py-3.5 text-sm font-bold text-white shadow-md shadow-emerald-500/30 transition-all hover:bg-emerald-700 hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex justify-center items-center h-12"
            >
              {isLoading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              ) : (
                "Sign In"
              )}
            </button>
          </form>
        </motion.div>
        ) : (
        <motion.div 
          key="reset"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-700/60 p-8"
        >
          <div className="flex mb-6">
            <button 
              onClick={() => setIsResetMode(false)}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-50 dark:bg-gray-900/50 text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:hover:text-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
          </div>
          
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 font-serif">Reset Password</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-3 px-4">Enter your email address and we'll send you instructions to reset your password.</p>
          </div>

          <form onSubmit={handleResetPassword} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 ml-1">Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 px-4 py-3 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all font-medium"
                placeholder="you@example.com"
              />
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 rounded-xl bg-gray-900 py-3.5 text-sm font-bold text-white shadow-md shadow-gray-900/20 transition-all hover:bg-gray-800 hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex justify-center items-center h-12"
            >
              {isLoading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              ) : (
                "Send Instructions"
              )}
            </button>
          </form>
        </motion.div>
        )}
      </AnimatePresence>
      </div>
    </div>
  );
}
