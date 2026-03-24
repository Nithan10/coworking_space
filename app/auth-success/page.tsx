"use client";

import React, { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { jwtDecode } from "jwt-decode";

function AuthHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");

    if (token) {
      localStorage.setItem("token", token);
      
      try {
        // Decode the token to get user info (id, role, etc)
        const decodedToken: any = jwtDecode(token);
        
        // Since we don't have the full user object from Google callback in the URL, 
        // we can set a basic user object from the token info so the Navbar knows they are logged in.
        // Or better yet, your backend could return the user info encoded in the token.
        // Assuming your backend token payload has: { id, role, email, name, avatar }
        const userObj = {
          name: decodedToken.name || "User",
          email: decodedToken.email || "",
          role: decodedToken.role || "user",
          avatar: decodedToken.avatar || ""
        };

        localStorage.setItem("user", JSON.stringify(userObj));
        window.dispatchEvent(new Event("auth-change"));

        // Redirect based on role
        setTimeout(() => {
          if (decodedToken.role === 'admin') {
            router.push("/admin");
          } else {
            router.push("/"); 
          }
        }, 1000);

      } catch (error) {
        console.error("Error decoding token", error);
        router.push("/auth");
      }

    } else {
      router.push("/auth");
    }
  }, [router, searchParams]);

  return (
    <div className="flex flex-col items-center justify-center">
      <svg className="animate-spin h-10 w-10 text-indigo-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <h2 className="text-xl font-bold text-gray-900 tracking-tight">Authenticating...</h2>
      <p className="text-sm text-gray-500 mt-2">Securing your workspace access.</p>
    </div>
  );
}

export default function AuthSuccessPage() {
  return (
    <main className="min-h-screen bg-[#F4F7FC] flex items-center justify-center selection:bg-indigo-500/30">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white/80 backdrop-blur-xl border border-white rounded-[2rem] p-12 shadow-2xl text-center"
      >
        <Suspense fallback={<div className="text-indigo-600 font-bold">Loading...</div>}>
          <AuthHandler />
        </Suspense>
      </motion.div>
    </main>
  );
}