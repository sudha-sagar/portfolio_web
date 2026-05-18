import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FileText, X, Download, Eye, ExternalLink, Mail, Phone, 
  CheckCircle2, Briefcase, GraduationCap, Award
} from "lucide-react";

// Local SVGs for Linkedin and Github since lucide-react 1.8.0 does not export them
const LinkedinIcon = ({ size = 16, className = "" }: { size?: number, className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const GithubIcon = ({ size = 16, className = "" }: { size?: number, className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

export function ResumeArchive({ 
  perspective = "curious",
  isOpen,
  setIsOpen,
  isTouch = false
}: { 
  perspective?: string;
  isOpen?: boolean;
  setIsOpen?: (open: boolean) => void;
  isTouch?: boolean;
}) {
  const [localIsOpen, setLocalIsOpen] = useState(false);
  const activeIsOpen = isOpen !== undefined ? isOpen : localIsOpen;
  const activeSetIsOpen = setIsOpen !== undefined ? setIsOpen : setLocalIsOpen;

  const [activeTab, setActiveTab] = useState<"html" | "pdf">("html");
  const [isMobile, setIsMobile] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const isQuick = perspective === 'quick';
  const isSkeptical = perspective === 'skeptical';

  // Base state values
  const baseRotate = isSkeptical ? 0 : 3;
  const baseScale = isQuick ? 1.02 : 0.96;
  const baseOpacity = isQuick ? 0.98 : 0.90;
  
  // Hover state values
  const hoverRotate = isSkeptical ? 0 : 0.5;
  const hoverScale = isQuick ? 1.06 : 1.05;

  // Prismatic glow opacity
  const prismaticOpacity = isQuick ? 0.08 : (isSkeptical ? 0.05 : (isHovered && !isTouch ? 0.32 : 0.15));
  const prismaticScale = isHovered && !isTouch ? 1.06 : 1.0;

  // Detect mobile device to fallback automatically to HTML view
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(isTouch || window.innerWidth < 768 || /Mobi|Android|iPhone/i.test(navigator.userAgent));
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    
    // Close on Escape key press
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") activeSetIsOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("resize", checkMobile);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isTouch]);

  // Sync tab state: on mobile, force HTML tab since embedded PDFs don't scroll/render well in mobile browsers
  useEffect(() => {
    if (isMobile) {
      setActiveTab("html");
    }
  }, [isMobile]);

  // Spring physical physics for the card trigger
  const triggerSpring = {
    type: "spring" as const,
    stiffness: 70,
    damping: 24,
    mass: 1.1
  };

  return (
    <>
      {/* 1. PHYSICAL CARD TRIGGER */}
      <motion.div
        className="absolute bottom-12 right-12 z-30 cursor-pointer touch-manipulation select-none"
        onMouseEnter={() => !isTouch && setIsHovered(true)}
        onMouseLeave={() => !isTouch && setIsHovered(false)}
        onTap={() => activeSetIsOpen(true)}
        whileTap={{ scale: 0.94 }}
        initial={{ 
          x: 0, 
          y: 0, 
          rotate: baseRotate,
          opacity: baseOpacity,
          scale: baseScale
        }}
        animate={isHovered && !isTouch ? {
          x: -2,
          y: -4,
          rotate: hoverRotate,
          opacity: 1,
          scale: hoverScale
        } : {
          x: 0,
          y: 0,
          rotate: baseRotate,
          opacity: baseOpacity,
          scale: baseScale
        }}
        transition={triggerSpring}
        style={{ transformOrigin: "bottom right" }}
      >
        {/* Soft realistic folder tab sticking out of the card */}
        <div className="absolute top-[-11px] right-5 w-12 h-4 bg-[#F8FAFC]/95 backdrop-blur-md border-t border-x border-white/60 rounded-t-[9px] flex items-center justify-center shadow-[0_-2px_6px_rgba(15,23,42,0.02)] z-10 transition-colors duration-300">
          <span className="text-[6.5px] font-bold tracking-[0.2em] text-[#94A3B8]/90 uppercase">
            RESUME
          </span>
        </div>

        {/* Prismatic Refraction Aura behind the Resume Card */}
        <div 
          className="absolute -inset-5 pointer-events-none rounded-[32px] filter blur-[20px] transition-all duration-[0.6s] ease-[cubic-bezier(0.22,1,0.36,1)] z-0"
          style={{
            background: "radial-gradient(circle at 20% 20%, rgba(244, 63, 94, 0.26) 0%, transparent 60%), radial-gradient(circle at 80% 20%, rgba(59, 130, 246, 0.24) 0%, transparent 60%), radial-gradient(circle at 80% 80%, rgba(16, 185, 129, 0.18) 0%, transparent 60%), radial-gradient(circle at 20% 80%, rgba(236, 72, 153, 0.24) 0%, transparent 60%)",
            opacity: prismaticOpacity,
            transform: `scale(${prismaticScale})`
          }}
        />

        {/* Primary Frosted Slab */}
        <div className={`relative w-[105px] h-[140px] md:w-[120px] md:h-[160px] rounded-[22px] backdrop-blur-[14px] border border-slate-200/75 shadow-[0_14px_36px_rgba(15,23,42,0.07),0_4px_12px_rgba(15,23,42,0.03),inset_0_1px_2px_rgba(255,255,255,0.9)] flex flex-col justify-between p-3.5 overflow-hidden transition-all duration-[0.5s] ease-[cubic-bezier(0.22,1,0.36,1)] ${
          isQuick ? "bg-white/94" : "bg-white/86"
        }`}>
          {/* Subtle realistic paper fiber texture overlay */}
          <div className="absolute inset-0 bg-noise opacity-[0.03] pointer-events-none" />
          
          {/* Inset Border Highlight for tactile depth */}
          <div className="absolute inset-0.5 rounded-[20px] border border-white/20 pointer-events-none" />

          {/* Card Top: Small Debossed Index Layout */}
          <div className="flex justify-between items-start">
            <div className="flex flex-col gap-0.5">
              <div className="w-5 h-0.5 bg-[#CBD5E1]/60 rounded-full" />
              <div className="w-8 h-0.5 bg-[#CBD5E1]/40 rounded-full" />
            </div>
            <FileText size={11} className="text-[#94A3B8]/70" strokeWidth={2} />
          </div>

          {/* Card Center: Elegant Abstract Printed Lines */}
          <div className="flex flex-col gap-1.5 my-auto pl-0.5">
            <div className="w-12 h-0.5 bg-[#E2E8F0] rounded-full" />
            <div className="w-16 h-0.5 bg-[#E2E8F0]/70 rounded-full" />
            <div className="w-10 h-0.5 bg-[#E2E8F0]/50 rounded-full" />
            <div className="w-14 h-0.5 bg-[#E2E8F0]/30 rounded-full" />
          </div>

          {/* Card Bottom: Animated Label Reveal */}
          <div className="relative h-3.5 flex items-center overflow-hidden">
            <AnimatePresence mode="wait">
              {isHovered ? (
                <motion.div
                  key="hover-label"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="flex items-center gap-1.5"
                >
                  <span className="text-[8px] font-bold tracking-[0.18em] text-[#475569] uppercase font-sans">
                    Open Resume
                  </span>
                  <ExternalLink size={8} className="text-[#64748B]" />
                </motion.div>
              ) : (
                <motion.div
                  key="static-label"
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 0.6, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="text-[8px] font-medium tracking-[0.15em] text-[#94A3B8] uppercase font-sans"
                >
                  [ RESUME ]
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      {/* 2. SPATIAL EXPANSION OVERLAY */}
      <AnimatePresence>
        {activeIsOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-hidden">
            {/* Backdrop: Faint, light white fog */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              onClick={() => activeSetIsOpen(false)}
              className="absolute inset-0 bg-[#F1F5F9]/35 backdrop-blur-[12px]"
            />

            {/* Immersive Frosted Workspace Window */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 16 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-[1000px] h-[85vh] bg-white/75 backdrop-blur-[28px] border border-white/60 shadow-[0_32px_80px_rgba(15,23,42,0.06),0_4px_16px_rgba(15,23,42,0.02),inset_0_2px_4px_rgba(255,255,255,0.8)] rounded-[32px] overflow-hidden flex flex-col z-10"
            >
              {/* Subtle Paper Texture inside window */}
              <div className="absolute inset-0 bg-noise opacity-[0.02] pointer-events-none" />

              {/* WINDOW HEADER BAR */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E8F0]/50 bg-white/30 backdrop-blur-sm select-none z-20">
                {/* Left: macOS Window Controls - Red Only */}
                <div className="flex items-center gap-1.5 w-1/4">
                  <div 
                    onClick={() => activeSetIsOpen(false)}
                    className="w-3 h-3 rounded-full bg-[#EF4444]/20 border border-[#EF4444]/35 hover:bg-[#EF4444]/80 transition-colors duration-200 cursor-pointer flex items-center justify-center group"
                    title="Close"
                  >
                    <X size={6} className="text-transparent group-hover:text-[#EF4444] transition-colors duration-200" />
                  </div>
                </div>

                {/* Center: Curated Spatial Title */}
                <div className="text-center flex-grow flex items-center justify-center">
                  <span className="text-[10px] md:text-[11px] font-bold tracking-[0.16em] text-[#64748B] uppercase font-sans">
                    Resume — Sudha Sagar Gollapalli
                  </span>
                </div>

                {/* Right: Window Actions */}
                <div className="flex items-center justify-end gap-3 w-1/4">
                  {/* View Toggles (Desktop only) */}
                  {!isMobile && (
                    <div className="flex items-center bg-[#F1F5F9]/60 p-0.5 rounded-full border border-white/50 shadow-inner">
                      <button
                        onClick={() => setActiveTab("html")}
                        className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all duration-300 ${
                          activeTab === "html"
                            ? "bg-white text-[#3B82F6] shadow-sm"
                            : "text-[#64748B] hover:text-[#0F172A]"
                        }`}
                      >
                        <Eye size={10} />
                        Document
                      </button>
                      <button
                        onClick={() => setActiveTab("pdf")}
                        className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all duration-300 ${
                          activeTab === "pdf"
                            ? "bg-white text-[#3B82F6] shadow-sm"
                            : "text-[#64748B] hover:text-[#0F172A]"
                        }`}
                      >
                        <FileText size={10} />
                        Original PDF
                      </button>
                    </div>
                  )}

                  {/* Download Link */}
                  <a
                    href="/Sudha_Sagar_Gollapalli_Resume.pdf"
                    download="Sudha_Sagar_Gollapalli_Resume.pdf"
                    className="flex items-center justify-center w-8 h-8 rounded-full bg-white/80 hover:bg-[#3B82F6] border border-[#E2E8F0] hover:border-[#3B82F6] text-[#64748B] hover:text-white shadow-sm hover:shadow-md transition-all duration-300 group"
                    title="Download Original PDF"
                  >
                    <Download size={14} className="group-hover:scale-110 transition-transform duration-300" />
                  </a>

                  {/* Mobile Close Button */}
                  {isMobile && (
                    <button
                      onClick={() => activeSetIsOpen(false)}
                      className="flex items-center justify-center w-8 h-8 rounded-full bg-white/80 border border-[#E2E8F0] text-[#64748B] hover:text-red-500 transition-colors"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              </div>

              {/* WINDOW CONTENT CONTAINER */}
              <div className="flex-grow overflow-y-auto px-6 py-8 md:px-12 md:py-10 z-10 custom-scrollbar bg-white/10">
                {activeTab === "html" ? (
                  /* HIGH FIDELITY HTML RESUME LAYOUT */
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="max-w-[760px] mx-auto bg-white/80 border border-[#94A3B8]/15 rounded-3xl p-6 md:p-12 shadow-[0_12px_40px_rgba(0,0,0,0.02)]"
                  >
                    {/* HTML Header */}
                    <div className="text-center border-b border-slate-100 pb-8">
                      <h2 className="text-[28px] md:text-[34px] font-black tracking-tight text-[#0F172A] leading-tight mb-2">
                        SUDHA SAGAR GOLLAPALLI
                      </h2>
                      <p className="text-[11px] md:text-[12px] font-bold tracking-[0.2em] text-[#3B82F6] uppercase mb-4">
                        Full-Stack Developer • AI-Native Systems Architect
                      </p>
                      
                      {/* Contacts Array */}
                      <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2 mt-4 text-[13px] text-[#64748B]">
                        <a 
                          href="mailto:gsudhasagar2006@gmail.com" 
                          className="flex items-center gap-1.5 hover:text-[#3B82F6] transition-colors"
                        >
                          <Mail size={13} className="text-[#94A3B8]" />
                          gsudhasagar2006@gmail.com
                        </a>
                        <span className="w-1 h-1 rounded-full bg-slate-300 hidden md:block" />
                        <span className="flex items-center gap-1.5">
                          <Phone size={13} className="text-[#94A3B8]" />
                          +91 7997480180
                        </span>
                        <div className="w-full md:w-auto h-0.5 md:h-auto md:flex items-center gap-x-6 gap-y-2">
                          <span className="w-1 h-1 rounded-full bg-slate-300 hidden md:block" />
                          <a 
                            href="https://www.linkedin.com/in/sudha-sagar-9a0739332/" 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="flex items-center gap-1.5 hover:text-[#3B82F6] transition-colors"
                          >
                            <LinkedinIcon size={13} className="text-[#94A3B8]" />
                            linkedin.com/in/sudha-sagar-9a0739332
                          </a>
                          <span className="w-1 h-1 rounded-full bg-slate-300 hidden md:block" />
                          <a 
                            href="https://github.com/sudha-sagar" 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="flex items-center gap-1.5 hover:text-[#3B82F6] transition-colors"
                          >
                            <GithubIcon size={13} className="text-[#94A3B8]" />
                            github.com/sudha-sagar
                          </a>
                        </div>
                      </div>
                    </div>

                    {/* Summary Section */}
                    <div className="mt-8">
                      <div className="flex items-center gap-3 mb-4">
                        <Award size={16} className="text-[#3B82F6]" />
                        <h3 className="text-[14px] font-black uppercase tracking-[0.16em] text-[#0F172A]">
                          Professional Summary
                        </h3>
                      </div>
                      <p className="text-[14px] md:text-[15px] leading-[1.7] text-[#475569]">
                        Full-Stack Developer specializing in building AI-native, production-ready web applications. 
                        Expert in React/Next.js and Node.js, with a focus on bridging complex backend logic with fluid, 
                        high-performance user interfaces. Proven ability to handle inconsistent data structures, manage 
                        complex state logic, and deploy scalable architectures.
                      </p>
                    </div>

                    {/* Technical Skills Section */}
                    <div className="mt-10 border-t border-slate-100/80 pt-8">
                      <div className="flex items-center gap-3 mb-6">
                        <CheckCircle2 size={16} className="text-[#3B82F6]" />
                        <h3 className="text-[14px] font-black uppercase tracking-[0.16em] text-[#0F172A]">
                          Technical Core
                        </h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
                        <div className="flex flex-col gap-1.5">
                          <span className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider">Frontend Engine</span>
                          <span className="text-[13.5px] font-semibold text-[#334155] leading-relaxed">
                            React.js, Next.js, TypeScript, Tailwind CSS, Framer Motion, Context API, Redux, PWAs
                          </span>
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <span className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider">Backend Systems</span>
                          <span className="text-[13.5px] font-semibold text-[#334155] leading-relaxed">
                            Node.js, Express, REST APIs, JSON Validation, Data Transformation/Pipelines
                          </span>
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <span className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider">Databases & ORMs</span>
                          <span className="text-[13.5px] font-semibold text-[#334155] leading-relaxed">
                            PostgreSQL, Prisma ORM, Firebase, LocalStorage (Offline-First Architectures)
                          </span>
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <span className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider">Workspace & Tools</span>
                          <span className="text-[13.5px] font-semibold text-[#334155] leading-relaxed">
                            Git/GitHub, Vercel, System Design, OS/DBMS Fundamentals, AI Agent Orchestration
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Key Projects Section */}
                    <div className="mt-10 border-t border-slate-100/80 pt-8">
                      <div className="flex items-center gap-3 mb-6">
                        <Briefcase size={16} className="text-[#3B82F6]" />
                        <h3 className="text-[14px] font-black uppercase tracking-[0.16em] text-[#0F172A]">
                          Key Projects
                        </h3>
                      </div>
                      
                      <div className="flex flex-col gap-8">
                        {/* Zep Menu */}
                        <div className="group">
                          <div className="flex items-baseline justify-between gap-4 mb-2">
                            <h4 className="text-[16px] md:text-[17px] font-bold text-[#0F172A] group-hover:text-[#3B82F6] transition-colors">
                              Zep Menu <span className="text-[13px] font-normal text-slate-400">| Modern Contactless Ordering</span>
                            </h4>
                            <div className="flex gap-3 text-[12px] font-bold text-[#3B82F6] uppercase tracking-wide flex-shrink-0">
                              <a href="https://zep-menu.vercel.app/" target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center gap-0.5">Live <ExternalLink size={10} /></a>
                              <a href="https://github.com/sudha-sagar" target="_blank" rel="noopener noreferrer" className="hover:underline text-slate-400">Code</a>
                            </div>
                          </div>
                          <p className="text-[13.5px] text-[#475569] leading-relaxed mb-2.5">
                            Engineered a high-performance QR ordering platform using Next.js and TypeScript, reducing restaurant wait times.
                          </p>
                          <ul className="list-none pl-0 flex flex-col gap-1.5 text-[13px] text-[#64748B]">
                            <li className="flex items-start gap-2">
                              <span className="text-[#3B82F6] mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-[#3B82F6]" />
                              <span>Architected a robust global state management system using React Context to handle real-time cart updates and dynamic pricing without re-renders.</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-[#3B82F6] mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-[#3B82F6]" />
                              <span>Implemented fluid micro-interactions with Framer Motion, ensuring a zero-friction, native-app-like web experience.</span>
                            </li>
                          </ul>
                        </div>

                        {/* Underneath */}
                        <div className="group">
                          <div className="flex items-baseline justify-between gap-4 mb-2">
                            <h4 className="text-[16px] md:text-[17px] font-bold text-[#0F172A] group-hover:text-[#3B82F6] transition-colors">
                              Underneath <span className="text-[13px] font-normal text-slate-400">| Psychological Logic Engine</span>
                            </h4>
                            <a href="https://underneath-gamma.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-[12px] font-bold text-[#3B82F6] uppercase tracking-wide hover:underline flex items-center gap-0.5 flex-shrink-0">Live <ExternalLink size={10} /></a>
                          </div>
                          <p className="text-[13.5px] text-[#475569] leading-relaxed mb-2.5">
                            Built a custom Contradiction & Deduction Engine in JavaScript to analyze gaps in human behavioral data (e.g., Logic vs. Ego).
                          </p>
                          <ul className="list-none pl-0 flex flex-col gap-1.5 text-[13px] text-[#64748B]">
                            <li className="flex items-start gap-2">
                              <span className="text-[#3B82F6] mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-[#3B82F6]" />
                              <span>Designed the system to process abstract and inconsistent inputs, continuously adjusting user profiles in real-time.</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-[#3B82F6] mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-[#3B82F6]" />
                              <span>Utilized React Hooks to decouple complex logic from the UI, ensuring the application remains stable during heavy calculations.</span>
                            </li>
                          </ul>
                        </div>

                        {/* Threat Detection */}
                        <div className="group">
                          <div className="flex items-baseline justify-between gap-4 mb-2">
                            <h4 className="text-[16px] md:text-[17px] font-bold text-[#0F172A] group-hover:text-[#3B82F6] transition-colors">
                              Threat Detection System <span className="text-[13px] font-normal text-slate-400">| Surveillance Hub</span>
                            </h4>
                            <a href="https://hotel-security-threat-detection.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-[12px] font-bold text-[#3B82F6] uppercase tracking-wide hover:underline flex items-center gap-0.5 flex-shrink-0">Live <ExternalLink size={10} /></a>
                          </div>
                          <p className="text-[13.5px] text-[#475569] leading-relaxed mb-2.5">
                            Developed a real-time safety dashboard to monitor and prioritize alerts for fighting, fire, and suspicious behavior.
                          </p>
                          <ul className="list-none pl-0 flex flex-col gap-1.5 text-[13px] text-[#64748B]">
                            <li className="flex items-start gap-2">
                              <span className="text-[#3B82F6] mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-[#3B82F6]" />
                              <span>Built a Node.js backend to handle asynchronous data streams from surveillance APIs and sensors.</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-[#3B82F6] mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-[#3B82F6]" />
                              <span>Implemented a map-based visualization layer to guide operators in planning safe exit routes during emergencies.</span>
                            </li>
                          </ul>
                        </div>

                        {/* Spending Store */}
                        <div className="group">
                          <div className="flex items-baseline justify-between gap-4 mb-2">
                            <h4 className="text-[16px] md:text-[17px] font-bold text-[#0F172A] group-hover:text-[#3B82F6] transition-colors">
                              Spending Store <span className="text-[13px] font-normal text-slate-400">| Offline-First PWA Tracker</span>
                            </h4>
                            <a href="https://sudha-sagar.github.io/spending-store/" target="_blank" rel="noopener noreferrer" className="text-[12px] font-bold text-[#3B82F6] uppercase tracking-wide hover:underline flex items-center gap-0.5 flex-shrink-0">Live <ExternalLink size={10} /></a>
                          </div>
                          <p className="text-[13.5px] text-[#475569] leading-relaxed mb-2.5">
                            Engineered a privacy-first Progressive Web App (PWA) that installs directly on devices and works fully offline.
                          </p>
                          <ul className="list-none pl-0 flex flex-col gap-1.5 text-[13px] text-[#64748B]">
                            <li className="flex items-start gap-2">
                              <span className="text-[#3B82F6] mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-[#3B82F6]" />
                              <span>Implemented a symbol-based interface to eliminate user friction, focusing on high-speed expense logging.</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-[#3B82F6] mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-[#3B82F6]" />
                              <span>Managed 100% data ownership via local device storage, eliminating the need for cloud sync or external databases.</span>
                            </li>
                          </ul>
                        </div>

                        {/* Bumblebee */}
                        <div className="group">
                          <div className="flex items-baseline justify-between gap-4 mb-2">
                            <h4 className="text-[16px] md:text-[17px] font-bold text-[#0F172A] group-hover:text-[#3B82F6] transition-colors">
                              Bumblebee <span className="text-[13px] font-normal text-slate-400">| Hybrid AI Voice Assistant</span>
                            </h4>
                            <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded-md flex-shrink-0">Automation Script</span>
                          </div>
                          <p className="text-[13.5px] text-[#475569] leading-relaxed mb-2.5">
                            Created a modular automation tool for system tasks (opening apps, system locks) using low-latency speech recognition.
                          </p>
                          <ul className="list-none pl-0 flex flex-col gap-1.5 text-[13px] text-[#64748B]">
                            <li className="flex items-start gap-2">
                              <span className="text-[#3B82F6] mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-[#3B82F6]" />
                              <span>Implemented "Mood-based Automation" to trigger complex environment setups (e.g., "Let's Code") via single voice commands.</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* Education Section */}
                    <div className="mt-10 border-t border-slate-100/80 pt-8">
                      <div className="flex items-center gap-3 mb-6">
                        <GraduationCap size={16} className="text-[#3B82F6]" />
                        <h3 className="text-[14px] font-black uppercase tracking-[0.16em] text-[#0F172A]">
                          Education
                        </h3>
                      </div>
                      
                      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-3">
                        <div>
                          <h4 className="text-[15.5px] font-bold text-[#0F172A]">
                            Sri Vasavi Engineering College
                          </h4>
                          <p className="text-[13.5px] text-[#475569] mt-0.5">
                            B.Tech in Computer Science and Engineering (4th Semester)
                          </p>
                          <p className="text-[12.5px] text-[#64748B] mt-2 font-semibold">
                            Core Coursework: Operating Systems, Database Management Systems (DBMS), Algorithms, SQL, Data Structures.
                          </p>
                        </div>
                        <div className="text-left md:text-right flex-shrink-0 flex md:flex-col items-center md:items-end gap-3 md:gap-1.5">
                          <span className="text-[12px] font-bold text-[#64748B] uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded">
                            2024 — 2028 (Expected)
                          </span>
                          <span className="text-[13px] font-bold text-[#3B82F6]">
                            CGPA: 8.7
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  /* EMBEDDED IFRAME FOR ORIGINAL PDF (Desktop Only) */
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4 }}
                    className="w-full h-full rounded-2xl overflow-hidden border border-[#94A3B8]/20 shadow-inner bg-[#F1F5F9]"
                  >
                    <iframe
                      src="/Sudha_Sagar_Gollapalli_Resume.pdf#toolbar=0&view=FitH"
                      className="w-full h-full border-0"
                      title="Sudha Sagar Gollapalli Resume PDF"
                    />
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
