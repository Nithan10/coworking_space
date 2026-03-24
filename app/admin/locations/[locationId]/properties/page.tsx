"use client";

import React, { useState, useEffect, useCallback, memo } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion'; 
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

// ==========================================
// INTERFACES
// ==========================================
interface Amenity {
  name: string;
  icon?: string;
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

interface Location {
  lat: number;
  lng: number;
  address: string;
  embedUrl?: string;
}

interface Property {
  _id?: string;
  propertyId: string; 
  name: string;
  locality: string;
  badge: string;
  images: string[];   
  capacity: string;
  amenities: any[];   
  exploreLink: string;
  availableSeats: number; 
  availableNow: boolean;
  status: string;
  highlightAmenities?: string[];
  description: string;
  city: string;
  cityId: string;
  pricingPlans: PricingPlan[];
  standardWorkplaces: Workplace[];
  standardServices: Service[];
  location: Location;
  contactPhone: string;
}

interface Hero {
  backgroundImage: string;
  badge: string;
  heading: string;
  subheading: string;
}

interface EmptyState {
  title: string;
  message: string;
}

interface LocationData {
  _id?: string;
  cityId: string;
  cityName: string;
  cityDisplayName: string;
  slug: string;
  hero: Hero;
  localities: string[];
  properties: Property[];
  emptyState: EmptyState;
  status: string;
}

// ==========================================
// UTILS & ANIMATIONS
// ==========================================
const isImageIcon = (iconStr?: string) => {
  if (!iconStr) return false;
  return iconStr.startsWith('http') || iconStr.startsWith('/') || iconStr.includes('.png') || iconStr.includes('.jpg') || iconStr.includes('.jpeg') || iconStr.includes('.svg');
};

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 250, damping: 25 } },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } }
};

const inputClassName = "w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 text-zinc-900 placeholder-zinc-400 transition-all duration-200 shadow-sm font-medium text-sm";
const labelClassName = "block text-[13px] font-bold text-zinc-700 mb-2";
const cardClassName = "bg-white rounded-2xl border border-zinc-200 p-6 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] transition-all duration-300 relative overflow-hidden";
const sectionHeaderClass = "text-sm font-bold text-zinc-900 uppercase tracking-wide mb-6 flex items-center gap-2 border-b border-zinc-100 pb-3";

// Default property template
const defaultProperty: Property = {
  propertyId: '',
  name: '',
  locality: '',
  city: '',
  cityId: '',
  description: '',
  images: [],
  amenities: [],
  highlightAmenities: ['Green Building', 'Fast WiFi', 'Pantry', 'Access Control'],
  badge: '',
  capacity: '',
  exploreLink: '',
  status: 'published',
  availableNow: true,
  availableSeats: 100, 
  pricingPlans: [
    {
      id: "hot-desk",
      name: "Hot Desk",
      price: "₹4,999",
      numericPrice: 4999,
      duration: "/month",
      features: [
        { name: "High-Speed Enterprise Wi-Fi", value: true },
        { name: "Unlimited Tea & Coffee", value: true }
      ]
    }
  ],
  standardWorkplaces: [],
  standardServices: [],
  location: {
    lat: 12.9334335,
    lng: 77.6836423,
    address: "Bengaluru",
    embedUrl: ""
  },
  contactPhone: "+91 73492 82552"
};

// ==========================================
// PREVIEW MODAL COMPONENT
// ==========================================
const PreviewModal = memo(({ data, onClose }: { data: LocationData; onClose: () => void }) => {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [viewMode, setViewMode] = useState<'city' | 'property'>('city');
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [hoveredPlan, setHoveredPlan] = useState<number | null>(1);

  useEffect(() => {
    setActiveImageIndex(0);
    setHoveredPlan(1);
  }, [selectedProperty]);

  if (!data) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-zinc-900/60 z-[100] flex items-center justify-center p-4 overflow-hidden backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        className="bg-white rounded-2xl max-w-[1400px] w-full h-[95vh] flex flex-col shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-white border-b border-zinc-200 px-6 py-4 flex justify-between items-center z-50 flex-shrink-0">
          <div className="flex items-center gap-4">
            {viewMode === 'property' && (
              <button
                onClick={() => {
                  setSelectedProperty(null);
                  setViewMode('city');
                }}
                className="p-2 hover:bg-zinc-100 text-zinc-600 rounded-lg transition-colors flex items-center gap-2 font-bold text-sm"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                </svg>
                Back to City
              </button>
            )}
            <h2 className="text-xl font-bold text-zinc-900 tracking-tight">
              Live Preview: {viewMode === 'city' ? data.cityDisplayName : selectedProperty?.name}
            </h2>
            <span className="px-2 py-1 bg-amber-100 text-amber-800 text-[10px] font-bold rounded-md uppercase tracking-wider border border-amber-200">Preview Mode</span>
          </div>
          <button onClick={onClose} className="text-zinc-400 hover:text-white hover:bg-red-500 text-2xl w-10 h-10 flex items-center justify-center rounded-full transition-colors">×</button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto flex-1 bg-[#FAFAFA] relative">
          {viewMode === 'city' ? (
            <div className="p-6 md:p-10 max-w-5xl mx-auto">
              {/* City Hero Section */}
              <div className="relative h-[350px] rounded-[2.5rem] overflow-hidden mb-12 shadow-xl bg-zinc-900">
                <motion.img 
                  key={data.hero?.backgroundImage}
                  initial={{ scale: 1.1, opacity: 0.5 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  src={data.hero?.backgroundImage || 'https://via.placeholder.com/1200x600'} 
                  alt={data.cityName}
                  className="w-full h-full object-cover opacity-60"
                  onError={(e) => (e.target as HTMLImageElement).src = 'https://via.placeholder.com/1200x600'}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-transparent" />
                
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center px-6">
                    <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-1.5 mb-6">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                      <span className="text-xs font-bold text-white uppercase tracking-[0.2em]">{(data.properties || []).length} Locations Available</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-4 drop-shadow-2xl">
                      {data.hero?.heading || data.cityDisplayName}
                    </h1>
                    <p className="text-base md:text-xl text-zinc-200 font-medium max-w-2xl mx-auto drop-shadow-md">
                      {data.hero?.subheading || 'Discover premium workspaces tailored for enterprises and growing startups.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Localities Filter Preview */}
              {(data.localities || []).length > 0 && (
                <div className="mb-10 flex justify-center">
                  <div className="bg-white/80 backdrop-blur-xl border border-zinc-200 shadow-sm rounded-full p-2 inline-flex gap-1 overflow-x-auto max-w-full">
                    {data.localities.slice(0, 5).map((locality) => (
                      <span key={locality} className={`px-6 py-2.5 rounded-full text-sm font-bold whitespace-nowrap cursor-pointer transition-colors ${locality === 'All' ? 'bg-zinc-900 text-white shadow-md' : 'text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900'}`}>
                        {locality}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Properties Grid Preview */}
              {(!data.properties || data.properties.length === 0) ? (
                <div className="bg-white rounded-[2rem] p-12 text-center shadow-sm border border-zinc-100">
                  <h3 className="text-2xl font-bold text-zinc-900 mb-2">{data.emptyState?.title || 'Coming Soon'}</h3>
                  <p className="text-zinc-500">{data.emptyState?.message}</p>
                </div>
              ) : (
                <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {data.properties.map((property, idx) => {
                    const isSoldOut = (property.availableSeats !== undefined && property.availableSeats <= 0) || property.availableNow === false;
                    
                    return (
                      <motion.div
                        key={property.propertyId || idx}
                        variants={itemVariants}
                        layout
                        className="group bg-white rounded-[2rem] p-4 border border-zinc-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 cursor-pointer"
                        onClick={() => { setSelectedProperty(property); setViewMode('property'); }}
                      >
                        <div className="relative h-[280px] w-full rounded-[1.5rem] overflow-hidden mb-5 bg-zinc-100">
                          <div className="absolute inset-0 bg-zinc-900/10 group-hover:bg-transparent transition-colors duration-500 z-10" />
                          <img
                            src={property.images?.[0] || 'https://via.placeholder.com/800x600'}
                            alt={property.name}
                            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-[6s] ease-out"
                            onError={(e) => (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x600'}
                          />
                          {property.badge && (
                            <div className="absolute top-4 left-4 z-20">
                              <span className="px-3 py-1.5 bg-white/95 backdrop-blur-sm rounded-full text-[10px] font-black tracking-widest uppercase text-indigo-600 shadow-sm">
                                {property.badge}
                              </span>
                            </div>
                          )}
                          <div className="absolute top-4 right-4 z-20">
                            <span className={`px-3 py-1.5 backdrop-blur-md rounded-full text-[11px] font-bold text-white border border-white/20 shadow-sm ${isSoldOut ? 'bg-red-600/90' : 'bg-zinc-900/80'}`}>
                              {isSoldOut ? 'Sold Out' : property.capacity}
                            </span>
                          </div>
                          
                          {/* Hover Amenities Preview */}
                          <div className="absolute bottom-0 left-0 right-0 p-4 z-20 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out bg-gradient-to-t from-black/80 via-black/40 to-transparent pt-12">
                            <div className="flex flex-wrap gap-2">
                              {(property.highlightAmenities || property.amenities?.map(a => a.name) || []).slice(0, 3).map((amenity, aIdx) => (
                                <span key={aIdx} className="px-2.5 py-1 bg-white/20 backdrop-blur-md border border-white/20 rounded-lg text-[10px] font-bold text-white tracking-wide">
                                  {amenity}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="px-4 pb-2">
                          <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1">{property.locality}</p>
                          <h3 className="text-2xl font-black text-zinc-900 group-hover:text-indigo-600 transition-colors line-clamp-1">{property.name}</h3>
                          <div className="w-full mt-6 py-3.5 bg-zinc-50 group-hover:bg-indigo-50 text-zinc-500 group-hover:text-indigo-600 rounded-xl text-sm font-bold text-center transition-colors">
                            Explore Workspace
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>
              )}
            </div>
          ) : (
            selectedProperty && (() => {
              const isSoldOut = (selectedProperty.availableSeats !== undefined && selectedProperty.availableSeats <= 0) || selectedProperty.availableNow === false;
              const displayBadgeText = isSoldOut 
                ? 'Sold Out / Unavailable' 
                : (selectedProperty.availableSeats !== undefined ? `${selectedProperty.availableSeats} Seats Left` : selectedProperty.capacity);

              return (
                <div className="max-w-[1400px] mx-auto py-10 px-6 md:px-10">
                  {/* Detailed Property Layout */}
                  <div className="flex items-center space-x-2 text-sm text-zinc-500 font-medium mb-8 flex-wrap">
                    <span className="cursor-pointer hover:text-indigo-600 transition-colors">Locations</span>
                    <span>/</span>
                    <span className="cursor-pointer hover:text-indigo-600 transition-colors capitalize" onClick={() => setViewMode('city')}>{data.cityDisplayName}</span>
                    <span>/</span>
                    <span className="text-zinc-900 font-bold line-clamp-1">{selectedProperty.name}</span>
                  </div>

                  <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">
                    {/* Left Column */}
                    <div className="w-full lg:w-[65%] flex flex-col gap-12">
                      <div>
                        <div className={`inline-flex items-center space-x-2 border rounded-full px-3 py-1 mb-4 shadow-sm ${isSoldOut ? 'bg-red-50 border-red-100' : 'bg-emerald-50 border-emerald-100'}`}>
                          <span className={`w-2 h-2 rounded-full ${isSoldOut ? 'bg-red-500' : 'bg-emerald-500 animate-pulse'}`} />
                          <span className={`text-[11px] font-bold uppercase tracking-widest ${isSoldOut ? 'text-red-700' : 'text-emerald-700'}`}>{displayBadgeText}</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-zinc-900 mb-3 tracking-tight">{selectedProperty.name}</h1>
                        <p className="text-lg text-zinc-500 font-medium flex items-center gap-2">
                          <svg className="w-5 h-5 text-indigo-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span className="line-clamp-1">{selectedProperty.locality}, {selectedProperty.city || data.cityName}</span>
                        </p>
                      </div>

                      {/* Interactive Image Gallery */}
                      {selectedProperty.images && selectedProperty.images.length > 0 && (
                        <div className="flex flex-col gap-4">
                          <div className="w-full h-[400px] md:h-[550px] rounded-[2rem] overflow-hidden relative shadow-lg bg-zinc-100 border border-zinc-200">
                            <AnimatePresence mode="wait">
                              <motion.img 
                                key={activeImageIndex}
                                src={selectedProperty.images[activeImageIndex]}
                                initial={{ opacity: 0, scale: 1.02 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.4 }}
                                className="w-full h-full object-cover absolute inset-0"
                                alt="Gallery Image"
                              />
                            </AnimatePresence>
                          </div>
                          <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
                            {selectedProperty.images.map((img, idx) => {
                              const isActive = activeImageIndex === idx;
                              return (
                                <button 
                                  key={idx} 
                                  onClick={() => setActiveImageIndex(idx)}
                                  className={`relative flex-shrink-0 w-28 h-20 md:w-32 md:h-24 rounded-xl overflow-hidden transition-all duration-300 ${
                                    isActive ? "ring-4 ring-indigo-600 ring-offset-2 scale-95" : "opacity-60 hover:opacity-100 hover:scale-105"
                                  }`}
                                >
                                  <img src={img} className="w-full h-full object-cover bg-zinc-100" alt={`Thumb ${idx + 1}`} />
                                  {isActive && <div className="absolute inset-0 bg-indigo-600/20" />}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* About Description */}
                      {selectedProperty.description && (
                        <section>
                          <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            </div>
                            <h2 className="text-3xl font-bold text-zinc-900">About the Space</h2>
                          </div>
                          <div className="prose prose-lg text-zinc-600 font-medium leading-relaxed max-w-none">
                            {selectedProperty.description.split('\n\n').map((paragraph, idx) => (
                              <p key={idx} className="mb-4">{paragraph}</p>
                            ))}
                          </div>
                        </section>
                      )}

                      {/* Premium Amenities Grid */}
                      {selectedProperty.amenities && selectedProperty.amenities.length > 0 && (
                        <section className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-zinc-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                          <div className="mb-8">
                            <h2 className="text-3xl font-bold text-zinc-900 mb-2">Premium Amenities</h2>
                            <p className="text-sm text-zinc-500 font-medium uppercase tracking-widest">Included in this building</p>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-y-10 gap-x-6">
                            {selectedProperty.amenities.map((amenity, idx) => (
                              <div key={idx} className="flex flex-col items-center text-center group">
                                <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-3xl mb-4 border border-gray-100 group-hover:scale-110 group-hover:shadow-md transition-all duration-300 overflow-hidden text-indigo-500">
                                  {isImageIcon(amenity.icon) ? (
                                    <img src={amenity.icon} alt={amenity.name} className="w-8 h-8 object-contain" />
                                  ) : (
                                    <span>{amenity.icon || '✦'}</span>
                                  )}
                                </div>
                                <span className="text-zinc-900 font-bold text-sm leading-tight">{amenity.name}</span>
                              </div>
                            ))}
                          </div>
                        </section>
                      )}

                      {/* Workplaces & Services */}
                      {(selectedProperty.standardWorkplaces?.length > 0 || selectedProperty.standardServices?.length > 0) && (
                        <section className="pt-4 pb-4">
                          <h2 className="text-3xl font-bold text-[#0B1120] mb-10 tracking-tight">Also available here</h2>
                          
                          {selectedProperty.standardWorkplaces && selectedProperty.standardWorkplaces.length > 0 && (
                            <div className="mb-10">
                              <h3 className="text-[13px] font-bold text-[#5A45FF] uppercase tracking-[0.15em] mb-4 pl-1">Workplaces</h3>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                {selectedProperty.standardWorkplaces.map((item, idx) => (
                                  <div key={idx} className="flex items-start gap-4 p-6 rounded-[1.5rem] border border-gray-100 bg-white shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-[0_10px_30px_rgba(0,0,0,0.06)] hover:border-blue-100 transition-all duration-300 cursor-pointer group">
                                    <div className="w-14 h-14 bg-[#F0F4FF] rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform duration-300">
                                      <img src={item.icon} alt={item.title} className="w-7 h-7 object-contain" />
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

                          {selectedProperty.standardServices && selectedProperty.standardServices.length > 0 && (
                            <div>
                              <h3 className="text-[13px] font-bold text-[#5A45FF] uppercase tracking-[0.15em] mb-4 pl-1">Additional Services</h3>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                {selectedProperty.standardServices.map((item, idx) => (
                                  <div key={idx} className="flex items-start gap-4 p-6 rounded-[1.5rem] border border-gray-100 bg-white shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-[0_10px_30px_rgba(0,0,0,0.06)] hover:border-blue-100 transition-all duration-300 cursor-pointer group">
                                    <div className="w-14 h-14 bg-[#FFF5EE] rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform duration-300">
                                      <img src={item.icon} alt={item.title} className="w-7 h-7 object-contain" />
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
                        </section>
                      )}

                      {/* Interactive Pricing Plans */}
                      {selectedProperty.pricingPlans && selectedProperty.pricingPlans.length > 0 && (
                        <section className="pt-8 pb-4">
                          <div className="mb-10">
                            <h2 className="text-3xl md:text-4xl font-black text-zinc-900 tracking-tight mb-2">Transparent Pricing</h2>
                            <p className="text-zinc-500 font-medium">Simple, scalable plans preview.</p>
                          </div>
                          <div className="hidden lg:flex w-full relative">
                            <div className="w-1/4 pt-[140px] pb-8 pr-6 border-r border-zinc-100">
                              {selectedProperty.pricingPlans[0]?.features.map((f, idx) => (
                                <div key={idx} className="h-[60px] flex items-center text-[13px] font-bold text-zinc-500 border-b border-transparent">{f.name}</div>
                              ))}
                            </div>
                            <div className="w-3/4 flex relative">
                              {selectedProperty.pricingPlans.slice(0, 3).map((plan, pIdx) => {
                                const isHovered = hoveredPlan === pIdx;
                                return (
                                  <div
                                    key={pIdx}
                                    onMouseEnter={() => setHoveredPlan(pIdx)}
                                    onMouseLeave={() => setHoveredPlan(1)}
                                    className={`flex-1 flex flex-col rounded-[2.5rem] transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${
                                      isHovered ? 'bg-indigo-600 text-white scale-[1.04] -translate-y-2 shadow-2xl z-20' : 'bg-transparent text-zinc-900 z-10'
                                    }`}
                                  >
                                    <div className={`h-[140px] flex flex-col items-center justify-center p-6 border-b transition-colors duration-500 ${isHovered ? 'border-white/20' : 'border-zinc-100'}`}>
                                      <h3 className="text-xl font-bold tracking-tight mb-1">{plan.name}</h3>
                                      <div className="flex items-baseline gap-1 mb-4">
                                        <span className="text-xl font-black">{plan.price}</span>
                                        <span className={`text-xs font-medium ${isHovered ? 'text-indigo-200' : 'text-zinc-500'}`}>{plan.duration}</span>
                                      </div>
                                      <button disabled className={`px-8 py-2.5 rounded-full text-sm font-bold transition-colors cursor-not-allowed ${isHovered ? 'bg-white/20 text-white/50' : 'bg-zinc-200 text-zinc-400'}`}>
                                        Preview
                                      </button>
                                    </div>
                                    <div className="flex flex-col pb-8">
                                      {plan.features.map((feature, fIdx) => (
                                        <div key={fIdx} className={`h-[60px] flex items-center justify-center border-b transition-colors duration-500 ${isHovered ? 'border-white/10' : 'border-zinc-100'}`}>
                                          {typeof feature.value === 'boolean' ? (
                                            feature.value ? (
                                              <div className={`w-5 h-5 rounded-full flex items-center justify-center ${isHovered ? 'bg-white text-indigo-600' : 'bg-zinc-900 text-white'}`}>
                                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3.5} d="M5 13l4 4L19 7" /></svg>
                                              </div>
                                            ) : <span className={isHovered ? 'text-white/30' : 'text-zinc-300'}>—</span>
                                          ) : <span className={`text-sm font-bold ${isHovered ? 'text-white' : 'text-zinc-900'}`}>{feature.value}</span>}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </section>
                      )}

                      {/* Map Location */}
                      {selectedProperty.location && (
                        <section className="mb-12">
                          <h2 className="text-3xl font-bold text-gray-900 mb-2">Location</h2>
                          <p className="text-base text-gray-500 mb-6 font-medium flex items-center gap-2">
                            <span className="w-2 h-2 bg-blue-600 rounded-full" />
                            {selectedProperty.location.address || `${selectedProperty.locality}, ${selectedProperty.city}`}
                          </p>
                          <div className="w-full h-[450px] rounded-[2.5rem] overflow-hidden border border-gray-200 shadow-[0_10px_30px_rgb(0,0,0,0.05)] relative group">
                            <div className="absolute inset-0 bg-blue-900/5 pointer-events-none group-hover:bg-transparent transition-colors duration-500" />
                            <iframe 
                              src={selectedProperty.location.embedUrl || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.599617305942!2d77.6836423!3d12.9334335!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae13cd88b9abf5%3A0xc3f920da7835158!2sRMZ%20Ecoworld!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"}
                              width="100%" height="100%" style={{ border: 0 }} allowFullScreen={false} loading="lazy" referrerPolicy="no-referrer-when-downgrade"
                              className="grayscale opacity-90 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
                            ></iframe>
                          </div>
                        </section>
                      )}
                    </div>

                    {/* Right Column - Sticky Booking Form Preview */}
                    <div className="w-full lg:w-[35%] lg:sticky lg:top-8 flex flex-col gap-6 relative z-20 pb-12">
                      <div className="bg-white rounded-[2rem] p-8 lg:p-10 border border-zinc-100 shadow-xl relative overflow-hidden">
                        <div className={`absolute top-0 left-0 right-0 h-1.5 ${isSoldOut ? 'bg-red-500' : 'bg-gradient-to-r from-indigo-400 via-indigo-600 to-indigo-400'}`} />
                        
                        <div className="absolute top-4 right-4 px-2 py-1 bg-amber-100 text-amber-800 text-[10px] font-bold rounded-md uppercase tracking-wider border border-amber-200">
                          Preview
                        </div>

                        <h3 className="text-2xl font-black text-zinc-900 mb-2 tracking-tight">Experience {selectedProperty.name}</h3>
                        <p className="text-sm text-zinc-500 font-medium mb-8">Schedule a tour (Mock Preview)</p>

                        <div className="space-y-6 opacity-70 pointer-events-none">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="relative border-b-2 border-zinc-200 pt-2">
                              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1 block">Seat Type</label>
                              <select disabled className="w-full pb-2 text-sm text-zinc-900 bg-transparent font-bold"><option>Select Plan</option></select>
                            </div>
                            <div className="relative border-b-2 border-zinc-200 pt-2">
                              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1 block">Seats</label>
                              <input disabled type="number" placeholder="1" className="w-full pb-2 text-sm text-zinc-900 bg-transparent font-bold" />
                            </div>
                          </div>
                          <div className="relative border-b-2 border-zinc-200 pt-2">
                            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1 block">Starting Date</label>
                            <input disabled type="date" className="w-full pb-2 text-sm text-zinc-500 bg-transparent font-bold" />
                          </div>
                          <button disabled className={`relative w-full rounded-xl mt-4 h-[56px] flex items-center justify-center font-bold tracking-wide text-white ${isSoldOut ? 'bg-zinc-400' : 'bg-indigo-600'}`}>
                            {isSoldOut ? "Sold Out" : "Book a Space"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()
          )}
        </div>
      </motion.div>
    </motion.div>
  );
});

PreviewModal.displayName = 'PreviewModal';

// ==========================================
// MAIN ADMIN COMPONENT
// ==========================================
const PropertiesPage = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const locationId = params.locationId as string;
  const cityName = searchParams.get('cityName') || 'Location';
  
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState<LocationData | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [localities, setLocalities] = useState<string[]>([]);
  const [locationCityId, setLocationCityId] = useState<string>('');
  const [locationCityName, setLocationCityName] = useState<string>('');
  const [propertyModalOpen, setPropertyModalOpen] = useState(false);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [propertyToDelete, setPropertyToDelete] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('basic');
  
  // Custom Toast Notification State
  const [toast, setToast] = useState<{ show: boolean, message: string, type: 'success' | 'error' } | null>(null);

  // Property form states
  const [propertyForm, setPropertyForm] = useState<Property>(defaultProperty);
  const [localHighlightAmenities, setLocalHighlightAmenities] = useState<string>("");
  const [newAmenity, setNewAmenity] = useState('');
  const [newAmenityIcon, setNewAmenityIcon] = useState('');
  const [newImage, setNewImage] = useState('');
  const [newWorkplace, setNewWorkplace] = useState({ title: '', desc: '', icon: '' });
  const [newService, setNewService] = useState({ title: '', desc: '', icon: '' });
  const [newPlan, setNewPlan] = useState({ id: '', name: '', price: '', numericPrice: 0, duration: '/month' });

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    setToken(storedToken);
  }, []);

  useEffect(() => {
    if (token && locationId) {
      fetchLocation();
    }
  }, [token, locationId]);

  // Sync highlight amenities when modal opens
  useEffect(() => {
    if (propertyModalOpen) {
      setLocalHighlightAmenities((propertyForm.highlightAmenities || []).join(', '));
    }
  }, [propertyModalOpen, propertyForm.highlightAmenities]);

  const showToast = useCallback((message: string, type: 'success' | 'error' = 'success', duration = 3000) => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast(null);
    }, duration);
  }, []);

  const fetchLocation = async () => {
    try {
      const response = await fetch(`https://coworking-space-backend.onrender.com/api/locations/${locationId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
      });
      const data = await response.json();
      if (data.success) {
        setLocation(data.data);
        setProperties(data.data.properties || []);
        setLocalities(data.data.localities || ['All']);
        setLocationCityId(data.data.cityId || '');
        setLocationCityName(data.data.cityDisplayName || '');
      }
    } catch (error) {
      console.error('Error fetching location:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePropertyInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setPropertyForm(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof Property] as any),
          [child]: value
        }
      }));
    } else if (name === 'availableNow') {
      setPropertyForm(prev => ({ ...prev, availableNow: value === 'true' }));
    } else if (name === 'availableSeats') {
      const rawValue = value === '' ? '' : parseInt(value, 10);
      const seats = rawValue === '' ? 0 : Math.max(0, rawValue as number);
      
      setPropertyForm(prev => ({ 
        ...prev, 
        availableSeats: seats,
        availableNow: seats > 0, 
        capacity: seats > 0 ? `${seats} Seats Left` : 'Sold Out' 
      }));
    } else if (name === 'mainImage') {
      setPropertyForm(prev => ({
        ...prev,
        images: [value, ...(prev.images?.slice(1) || [])]
      }));
    } else {
      setPropertyForm(prev => ({ ...prev, [name]: value }));
    }
  }, []);

  const handleAmenityNameChange = useCallback((value: string) => setNewAmenity(value), []);
  const handleAmenityIconChange = useCallback((value: string) => setNewAmenityIcon(value), []);
  const addAmenityWithIcon = useCallback(() => {
    if (newAmenity && newAmenityIcon) {
      setPropertyForm(prev => ({ ...prev, amenities: [...prev.amenities, { name: newAmenity, icon: newAmenityIcon }] }));
      setNewAmenity(''); setNewAmenityIcon('');
    }
  }, [newAmenity, newAmenityIcon]);
  const removeAmenityWithIcon = useCallback((index: number) => {
    setPropertyForm(prev => ({ ...prev, amenities: prev.amenities.filter((_, i) => i !== index) }));
  }, []);

  const handleImageChange = useCallback((value: string) => setNewImage(value), []);
  const addImage = useCallback(() => {
    if (newImage) {
      setPropertyForm(prev => ({ ...prev, images: [...(prev.images || []), newImage] }));
      setNewImage('');
    }
  }, [newImage]);
  const removeImage = useCallback((index: number) => {
    setPropertyForm(prev => ({ ...prev, images: (prev.images || []).filter((_, i) => i !== index) }));
  }, []);

  const handleWorkplaceChange = useCallback((field: string, value: string) => setNewWorkplace(prev => ({ ...prev, [field]: value })), []);
  const addWorkplace = useCallback(() => {
    if (newWorkplace.title && newWorkplace.desc && newWorkplace.icon) {
      setPropertyForm(prev => ({ ...prev, standardWorkplaces: [...(prev.standardWorkplaces || []), newWorkplace] }));
      setNewWorkplace({ title: '', desc: '', icon: '' });
    }
  }, [newWorkplace]);
  const removeWorkplace = useCallback((index: number) => {
    setPropertyForm(prev => ({ ...prev, standardWorkplaces: (prev.standardWorkplaces || []).filter((_, i) => i !== index) }));
  }, []);

  const handleServiceChange = useCallback((field: string, value: string) => setNewService(prev => ({ ...prev, [field]: value })), []);
  const addService = useCallback(() => {
    if (newService.title && newService.desc && newService.icon) {
      setPropertyForm(prev => ({ ...prev, standardServices: [...(prev.standardServices || []), newService] }));
      setNewService({ title: '', desc: '', icon: '' });
    }
  }, [newService]);
  const removeService = useCallback((index: number) => {
    setPropertyForm(prev => ({ ...prev, standardServices: (prev.standardServices || []).filter((_, i) => i !== index) }));
  }, []);

  const handlePlanChange = useCallback((field: string, value: string | number) => setNewPlan(prev => ({ ...prev, [field]: value })), []);
  const addPlan = useCallback(() => {
    if (newPlan.name && newPlan.price) {
      setPropertyForm(prev => ({ ...prev, pricingPlans: [...(prev.pricingPlans || []), { ...newPlan, features: [] }] }));
      setNewPlan({ id: '', name: '', price: '', numericPrice: 0, duration: '/month' });
    }
  }, [newPlan]);
  const removePlan = useCallback((index: number) => {
    setPropertyForm(prev => ({ ...prev, pricingPlans: (prev.pricingPlans || []).filter((_, i) => i !== index) }));
  }, []);

  const handleFeatureChange = useCallback((planIndex: number, featureIndex: number, field: string, value: string | boolean) => {
    setPropertyForm(prev => {
      const newPlans = [...(prev.pricingPlans || [])];
      if (featureIndex === -1) {
        if (field === 'price') newPlans[planIndex].price = value as string;
        if (field === 'numericPrice') newPlans[planIndex].numericPrice = value as unknown as number;
      } else {
        if (field === 'name') newPlans[planIndex].features[featureIndex].name = value as string;
        if (field === 'value') newPlans[planIndex].features[featureIndex].value = value;
      }
      return { ...prev, pricingPlans: newPlans };
    });
  }, []);

  // --- FIXED: DEFAULT TO BOOLEAN TRUE ---
  const addFeature = useCallback((planIndex: number) => {
    setPropertyForm(prev => {
      const newPlans = [...(prev.pricingPlans || [])];
      newPlans[planIndex].features.push({ name: '', value: true }); // Default to true to trigger the Yes/No Dropdown
      return { ...prev, pricingPlans: newPlans };
    });
  }, []);

  const removeFeature = useCallback((planIndex: number, featureIndex: number) => {
    setPropertyForm(prev => {
      const newPlans = [...(prev.pricingPlans || [])];
      newPlans[planIndex].features = newPlans[planIndex].features.filter((_, i) => i !== featureIndex);
      return { ...prev, pricingPlans: newPlans };
    });
  }, []);

  const openAddPropertyModal = useCallback(() => {
    setEditingProperty(null);
    setPropertyForm({
      ...defaultProperty,
      city: locationCityName,
      cityId: locationCityId
    });
    setNewAmenity(''); setNewAmenityIcon(''); setNewImage('');
    setNewWorkplace({ title: '', desc: '', icon: '' });
    setNewService({ title: '', desc: '', icon: '' });
    setNewPlan({ id: '', name: '', price: '', numericPrice: 0, duration: '/month' });
    setActiveTab('basic');
    setPropertyModalOpen(true);
  }, [locationCityName, locationCityId]);

  const openEditPropertyModal = useCallback((property: Property) => {
    setEditingProperty(property);
    setPropertyForm({ ...property, availableSeats: property.availableSeats ?? 0 });
    setActiveTab('basic');
    setPropertyModalOpen(true);
  }, []);

  const savePropertyConfig = useCallback(async () => {
    if (!propertyForm.name || !propertyForm.propertyId) {
      showToast("Property ID and Name are required.", 'error');
      return;
    }
    
    if (!location) return;

    const exploreLink = locationCityId && propertyForm.propertyId 
      ? `/locations/${locationCityId}/${propertyForm.propertyId}` 
      : '';
    
    const updatedProperty = { ...propertyForm, exploreLink, city: locationCityName, cityId: locationCityId };
    
    let newPropertiesList = [...properties];
    if (editingProperty) {
      const idx = newPropertiesList.findIndex(p => p.propertyId === editingProperty.propertyId);
      if (idx > -1) {
        newPropertiesList[idx] = updatedProperty;
      } else {
        newPropertiesList.push(updatedProperty);
      }
    } else {
      const existingIdx = newPropertiesList.findIndex(p => p.propertyId === propertyForm.propertyId);
      if (existingIdx > -1) {
        newPropertiesList[existingIdx] = updatedProperty;
      } else {
        newPropertiesList.push(updatedProperty);
      }
    }

    newPropertiesList = newPropertiesList
      .filter(p => p.propertyId && p.propertyId.trim() !== '')
      .map(p => ({
        ...p,
        city: p.city || locationCityName,
        cityId: p.cityId || locationCityId
      }));

    try {
      const response = await fetch(`https://coworking-space-backend.onrender.com/api/locations/${locationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...location,
          properties: newPropertiesList 
        })
      });
      
      const data = await response.json();
      
      if (!data.success) {
        showToast(data.message || 'Error auto-saving property. Check inputs.', 'error');
        return; 
      }

      setProperties(newPropertiesList);
      setPropertyModalOpen(false);
      showToast("Property changes buffered temporarily.");

    } catch (err) {
      console.error("Auto-save failed", err);
      showToast("Network error occurred while saving.", 'error');
    }
  }, [propertyForm, editingProperty, locationCityId, locationCityName, location, locationId, token, properties, showToast]);

  const initiateDelete = useCallback((propertyId: string) => {
    setPropertyToDelete(propertyId);
  }, []);

  const executeDelete = useCallback(async () => {
    if (!propertyToDelete || !location) return;

    const newPropertiesList = properties
      .filter(p => p.propertyId !== propertyToDelete && p.propertyId.trim() !== '')
      .map(p => ({
          ...p,
          city: p.city || locationCityName,
          cityId: p.cityId || locationCityId
      }));
    
    try {
      const response = await fetch(`https://coworking-space-backend.onrender.com/api/locations/${locationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...location,
          properties: newPropertiesList 
        })
      });
      
      const data = await response.json();
      if (data.success) {
        setProperties(newPropertiesList); 
        showToast("Property deleted successfully.");
      } else {
        showToast("Failed to delete property from database.", 'error');
      }
    } catch (err) {
      console.error("Auto-delete failed", err);
      showToast("Error communicating with server.", 'error');
    }
    setPropertyToDelete(null);
  }, [properties, location, locationId, token, locationCityName, locationCityId, showToast, propertyToDelete]);

  const handleSaveAll = useCallback(async () => {
    if (!location) return;
    
    const cleanProperties = properties
      .filter(p => p.propertyId && p.propertyId.trim() !== '')
      .map(p => ({
          ...p,
          city: p.city || locationCityName,
          cityId: p.cityId || locationCityId
      }));
    
    try {
      const response = await fetch(`https://coworking-space-backend.onrender.com/api/locations/${locationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...location,
          properties: cleanProperties
        })
      });

      const data = await response.json();

      if (data.success) {
        showToast('Properties configuration saved successfully!', 'success');
        
        setTimeout(() => {
          router.push('/admin/locations');
        }, 1500);

      } else {
        showToast(data.message || 'Error saving properties', 'error');
      }
    } catch (error) {
      console.error('Error saving properties:', error);
      showToast('Error saving properties', 'error');
    }
  }, [location, locationId, properties, token, router, locationCityName, locationCityId, showToast]);

  const handlePreview = useCallback(() => {
    if (location) {
      setPreviewModalOpen(true);
    }
  }, [location]);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 p-6 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-zinc-500 font-semibold tracking-wide">Loading workspace data...</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'basic', name: 'Basic Info', icon: '📋' },
    { id: 'images', name: 'Images', icon: '🖼️' },
    { id: 'amenities', name: 'Amenities', icon: '✨' },
    { id: 'workplaces', name: 'Workplaces', icon: '💼' },
    { id: 'services', name: 'Services', icon: '🛠️' },
    { id: 'pricing', name: 'Pricing', icon: '💰' },
    { id: 'location', name: 'Location', icon: '📍' }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24 relative overflow-hidden">
      
      {/* Toast Notification Container */}
      <AnimatePresence>
        {toast?.show && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-10 right-10 z-[100] flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl backdrop-blur-md border"
            style={{
              backgroundColor: toast.type === 'success' ? 'rgba(24, 24, 27, 0.95)' : 'rgba(127, 29, 29, 0.95)',
              borderColor: toast.type === 'success' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(248, 113, 113, 0.2)'
            }}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-inner ${toast.type === 'success' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
              {toast.type === 'success' ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
              )}
            </div>
            <p className="text-white font-bold text-[13px] tracking-wide pr-2">{toast.message}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="bg-white border-b border-zinc-200 px-6 py-8 mb-8">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
          <div>
            <Link 
              href="/admin/locations"
              className="text-sm font-semibold text-zinc-500 hover:text-zinc-900 transition-colors flex items-center gap-2 mb-3"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Locations
            </Link>
            <h1 className="text-3xl font-black text-zinc-900 tracking-tight">
              {cityName} Properties
            </h1>
            <p className="text-zinc-500 font-medium mt-1">Configure and manage workspace listings for this city.</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handlePreview}
              className="bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-50 px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-sm transition-all"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Live Preview
            </button>
            <button
              onClick={openAddPropertyModal}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-sm shadow-blue-600/20 transition-all"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Property
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 overflow-hidden flex flex-col">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-50/50 border-b border-zinc-200">
                  <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider w-1/4">Property</th>
                  <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Locality</th>
                  <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Inventory</th>
                  <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {properties.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="w-16 h-16 bg-zinc-50 rounded-2xl flex items-center justify-center mb-4 border border-zinc-100">
                          <svg className="w-8 h-8 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                        </div>
                        <p className="text-zinc-900 font-bold text-lg mb-1">No Properties Found</p>
                        <p className="text-zinc-500 text-sm mb-6 max-w-sm">This location doesn't have any workspace listings yet. Add a new property to get started.</p>
                        <button
                          onClick={openAddPropertyModal}
                          className="bg-white border border-zinc-200 hover:border-zinc-300 text-zinc-900 px-5 py-2.5 rounded-lg font-bold text-sm flex items-center gap-2 shadow-sm transition-all"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                          Add First Property
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  properties.map((property, idx) => {
                    const uniqueKey = property._id || property.propertyId || `prop-${idx}-${Date.now()}`;
                    return (
                      <tr key={uniqueKey} className="hover:bg-zinc-50/50 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-xl bg-zinc-100 flex items-center justify-center overflow-hidden border border-zinc-200/60 flex-shrink-0">
                              {property.images && property.images[0] ? (
                                <img 
                                  src={property.images[0]} 
                                  alt={property.name}
                                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                  onError={(e) => (e.target as HTMLImageElement).src = 'https://via.placeholder.com/40x40'}
                                />
                              ) : (
                                <svg className="w-5 h-5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                              )}
                            </div>
                            <div>
                              <span className="font-bold text-zinc-900 block">{property.name}</span>
                              <span className="font-mono text-xs text-zinc-500">{property.propertyId}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm font-semibold text-zinc-700">{property.locality}</td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-1">
                            {property.badge ? (
                              <span className="w-fit px-2.5 py-1 bg-zinc-100 text-zinc-700 rounded-md text-[11px] font-bold tracking-widest uppercase border border-zinc-200">
                                {property.badge}
                              </span>
                            ) : (
                              <span className="text-zinc-400">—</span>
                            )}
                            <span className={`w-fit px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest ${property.availableSeats > 0 ? "bg-blue-50 text-blue-600" : "bg-red-50 text-red-600"}`}>
                              {property.availableSeats ?? 0} Seats
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider border flex inline-flex items-center gap-1.5 ${
                            property.status === 'published' 
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200/60' 
                              : property.status === 'draft'
                              ? 'bg-amber-50 text-amber-700 border-amber-200/60'
                              : 'bg-zinc-100 text-zinc-700 border-zinc-200'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              property.status === 'published' ? 'bg-emerald-500' : property.status === 'draft' ? 'bg-amber-500' : 'bg-zinc-400'
                            }`} />
                            {property.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2 justify-end">
                            <button
                              onClick={() => openEditPropertyModal(property)}
                              className="px-3 py-1.5 bg-white border border-zinc-200 hover:border-blue-300 hover:text-blue-600 text-zinc-600 rounded-lg text-sm font-bold shadow-sm transition-all flex items-center gap-1.5"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => initiateDelete(property.propertyId)}
                              className="p-1.5 bg-red-50 border border-red-100 text-red-500 hover:bg-red-100 hover:border-red-200 hover:text-red-600 rounded-lg shadow-sm transition-all flex items-center"
                              title="Delete"
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Sticky Footer */}
          <div className="bg-zinc-50 border-t border-zinc-200 px-6 py-4 flex justify-between items-center mt-auto">
            <span className="text-sm font-semibold text-zinc-500">
              {properties.length} {properties.length === 1 ? 'property' : 'properties'} total
            </span>
            <button
              onClick={handleSaveAll}
              className="px-6 py-2.5 bg-zinc-900 hover:bg-black text-white rounded-xl font-bold transition-all shadow-sm flex items-center gap-2"
            >
              <svg className="w-4 h-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>
              Save Configuration
            </button>
          </div>
        </div>
      </div>

      {/* Property Configuration Modal */}
      <AnimatePresence>
        {propertyModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-zinc-900/40 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.98, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.98, y: 15 }}
              className="bg-zinc-50 rounded-2xl max-w-5xl w-full max-h-[92vh] overflow-hidden shadow-2xl flex flex-col"
            >
              <div className="bg-white px-8 py-5 flex justify-between items-center border-b border-zinc-200 z-20">
                <h2 className="text-xl font-bold text-zinc-900 flex items-center gap-3 tracking-tight">
                  <div className="w-10 h-10 bg-zinc-100 text-zinc-600 rounded-lg flex items-center justify-center text-lg border border-zinc-200">
                    {editingProperty ? '✏️' : '➕'}
                  </div>
                  {editingProperty ? 'Edit Property Configuration' : 'Create New Property'}
                </h2>
                <button onClick={() => setPropertyModalOpen(false)} className="w-9 h-9 hover:bg-zinc-100 text-zinc-500 hover:text-zinc-900 rounded-full flex items-center justify-center transition-colors">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>

              <div className="bg-white px-8 py-4 border-b border-zinc-200 z-10">
                <div className="flex gap-1 overflow-x-auto no-scrollbar p-1 bg-zinc-100/80 rounded-xl">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`px-5 py-2.5 text-[13px] font-semibold rounded-lg transition-all flex items-center gap-2 whitespace-nowrap flex-1 justify-center ${
                        activeTab === tab.id ? 'bg-white text-zinc-900 shadow-sm border border-zinc-200/50' : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-200/50'
                      }`}
                    >
                      <span>{tab.icon}</span>{tab.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-8 overflow-y-auto custom-scrollbar flex-1">
                {activeTab === 'basic' && (
                  <div className="space-y-8 max-w-4xl mx-auto">
                    <div className={cardClassName}>
                      <h4 className={sectionHeaderClass}>Core Identity</h4>
                      <div className="grid grid-cols-2 gap-6">
                        <div className="col-span-2 md:col-span-1">
                          <label className={labelClassName}>Property ID <span className="text-red-500">*</span></label>
                          <input type="text" name="propertyId" value={propertyForm.propertyId ?? ''} onChange={handlePropertyInputChange} className={inputClassName} placeholder="e.g., spacehub-eco-2" required />
                          <p className="text-[12px] font-medium text-zinc-500 mt-2">Used in URL routing</p>
                        </div>
                        <div className="col-span-2 md:col-span-1">
                          <label className={labelClassName}>Display Name <span className="text-red-500">*</span></label>
                          <input type="text" name="name" value={propertyForm.name ?? ''} onChange={handlePropertyInputChange} className={inputClassName} placeholder="e.g., SpaceHub Eco 2" required />
                        </div>
                        <div className="col-span-2">
                          <label className={labelClassName}>Full Description</label>
                          <textarea name="description" value={propertyForm.description ?? ''} onChange={handlePropertyInputChange} rows={5} className={inputClassName} placeholder="Write a compelling description..." />
                        </div>
                      </div>
                    </div>

                    <div className={cardClassName}>
                      <h4 className={sectionHeaderClass}>Discovery & Availability</h4>
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <label className={labelClassName}>Locality <span className="text-red-500">*</span></label>
                          <select name="locality" value={propertyForm.locality ?? ''} onChange={handlePropertyInputChange} className={inputClassName}>
                            <option value="">Select Locality</option>
                            {localities.filter(l => l !== 'All').map((l: string) => (
                              <option key={l} value={l}>{l}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className={labelClassName}>Available Seats (Inventory) <span className="text-red-500">*</span></label>
                          <input 
                            type="number" 
                            name="availableSeats" 
                            min="0" 
                            value={propertyForm.availableSeats ?? 0} 
                            onChange={handlePropertyInputChange} 
                            className={inputClassName} 
                            placeholder="e.g., 10" 
                            required 
                          />
                          <p className="text-[12px] font-medium text-blue-500 mt-1">Typing {'>'}0 automatically removes 'Sold Out'</p>
                        </div>

                        <div>
                          <label className={labelClassName}>Publish Status</label>
                          <select name="status" value={propertyForm.status ?? 'draft'} onChange={handlePropertyInputChange} className={inputClassName}>
                            <option value="published">🟢 Published (Live)</option>
                            <option value="draft">🟡 Draft (Hidden)</option>
                            <option value="archived">⚫ Archived</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className={labelClassName}>Occupancy Status</label>
                          <select
                            name="availableNow"
                            value={propertyForm.availableNow ? 'true' : 'false'}
                            onChange={(e) => handlePropertyInputChange({ target: { name: 'availableNow', value: e.target.value === 'true' } } as any)}
                            className={inputClassName}
                          >
                            <option value="true">Available Now</option>
                            <option value="false">Sold Out / Coming Soon</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className={cardClassName}>
                      <h4 className={sectionHeaderClass}>City Card Appearance</h4>
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <label className={labelClassName}>Card Badge</label>
                          <input type="text" name="badge" value={propertyForm.badge ?? ''} onChange={handlePropertyInputChange} className={inputClassName} placeholder="e.g., PREMIUM, NEW" />
                        </div>
                        <div>
                          <label className={labelClassName}>Seat Capacity Display Text</label>
                          <input type="text" name="capacity" value={propertyForm.capacity ?? ''} onChange={handlePropertyInputChange} className={inputClassName} placeholder="e.g., 500+ Seats" />
                          <p className="text-[12px] font-medium text-zinc-500 mt-1">Leave blank to auto-show 'X Seats Left'</p>
                        </div>
                        
                        <div className="col-span-2">
                          <label className={labelClassName}>Card Highlight Pills (Comma Separated)</label>
                          <input
                            type="text"
                            value={localHighlightAmenities ?? ''}
                            onChange={(e) => setLocalHighlightAmenities(e.target.value)}
                            onBlur={() => {
                              handlePropertyInputChange({ target: { name: 'highlightAmenities', value: localHighlightAmenities.split(',').map(s => s.trim()).filter(Boolean) } } as any);
                            }}
                            className={inputClassName}
                            placeholder="e.g., Green Building, Fast WiFi, Pantry"
                          />
                          <p className="text-[12px] font-medium text-zinc-500 mt-2">Appears as tags at the bottom of the property card. (Press Tab or click away to save)</p>
                          <div className="mt-3 flex gap-2 flex-wrap">
                            {(propertyForm.highlightAmenities || []).map((pill, i) => (
                              <span key={i} className="px-3 py-1 bg-zinc-900 text-white text-[11px] font-bold rounded-md tracking-wider">{pill}</span>
                            ))}
                          </div>
                        </div>

                        <div className="col-span-2">
                          <label className={labelClassName}>Main Hero Image URL <span className="text-red-500">*</span></label>
                          <input
                            type="text" 
                            name="mainImage"
                            value={propertyForm.images?.[0] || ''}
                            onChange={(e) => {
                              const newImages = [...(propertyForm.images || [])];
                              newImages[0] = e.target.value;
                              handlePropertyInputChange({ target: { name: 'images', value: newImages } } as any);
                            }}
                            className={inputClassName}
                            placeholder="https://... or /local/path.jpg"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Images Tab */}
                {activeTab === 'images' && (
                  <div className="space-y-6 max-w-5xl mx-auto">
                    <div className="bg-white p-6 rounded-2xl border border-zinc-200 flex gap-4 items-end shadow-sm">
                      <div className="flex-1">
                        <label className={labelClassName}>Add High-Resolution Image URL</label>
                        <input type="text" value={newImage ?? ''} onChange={(e) => handleImageChange(e.target.value)} placeholder="https://... or /local/path.jpg" className={inputClassName} />
                      </div>
                      <button type="button" onClick={addImage} className="px-6 py-3 bg-zinc-900 hover:bg-zinc-800 text-white text-sm font-bold rounded-xl transition-all shadow-sm flex items-center gap-2 whitespace-nowrap h-[46px]">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg> Add Image
                      </button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                      {(propertyForm.images || []).map((img, index) => (
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} key={`image-${index}-${img.substring(0, 10)}`} className="relative group rounded-xl overflow-hidden border border-zinc-200 shadow-sm hover:shadow-md transition-all aspect-[4/3] bg-zinc-100">
                          <img src={img} alt={`Property ${index + 1}`} className="w-full h-full object-cover" onError={(e) => (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=Image+Error'} />
                          <div className="absolute top-3 left-3 bg-zinc-900/80 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-md tracking-wider">{index === 0 ? 'COVER' : `#${index + 1}`}</div>
                          <div className="absolute inset-0 bg-zinc-900/10 flex items-center justify-center transition-all hover:bg-zinc-900/40 backdrop-blur-[1px] hover:backdrop-blur-[2px]">
                            <button onClick={() => removeImage(index)} className="w-10 h-10 bg-red-50 border border-red-100 text-red-500 hover:bg-red-100 hover:border-red-200 hover:text-red-600 rounded-full flex items-center justify-center transform hover:scale-105 transition-all shadow-lg">
                              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Amenities Tab */}
                {activeTab === 'amenities' && (
                  <div className="space-y-8 max-w-5xl mx-auto">
                    <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
                      <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-wide mb-6">Add Premium Amenity</h3>
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                        <div className="md:col-span-5">
                          <label className={labelClassName}>Amenity Name</label>
                          <input type="text" placeholder="e.g. Ergonomic Chairs" value={newAmenity ?? ''} onChange={(e) => handleAmenityNameChange(e.target.value)} className={inputClassName} />
                        </div>
                        <div className="md:col-span-4">
                          <label className={labelClassName}>Icon (URL or Emoji)</label>
                          <input type="text" placeholder="e.g. 🪑 or /icons/chair.png" value={newAmenityIcon ?? ''} onChange={(e) => handleAmenityIconChange(e.target.value)} className={inputClassName} />
                        </div>
                        <div className="md:col-span-3">
                          <button onClick={addAmenityWithIcon} type="button" className="w-full h-[46px] bg-zinc-900 hover:bg-zinc-800 text-white text-sm font-bold rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-50" disabled={!newAmenity || !newAmenityIcon}>
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg> Add
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {(propertyForm.amenities || []).map((item, index) => (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={`amenity-${index}-${item.name}`} className="relative flex items-center gap-3 p-4 pr-12 bg-white rounded-xl border border-zinc-200 shadow-sm hover:border-blue-200 transition-all group">
                          <div className="w-10 h-10 bg-zinc-50 border border-zinc-100 rounded-lg flex items-center justify-center text-xl flex-shrink-0">
                            {isImageIcon(item.icon) ? (
                              <img src={item.icon} alt={item.name} className="w-6 h-6 object-contain" />
                            ) : (
                              item.icon
                            )}
                          </div>
                          <span className="flex-1 font-semibold text-zinc-800 text-[13px] leading-tight">{item.name}</span>
                          <button type="button" onClick={() => removeAmenityWithIcon(index)} className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 bg-red-50 border border-red-100 text-red-500 hover:bg-red-100 hover:border-red-200 hover:text-red-600 rounded-md transition-all flex items-center justify-center shadow-sm z-10">
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Workplaces Tab */}
                {activeTab === 'workplaces' && (
                  <div className="space-y-8 max-w-5xl mx-auto">
                    <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
                      <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-wide mb-6">Add Workplace Type</h3>
                      <div className="grid grid-cols-2 gap-5">
                        <div>
                          <label className={labelClassName}>Title</label>
                          <input type="text" placeholder="e.g. Dedicated Desk" value={newWorkplace.title ?? ''} onChange={(e) => handleWorkplaceChange('title', e.target.value)} className={inputClassName} />
                        </div>
                        <div>
                          <label className={labelClassName}>Icon URL</label>
                          <input type="text" placeholder="https://..." value={newWorkplace.icon ?? ''} onChange={(e) => handleWorkplaceChange('icon', e.target.value)} className={inputClassName} />
                        </div>
                        <div className="col-span-2">
                          <label className={labelClassName}>Description</label>
                          <input type="text" placeholder="Short description of the workplace..." value={newWorkplace.desc ?? ''} onChange={(e) => handleWorkplaceChange('desc', e.target.value)} className={inputClassName} />
                        </div>
                        <button type="button" onClick={addWorkplace} className="col-span-2 h-[46px] bg-zinc-900 hover:bg-zinc-800 text-white text-sm font-bold rounded-xl transition-all shadow-sm disabled:opacity-50" disabled={!newWorkplace.title || !newWorkplace.desc || !newWorkplace.icon}>
                          Add Workplace Type
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {(propertyForm.standardWorkplaces || []).map((item, index) => (
                        <div key={`workplace-${index}-${item.title}`} className="relative bg-white p-5 pr-14 rounded-xl border border-zinc-200 shadow-sm flex items-start gap-4 hover:border-blue-200 group transition-all">
                          <div className="w-12 h-12 bg-zinc-50 border border-zinc-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            {item.icon ? <img src={item.icon} alt={item.title} className="w-6 h-6 object-contain" /> : <span className="text-xl">💼</span>}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold text-zinc-900 text-[15px] mb-1">{item.title}</h4>
                            <p className="text-[13px] text-zinc-500 leading-relaxed">{item.desc}</p>
                          </div>
                          <button type="button" onClick={() => removeWorkplace(index)} className="absolute top-4 right-4 w-8 h-8 bg-red-50 border border-red-100 text-red-500 hover:bg-red-100 hover:border-red-200 hover:text-red-600 rounded-md transition-all flex items-center justify-center shadow-sm z-10">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Services Tab */}
                {activeTab === 'services' && (
                  <div className="space-y-8 max-w-5xl mx-auto">
                    <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
                      <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-wide mb-6">Add Additional Service</h3>
                      <div className="grid grid-cols-2 gap-5">
                        <div>
                          <label className={labelClassName}>Title</label>
                          <input type="text" placeholder="e.g. Events Spaces" value={newService.title ?? ''} onChange={(e) => handleServiceChange('title', e.target.value)} className={inputClassName} />
                        </div>
                        <div>
                          <label className={labelClassName}>Icon URL</label>
                          <input type="text" placeholder="https://..." value={newService.icon ?? ''} onChange={(e) => handleServiceChange('icon', e.target.value)} className={inputClassName} />
                        </div>
                        <div className="col-span-2">
                          <label className={labelClassName}>Description</label>
                          <input type="text" placeholder="Short description of the service..." value={newService.desc ?? ''} onChange={(e) => handleServiceChange('desc', e.target.value)} className={inputClassName} />
                        </div>
                        <button type="button" onClick={addService} className="col-span-2 h-[46px] bg-zinc-900 hover:bg-zinc-800 text-white text-sm font-bold rounded-xl transition-all shadow-sm disabled:opacity-50" disabled={!newService.title || !newService.desc || !newService.icon}>
                          Add Service Type
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {(propertyForm.standardServices || []).map((item, index) => (
                        <div key={`service-${index}-${item.title}`} className="relative bg-white p-5 pr-14 rounded-xl border border-zinc-200 shadow-sm flex items-start gap-4 hover:border-blue-200 group transition-all">
                          <div className="w-12 h-12 bg-zinc-50 border border-zinc-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            {item.icon ? <img src={item.icon} alt={item.title} className="w-6 h-6 object-contain" /> : <span className="text-xl">🛠️</span>}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold text-zinc-900 text-[15px] mb-1">{item.title}</h4>
                            <p className="text-[13px] text-zinc-500 leading-relaxed">{item.desc}</p>
                          </div>
                          <button type="button" onClick={() => removeService(index)} className="absolute top-4 right-4 w-8 h-8 bg-red-50 border border-red-100 text-red-500 hover:bg-red-100 hover:border-red-200 hover:text-red-600 rounded-md transition-all flex items-center justify-center shadow-sm z-10">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Pricing Tab */}
                {activeTab === 'pricing' && (
                  <div className="space-y-8 max-w-5xl mx-auto">
                    <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
                      <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-wide mb-6">Add Pricing Plan</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                        <div>
                          <label className={labelClassName}>Plan ID</label>
                          <input type="text" placeholder="e.g. hot-desk" value={newPlan.id ?? ''} onChange={(e) => handlePlanChange('id', e.target.value)} className={inputClassName} />
                        </div>
                        <div>
                          <label className={labelClassName}>Plan Name</label>
                          <input type="text" placeholder="e.g. Hot Desk" value={newPlan.name ?? ''} onChange={(e) => handlePlanChange('name', e.target.value)} className={inputClassName} />
                        </div>
                        <div>
                          <label className={labelClassName}>Display Price</label>
                          <input type="text" placeholder="e.g. ₹4,999" value={newPlan.price ?? ''} onChange={(e) => handlePlanChange('price', e.target.value)} className={inputClassName} />
                        </div>
                        <div>
                          <label className={labelClassName}>Numeric Value</label>
                          <input type="number" placeholder="4999" value={newPlan.numericPrice ?? ''} onChange={(e) => handlePlanChange('numericPrice', parseInt(e.target.value) || 0)} className={inputClassName} />
                        </div>
                        <div className="col-span-2 md:col-span-4">
                          <label className={labelClassName}>Duration Label</label>
                          <input type="text" placeholder="e.g. /month" value={newPlan.duration ?? ''} onChange={(e) => handlePlanChange('duration', e.target.value)} className={inputClassName} />
                        </div>
                        <div className="col-span-2 md:col-span-4">
                          <button type="button" onClick={addPlan} className="w-full h-[46px] bg-zinc-900 hover:bg-zinc-800 text-white text-sm font-bold rounded-xl transition-all shadow-sm disabled:opacity-50" disabled={!newPlan.name || !newPlan.price}>
                            Create Plan
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                      {(propertyForm.pricingPlans || []).map((plan, planIndex) => (
                        <div key={`plan-${planIndex}-${plan.id}`} className="relative bg-white rounded-2xl border border-zinc-200 shadow-sm p-6 flex flex-col">
                          <div className="flex justify-between items-start mb-6 pr-10">
                            <div>
                              <h4 className="font-bold text-lg text-zinc-900">{plan.name}</h4>
                              <div className="flex items-baseline gap-1 mt-1">
                                <span className="text-2xl font-black text-zinc-900">{plan.price}</span>
                                <span className="text-xs text-zinc-500 font-medium">{plan.duration}</span>
                              </div>
                            </div>
                            <button type="button" onClick={() => removePlan(planIndex)} className="absolute top-4 right-4 p-2 bg-red-50 border border-red-100 text-red-500 hover:bg-red-100 hover:border-red-200 hover:text-red-600 rounded-lg transition-all shadow-sm z-10">
                              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            </button>
                          </div>
                          <h5 className="font-bold text-zinc-900 text-[11px] mb-3 uppercase tracking-wider">Features</h5>
                          <div className="space-y-2 mb-6 flex-1">
                            
                            {/* --- FIXED LAYOUT & ADDED TYPE TOGGLE HERE --- */}
                            {(plan.features || []).map((feature, featureIndex) => (
                              <div key={`feature-${planIndex}-${featureIndex}-${feature.name}`} className="flex items-center gap-2 p-1.5 bg-zinc-50 rounded-lg border border-zinc-100">
                                
                                <input 
                                  type="text" 
                                  value={feature.name ?? ''} 
                                  onChange={(e) => handleFeatureChange(planIndex, featureIndex, 'name', e.target.value)} 
                                  className="flex-1 min-w-[80px] px-2 py-1.5 bg-transparent border-none text-[13px] text-zinc-800 focus:ring-0 focus:outline-none" 
                                  placeholder="Feature name" 
                                />
                                
                                {typeof feature.value === 'boolean' ? (
                                  <select 
                                    value={feature.value ? 'true' : 'false'} 
                                    onChange={(e) => handleFeatureChange(planIndex, featureIndex, 'value', e.target.value === 'true')} 
                                    className="w-[75px] flex-shrink-0 px-1 py-1.5 bg-white border border-zinc-200 rounded-md text-[12px] text-zinc-800 focus:outline-none font-medium"
                                  >
                                    <option value="true">Yes</option>
                                    <option value="false">No</option>
                                  </select>
                                ) : (
                                  <input 
                                    type="text" 
                                    value={(feature.value as string) ?? ''} 
                                    onChange={(e) => handleFeatureChange(planIndex, featureIndex, 'value', e.target.value)} 
                                    className="w-[75px] flex-shrink-0 px-2 py-1.5 bg-white border border-zinc-200 rounded-md text-[12px] text-zinc-800 focus:outline-none font-medium text-center" 
                                    placeholder="Value" 
                                  />
                                )}

                                {/* SMART TOGGLE BUTTON (Text vs Boolean) */}
                                <button
                                  type="button"
                                  onClick={() => handleFeatureChange(planIndex, featureIndex, 'value', typeof feature.value === 'boolean' ? '' : true)}
                                  className="px-2 h-7 flex-shrink-0 bg-zinc-200 hover:bg-zinc-300 text-zinc-600 rounded-md text-[10px] font-bold uppercase transition-all shadow-sm"
                                  title="Toggle Feature Type (Text / Yes-No)"
                                >
                                  {typeof feature.value === 'boolean' ? 'Abc' : 'Y/N'}
                                </button>

                                <button 
                                  type="button" 
                                  onClick={() => removeFeature(planIndex, featureIndex)} 
                                  className="w-7 h-7 flex-shrink-0 bg-red-50 border border-red-100 text-red-500 hover:bg-red-100 hover:border-red-200 hover:text-red-600 rounded-md flex items-center justify-center transition-all shadow-sm"
                                >
                                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                              </div>
                            ))}
                            {/* ------------------------- */}

                          </div>
                          <button type="button" onClick={() => addFeature(planIndex)} className="w-full py-2.5 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 text-zinc-600 font-semibold rounded-lg transition-all flex items-center justify-center gap-2 text-[13px]">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg> Add Feature
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Location Tab */}
                {activeTab === 'location' && (
                  <div className="space-y-6 max-w-4xl mx-auto">
                    <div className={cardClassName}>
                      <h4 className={sectionHeaderClass}>Map Coordinates & Address</h4>
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <label className={labelClassName}>Latitude</label>
                          <input type="number" step="0.000001" name="location.lat" value={propertyForm.location?.lat ?? ''} onChange={handlePropertyInputChange} className={inputClassName} />
                        </div>
                        <div>
                          <label className={labelClassName}>Longitude</label>
                          <input type="number" step="0.000001" name="location.lng" value={propertyForm.location?.lng ?? ''} onChange={handlePropertyInputChange} className={inputClassName} />
                        </div>
                        <div className="col-span-2">
                          <label className={labelClassName}>Physical Address</label>
                          <input type="text" name="location.address" value={propertyForm.location?.address ?? ''} onChange={handlePropertyInputChange} className={inputClassName} />
                        </div>
                        <div className="col-span-2">
                          <label className={labelClassName}>Google Maps Embed URL</label>
                          <input type="url" name="location.embedUrl" value={propertyForm.location?.embedUrl ?? ''} onChange={handlePropertyInputChange} className={inputClassName} placeholder="https://www.google.com/maps/embed?pb=..." />
                        </div>
                        <div className="col-span-2">
                          <label className={labelClassName}>Property Contact Phone</label>
                          <input type="text" name="contactPhone" value={propertyForm.contactPhone ?? ''} onChange={handlePropertyInputChange} className={inputClassName} placeholder="e.g., +91 73492 82552" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-white border-t border-zinc-200 px-8 py-5 flex justify-end gap-3 z-20">
                <button type="button" onClick={() => setPropertyModalOpen(false)} className="px-6 py-2.5 bg-white border border-zinc-200 hover:bg-zinc-50 text-zinc-700 font-semibold rounded-xl">Cancel</button>
                <button type="button" onClick={savePropertyConfig} className="px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl">{editingProperty ? 'Save Updates' : 'Add Property'}</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {previewModalOpen && <PreviewModal data={{ ...location!, properties }} onClose={() => setPreviewModalOpen(false)} />}
      </AnimatePresence>

      {/* Custom Delete Confirmation Modal */}
      <AnimatePresence>
        {propertyToDelete && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-zinc-900/60 backdrop-blur-sm z-[250] flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 10 }}
              className="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden border border-zinc-100"
            >
              <div className="p-6 md:p-8">
                <div className="w-14 h-14 rounded-full bg-red-50 text-red-500 flex items-center justify-center mb-6">
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-black text-zinc-900 mb-2">Delete Property?</h3>
                <p className="text-zinc-500 text-sm font-medium leading-relaxed">
                  Are you sure you want to delete this property? This action cannot be undone and will permanently remove it from this location.
                </p>
              </div>
              <div className="bg-zinc-50 px-6 py-5 flex justify-end gap-3 border-t border-zinc-200/60">
                <button 
                  onClick={() => setPropertyToDelete(null)} 
                  className="px-6 py-2.5 text-sm font-bold text-zinc-600 bg-white border border-zinc-200 hover:bg-zinc-50 rounded-xl transition-colors shadow-sm"
                >
                  Cancel
                </button>
                <button 
                  onClick={executeDelete} 
                  className="px-6 py-2.5 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-all shadow-md shadow-red-600/20 flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Yes, Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PropertiesPage;