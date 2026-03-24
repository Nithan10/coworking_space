"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence, Variants } from "framer-motion";
import Navbar from "../../../components/Navbar";

// Define types matching your MongoDB schema
interface Amenity {
  name: string;
  icon: string;
}

interface PricingFeature {
  name: string;
  value: string | boolean;
}

interface PricingPlan {
  id: string;
  name: string;
  price: string;
  numericPrice: number;
  duration: string;
  features: PricingFeature[];
}

interface Workplace {
  title: string;
  desc: string;
  icon: string;
}

interface Service {
  title: string;
  desc: string;
  icon: string;
}

interface Property {
  propertyId: string;
  name: string;
  locality: string;
  city: string;
  cityId: string;
  description: string;
  images: string[];
  amenities: Amenity[];
  badge: string;
  capacity: string;
  exploreLink: string;
  status: string;
  availableNow: boolean;
  availableSeats?: number;
  pricingPlans: PricingPlan[];
  standardWorkplaces: Workplace[];
  standardServices: Service[];
  location: {
    lat: number;
    lng: number;
    address: string;
    embedUrl?: string;
  };
  contactPhone: string;
}

interface LocationData {
  cityId: string;
  cityDisplayName: string;
  properties?: Property[];
}

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const isImageIcon = (iconStr?: string) => {
  if (!iconStr) return false;
  return iconStr.startsWith('http') || iconStr.startsWith('/') || iconStr.includes('.png') || iconStr.includes('.jpg') || iconStr.includes('.svg');
};

export default function WorkspaceDetails() {
  const params = useParams();
  const [property, setProperty] = useState<Property | null>(null);
  const [location, setLocation] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  
  // Form Refs & State
  const formRef = useRef<HTMLDivElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: "", 
    workEmail: "", 
    phoneNumber: "+91 ", 
    plan: "", 
    seats: 1,
    startDate: "" 
  });

  useEffect(() => setMounted(true), []);

  const cityIdStr = Array.isArray(params?.cityId) ? params?.cityId[0] : params?.cityId;
  const propertyIdStr = Array.isArray(params?.propertyId) 
    ? decodeURIComponent(params?.propertyId[0]) 
    : decodeURIComponent(params?.propertyId || '');

  // Fetch property data
  useEffect(() => {
    if (!cityIdStr || !propertyIdStr) {
      setError("Missing city or property ID");
      setLoading(false);
      return;
    }

    const fetchProperty = async () => {
      try {
        setLoading(true);
        const locationResponse = await fetch(`https://coworking-space-backend.onrender.com/api/locations/city/${cityIdStr}`);
        const locationData = await locationResponse.json();

        if (locationData.success) {
          setLocation(locationData.data);
          
          const foundProperty = locationData.data.properties?.find((p: Property) => {
            if (p.propertyId.toLowerCase() === propertyIdStr.toLowerCase()) return true;
            const normalizeStr = (str: string) => str.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
            if (normalizeStr(p.propertyId) === normalizeStr(propertyIdStr)) return true;
            const withSpaces = p.propertyId.replace(/-/g, ' ').toLowerCase();
            const withHyphens = propertyIdStr.replace(/ /g, '-').toLowerCase();
            if (withSpaces === propertyIdStr.toLowerCase() || p.propertyId.toLowerCase() === withHyphens) return true;
            return false;
          });

          if (foundProperty) {
            if (foundProperty.status === 'published') {
              setProperty(foundProperty);
              
              // 🔥 Default to the second plan (Middle Card) so one is always active and blue!
              if (foundProperty.pricingPlans?.length > 0) {
                const defaultIndex = foundProperty.pricingPlans.length > 1 ? 1 : 0;
                setFormData(prev => ({ ...prev, plan: foundProperty.pricingPlans[defaultIndex].id }));
              }
            } else {
              setError(`This workspace is currently ${foundProperty.status} and not available for viewing`);
            }
          } else {
            setError(`Workspace "${propertyIdStr}" not found in ${cityIdStr}`);
          }
        } else {
          setError(`Location "${cityIdStr}" not found`);
        }
      } catch (err) {
        console.log("Error fetching property:", err);
        setError("Failed to load workspace details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [cityIdStr, propertyIdStr]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    
    if (id === "seats") {
      let parsedValue = parseInt(value) || 1;
      const maxSeats = property?.availableSeats !== undefined ? property.availableSeats : 999;
      parsedValue = Math.min(Math.max(1, parsedValue), maxSeats);
      
      setFormData({ ...formData, seats: parsedValue });
    } else {
      setFormData({ ...formData, [id]: value });
    }
  };

  const selectPlanAndScroll = (planId: string) => {
    setFormData({ ...formData, plan: planId });
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      formRef.current.classList.add("ring-4", "ring-blue-500", "ring-offset-4");
      setTimeout(() => formRef.current?.classList.remove("ring-4", "ring-blue-500", "ring-offset-4"), 1500);
    }
  };

  const selectedPlanDetails = property?.pricingPlans?.find(p => p.id === formData.plan);
  const estimatedTotal = selectedPlanDetails && selectedPlanDetails.numericPrice > 0 
    ? selectedPlanDetails.numericPrice * formData.seats 
    : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!estimatedTotal) {
      alert("Please select a valid plan before proceeding.");
      return;
    }

    setIsSubmitting(true);
    
    try {
      let userEmail = formData.workEmail; 
      try {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          if (parsedUser.email) userEmail = parsedUser.email;
        }
      } catch (err) {}

      const cleanPhone = formData.phoneNumber.replace(/\D/g, '').slice(-10);
      const planName = selectedPlanDetails?.name || formData.plan;
      const planFeatures = selectedPlanDetails?.features
        ?.filter(f => f.value === true || typeof f.value === 'string') 
        ?.map(f => typeof f.value === 'string' ? `${f.name} (${f.value})` : f.name) || [];

      const propertyName = property?.name || "Premium Workspace";
      const cityName = property?.city || location?.cityDisplayName || "City";
      const locationAddress = property?.location?.address || `${property?.locality}, ${property?.city}`;

      const response = await fetch('https://coworking-space-backend.onrender.com/api/payment/initiate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData, 
          phoneNumber: cleanPhone,
          estimatedTotal,
          propertyId: property?.propertyId,
          userEmail,
          propertyName,
          cityName,
          locationAddress,
          planName,
          planFeatures
        })
      });

      const data = await response.json();

      if (data.success && data.redirectUrl) {
        window.location.href = data.redirectUrl;
      } else {
        alert(`Payment Error: ${data.message || "Failed to initialize."}`);
        setIsSubmitting(false);
      }
    } catch (error) {
      alert("Failed to submit booking. Please check your connection and try again.");
      setIsSubmitting(false);
    }
  };

  if (!mounted) return null;

  if (loading) {
    return (
      <main className="min-h-screen bg-[#FAFAFA]">
        <Navbar />
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mb-4"></div>
            <p className="text-gray-600 font-medium">Loading workspace details...</p>
          </div>
        </div>
      </main>
    );
  }

  if (error || !property) {
    return (
      <main className="min-h-screen bg-[#FAFAFA]">
        <Navbar />
        <div className="max-w-[1400px] mx-auto pt-32 px-4 md:px-8">
          <div className="bg-white rounded-[2rem] p-12 text-center shadow-xl border border-gray-100">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Workspace Not Found</h3>
            <p className="text-gray-500 max-w-md mx-auto mb-8">{error || "The workspace you're looking for doesn't exist or has been removed."}</p>
            
            <Link 
              href={`/locations/${cityIdStr}`} 
              className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to {location?.cityDisplayName || decodeURIComponent(cityIdStr || '').charAt(0).toUpperCase() + decodeURIComponent(cityIdStr || '').slice(1).replace(/-/g, ' ')}
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const isSoldOut = (property.availableSeats !== undefined && property.availableSeats <= 0) || property.availableNow === false;
  const displayBadgeText = isSoldOut 
    ? 'Sold Out / Unavailable' 
    : (property.availableSeats !== undefined ? `${property.availableSeats} Seats Left` : property.capacity);

  return (
    <main className="min-h-screen bg-[#FAFAFA] text-[#111827] selection:bg-blue-600 selection:text-white pb-32">
      <Navbar />

      <div className="max-w-[1400px] mx-auto pt-32 px-4 md:px-8 relative">
        
        {/* Breadcrumb */}
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          className="flex items-center space-x-2 text-sm text-gray-500 font-medium mb-8 flex-wrap"
        >
          <Link href="/locations" className="hover:text-blue-600 transition-colors">Locations</Link>
          <span>/</span>
          <Link 
            href={`/locations/${cityIdStr}`} 
            className="hover:text-blue-600 transition-colors capitalize"
          >
            {location?.cityDisplayName || decodeURIComponent(cityIdStr || '').replace(/-/g, ' ')}
          </Link>
          <span>/</span>
          <span className="text-gray-900 font-bold line-clamp-1">{property.name}</span>
        </motion.div>

        {/* Main Layout */}
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">
          
          {/* Left Column */}
          <div className="w-full lg:w-[65%] flex flex-col gap-16">
            
            {/* Header */}
            <div>
              <motion.div 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                className={`inline-flex items-center space-x-2 border rounded-full px-3 py-1 mb-4 shadow-sm ${isSoldOut ? 'bg-red-50 border-red-100' : 'bg-emerald-50 border-emerald-100'}`}
              >
                <span className={`w-2 h-2 rounded-full ${isSoldOut ? 'bg-red-500' : 'bg-emerald-500 animate-pulse'}`} />
                <span className={`text-[11px] font-bold uppercase tracking-widest ${isSoldOut ? 'text-red-700' : 'text-emerald-700'}`}>
                  {displayBadgeText}
                </span>
              </motion.div>
              <motion.h1 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 0.1 }} 
                className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-3 tracking-tight"
              >
                {property.name}
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 0.2 }} 
                className="text-lg text-gray-500 font-medium flex items-center gap-2"
              >
                <svg className="w-5 h-5 text-blue-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="line-clamp-1">{property.locality}, {property.city}</span>
              </motion.p>
            </div>

            {/* Image Gallery */}
            {property.images && property.images.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 0.3 }} 
                className="flex flex-col gap-4"
              >
                <div className="w-full h-[400px] md:h-[550px] rounded-3xl overflow-hidden relative shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] group">
                  <AnimatePresence mode="wait">
                    <motion.img 
                      key={activeImageIndex}
                      src={property.images[activeImageIndex]}
                      initial={{ opacity: 0, scale: 1.05 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5, ease: "easeInOut" }}
                      className="w-full h-full object-cover absolute inset-0"
                      alt={`${property.name} Gallery Image ${activeImageIndex + 1}`}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/1200x800?text=Image+Not+Available';
                      }}
                    />
                  </AnimatePresence>
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/40 via-transparent to-transparent pointer-events-none" />
                </div>
                <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
                  {property.images.map((img, idx) => {
                    const isActive = activeImageIndex === idx;
                    return (
                      <button 
                        key={idx} 
                        onClick={() => setActiveImageIndex(idx)}
                        className={`relative flex-shrink-0 w-28 h-20 md:w-32 md:h-24 rounded-xl overflow-hidden transition-all duration-300 ${
                          isActive ? "ring-4 ring-blue-600 ring-offset-2 scale-95" : "opacity-60 hover:opacity-100 hover:scale-105"
                        }`}
                      >
                        <img 
                          src={img} 
                          className="w-full h-full object-cover" 
                          alt={`Thumbnail ${idx + 1}`}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150x100?text=Error';
                          }}
                        />
                        {isActive && <div className="absolute inset-0 bg-blue-600/20" />}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* About Section */}
            <motion.section 
              variants={fadeInUp} 
              initial="hidden" 
              whileInView="visible" 
              viewport={{ once: true, margin: "-100px" }}
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-gray-900">About the Space</h2>
              </div>
              <div className="prose prose-lg text-gray-500 font-medium leading-relaxed max-w-none">
                {property.description?.split('\n\n').map((paragraph, idx) => (
                  <p key={idx} className="mb-4">{paragraph}</p>
                ))}
              </div>
            </motion.section>

            {/* Premium Amenities Grid */}
            {property.amenities && property.amenities.length > 0 && (
              <motion.section 
                variants={fadeInUp} 
                initial="hidden" 
                whileInView="visible" 
                viewport={{ once: true, margin: "-100px" }} 
                className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
              >
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Premium Amenities</h2>
                  <p className="text-sm text-gray-500 font-medium uppercase tracking-widest">Included in this building</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-y-10 gap-x-6">
                  {property.amenities.map((amenity, idx) => (
                    <div key={idx} className="flex flex-col items-center text-center group">
                      <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-3xl mb-4 border border-gray-100 group-hover:scale-110 group-hover:shadow-md transition-all duration-300 overflow-hidden">
                        {isImageIcon(amenity.icon) ? (
                          <img src={amenity.icon} alt={amenity.name} className="w-8 h-8 object-contain" />
                        ) : (
                          <span>{amenity.icon}</span>
                        )}
                      </div>
                      <span className="text-gray-900 font-bold text-sm leading-tight">{amenity.name}</span>
                    </div>
                  ))}
                </div>
              </motion.section>
            )}

            {/* Workplaces & Services */}
            {(property.standardWorkplaces?.length > 0 || property.standardServices?.length > 0) && (
              <motion.section 
                variants={fadeInUp} 
                initial="hidden" 
                whileInView="visible" 
                viewport={{ once: true, margin: "-100px" }} 
                className="pt-4 pb-4"
              >
                <h2 className="text-3xl font-bold text-[#0B1120] mb-10 tracking-tight">Also available here</h2>
                
                {property.standardWorkplaces && property.standardWorkplaces.length > 0 && (
                  <div className="mb-10">
                    <h3 className="text-[13px] font-bold text-[#5A45FF] uppercase tracking-[0.15em] mb-4 pl-1">Workplaces</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {property.standardWorkplaces.map((item, idx) => (
                        <div 
                          key={idx} 
                          className="flex items-start gap-4 p-6 rounded-[1.5rem] border border-gray-100 bg-white shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-[0_10px_30px_rgba(0,0,0,0.06)] hover:border-blue-100 transition-all duration-300 cursor-pointer group"
                        >
                          <div className="w-14 h-14 bg-[#F0F4FF] rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform duration-300">
                            <img 
                              src={item.icon} 
                              alt={item.title} 
                              className="w-7 h-7 object-contain"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/28x28?text=Icon';
                              }}
                            />
                          </div>
                          <div className="pt-1">
                            <h4 className="text-[17px] font-bold text-[#0B1120] mb-1">{item.title}</h4>
                            <p className="text-sm text-gray-500 font-medium leading-relaxed">{item.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {property.standardServices && property.standardServices.length > 0 && (
                  <div>
                    <h3 className="text-[13px] font-bold text-[#5A45FF] uppercase tracking-[0.15em] mb-4 pl-1">Additional Services</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {property.standardServices.map((item, idx) => (
                        <div 
                          key={idx} 
                          className="flex items-start gap-4 p-6 rounded-[1.5rem] border border-gray-100 bg-white shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-[0_10px_30px_rgba(0,0,0,0.06)] hover:border-blue-100 transition-all duration-300 cursor-pointer group"
                        >
                          <div className="w-14 h-14 bg-[#FFF5EE] rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform duration-300">
                            <img 
                              src={item.icon} 
                              alt={item.title} 
                              className="w-7 h-7 object-contain"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/28x28?text=Icon';
                              }}
                            />
                          </div>
                          <div className="pt-1">
                            <h4 className="text-[17px] font-bold text-[#0B1120] mb-1">{item.title}</h4>
                            <p className="text-sm text-gray-500 font-medium leading-relaxed">{item.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.section>
            )}

            {/* Transparent Pricing section completely synced with form */}
            {property.pricingPlans && property.pricingPlans.length > 0 && (
              <motion.section 
                variants={fadeInUp} 
                initial="hidden" 
                whileInView="visible" 
                viewport={{ once: true, margin: "-100px" }} 
                className="pt-8 pb-4"
              >
                <div className="mb-10 text-center lg:text-left flex flex-col sm:flex-row justify-between items-end">
                  <div>
                    <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight mb-2">Transparent Pricing</h2>
                    <p className="text-gray-500 font-medium">Simple, scalable plans for teams of all sizes.</p>
                  </div>
                </div>

                {/* Mobile View: Stacked Pricing Cards */}
                <div className="flex flex-col gap-6 lg:hidden">
                  {property.pricingPlans.slice(0, 3).map((plan, idx) => {
                    const isActive = formData.plan === plan.id;
                    return (
                      <div 
                        key={idx} 
                        onClick={() => selectPlanAndScroll(plan.id)}
                        className={`border rounded-[2rem] p-8 shadow-sm cursor-pointer transition-all duration-300 ${
                          isActive 
                            ? 'bg-blue-600 text-white border-blue-600 scale-[1.02] shadow-[0_20px_40px_-10px_rgba(37,99,235,0.3)]' 
                            : 'bg-white border-gray-200 text-gray-900 hover:border-blue-300'
                        }`}
                      >
                        <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                        <div className="flex items-baseline gap-1 mb-6">
                          <span className={`text-3xl font-black ${isActive ? 'text-white' : 'text-blue-600'}`}>{plan.price}</span>
                          <span className={`font-medium text-sm ${isActive ? 'text-white/80' : 'text-gray-500'}`}>{plan.duration}</span>
                        </div>
                        <button 
                          disabled={isSoldOut}
                          className={`w-full font-bold py-3.5 rounded-xl mb-8 transition-colors ${
                            isSoldOut 
                              ? "bg-white/20 text-white/50 cursor-not-allowed" 
                              : isActive
                                ? "bg-[#0F172A] text-white"
                                : "bg-gray-100 text-gray-900 hover:bg-[#0F172A] hover:text-white"
                          }`}
                        >
                          {isSoldOut ? "Sold Out" : isActive ? "Selected" : "Select Plan"}
                        </button>
                        <div className="space-y-4">
                          {plan.features.map((f, fIdx) => (
                            <div key={fIdx} className="flex items-center justify-between text-sm">
                              <span className={`font-medium ${isActive ? 'text-white/90' : 'text-gray-500'}`}>{f.name}</span>
                              {typeof f.value === 'boolean' ? (
                                f.value ? (
                                  <div className={`w-5 h-5 rounded-full flex items-center justify-center ${isActive ? 'bg-white text-blue-600' : 'bg-[#0F172A] text-white'}`}>
                                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                  </div>
                                ) : (
                                  <span className={isActive ? 'text-white/30' : 'text-gray-300'}>—</span>
                                )
                              ) : (
                                <span className={`font-bold ${isActive ? 'text-white' : 'text-gray-900'}`}>{f.value}</span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Desktop View: Interactive Table synced with Form */}
                <div className="hidden lg:flex w-full relative">
                  <div className="w-1/4 pt-[140px] pb-8 pr-6 border-r border-gray-100">
                    {property.pricingPlans[0]?.features.map((f, idx) => (
                      <div key={idx} className="h-[60px] flex items-center text-[13px] font-bold text-gray-500 border-b border-transparent">
                        {f.name}
                      </div>
                    ))}
                  </div>
                  <div className="w-3/4 flex relative">
                    {property.pricingPlans.slice(0, 3).map((plan, pIdx) => {
                      const isActive = formData.plan === plan.id;
                      return (
                        <div
                          key={pIdx}
                          onClick={() => selectPlanAndScroll(plan.id)}
                          className={`flex-1 flex flex-col rounded-[2.5rem] cursor-pointer transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${
                            isActive 
                              ? 'bg-blue-600 text-white scale-[1.04] -translate-y-2 shadow-[0_25px_50px_-12px_rgba(37,99,235,0.35)] z-20' 
                              : 'bg-transparent text-gray-900 z-10 hover:bg-gray-50'
                          }`}
                        >
                          <div className={`h-[140px] flex flex-col items-center justify-center p-6 border-b transition-colors duration-500 ${isActive ? 'border-white/20' : 'border-gray-100'}`}>
                            <h3 className="text-xl font-bold tracking-tight mb-1">{plan.name}</h3>
                            <div className="flex items-baseline gap-1 mb-4">
                              <span className="text-xl font-black">{plan.price}</span>
                              <span className={`text-xs font-medium ${isActive ? 'text-white/80' : 'text-gray-500'}`}>{plan.duration}</span>
                            </div>
                            <button
                              disabled={isSoldOut}
                              className={`px-8 py-2.5 rounded-full text-sm font-bold transition-colors ${
                                isSoldOut 
                                  ? 'bg-white/20 text-white/50 cursor-not-allowed'
                                  : isActive 
                                    ? 'bg-[#0F172A] text-white shadow-lg' 
                                    : 'bg-gray-100 text-gray-600 hover:bg-[#0F172A] hover:text-white'
                              }`}
                            >
                              {isSoldOut ? "Sold Out" : isActive ? "Selected" : "Select Plan"}
                            </button>
                          </div>
                          <div className="flex flex-col pb-8">
                            {plan.features.map((feature, fIdx) => (
                              <div 
                                key={fIdx} 
                                className={`h-[60px] flex items-center justify-center border-b transition-colors duration-500 ${
                                  isActive ? 'border-white/10' : 'border-gray-100'
                                }`}
                              >
                                {typeof feature.value === 'boolean' ? (
                                  feature.value ? (
                                    <div className={`w-5 h-5 rounded-full flex items-center justify-center ${isActive ? 'bg-white text-blue-600' : 'bg-[#0F172A] text-white'}`}>
                                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3.5} d="M5 13l4 4L19 7" />
                                      </svg>
                                    </div>
                                  ) : (
                                    <span className={isActive ? 'text-white/20' : 'text-gray-300'}>—</span>
                                  )
                                ) : (
                                  <span className={`text-sm font-bold ${isActive ? 'text-white' : 'text-gray-900'}`}>
                                    {feature.value}
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </motion.section>
            )}

            {/* Map Location */}
            {property.location && (
              <motion.section 
                variants={fadeInUp} 
                initial="hidden" 
                whileInView="visible" 
                viewport={{ once: true, margin: "-100px" }} 
                className="mb-12"
              >
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Location</h2>
                <p className="text-base text-gray-500 mb-6 font-medium flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-600 rounded-full" />
                  {property.location.address || `${property.locality}, ${property.city}`}
                </p>
                <div className="w-full h-[450px] rounded-[2.5rem] overflow-hidden border border-gray-200 shadow-[0_10px_30px_rgb(0,0,0,0.05)] relative group">
                  <div className="absolute inset-0 bg-blue-900/5 pointer-events-none group-hover:bg-transparent transition-colors duration-500" />
                  <iframe 
                    src={property.location.embedUrl || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.599617305942!2d77.6836423!3d12.9334335!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae13cd88b9abf5%3A0xc3f920da7835158!2sRMZ%20Ecoworld!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"}
                    width="100%" 
                    height="100%" 
                    style={{ border: 0 }} 
                    allowFullScreen={false} 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                    className="grayscale opacity-90 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
                    title={`Map location for ${property.name}`}
                  ></iframe>
                </div>
              </motion.section>
            )}
          </div>



          {/* Right Column - Booking Form */}
          <div className="w-full lg:w-[35%] lg:sticky lg:top-32 flex flex-col gap-6 relative z-20 pb-12">
            <motion.div 
              ref={formRef}
              initial={{ opacity: 0, x: 20 }} 
              animate={{ opacity: 1, x: 0 }} 
              transition={{ delay: 0.3, duration: 0.5 }} 
              className="bg-white rounded-[2rem] p-8 lg:p-10 border border-gray-100 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] relative overflow-hidden transition-shadow duration-500"
            >
              <div className={`absolute top-0 left-0 right-0 h-1.5 ${isSoldOut ? 'bg-red-500' : 'bg-gradient-to-r from-blue-400 via-blue-600 to-blue-400'}`} />

              <h3 className="text-2xl font-black text-gray-900 mb-2 tracking-tight">Experience {property.name}</h3>
              <p className="text-sm text-gray-500 font-medium mb-8">
                Schedule an exclusive tour of the {property.locality} workspace and configure your ideal setup.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* SELECT DROPDOWN */}
                <div className="relative border-b-2 border-gray-200 focus-within:border-blue-600 transition-colors pt-2">
                  <label htmlFor="plan" className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 block">Seat Type</label>
                  <select 
                    id="plan" 
                    value={formData.plan}
                    onChange={handleInputChange} 
                    disabled={isSoldOut}
                    className="w-full pb-2 text-sm text-gray-900 bg-transparent focus:outline-none appearance-none cursor-pointer font-bold disabled:opacity-50 disabled:cursor-not-allowed" 
                    required
                  >
                    <option value="" disabled hidden>Select plan</option>
                    {property.pricingPlans?.map(plan => (
                      <option key={plan.id} value={plan.id}>{plan.name}</option>
                    ))}
                  </select>
                  <svg className="absolute right-0 bottom-2.5 w-4 h-4 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>

                {/* SHOW SELECTED PLAN FEATURES IN FORM */}
                <AnimatePresence mode="wait">
                  {selectedPlanDetails && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-3 bg-blue-50/50 border border-blue-100 rounded-xl p-4 overflow-hidden"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Plan Includes</span>
                        <span className="text-xs font-black text-gray-900">{selectedPlanDetails.price}<span className="text-[10px] font-medium text-gray-500">{selectedPlanDetails.duration}</span></span>
                      </div>
                      <ul className="space-y-2">
                        {selectedPlanDetails.features.filter(f => f.value === true || (typeof f.value === 'string' && f.value !== 'No' && f.value !== '—')).slice(0, 4).map((f, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs text-gray-600">
                            <svg className="w-3.5 h-3.5 text-blue-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>{f.name} {typeof f.value === 'string' ? <span className="font-bold text-gray-900">({f.value})</span> : ''}</span>
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="grid grid-cols-2 gap-4">
                  <div className="relative border-b-2 border-gray-200 focus-within:border-blue-600 transition-colors pt-2">
                    <label htmlFor="seats" className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 block">
                      How many seats? {property.availableSeats !== undefined && !isSoldOut ? <span className="text-indigo-500 lowercase normal-case">(Only {property.availableSeats} left)</span> : ''}
                    </label>
                    <input 
                      type="number" 
                      id="seats" 
                      min="1" 
                      max={property.availableSeats !== undefined ? property.availableSeats : 999}
                      value={formData.seats} 
                      onChange={handleInputChange} 
                      disabled={isSoldOut}
                      className="w-full pb-2 text-sm text-gray-900 bg-transparent focus:outline-none font-bold placeholder-gray-300 disabled:opacity-50 disabled:cursor-not-allowed" 
                      required 
                    />
                  </div>

                  <div className="relative border-b-2 border-gray-200 focus-within:border-blue-600 transition-colors pt-2">
                    <label htmlFor="startDate" className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 block">Starting Date</label>
                    <input 
                      type="date" 
                      id="startDate" 
                      min={new Date().toISOString().split("T")[0]} 
                      value={formData.startDate} 
                      onChange={handleInputChange} 
                      disabled={isSoldOut}
                      className="w-full pb-2 text-sm text-gray-900 bg-transparent focus:outline-none placeholder-gray-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed" 
                      required 
                    />
                  </div>
                </div>

                <div className="relative border-b-2 border-gray-200 focus-within:border-blue-600 transition-colors pt-2">
                  <label htmlFor="fullName" className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 block">Full Name</label>
                  <input 
                    type="text" 
                    id="fullName" 
                    value={formData.fullName} 
                    onChange={handleInputChange} 
                    disabled={isSoldOut}
                    className="w-full pb-2 text-sm text-gray-900 bg-transparent focus:outline-none placeholder-gray-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed" 
                    placeholder="e.g. John Doe" 
                    required 
                  />
                </div>

                <div className="relative border-b-2 border-gray-200 focus-within:border-blue-600 transition-colors pt-2">
                  <label htmlFor="workEmail" className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 block">Work Email</label>
                  <input 
                    type="email" 
                    id="workEmail" 
                    value={formData.workEmail} 
                    onChange={handleInputChange} 
                    disabled={isSoldOut}
                    className="w-full pb-2 text-sm text-gray-900 bg-transparent focus:outline-none placeholder-gray-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed" 
                    placeholder="john@company.com" 
                    required 
                  />
                </div>

                <div className="relative border-b-2 border-gray-200 focus-within:border-blue-600 transition-colors pt-2">
                  <label htmlFor="phoneNumber" className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 block">Phone Number</label>
                  <input 
                    type="tel" 
                    id="phoneNumber" 
                    value={formData.phoneNumber} 
                    onChange={handleInputChange} 
                    disabled={isSoldOut}
                    className="w-full pb-2 text-sm text-gray-900 bg-transparent focus:outline-none placeholder-gray-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed" 
                    required 
                  />
                </div>

                {estimatedTotal !== null && !isSoldOut && (
                  <div className="flex justify-between items-center py-4 border-t border-gray-100 mt-6">
                    <span className="text-gray-500 font-medium">Estimated Total</span>
                    <span className="text-2xl font-black text-blue-600">₹{estimatedTotal.toLocaleString('en-IN')}<span className="text-sm font-medium text-gray-500">/mo</span></span>
                  </div>
                )}

                <button 
                  type="submit" 
                  disabled={isSubmitting || isSoldOut}
                  className={`relative w-full group overflow-hidden rounded-xl ${estimatedTotal === null ? "mt-8" : "mt-2"} ${(isSubmitting || isSoldOut) ? "opacity-75 cursor-not-allowed" : ""}`}
                >
                  <div className={`absolute inset-0 w-full h-full transition-all duration-500 bg-[length:200%_auto] group-hover:bg-[right_center] ${isSoldOut ? 'bg-gray-400' : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600'}`} />
                  <div className="relative flex items-center justify-center gap-2 py-4 px-6 text-white font-bold tracking-wide">
                    {isSoldOut ? (
                      "Sold Out - No Space Available"
                    ) : isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Initiating Payment...
                      </>
                    ) : (
                      <>
                        Book a Space
                        <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7-7m7 7V3" />
                        </svg>
                      </>
                    )}
                  </div>
                </button>

                <p className="text-[11px] font-medium text-gray-400 mt-4 leading-relaxed text-center">
                  By submitting, you agree to our <a href="#" className="text-blue-600 hover:underline">Terms</a> and <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>.
                </p>
              </form>
            </motion.div>

            {/* Direct Contact Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.4 }} 
              className="bg-transparent rounded-[2rem] p-6 border border-gray-200 flex items-center justify-between group cursor-pointer hover:border-blue-500 hover:bg-blue-50/50 transition-all duration-300"
            >
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 group-hover:text-blue-500 transition-colors">Call us directly</p>
                <a href={`tel:${property.contactPhone || '+917349282552'}`} className="text-lg font-black text-gray-900 group-hover:text-blue-600 transition-colors">
                  {property.contactPhone || '+91 73492 82552'}
                </a>
              </div>
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </main>
  );
}