"use client";

import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion'; 
import Link from 'next/link';
import { useRouter } from 'next/navigation';

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
const LocationsAdmin = () => {
  const router = useRouter();
  const [locations, setLocations] = useState<LocationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [previewModal, setPreviewModal] = useState(false);
  const [editingLocation, setEditingLocation] = useState<LocationData | null>(null);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [locationToDelete, setLocationToDelete] = useState<string | null>(null); // New state for delete modal
  const [token, setToken] = useState<string | null>(null);
  
  // Custom Toast System
  const [toast, setToast] = useState<{ show: boolean, message: string, type: 'success' | 'error' } | null>(null);

  // Form states
  const [formData, setFormData] = useState<LocationData>({
    cityId: '',
    cityName: '',
    cityDisplayName: '',
    slug: '',
    hero: {
      backgroundImage: '',
      badge: '',
      heading: '',
      subheading: ''
    },
    localities: ['All'],
    properties: [],
    emptyState: {
      title: 'Coming Soon',
      message: 'We are currently setting up premium workspaces in this city. Check back later!'
    },
    status: 'draft'
  });

  const [newLocality, setNewLocality] = useState('');

  useEffect(() => {
    setToken(localStorage.getItem('token'));
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      // Close dropdown if clicking anywhere outside the dropdown container
      if (!target.closest('.dropdown-container')) {
        setOpenDropdownId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (token) fetchLocations();
  }, [token]);

  const showToast = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const fetchLocations = async () => {
    try {
      const response = await fetch("https://coworking-space-backend.onrender.com/api/locations", {
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) setLocations(data.data);
    } catch (error) {
      console.error('Error fetching locations:', error);
      showToast("Failed to load locations", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      if (name.includes('.')) {
        const [parent, child] = name.split('.');
        if (parent === 'hero' || parent === 'emptyState') {
          return { ...prev, [parent]: { ...(prev as any)[parent], [child]: value } };
        }
      }
      return { ...prev, [name]: value };
    });
  }, []);

  const addLocality = useCallback(() => {
    if (newLocality && !formData.localities.includes(newLocality)) {
      setFormData((prev) => ({ ...prev, localities: [...prev.localities, newLocality] }));
      setNewLocality('');
    }
  }, [newLocality, formData.localities]);

  const removeLocality = useCallback((locality: string) => {
    setFormData((prev) => ({ ...prev, localities: prev.localities.filter(l => l !== locality) }));
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingLocation ? `https://coworking-space-backend.onrender.com/api/locations/${editingLocation._id}` : 'https://coworking-space-backend.onrender.com/api/locations';
      const method = editingLocation ? 'PUT' : 'POST';
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(formData)
      });
      const data = await response.json();

      if (data.success) {
        showToast(editingLocation ? "Location updated successfully" : "Location created successfully");
        setModalOpen(false);
        fetchLocations();
      } else {
        showToast(data.message || 'Error saving location', 'error');
      }
    } catch (error) {
      showToast('Network error saving location', 'error');
    }
  }, [formData, editingLocation, token, showToast]);

  const handleEdit = useCallback((location: LocationData) => {
    setEditingLocation(location);
    setFormData({ ...location, properties: location.properties || [] });
    setModalOpen(true);
    setOpenDropdownId(null);
  }, []);

  // Updated logic: First trigger the modal instead of native confirm
  const initiateDelete = useCallback((id: string) => {
    setLocationToDelete(id);
    setOpenDropdownId(null);
  }, []);

  // Execute the actual deletion when confirmed
  const executeDelete = useCallback(async () => {
    if (!locationToDelete) return;
    try {
      const response = await fetch(`https://coworking-space-backend.onrender.com/api/locations/${locationToDelete}`, {
        method: 'DELETE',
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        showToast("Location deleted successfully");
        fetchLocations();
      } else {
        showToast("Failed to delete location", "error");
      }
    } catch (error) {
      showToast("Error deleting location", "error");
    }
    setLocationToDelete(null);
  }, [locationToDelete, token, showToast]);

  const toggleStatus = useCallback(async (id: string, currentStatus: string) => {
    try {
      const response = await fetch(`https://coworking-space-backend.onrender.com/api/locations/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ status: currentStatus === 'published' ? 'draft' : 'published' })
      });
      const data = await response.json();
      if (data.success) {
        showToast(`Status changed to ${currentStatus === 'published' ? 'Draft' : 'Published'}`);
        fetchLocations();
      }
    } catch (error) {
      showToast("Error toggling status", "error");
    }
    setOpenDropdownId(null);
  }, [token, showToast]);

  // Safely sets form data for preview with guaranteed properties array
  const handlePreview = useCallback((location: LocationData) => {
    setFormData({ ...location, properties: location.properties || [] });
    setPreviewModal(true);
    setOpenDropdownId(null);
  }, []);

  const handleManageProperties = useCallback((locationId: string, cityName: string) => {
    router.push(`/admin/locations/${locationId}/properties?cityName=${encodeURIComponent(cityName)}`);
  }, [router]);

  const toggleDropdown = useCallback((e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    setOpenDropdownId(prev => prev === id ? null : id);
  }, []);

  const resetForm = useCallback(() => {
    setFormData({
      cityId: '', cityName: '', cityDisplayName: '', slug: '',
      hero: { backgroundImage: '', badge: '', heading: '', subheading: '' },
      localities: ['All'], properties: [],
      emptyState: { title: 'Coming Soon', message: 'We are currently setting up premium workspaces in this city. Check back later!' },
      status: 'draft'
    });
    setEditingLocation(null);
    setNewLocality('');
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24 relative overflow-hidden">
      
      {/* Custom Toast Notification Container */}
      <AnimatePresence>
        {toast?.show && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-10 right-10 z-[300] flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl backdrop-blur-md border"
            style={{
              backgroundColor: toast.type === 'success' ? 'rgba(24, 24, 27, 0.95)' : 'rgba(127, 29, 29, 0.95)',
              borderColor: toast.type === 'success' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(248, 113, 113, 0.2)'
            }}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-inner ${toast.type === 'success' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
              {toast.type === 'success' ? <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg> : <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>}
            </div>
            <p className="text-white font-bold text-[13px] tracking-wide pr-2">{toast.message}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="bg-white border-b border-zinc-200 px-6 py-8 mb-10 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
          <div>
            <h1 className="text-3xl font-black text-zinc-900 tracking-tight">Location Setup</h1>
            <p className="text-zinc-500 font-medium mt-1">Configure and manage geographic portfolios.</p>
          </div>
          <button
            onClick={() => { resetForm(); setModalOpen(true); }}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-md shadow-indigo-600/20"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
            Add New Location
          </button>
        </div>
      </div>

      {/* Locations Grid */}
      <div className="max-w-7xl mx-auto px-6">
        {loading ? (
          <div className="text-center py-20 flex flex-col items-center">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-indigo-600 border-t-transparent mb-4"></div>
            <p className="text-zinc-500 font-bold tracking-wide">Synchronizing portfolios...</p>
          </div>
        ) : locations.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-zinc-200 shadow-sm">
            <div className="w-16 h-16 bg-zinc-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-zinc-100 text-3xl">🌍</div>
            <h3 className="text-xl font-bold text-zinc-900 mb-2">No Locations Configured</h3>
            <p className="text-zinc-500 font-medium mb-6">Create your first city to start adding workspaces.</p>
            <button onClick={() => { resetForm(); setModalOpen(true); }} className="text-indigo-600 font-bold hover:underline">Setup Location Now →</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {locations.map((location) => (
              <motion.div
                key={location._id}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className={`group relative bg-white border border-zinc-200/80 rounded-[2rem] shadow-sm hover:shadow-[0_20px_40px_-10px_rgba(79,70,229,0.15)] hover:border-indigo-200 transition-all duration-500 flex flex-col ${openDropdownId === location._id ? 'z-50' : 'z-10'}`}
              >
                {/* Hero Image Container */}
                <div className="relative h-[200px] w-full overflow-hidden rounded-t-[2rem] bg-zinc-100">
                  <img 
                    src={location.hero?.backgroundImage || 'https://via.placeholder.com/800x400'} 
                    alt={location.cityName}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
                    onError={(e) => (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x400'}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/90 via-zinc-900/30 to-transparent" />
                  
                  {/* Status Pill */}
                  <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1.5 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest border shadow-sm flex items-center gap-1.5 ${
                      location.status === 'published' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${location.status === 'published' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                      {location.status}
                    </span>
                  </div>

                  {/* Title Area */}
                  <div className="absolute bottom-4 left-6 pr-6">
                    <h3 className="text-white font-black text-2xl tracking-tight mb-1">{location.cityDisplayName}</h3>
                    <p className="text-zinc-300 text-xs font-bold uppercase tracking-wider">{location.cityId}</p>
                  </div>
                </div>

                {/* Dropdown Menu */}
                <div className="absolute top-4 right-4 z-50 dropdown-container">
                  <button
                    onClick={(e) => toggleDropdown(e, location._id!)}
                    className="w-8 h-8 bg-white/20 hover:bg-white backdrop-blur-md text-white hover:text-zinc-900 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm relative"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" /></svg>
                  </button>
                  <AnimatePresence>
                    {openDropdownId === location._id && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-zinc-100 py-1.5 z-[100] overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button onClick={() => handleEdit(location)} className="w-full px-4 py-2.5 text-left text-[13px] font-bold text-zinc-700 hover:bg-indigo-50 hover:text-indigo-600 flex items-center gap-2 transition-colors">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                          Edit Config
                        </button>
                        <button onClick={() => handlePreview(location)} className="w-full px-4 py-2.5 text-left text-[13px] font-bold text-zinc-700 hover:bg-indigo-50 hover:text-indigo-600 flex items-center gap-2 transition-colors">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                          Live Preview
                        </button>
                        <button onClick={() => toggleStatus(location._id!, location.status)} className="w-full px-4 py-2.5 text-left text-[13px] font-bold text-zinc-700 hover:bg-indigo-50 hover:text-indigo-600 flex items-center gap-2 transition-colors">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
                          Toggle Publish
                        </button>
                        <div className="h-px bg-zinc-100 my-1"></div>
                        {/* Changed this button to use initiateDelete instead of handleDelete */}
                        <button onClick={() => initiateDelete(location._id!)} className="w-full px-4 py-2.5 text-left text-[13px] font-bold text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          Delete
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Card Content Footer */}
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {location.localities?.slice(0, 3).map((l: string) => (
                      <span key={l} className="text-[10px] font-bold uppercase tracking-wider bg-zinc-100 text-zinc-600 border border-zinc-200 px-2.5 py-1 rounded-md">
                        {l}
                      </span>
                    ))}
                    {location.localities?.length > 3 && (
                      <span className="text-[10px] font-bold bg-zinc-100 text-zinc-600 border border-zinc-200 px-2 py-1 rounded-md">
                        +{location.localities.length - 3}
                      </span>
                    )}
                  </div>

                  <div className="mt-auto">
                    <button
                      onClick={() => handleManageProperties(location._id!, location.cityDisplayName)}
                      className="w-full py-3.5 bg-zinc-900 group-hover:bg-indigo-600 text-white rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 shadow-md"
                    >
                      Manage Properties ({(location.properties || []).length})
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Location Modal (Premium Layout) */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-zinc-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-hidden"
          >
            <motion.div
              initial={{ scale: 0.98, y: 15 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.98, y: 15 }}
              className="bg-[#F8FAFC] rounded-[2rem] max-w-5xl w-full max-h-[92vh] overflow-hidden shadow-2xl flex flex-col"
            >
              {/* Form Header */}
              <div className="bg-white border-b border-zinc-200 px-8 py-6 flex justify-between items-center flex-shrink-0 z-20">
                <h2 className="text-2xl font-black text-zinc-900 tracking-tight flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center border border-indigo-100">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </div>
                  {editingLocation ? 'Edit Regional Configuration' : 'Establish New Region'}
                </h2>
                <div className="flex items-center gap-3">
                  <button type="button" onClick={() => setPreviewModal(true)} className="px-4 py-2 border border-zinc-200 text-zinc-700 rounded-xl hover:bg-zinc-50 transition-colors font-bold text-sm flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                    Preview
                  </button>
                  <button type="button" onClick={() => setModalOpen(false)} className="text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 text-2xl w-10 h-10 flex items-center justify-center rounded-full transition-colors">×</button>
                </div>
              </div>

              {/* Form Body Scrollable */}
              <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto custom-scrollbar p-8">
                <div className="max-w-4xl mx-auto space-y-8">
                  
                  {/* Core Details */}
                  <div className="bg-white p-8 rounded-2xl border border-zinc-200 shadow-sm">
                    <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-wide mb-6 border-b border-zinc-100 pb-3">Core Identity</h3>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="col-span-2 md:col-span-1">
                        <label className={labelClassName}>City ID (Internal) *</label>
                        <input type="text" name="cityId" value={formData.cityId} onChange={handleInputChange} className={inputClassName} placeholder="e.g. bengaluru" required />
                      </div>
                      <div className="col-span-2 md:col-span-1">
                        <label className={labelClassName}>URL Slug *</label>
                        <input type="text" name="slug" value={formData.slug} onChange={handleInputChange} className={inputClassName} placeholder="e.g. bengaluru" required />
                      </div>
                      <div className="col-span-2 md:col-span-1">
                        <label className={labelClassName}>System City Name *</label>
                        <input type="text" name="cityName" value={formData.cityName} onChange={handleInputChange} className={inputClassName} placeholder="e.g. Bengaluru" required />
                      </div>
                      <div className="col-span-2 md:col-span-1">
                        <label className={labelClassName}>Public Display Name *</label>
                        <input type="text" name="cityDisplayName" value={formData.cityDisplayName} onChange={handleInputChange} className={inputClassName} placeholder="e.g. Bengaluru City" required />
                      </div>
                    </div>
                  </div>

                  {/* Hero Setup */}
                  <div className="bg-white p-8 rounded-2xl border border-zinc-200 shadow-sm">
                    <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-wide mb-6 border-b border-zinc-100 pb-3">Hero Interface Configuration</h3>
                    <div className="space-y-6">
                      <div>
                        <label className={labelClassName}>High-Res Background Cover URL *</label>
                        <input type="url" name="hero.backgroundImage" value={formData.hero.backgroundImage} onChange={handleInputChange} className={inputClassName} required placeholder="https://..." />
                      </div>
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <label className={labelClassName}>Top Eyebrow Badge</label>
                          <input type="text" name="hero.badge" value={formData.hero.badge} onChange={handleInputChange} className={inputClassName} placeholder="e.g. SILICON VALLEY" />
                        </div>
                        <div>
                          <label className={labelClassName}>Primary Hero Heading *</label>
                          <input type="text" name="hero.heading" value={formData.hero.heading} onChange={handleInputChange} className={inputClassName} required placeholder="e.g. Workspaces in Bengaluru" />
                        </div>
                      </div>
                      <div>
                        <label className={labelClassName}>Subheading Pitch *</label>
                        <textarea name="hero.subheading" value={formData.hero.subheading} onChange={handleInputChange} rows={2} className={inputClassName} required placeholder="Engaging description of the city's portfolio..." />
                      </div>
                    </div>
                  </div>

                  {/* Micro-markets (Localities) */}
                  <div className="bg-white p-8 rounded-2xl border border-zinc-200 shadow-sm">
                    <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-wide mb-6 border-b border-zinc-100 pb-3">Micro-Markets / Localities</h3>
                    <div className="flex gap-3 items-end mb-6">
                      <div className="flex-1">
                        <label className={labelClassName}>Add Operating Zone</label>
                        <input type="text" value={newLocality} onChange={(e) => setNewLocality(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addLocality(); }}} placeholder="e.g. HSR Layout (Press Enter)" className={inputClassName} />
                      </div>
                      <button type="button" onClick={addLocality} className="px-6 py-3 bg-zinc-900 text-white rounded-xl font-bold hover:bg-zinc-800 transition-colors shadow-sm whitespace-nowrap h-[46px]">
                        Add Zone
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2 p-4 bg-zinc-50 rounded-xl border border-zinc-200 min-h-[80px]">
                      {formData.localities.length === 0 && <span className="text-sm text-zinc-400 font-medium italic">No zones added yet...</span>}
                      {formData.localities.map((l: string) => (
                        <span key={l} className="px-3 py-1.5 bg-white text-zinc-800 rounded-lg text-[13px] font-bold flex items-center gap-2 border border-zinc-200 shadow-sm">
                          {l}
                          {l !== 'All' && (
                            <button type="button" onClick={() => removeLocality(l)} className="text-zinc-400 hover:text-red-500 transition-colors flex items-center justify-center">
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                          )}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Operational Status */}
                  <div className="bg-white p-8 rounded-2xl border border-zinc-200 shadow-sm">
                    <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-wide mb-6 border-b border-zinc-100 pb-3">Operational Status</h3>
                    <div className="w-full md:w-1/2">
                      <label className={labelClassName}>Deployment State</label>
                      <select name="status" value={formData.status} onChange={handleInputChange} className={inputClassName}>
                        <option value="draft">🟡 Draft (Staging)</option>
                        <option value="published">🟢 Published (Live to Public)</option>
                        <option value="archived">⚫ Archived (Hidden)</option>
                      </select>
                    </div>
                  </div>

                </div>
              </form>

              {/* Form Footer */}
              <div className="bg-white border-t border-zinc-200 px-8 py-5 flex justify-end gap-3 flex-shrink-0 z-20">
                <button type="button" onClick={() => setModalOpen(false)} className="px-6 py-2.5 bg-white border border-zinc-200 hover:bg-zinc-50 text-zinc-700 font-bold rounded-xl transition-colors">Cancel</button>
                <button type="submit" onClick={handleSubmit} className="px-8 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all shadow-md shadow-indigo-600/20">
                  {editingLocation ? 'Commit Changes' : 'Initialize Region'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Preview Modal */}
      <AnimatePresence>
        {previewModal && (
          <PreviewModal 
            data={formData} 
            onClose={() => setPreviewModal(false)} 
          />
        )}
      </AnimatePresence>
      
      {/* Custom Delete Confirmation Modal */}
      <AnimatePresence>
        {locationToDelete && (
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
                <h3 className="text-2xl font-black text-zinc-900 mb-2">Delete Location?</h3>
                <p className="text-zinc-500 text-sm font-medium leading-relaxed">
                  Are you absolutely sure you want to delete this location? This action cannot be undone and will permanently remove all associated properties and data.
                </p>
              </div>
              <div className="bg-zinc-50 px-6 py-5 flex justify-end gap-3 border-t border-zinc-200/60">
                <button 
                  onClick={() => setLocationToDelete(null)} 
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

export default LocationsAdmin;