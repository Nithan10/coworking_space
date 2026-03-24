"use client";

import React, { useEffect, useState } from "react";

interface Booking {
  _id: string;
  bookingId: string;
  fullName: string;
  workEmail: string;
  phoneNumber: string; // <-- ADDED: Phone Number
  plan: string;
  seats: number;
  startDate?: string;
  amount: number;
  paymentStatus: string;
  createdAt: string;
}

export default function AdminBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/payment/bookings");
        const data = await res.json();
        if (data.success) {
          setBookings(data.data);
        }
      } catch (err) {
        console.error("Error fetching bookings:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  // Function to manually update status
  const handleStatusUpdate = async (bookingId: string, newStatus: string) => {
    try {
      // Optimistically update the UI instantly
      setBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking._id === bookingId ? { ...booking, paymentStatus: newStatus } : booking
        )
      );

      // Send the update to the backend database
      const res = await fetch(`http://localhost:5000/api/payment/bookings/${bookingId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ paymentStatus: newStatus }),
      });

      const data = await res.json();
      if (!data.success) {
        alert("Failed to update status in database.");
      }
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Error updating status.");
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Workspace Bookings</h1>
        <p className="text-gray-500">Manage and track all customer reservations.</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase whitespace-nowrap">Booking ID</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase whitespace-nowrap">Customer</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase whitespace-nowrap">Phone</th> {/* <-- NEW HEADER */}
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase whitespace-nowrap">Plan</th>
                <th className="px-6 py-4 text-xs font-bold text-blue-500 uppercase whitespace-nowrap">Start Date</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase whitespace-nowrap">Amount</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase whitespace-nowrap">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase whitespace-nowrap">Booked On</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-10 text-center text-gray-400">Loading bookings...</td> {/* Updated colSpan to 8 */}
                </tr>
              ) : bookings.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-10 text-center text-gray-400">No bookings found.</td> {/* Updated colSpan to 8 */}
                </tr>
              ) : (
                bookings.map((booking) => (
                  <tr key={booking._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs font-bold text-indigo-600">{booking.bookingId}</td>
                    
                    {/* Customer Name & Email */}
                    <td className="px-6 py-4">
                      <div className="text-sm font-bold text-gray-900 truncate">{booking.fullName}</div>
                      <div className="text-xs text-gray-500 truncate">{booking.workEmail}</div>
                    </td>

                    {/* NEW: Phone Number Column */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-700">
                        {booking.phoneNumber || <span className="text-gray-400 text-xs">N/A</span>}
                      </div>
                    </td>
                    
                    {/* Plan Details */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-700 font-medium">{booking.plan}</div>
                      <div className="text-xs text-gray-400">{booking.seats} Seats</div>
                    </td>
                    
                    {/* Start Date */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-gray-900">
                        {booking.startDate ? (
                          new Date(booking.startDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
                        ) : (
                          <span className="text-gray-400 font-medium text-xs">N/A</span>
                        )}
                      </div>
                    </td>
                    
                    {/* Amount */}
                    <td className="px-6 py-4 text-sm font-black text-gray-900">₹{(booking.amount || 0).toLocaleString()}</td>
                    
                    {/* Interactive Status Dropdown */}
                    <td className="px-6 py-4">
                      <select
                        value={booking.paymentStatus}
                        onChange={(e) => handleStatusUpdate(booking._id, e.target.value)}
                        className={`px-2 py-1.5 outline-none rounded-lg text-[11px] font-bold uppercase tracking-wider cursor-pointer border-2 appearance-none text-center
                          ${
                            booking.paymentStatus === 'SUCCESS' ? 'bg-green-50 text-green-700 border-green-200 hover:border-green-300' : 
                            booking.paymentStatus === 'FAILED' ? 'bg-red-50 text-red-700 border-red-200 hover:border-red-300' : 
                            'bg-amber-50 text-amber-700 border-amber-200 hover:border-amber-300'
                          }
                        `}
                      >
                        <option value="PENDING">Pending</option>
                        <option value="SUCCESS">Success</option>
                        <option value="FAILED">Failed</option>
                      </select>
                    </td>
                    
                    {/* Booking Date */}
                    <td className="px-6 py-4 text-xs text-gray-500 whitespace-nowrap">
                      {new Date(booking.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}