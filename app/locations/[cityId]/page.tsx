"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence, Variants } from "framer-motion";
import Navbar from "../../components/Navbar";

// Define types matching your MongoDB schema
interface Amenity {
  name: string;
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
  highlightAmenities?: string[];
  badge: string;
  capacity: string;
  exploreLink: string;
  status: string;
  availableNow: boolean;
}

interface LocationData {
  _id: string;
  cityId: string;
  cityName: string;
  cityDisplayName: string;
  slug: string;
  hero: {
    backgroundImage: string;
    badge: string;
    heading: string;
    subheading: string;
  };
  localities: string[];
  properties: Property[];
  emptyState: {
    title: string;
    message: string;
  };
}

// Animation variants
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 250, damping: 25 } },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } }
};

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

export default function CityPage() {
  const params = useParams();
  const [location, setLocation] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeLocality, setActiveLocality] = useState("All");
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // Extract cityId from params
  const cityIdParam = Array.isArray(params?.cityId) ? params?.cityId[0] : params?.cityId;
  const currentCityId = cityIdParam?.toLowerCase() || "";

  // Fetch location data from API
  useEffect(() => {
    if (!currentCityId) return;

    const fetchLocation = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:5000/api/locations/city/${currentCityId}`);
        const data = await response.json();

        if (data.success) {
          setLocation(data.data);
        } else {
          setError(data.message || "Location not found");
        }
      } catch (err) {
        console.error("Error fetching location:", err);
        setError("Failed to load location data");
      } finally {
        setLoading(false);
      }
    };

    fetchLocation();
  }, [currentCityId]);

  if (!mounted) return null;
  
  if (loading) {
    return (
      <main className="min-h-screen bg-[#F4F4F5]">
        <Navbar />
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent mb-4"></div>
            <p className="text-gray-600 font-medium">Loading workspace data...</p>
          </div>
        </div>
      </main>
    );
  }

  if (error || !location) {
    return (
      <main className="min-h-screen bg-[#F4F4F5]">
        <Navbar />
        <div className="max-w-[1400px] mx-auto pt-32 px-4 md:px-8">
          <div className="bg-white rounded-[2rem] p-12 text-center shadow-xl border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Location Not Found</h3>
            <p className="text-gray-500">{error || "The location you're looking for doesn't exist."}</p>
            <Link href="/locations" className="inline-block mt-6 px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors">
              Browse All Locations
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // Filter properties by locality and only show published ones
  const publishedProperties = location.properties?.filter(p => p.status === 'published') || [];
  const allLocalities = ["All", ...new Set(publishedProperties.map(p => p.locality))];
  
  const filteredProperties = activeLocality === "All" 
    ? publishedProperties 
    : publishedProperties.filter(p => p.locality === activeLocality);

  const cityName = location.cityDisplayName || location.cityName;

  return (
    <main className="min-h-screen bg-[#F4F4F5] text-[#111827] selection:bg-indigo-600 selection:text-white pb-32">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <motion.img 
            key={location.hero?.backgroundImage}
            initial={{ scale: 1.1, opacity: 0.5 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            src={location.hero?.backgroundImage || 'https://via.placeholder.com/2000x1000'} 
            alt={cityName}
            className="w-full h-full object-cover"
            onError={(e) => (e.target as HTMLImageElement).src = 'https://via.placeholder.com/2000x1000'}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-[#F4F4F5]" />
        </div>

        <motion.div
          key={cityName}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10 text-center px-6 mt-16"
        >
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-1.5 mb-6">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.8)]" />
            <span className="text-xs font-bold text-white uppercase tracking-[0.2em]">{publishedProperties.length} Locations</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter mb-4 drop-shadow-xl">
            {location.hero?.heading || cityName}
          </h1>
          <p className="text-lg md:text-xl text-gray-300 font-medium max-w-xl mx-auto drop-shadow-md">
            {location.hero?.subheading || `Discover premium workspaces in the heart of ${cityName}.`}
          </p>
        </motion.div>
      </section>

      {/* Filter Dock */}
      {publishedProperties.length > 0 && (
        <div className="fixed bottom-8 left-0 right-0 z-40 flex justify-center px-4 pointer-events-none">
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 200, damping: 20 }}
            className="bg-white/80 backdrop-blur-xl border border-white/40 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.15)] rounded-full p-2 flex gap-1 overflow-x-auto pointer-events-auto max-w-full [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          >
            {allLocalities.map((locality) => {
              const isActive = activeLocality === locality;
              return (
                <button
                  key={locality}
                  onClick={() => setActiveLocality(locality)}
                  className={`relative px-6 py-3 rounded-full text-sm font-bold whitespace-nowrap transition-all duration-300 ${
                    isActive ? "text-white" : "text-gray-500 hover:text-gray-900 hover:bg-white/50"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="dock-indicator"
                      className="absolute inset-0 bg-gray-900 rounded-full -z-10 shadow-md"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                    />
                  )}
                  <span className="relative z-10">{locality}</span>
                </button>
              );
            })}
          </motion.div>
        </div>
      )}

      {/* Properties Grid */}
      <section className="max-w-[1400px] mx-auto px-6 -mt-20 relative z-20">
        
        {filteredProperties.length === 0 ? (
          <div className="bg-white rounded-[2rem] p-12 text-center shadow-xl border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{location.emptyState?.title || `Coming Soon to ${cityName}`}</h3>
            <p className="text-gray-500">{location.emptyState?.message || 'No workspaces available in this area yet.'}</p>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            <motion.div
              key={activeLocality}
              variants={containerVariants}
              initial="hidden"
              animate="show"
              exit="hidden"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
            >
              {filteredProperties.map((property) => (
                <motion.div
                  key={property.propertyId}
                  variants={itemVariants}
                  layout
                  className="group bg-white rounded-[2rem] p-3 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.12)] hover:border-indigo-100 transition-all duration-500 flex flex-col"
                >
                  {/* Image Container */}
                  <div className="relative h-[280px] w-full rounded-3xl overflow-hidden mb-4">
                    <div className="absolute inset-0 bg-gray-900/10 group-hover:bg-gray-900/40 transition-colors duration-500 z-10" />
                    <img
                      src={property.images?.[0] || 'https://via.placeholder.com/800x600'}
                      alt={property.name}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-[8s] ease-out"
                      onError={(e) => (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x600'}
                    />
                    
                    {/* Badges */}
                    <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
                      <span className="px-3 py-1.5 bg-white/95 backdrop-blur-sm rounded-full text-[10px] font-black tracking-widest uppercase text-indigo-600 shadow-sm">
                        {property.badge || 'Premium'}
                      </span>
                    </div>
                    <div className="absolute top-4 right-4 z-20">
                      <span className="px-3 py-1.5 bg-gray-900/80 backdrop-blur-md rounded-full text-[11px] font-bold text-white border border-white/20">
                        {property.capacity || '250+ Seats'}
                      </span>
                    </div>

                    {/* Hover Reveal Amenities */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 z-20 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent pt-12">
                      <div className="flex flex-wrap gap-2">
                        {(property.highlightAmenities && property.highlightAmenities.length > 0 
                          ? property.highlightAmenities 
                          : property.amenities?.slice(0, 4).map(a => a.name) || []
                        ).map((amenity, idx) => (
                          <span key={idx} className="px-2.5 py-1 bg-white/20 backdrop-blur-md border border-white/10 rounded-lg text-[11px] font-semibold text-white">
                            {amenity}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="px-4 pb-4 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                          {property.locality}
                        </p>
                        <button className="text-gray-300 hover:text-red-500 transition-colors">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                      <h3 className="text-2xl font-black text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                        {property.name}
                      </h3>
                    </div>

                    {/* Explore Button */}
                    <div className="mt-6">
                      <Link 
                        href={`/locations/${currentCityId}/${property.propertyId}`}
                        className="w-full flex items-center justify-center gap-2 bg-gray-50 hover:bg-gray-900 text-gray-900 hover:text-white py-3.5 rounded-xl text-sm font-bold transition-all duration-300 group/btn"
                      >
                        Explore Workspace
                        <svg className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}
      </section>
    </main>
  );
}