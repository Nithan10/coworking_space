"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";

export default function Navbar() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [user, setUser] = useState(null);
  
  // --- Dynamic Locations State ---
  const [locationsData, setLocationsData] = useState([]);
  const [isLoadingLocations, setIsLoadingLocations] = useState(true);
  
  // Scroll State
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();
  
  // Mega Menu State
  const [isLocationMenuOpen, setIsLocationMenuOpen] = useState(false);
  const [activeCityId, setActiveCityId] = useState("");
  
  const navRef = useRef(null);
  const hoverTimeoutRef = useRef(null);

  // --- Auth Check ---
  const checkAuth = () => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    
    if (storedUser && token) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse user from local storage");
      }
    } else {
      setUser(null);
    }
  };

  // --- Fetch Dynamic Locations ---
  const fetchLocations = async (isInitial = false) => {
    try {
      if (isInitial) setIsLoadingLocations(true);
      
      const res = await fetch("http://localhost:5000/api/locations", {
        cache: 'no-store', 
      });
      const data = await res.json();
      
      if (data.success && data.data) {
        const formattedLocations = data.data
          .filter((loc) => loc.status === "published") 
          .map((loc) => ({
            id: loc.cityId,
            name: loc.cityName,
            description: loc.hero?.subheading || "Premium workspaces in this city.",
            image: loc.hero?.backgroundImage || "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?q=80&w=1000&auto=format&fit=crop",
            slug: loc.slug
          }));
          
        setLocationsData(formattedLocations);
        
        if (formattedLocations.length > 0) {
          setActiveCityId((prev) => prev || formattedLocations[0].id);
        }
      }
    } catch (error) {
      console.error("Failed to fetch locations:", error);
    } finally {
      setIsLoadingLocations(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    checkAuth();
    fetchLocations(true);

    const handleLocationUpdate = () => fetchLocations(false);

    window.addEventListener("storage", checkAuth);
    window.addEventListener("auth-change", checkAuth);
    window.addEventListener("locations-updated", handleLocationUpdate);

    return () => {
      window.removeEventListener("storage", checkAuth);
      window.removeEventListener("auth-change", checkAuth);
      window.removeEventListener("locations-updated", handleLocationUpdate);
    };
  }, []);

  // --- Smart Scroll Detection ---
  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > 40) {
      setIsScrolled(true);
      if (latest > 150) setIsLocationMenuOpen(false); 
    } else {
      setIsScrolled(false);
    }
  });

  // --- Mega Menu Hover Logic ---
  const handleMouseEnterMenu = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setIsLocationMenuOpen(true);
    fetchLocations(false); 
  };

  const handleMouseLeaveMenu = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setIsLocationMenuOpen(false);
    }, 200);
  };

  // --- Logout Handler ---
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null); 
    setHoveredIndex(null); 
    window.dispatchEvent(new Event("auth-change")); 
    router.push("/"); 
  };

  const navLinks = [
    { name: "Home", path: "/", isMenuTrigger: false, isLogin: false },
    { name: "Find Location", path: "#", isMenuTrigger: true, isLogin: false },
    { name: "Why Us", path: "/about", isMenuTrigger: false, isLogin: false },
    { name: "Login", path: "/login", isMenuTrigger: false, isLogin: true }, 
  ];

  const activeCity = locationsData.find(city => city.id === activeCityId) || locationsData[0];

  if (!mounted) return null;

  return (
    <div 
      ref={navRef} 
      className="fixed top-6 left-0 right-0 z-[100] flex flex-col items-center px-4 pointer-events-none"
    >
      
      {/* --- Main Pill Navbar --- */}
      <div
        className={`flex items-center transition-all duration-700 ease-in-out pointer-events-auto relative z-20 ${
          isScrolled || isLocationMenuOpen
            ? "gap-0 bg-white/95 backdrop-blur-md border border-gray-200 shadow-[0_8px_30px_rgb(0,0,0,0.08)] rounded-full p-1.5"
            : "gap-4 md:gap-6 bg-transparent border-transparent shadow-none p-0"
        }`}
      >
        
        {/* 1. Left Section: Logo */}
        <div
          className={`transition-all duration-700 ${
            !isScrolled && !isLocationMenuOpen
              ? "bg-white/95 backdrop-blur-md border border-gray-200 shadow-sm rounded-full px-5 py-3"
              : "px-4 py-2 border-transparent bg-transparent shadow-none"
          }`}
        >
          <Link href="/" onClick={() => setIsLocationMenuOpen(false)} className="flex items-center space-x-2 flex-shrink-0 group">
            <div className="w-8 h-8 border-2 border-indigo-700 rounded-full flex items-center justify-center bg-indigo-50 overflow-hidden relative group-hover:bg-indigo-100 transition-colors">
              <div className="absolute w-full h-[2px] bg-indigo-700 transform rotate-45"></div>
            </div>
            <span className="font-bold text-gray-900 hidden sm:block tracking-tight">SpaceHub</span>
          </Link>
        </div>

        {/* 2. Center Section: Navigation Links */}
        <div
          className={`hidden lg:flex items-center relative transition-all duration-700 ${
            !isScrolled && !isLocationMenuOpen
              ? "bg-white/95 backdrop-blur-md border border-gray-200 shadow-sm rounded-full px-6 py-2.5 space-x-2"
              : "px-2 py-1 border-transparent bg-transparent shadow-none space-x-1"
          }`}
        >
          {navLinks.map((link, index) => {
            const isHovered = hoveredIndex === index;
            const isActiveMenu = link.isMenuTrigger && isLocationMenuOpen;

            return (
              <div 
                key={link.name} 
                className="relative flex items-center"
                onMouseEnter={link.isMenuTrigger ? handleMouseEnterMenu : undefined}
                onMouseLeave={link.isMenuTrigger ? handleMouseLeaveMenu : undefined}
              >
                {/* Condition 1: Dropdown Trigger */}
                {link.isMenuTrigger ? (
                  <Link
                    href={link.path}
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    className={`relative rounded-full text-sm font-semibold transition-colors outline-none flex items-center gap-1.5 cursor-pointer ${
                      isScrolled || isLocationMenuOpen ? "px-4 py-2" : "px-3 py-2"
                    } ${isActiveMenu ? "text-indigo-700" : "text-gray-600 hover:text-gray-900"}`}
                  >
                    {isHovered && !isActiveMenu && (
                      <motion.div
                        layoutId="nav-hover-pill"
                        className="absolute inset-0 bg-gray-100/80 rounded-full -z-10"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    <span className="relative z-10">{link.name}</span>
                    <motion.svg 
                      animate={{ rotate: isLocationMenuOpen ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      className={`w-3.5 h-3.5 relative z-10 ${isLocationMenuOpen ? "text-indigo-700" : "text-gray-400"}`} 
                      fill="none" viewBox="0 0 24 24" stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                    </motion.svg>
                  </Link>
                ) : 
                
                /* Condition 2: Authentication Block (User Profile OR Login Button) */
                link.isLogin ? (
                  user ? (
                    <div className="relative group/user ml-2" onMouseEnter={() => setHoveredIndex(index)} onMouseLeave={() => setHoveredIndex(null)}>
                      <div
                        className={`relative flex items-center justify-center rounded-full text-sm font-bold overflow-hidden cursor-default transition-all duration-500 ${
                          isScrolled || isLocationMenuOpen 
                            ? "h-9 pl-1.5 pr-3 bg-indigo-50/50 text-indigo-700 hover:shadow-sm" 
                            : "h-[38px] pl-1.5 pr-4 bg-white text-gray-800 shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-gray-200/80 hover:border-indigo-400"
                        }`}
                      >
                        <span className="relative z-10 flex items-center gap-2 pr-1">
                          {user.avatar ? (
                            <img src={user.avatar} alt={user.name} className="w-6 h-6 rounded-full object-cover shadow-sm border border-indigo-100" />
                          ) : (
                            <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 text-xs shadow-inner">
                              {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                            </div>
                          )}
                          <span className="flex items-center gap-1.5">
                            {user.name ? user.name.split(" ")[0] : "User"}
                            <svg 
                              className="w-3.5 h-3.5 text-gray-400 group-hover/user:text-indigo-600 transition-transform duration-300 group-hover/user:-rotate-180" 
                              fill="none" 
                              viewBox="0 0 24 24" 
                              stroke="currentColor"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                            </svg>
                          </span>
                        </span>
                      </div>

                      {/* USER DROPDOWN MENU */}
                      <div className="absolute top-full right-0 pt-2 w-64 opacity-0 invisible group-hover/user:opacity-100 group-hover/user:visible transition-all duration-300 transform origin-top-right scale-95 group-hover/user:scale-100 z-50">
                        <div className="bg-white rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.12)] border border-gray-100 p-2 overflow-hidden">
                          <div className="px-3 py-2.5 border-b border-gray-100 mb-2">
                            <p className="text-xs font-medium text-gray-500 truncate">{user.email}</p>
                            {user.role === 'admin' && (
                              <span className="inline-block mt-1.5 px-2 py-0.5 bg-indigo-100 text-indigo-700 text-[10px] font-bold uppercase rounded-md tracking-wider">
                                Admin
                              </span>
                            )}
                          </div>
                          
                          {user.role === 'admin' ? (
                            <Link href="/admin" onClick={() => setHoveredIndex(null)} className="w-full text-left px-3 py-2.5 text-sm text-indigo-700 font-bold hover:bg-indigo-50 rounded-lg transition-colors flex items-center gap-2.5">
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                              Admin Dashboard
                            </Link>
                          ) : (
                            <div className="space-y-1">
                              {/* HIGHLIGHTED: My SpaceWork */}
                              <Link href="/dashboard" onClick={() => setHoveredIndex(null)} className="group/item w-full text-left px-2 py-2 text-sm text-gray-700 font-semibold hover:bg-indigo-50 hover:text-indigo-700 rounded-lg transition-all duration-200 flex items-center gap-3">
                                <div className="bg-gray-50 border border-gray-100 p-1.5 rounded-md group-hover/item:bg-white group-hover/item:border-indigo-100 group-hover/item:shadow-sm transition-all">
                                  <svg className="w-4 h-4 text-gray-400 group-hover/item:text-indigo-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                  </svg>
                                </div>
                                My SpaceWork
                              </Link>
                              
                              {/* HIGHLIGHTED: My Requests */}
                              <Link href="/requests" onClick={() => setHoveredIndex(null)} className="group/item w-full text-left px-2 py-2 text-sm text-gray-700 font-semibold hover:bg-indigo-50 hover:text-indigo-700 rounded-lg transition-all duration-200 flex items-center gap-3">
                                <div className="bg-gray-50 border border-gray-100 p-1.5 rounded-md group-hover/item:bg-white group-hover/item:border-indigo-100 group-hover/item:shadow-sm transition-all">
                                  <svg className="w-4 h-4 text-gray-400 group-hover/item:text-indigo-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                                  </svg>
                                </div>
                                My Requests
                              </Link>
                            </div>
                          )}

                          <button onClick={handleLogout} className="w-full text-left px-3 py-2.5 text-sm text-red-600 font-semibold hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2.5 mt-2 border-t border-gray-50">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                            Sign Out
                          </button>

                        </div>
                      </div>
                    </div>
                  ) : (
                    <Link
                      href={link.path}
                      onClick={() => setIsLocationMenuOpen(false)}
                      className={`relative flex items-center justify-center rounded-full text-sm font-bold overflow-hidden group ml-2 transition-all duration-500 ${
                        isScrolled || isLocationMenuOpen 
                          ? "h-9 px-5 bg-gray-100/80 text-gray-700 hover:shadow-sm" 
                          : "h-[38px] px-6 bg-white text-gray-800 shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-gray-200/80 hover:border-indigo-400 hover:shadow-[0_8px_20px_-6px_rgba(79,70,229,0.3)]"
                      }`}
                    >
                      <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-indigo-600 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out" />
                      <span className="relative z-10 flex items-center justify-center text-gray-700 group-hover:text-white transition-colors duration-300 pr-1">
                        <span className="transform translate-x-1 group-hover:-translate-x-1 transition-transform duration-300 ease-out">
                          {link.name}
                        </span>
                        <svg className="absolute -right-2 w-3.5 h-3.5 opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300 ease-out" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </span>
                    </Link>
                  )
                ) : 
                
                /* Condition 3: Standard Text Link */
                (
                  <Link
                    href={link.path}
                    onClick={() => setIsLocationMenuOpen(false)}
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    className={`relative rounded-full text-sm font-semibold transition-colors hover:text-gray-900 block ${
                      isScrolled || isLocationMenuOpen ? "px-4 py-2 text-gray-600" : "px-3 py-2 text-gray-600"
                    }`}
                  >
                    {isHovered && (
                      <motion.div
                        layoutId="nav-hover-pill"
                        className="absolute inset-0 bg-gray-100/80 rounded-full -z-10"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    <span className="relative z-10">{link.name}</span>
                  </Link>
                )}
              </div>
            );
          })}
        </div>

        {/* 3. Right Section: Enquire Now Button */}
        <div
          className={`transition-all duration-700 ${
            !isScrolled && !isLocationMenuOpen
              ? "bg-white/95 backdrop-blur-md border border-gray-200 shadow-sm rounded-full p-1.5"
              : "pl-2 pr-1 border-transparent bg-transparent shadow-none"
          }`}
        >
          <Link href="/enquire" className="bg-gray-900 hover:bg-black text-white px-7 py-2.5 rounded-full text-sm font-bold transition-transform active:scale-95 shadow-sm whitespace-nowrap inline-block">
            Enquire Now
          </Link>
        </div>
      </div>

      {/* --- Mega Menu Dropdown (Hover Triggered) --- */}
      <AnimatePresence>
        {isLocationMenuOpen && (
          <motion.div
            onMouseEnter={handleMouseEnterMenu}
            onMouseLeave={handleMouseLeaveMenu}
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
            className="absolute top-full mt-2 pt-2 w-[95vw] max-w-[1000px] pointer-events-auto z-10"
          >
            <div className="bg-white rounded-[2rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.15)] border border-gray-100 flex overflow-hidden h-[400px]">
              
              {/* Left Sidebar: City List */}
              <div className="w-[30%] bg-[#FAFAFA] border-r border-gray-100 py-6 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                <div className="flex flex-col space-y-1 px-4">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-[0.15em] mb-4 px-4">Destinations</h3>
                  
                  {isLoadingLocations ? (
                    <div className="text-sm text-gray-400 px-4">Loading cities...</div>
                  ) : locationsData.length === 0 ? (
                    <div className="text-sm text-gray-400 px-4">No published locations found.</div>
                  ) : (
                    locationsData.map((city) => {
                      const isActive = activeCityId === city.id;
                      return (
                        <Link
                          href={`/locations/${city.slug}`}
                          key={city.id}
                          onMouseEnter={() => setActiveCityId(city.id)}
                          onClick={() => setIsLocationMenuOpen(false)}
                          className={`relative w-full text-left px-5 py-3.5 rounded-xl flex items-center justify-between transition-all duration-300 ${
                            isActive 
                              ? "bg-white shadow-sm border border-gray-200/60 text-indigo-700" 
                              : "text-gray-600 hover:bg-gray-200/50 hover:text-gray-900 border border-transparent"
                          }`}
                        >
                          {isActive && (
                            <motion.div 
                              layoutId="active-city-indicator" 
                              className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-1/2 bg-gradient-to-b from-indigo-500 to-indigo-700 rounded-r-full" 
                            />
                          )}
                          <span className={`text-[15px] ${isActive ? "font-bold" : "font-medium"}`}>{city.name}</span>
                          <svg className={`w-4 h-4 transition-transform duration-300 ${isActive ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                          </svg>
                        </Link>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Right Content Area: Hero Image Design */}
              <div className="w-[70%] bg-white p-3 relative flex items-center">
                <AnimatePresence mode="wait">
                  {activeCity ? (
                    <motion.div
                      key={activeCity.id}
                      initial={{ opacity: 0, scale: 0.98, filter: "blur(4px)" }}
                      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                      exit={{ opacity: 0, scale: 0.98, filter: "blur(4px)", transition: { duration: 0.2 } }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                      className="w-full h-full rounded-2xl overflow-hidden relative group flex items-center bg-gray-100"
                    >
                      <div className="absolute inset-0">
                        <img 
                          src={activeCity.image} 
                          alt={activeCity.name} 
                          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-[15s] ease-out" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/95 via-gray-900/70 to-transparent" />
                      </div>

                      <div className="relative z-10 px-10 max-w-md">
                        <motion.div 
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.4, delay: 0.1 }}
                        >
                          <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-md border border-white/20 rounded-full px-3 py-1 mb-4">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                            <span className="text-[10px] font-bold text-white uppercase tracking-widest">Premium Spaces</span>
                          </div>
                          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4">{activeCity.name}</h2>
                          <p className="text-gray-300 text-base leading-relaxed mb-8 font-medium">
                            {activeCity.description}
                          </p>
                          <Link 
                            href={`/locations/${activeCity.slug}`} 
                            onClick={() => setIsLocationMenuOpen(false)}
                            className="inline-flex items-center justify-center bg-white text-gray-900 px-6 py-3 rounded-xl font-bold transition-all hover:bg-indigo-50 hover:scale-105 w-fit group/btn"
                          >
                            Explore {activeCity.name}
                            <svg className="w-4 h-4 ml-2 transform group-hover/btn:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                          </Link>
                        </motion.div>
                      </div>

                    </motion.div>
                  ) : (
                    <div className="flex items-center justify-center w-full h-full text-gray-400">
                      No locations available yet.
                    </div>
                  )}
                </AnimatePresence>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}