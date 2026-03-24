"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";

/* ─── Interfaces ─────────────────────────────────────────── */
interface AwardData {
  id: number;
  year: string;
  number: string;
  title: string;
  issuer: string;
  category: string;
  color: string;
  colorLight: string;
  icon: string;
}

/* ─── Award Data ─────────────────────────────────────────── */
const awardsData: AwardData[] = [
  {
    id: 1,
    year: "2023–24",
    number: "01",
    title: "PropTech Brand of The Year",
    issuer: "Realty+",
    category: "Technology",
    color: "#D97706",          // Rich Gold/Amber
    colorLight: "rgba(217, 119, 6, 0.1)",
    icon: "◈",
  },
  {
    id: 2,
    year: "2019",
    number: "02",
    title: "Top 50 Tech Companies",
    issuer: "InterCon",
    category: "Innovation",
    color: "#0284C7",          // Ocean Blue
    colorLight: "rgba(2, 132, 199, 0.1)",
    icon: "◉",
  },
  {
    id: 3,
    year: "2019",
    number: "03",
    title: "Emerging Company Award",
    issuer: "National Leadership Summit",
    category: "Leadership",
    color: "#C026D3",          // Vibrant Fuchsia
    colorLight: "rgba(192, 38, 211, 0.1)",
    icon: "◍",
  },
  {
    id: 4,
    year: "2020–21",
    number: "04",
    title: "Coworking Tech of the Year",
    issuer: "Realty+",
    category: "Workspace",
    color: "#7C3AED",          // Deep Violet
    colorLight: "rgba(124, 58, 237, 0.1)",
    icon: "◎",
  },
];

/* ─── Ticker Strip ───────────────────────────────────────── */
function TickerStrip() {
  const words = ["AWARD WINNING", "INDUSTRY LEADER", "GLOBALLY RECOGNIZED", "INNOVATION PIONEER", "EXCELLENCE DEFINED"];
  const repeated = [...words, ...words, ...words];
  return (
    <div className="relative overflow-hidden border-y border-black/[0.04] py-4 bg-white/40 backdrop-blur-md z-10">
      <motion.div
        className="flex whitespace-nowrap gap-12"
        animate={{ x: ["0%", "-33.333%"] }}
        transition={{ duration: 25, ease: "linear", repeat: Infinity }}
      >
        {repeated.map((w, i) => (
          <span key={i} className="flex items-center gap-6 text-[12px] font-black tracking-[0.3em] text-gray-400">
            {w}
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-gray-300" />
          </span>
        ))}
      </motion.div>
    </div>
  );
}

/* ─── Animated Counter ───────────────────────────────────── */
function Counter({ target, suffix = "" }: { target: number | string; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    
    // Ensure we are parsing a string target safely
    const end = typeof target === 'string' ? parseInt(target, 10) : target;
    if (isNaN(end)) return;

    const duration = 1600;
    const step = Math.ceil(end / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { 
        setCount(end); 
        clearInterval(timer); 
      }
      else {
        setCount(start);
      }
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target]);

  return <span ref={ref}>{count}{suffix}</span>;
}

/* ─── Stat Block ─────────────────────────────────────────── */
function StatBlock({ value, suffix, label, delay }: { value: number | string; suffix?: string; label: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, delay }}
      className="flex flex-col relative z-10"
    >
      <span className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter leading-none drop-shadow-sm">
        <Counter target={value} suffix={suffix} />
      </span>
      <span className="text-[11px] font-bold tracking-[0.18em] text-gray-500 uppercase mt-2">{label}</span>
    </motion.div>
  );
}

/* ─── Award Card ─────────────────────────────────────────── */
function AwardCard({ award, index }: { award: AwardData; index: number }) {
  const [hovered, setHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.7, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={handleMouseMove}
      style={{ "--accent": award.color, "--accent-light": award.colorLight } as React.CSSProperties}
      className="relative group cursor-pointer rounded-[24px] overflow-hidden border border-white/60 bg-white/60 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)]
                 transition-all duration-500 ease-out hover:bg-white/90 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)]"
    >
      {/* Radial spotlight on mouse hover */}
      <div
        className="absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: hovered
            ? `radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, ${award.colorLight} 0%, transparent 60%)`
            : "none",
        }}
      />

      {/* Left accent bar */}
      <motion.div
        className="absolute left-0 top-0 bottom-0 w-[4px]"
        style={{ backgroundColor: award.color }}
        initial={{ scaleY: 0 }}
        animate={{ scaleY: hovered ? 1 : 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      />

      <div className="relative z-10 p-8 md:p-10">
        <div className="flex items-start justify-between gap-6">

          {/* Number + Icon */}
          <div className="flex items-center gap-5">
            <div className="relative flex-shrink-0">
              <span
                className="text-[46px] leading-none font-black transition-all duration-500"
                style={{ color: hovered ? award.color : "#E5E7EB" }}
              >
                {award.icon}
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span
                  className="text-[10px] font-black tracking-[0.2em] uppercase px-3 py-1 rounded-full border transition-colors duration-300 bg-white"
                  style={{
                    color: hovered ? award.color : "#6B7280",
                    borderColor: hovered ? award.color : "#E5E7EB",
                    backgroundColor: hovered ? award.colorLight : "#fff",
                  }}
                >
                  {award.category}
                </span>
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight leading-tight transition-colors duration-300">
                {award.title}
              </h3>
              <div className="flex items-center gap-2 mt-3">
                <span className="text-[11px] font-bold text-gray-400 tracking-widest uppercase">By</span>
                <span className="text-[13px] font-semibold text-gray-700">{award.issuer}</span>
              </div>
            </div>
          </div>

          {/* Year */}
          <div className="flex flex-col items-end flex-shrink-0 gap-1">
            <motion.span
              className="text-[11px] font-black tracking-[0.2em] text-gray-300 uppercase"
              animate={{ opacity: hovered ? 0 : 1 }}
              transition={{ duration: 0.2 }}
            >
              Year
            </motion.span>
            <span
              className="text-2xl font-black tracking-tighter transition-colors duration-300"
              style={{ color: hovered ? award.color : "#111827" }}
            >
              {award.year}
            </span>
            <span
              className="text-[11px] font-black tracking-[0.16em] text-gray-400 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            >
              {award.number}
            </span>
          </div>

        </div>

        {/* Bottom reveal bar */}
        <motion.div
          className="flex items-center gap-4 mt-8 pt-6 border-t border-gray-100"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 10 }}
          transition={{ duration: 0.3 }}
        >
          <span
            className="text-[11px] font-black tracking-[0.2em] uppercase"
            style={{ color: award.color }}
          >
            Awarded Excellence
          </span>
          <div className="flex-1 h-px" style={{ backgroundColor: award.color, opacity: 0.2 }} />
          <svg className="w-4 h-4" style={{ color: award.color }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </motion.div>
      </div>
    </motion.div>
  );
}

/* ─── Dynamic Color Changing Background (Light Mode) ───────── */
function AnimatedBackground() {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none bg-[#F8FAFC]">
      {/* Animated Gradient Mesh (Soft light colors) */}
      <motion.div
        className="absolute inset-0 opacity-60"
        animate={{
          background: [
            "radial-gradient(circle at 0% 0%, #F1F5F9 0%, transparent 70%)",
            "radial-gradient(circle at 100% 100%, #E2E8F0 0%, transparent 70%)",
            "radial-gradient(circle at 0% 100%, #F8FAFC 0%, transparent 70%)",
            "radial-gradient(circle at 0% 0%, #F1F5F9 0%, transparent 70%)",
          ],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />

      {/* Floating Glowing Orbs (Pastel/Vibrant mix for light mode) */}
      {[
        { cx: "10%", cy: "20%", r: 400, color: "#FBBF24", delay: 0 }, // Amber
        { cx: "85%", cy: "15%", r: 350, color: "#38BDF8", delay: 2 }, // Sky Blue
        { cx: "70%", cy: "80%", r: 500, color: "#E879F9", delay: 1 }, // Fuchsia
        { cx: "20%", cy: "85%", r: 450, color: "#A78BFA", delay: 3 }, // Purple
      ].map((o, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full blur-[90px] mix-blend-multiply opacity-30"
          style={{
            left: o.cx,
            top: o.cy,
            width: o.r,
            height: o.r,
            backgroundColor: o.color,
            transform: "translate(-50%, -50%)",
          }}
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 60, 0],
            y: [0, -60, 0],
          }}
          transition={{
            duration: 12 + i * 2,
            delay: o.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Fine Grid overlay */}
      <div 
        className="absolute inset-0 opacity-[0.04]"
        style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '32px 32px' }}
      />
    </div>
  );
}

/* ─── Main Section ───────────────────────────────────────── */
export default function PremiumAwardsLight() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const titleY = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const badgeScale = useTransform(scrollYProgress, [0, 0.3], [0.85, 1]);

  return (
    <section ref={sectionRef} className="relative bg-[#F8FAFC] overflow-hidden min-h-screen">

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Outfit:wght@300;400;500;600;700;800&display=swap');
        .awards-section { font-family: 'Outfit', sans-serif; }
        .awards-section .serif { font-family: 'Cormorant Garamond', Georgia, serif; }

        @keyframes shimmer-light {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .shimmer-text-light {
          background: linear-gradient(90deg, #111827 0%, #6B7280 40%, #111827 60%, #4B5563 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer-light 6s linear infinite;
        }
        
        @keyframes float-badge {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(5deg); }
        }
        .float-badge { animation: float-badge 6s ease-in-out infinite; }
      `}</style>

      <div className="awards-section relative">
        <AnimatedBackground />
        <TickerStrip />

        <div className="relative z-10">
          {/* ── Hero Header ── */}
          <div className="max-w-7xl mx-auto px-6 md:px-14 pt-24 md:pt-32 pb-16">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-12">

              {/* Left: Title block */}
              <div className="max-w-2xl">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.6 }}
                  className="flex items-center gap-4 mb-8"
                >
                  <div className="w-12 h-[2px] bg-gradient-to-r from-[#D97706] to-transparent" />
                  <span className="text-[12px] font-black tracking-[0.3em] text-[#D97706] uppercase">Recognition & Honours</span>
                </motion.div>

                <motion.h1
                  style={{ y: titleY }}
                  className="serif text-[64px] md:text-[88px] lg:text-[104px] font-bold text-gray-900 leading-[0.9] tracking-tight"
                >
                  <motion.span
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 1, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                    className="block"
                  >
                    Award
                  </motion.span>
                  <motion.span
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                    className="block italic shimmer-text-light"
                  >
                    Winning
                  </motion.span>
                  <motion.span
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    className="block text-gray-800"
                  >
                    Legacy
                  </motion.span>
                </motion.h1>
              </div>

              {/* Right: Stats + badge */}
              <div className="flex flex-col gap-10 lg:pb-4">
                {/* Floating badge */}
                <motion.div
                  style={{ scale: badgeScale }}
                  className="self-start lg:self-end float-badge relative"
                >
                  {/* Outer glow ring */}
                  <div className="absolute inset-0 bg-white/60 rounded-full blur-xl" />
                  
                  <div className="relative w-32 h-32 backdrop-blur-md bg-white/80 border border-white rounded-full flex items-center justify-center shadow-[0_8px_30px_rgb(0,0,0,0.06)]">
                    <svg viewBox="0 0 120 120" className="absolute inset-0 w-full h-full opacity-70">
                      <defs>
                        <path id="circle-path-light" d="M 60,60 m -46,0 a 46,46 0 1,1 92,0 a 46,46 0 1,1 -92,0" />
                      </defs>
                      <text className="text-[10px]" fill="#374151" fontSize="10.5" letterSpacing="4.5" fontFamily="'Outfit', sans-serif" fontWeight="700">
                        <textPath href="#circle-path-light">GLOBALLY RECOGNISED • SINCE 2019 •</textPath>
                      </text>
                    </svg>
                    <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#F59E0B] to-[#FDE68A] flex items-center justify-center shadow-[0_4px_20px_rgba(245,158,11,0.3)]">
                      <svg className="w-6 h-6 text-yellow-950" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    </div>
                  </div>
                </motion.div>

                {/* Stats row */}
                <div className="flex gap-8 md:gap-12 bg-white/60 border border-white shadow-sm backdrop-blur-xl p-6 rounded-2xl">
                  <StatBlock value={4} suffix="+" label="Awards Won" delay={0.4} />
                  <div className="w-px bg-gray-200" />
                  <StatBlock value={5} suffix="+" label="Years of Glory" delay={0.5} />
                  <div className="w-px bg-gray-200" />
                  <StatBlock value={3} suffix="" label="Top Bodies" delay={0.6} />
                </div>
              </div>

            </div>
          </div>

          {/* ── Cards Grid ── */}
          <div className="max-w-7xl mx-auto px-6 md:px-14 pb-24 md:pb-32">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {awardsData.map((award, index) => (
                <AwardCard key={award.id} award={award} index={index} />
              ))}
            </div>

            {/* Bottom editorial note */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="mt-20 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 p-8 rounded-2xl bg-white/60 border border-white shadow-sm backdrop-blur-xl"
            >
              <p className="max-w-md text-[14px] leading-relaxed text-gray-500 font-medium">
                Recognized by the most prestigious institutions in the real estate and technology space, 
                validating years of innovation and commitment to excellence.
              </p>
              <div className="flex items-center gap-4 cursor-pointer group">
                <span className="text-[12px] font-bold tracking-[0.2em] text-gray-500 uppercase group-hover:text-gray-900 transition-colors">View all</span>
                <div className="w-12 h-px bg-gray-300 group-hover:bg-gray-600 transition-colors" />
                <div className="w-10 h-10 rounded-full border border-gray-300 group-hover:border-gray-900 group-hover:bg-gray-900 flex items-center justify-center transition-all duration-300">
                  <svg className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}