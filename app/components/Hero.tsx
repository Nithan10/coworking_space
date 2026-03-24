"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform, Variants } from "framer-motion";

/* ─────────────────────────────────────────
   Data
───────────────────────────────────────── */
type PricingTier = "Hot Desk" | "Dedicated" | "Private Office";

const pricingData: Record<PricingTier, { price: string; period: string; desc: string; badge: string; color: string }> = {
  "Hot Desk": {
    price: "₹4,999",
    period: "/mo",
    desc: "Flexible seating across our premium open lounges — pay only for what you use.",
    badge: "Most Popular",
    color: "#3B82F6", // Blue
  },
  Dedicated: {
    price: "₹8,499",
    period: "/mo",
    desc: "Your own permanent desk with lockable storage and 24/7 access.",
    badge: "Best Value",
    color: "#8B5CF6", // Violet
  },
  "Private Office": {
    price: "₹24,999",
    period: "/mo",
    desc: "Fully furnished private suites for teams of 2–50 with enterprise perks.",
    badge: "For Teams",
    color: "#10B981", // Emerald
  },
};

const amenities = ["Gigabit WiFi", "Barista Café", "24/7 Access", "Bike Storage", "Soundproof Pods"];

const stats = [
  { value: "2,000+", label: "Members" },
  { value: "4.9★", label: "Rated" },
  { value: "12+", label: "Locations" },
];

/* ─────────────────────────────────────────
   Utilities & Sub-components
───────────────────────────────────────── */

interface ParallaxDivProps {
  children: React.ReactNode;
  speed?: number;
  className?: string;
  style?: React.CSSProperties; // <-- Added this
}

// Scroll-aware parallax wrapper
function ParallaxDiv({ children, speed = 0.15, className = "", style = {} }: ParallaxDivProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 800], [0, -800 * speed]);
  return (
    <motion.div ref={ref} style={{ y, ...style }} className={className}>
      {children}
    </motion.div>
  );
}

interface CounterProps {
  target: string;
  suffix?: string;
}

// Animated number counter
function Counter({ target, suffix = "" }: CounterProps) {
  const [val, setVal] = useState(0);
  const numTarget = parseInt(target.replace(/[^0-9]/g, ""), 10);
  
  useEffect(() => {
    let start = 0;
    const step = Math.ceil(numTarget / 40);
    const timer = setInterval(() => {
      start += step;
      if (start >= numTarget) { 
        setVal(numTarget); 
        clearInterval(timer); 
      }
      else {
        setVal(start);
      }
    }, 28);
    return () => clearInterval(timer);
  }, [numTarget]);
  
  return <>{target.replace(/[0-9]+/, val.toString())}{suffix}</>;
}

interface ParticleProps {
  style: {
    width: number;
    height: number;
    top?: string;
    bottom?: string;
    left?: string;
    right?: string;
    backgroundColor: string;
    duration?: number;
    delay?: number;
  };
}

// Ambient floating particle
function Particle({ style }: ParticleProps) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={style as any} // Cast to any to handle custom duration/delay injection cleanly
      animate={{
        y: [0, -24, 0],
        x: [0, 8, 0],
        opacity: [0.4, 0.7, 0.4],
      }}
      transition={{
        duration: style.duration || 6,
        repeat: Infinity,
        ease: "easeInOut",
        delay: style.delay || 0,
      }}
    />
  );
}

/* ─────────────────────────────────────────
   Main Hero Component
───────────────────────────────────────── */
export default function Hero() {
  const [activeTab, setActiveTab] = useState<PricingTier>("Hot Desk");
  const [amenityIdx, setAmenityIdx] = useState(0);
  const [imgLoaded, setImgLoaded] = useState(false);
  const active = pricingData[activeTab];

  // Cycle amenities for the floating badge
  useEffect(() => {
    const t = setInterval(() => setAmenityIdx((i) => (i + 1) % amenities.length), 2400);
    return () => clearInterval(t);
  }, []);

  // Ease curves - locked to a specific 4-number tuple
  const ease = [0.22, 1, 0.36, 1] as const;

  // Stagger container typed as Variants
  const stagger: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.13, delayChildren: 0.15 } },
  };
  
  const up: Variants = {
    hidden: { opacity: 0, y: 36, filter: "blur(6px)" },
    show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.75, ease } },
  };

  const particles = [
    { width: 10, height: 10, top: "18%", left: "6%", backgroundColor: "#3B82F630", duration: 7, delay: 0 },
    { width: 6, height: 6, top: "68%", left: "3%", backgroundColor: "#8B5CF630", duration: 9, delay: 1.5 },
    { width: 14, height: 14, top: "40%", right: "4%", backgroundColor: "#10B98130", duration: 8, delay: 0.8 },
    { width: 8, height: 8, top: "80%", right: "8%", backgroundColor: "#3B82F620", duration: 6.5, delay: 2 },
    { width: 5, height: 5, top: "12%", right: "18%", backgroundColor: "#8B5CF620", duration: 10, delay: 3 },
  ];

  return (
    <>
      {/* ── Font imports & Styles ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,800;1,700&family=Outfit:wght@300;400;500;600;700&display=swap');

        .hero-root * { box-sizing: border-box; }

        .hero-root {
          font-family: 'Outfit', sans-serif;
          --bg-light: #FFFFFF;
          --bg-mid: #F8FAFC;
          --border-light: #E2E8F0;
          --ink: #0F172A;
          --ink-mid: #334155;
          --ink-light: #64748B;
          --primary: #4F46E5;
          --primary-hover: #4338CA;
          --accent-blue: #3B82F6;
        }

        .serif { font-family: 'Playfair Display', Georgia, serif; }

        @keyframes shimmer-line {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .primary-shimmer {
          background: linear-gradient(90deg, #4F46E5 0%, #818CF8 45%, #4F46E5 70%, #3730A3 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer-line 4s linear infinite;
        }

        @keyframes badge-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(79, 70, 229, 0.25); }
          50% { box-shadow: 0 0 0 8px rgba(79, 70, 229, 0); }
        }
        .badge-pulse { animation: badge-pulse 2.4s ease-in-out infinite; }

        .tab-pill {
          position: relative;
          cursor: pointer;
          padding: 8px 18px;
          border-radius: 999px;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.02em;
          transition: color 0.25s;
          border: none;
          background: transparent;
          color: var(--ink-light);
          z-index: 1;
        }
        .tab-pill.active { color: var(--ink); }

        .image-frame {
          border-radius: 28px;
          overflow: hidden;
          position: relative;
        }
        .image-frame::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(165deg, transparent 55%, rgba(15, 23, 42, 0.08) 100%);
          z-index: 1;
          pointer-events: none;
        }

        .cta-btn {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: var(--ink);
          color: #fff;
          font-weight: 700;
          font-size: 14px;
          letter-spacing: 0.04em;
          padding: 14px 28px;
          border-radius: 999px;
          border: none;
          cursor: pointer;
          transition: background 0.25s, transform 0.2s, box-shadow 0.25s;
          box-shadow: 0 4px 20px rgba(15, 23, 42, 0.12);
        }
        .cta-btn:hover {
          background: var(--primary);
          transform: translateY(-2px);
          box-shadow: 0 8px 28px rgba(79, 70, 229, 0.25);
        }
        .cta-btn svg { transition: transform 0.25s; }
        .cta-btn:hover svg { transform: translateX(4px); }

        .secondary-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: transparent;
          color: var(--ink);
          font-weight: 600;
          font-size: 14px;
          padding: 14px 20px;
          border-radius: 999px;
          border: 1.5px solid var(--border-light);
          cursor: pointer;
          transition: border-color 0.25s, background 0.25s;
        }
        .secondary-btn:hover { border-color: var(--primary); background: rgba(79, 70, 229, 0.04); }

        .float-card {
          background: #fff;
          border-radius: 18px;
          box-shadow: 0 12px 40px rgba(15, 23, 42, 0.06), 0 2px 8px rgba(15, 23, 42, 0.03);
          border: 1px solid rgba(226, 232, 240, 0.8);
        }

        .stat-divider { width: 1px; background: var(--border-light); height: 36px; }

        .pricing-card {
          background: #fff;
          border-radius: 24px;
          border: 1px solid var(--border-light);
          box-shadow: 0 8px 32px rgba(15, 23, 42, 0.04);
          overflow: hidden;
          transition: box-shadow 0.3s;
        }

        .tag-chip {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          padding: 4px 10px;
          border-radius: 999px;
          border: 1px solid;
        }

        .diagonal-rule {
          width: 1px;
          height: 48px;
          background: linear-gradient(to bottom, transparent, var(--border-light), transparent);
          transform: rotate(15deg);
        }
      `}</style>

      <section className="hero-root">
        {/* ── Floating ambient particles ── */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
          {particles.map((p, i) => <Particle key={i} style={p} />)}
          {/* Large ambient blobs */}
          <div style={{
            position: "absolute", top: "5%", right: "-10%",
            width: 500, height: 500,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(79, 70, 229, 0.05) 0%, transparent 70%)",
            pointerEvents: "none",
          }} />
          <div style={{
            position: "absolute", bottom: "-5%", left: "-8%",
            width: 420, height: 420,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(59, 130, 246, 0.05) 0%, transparent 70%)",
            pointerEvents: "none",
          }} />
        </div>

        {/* ── Dot grid ── */}
        <div style={{
          position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none",
          backgroundImage: "radial-gradient(circle, #CBD5E1 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          opacity: 0.3,
        }} />

        {/* ── Main wrapper ── */}
        <div style={{
          position: "relative", zIndex: 1,
          minHeight: "100vh",
          background: "linear-gradient(150deg, #FFFFFF 0%, #F8FAFC 45%, #F1F5F9 100%)",
          paddingTop: 60,
          paddingBottom: 60,
        }}>

          {/* ── Content ── */}
          <div style={{ maxWidth: 1260, margin: "0 auto", padding: "0 28px" }}>

            {/* ── Two-column grid ── */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 56,
              alignItems: "center",
              paddingTop: 64,
            }}
              className="hero-grid"
            >
              {/* ═══════════════════════════════════
                 LEFT COLUMN
              ═══════════════════════════════════ */}
              <motion.div
                initial="hidden"
                animate="show"
                variants={stagger}
                style={{ maxWidth: 580 }}
              >
                {/* Location pill */}
                <motion.div variants={up} style={{ marginBottom: 28, display: "flex", alignItems: "center", gap: 10 }}>
                  <span className="badge-pulse" style={{
                    display: "inline-flex", alignItems: "center", gap: 8,
                    background: "rgba(79, 70, 229, 0.05)", border: "1px solid rgba(79, 70, 229, 0.15)",
                    borderRadius: 999, padding: "6px 14px",
                    fontSize: 12, fontWeight: 700, color: "#4F46E5",
                    letterSpacing: "0.06em", textTransform: "uppercase",
                  }}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#4F46E5", display: "inline-block", animation: "badge-pulse 2s infinite" }} />
                    Now Open · Koramangala
                  </span>
                  <div className="diagonal-rule" />
                  <span style={{ fontSize: 12, color: "#64748B", fontWeight: 500 }}>Bengaluru, India</span>
                </motion.div>

                {/* Headline */}
                <motion.div variants={up} style={{ marginBottom: 24 }}>
                  <h1 className="serif" style={{
                    fontSize: "clamp(48px, 6vw, 80px)",
                    fontWeight: 800,
                    color: "#0F172A",
                    lineHeight: 1.0,
                    letterSpacing: "-0.02em",
                    margin: 0,
                  }}>
                    Your best
                    <br />
                    work starts
                    <br />
                    <span className="primary-shimmer">here.</span>
                  </h1>
                </motion.div>

                {/* Sub copy */}
                <motion.p variants={up} style={{
                  fontSize: 17, color: "#475569", lineHeight: 1.75,
                  maxWidth: 440, marginBottom: 36, fontWeight: 400,
                }}>
                  Premium workspaces designed for focus, flow, and unexpected collaboration — with zero long-term commitment.
                </motion.p>

                {/* ── Pricing card ── */}
                <motion.div variants={up} className="pricing-card" style={{ maxWidth: 460, marginBottom: 32 }}>
                  {/* Tabs */}
                  <div style={{
                    display: "flex", gap: 4, padding: "8px 8px 0",
                    background: "#F8FAFC", borderBottom: "1px solid #E2E8F0",
                  }}>
                    {(Object.keys(pricingData) as PricingTier[]).map((tab) => {
                      const isActive = tab === activeTab;
                      return (
                        <button
                          key={tab}
                          onClick={() => setActiveTab(tab)}
                          className={`tab-pill ${isActive ? "active" : ""}`}
                          style={{ flex: 1, textAlign: "center" }}
                        >
                          {isActive && (
                            <motion.div
                              layoutId="tab-bg"
                              style={{
                                position: "absolute", inset: 0,
                                background: "#fff",
                                borderRadius: 999,
                                border: "1px solid #E2E8F0",
                                boxShadow: "0 2px 8px rgba(15, 23, 42, 0.04)",
                                zIndex: -1,
                              }}
                              transition={{ type: "spring", stiffness: 380, damping: 30 }}
                            />
                          )}
                          {tab}
                        </button>
                      );
                    })}
                  </div>

                  {/* Pricing content */}
                  <div style={{ padding: "20px 24px 24px" }}>
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 14, filter: "blur(4px)" }}
                        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
                        transition={{ duration: 0.28, ease }}
                      >
                        {/* Badge */}
                        <div style={{ marginBottom: 12 }}>
                          <span className="tag-chip" style={{
                            color: active.color,
                            borderColor: active.color + "44",
                            background: active.color + "12",
                          }}>
                            ● {active.badge}
                          </span>
                        </div>
                        {/* Price */}
                        <div style={{ display: "flex", alignItems: "flex-end", gap: 6, marginBottom: 8 }}>
                          <span style={{ fontSize: 42, fontWeight: 800, color: "#0F172A", letterSpacing: "-0.03em", lineHeight: 1 }}>
                            {active.price}
                          </span>
                          <span style={{ fontSize: 14, color: "#64748B", fontWeight: 500, marginBottom: 6 }}>
                            {active.period}
                          </span>
                        </div>
                        {/* Desc */}
                        <p style={{ fontSize: 13.5, color: "#64748B", lineHeight: 1.6, marginBottom: 20, maxWidth: 320 }}>
                          {active.desc}
                        </p>

                        {/* CTA row */}
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          <button className="cta-btn">
                            Book Space
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                              <path d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                          </button>
                          <button className="secondary-btn">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M15 10l-4 4L6 9" />
                              <rect x="3" y="4" width="18" height="18" rx="2" />
                            </svg>
                            Tour First
                          </button>
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </motion.div>

                {/* ── Stats row ── */}
                <motion.div variants={up} style={{ display: "flex", alignItems: "center", gap: 24 }}>
                  {stats.map((s, i) => (
                    <React.Fragment key={s.label}>
                      {i > 0 && <div className="stat-divider" />}
                      <div>
                        <div style={{ fontSize: 22, fontWeight: 800, color: "#0F172A", letterSpacing: "-0.02em" }}>
                          <Counter target={s.value} />
                        </div>
                        <div style={{ fontSize: 11.5, color: "#64748B", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", marginTop: 2 }}>
                          {s.label}
                        </div>
                      </div>
                    </React.Fragment>
                  ))}
                </motion.div>
              </motion.div>

              {/* ═══════════════════════════════════
                 RIGHT COLUMN — Image + floating UI
              ═══════════════════════════════════ */}
              <motion.div
                initial={{ opacity: 0, x: 50, filter: "blur(12px)" }}
                animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                transition={{ duration: 1.1, delay: 0.35, ease }}
                style={{ position: "relative", display: "flex", justifyContent: "center" }}
              >
                {/* ── Decorative corner lines ── */}
                <svg style={{ position: "absolute", top: -16, right: -16, opacity: 0.25 }} width="60" height="60" viewBox="0 0 60 60" fill="none">
                  <path d="M60 0H30V30" stroke="#4F46E5" strokeWidth="1.5" />
                  <path d="M60 0V30H30" stroke="#4F46E5" strokeWidth="0.7" />
                </svg>
                <svg style={{ position: "absolute", bottom: -16, left: -16, opacity: 0.25 }} width="60" height="60" viewBox="0 0 60 60" fill="none">
                  <path d="M0 60H30V30" stroke="#3B82F6" strokeWidth="1.5" />
                  <path d="M0 60V30H30" stroke="#3B82F6" strokeWidth="0.7" />
                </svg>

                {/* ── Main image ── */}
                <ParallaxDiv speed={0.08} className="image-frame" style={{ width: "100%", maxWidth: 520 }}>
                  <div className="image-frame" style={{ aspectRatio: "4/5", width: "100%", border: "8px solid #fff", boxShadow: "0 28px 72px rgba(15, 23, 42, 0.12), 0 6px 16px rgba(15, 23, 42, 0.06)" }}>
                    <motion.img
                      initial={{ scale: 1.12 }}
                      animate={{ scale: imgLoaded ? 1 : 1.12 }}
                      transition={{ duration: 1.6, ease: "easeOut" }}
                      onLoad={() => setImgLoaded(true)}
                      src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200&auto=format&fit=crop"
                      alt="Premium coworking workspace"
                      style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                    />
                  </div>
                </ParallaxDiv>

                {/* ── Floating: Rating card (bottom-left) ── */}
                <motion.div
                  initial={{ opacity: 0, y: 28, x: 10 }}
                  animate={{ opacity: 1, y: 0, x: 0 }}
                  transition={{ delay: 1.0, duration: 0.6, type: "spring", stiffness: 220, damping: 22 }}
                  className="float-card"
                  style={{
                    position: "absolute", bottom: 32, left: -48,
                    padding: "16px 20px",
                    display: "flex", alignItems: "center", gap: 14,
                    maxWidth: 220,
                  }}
                >
                  <div style={{
                    width: 44, height: 44, borderRadius: "50%",
                    background: "linear-gradient(135deg, #4F46E5, #3B82F6)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0,
                  }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5">
                      <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                      <path d="M22 4L12 14.01l-3-3" />
                    </svg>
                  </div>
                  <div>
                    <div style={{ fontSize: 13.5, fontWeight: 700, color: "#0F172A", lineHeight: 1.2 }}>Top Rated Space</div>
                    <div style={{ fontSize: 12, color: "#64748B", marginTop: 3 }}>
                      4.9 ★ from 2,000+ members
                    </div>
                  </div>
                </motion.div>

                {/* ── Floating: Amenity cycling badge (top-right) ── */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.2, duration: 0.6, type: "spring", stiffness: 200, damping: 22 }}
                  className="float-card"
                  style={{
                    position: "absolute", top: 40, right: -44,
                    padding: "10px 18px",
                    display: "flex", alignItems: "center", gap: 10,
                    minWidth: 160,
                  }}
                >
                  <span style={{ fontSize: 18 }}>⚡</span>
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={amenityIdx}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.3 }}
                      style={{ fontSize: 13.5, fontWeight: 700, color: "#0F172A", whiteSpace: "nowrap" }}
                    >
                      {amenities[amenityIdx]}
                    </motion.span>
                  </AnimatePresence>
                </motion.div>

                {/* ── Floating: Open 24/7 (mid-left edge) ── */}
                <motion.div
                  initial={{ opacity: 0, x: -24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.4, duration: 0.6, type: "spring", stiffness: 200, damping: 22 }}
                  style={{
                    position: "absolute", top: "48%", left: -36,
                    background: "#0F172A", // Dark Slate
                    color: "#fff",
                    borderRadius: 14,
                    padding: "12px 16px",
                    display: "flex", flexDirection: "column", alignItems: "center",
                    boxShadow: "0 8px 24px rgba(15, 23, 42, 0.18)",
                    gap: 2,
                    minWidth: 72,
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#60A5FA" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 6v6l4 2" />
                  </svg>
                  <span style={{ fontSize: 11.5, fontWeight: 700, marginTop: 4, textAlign: "center", letterSpacing: "0.02em" }}>24 / 7</span>
                  <span style={{ fontSize: 9.5, color: "#94A3B8", letterSpacing: "0.08em", textTransform: "uppercase" }}>Access</span>
                </motion.div>

              </motion.div>

            </div>
            {/* ── End grid ── */}
          </div>

        </div>

        {/* ── Responsive style override ── */}
        <style>{`
          @media (max-width: 900px) {
            .hero-grid {
              grid-template-columns: 1fr !important;
              padding-top: 40px !important;
              gap: 40px !important;
            }
          }
        `}</style>
      </section>
    </>
  );
}