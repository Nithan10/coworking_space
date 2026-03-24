"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

// --- Animation Variants ---
const containerVariants = {
  hidden: { opacity: 0, y: 50 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1],
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

// --- Mock Data ---
const locations = [
  { name: "Bangalore", path: "/locations/bangalore" },
  { name: "Mumbai", path: "/locations/mumbai" },
  { name: "Hyderabad", path: "/locations/hyderabad" },
  { name: "Chennai", path: "/locations/chennai" },
  { name: "Coimbatore", path: "/locations/coimbatore" },
];

const companyLinks = [
  { name: "Solutions", path: "/solutions" },
  { name: "Why SpaceHub", path: "/about" },
  { name: "Enterprise", path: "/enterprise" },
  { name: "Contact Us", path: "/book" },
  { name: "FAQ", path: "/faq" },
];

export default function Footer() {
  return (
    <footer className="w-full bg-[#FAFAFA] px-4 md:px-8 pb-8 pt-20">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-50px" }}
        className="max-w-[1400px] mx-auto bg-[#0A0A0A] rounded-[2.5rem] p-10 md:p-16 lg:p-20 relative overflow-hidden shadow-2xl border border-gray-800"
      >
        {/* --- Ambient Glowing Background Effects --- */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none translate-y-1/2 -translate-x-1/3" />

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
          
          {/* 1. Brand Section */}
          <motion.div variants={itemVariants} className="lg:col-span-4 flex flex-col items-start">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3 mb-6 group">
              <div className="w-10 h-10 border-2 border-indigo-500 rounded-full flex items-center justify-center bg-indigo-500/10 overflow-hidden relative group-hover:bg-indigo-500/20 transition-colors">
                <div className="absolute w-full h-[2px] bg-white transform rotate-45"></div>
              </div>
              <span className="font-bold text-2xl text-white tracking-tight">SpaceHub</span>
            </Link>
            
            <p className="text-gray-400 text-sm leading-relaxed mb-8 max-w-sm">
              Sleek and contemporary workspaces tailored to enhance productivity, foster collaboration, and scale with your enterprise.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3">
              {[
                { name: "Insta", d: "M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" }, // Simplified paths for illustration
                { name: "Twitter", d: "M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" },
                { name: "LinkedIn", d: "M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" }
              ].map((social, idx) => (
                <a key={idx} href="#" className="w-10 h-10 bg-white/5 hover:bg-indigo-600 rounded-xl flex items-center justify-center text-white transition-all duration-300 hover:scale-110 hover:shadow-[0_0_20px_rgba(79,70,229,0.4)]">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d={social.d} /></svg>
                </a>
              ))}
            </div>
          </motion.div>

          {/* 2. Locations Links */}
          <motion.div variants={itemVariants} className="lg:col-span-2 lg:col-start-6">
            <h4 className="text-white font-bold mb-6">Locations</h4>
            <ul className="space-y-4">
              {locations.map((link) => (
                <li key={link.name}>
                  <Link href={link.path} className="text-sm text-gray-400 hover:text-indigo-400 transition-colors flex items-center group">
                    <span className="w-0 overflow-hidden group-hover:w-3 transition-all duration-300 ease-out inline-block h-[2px] bg-indigo-500 mr-0 group-hover:mr-2 rounded-full"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* 3. Company Links */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <h4 className="text-white font-bold mb-6">Company</h4>
            <ul className="space-y-4">
              {companyLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.path} className="text-sm text-gray-400 hover:text-indigo-400 transition-colors flex items-center group">
                    <span className="w-0 overflow-hidden group-hover:w-3 transition-all duration-300 ease-out inline-block h-[2px] bg-indigo-500 mr-0 group-hover:mr-2 rounded-full"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* 4. Download App Section */}
          <motion.div variants={itemVariants} className="lg:col-span-3">
            <h4 className="text-white font-bold mb-6">Download SpaceHub App</h4>
            <div className="flex flex-col gap-3">
              
              {/* App Store Button */}
              <a href="#" className="flex items-center gap-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all duration-300 rounded-2xl p-3 px-5 group">
                <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M16.365 14.509c-.044-3.151 2.576-4.664 2.695-4.733-1.464-2.14-3.738-2.434-4.542-2.474-1.92-.196-3.748 1.129-4.726 1.129-1.002 0-2.528-1.096-4.14-1.065-2.09.03-4.019 1.215-5.093 3.08-2.181 3.785-.558 9.387 1.56 12.441 1.037 1.492 2.261 3.167 3.863 3.106 1.539-.062 2.128-.996 3.984-.996 1.833 0 2.37.996 3.984.965 1.666-.03 2.709-1.521 3.722-2.983 1.173-1.708 1.655-3.365 1.68-3.454-.035-.015-3.14-1.205-3.187-4.685C16.365 14.54 16.365 14.509 16.365 14.509zM15.013 7.842c.843-1.02 1.41-2.434 1.256-3.842-1.216.05-2.68.814-3.546 1.826-.782.903-1.464 2.333-1.282 3.721 1.365.105 2.73-1.282 3.572-1.705z" />
                </svg>
                <div>
                  <p className="text-[10px] text-gray-400 font-medium">Download on the</p>
                  <p className="text-sm text-white font-bold group-hover:text-indigo-400 transition-colors">App Store</p>
                </div>
              </a>

              {/* Google Play Button */}
              <a href="#" className="flex items-center gap-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all duration-300 rounded-2xl p-3 px-5 group">
                <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3.488 2.05A2.32 2.32 0 0 0 2.4 4.225v15.55a2.32 2.32 0 0 0 1.088 2.175l10.9-10.9zM15.2 12.025l-1.05-1.05L4.437 1.262a2.316 2.316 0 0 1 1.95-.212L16.2 6.512zM15.2 12.025l1.05-1.05 4.075-4.075a2.31 2.31 0 0 1 0 3.25l-4.075-4.075zM15.2 12.025L16.25 13.075 20.325 17.15a2.31 2.31 0 0 1 0 3.25l-4.075-4.075z" />
                </svg>
                <div>
                  <p className="text-[10px] text-gray-400 font-medium">Get it on</p>
                  <p className="text-sm text-white font-bold group-hover:text-indigo-400 transition-colors">Google Play</p>
                </div>
              </a>

            </div>
          </motion.div>

        </div>

        {/* --- Bottom Row: Copyright & Extras --- */}
        <motion.div variants={itemVariants} className="relative z-10 mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500 font-medium">
            © 2024 SpaceHub. All rights reserved.
          </p>
          
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="text-xs text-gray-500 hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="text-xs text-gray-500 hover:text-white transition-colors">Terms of Service</Link>
            <span className="text-gray-700">|</span>
            <p className="text-xs text-gray-500">
              Designed by <span className="text-white font-bold">Workspace Tech</span>
            </p>
          </div>
        </motion.div>

      </motion.div>
    </footer>
  );
}