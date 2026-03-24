"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

// ==========================================
// TYPES
// ==========================================
interface Booking {
  _id: string;
  transactionId: string;
  bookingId: string;
  fullName: string;
  plan: string;
  amount: number;
  paymentStatus: string;
  cityName?: string;
  propertyName?: string;
  createdAt: string;
}

interface Enquiry {
  _id: string;
  firstName?: string; 
  lastName?: string;
  email?: string;
  company?: string;
  phone?: string;
  city?: string;
  message?: string;
  createdAt: string;
}

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

interface ChartData {
  label: string;
  revenue: number;
  bookings: number;
}

export default function ReportsDashboard() {
  const [timeframe, setTimeframe] = useState("All Time");
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");
  
  // State for processed Data
  const [kpis, setKpis] = useState({ revenue: 0, activeBookings: 0, enquiries: 0, users: 0 });
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [cityPerformance, setCityPerformance] = useState<{city: string, bookings: number, revenue: number, percentage: number}[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<Booking[]>([]);
  const [recentEnquiries, setRecentEnquiries] = useState<Enquiry[]>([]);
  const [exportData, setExportData] = useState<Booking[]>([]); // Added for full CSV Export

  // ==========================================
  // FETCH & PROCESS DATA
  // ==========================================
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setApiError("");
      
      try {
        const token = localStorage.getItem("token") || "";
        const headers = {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        };

        const API_BASE = "http://localhost:5000/api";
        
        let allBookings: Booking[] = [];
        let allEnquiries: Enquiry[] = [];
        let allUsers: User[] = [];

        // 1. Fetch Bookings Safely
        try {
          const bRes = await fetch(`${API_BASE}/payment/bookings`, { headers });
          if (bRes.ok) {
            const bJson = await bRes.json();
            allBookings = Array.isArray(bJson?.data) ? bJson.data : (Array.isArray(bJson) ? bJson : []);
          } else if (bRes.status === 401 || bRes.status === 403) {
             setApiError("Unauthorized: Please log in as an Admin to view stats.");
          }
        } catch (e) { 
          console.error("Bookings fetch failed", e); 
        }

        // 2. Fetch Enquiries Safely
        try {
          const eRes = await fetch(`${API_BASE}/enquiries`, { headers });
          if (eRes.ok) {
            const eJson = await eRes.json();
            allEnquiries = Array.isArray(eJson?.data) ? eJson.data : (Array.isArray(eJson) ? eJson : []);
          }
        } catch (e) { 
          console.error("Enquiries fetch failed", e); 
        }

        // 3. Fetch Users Safely
        try {
          const uRes = await fetch(`${API_BASE}/users`, { headers });
          if (uRes.ok) {
            const uJson = await uRes.json();
            allUsers = Array.isArray(uJson?.data) ? uJson.data : (Array.isArray(uJson) ? uJson : []);
          }
        } catch (e) { 
          console.error("Users fetch failed", e); 
        }

        console.log(`✅ Loaded Data -> Bookings: ${allBookings.length}, Enquiries: ${allEnquiries.length}, Users: ${allUsers.length}`);

        processMetrics(allBookings, allEnquiries, allUsers, timeframe);
      } catch (error) {
        console.error("Dashboard Global Fetch Error:", error);
        setApiError("A critical error occurred while loading the dashboard.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [timeframe]);

  // Logic to calculate KPIs and Graph data based on MongoDB results
  const processMetrics = (bookings: Booking[], enquiries: Enquiry[], users: User[], filter: string) => {
    const now = new Date();
    
    // 1. Timeframe Filtering
    const filterDate = (dateStr: string) => {
      if (filter === "All Time") return true;
      if (!dateStr) return false;
      const d = new Date(dateStr);
      if (filter === "Today") return d.toDateString() === now.toDateString();
      if (filter === "This Month") return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      if (filter === "This Year") return d.getFullYear() === now.getFullYear();
      return true;
    };

    const filteredBookings = bookings.filter(b => filterDate(b.createdAt));
    setExportData(filteredBookings); // Save full filtered list for CSV Export
    
    // Map of successful statuses
    const successStatuses = ['SUCCESS', 'COMPLETED', 'PAYMENT_SUCCESS', 'PAYMENT_PENDING', 'PENDING'];
    
    const successfulBookings = filteredBookings.filter(b => {
      const status = b.paymentStatus ? b.paymentStatus.toUpperCase() : "";
      return successStatuses.includes(status);
    });
    
    // 2. KPIs
    const totalRevenue = successfulBookings.reduce((sum, b) => sum + (Number(b.amount) || 0), 0);
    
    setKpis({
      revenue: totalRevenue,
      activeBookings: successfulBookings.length,
      enquiries: enquiries.filter(e => filterDate(e.createdAt)).length,
      users: users.filter(u => filterDate(u.createdAt)).length
    });

    // 3. City/Property Performance
    const cityMap: Record<string, { bookings: number, revenue: number }> = {};
    successfulBookings.forEach(b => {
      const city = b.cityName || b.propertyName || 'Direct / Online';
      if (!cityMap[city]) cityMap[city] = { bookings: 0, revenue: 0 };
      cityMap[city].bookings += 1;
      cityMap[city].revenue += Number(b.amount) || 0;
    });

    const cityArray = Object.entries(cityMap).map(([city, data]) => ({
      city,
      bookings: data.bookings,
      revenue: data.revenue,
      percentage: totalRevenue > 0 ? (data.revenue / totalRevenue) * 100 : 0
    })).sort((a, b) => b.revenue - a.revenue);
    
    setCityPerformance(cityArray);

    // 4. Graph Data (Last 6 Months Revenue Trend)
    const monthsMap: Record<string, ChartData> = {};
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(now.getMonth() - i);
      const monthLabel = d.toLocaleString('default', { month: 'short' });
      monthsMap[monthLabel] = { label: monthLabel, revenue: 0, bookings: 0 };
    }

    successfulBookings.forEach(b => {
      if (!b.createdAt) return;
      const d = new Date(b.createdAt);
      if (d >= new Date(now.getFullYear(), now.getMonth() - 5, 1)) {
        const monthLabel = d.toLocaleString('default', { month: 'short' });
        if (monthsMap[monthLabel]) {
          monthsMap[monthLabel].revenue += Number(b.amount) || 0;
          monthsMap[monthLabel].bookings += 1;
        }
      }
    });

    setChartData(Object.values(monthsMap));

    // 5. Recent Lists
    setRecentTransactions(filteredBookings.slice(0, 5));
    setRecentEnquiries(enquiries.slice(0, 5));
  };

  // ==========================================
  // RENDER HELPERS
  // ==========================================
  const formatCurrency = (val: number) => `₹${val.toLocaleString('en-IN')}`;
  
  const timeAgo = (dateStr: string) => {
    if (!dateStr) return 'Unknown time';
    const diff = new Date().getTime() - new Date(dateStr).getTime();
    if (isNaN(diff)) return 'Unknown time';
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours} hours ago`;
    return `${Math.floor(hours / 24)} days ago`;
  };

  // ==========================================
  // CSV EXPORT FUNCTION
  // ==========================================
  const downloadCSV = () => {
    if (exportData.length === 0) {
      alert("No data available to export for this timeframe.");
      return;
    }

    const headers = ["Transaction ID", "Booking ID", "Customer Name", "Plan", "Amount (INR)", "Status", "Date"];

    const csvRows = exportData.map(txn => {
      return [
        txn.transactionId || "N/A",
        txn.bookingId || "N/A",
        `"${txn.fullName || 'Unknown User'}"`, 
        `"${txn.plan || 'Custom'}"`,
        txn.amount || 0,
        txn.paymentStatus || "UNKNOWN",
        new Date(txn.createdAt).toLocaleDateString()
      ].join(",");
    });

    const csvString = [headers.join(","), ...csvRows].join("\n");
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `SpaceHub_Bookings_${timeframe.replace(/ /g, "_")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const kpiDefinitions = [
    { title: "Total Revenue", value: formatCurrency(kpis.revenue), icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
    { title: "Active Bookings", value: kpis.activeBookings, icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" },
    { title: "New Enquiries", value: kpis.enquiries, icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" },
    { title: "Total Users", value: kpis.users, icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" },
  ];

  if (loading) {
    return (
      <div className="flex-1 bg-gray-50/50 min-h-screen flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gray-50/50 min-h-screen p-6 md:p-10 font-sans overflow-y-auto pb-24">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">SpaceHub Reports</h1>
          <p className="text-sm font-medium text-gray-500 mt-1">Real-time analytics directly from your MongoDB database.</p>
        </div>
        
        {/* Actions Container */}
        <div className="flex flex-wrap items-center gap-3">
          
          {/* Export Button */}
          <button 
            onClick={downloadCSV}
            className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-sm hover:bg-gray-800 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export CSV
          </button>

          {/* Timeframe Filter */}
          <div className="inline-flex bg-white border border-gray-200 rounded-xl p-1 shadow-sm overflow-x-auto max-w-full">
            {["Today", "This Month", "This Year", "All Time"].map((filter) => (
              <button
                key={filter}
                onClick={() => setTimeframe(filter)}
                className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all whitespace-nowrap ${
                  timeframe === filter
                    ? "bg-indigo-50 text-indigo-700 shadow-sm"
                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </div>

      {apiError && (
        <div className="mb-8 bg-red-50 text-red-700 border border-red-200 p-4 rounded-xl text-sm font-bold">
          ⚠️ {apiError}
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {kpiDefinitions.map((kpi, idx) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}
            key={idx} 
            className="bg-white rounded-2xl p-6 border border-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] relative overflow-hidden group hover:border-indigo-100 transition-colors"
          >
            <div className="absolute top-0 right-0 p-4 opacity-5 transform group-hover:scale-110 transition-transform duration-500">
              <svg className="w-24 h-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={kpi.icon} />
              </svg>
            </div>
            
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={kpi.icon} />
                </svg>
              </div>
            </div>
            <h3 className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-1 relative z-10">{kpi.title}</h3>
            <p className="text-3xl font-black text-gray-900 relative z-10">{kpi.value}</p>
          </motion.div>
        ))}
      </div>

      {/* UNIQUE GRAPH & City Breakdown Section */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-10">
        
        {/* THE UNIQUE DYNAMIC GRAPH */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] p-6 md:p-8 flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-lg font-black text-gray-900">Revenue Trend (Last 6 Months)</h2>
            </div>
          </div>
          
          <div className="flex-1 min-h-[250px] relative flex items-end pt-10 border-b border-gray-100">
            <div className="absolute inset-0 flex flex-col justify-between pb-8 pointer-events-none">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-full h-px bg-gray-50 border-t border-dashed border-gray-200"></div>
              ))}
            </div>

            <div className="relative w-full h-full flex items-end justify-around px-2 md:px-10 pb-8 z-10">
              {chartData.length === 0 || chartData.every(d => d.revenue === 0) ? (
                 <div className="text-gray-400 font-medium italic absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                   {apiError ? "No data loaded due to error." : "Waiting for first transaction..."}
                 </div>
              ) : (() => {
                const maxRevenue = Math.max(...chartData.map(d => d.revenue), 1000); 
                
                return chartData.map((data, idx) => {
                  const heightPercent = Math.max((data.revenue / maxRevenue) * 100, 2); 

                  return (
                    <div key={idx} className="relative flex flex-col items-center w-12 md:w-20 group">
                      <div className="absolute -top-14 bg-gray-900 text-white text-xs font-bold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20">
                        {formatCurrency(data.revenue)}
                        <div className="text-[10px] text-gray-400 font-medium mt-0.5">{data.bookings} Bookings</div>
                        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                      </div>

                      <motion.div 
                        initial={{ height: 0 }}
                        animate={{ height: `${heightPercent}%` }}
                        transition={{ duration: 1, delay: idx * 0.1, type: "spring", stiffness: 60 }}
                        className="w-full bg-gradient-to-t from-indigo-500 to-indigo-400 rounded-t-xl shadow-sm relative group-hover:from-indigo-400 group-hover:to-indigo-300 transition-colors cursor-pointer"
                      />
                      <span className="absolute -bottom-7 text-xs font-bold text-gray-500">{data.label}</span>
                    </div>
                  );
                });
              })()}
            </div>
          </div>
        </div>

        {/* City Performance */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] p-6 md:p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-lg font-black text-gray-900">Top Markets</h2>
          </div>
          
          <div className="space-y-6">
            {cityPerformance.length === 0 ? (
               <p className="text-gray-400 text-sm text-center py-10">No market data available for this timeframe.</p>
            ) : cityPerformance.slice(0, 5).map((city, idx) => (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.1 }} key={idx}>
                <div className="flex justify-between items-end mb-2">
                  <div>
                    <span className="text-sm font-bold text-gray-900 block truncate max-w-[150px]">{city.city}</span>
                    <span className="text-xs font-medium text-gray-500">{city.bookings} Bookings</span>
                  </div>
                  <span className="text-sm font-black text-gray-900">₹{city.revenue.toLocaleString('en-IN')}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${city.percentage}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="bg-indigo-600 h-2.5 rounded-full" 
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Tables Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        
        {/* Recent Transactions Table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] overflow-hidden">
          <div className="p-6 md:p-8 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-lg font-black text-gray-900">Live Transactions</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">Txn ID</th>
                  <th className="py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">User</th>
                  <th className="py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">Amount</th>
                  <th className="py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentTransactions.length === 0 ? (
                  <tr><td colSpan={4} className="py-10 text-center text-gray-400 text-sm">No transactions found.</td></tr>
                ) : recentTransactions.map((txn, idx) => {
                  
                  const statusSafe = txn.paymentStatus ? txn.paymentStatus.toUpperCase() : "";
                  const isSuccess = ['SUCCESS', 'COMPLETED', 'PAYMENT_SUCCESS', 'PAYMENT_PENDING'].includes(statusSafe);
                  
                  return (
                    <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-4 px-6">
                        <span className="text-sm font-bold text-gray-900 block truncate max-w-[100px]">{txn.transactionId || 'N/A'}</span>
                        <span className="text-xs text-gray-500 block mt-1">{txn.createdAt ? new Date(txn.createdAt).toLocaleDateString() : 'Just now'}</span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-sm font-semibold text-gray-700 block">{txn.fullName || 'Unknown User'}</span>
                        <span className="text-xs text-gray-500">{txn.plan || 'Custom'}</span>
                      </td>
                      <td className="py-4 px-6 text-sm font-black text-gray-900">{formatCurrency(txn.amount || 0)}</td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase ${
                          isSuccess ? 'bg-emerald-50 text-emerald-700' : 
                          statusSafe === 'PENDING' ? 'bg-amber-50 text-amber-700' : 
                          'bg-rose-50 text-rose-700'
                        }`}>
                          {txn.paymentStatus || 'UNKNOWN'}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Lead/Enquiry Pipeline */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] flex flex-col h-full">
          <div className="p-6 md:p-8 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-lg font-black text-gray-900">Enquiry Pipeline</h2>
          </div>
          
          <div className="p-6 md:p-8 flex-1 space-y-5">
            {recentEnquiries.length === 0 ? (
               <p className="text-gray-400 text-sm text-center py-10">No new enquiries.</p>
            ) : recentEnquiries.map((enq, idx) => {
              // Extract data safely based on your actual Schema
              const fullName = `${enq.firstName || ''} ${enq.lastName || ''}`.trim() || 'Unknown User';
              const initial = enq.firstName ? enq.firstName.charAt(0) : '?';
              
              return (
                <div key={idx} className="flex gap-4 border-b border-gray-50 pb-5 last:border-0 last:pb-0">
                  <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 font-bold uppercase">
                    {initial}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">
                      {fullName} 
                      <span className="text-gray-400 font-medium"> @ {enq.company || 'Individual'}</span>
                    </h4>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{enq.message || 'No message provided.'}</p>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-2 block">{timeAgo(enq.createdAt)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}