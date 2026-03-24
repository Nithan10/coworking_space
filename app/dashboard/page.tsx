"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "../components/Navbar"; 

interface Booking {
  _id: string;
  bookingId: string;
  propertyId: string;
  propertyName?: string;
  cityName?: string;
  locationAddress?: string;
  plan: string;
  planName?: string;
  planFeatures?: string[];
  seats: number;
  startDate?: string;
  amount: number;
  paymentStatus: string;
  createdAt: string;
}

interface User {
  name: string;
  email: string;
  avatar?: string;
  role: string;
}

export default function UserDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  // Request Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [requestForm, setRequestForm] = useState({
    extraChairs: 0,
    otherRequirements: ""
  });
  const [isSubmittingRequest, setIsSubmittingRequest] = useState(false);

  // Custom Toast Notification State
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({
    show: false,
    message: "",
    type: "success"
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    
    if (!storedUser) {
      router.push("/");
      return;
    }

    const parsedUser = JSON.parse(storedUser);
    setUser(parsedUser);

    const fetchMyBookings = async () => {
      try {
        const res = await fetch(`https://coworking-space-backend.onrender.com/api/payment/user-bookings?email=${encodeURIComponent(parsedUser.email)}`);
        const data = await res.json();
        
        if (data.success) setBookings(data.data);
      } catch (err) {
        console.error("Error fetching user bookings:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyBookings();
  }, [router]);

  // Toast Handler
  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ show: true, message, type });
    // Auto-hide after 4 seconds
    setTimeout(() => {
      setToast({ show: false, message: "", type: "success" });
    }, 4000);
  };

  // Modal Handlers
  const openRequestModal = (booking: Booking) => {
    setSelectedBooking(booking);
    setRequestForm({ extraChairs: 0, otherRequirements: "" });
    setIsModalOpen(true);
  };

  const closeRequestModal = () => {
    setIsModalOpen(false);
    setSelectedBooking(null);
  };

  // POST request to your backend
  const handleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingRequest(true);

    if (!selectedBooking || !user) return;

    try {
      const res = await fetch("https://coworking-space-backend.onrender.com/api/requests/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId: selectedBooking.bookingId,
          propertyName: selectedBooking.propertyName || "Premium Workspace",
          cityName: selectedBooking.cityName || "City",
          userEmail: user.email,
          userName: user.name,
          extraChairs: requestForm.extraChairs,
          otherRequirements: requestForm.otherRequirements
        })
      });

      const data = await res.json();

      if (data.success) {
        closeRequestModal();
        showToast("Your request has been submitted successfully! Check 'My Requests'.", "success");
      } else {
        throw new Error(data.message || "Failed to submit");
      }
    } catch (error) {
      console.error(error);
      showToast("Failed to submit request. Please try again.", "error");
    } finally {
      setIsSubmittingRequest(false);
    }
  };

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
            <li className="text-indigo-600" aria-current="page">
              My SpaceWork
            </li>
          </ol>
        </nav>

        {/* Page Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">
            Welcome back, {user.name.split(' ')[0]} 👋
          </h1>
          <p className="text-gray-500 font-medium">Manage your workspace bookings and account details.</p>
        </div>

        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">My Workspaces</h2>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-10 h-10 border-4 border-[#5A4BFF] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : bookings.length === 0 ? (
          <div className="bg-white rounded-3xl border border-gray-200 p-12 flex flex-col items-center text-center shadow-sm">
            <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mb-6">
              <svg className="w-10 h-10 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No active bookings</h3>
            <p className="text-gray-500 mb-8 max-w-md">You haven't booked any workspaces yet. Explore our premium locations and find your perfect office today.</p>
            <Link href="/locations" className="bg-[#5A4BFF] hover:bg-[#4839e0] text-white font-bold py-3 px-8 rounded-xl transition-all shadow-md">
              Explore Locations
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {bookings.map((booking) => (
              <div key={booking._id} className="bg-white rounded-3xl border border-gray-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 flex flex-col hover:border-indigo-200 transition-colors">
                
                {/* Header: Status & ID */}
                <div className="flex justify-between items-center mb-6">
                  <span className="font-mono text-xs text-gray-400 font-bold">ID: {booking.bookingId}</span>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider
                    ${booking.paymentStatus === 'SUCCESS' ? 'bg-green-50 text-green-700 border border-green-200' : 
                      booking.paymentStatus === 'FAILED' ? 'bg-red-50 text-red-700 border border-red-200' : 
                      'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}
                  >
                    {booking.paymentStatus}
                  </span>
                </div>

                {/* Property Identity */}
                <div className="mb-6">
                  <span className="inline-block px-2.5 py-1 bg-indigo-50 text-[#5A4BFF] text-[10px] font-bold uppercase tracking-widest rounded-md mb-3">
                    {booking.cityName || "Workspace"}
                  </span>
                  <h3 className="text-2xl font-black text-gray-900 mb-2">{booking.propertyName || "Premium Workspace"}</h3>
                  <div className="flex items-start gap-2 text-sm text-gray-500 font-medium">
                    <svg className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    <p className="leading-snug">{booking.locationAddress || "Address details sent to email"}</p>
                  </div>
                </div>

                {/* Plan Info & Dates */}
                <div className="grid grid-cols-2 gap-4 bg-gray-50 rounded-2xl p-5 mb-6 border border-gray-100">
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Plan</p>
                    <p className="font-bold text-gray-900">{booking.planName || booking.plan}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Seats</p>
                    <p className="font-bold text-gray-900">{booking.seats} {booking.seats === 1 ? 'Seat' : 'Seats'}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Start Date</p>
                    <p className="font-bold text-[#5A4BFF]">
                      {booking.startDate ? new Date(booking.startDate).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : 'Pending Confirmation'}
                    </p>
                  </div>
                </div>

                {/* Plan Features List */}
                <div className="mb-8 flex-1">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Included Amenities</p>
                  {booking.planFeatures && booking.planFeatures.length > 0 ? (
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-2">
                      {booking.planFeatures.map((feature, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-sm text-gray-700 font-medium">
                          <svg className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                          <span className="leading-snug">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500 italic">Standard workspace amenities included.</p>
                  )}
                </div>

                {/* Footer - Price & Add-ons Button */}
                <div className="pt-5 border-t border-gray-100 flex items-center justify-between mt-auto">
                  <div>
                    <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Total Paid</span>
                    <span className="text-2xl font-black text-gray-900">₹{(booking.amount || 0).toLocaleString()}</span>
                  </div>
                  
                  {/* Trigger Modal Button */}
                  <button 
                    onClick={() => openRequestModal(booking)}
                    className="flex items-center gap-2 bg-indigo-50 hover:bg-indigo-100 text-[#5A4BFF] px-4 py-2.5 rounded-xl text-sm font-bold transition-colors border border-indigo-100"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Request Add-ons
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}
      </main>

      {/* --- REQUEST ADD-ONS MODAL --- */}
      {isModalOpen && selectedBooking && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-[#111827]/40 backdrop-blur-[2px] animate-in fade-in duration-200">
          <div className="bg-white rounded-[24px] w-full max-w-[500px] overflow-hidden shadow-2xl relative">
            
            {/* Close Button */}
            <button 
              onClick={closeRequestModal}
              className="absolute top-5 right-5 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="p-8 pb-10">
              <h2 className="text-[28px] font-extrabold text-[#111827] mb-2 tracking-tight">Request Amenities</h2>
              <p className="text-[15px] text-[#6B7280] mb-8 leading-relaxed">
                Need extra chairs or specific setups for your space? Submit a request below.
              </p>

              <form onSubmit={handleRequestSubmit} className="space-y-6">
                
                {/* Default Locked Workspace Input */}
                <div>
                  <label className="block text-[12px] font-bold text-[#6B7280] uppercase tracking-wider mb-2">
                    Selected Workspace
                  </label>
                  <div className="w-full px-4 py-3.5 bg-white border border-[#E5E7EB] rounded-[12px] text-[15px] font-semibold text-[#374151]">
                    {selectedBooking.propertyName || 'SpaceHub Eco'} - {selectedBooking.cityName || 'Bengalore'}
                  </div>
                </div>

                {/* Extra Chairs Input */}
                <div className="w-full sm:w-1/2 sm:pr-2">
                  <label className="block text-[12px] font-bold text-[#6B7280] uppercase tracking-wider mb-2">
                    Additional Chairs
                  </label>
                  <div className="relative flex items-center">
                    <input 
                      type="number" 
                      min="0"
                      value={requestForm.extraChairs}
                      onChange={(e) => setRequestForm({...requestForm, extraChairs: parseInt(e.target.value) || 0})}
                      className="w-full px-4 py-3.5 bg-white border border-[#E5E7EB] focus:border-[#5A4BFF] focus:ring-1 focus:ring-[#5A4BFF] rounded-[12px] text-[15px] font-semibold text-[#111827] outline-none transition-all pr-12"
                    />
                    <span className="absolute right-4 text-[#9CA3AF] text-[15px] font-medium pointer-events-none">
                      pcs
                    </span>
                  </div>
                </div>

                {/* Other Requirements Textarea */}
                <div>
                  <label className="block text-[12px] font-bold text-[#6B7280] uppercase tracking-wider mb-2">
                    Other Requirements
                  </label>
                  <textarea 
                    rows={4}
                    placeholder="E.g., Whiteboard, extra power extensions, specific lighting..."
                    value={requestForm.otherRequirements}
                    onChange={(e) => setRequestForm({...requestForm, otherRequirements: e.target.value})}
                    className="w-full px-4 py-3.5 bg-white border border-[#E5E7EB] focus:border-[#5A4BFF] focus:ring-1 focus:ring-[#5A4BFF] rounded-[12px] text-[15px] font-medium text-[#111827] placeholder:text-[#9CA3AF] outline-none transition-all resize-none"
                  />
                </div>

                {/* Submit Action */}
                <button 
                  type="submit" 
                  disabled={isSubmittingRequest}
                  className={`w-full py-4 mt-2 rounded-[12px] text-white font-bold text-[16px] transition-all flex justify-center items-center gap-2
                    ${isSubmittingRequest ? 'bg-[#5A4BFF]/70 cursor-not-allowed' : 'bg-[#5A4BFF] hover:bg-[#4839e0]'}`}
                >
                  {isSubmittingRequest ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin"></div>
                      Submitting...
                    </>
                  ) : (
                    "Submit Request"
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* --- CUSTOM TOAST NOTIFICATION --- */}
      {toast.show && (
        <div className="fixed top-8 right-8 z-[1000] animate-in slide-in-from-top-4 fade-in duration-300">
          <div className={`flex items-start gap-4 p-4 bg-white rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] border-l-4 w-full max-w-sm
            ${toast.type === 'success' ? 'border-l-emerald-500' : 'border-l-red-500'}`}>
            
            {/* Icon */}
            <div className={`mt-0.5 shrink-0 ${toast.type === 'success' ? 'text-emerald-500' : 'text-red-500'}`}>
              {toast.type === 'success' ? (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
            </div>

            {/* Text */}
            <div className="flex-1">
              <h4 className={`text-sm font-bold mb-1 ${toast.type === 'success' ? 'text-emerald-800' : 'text-red-800'}`}>
                {toast.type === 'success' ? 'Success!' : 'Error'}
              </h4>
              <p className="text-sm text-gray-600 font-medium leading-relaxed">
                {toast.message}
              </p>
            </div>

            {/* Manual Close Button */}
            <button 
              onClick={() => setToast({ ...toast, show: false })}
              className="shrink-0 p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

    </div>
  );
}