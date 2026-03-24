"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Enhanced FAQ data with categories
const faqData = [
  {
    id: 1,
    category: "General",
    question: "What is Aztech?",
    answer: "Aztech is a premium coworking ecosystem designed for modern professionals, offering flexible workspaces, state-of-the-art amenities, and a vibrant community.",
  },
  {
    id: 2,
    category: "Booking",
    question: "How does booking work in Aztech?",
    answer: "You can book hot desks, dedicated desks, or meeting rooms instantly through our web or mobile app. Simply choose your dates, confirm, and receive your digital access pass.",
  },
  {
    id: 3,
    category: "Technology",
    question: "Can I access Aztech on mobile devices?",
    answer: "Yes, our dedicated mobile app allows you to manage bookings, unlock doors, connect with the community, and track your invoices directly from your smartphone.",
  },
  {
    id: 4,
    category: "Workspace",
    question: "What types of workspaces are available?",
    answer: "We offer dynamic hot desks, dedicated personal desks, private soundproof offices for teams, and fully equipped conference rooms available by the hour or day.",
  },
  {
    id: 5,
    category: "Pricing",
    question: "Are there long-term lease commitments?",
    answer: "No. We operate on a flexible model. You can choose day passes, rolling monthly subscriptions, or discounted annual plans based on your changing needs.",
  },
];

const FAQItem = ({
  faq,
  index,
  isActive,
  onClick,
}: {
  faq: any;
  index: number;
  isActive: boolean;
  onClick: () => void;
}) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`relative overflow-hidden rounded-3xl bg-white border transition-all duration-500 cursor-pointer group ${
        isActive 
          ? "border-transparent shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)]" 
          : "border-gray-100 shadow-sm hover:border-gray-200 hover:shadow-md"
      }`}
      onClick={onClick}
    >
      {/* Animated Left Accent Line for Active State */}
      <motion.div 
        layout
        className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-blue-500 to-indigo-600"
        initial={{ opacity: 0, scaleY: 0 }}
        animate={{ opacity: isActive ? 1 : 0, scaleY: isActive ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        style={{ originY: 0 }}
      />

      <div className="p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          <div className="flex flex-col items-start gap-3 flex-1">
            {/* Category Pill */}
            <motion.span 
              layout
              className={`text-[11px] font-bold tracking-wider uppercase px-3 py-1 rounded-full transition-colors duration-300 ${
                isActive ? "bg-blue-50 text-blue-600" : "bg-gray-100 text-gray-500"
              }`}
            >
              {faq.category}
            </motion.span>
            
            {/* Question */}
            <motion.h3 
              layout
              className={`text-xl md:text-2xl font-bold tracking-tight transition-colors duration-300 pr-8 ${
                isActive ? "text-gray-900" : "text-gray-700 group-hover:text-gray-900"
              }`}
            >
              {faq.question}
            </motion.h3>
          </div>

          {/* Animated Toggle Button */}
          <motion.div 
            layout
            className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 transition-colors duration-300 ${
              isActive ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-400 group-hover:bg-gray-100 group-hover:text-gray-900"
            }`}
          >
            <motion.div
              animate={{ rotate: isActive ? 135 : 0 }}
              transition={{ duration: 0.4, type: "spring", stiffness: 200, damping: 15 }}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </motion.div>
          </motion.div>
        </div>

        {/* Expandable Answer */}
        <AnimatePresence>
          {isActive && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <p className="pt-6 text-base md:text-lg text-gray-500 leading-relaxed font-medium pr-12">
                {faq.answer}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default function FAQ() {
  const [activeIndex, setActiveIndex] = useState<number | null>(0); // First item open by default

  const handleToggle = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="py-24 md:py-32 bg-[#FAFAFA] relative overflow-hidden flex flex-col items-center min-h-screen">
      
      {/* Subtle Ambient Background */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-100/50 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-100/50 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-4xl mx-auto px-4 md:px-8 relative z-10 flex flex-col">
        
        {/* Header Section */}
        <div className="flex flex-col items-center text-center mb-16 md:mb-20">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center space-x-2 bg-white border border-gray-200 rounded-full px-5 py-2 mb-6 shadow-sm"
          >
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-xs font-bold text-gray-700 uppercase tracking-widest">Help Center</span>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 tracking-tight mb-6"
          >
            Questions? <br className="md:hidden" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-500 to-gray-400">
              We have answers.
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-gray-500 max-w-xl mx-auto font-medium"
          >
            Find everything you need to know about booking, managing your workspace, and getting the most out of Aztech.
          </motion.p>
        </div>

        {/* Cards Container */}
        <motion.div layout className="flex flex-col gap-4 md:gap-6 w-full">
          {faqData.map((faq, index) => (
            <FAQItem
              key={faq.id}
              faq={faq}
              index={index}
              isActive={activeIndex === index}
              onClick={() => handleToggle(index)}
            />
          ))}
        </motion.div>

        {/* Bottom Contact CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <p className="text-gray-500 font-medium">
            Still have questions? {" "}
            <a href="#" className="text-blue-600 font-bold hover:text-blue-700 underline underline-offset-4 decoration-2 decoration-blue-200 hover:decoration-blue-600 transition-all">
              Chat with our team
            </a>
          </p>
        </motion.div>

      </div>
    </section>
  );
}