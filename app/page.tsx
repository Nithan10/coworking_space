"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Solutions from "./components/Solutions";
import WhyChooseUs from "./components/WhyChooseUs";
import Clients from "./components/Clients"; // Includes the GreatCompany fix!
import Awards from "./components/Awards";
import GlobalImpact from "./components/GlobalImpact";
import FAQ from "./components/FAQ";
import Footer from "./components/Footer";

// --- Custom Easing for Premium Page Transitions ---
const pageTransitionEase = [0.22, 1, 0.36, 1] as const;

export default function Home() {
  // Premium Touch: Smooth Scroll Progress Indicator
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    // Outer wrapper handles the background and min-height
    <div className="relative bg-[#FAFAFA] text-[#111827] selection:bg-indigo-600 selection:text-white min-h-screen">
      
      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-blue-500 origin-left z-[999] pointer-events-none"
        style={{ scaleX }}
      />

      {/* CRITICAL FIX: 
        Navbar is moved outside of <motion.main>. 
        This prevents the Framer Motion blur/transform from breaking 'position: fixed'.
      */}
      <Navbar />
      
      <motion.main 
        initial={{ opacity: 0, filter: "blur(10px)", y: 15 }}
        animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
        exit={{ opacity: 0, filter: "blur(10px)", y: -15 }}
        transition={{ duration: 0.8, ease: pageTransitionEase }}
        // Added flex & gap to ensure consistent spacing between all your sections
        className="w-full overflow-x-hidden flex flex-col gap-20 md:gap-32 pb-0"
      >
        <Hero />
        <Solutions /> 
        <WhyChooseUs /> 
        <Clients />
        <Awards />
        <GlobalImpact />
        <FAQ />  
      </motion.main>

      {/* Moved Footer outside motion.main to anchor it solidly at the bottom during page transitions */}
      <Footer />  

    </div>
  );
}