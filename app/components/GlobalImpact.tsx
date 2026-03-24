"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, useSpring, useInView } from "framer-motion";

// ─── TypeScript Interfaces ───────────────────────────────────────────────────
interface CounterProps {
  target: string | number;
  suffix?: string;
  duration?: number;
}

interface StatCardProps {
  value: string | number;
  suffix?: string;
  label: string;
  numColor: string;
  lineColor: string;
  delay: number;
  index: number;
}

// ─── Animated Counter ────────────────────────────────────────────────────────
function Counter({ target, suffix = "", duration = 2.2 }: CounterProps) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const num = parseFloat(String(target).replace(/[^0-9.]/g, ""));
    const steps = 80;
    const interval = (duration * 1000) / steps;
    const timer = setInterval(() => {
      start += num / steps;
      if (start >= num) { setCount(num); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, interval);
    return () => clearInterval(timer);
  }, [inView, target, duration]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

// ─── Particle Canvas — Clean Cool Motes ──────────────────────────────────────
function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    // FIX: Initialize W and H to satisfy TypeScript's strict checks
    let W: number = 0;
    let H: number = 0;
    const DOTS = 50;
    const particles: any[] = [];

    const resize = () => {
      W = canvas.width = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const COLORS = [[79, 70, 229], [14, 165, 233], [148, 163, 184]];

    for (let i = 0; i < DOTS; i++) {
      const col = COLORS[Math.floor(Math.random() * COLORS.length)];
      particles.push({
        x: Math.random() * (W || 1200),
        y: Math.random() * (H || 800),
        vx: (Math.random() - 0.5) * 0.12,
        vy: (Math.random() - 0.5) * 0.12,
        r: Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.15 + 0.05,
        col,
      });
    }

    function loop() {
      ctx!.clearRect(0, 0, W, H);
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > W || p.y < 0 || p.y > H) {
          p.x = Math.random() * W;
          p.y = Math.random() * H;
        }
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(${p.col[0]},${p.col[1]},${p.col[2]},${p.alpha})`;
        ctx!.fill();
      });
      animId = requestAnimationFrame(loop);
    }
    loop();
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize); };
  }, []);

  return <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.5, pointerEvents: "none", zIndex: 1 }} />;
}

// ─── Stat Card ───────────────────────────────────────────────────────────────
function StatCard({ value, suffix, label, numColor, lineColor, delay, index }: StatCardProps) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 30 },
        show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 160, damping: 22, delay } },
      }}
      className="flex flex-col items-center py-4 md:py-0"
    >
      <span style={{ fontSize: 10, color: "#94a3b8", letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: 8 }}>0{index + 1}</span>
      <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "clamp(42px, 6vw, 64px)", fontWeight: 900, lineHeight: 1, background: numColor, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
        <Counter target={value} suffix={suffix} />
      </div>
      <motion.div initial={{ width: 0 }} whileInView={{ width: 30 }} viewport={{ once: true }} transition={{ delay: delay + 0.4, duration: 0.6 }} style={{ height: 2, background: lineColor, margin: "12px 0" }} />
      <p style={{ fontSize: 10, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.15em", textAlign: "center", maxWidth: 120 }}>{label}</p>
    </motion.div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function GlobalImpact() {
  const containerRef = useRef<HTMLElement>(null);
  const videoRef     = useRef<HTMLVideoElement>(null);

  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start end", "end start"] });
  const smooth = useSpring(scrollYProgress, { stiffness: 60, damping: 15 });

  const heroTextY    = useTransform(smooth, [0, 1], ["0%", "40%"]);
  const globeY       = useTransform(smooth, [0, 1], ["0%", "8%"]); 
  const cloudY       = useTransform(smooth, [0, 1], ["10%", "-5%"]);

  useEffect(() => { videoRef.current?.play().catch(() => {}); }, []);

  const cloudImageUrl = "https://framerusercontent.com/images/vK1naOOAfBeOfzjSqlloxH7w.png";

  const stats = [
    { value: "62000", suffix: "+", label: "Active Members",   numColor: "linear-gradient(135deg,#4F46E5,#818CF8)", lineColor: "#818CF8", delay: 0 },
    { value: "87",    suffix: "%", label: "Faster Booking",   numColor: "linear-gradient(135deg,#0284C7,#38BDF8)", lineColor: "#38BDF8", delay: 0.1 },
    { value: "32",    suffix: "+", label: "Countries Active", numColor: "linear-gradient(135deg,#0D9488,#2DD4BF)", lineColor: "#2DD4BF", delay: 0.2 },
  ];

  // Compact Sizing
  const globeSize = "clamp(300px, 55vw, 750px)";
  const halfGlobeSize = "clamp(150px, 27.5vw, 375px)";

  return (
    <section ref={containerRef} className="relative w-full bg-white pt-16 md:pt-20 overflow-hidden font-sans flex flex-col items-center">
      
      {/* Background Layer */}
      <div style={{ position: "absolute", inset: 0, zIndex: 0, background: "radial-gradient(circle at 50% 0%, #F8FAFC 0%, #FFFFFF 100%)" }} />
      <ParticleCanvas />

      {/* ── Layer 1: Text (Back) ────────────────────────────── */}
      <motion.div style={{ y: heroTextY, position: "relative", zIndex: 10, textAlign: "center", marginTop: "5vh" }}>
        <div className="flex items-center justify-center gap-2 mb-4 bg-gray-50 border border-gray-100 rounded-full px-4 py-1">
          <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Live Presence</span>
        </div>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ fontFamily: "'Inter', sans-serif", fontSize: "clamp(70px, 15vw, 220px)", fontWeight: 900, lineHeight: 0.9, letterSpacing: "-0.05em", color: "#0F172A", margin: 0 }}
        >
          62,000+
        </motion.h2>
      </motion.div>

      {/* ── Layer 2: The Globe (Middle) ────────────────────────────────────── */}
      <motion.div style={{ y: globeY }} className="relative z-20 flex justify-center w-full pointer-events-none -mt-10 md:-mt-20">
        <div style={{ position: "relative", width: globeSize, height: globeSize }}>
          <div style={{ position: "absolute", inset: 0, borderRadius: "50%", overflow: "hidden", boxShadow: "0 20px 50px rgba(0,0,0,0.1)" }}>
            <div style={{ position: "absolute", inset: 0, zIndex: 10, background: "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.4) 0%, transparent 70%)" }} />
            <video ref={videoRef} src="https://framerusercontent.com/assets/yjuD7GFXupvQlqYR8xjXBuh5oc.mp4" autoPlay loop muted playsInline style={{ width: "100%", height: "100%", objectFit: "cover", transform: "scale(1.05)" }} />
          </div>
        </div>
      </motion.div>

      {/* ── Layer 3: Horizon & Stats (Front) ────────────────────── */}
      <div
        style={{
          position: "relative",
          zIndex: 30,
          width: "100%",
          marginTop: `calc(-1 * ${halfGlobeSize})`, // Perfect equator cut
          background: "#FFFFFF",
          paddingBottom: 60,
        }}
      >
        {/* Clouds - Clipped to prevent hiding content below horizon */}
        <div style={{ position: "absolute", bottom: "99%", left: "0", width: "100%", height: "200px", pointerEvents: "none", overflow: "hidden", zIndex: -1 }}>
          <motion.img
            src={cloudImageUrl}
            alt="Horizon Clouds"
            style={{ y: cloudY, width: "120%", marginLeft: "-10%", objectFit: "cover", opacity: 0.8, transform: "translateY(15%)" }}
          />
        </div>

        {/* Stats Grid - Compact and Clear */}
        <motion.div
          variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } }}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          style={{ maxWidth: 1000, margin: "0 auto", padding: "60px 32px 0", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px" }}
        >
          {stats.map((s, i) => (
            <StatCard key={i} index={i} {...s} />
          ))}
        </motion.div>

        <p style={{ textAlign: "center", marginTop: 40, fontSize: 10, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.2em", fontWeight: 600 }}>
          Established worldwide network · 2026
        </p>
      </div>

    </section>
  );
}