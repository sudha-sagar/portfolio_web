import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 60) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <motion.div 
      layout
      onClick={scrollToTop}
      style={{ cursor: "pointer" }}
      initial={{ opacity: 0, y: -15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-3 left-3 md:left-4 z-50 inline-flex items-center justify-center bg-white/20 hover:bg-white/40 backdrop-blur-md border border-white/40 shadow-[0_4px_16px_rgba(0,0,0,0.03),inset_0_1px_2px_rgba(255,255,255,0.4)] rounded-full transition-all duration-300 hover:scale-[1.03] active:scale-95 ${
        isScrolled ? "w-8 h-8 p-0" : "px-[14px] py-[6px] gap-[8px]"
      }`}
    >
      {/* Simple crisp marker instead of neon orb */}
      <motion.div 
        layout
        className="w-[6px] h-[6px] rounded-full bg-[#3B82F6] shadow-[0_0_8px_rgba(59,130,246,0.8)]" 
      />
      
      {/* Uniform Smooth Typography with subtle depth */}
      <AnimatePresence>
        {!isScrolled && (
          <motion.h1 
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "auto" }}
            exit={{ opacity: 0, width: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="text-[#0F172A]/90 font-sans tracking-[0.06em] text-[11px] font-bold uppercase whitespace-nowrap overflow-hidden pr-[2px]"
          >
            Sudha Sagar
          </motion.h1>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
