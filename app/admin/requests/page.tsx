"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link"; 

interface RequestItem {
  _id: string;
  userName: string;
  userEmail: string;
  bookingId: string;
  propertyName: string;
  cityName: string;
  extraChairs: number;
  otherRequirements: string;
  status: string;
}

export default function AdminRequests() {
  const [requests, setRequests] = useState<RequestItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/requests/all");
      const data = await res.json();
      if (data.success) setRequests(data.data);
    } catch (err) {
      console.error("Failed to load requests:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`http://localhost:5000/api/requests/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        // Update UI instantly
        setRequests(requests.map(req => req._id === id ? { ...req, status: newStatus } : req));
      }
    } catch (err) {
      alert("Failed to update status");
    }
  };

  if (loading) {
    return <div className="p-8 font-bold text-gray-500">Loading requests...</div>;
  }

  return (
    <div className="p-8">
      
      {/* --- Breadcrumb Navigation --- */}
      <nav className="flex items-center text-[13px] font-semibold text-gray-400 mb-6" aria-label="Breadcrumb">
        <ol className="flex items-center space-x-2">
          <li>
            <Link href="/admin" className="hover:text-indigo-600 transition-colors flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Admin Dashboard
            </Link>
          </li>
          <li>
            <svg className="w-4 h-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </li>
          <li className="text-indigo-600" aria-current="page">
            Requests
          </li>
        </ol>
      </nav>

      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-black text-gray-900 mb-1">Amenity Requests</h1>
        <p className="text-sm text-gray-500 font-medium">Manage user requests for extra chairs and other setups.</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase tracking-wider text-gray-500">
              <th className="p-4 font-bold">User</th>
              <th className="p-4 font-bold">Workspace</th>
              <th className="p-4 font-bold">Requirements</th>
              <th className="p-4 font-bold">Status</th>
              <th className="p-4 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
            {requests.map((req) => (
              <tr key={req._id} className="hover:bg-gray-50/50 transition-colors">
                <td className="p-4">
                  <p className="font-bold text-gray-900">{req.userName}</p>
                  <p className="text-xs text-gray-500">{req.userEmail}</p>
                  <p className="text-[10px] text-gray-400 mt-1">ID: {req.bookingId}</p>
                </td>
                <td className="p-4">
                  <p className="font-semibold">{req.propertyName}</p>
                  <p className="text-xs text-gray-500">{req.cityName}</p>
                </td>
                <td className="p-4 max-w-xs">
                  {req.extraChairs > 0 && <p className="font-medium bg-indigo-50 text-indigo-700 inline-block px-2 py-0.5 rounded text-xs mb-1">{req.extraChairs} Chairs</p>}
                  {req.otherRequirements && <p className="text-gray-600 text-xs truncate" title={req.otherRequirements}>{req.otherRequirements}</p>}
                </td>
                <td className="p-4">
                  <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider
                    ${req.status === 'Approved' ? 'bg-green-50 text-green-700' : 
                      req.status === 'Rejected' ? 'bg-red-50 text-red-700' : 
                      'bg-amber-50 text-amber-700'}`}>
                    {req.status}
                  </span>
                </td>
                <td className="p-4 text-right space-x-2">
                  {req.status === 'Pending' && (
                    <>
                      <button onClick={() => updateStatus(req._id, 'Approved')} className="text-xs font-bold text-green-600 bg-green-50 hover:bg-green-100 px-3 py-1.5 rounded-lg transition-colors">
                        Approve
                      </button>
                      <button onClick={() => updateStatus(req._id, 'Rejected')} className="text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors">
                        Reject
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
            {requests.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-500 font-medium">No requests found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}