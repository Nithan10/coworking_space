"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link"; 
import Navbar from "../components/Navbar";

// 1. Define the TypeScript interface for the user's requests
interface RequestItem {
  _id: string;
  bookingId: string;
  propertyName: string;
  cityName: string;
  extraChairs: number;
  otherRequirements: string;
  status: string;
  createdAt: string;
  adminNote?: string;
}

export default function MyRequests() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  
  // 2. Apply the interface to the state
  const [requests, setRequests] = useState<RequestItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      router.push("/");
      return;
    }

    const parsedUser = JSON.parse(storedUser);
    setUser(parsedUser);

    const fetchMyRequests = async () => {
      try {
        const res = await fetch(`https://coworking-space-backend.onrender.com/api/requests/user?email=${encodeURIComponent(parsedUser.email)}`);
        const data = await res.json();
        if (data.success) setRequests(data.data);
      } catch (err) {
        console.error("Error fetching requests:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyRequests();
  }, [router]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />

      <main className="pt-32 pb-20 px-6 max-w-[1200px] mx-auto relative">
        
        {/* --- Breadcrumb Navigation --- */}
        <nav className="flex items-center text-[13px] font-semibold text-gray-400 mb-6" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2">
            <li>
              <Link href="/" className="hover:text-indigo-600 transition-colors flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Home
              </Link>
            </li>
            <li>
              <svg className="w-4 h-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </li>
            <li>
              <Link href="/dashboard" className="hover:text-indigo-600 transition-colors">
                My SpaceWork
              </Link>
            </li>
            <li>
              <svg className="w-4 h-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </li>
            <li className="text-indigo-600" aria-current="page">
              My Requests
            </li>
          </ol>
        </nav>

        {/* Page Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">My Requests</h1>
          <p className="text-gray-500 font-medium">Track your workspace amenity requests here.</p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-10 h-10 border-4 border-[#5A4BFF] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : requests.length === 0 ? (
          <div className="bg-white rounded-3xl border border-gray-200 p-12 flex flex-col items-center text-center shadow-sm">
            <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No active requests</h3>
            <p className="text-gray-500 max-w-md">You haven't requested any additional amenities for your bookings.</p>
          </div>
        ) : (
          <div className="bg-white rounded-[24px] border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse whitespace-nowrap md:whitespace-normal">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-[11px] uppercase tracking-wider text-gray-500">
                    <th className="p-5 font-bold">Booking ID</th>
                    <th className="p-5 font-bold">Workspace</th>
                    <th className="p-5 font-bold">Requested Items</th>
                    <th className="p-5 font-bold">Date</th>
                    <th className="p-5 font-bold text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                  {requests.map((req) => (
                    <tr key={req._id} className="hover:bg-gray-50/50 transition-colors">
                      
                      {/* Booking ID */}
                      <td className="p-5 align-middle">
                        <span className="font-mono text-xs font-bold text-gray-400">{req.bookingId}</span>
                      </td>

                      {/* Workspace Info */}
                      <td className="p-5 align-middle">
                        <p className="font-bold text-gray-900">{req.propertyName}</p>
                        <p className="text-xs text-gray-500 font-medium mt-0.5">{req.cityName}</p>
                      </td>

                      {/* Requested Items (Chairs + Text) */}
                      <td className="p-5 align-middle max-w-xs">
                        <div className="flex flex-col gap-1.5">
                          {req.extraChairs > 0 && (
                            <span className="inline-flex w-fit items-center px-2 py-0.5 rounded text-xs font-bold bg-indigo-50 text-[#5A4BFF] border border-indigo-100">
                              {req.extraChairs} Extra Chairs
                            </span>
                          )}
                          {req.otherRequirements && (
                            <p className="text-xs text-gray-600 font-medium truncate" title={req.otherRequirements}>
                              {req.otherRequirements}
                            </p>
                          )}
                          {req.extraChairs === 0 && !req.otherRequirements && (
                            <span className="text-xs text-gray-400 italic">None specified</span>
                          )}
                        </div>
                      </td>

                      {/* Date */}
                      <td className="p-5 align-middle">
                        <span className="text-sm font-semibold text-gray-600">
                          {new Date(req.createdAt).toLocaleDateString('en-IN', { 
                            day: 'numeric', 
                            month: 'short', 
                            year: 'numeric' 
                          })}
                        </span>
                      </td>

                      {/* Status Pill & Message */}
                      <td className="p-5 align-middle text-right">
                        <div className="flex flex-col items-end gap-1.5">
                          <span className={`inline-block px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider
                            ${req.status === 'Approved' ? 'bg-green-50 text-green-700 border border-green-200' : 
                              req.status === 'Rejected' ? 'bg-red-50 text-red-700 border border-red-200' : 
                              'bg-amber-50 text-amber-700 border border-amber-200'}`}>
                            {req.status}
                          </span>
                          {req.status === 'Approved' && req.adminNote && (
                            <p className="text-[10px] font-medium text-gray-500 bg-gray-50 px-2 py-1 rounded max-w-[200px] truncate" title={req.adminNote}>
                              Msg: {req.adminNote}
                            </p>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}