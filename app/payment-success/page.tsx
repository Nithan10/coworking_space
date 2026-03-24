"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from "framer-motion";
import Navbar from "./../components/Navbar"; 

export default function PaymentSuccess() {
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState(8); // 8 second countdown

  // Auto-redirect to home page logic
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push('/'); // Redirect to home page
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  return (
    <main className="min-h-screen bg-[#F4F4F5] relative flex flex-col overflow-hidden font-sans">
      <Navbar />
      
      {/* Coworking Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none z-0 mix-blend-multiply opacity-50"></div>
      
      <div className="flex-1 flex flex-col items-center justify-center pt-24 pb-12 px-4 relative z-10">
        
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
          className="bg-white rounded-[2rem] shadow-2xl border border-gray-100 max-w-lg w-full relative overflow-hidden"
        >
          {/* Success Header Banner */}
          <div className="bg-gray-900 px-8 pt-10 pb-16 relative overflow-hidden text-center">
            {/* Animated Confetti/Stars in the background */}
            <motion.div 
              animate={{ rotate: 360 }} 
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute -top-32 -right-32 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl"
            />
            <motion.div 
              animate={{ rotate: -360 }} 
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              className="absolute -bottom-32 -left-32 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl"
            />

            <motion.div 
              initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring" }}
              className="w-20 h-20 bg-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4 shadow-[0_0_40px_rgba(52,211,153,0.4)] relative z-10"
            >
              <svg className="w-10 h-10 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <motion.path 
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.5, duration: 0.6 }}
                  strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" 
                />
              </svg>
            </motion.div>
            
            <h1 className="text-3xl font-black text-white tracking-tight relative z-10">Booking Confirmed!</h1>
            <p className="text-gray-400 text-sm mt-2 relative z-10">Your workspace is ready for you.</p>
          </div>

          {/* Body: Digital Pass Concept */}
          <div className="px-8 pt-0 pb-8 bg-white relative">
            
            {/* The "Tear" effect to make it look like a receipt/ticket */}
            <div className="absolute top-0 left-0 w-full flex justify-between px-[-10px] -mt-3 z-20">
              {Array.from({ length: 20 }).map((_, i) => (
                <div key={i} className="w-4 h-4 bg-[#F4F4F5] rounded-full" />
              ))}
            </div>

            <div className="pt-10 text-center">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-6">Digital Access Pass</h3>
              
              <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5 text-left space-y-4 mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-indigo-600">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Receipt & Confirmation</p>
                    <p className="text-sm font-bold text-gray-900">Sent to your email</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-indigo-600">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Building Access</p>
                    <p className="text-sm font-bold text-gray-900">Show QR code at front desk</p>
                  </div>
                </div>
              </div>

              {/* Progress Bar & Redirection Text */}
              <div className="space-y-3">
                <p className="text-sm text-gray-500 font-medium">
                  Redirecting to home page in <span className="font-bold text-gray-900">{timeLeft}</span> seconds...
                </p>
                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 8, ease: "linear" }}
                    className="h-full bg-gray-900"
                  />
                </div>
              </div>

              <div className="mt-8 flex gap-3 justify-center">
                <button 
                  onClick={() => router.push('/')}
                  className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 text-sm font-bold rounded-xl transition-colors"
                >
                  Go Home Now
                </button>
                <button 
                  onClick={() => router.push('/dashboard')}
                  className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition-colors shadow-lg shadow-indigo-200"
                >
                  View My Bookings
                </button>
              </div>

            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}