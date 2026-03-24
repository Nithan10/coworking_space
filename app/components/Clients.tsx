"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useInView, useSpring, useTransform, useMotionValue } from "framer-motion";

// ==========================================
// INTERFACES
// ==========================================
interface CompanyType {
  name: string;
  logo: string;
  color: string;
}

// Mock data adapted for a vibrant light theme
const companies: CompanyType[] = [
  { name: "Urban Money", logo: "URBAN MONEY", color: "from-emerald-500 to-emerald-700" },
  { name: "JM Financial", logo: "JM FINANCIAL", color: "from-rose-500 to-red-700" },
  { name: "TVS", logo: "TVS", color: "from-blue-500 to-blue-800" },
  { name: "Vserve", logo: "VSERVE", color: "from-orange-500 to-amber-700" },
  { name: "ONE", logo: "ONE", color: "from-teal-400 to-teal-700" },
  { name: "upGrad", logo: "upGrad", color: "from-pink-500 to-rose-700" },
  { name: "Elcom", logo: "ELCOM", color: "from-slate-600 to-slate-800" },
  { name: "TechNova", logo: "TECHNOVA", color: "from-indigo-500 to-purple-700" },
];

/* ─── Reusable 3D Hover Card ─────────────────────────────── */
const CompanyCard = ({ company }: { company: CompanyType }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Softer springs for buttery smooth rotation
  const mouseXSpring = useSpring(x, { stiffness: 100, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 100, damping: 20 });

  // Reduced rotation angle for a more compact, subtle effect
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["8deg", "-8deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-8deg", "8deg"]);

  const glareX = useTransform(mouseXSpring, [-0.5, 0.5], ["0%", "100%"]);
  const glareY = useTransform(mouseYSpring, [-0.5, 0.5], ["0%", "100%"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    x.set(mouseX / width - 0.5);
    y.set(mouseY / height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className="group relative w-[180px] h-[90px] md:w-[220px] md:h-[100px] flex-shrink-0 cursor-pointer"
    >
      {/* Outer ambient glow */}
      <div className={`absolute -inset-0.5 rounded-2xl blur-lg opacity-0 group-hover:opacity-20 transition-opacity duration-500 bg-gradient-to-br ${company.color}`} />
      
      {/* Card Body */}
      <div className="absolute inset-0 bg-white/60 backdrop-blur-md rounded-2xl border border-white/80 shadow-[0_4px_20px_rgb(0,0,0,0.03)] flex items-center justify-center p-4 overflow-hidden transition-all duration-300 group-hover:bg-white group-hover:shadow-[0_10px_30px_-10px_rgba(0,0,0,0.1)]">
        
        {/* Interactive Glare */}
        <motion.div 
          className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 mix-blend-overlay"
          style={{
            background: `radial-gradient(circle at top left, rgba(255,255,255,0.9) 0%, transparent 60%)`,
            x: glareX,
            y: glareY
          }}
        />

        {/* Logo Text */}
        <h3 
          style={{ transform: "translateZ(20px)" }}
          className={`text-xl md:text-2xl font-black tracking-tighter opacity-50 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500 text-transparent bg-clip-text bg-gradient-to-br ${company.color}`}
        >
          {company.logo}
        </h3>
      </div>
    </motion.div>
  );
};

/* ─── Star Rating Component ──────────────────────────────── */
const StarRating = () => (
  <div className="flex items-center space-x-0.5">
    {[...Array(5)].map((_, i) => (
      <svg key={i} className="w-3.5 h-3.5 text-amber-400 drop-shadow-sm" fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))}
  </div>
);

/* ─── Main Section ───────────────────────────────────────── */
export default function GreatCompanyCompactLight() {
  const containerRef = useRef<HTMLElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-50px" });
  
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePos({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
    };
    const container = containerRef.current;
    if (container) container.addEventListener('mousemove', handleMouseMove);
    return () => {
      if (container) container.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const topRow = [...companies, ...companies, ...companies];
  const bottomRow = [...companies].reverse();
  const bottomRowDuplicated = [...bottomRow, ...bottomRow, ...bottomRow];

  return (
    <section 
      ref={containerRef}
      className="relative py-16 md:py-20 bg-[#F8FAFC] overflow-hidden"
      style={{ perspective: "1000px" }}
    >
      {/* ─── Background ─── */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <motion.div 
          animate={{ x: [0, 30, 0], y: [0, -20, 0], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[10%] left-[20%] w-[30vw] h-[30vw] rounded-full bg-blue-300/30 blur-[100px]"
        />
        <motion.div 
          animate={{ x: [0, -30, 0], y: [0, 30, 0], opacity: [0.15, 0.3, 0.15] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-[10%] right-[10%] w-[40vw] h-[40vw] rounded-full bg-indigo-300/20 blur-[100px]"
        />
        
        <div 
          className="absolute inset-0 transition-opacity duration-300 ease-out"
          style={{
            background: `radial-gradient(500px circle at ${mousePos.x}px ${mousePos.y}px, rgba(255,255,255,0.7), transparent 50%)`
          }}
        />

        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{ backgroundImage: "linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)", backgroundSize: "32px 32px" }}
        />
      </div>

      {/* ─── Hero Header ─── */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center mb-12 md:mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center"
        >
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/60 backdrop-blur-md border border-slate-200 shadow-sm mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-slate-500">Trusted Global Partners</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight mb-4 leading-[1.1]">
            You Are In <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
              Great Company
            </span>
          </h2>
          
          <p className="text-base md:text-lg text-slate-500 font-medium max-w-xl mx-auto leading-relaxed">
            From ambitious startups to global enterprises, we engineer ideal workspaces for industry leaders.
          </p>
        </motion.div>
      </div>

      {/* ─── Dual Marquee ─── */}
      <div className="relative w-full max-w-[100vw] mx-auto z-10 flex flex-col gap-4 md:gap-6">
        
        {/* Edge Fade Masks */}
        <div className="absolute top-0 bottom-0 left-0 w-24 md:w-64 bg-gradient-to-r from-[#F8FAFC] via-[#F8FAFC]/90 to-transparent z-20 pointer-events-none" />
        <div className="absolute top-0 bottom-0 right-0 w-24 md:w-64 bg-gradient-to-l from-[#F8FAFC] via-[#F8FAFC]/90 to-transparent z-20 pointer-events-none" />

        {/* Top Track */}
        <div className="flex w-max" style={{ perspective: "800px" }}>
          <motion.div 
            animate={{ x: ["0%", "-33.333%"] }}
            transition={{ ease: "linear", duration: 35, repeat: Infinity }}
            className="flex gap-4 md:gap-6 pr-4 md:pr-6" 
          >
            {topRow.map((company, index) => (
              <CompanyCard key={`top-${index}`} company={company} />
            ))}
          </motion.div>
        </div>

        {/* Bottom Track */}
        <div className="flex w-max justify-end" style={{ transform: "translateX(-33.333%)", perspective: "800px" }}>
          <motion.div 
            animate={{ x: ["0%", "33.333%"] }}
            transition={{ ease: "linear", duration: 40, repeat: Infinity }}
            className="flex gap-4 md:gap-6 pr-4 md:pr-6" 
          >
            {bottomRowDuplicated.map((company, index) => (
              <CompanyCard key={`bottom-${index}`} company={company} />
            ))}
          </motion.div>
        </div>

      </div>

      {/* ─── Compact Trust Dock ─── */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={isInView ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.8, delay: 0.3, type: "spring", bounce: 0.4 }}
        className="mt-14 flex justify-center relative z-20 px-4"
      >
        <div className="relative flex flex-col sm:flex-row items-center gap-1.5 p-1.5 bg-white/90 backdrop-blur-xl border border-slate-200/60 rounded-full shadow-[0_10px_30px_-10px_rgba(0,0,0,0.06)]">
          
          {/* Trustpilot */}
          <div className="flex items-center gap-3 px-5 py-2.5 rounded-full hover:bg-slate-50 transition-colors duration-300 cursor-pointer group">
            <div className="flex items-center gap-2">
              <div className="bg-[#00B67A] p-1.5 rounded-md shadow-sm group-hover:scale-105 transition-transform duration-300">
                <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <span className="font-bold text-sm text-slate-800 tracking-tight">Trustpilot</span>
            </div>
            <div className="w-px h-6 bg-slate-200" />
            <div className="flex items-center gap-1.5">
              <StarRating />
              <span className="text-sm font-bold text-slate-700">4.8</span>
            </div>
          </div>

          <div className="hidden sm:block w-px h-8 bg-slate-200 mx-1" />

          {/* Google */}
          <div className="flex items-center gap-3 px-5 py-2.5 rounded-full hover:bg-slate-50 transition-colors duration-300 cursor-pointer group">
            <div className="flex items-center font-bold tracking-tighter text-lg group-hover:scale-105 transition-transform duration-300">
              <span className="text-[#4285F4]">G</span>
              <span className="text-[#EA4335]">o</span>
              <span className="text-[#FBBC05]">o</span>
              <span className="text-[#4285F4]">g</span>
              <span className="text-[#34A853]">l</span>
              <span className="text-[#EA4335]">e</span>
            </div>
            <div className="w-px h-6 bg-slate-200" />
            <div className="flex items-center gap-1.5">
              <StarRating />
              <span className="text-sm font-bold text-slate-700">4.8</span>
            </div>
          </div>

        </div>
      </motion.div>
    </section>
  );
}