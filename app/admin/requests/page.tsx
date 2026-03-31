"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link"; 
import { motion, AnimatePresence } from "framer-motion";

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
  adminNote?: string;
}

export default function AdminRequests() {
  const [requests, setRequests] = useState<RequestItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const [adminNote, setAdminNote] = useState("");

  const fetchRequests = async () => {
    try {
      const res = await fetch("https://coworking-space-backend.onrender.com/api/requests/all");
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

  // Standard status update (used for Rejecting)
  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`https://coworking-space-backend.onrender.com/api/requests/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        setRequests(requests.map(req => req._id === id ? { ...req, status: newStatus } : req));
      }
    } catch (err) {
      alert("Failed to update status");
    }
  };

  // Open the approval popup
  const handleOpenApproveModal = (id: string) => {
    setSelectedRequestId(id);
    setAdminNote("");
    setIsModalOpen(true);
  };

  // Submit the approval with notes
  const handleApproveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRequestId) return;

    try {
      const res = await fetch(`https://coworking-space-backend.onrender.com/api/requests/${selectedRequestId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          status: "Approved",
          adminNote: adminNote
        })
      });
      const data = await res.json();
      if (data.success) {
        // Update UI instantly with new data
        setRequests(requests.map(req => 
          req._id === selectedRequestId 
            ? { ...req, status: "Approved", adminNote: adminNote } 
            : req
        ));
        setIsModalOpen(false); // Close modal
      }
    } catch (err) {
      alert("Failed to approve request.");
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
                  <div className="flex flex-col items-start gap-1">
                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider
                      ${req.status === 'Approved' ? 'bg-green-50 text-green-700' : 
                        req.status === 'Rejected' ? 'bg-red-50 text-red-700' : 
                        'bg-amber-50 text-amber-700'}`}>
                      {req.status}
                    </span>
                    {/* Display Note if Approved */}
                    {req.status === 'Approved' && req.adminNote && (
                      <span className="text-[10px] text-gray-500 font-medium mt-1 bg-gray-50 px-2 py-1 rounded">
                        Note: {req.adminNote}
                      </span>
                    )}
                  </div>
                </td>
                <td className="p-4 text-right space-x-2">
                  {req.status === 'Pending' && (
                    <>
                      <button 
                        onClick={() => handleOpenApproveModal(req._id)} 
                        className="text-xs font-bold text-green-600 bg-green-50 hover:bg-green-100 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        Approve
                      </button>
                      <button 
                        onClick={() => updateStatus(req._id, 'Rejected')} 
                        className="text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors"
                      >
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

      {/* --- APPROVAL MODAL --- */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
            />
            
            {/* Modal Content */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative bg-white rounded-2xl shadow-xl border border-gray-100 w-full max-w-md p-6 overflow-hidden"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-2">Approve Request</h2>
              <p className="text-sm text-gray-500 mb-6">Leave a message or confirmation detail for the user.</p>
              
              <form onSubmit={handleApproveSubmit} className="space-y-4">
                {/* Admin Note Input */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Approval Message <span className="text-red-500">*</span>
                  </label>
                  <textarea 
                    rows={3}
                    required
                    placeholder="e.g., Your chairs have been placed at your desk."
                    value={adminNote}
                    onChange={(e) => setAdminNote(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-indigo-600 focus:bg-white transition-all text-sm font-medium text-gray-900 resize-none"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-6">
                  <button 
                    type="button" 
                    onClick={() => setIsModalOpen(false)}
                    className="px-5 py-2.5 text-sm font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-5 py-2.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-lg shadow-indigo-200"
                  >
                    Confirm Approval
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}