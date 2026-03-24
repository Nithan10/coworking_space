"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  const menuItems = [
    { name: "Dashboard", path: "/admin", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
    // ADDED: Reports tab for your new dashboard
    { name: "Reports", path: "/admin/reports", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" },
    { name: "Bookings", path: "/admin/bookings", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" },
    { name: "Requests", path: "/admin/requests", icon: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" },
    { name: "Locations", path: "/admin/locations", icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z" },
    { name: "Users", path: "/admin/users", icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" },
    { name: "Enquiries", path: "/admin/enquiries", icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" },
    { name: "Settings", path: "/admin/settings", icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z" },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-full shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-10 hidden md:flex">
      {/* Brand Header */}
      <div className="h-20 flex items-center px-6 border-b border-gray-100">
        <div className="w-9 h-9 border-2 border-indigo-600 rounded-xl flex items-center justify-center bg-indigo-50 relative overflow-hidden mr-3 shadow-sm">
          <div className="absolute w-full h-[2.5px] bg-indigo-600 transform rotate-45"></div>
        </div>
        <span className="font-black text-2xl text-gray-900 tracking-tight">SpaceHub<span className="text-indigo-600">.</span></span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto admin-scroll py-6 px-4 space-y-1.5">
        <p className="px-3 text-[11px] font-black text-gray-400 uppercase tracking-widest mb-4">Main Menu</p>
        {menuItems.map((item) => {
          // Prevent Dashboard from staying active on every sub-route
          const isActive = item.path === "/admin" 
            ? pathname === "/admin" 
            : pathname === item.path || pathname.startsWith(`${item.path}/`);

          return (
            <Link
              key={item.name}
              href={item.path}
              className={`flex items-center px-3 py-3 rounded-xl transition-all duration-200 group ${
                isActive 
                  ? "bg-indigo-50/80 text-indigo-700 font-bold shadow-sm border border-indigo-100/50" 
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900 font-semibold border border-transparent"
              }`}
            >
              <svg 
                className={`w-5 h-5 mr-3 transition-transform duration-200 ${
                  isActive ? "text-indigo-600 scale-110" : "text-gray-400 group-hover:text-gray-600 group-hover:scale-110"
                }`} 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={isActive ? 2.5 : 2} d={item.icon} />
              </svg>
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Help Widget */}
      <div className="p-4 border-t border-gray-100 bg-gray-50/50">
        <div className="bg-gradient-to-br from-indigo-600 to-blue-600 rounded-2xl p-5 text-white shadow-lg shadow-indigo-200">
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mb-3 backdrop-blur-sm">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h4 className="text-sm font-black mb-1 tracking-tight">Need Help?</h4>
          <p className="text-xs text-indigo-100 mb-4 font-medium opacity-90">Check our documentation for admin tools.</p>
          <button className="w-full bg-white text-indigo-600 hover:bg-gray-50 transition-colors text-xs font-bold py-2.5 rounded-xl shadow-sm">
            View Docs
          </button>
        </div>
      </div>
    </aside>
  );
}