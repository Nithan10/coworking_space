"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, useInView, Variants } from "framer-motion";
import Link from "next/link";
import Navbar from "../components/Navbar"; // Adjust path if needed
import Footer from "../components/Footer"; // Adjust path if needed

// --- Content Data based on your screenshots ---
const features = [
  {
    id: "01",
    title: "Adaptability",
    desc: "SpaceHub embodies adaptability, crafting workspaces that seamlessly evolve with business needs. Our flexible environments empower clients to scale effortlessly, ensuring they always have the right space. From modular furniture to customisable layouts, we foster innovation and collaboration. Our approach ensures businesses can adapt to market demands without disruption.",
    footerText: "Modular Furniture • Custom Layouts • Scalable Environments • Seamless Evolution",
    gradient: "from-orange-50/80 to-rose-50/80",
    img: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: "02",
    title: "Sustainability at the Core",
    desc: "SpaceHub is committed to sustainability, integrating eco-friendly practices into every aspect of our workspaces. Recognized with the IGBC Green Champion award, we push towards a net-zero impact. From solar panels to water treatment facilities, our spaces reduce our carbon footprint, championing a greener future.",
    footerText: "85% Less Water Usage • 30% Reduction in Power Consumption • ISO 14001 Certified",
    gradient: "from-blue-50/80 to-indigo-50/80",
    img: "https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: "03",
    title: "Technology & Innovation",
    desc: "Technology drives SpaceHub's workspace management. Our in-house tech stack, MiQube™, streamlines operations, offering a seamless smart building experience. Businesses focus on core activities while we manage workspaces. Advanced tools ensure easy facility booking, resource management, and support access.",
    footerText: "Meeting Room Scheduler • Space Management • Hot Desking • Paperless Rostering",
    gradient: "from-purple-50/80 to-pink-50/80",
    img: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1000&auto=format&fit=crop"
  }
];

const values = [
  { title: "Innovation", desc: "We embrace change and continuously seek new ways to improve our services and workspaces.", icon: "💡" },
  { title: "Sustainability", desc: "Our commitment to the environment drives everything we do.", icon: "🌱" },
  { title: "Community", desc: "We believe in creating a vibrant ecosystem where businesses can collaborate and grow.", icon: "🤝" },
  { title: "Customer-Centricity", desc: "Our focus is on providing exceptional service and support to our clients.", icon: "🎯" }
];

// --- Advanced Text Animation Variants (FIXED WITH TYPING) ---
const textContainer: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.2 }
  }
};

const textItem: Variants = {
  hidden: { opacity: 0, y: 40, rotateX: 20 },
  show: { opacity: 1, y: 0, rotateX: 0, transition: { type: "spring", damping: 12, stiffness: 100 } }
};

export default function WhyUsPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Hero Parallax
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);

  // Split text helper for the hero title
  const titleLine1 = "Workspaces Built".split(" ");
  const titleLine2 = "For A New Era.".split(" ");

  return (
    <>
      <Navbar />

      <main ref={containerRef} className="bg-[#050505] selection:bg-indigo-500 selection:text-white relative">
        
        {/* ================= 1. HERO SECTION ================= */}
        <section className="relative min-h-screen flex flex-col items-center justify-center pt-20 overflow-hidden perspective-[1000px]">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] h-[50vh] bg-indigo-600/20 blur-[120px] rounded-full pointer-events-none" />
          
          <div className="relative z-20 max-w-5xl mx-auto px-6 text-center">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: "easeOut" }} className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-8">
              <span className="relative flex h-2.5 w-2.5"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-indigo-500"></span></span>
              <span className="text-xs font-bold text-gray-300 uppercase tracking-[0.2em]">Why Choose Us</span>
            </motion.div>
            
            {/* Advanced Text Reveal Animation */}
            <motion.h1 variants={textContainer} initial="hidden" animate="show" className="text-6xl md:text-8xl font-black text-white tracking-tighter mb-8 leading-[1.05] flex flex-col items-center">
              <div className="overflow-hidden flex gap-3 md:gap-4 flex-wrap justify-center">
                {titleLine1.map((word, i) => (
                  <motion.span key={`l1-${i}`} variants={textItem} className="inline-block">{word}</motion.span>
                ))}
              </div>
              <div className="overflow-hidden flex gap-3 md:gap-4 flex-wrap justify-center mt-2">
                {titleLine2.map((word, i) => (
                  <motion.span key={`l2-${i}`} variants={textItem} className="inline-block text-transparent bg-clip-text bg-gradient-to-br from-white via-indigo-200 to-indigo-600 pb-2">{word}</motion.span>
                ))}
              </div>
            </motion.h1>
          </div>

          <motion.div style={{ y: heroY, opacity: heroOpacity }} className="absolute inset-0 z-0 pointer-events-none">
            <div className="absolute inset-0 bg-gray-950/60 z-10 mix-blend-overlay" />
            <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop" alt="Workspace" className="w-full h-full object-cover opacity-50" />
          </motion.div>
        </section>

        {/* ================= LIGHT CONTENT AREA ================= */}
        <div className="relative bg-[#FAFAFA] rounded-t-[3rem] md:rounded-t-[5rem] overflow-hidden z-30 pt-24">
          
          {/* ================= 2. MISSION & VISION ================= */}
          <section className="max-w-5xl mx-auto px-6 mb-32">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8 }}>
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-8">Our Mission & Vision</h2>
              <p className="text-xl md:text-3xl text-gray-500 font-medium leading-relaxed md:leading-snug tracking-tight">
                At SpaceHub's core lies a mission to redefine traditional workplaces, anchored in <span className="text-indigo-600">adaptability, sustainability, and technology</span>. We envision a community where businesses thrive and individuals flourish, united by a sense of belonging and shared purpose. We provide scalable solutions that evolve with businesses.
              </p>
            </motion.div>
          </section>

          {/* ================= 3. THE 3 PILLARS (STICKY STACKING CARDS) ================= */}
          <section className="max-w-7xl mx-auto px-6 mb-32 relative">
            <div className="flex flex-col gap-6">
              {features.map((feature, index) => (
                <div 
                  key={feature.id} 
                  className="sticky top-32 pt-6" 
                  style={{ zIndex: index + 1 }}
                >
                  <motion.div 
                    initial={{ opacity: 0, y: 50, scale: 0.95 }} 
                    whileInView={{ opacity: 1, y: 0, scale: 1 }} 
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6, type: "spring", bounce: 0.3 }}
                    className={`w-full bg-gradient-to-br ${feature.gradient} rounded-[3rem] p-8 md:p-16 border border-white shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] backdrop-blur-xl flex flex-col min-h-[500px] justify-between overflow-hidden relative`}
                  >
                    {/* Abstract Background Elements */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-white/40 blur-3xl rounded-full pointer-events-none transform translate-x-1/2 -translate-y-1/2" />
                    
                    <div className="relative z-10 flex flex-col md:flex-row gap-12 md:gap-20">
                      <div className="md:w-1/3">
                        <span className="text-7xl md:text-8xl font-black text-gray-900/10 tracking-tighter block mb-6">{feature.id}</span>
                        <div className="w-full h-64 rounded-3xl overflow-hidden shadow-xl">
                           <img src={feature.img} alt={feature.title} className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700" />
                        </div>
                      </div>
                      <div className="md:w-2/3 flex flex-col justify-center">
                        <h3 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight mb-6">{feature.title}</h3>
                        <p className="text-lg md:text-xl text-gray-600 font-medium leading-relaxed">{feature.desc}</p>
                      </div>
                    </div>

                    <div className="relative z-10 mt-12 pt-8 border-t border-gray-900/10">
                      <p className="text-sm md:text-base font-bold text-gray-800 tracking-wide uppercase">{feature.footerText}</p>
                    </div>
                  </motion.div>
                </div>
              ))}
            </div>
          </section>

          {/* ================= 4. OUR VALUES ================= */}
          <section className="max-w-7xl mx-auto px-6 mb-32">
            <div className="mb-12">
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-4">Our Values</h2>
              <p className="text-lg text-gray-500 font-medium">SpaceHub operates with a set of core values that guide our actions and decisions:</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((val, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ delay: i * 0.1 }} className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                  <div className="text-4xl mb-6 bg-indigo-50 w-16 h-16 rounded-full flex items-center justify-center">{val.icon}</div>
                  <h4 className="text-xl font-bold text-gray-900 mb-3">{val.title}</h4>
                  <p className="text-gray-500 font-medium text-sm leading-relaxed">{val.desc}</p>
                </motion.div>
              ))}
            </div>
          </section>

          {/* ================= 5. UNLEASHING POTENTIAL / TEAM GRID ================= */}
          <section className="max-w-7xl mx-auto px-6 mb-32">
            <div className="flex flex-col lg:flex-row gap-16 items-center">
              <div className="lg:w-1/2">
                <motion.h2 initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-8 leading-[1.1]">
                  Unleashing Potential <br /> <span className="text-indigo-600">Through Innovation</span>
                </motion.h2>
                <motion.p initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="text-lg text-gray-500 font-medium leading-relaxed">
                  SpaceHub believes in harnessing the power of people, process, and technology to create workspaces that drive success. We bring together the best minds in the game, implementing adaptable processes that prioritize sustainability, and leveraging MiQube™—our tech stack—to deliver value to our customers.
                </motion.p>
              </div>
              <div className="lg:w-1/2 grid grid-cols-2 gap-4">
                <motion.img initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ type: "spring" }} src="https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=800&auto=format&fit=crop" alt="Leader" className="rounded-3xl object-cover h-64 w-full shadow-lg" />
                <motion.img initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ type: "spring", delay: 0.2 }} src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop" alt="Leader" className="rounded-3xl object-cover h-64 w-full shadow-lg mt-8" />
              </div>
            </div>
          </section>

          {/* ================= 6. OUR PEOPLE / JOIN TEAM ================= */}
          <section className="max-w-7xl mx-auto px-6 mb-32">
            <div className="mb-12">
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-4">Our People</h2>
              <p className="text-lg text-gray-500 font-medium max-w-4xl">Our team comprises of 730+ experienced professionals dedicated to creating exceptional workplace experiences. Each member contributes to our culture of innovation, collaboration, and sustainability. Come, Join us and reimagine workspaces.</p>
            </div>
            
            {/* Dark Join Team Card */}
            <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, margin: "-100px" }} className="bg-[#0A0F1C] rounded-[3rem] overflow-hidden flex flex-col md:flex-row items-center p-8 md:p-16 relative shadow-2xl">
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />
              
              <div className="md:w-1/2 relative z-10 mb-10 md:mb-0">
                <h3 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-6">Join our Team</h3>
                <p className="text-gray-300 font-medium text-lg mb-8 max-w-md">We are looking for talented and motivated minds to help us build the future of workplaces. Look at our open positions below.</p>
                <Link href="/careers" className="inline-flex items-center justify-center bg-emerald-500 hover:bg-emerald-400 text-white px-8 py-4 rounded-full font-bold transition-all shadow-lg hover:shadow-emerald-500/25 active:scale-95">
                  Open Positions
                </Link>
              </div>
              
              <div className="md:w-1/2 flex justify-end relative z-10">
                <div className="w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-4 border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                  <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800&auto=format&fit=crop" alt="Team collaborating" className="w-full h-full object-cover" />
                </div>
              </div>
            </motion.div>
          </section>

          {/* ================= 7. WHY CHOOSE / TESTIMONIAL ================= */}
          <section className="max-w-7xl mx-auto px-6 mb-32 text-center">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-6">Why choose SpaceHub?</h2>
            <p className="text-lg text-gray-500 font-medium max-w-3xl mx-auto mb-20">Choosing SpaceHub means partnering with a company that understands your business needs and future-proofing your workplace. From a single desk to a large campus, SpaceHub has the expertise to elevate your workplace experience.</p>
            
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} className="max-w-4xl mx-auto relative">
              <span className="absolute -top-16 -left-8 text-9xl text-gray-200/50 font-serif leading-none select-none">"</span>
              <h4 className="text-2xl md:text-4xl text-gray-800 font-semibold leading-relaxed tracking-tight mb-8 relative z-10">
                Workspaces are all about ergonomics, creativity, flexibility, innovation & having a lot of fun. I think our partner SpaceHub has helped us in our journey to build a great work environment, which enables our employees and in turn makes our customers happy.
              </h4>
              <div className="flex flex-col items-center">
                <p className="text-indigo-600 font-bold tracking-widest uppercase text-sm mb-2">Visionet</p>
                <div className="w-12 h-1 bg-gray-200 rounded-full"></div>
              </div>
            </motion.div>
          </section>

          {/* ================= 8. DUAL FINAL CARDS ================= */}
          <section className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Card 1: Let's Connect */}
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} className="bg-white rounded-[2.5rem] p-10 md:p-14 border border-gray-100 shadow-sm flex flex-col justify-between group overflow-hidden relative min-h-[500px]">
                <div className="relative z-10">
                  <h3 className="text-4xl font-black text-gray-900 tracking-tight mb-4">Let's Connect</h3>
                  <p className="text-gray-500 font-medium mb-8 max-w-md">Whether you're a startup looking to grow, a freelancer seeking flexibility, or a large corporation needing scalable solutions, reach out today.</p>
                  <Link href="/book" className="inline-flex items-center text-sm font-bold text-gray-900 bg-gray-100 hover:bg-indigo-600 hover:text-white px-6 py-3 rounded-full transition-all group-hover:pr-4 shadow-sm">
                    Get your space
                    <svg className="w-4 h-4 ml-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7-7m7-7H3" /></svg>
                  </Link>
                </div>
                <div className="absolute bottom-0 right-0 w-full h-1/2 translate-y-12 group-hover:translate-y-4 transition-transform duration-700 pointer-events-none">
                  <img src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=800&auto=format&fit=crop" className="w-full h-full object-cover rounded-tl-[3rem] opacity-40 grayscale" alt="Office sketch" />
                  <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-transparent" />
                </div>
              </motion.div>

              {/* Card 2: Building the Future */}
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ delay: 0.2 }} className="bg-indigo-50 rounded-[2.5rem] p-10 md:p-14 border border-indigo-100 shadow-sm flex flex-col justify-between group overflow-hidden relative min-h-[500px]">
                <div className="relative z-10">
                  <h3 className="text-4xl font-black text-indigo-950 tracking-tight mb-4">Building the Future</h3>
                  <p className="text-indigo-900/60 font-medium mb-8 max-w-md">SpaceHub is redefining workspaces with innovative design, technology, and a commitment to sustainability. Partner with us to change the future.</p>
                  <Link href="/partner" className="inline-flex items-center text-sm font-bold text-indigo-950 bg-white hover:bg-indigo-600 hover:text-white px-6 py-3 rounded-full transition-all shadow-sm group-hover:pr-4">
                    Become a partner
                    <svg className="w-4 h-4 ml-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7-7m7-7H3" /></svg>
                  </Link>
                </div>
                <div className="absolute bottom-0 right-0 w-[80%] h-[60%] translate-y-8 translate-x-8 group-hover:translate-y-4 group-hover:translate-x-4 transition-transform duration-700 pointer-events-none">
                  <img src="https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=800&auto=format&fit=crop" className="w-full h-full object-cover rounded-[2rem] shadow-2xl" alt="Green interior" />
                </div>
              </motion.div>

            </div>
          </section>
          
          {/* ================= 9. FOOTER ================= */}
          <Footer />

        </div>
      </main>
    </>
  );
}