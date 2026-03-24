"use client";

import React, { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';

const solutionsData = [
  {
    id: 1,
    title: "Agile Coworking",
    tagline: "For Freelancers & Startups",
    desc: "Choose from co-working spaces ideal for freelancers, startups, and small businesses in a collaborative environment.",
    image: "https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?q=80&w=2070&auto=format&fit=crop",
  },
  {
    id: 2,
    title: "Serviced Offices",
    tagline: "Private & Premium",
    desc: "A serviced office is a fully equipped office managed by a facility firm, providing ready-to-use spaces with zero setup hassle.",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop",
  },
  {
    id: 3,
    title: "Virtual Offices",
    tagline: "Your Business Address",
    desc: "Establish a prestigious business address and register for GST or company registration seamlessly.",
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=2070&auto=format&fit=crop",
  },
  {
    id: 4,
    title: "Meeting Rooms",
    tagline: "Pitch & Present",
    desc: "Book state-of-the-art meeting rooms for client meetings, team discussions, pitches, and presentations.",
    image: "https://images.unsplash.com/photo-1517502884422-41eaead166d4?q=80&w=1925&auto=format&fit=crop",
  },
  {
    id: 5,
    title: "Training Rooms",
    tagline: "Learn & Grow",
    desc: "Flexible, tech-enabled spaces for corporate events, trainings, seminars, and large team meetings.",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop",
  },
];

export default function Solutions() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  const [activeIndex, setActiveIndex] = useState(0);
  const AUTO_SCROLL_SPEED = 4000; // 4 seconds per card

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    
    const scrollLeft = container.scrollLeft;
    const containerCenter = scrollLeft + container.clientWidth / 2;

    let closestIndex = 0;
    let minDistance = Infinity;

    Array.from(container.children).forEach((child: any, index) => {
      const childCenter = child.offsetLeft + child.clientWidth / 2;
      const distance = Math.abs(containerCenter - childCenter);
      
      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = index;
      }
    });

    if (closestIndex !== activeIndex) {
      setActiveIndex(closestIndex);
    }
  };

  // Continuous Auto-scroll logic (No hover pause)
  useEffect(() => {
    const interval = setInterval(() => {
      if (!scrollContainerRef.current) return;
      const container = scrollContainerRef.current;
      
      const nextIndex = activeIndex === solutionsData.length - 1 ? 0 : activeIndex + 1;
      const child = container.children[nextIndex] as HTMLElement;

      if (child) {
        const scrollPos = child.offsetLeft - container.clientWidth / 2 + child.clientWidth / 2;
        container.scrollTo({ left: scrollPos, behavior: 'smooth' });
      }
    }, AUTO_SCROLL_SPEED);

    return () => clearInterval(interval);
  }, [activeIndex]);

  return (
    <section className="py-16 md:py-20 bg-[#FAFAFA] relative overflow-hidden" ref={ref}>
      
      {/* Header Section with reduced bottom margin */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 text-center mb-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center space-x-2 bg-blue-50 border border-blue-100 rounded-full px-4 py-1.5 mb-6"
        >
          <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
          <span className="text-xs font-bold text-blue-700 uppercase tracking-widest">Tailored For You</span>
        </motion.div>

        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight mb-4"
        >
          Find your perfect <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">Workspace</span>
        </motion.h2>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto font-medium"
        >
          Immersive environments engineered for ultimate focus, seamless collaboration, and exponential growth.
        </motion.p>
      </div>

      {/* Carousel Section */}
      <div className="relative w-full mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          ref={scrollContainerRef}
          onScroll={handleScroll}
          style={{ paddingLeft: 'calc(50vw - 160px)', paddingRight: 'calc(50vw - 160px)' }}
          // Reduced vertical padding (py-8) to tighten the gap
          className="flex gap-4 md:gap-8 overflow-x-auto snap-x snap-mandatory py-8 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] scroll-smooth"
        >
          {solutionsData.map((solution, index) => {
            const isActive = activeIndex === index;

            return (
              <div 
                key={solution.id} 
                className={`group relative flex-shrink-0 w-[280px] sm:w-[320px] h-[450px] sm:h-[500px] bg-gray-900 rounded-[2.5rem] snap-center cursor-pointer overflow-hidden flex flex-col transition-all duration-700 ease-out border border-white/10 ${
                  isActive 
                    ? 'scale-100 opacity-100 shadow-[0_20px_50px_rgba(0,0,0,0.3)] z-20 grayscale-0' 
                    : 'scale-[0.85] opacity-40 hover:opacity-70 z-0 grayscale'
                }`}
              >
                {/* Image with slow continuous zoom when active */}
                <div className="absolute inset-0 w-full h-full overflow-hidden rounded-[2.5rem]">
                   <img 
                    src={solution.image} 
                    alt={solution.title} 
                    className={`w-full h-full object-cover transition-transform duration-[10000ms] ease-linear ${isActive ? 'scale-125' : 'scale-100'}`}
                  />
                </div>
                
                {/* Cinematic Dark Overlays */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/10 to-transparent opacity-80"></div>
                
                {/* Dynamic Bottom Gradient that rises when active */}
                <div className={`absolute bottom-0 left-0 w-full bg-gradient-to-t from-black via-black/80 to-transparent transition-all duration-700 ease-out ${isActive ? 'h-[75%]' : 'h-[40%]'}`}></div>

                {/* Top Profile Badge */}
                <div className="absolute top-6 left-6 flex items-center space-x-3 z-10">
                  <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center bg-white/10 backdrop-blur-md shadow-lg">
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <div className="flex flex-col">
                    <h3 className="text-white font-bold text-base tracking-wide shadow-black drop-shadow-md">{solution.title}</h3>
                    <p className="text-blue-300 text-xs font-semibold mt-0.5 tracking-wider uppercase">{solution.tagline}</p>
                  </div>
                </div>

                {/* Bottom Content Area */}
                <div className="absolute bottom-6 left-6 right-6 z-10 flex flex-col justify-end">
                  
                  {/* Glassmorphism Popup Description Container */}
                  <div 
                    className={`overflow-hidden transition-all duration-700 ease-in-out ${
                      isActive 
                        ? 'max-h-40 opacity-100 translate-y-0 mb-5' 
                        : 'max-h-0 opacity-0 translate-y-10 mb-0'
                    }`}
                  >
                    <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
                      <p className="text-sm text-gray-200 leading-relaxed font-medium">
                        {solution.desc}
                      </p>
                    </div>
                  </div>

                  {/* Enhanced Button */}
                  <button className="group/btn w-full flex items-center justify-center space-x-2 bg-white text-gray-900 hover:bg-blue-600 hover:text-white py-4 rounded-2xl text-sm font-bold transition-all duration-300 shadow-xl overflow-hidden relative">
                    <span className="relative z-10">Explore Space</span>
                    <svg className="w-4 h-4 relative z-10 transform group-hover/btn:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                </div>

                {/* Continuous Loading Progress Bar */}
                {isActive && (
                  <div className="absolute bottom-0 left-0 w-full h-1.5 bg-white/10 overflow-hidden">
                    <motion.div 
                      key={solution.id} // Re-triggers animation when active card changes
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ 
                        duration: AUTO_SCROLL_SPEED / 1000, 
                        ease: "linear" 
                      }}
                      className="h-full bg-blue-500 rounded-r-full"
                    />
                  </div>
                )}

              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}