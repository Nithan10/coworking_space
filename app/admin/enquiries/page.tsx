"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

// Define the Enquiry interface based on your schema
interface Enquiry {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  phone: string;
  city: string;
  message: string;
  createdAt: string;
}

export default function AdminEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEnquiries = async () => {
      try {
        const token = localStorage.getItem("token");
        
        const response = await fetch("https://coworking-space-backend.onrender.com/api/enquiries", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}` 
          },
        });

        const data = await response.json();

        if (response.ok) {
          setEnquiries(data.data);
        } else {
          setError(data.message || "Failed to fetch enquiries.");
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Cannot connect to the server.");
      } finally {
        setLoading(false);
      }
    };

    fetchEnquiries();
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Enquiry Requests</h1>
          <p className="text-gray-500 font-medium mt-1">Review and manage incoming consultation requests.</p>
        </div>
        <div className="bg-indigo-50 text-indigo-700 px-4 py-2 rounded-xl font-bold text-sm border border-indigo-100 flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          Total Requests: {enquiries.length}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-white border border-gray-200 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
        
        {loading ? (
          // Loading State
          <div className="p-12 flex flex-col items-center justify-center">
            <svg className="animate-spin h-10 w-10 text-indigo-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            <p className="text-gray-500 font-medium">Loading enquiry requests...</p>
          </div>
        ) : error ? (
          // Error State
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">Failed to load enquiries</h3>
            <p className="text-gray-500">{error}</p>
          </div>
        ) : enquiries.length === 0 ? (
          // Empty State
           <div className="p-16 text-center">
            <div className="w-20 h-20 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100">
              <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">No enquiries yet</h3>
            <p className="text-gray-500 max-w-md mx-auto">When users submit consultation requests through the main website, they will appear here.</p>
          </div>
        ) : (
          // Data Table
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">Client</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">Contact Info</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">Location</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">Message</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {enquiries.map((enquiry) => (
                  <tr key={enquiry._id} className="hover:bg-gray-50/80 transition-colors group">
                    
                    {/* Client Name & Company */}
                    <td className="px-6 py-5 align-top">
                      <p className="text-sm font-bold text-gray-900">{enquiry.firstName} {enquiry.lastName}</p>
                      <div className="flex items-center gap-1.5 mt-1 text-indigo-600">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                        <p className="text-xs font-bold uppercase tracking-wider">{enquiry.company}</p>
                      </div>
                    </td>

                    {/* Contact Info */}
                    <td className="px-6 py-5 align-top">
                      <div className="space-y-1.5">
                        <a href={`mailto:${enquiry.email}`} className="flex items-center gap-2 text-sm text-gray-600 hover:text-indigo-600 transition-colors w-fit">
                          <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                          {enquiry.email}
                        </a>
                        <a href={`tel:${enquiry.phone}`} className="flex items-center gap-2 text-sm text-gray-600 hover:text-indigo-600 transition-colors w-fit">
                          <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                          {enquiry.phone}
                        </a>
                      </div>
                    </td>

                    {/* Target City */}
                    <td className="px-6 py-5 align-top">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-gray-100 text-gray-700 border border-gray-200">
                        {enquiry.city}
                      </span>
                    </td>

                    {/* Message Preview */}
                    <td className="px-6 py-5 align-top">
                      <div className="max-w-xs">
                        <p className="text-sm text-gray-600 line-clamp-2" title={enquiry.message}>
                          "{enquiry.message}"
                        </p>
                      </div>
                    </td>

                    {/* Date Submitted */}
                    <td className="px-6 py-5 align-top">
                      <p className="text-sm font-medium text-gray-900">
                        {new Date(enquiry.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {new Date(enquiry.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </motion.div>
  );
}