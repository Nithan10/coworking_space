"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminNavbar() {
  const router = useRouter();
  const [admin, setAdmin] = useState<{ name: string; email: string; avatar?: string } | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (storedUser && token) {
      const parsedUser = JSON.parse(storedUser);
      // Extra security check: kick them out of admin if they aren't an admin role
      if (parsedUser.role !== 'admin') {
        router.push("/");
      } else {
        setAdmin(parsedUser);
      }
    } else {
      router.push("/login");
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("auth-change")); // Update main site navbar
    router.push("/login"); 
  };

  if (!admin) return <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-end px-6 z-10 relative"><div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div></header>;

  return (
    <header className="h-16 bg-white/80 backdrop-blur-md border-b border-gray-200 flex items-center justify-between px-6 z-10 relative sticky top-0">
      {/* Mobile Menu Button (Visible only on small screens) */}
      <button className="md:hidden p-2 text-gray-500 hover:text-gray-900 rounded-lg hover:bg-gray-100">
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Global Search Bar */}
      <div className="hidden md:flex items-center bg-gray-50 border border-gray-200 rounded-full px-4 py-1.5 w-96 focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-400 transition-all">
        <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input 
          type="text" 
          placeholder="Search bookings, users..." 
          className="bg-transparent border-none outline-none text-sm w-full text-gray-700 placeholder-gray-400"
        />
      </div>

      {/* Right Side: Profile & Actions */}
      <div className="flex items-center space-x-4 ml-auto">
        {/* Return to Main Site */}
        <Link href="/" className="text-xs font-bold text-gray-500 hover:text-indigo-600 transition-colors hidden sm:block">
          View Main Site
        </Link>
        <div className="h-5 w-px bg-gray-200 hidden sm:block"></div>
        
        <div className="flex items-center space-x-3 group cursor-pointer relative">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-gray-900 leading-tight">{admin.name}</p>
            <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">Super Admin</p>
          </div>
          {admin.avatar ? (
            <img src={admin.avatar} alt="Admin" className="w-9 h-9 rounded-full object-cover border-2 border-indigo-100 shadow-sm" />
          ) : (
            <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold shadow-sm">
              {admin.name.charAt(0).toUpperCase()}
            </div>
          )}

          {/* Simple Dropdown on Hover */}
          <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-100 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 p-2">
            <button onClick={handleLogout} className="w-full text-left px-3 py-2 text-sm text-red-600 font-bold hover:bg-red-50 rounded-xl transition-colors flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}