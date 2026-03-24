"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ─────────────────────────────────────────
   Data (Updated with Modern Light Theme Accents)
───────────────────────────────────────── */
interface FeatureData {
  id: number;
  number: string;
  tag: string;
  title: string;
  desc: string;
  stat: string;
  statLabel: string;
  accent: string;
  accentLight: string;
  accentMid: string;
  image: string;
  iconPath: string;
}

const features: FeatureData[] = [
  {
    id: 1,
    number: "01",
    tag: "Discovery",
    title: "Wide Selection of Workspaces",
    desc: "SpaceHub aggregates every available option in the market. Based on your exact requirements — size, location, budget — it surfaces the best fit so you never have to search manually again.",
    stat: "5,000+",
    statLabel: "Spaces Listed",
    accent: "#3B82F6", // Blue
    accentLight: "#DBEAFE",
    accentMid: "#93C5FD",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop",
    iconPath: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
  },
  {
    id: 2,
    number: "02",
    tag: "Tailored",
    title: "Customized Solutions",
    desc: "One size never fits all. Whether you're a solo founder or a 200-person team, SpaceHub tailors workspace recommendations to your exact workflow, culture, and growth plans.",
    stat: "98%",
    statLabel: "Match Rate",
    accent: "#4F46E5", // Indigo
    accentLight: "#E0E7FF",
    accentMid: "#A5B4FC",
    image: "https://images.unsplash.com/photo-1604328698692-f76ea9498e76?q=80&w=2070&auto=format&fit=crop",
    iconPath: "M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z",
  },
  {
    id: 3,
    number: "03",
    tag: "Value",
    title: "Best Rates & Deal Terms",
    desc: "SpaceHub negotiates on your behalf, securing below-market rates and favorable lease terms. From startups to enterprises, we ensure you always get maximum value.",
    stat: "30%",
    statLabel: "Avg. Savings",
    accent: "#10B981", // Emerald
    accentLight: "#D1FAE5",
    accentMid: "#6EE7B7",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200&auto=format&fit=crop",
    iconPath: "M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z",
  },
  {
    id: 4,
    number: "04",
    tag: "Free",
    title: "Zero Brokerage, Always",
    desc: "The best part about SpaceHub — it costs you nothing. Our services are completely free for every workspace seeker, because we believe finding the right space shouldn't come with a fee.",
    stat: "₹0",
    statLabel: "Brokerage Fee",
    accent: "#8B5CF6", // Violet
    accentLight: "#EDE9FE",
    accentMid: "#C4B5FD",
    image: "https://images.unsplash.com/photo-1556761175-4b46a572b786?q=80&w=1974&auto=format&fit=crop",
    iconPath: "M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7",
  },
];

/* ─────────────────────────────────────────
   Animated Progress Ring
───────────────────────────────────────── */
interface ProgressRingProps {
  progress: number;
  color: string;
  size?: number;
  stroke?: number;
}

function ProgressRing({ progress, color, size = 48, stroke = 3 }: ProgressRingProps) {
  const r = (size - stroke * 2) / 2;
  const circ = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#F1F5F9" strokeWidth={stroke} />
      <motion.circle
        cx={size / 2} cy={size / 2} r={r}
        fill="none" stroke={color} strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={circ}
        animate={{ strokeDashoffset: circ * (1 - progress) }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      />
    </svg>
  );
}

/* ─────────────────────────────────────────
   Main Component
───────────────────────────────────────── */
export default function WhyChooseUs() {
  const [active, setActive] = useState(0);
  const [imgReady, setImgReady] = useState(false);
  const [autoPlay, setAutoPlay] = useState(true);
  const sectionRef = useRef<HTMLElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-advance
  useEffect(() => {
    if (!autoPlay) return;
    timerRef.current = setInterval(() => {
      setActive(i => (i + 1) % features.length);
    }, 4000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [autoPlay, active]);

  const handleSelect = (i: number) => {
    setActive(i);
    setAutoPlay(false);
    if (timerRef.current) clearInterval(timerRef.current);
    setTimeout(() => setAutoPlay(true), 8000);
  };

  const feat = features[active];
  const ease = [0.25, 0.46, 0.45, 0.94] as const; // <-- Added "as const" here

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=DM+Sans:wght@400;500;600;700&display=swap');

        *, *::before, *::after { box-sizing: border-box; }

        .wcu-root {
          font-family: 'DM Sans', sans-serif;
          background: #F8FAFC; /* Slate 50 */
        }
        .wcu-heading { font-family: 'Outfit', sans-serif; }

        /* Noise texture overlay */
        .wcu-noise::after {
          content: '';
          position: absolute; inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
          pointer-events: none; z-index: 3; border-radius: inherit;
        }

        /* Shimmer on stat number */
        @keyframes stat-pop {
          0%   { transform: scale(0.85) translateY(6px); opacity: 0; }
          100% { transform: scale(1) translateY(0px); opacity: 1; }
        }
        .stat-pop { animation: stat-pop 0.45s cubic-bezier(0.34,1.56,0.64,1) forwards; }

        /* Pill tag bounce-in */
        @keyframes pill-in {
          0%   { transform: scale(0.7) translateX(-12px); opacity: 0; }
          100% { transform: scale(1) translateX(0); opacity: 1; }
        }
        .pill-in { animation: pill-in 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards; }

        /* Timeline dot pulse */
        @keyframes dot-pulse {
          0%, 100% { box-shadow: 0 0 0 0px currentColor; }
          50%      { box-shadow: 0 0 0 6px transparent; }
        }
        .dot-active { animation: dot-pulse 2s ease-in-out infinite; }

        /* Horizontal progress bar */
        @keyframes bar-fill {
          from { width: 0%; }
          to   { width: 100%; }
        }
        .bar-auto { animation: bar-fill 4s linear forwards; }

        .feat-btn {
          width: 100%; background: transparent; border: none; cursor: pointer;
          text-align: left; padding: 0; font-family: 'DM Sans', sans-serif;
          transition: opacity 0.2s;
        }
        .feat-btn:focus-visible { outline: 2px solid #4F46E5; outline-offset: 4px; border-radius: 12px; }

        .img-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(160deg, rgba(0,0,0,0) 40%, rgba(15,23,42,0.6) 100%); /* Slate 900 tint */
          z-index: 2;
        }

        /* Hover card lift */
        .feat-row { transition: transform 0.2s ease; }
        .feat-row:hover { transform: translateX(4px); }
        .feat-row.feat-active { transform: translateX(0); }

        @media (max-width: 900px) {
          .wcu-grid { flex-direction: column !important; }
          .wcu-left { width: 100% !important; height: 300px !important; }
          .wcu-right { width: 100% !important; }
        }
      `}</style>

      <section ref={sectionRef} className="wcu-root" style={{ padding: "88px 0 96px", position: "relative", overflow: "hidden" }}>

        {/* Background blobs */}
        <div aria-hidden style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
          <motion.div
            animate={{ backgroundColor: feat.accentLight }}
            transition={{ duration: 0.7 }}
            style={{
              position: "absolute", top: -200, right: -200,
              width: 600, height: 600, borderRadius: "50%",
              filter: "blur(120px)", opacity: 0.6,
            }}
          />
          <div style={{
            position: "absolute", bottom: -150, left: -100,
            width: 500, height: 500, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(79,70,229,0.06) 0%, transparent 70%)",
          }} />
        </div>

        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 36px", position: "relative", zIndex: 1 }}>

          {/* ── Section header ── */}
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 52, flexWrap: "wrap", gap: 20 }}>
            <div>
              <motion.div
                initial={{ opacity: 0, y: -12 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.5 }}
                style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}
              >
                <div style={{ width: 28, height: 2, background: "#4F46E5", borderRadius: 2 }} />
                <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.22em", color: "#4F46E5", textTransform: "uppercase" }}>
                  Why SpaceHub
                </span>
              </motion.div>

              <motion.h2
                className="wcu-heading"
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.1 }}
                style={{ fontSize: "clamp(38px, 4.5vw, 62px)", fontWeight: 800, color: "#0F172A", lineHeight: 1.08, letterSpacing: "-0.02em", margin: 0 }}
              >
                Everything you need,<br />
                <span style={{ fontStyle: "italic", fontWeight: 500, color: "#334155" }}>nothing you don't.</span>
              </motion.h2>
            </div>

            {/* Trust chips */}
            <motion.div
              initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }}
              style={{ display: "flex", gap: 12, flexWrap: "wrap" }}
            >
              {[{ val: "10K+", lbl: "Members" }, { val: "50+", lbl: "Cities" }, { val: "4.9★", lbl: "Rating" }].map(c => (
                <div key={c.lbl} style={{
                  padding: "10px 18px", borderRadius: 12,
                  background: "#fff", border: "1.5px solid #E2E8F0",
                  boxShadow: "0 2px 8px rgba(15,23,42,0.03)",
                  textAlign: "center",
                }}>
                  <div style={{ fontSize: 18, fontWeight: 800, color: "#0F172A", letterSpacing: "-0.02em", fontFamily: "'Outfit', sans-serif" }}>{c.val}</div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.1em" }}>{c.lbl}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* ── Main interactive panel ── */}
          <motion.div
            initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.2 }}
            className="wcu-grid"
            style={{
              display: "flex", gap: 0,
              background: "#fff",
              borderRadius: 28,
              overflow: "hidden",
              border: "1.5px solid #E2E8F0",
              boxShadow: "0 20px 64px rgba(15,23,42,0.08), 0 4px 16px rgba(15,23,42,0.04)",
              minHeight: 600,
            }}
          >

            {/* ════════════════════════════
                LEFT: IMAGE PANEL
            ════════════════════════════ */}
            <div className="wcu-left wcu-noise" style={{ position: "relative", width: "52%", flexShrink: 0, overflow: "hidden" }}>

              {/* Image transition */}
              <AnimatePresence mode="wait">
                <motion.img
                  key={active}
                  src={feat.image}
                  alt={feat.title}
                  onLoad={() => setImgReady(true)}
                  initial={{ opacity: 0, scale: 1.08 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.7, ease }}
                  style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
                />
              </AnimatePresence>

              {/* Gradient overlay */}
              <div className="img-overlay" />

              {/* Animated accent color wash */}
              <motion.div
                animate={{ backgroundColor: feat.accent + "22" }}
                transition={{ duration: 0.8 }}
                style={{ position: "absolute", inset: 0, zIndex: 1, mixBlendMode: "multiply", pointerEvents: "none" }}
              />

              {/* Feature number watermark */}
              <div style={{
                position: "absolute", top: 28, left: 32, zIndex: 4,
                fontSize: 11, fontWeight: 800, letterSpacing: "0.2em",
                color: "rgba(255,255,255,0.7)", textTransform: "uppercase",
              }}>
                SpaceHub
              </div>

              {/* Big feature number */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={`num-${active}`}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 0.15, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="wcu-heading"
                  style={{
                    position: "absolute", right: -20, bottom: -20, zIndex: 4,
                    fontSize: 180, fontWeight: 800, color: "#fff",
                    lineHeight: 1, userSelect: "none", pointerEvents: "none",
                  }}
                >
                  {feat.number}
                </motion.div>
              </AnimatePresence>

              {/* Bottom info card */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={`card-${active}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.45, delay: 0.15 }}
                  style={{
                    position: "absolute", bottom: 28, left: 28, right: 28, zIndex: 5,
                    background: "rgba(15,23,42,0.6)", backdropFilter: "blur(20px)",
                    border: "1px solid rgba(255,255,255,0.15)", borderRadius: 18,
                    padding: "16px 20px",
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    gap: 16,
                  }}
                >
                  {/* Stat */}
                  <div>
                    <div
                      key={`stat-${active}`}
                      className="wcu-heading stat-pop"
                      style={{ fontSize: 32, fontWeight: 800, color: "#fff", letterSpacing: "-0.03em", lineHeight: 1 }}
                    >
                      {feat.stat}
                    </div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: "#CBD5E1", marginTop: 3, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                      {feat.statLabel}
                    </div>
                  </div>

                  {/* Divider */}
                  <div style={{ width: 1, height: 36, background: "rgba(255,255,255,0.2)" }} />

                  {/* Icon */}
                  <motion.div
                    animate={{ backgroundColor: feat.accent }}
                    transition={{ duration: 0.5 }}
                    style={{ width: 44, height: 44, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d={feat.iconPath} />
                    </svg>
                  </motion.div>

                  {/* Tag + title */}
                  <div style={{ flex: 1 }}>
                    <div
                      key={`tag-${active}`}
                      className="pill-in"
                      style={{
                        display: "inline-block", fontSize: 10, fontWeight: 800,
                        letterSpacing: "0.14em", textTransform: "uppercase",
                        color: feat.accent, background: "#fff",
                        padding: "3px 9px", borderRadius: 999, marginBottom: 5,
                      }}
                    >
                      {feat.tag}
                    </div>
                    <div style={{ fontSize: 13.5, fontWeight: 600, color: "#fff", lineHeight: 1.35 }}>{feat.title}</div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Step dots (bottom center) */}
              <div style={{ position: "absolute", top: 28, right: 28, zIndex: 5, display: "flex", gap: 7 }}>
                {features.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => handleSelect(i)}
                    style={{
                      width: i === active ? 22 : 7,
                      height: 7, borderRadius: 4,
                      background: i === active ? "#fff" : "rgba(255,255,255,0.35)",
                      border: "none", cursor: "pointer", padding: 0,
                      transition: "all 0.35s cubic-bezier(0.34,1.56,0.64,1)",
                    }}
                  />
                ))}
              </div>

              {/* Auto-play progress bar */}
              {autoPlay && (
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 3, zIndex: 6, background: "rgba(255,255,255,0.15)" }}>
                  <motion.div
                    key={`bar-${active}`}
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 4, ease: "linear" }}
                    style={{ height: "100%", background: feat.accent, borderRadius: 2 }}
                  />
                </div>
              )}
            </div>

            {/* ════════════════════════════
                RIGHT: FEATURE LIST
            ════════════════════════════ */}
            <div style={{ flex: 1, padding: "40px 40px 40px 44px", display: "flex", flexDirection: "column", justifyContent: "center", gap: 6, background: "#FFFFFF" }}>

              {/* Section label */}
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", color: "#64748B", textTransform: "uppercase", marginBottom: 10 }}>
                What sets us apart
              </div>

              {/* Feature rows */}
              {features.map((f, i) => {
                const isActive = i === active;
                return (
                  <button
                    key={f.id}
                    className={`feat-btn feat-row ${isActive ? "feat-active" : ""}`}
                    onClick={() => handleSelect(i)}
                    aria-pressed={isActive}
                  >
                    <motion.div
                      animate={{
                        background: isActive ? "#FFFFFF" : "transparent",
                        boxShadow: isActive ? "0 4px 24px rgba(15,23,42,0.06), 0 1px 4px rgba(15,23,42,0.02)" : "none",
                        borderColor: isActive ? "#E2E8F0" : "transparent",
                      }}
                      transition={{ duration: 0.35 }}
                      style={{
                        borderRadius: 18, border: "1.5px solid transparent",
                        padding: isActive ? "20px 22px" : "14px 22px",
                        display: "flex", gap: 18, alignItems: "flex-start",
                        transition: "padding 0.3s ease",
                      }}
                    >
                      {/* Left: number + progress ring */}
                      <div style={{ position: "relative", flexShrink: 0, width: 48, height: 48, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <ProgressRing
                          progress={isActive ? 1 : i < active ? 1 : 0}
                          color={f.accent}
                          size={48}
                          stroke={2.5}
                        />
                        <motion.span
                          animate={{ color: isActive ? f.accent : "#94A3B8" }}
                          transition={{ duration: 0.3 }}
                          style={{
                            position: "absolute", fontSize: 11, fontWeight: 800,
                            letterSpacing: "0.04em", fontFamily: "'DM Sans', sans-serif",
                          }}
                        >
                          {f.number}
                        </motion.span>
                      </div>

                      {/* Right: text */}
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: isActive ? 8 : 0 }}>
                          <motion.span
                            animate={{ color: isActive ? "#0F172A" : "#64748B" }}
                            transition={{ duration: 0.3 }}
                            className="wcu-heading"
                            style={{ fontSize: isActive ? 19 : 17, fontWeight: isActive ? 700 : 500, lineHeight: 1.2, transition: "font-size 0.3s ease" }}
                          >
                            {f.title}
                          </motion.span>

                          {/* Active accent dot */}
                          {isActive && (
                            <motion.div
                              initial={{ scale: 0 }} animate={{ scale: 1 }}
                              style={{ width: 7, height: 7, borderRadius: "50%", background: f.accent, flexShrink: 0 }}
                            />
                          )}
                        </div>

                        {/* Desc — only visible when active */}
                        <AnimatePresence>
                          {isActive && (
                            <motion.p
                              initial={{ opacity: 0, height: 0, marginTop: 0 }}
                              animate={{ opacity: 1, height: "auto", marginTop: 0 }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.38, ease }}
                              style={{ fontSize: 14, color: "#475569", lineHeight: 1.72, overflow: "hidden", margin: 0 }}
                            >
                              {f.desc}
                            </motion.p>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Chevron */}
                      <motion.div
                        animate={{ opacity: isActive ? 1 : 0, x: isActive ? 0 : -6 }}
                        transition={{ duration: 0.25 }}
                        style={{ flexShrink: 0, marginTop: 2 }}
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={f.accent} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M9 18l6-6-6-6" />
                        </svg>
                      </motion.div>

                    </motion.div>
                  </button>
                );
              })}

              {/* Bottom CTA */}
              <motion.div
                initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.4 }}
                style={{ marginTop: 20, paddingTop: 22, borderTop: "1.5px solid #F1F5F9", display: "flex", alignItems: "center", justifyContent: "space-between" }}
              >
                <div>
                  <div style={{ fontSize: 13.5, fontWeight: 700, color: "#0F172A" }}>Ready to find your space?</div>
                  <div style={{ fontSize: 12, color: "#64748B", marginTop: 2 }}>Free consultation, no commitment.</div>
                </div>
                <button style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  padding: "11px 22px", borderRadius: 12,
                  background: "#0F172A", color: "#fff",
                  fontFamily: "'DM Sans', sans-serif", fontSize: 13.5, fontWeight: 700,
                  border: "none", cursor: "pointer",
                  transition: "background 0.2s, transform 0.15s",
                  boxShadow: "0 4px 14px rgba(15,23,42,0.15)",
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = feat.accent; e.currentTarget.style.transform = "translateY(-2px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "#0F172A"; e.currentTarget.style.transform = "translateY(0)"; }}
                >
                  Get Started Free
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </button>
              </motion.div>

            </div>
          </motion.div>

        </div>
      </section>
    </>
  );
}