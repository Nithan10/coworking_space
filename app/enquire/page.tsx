"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import Link from "next/link";

// --- Animation Variants ---
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
};

const backgroundOrbs: Variants = {
  animate: {
    scale: [1, 1.1, 1],
    opacity: [0.5, 0.7, 0.5],
    rotate: [0, 90, 0],
    transition: { duration: 20, repeat: Infinity, ease: "linear" },
  },
};

export default function EnquireNowPage() {
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "", lastName: "", email: "", company: "", phone: "+91 ", city: "", message: "",
  });

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const response = await fetch("https://coworking-space-backend.onrender.com/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus("success");
        setFormData({ firstName: "", lastName: "", email: "", company: "", phone: "+91 ", city: "", message: "" });
      } else {
        setStatus("error");
        alert("Server Error: " + data.message);
      }
    } catch (error) {
      console.error("Fetch failed:", error);
      setStatus("error");
      alert("Network Error: Could not reach backend. Is localhost:5000 running?");
    }
  };

  return (
    <main className="min-h-screen bg-[#F4F7FC] text-slate-900 overflow-hidden relative selection:bg-indigo-500/20">
      
      {/* Soft Ambient Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.div variants={backgroundOrbs} animate="animate" className="absolute -top-[10%] -left-[10%] w-[50vw] h-[50vw] rounded-full bg-indigo-200/40 blur-[100px]" />
        <motion.div variants={backgroundOrbs} animate="animate" transition={{ delay: 2, duration: 25 }} className="absolute top-[30%] -right-[10%] w-[45vw] h-[45vw] rounded-full bg-violet-200/40 blur-[120px]" />
      </div>

      {/* Navbar / Back Link */}
      <div className="relative z-50 w-full max-w-7xl mx-auto px-6 py-8">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors group">
          <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span className="text-sm font-bold tracking-wide uppercase">Return to Home</span>
        </Link>
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 pb-20 flex flex-col lg:flex-row items-stretch gap-8 lg:gap-10 min-h-[80vh]">
        
        {/* LEFT COLUMN: Editorial Image Card with Text Overlay */}
        <motion.div 
          initial="hidden" animate="show" variants={containerVariants}
          className="w-full lg:w-5/12 relative rounded-[2.5rem] overflow-hidden shadow-2xl shadow-slate-300/50 min-h-[500px] flex flex-col justify-end p-10 group"
        >
          {/* Background Image */}
          <img 
            src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=1200&auto=format&fit=crop" 
            alt="Modern Workspace" 
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-[20s] group-hover:scale-110"
          />
          {/* Gradients for Text Legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/30 to-transparent mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-indigo-900/10 mix-blend-overlay"></div>

          {/* Text Content over Image */}
          <div className="relative z-10">
            <motion.div variants={itemVariants} className="inline-block px-4 py-1.5 rounded-full border border-white/20 bg-white/10 backdrop-blur-md text-white text-sm font-semibold mb-6 shadow-sm">
              Let's Connect
            </motion.div>
            
            <motion.h1 variants={itemVariants} className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-4 text-white leading-[1.1]">
              Design your <br />
              <span className="text-indigo-300">
                future space.
              </span>
            </motion.h1>
            
            <motion.p variants={itemVariants} className="text-base text-slate-200 leading-relaxed max-w-sm">
              Whether you need a cutting-edge tech hub or a collaborative creative studio, our team brings your vision to life.
            </motion.p>
          </div>
        </motion.div>

        {/* RIGHT COLUMN: Highly Attractive Glassmorphic Form */}
        <div className="w-full lg:w-7/12 relative flex">
          <div className="w-full relative bg-white/90 backdrop-blur-2xl border border-white rounded-[2.5rem] p-8 md:p-12 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)]">
            <AnimatePresence mode="wait">
              {status === "success" ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex flex-col items-center justify-center text-center py-20 h-full"
                >
                  <div className="w-24 h-24 bg-gradient-to-tr from-indigo-500 to-violet-500 rounded-2xl rotate-3 flex items-center justify-center mb-8 shadow-xl shadow-indigo-200">
                    <div className="-rotate-3">
                      <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-3xl font-black mb-3 text-slate-900">Request Received</h3>
                  <p className="text-slate-500 mb-8 max-w-sm">
                    Our architecture team is reviewing your details. We'll be in touch within 24 hours.
                  </p>
                  <button
                    onClick={() => setStatus("idle")}
                    className="px-8 py-4 rounded-xl border-2 border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all font-semibold active:scale-95"
                  >
                    Submit another request
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="form"
                  variants={containerVariants}
                  initial="hidden"
                  animate="show"
                  exit={{ opacity: 0, y: -20 }}
                  className="h-full flex flex-col justify-center"
                >
                  <div className="mb-8">
                    <h2 className="text-3xl font-bold text-slate-900 mb-2">Consultation Details</h2>
                    <p className="text-slate-500 text-sm">Fill in the information below to get started.</p>
                  </div>

                  <form className="space-y-5" onSubmit={handleSubmit}>
                    
                    {/* Name Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <motion.div variants={itemVariants} className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <svg className="w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                        </div>
                        <input type="text" id="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} required className="pl-12 w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white transition-all font-medium" />
                      </motion.div>

                      <motion.div variants={itemVariants} className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <svg className="w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                        </div>
                        <input type="text" id="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} required className="pl-12 w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white transition-all font-medium" />
                      </motion.div>
                    </div>

                    {/* Email */}
                    <motion.div variants={itemVariants} className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <svg className="w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                      </div>
                      <input type="email" id="email" placeholder="Work Email Address" value={formData.email} onChange={handleChange} required className="pl-12 w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white transition-all font-medium" />
                    </motion.div>

                    {/* Company & Phone Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <motion.div variants={itemVariants} className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <svg className="w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                        </div>
                        <input type="text" id="company" placeholder="Company Name" value={formData.company} onChange={handleChange} required className="pl-12 w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white transition-all font-medium" />
                      </motion.div>
                      
                      <motion.div variants={itemVariants} className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <svg className="w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                        </div>
                        <input type="tel" id="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} required className="pl-12 w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white transition-all font-medium" />
                      </motion.div>
                    </div>

                    {/* City Select */}
                    <motion.div variants={itemVariants} className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                        <svg className="w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      </div>
                      <select id="city" value={formData.city} onChange={handleChange} required className="pl-12 w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-slate-900 appearance-none focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white transition-all cursor-pointer font-medium [&>option]:bg-white [&>option]:text-slate-900 relative">
                        <option value="" disabled className="text-slate-400">Select your base city</option>
                        <option value="bangalore">Bengaluru</option>
                        <option value="mumbai">Mumbai</option>
                        <option value="delhi">New Delhi</option>
                        <option value="other">Other</option>
                      </select>
                      <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-400">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                      </div>
                    </motion.div>

                    {/* Message Area */}
                    <motion.div variants={itemVariants}>
                      <textarea id="message" rows={3} placeholder="Briefly describe your project needs..." value={formData.message} onChange={handleChange} required className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-5 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white transition-all resize-none font-medium"></textarea>
                    </motion.div>

                    {/* Submit Button */}
                    <motion.div variants={itemVariants} className="pt-2">
                      <button type="submit" disabled={status === "loading"} className="w-full bg-gradient-to-r from-slate-900 to-slate-800 text-white font-bold rounded-2xl px-6 py-4 hover:shadow-[0_10px_20px_-10px_rgba(0,0,0,0.3)] hover:-translate-y-0.5 transition-all active:scale-[0.98] disabled:opacity-70 disabled:hover:translate-y-0 disabled:active:scale-100 flex items-center justify-center gap-3 group">
                        {status === "loading" ? (
                          <>
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span>Transmitting...</span>
                          </>
                        ) : (
                          <>
                            <span>Initialize Project</span>
                            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                          </>
                        )}
                      </button>
                    </motion.div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </main>
  );
}