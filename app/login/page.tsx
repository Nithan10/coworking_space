"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, Variants } from "framer-motion";

// --- Animation Variants ---
const pageTransitionEase = [0.22, 1, 0.36, 1] as const;

const formVariants: Variants = {
  hidden: { opacity: 0, x: -20, filter: "blur(4px)" },
  show: { opacity: 1, x: 0, filter: "blur(0px)", transition: { duration: 0.4, ease: "easeOut" } },
  exit: { opacity: 0, x: 20, filter: "blur(4px)", transition: { duration: 0.3, ease: "easeIn" } }
};

// Helper to determine API URL based on environment
const getApiUrl = () => {
  if (typeof window !== "undefined" && window.location.hostname === "localhost") {
    return "http://localhost:5000"; // Local backend
  }
  return "https://coworking-space-backend.onrender.com"; // Production backend
};

export default function AuthPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [focusedField, setFocusedField] = useState<string | null>(null);
  
  // --- Form State (PRE-FILLED FOR DEV) ---
  const [formData, setFormData] = useState({ 
    name: "", 
    email: "admin@spacehub.com", 
    password: "admin123" 
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  // Handle Input Changes with strict TypeScript types
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id.split('-')[0]]: e.target.value });
    setError(""); // Clear error when typing
  };

  // Switch modes and clear form
  const toggleMode = (mode: "login" | "signup") => {
    setAuthMode(mode);
    if (mode === "login") {
      setFormData({ name: "", email: "admin@spacehub.com", password: "admin123" });
    } else {
      setFormData({ name: "", email: "", password: "" });
    }
    setError("");
  };

  // --- 1. Google Auth Handler ---
  // This redirect is correct. The mismatch error must be fixed in the Google Cloud Console.
  const handleGoogleLogin = () => {
    const baseUrl = getApiUrl();
    window.location.href = `${baseUrl}/api/auth/google`;
  };

  // --- 2. Manual Auth Handler ---
  const handleManualAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const baseUrl = getApiUrl();
    const endpoint = authMode === "login" ? "/api/auth/login" : "/api/auth/register";
    const url = `${baseUrl}${endpoint}`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        
        window.dispatchEvent(new Event("auth-change"));

        if (data.user.role === 'admin') {
          router.push("/admin"); 
        } else {
          router.push("/"); 
        }

      } else {
        setError(data.message || "Authentication failed. Please try again.");
      }
    } catch (err) {
      console.error("Auth error:", err);
      // Added a note about Render sleep time to the error
      setError("Cannot connect to server. If on Render free tier, please wait 60s and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.main 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: pageTransitionEase }}
      className="min-h-screen bg-white flex text-[#111827] selection:bg-indigo-600 selection:text-white"
    >
      {/* ================= LEFT COLUMN: BRAND & VISUALS ================= */}
      <div className="relative hidden lg:flex lg:w-1/2 bg-gray-900 overflow-hidden flex-col justify-between p-12 xl:p-16">
        
        <motion.img 
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.7 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=1600&auto=format&fit=crop" 
          alt="SpaceHub Workspace"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900/40 via-gray-900/20 to-gray-900/90" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />

        <div className="relative z-10 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 border-2 border-indigo-500 rounded-full flex items-center justify-center bg-indigo-500/20 overflow-hidden relative group-hover:bg-indigo-500/30 transition-colors backdrop-blur-md">
              <div className="absolute w-full h-[2px] bg-white transform rotate-45"></div>
            </div>
            <span className="font-bold text-2xl text-white tracking-tight">SpaceHub</span>
          </Link>
          
          <Link href="/" className="flex items-center gap-2 text-sm font-medium text-gray-300 hover:text-white transition-colors group">
            <svg className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="relative z-10 max-w-lg"
        >
          <div className="bg-white/10 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-8 shadow-2xl">
            <div className="flex gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-5 h-5 text-indigo-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <p className="text-xl text-white font-medium leading-relaxed mb-6">
              "Moving our headquarters to SpaceHub was the best decision for our team's productivity. The environment is absolutely world-class."
            </p>
            <div className="flex items-center gap-4">
              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop" alt="User" className="w-12 h-12 rounded-full border-2 border-white/20 object-cover" />
              <div>
                <h4 className="text-white font-bold text-sm">Marcus Chen</h4>
                <p className="text-indigo-300 text-xs font-medium">Founder, Nexus Tech</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ================= RIGHT COLUMN: AUTH FORM ================= */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative">
        
        <div className="absolute top-6 left-6 lg:hidden flex items-center justify-between w-[calc(100%-3rem)]">
          <Link href="/" className="w-8 h-8 border-2 border-indigo-600 rounded-full flex items-center justify-center bg-indigo-50 overflow-hidden relative">
            <div className="absolute w-full h-[2px] bg-indigo-600 transform rotate-45"></div>
          </Link>
          <Link href="/" className="text-sm font-medium text-gray-500 hover:text-gray-900">Cancel</Link>
        </div>

        <div className="w-full max-w-[420px]">
          
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-2">Welcome to SpaceHub</h2>
            <p className="text-gray-500 font-medium text-sm">Unlock premium workspaces globally.</p>
          </div>

          <div className="relative flex p-1 bg-gray-100 rounded-2xl mb-6 border border-gray-200 shadow-inner">
            <motion.div
              className="absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.08)] border border-gray-200/50"
              animate={{ left: authMode === "login" ? "4px" : "calc(50%)" }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
            
            <button
              onClick={() => toggleMode("login")}
              className={`relative z-10 w-1/2 py-2.5 text-sm font-bold transition-colors ${authMode === "login" ? "text-gray-900" : "text-gray-500 hover:text-gray-700"}`}
            >
              Sign In
            </button>
            <button
              onClick={() => toggleMode("signup")}
              className={`relative z-10 w-1/2 py-2.5 text-sm font-bold transition-colors ${authMode === "signup" ? "text-gray-900" : "text-gray-500 hover:text-gray-700"}`}
            >
              Create Account
            </button>
          </div>

          {/* Social Logins */}
          <div className="grid grid-cols-1 gap-4 mb-6">
            <button 
              onClick={handleGoogleLogin}
              type="button"
              className="flex items-center justify-center gap-3 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all font-semibold text-sm text-gray-700 group"
            >
              <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 15.02 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-gray-200"></div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Or continue with email</span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>

          {/* Error Message Display */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg text-center font-medium">
              {error}
            </div>
          )}

          {/* Form Container */}
          <div className="min-h-[280px]">
            <AnimatePresence mode="wait">
              {authMode === "login" ? (
                
                /* ================= SIGN IN FORM ================= */
                <motion.form key="login" variants={formVariants} initial="hidden" animate="show" exit="exit" className="space-y-4" onSubmit={handleManualAuth}>
                  
                  {/* Email */}
                  <div className={`relative rounded-xl border-2 transition-all duration-300 ${focusedField === 'email-login' ? 'border-indigo-600 bg-indigo-50/30' : 'border-gray-200 bg-white hover:border-gray-300'}`}>
                    <label htmlFor="email-login" className={`absolute left-4 transition-all duration-300 pointer-events-none font-bold ${focusedField === 'email-login' || formData.email.length > 0 ? 'text-[10px] top-2 text-indigo-600 uppercase tracking-widest' : 'text-sm top-3.5 text-gray-400'}`}>
                      Email Address
                    </label>
                    <input 
                      type="email" id="email-login" value={formData.email} onChange={handleChange}
                      onFocus={() => setFocusedField('email-login')} onBlur={() => setFocusedField(null)}
                      className="w-full px-4 pt-6 pb-2 bg-transparent outline-none text-gray-900 font-medium text-sm" required 
                    />
                  </div>

                  {/* Password */}
                  <div className="relative">
                    <div className={`relative rounded-xl border-2 transition-all duration-300 ${focusedField === 'password-login' ? 'border-indigo-600 bg-indigo-50/30' : 'border-gray-200 bg-white hover:border-gray-300'}`}>
                      <label htmlFor="password-login" className={`absolute left-4 transition-all duration-300 pointer-events-none font-bold ${focusedField === 'password-login' || formData.password.length > 0 ? 'text-[10px] top-2 text-indigo-600 uppercase tracking-widest' : 'text-sm top-3.5 text-gray-400'}`}>
                        Password
                      </label>
                      <input 
                        type="password" id="password-login" value={formData.password} onChange={handleChange}
                        onFocus={() => setFocusedField('password-login')} onBlur={() => setFocusedField(null)}
                        className="w-full px-4 pt-6 pb-2 bg-transparent outline-none text-gray-900 font-medium text-sm" required 
                      />
                    </div>
                    <div className="flex justify-end mt-2">
                      <a href="#" className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors">Forgot password?</a>
                    </div>
                  </div>

                  {/* Submit */}
                  <button type="submit" disabled={loading} className="relative w-full group overflow-hidden rounded-xl mt-2 disabled:opacity-70 disabled:cursor-not-allowed">
                    <div className="absolute inset-0 w-full h-full bg-gray-900 transition-all duration-500 group-hover:bg-indigo-600" />
                    <div className="relative flex items-center justify-center gap-2 py-3.5 px-6 text-white font-bold tracking-wide text-sm">
                      {loading ? 'Authenticating...' : 'Sign In to SpaceHub'}
                      {!loading && <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>}
                    </div>
                  </button>
                </motion.form>

              ) : (

                /* ================= SIGN UP FORM ================= */
                <motion.form key="signup" variants={formVariants} initial="hidden" animate="show" exit="exit" className="space-y-4" onSubmit={handleManualAuth}>
                  
                  {/* Full Name */}
                  <div className={`relative rounded-xl border-2 transition-all duration-300 ${focusedField === 'name-signup' ? 'border-indigo-600 bg-indigo-50/30' : 'border-gray-200 bg-white hover:border-gray-300'}`}>
                    <label htmlFor="name-signup" className={`absolute left-4 transition-all duration-300 pointer-events-none font-bold ${focusedField === 'name-signup' || formData.name.length > 0 ? 'text-[10px] top-2 text-indigo-600 uppercase tracking-widest' : 'text-sm top-3.5 text-gray-400'}`}>
                      Full Name
                    </label>
                    <input 
                      type="text" id="name-signup" value={formData.name} onChange={handleChange}
                      onFocus={() => setFocusedField('name-signup')} onBlur={() => setFocusedField(null)}
                      className="w-full px-4 pt-6 pb-2 bg-transparent outline-none text-gray-900 font-medium text-sm" required 
                    />
                  </div>

                  {/* Email */}
                  <div className={`relative rounded-xl border-2 transition-all duration-300 ${focusedField === 'email-signup' ? 'border-indigo-600 bg-indigo-50/30' : 'border-gray-200 bg-white hover:border-gray-300'}`}>
                    <label htmlFor="email-signup" className={`absolute left-4 transition-all duration-300 pointer-events-none font-bold ${focusedField === 'email-signup' || formData.email.length > 0 ? 'text-[10px] top-2 text-indigo-600 uppercase tracking-widest' : 'text-sm top-3.5 text-gray-400'}`}>
                      Email Address
                    </label>
                    <input 
                      type="email" id="email-signup" value={formData.email} onChange={handleChange}
                      onFocus={() => setFocusedField('email-signup')} onBlur={() => setFocusedField(null)}
                      className="w-full px-4 pt-6 pb-2 bg-transparent outline-none text-gray-900 font-medium text-sm" required 
                    />
                  </div>

                  {/* Password */}
                  <div className={`relative rounded-xl border-2 transition-all duration-300 ${focusedField === 'password-signup' ? 'border-indigo-600 bg-indigo-50/30' : 'border-gray-200 bg-white hover:border-gray-300'}`}>
                    <label htmlFor="password-signup" className={`absolute left-4 transition-all duration-300 pointer-events-none font-bold ${focusedField === 'password-signup' || formData.password.length > 0 ? 'text-[10px] top-2 text-indigo-600 uppercase tracking-widest' : 'text-sm top-3.5 text-gray-400'}`}>
                      Create Password
                    </label>
                    <input 
                      type="password" id="password-signup" value={formData.password} onChange={handleChange}
                      onFocus={() => setFocusedField('password-signup')} onBlur={() => setFocusedField(null)}
                      className="w-full px-4 pt-6 pb-2 bg-transparent outline-none text-gray-900 font-medium text-sm" required 
                    />
                  </div>

                  {/* Privacy Checkbox */}
                  <div className="flex items-start pt-1 pb-1">
                    <div className="relative flex items-center justify-center mt-0.5">
                      <input type="checkbox" id="terms" className="peer appearance-none w-4 h-4 border-2 border-gray-300 rounded focus:ring-indigo-600 checked:border-indigo-600 checked:bg-indigo-600 transition-all cursor-pointer" required />
                      <svg className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <label htmlFor="terms" className="ml-3 text-xs font-medium text-gray-500 cursor-pointer leading-tight">
                      I agree to the <a href="#" className="text-indigo-600 hover:underline">Terms of Service</a> and <a href="#" className="text-indigo-600 hover:underline">Privacy Policy</a>.
                    </label>
                  </div>

                  {/* Submit */}
                  <button type="submit" disabled={loading} className="relative w-full group overflow-hidden rounded-xl mt-2 disabled:opacity-70 disabled:cursor-not-allowed">
                    <div className="absolute inset-0 w-full h-full bg-indigo-600 transition-all duration-500 group-hover:bg-indigo-700" />
                    <div className="relative flex items-center justify-center gap-2 py-3.5 px-6 text-white font-bold tracking-wide text-sm">
                      {loading ? 'Creating Account...' : 'Create Account'}
                      {!loading && <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>}
                    </div>
                  </button>
                </motion.form>

              )}
            </AnimatePresence>
          </div>

        </div>
      </div>
    </motion.main>
  );
}