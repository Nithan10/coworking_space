"use client";

import { motion } from "framer-motion";

export default function AdminDashboard() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Overview</h1>
        <p className="text-gray-500 font-medium mt-1">Welcome back. Here is what's happening at SpaceHub today.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { title: "Total Bookings", value: "248", growth: "+12%", color: "text-indigo-600", bg: "bg-indigo-50" },
          { title: "Active Members", value: "1,492", growth: "+5%", color: "text-emerald-600", bg: "bg-emerald-50" },
          { title: "Revenue", value: "₹4.2L", growth: "+18%", color: "text-blue-600", bg: "bg-blue-50" }
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">{stat.title}</h3>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${stat.bg} ${stat.color}`}>
                {stat.growth}
              </span>
            </div>
            <p className="text-4xl font-black text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Placeholder for Data Table */}
      <div className="bg-white border border-gray-100 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 h-96 flex items-center justify-center">
        <p className="text-gray-400 font-bold">Recent Bookings Table (Coming Soon)</p>
      </div>

    </motion.div>
  );
}