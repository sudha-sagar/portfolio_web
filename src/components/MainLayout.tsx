import React, { useState } from "react";
import { 
  MoveRight, Database, PenTool, Brain, Network, Layers, Lightbulb,
  Smartphone, RefreshCw, Zap, Shield, MapPin, Mic, Sliders,
  GraduationCap, Award, Mail, FileText
} from "lucide-react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { AvatarWidget } from "./AvatarWidget";
import { ResumeArchive } from "./ResumeArchive";
import { useDeviceCapability } from '../hooks/useDeviceCapability';

// 1. Data-Driven Experiments configuration for extremely easy updating
const EXPERIMENTS = [
  {
    title: "Zep Menu",
    subtitle: "Modern Contactless Ordering Platform",
    description: "A high-performance QR ordering platform engineered with Next.js and TypeScript, reducing restaurant wait times.",
    pillars: [
      { label: "QR Platform", desc: "High-speed digital ordering system built with Next.js.", icon: Smartphone },
      { label: "Real-time Sync", desc: "Context state management for cart synchronization.", icon: RefreshCw },
      { label: "Fluid UX", desc: "Silky-smooth micro-interactions driven by Framer Motion.", icon: Zap }
    ],
    tags: ["Next.js", "TypeScript", "React Context", "Framer Motion", "PostgreSQL", "Prisma"],
    link: "https://zep-menu.vercel.app/",
    bgColor: "bg-[#FFFFFF]",
    borderRadius: "rounded-[36px]",
    className: "col-span-12 lg:col-span-7"
  },
  {
    title: "Underneath",
    subtitle: "Psychological Logic Engine",
    description: "A custom Contradiction & Deduction Engine in JavaScript to analyze gaps in human behavioral data (Logic vs. Ego).",
    pillars: [
      { label: "Deduction Engine", desc: "Custom logical contradictions parsing engine.", icon: Brain },
      { label: "Profile Sync", desc: "Real-time, continuous user profile adjustments.", icon: Sliders },
      { label: "UI Decoupling", desc: "React Hooks isolation for heavy math computations.", icon: Layers }
    ],
    tags: ["JavaScript", "React Hooks", "Cognitive Math", "Deduction Engine"],
    link: "https://underneath-gamma.vercel.app/",
    bgColor: "bg-[#E6F4F8]",
    borderRadius: "rounded-[32px_32px_12px_32px]",
    className: "col-span-12 lg:col-span-5"
  },
  {
    title: "Threat Detection System",
    subtitle: "Hackathon Project",
    description: "A real-time safety dashboard to monitor and prioritize alerts for fighting, fire, and suspicious behavior.",
    pillars: [
      { label: "Safety Feed", desc: "Real-time, event-triggered surveillance alert center.", icon: Shield },
      { label: "Node Streams", desc: "Asynchronous data stream handling for sensor APIs.", icon: Network },
      { label: "Map Routes", desc: "Operator exit planning and path visualization layers.", icon: MapPin }
    ],
    tags: ["Node.js", "API Integration", "Asynchronous Streams", "Map Visualization"],
    link: "https://hotel-security-threat-detection.vercel.app/",
    bgColor: "bg-[#FFF4E8]",
    borderRadius: "rounded-[28px]",
    className: "col-span-12 lg:col-span-6"
  },
  {
    title: "Spending Store",
    subtitle: "Offline-First Expense Tracker",
    description: "A privacy-first Progressive Web App (PWA) that installs directly on devices and works fully offline.",
    pillars: [
      { label: "PWA Native", desc: "Zero-friction home-screen installable application.", icon: Smartphone },
      { label: "Symbol Input", desc: "Frictionless, high-speed expense categorizer.", icon: PenTool },
      { label: "Data Lock", desc: "100% user data ownership stored strictly locally.", icon: Database }
    ],
    tags: ["PWA", "Offline-First", "Local Storage", "UX Design"],
    link: "https://sudha-sagar.github.io/spending-store/",
    bgColor: "bg-[#EDF7F1]",
    borderRadius: "rounded-[36px_24px_36px_24px]",
    className: "col-span-12 lg:col-span-6"
  },
  {
    title: "Bumblebee",
    subtitle: "Hybrid AI Voice Assistant",
    description: "A modular automation tool for system tasks (opening apps, system locks) using low-latency speech recognition.",
    pillars: [
      { label: "Voice Automator", desc: "Low-latency system task trigger engine.", icon: Mic },
      { label: "Mood Actions", desc: "Complex developer environment setups in one word.", icon: Lightbulb }
    ],
    tags: ["AI Voice Assistant", "System Automation", "Speech Recognition", "Local Scripts"],
    bgColor: "bg-[#FAF8F5]",
    borderRadius: "rounded-[48px_16px_48px_16px]",
    className: "col-span-12 lg:col-span-6"
  },
  {
    title: "UI Library",
    subtitle: "Dynamic Component Sandbox",
    description: "A high-performance visual playground designed to test, preview, and compare diverse design aesthetics (e.g., glassmorphism, neo-brutalism, flat minimalism).",
    pillars: [
      { label: "Design Sandbox", desc: "Sandbox environment to preview interactive cards & layouts.", icon: PenTool },
      { label: "Modular Builds", desc: "Crafted with Vite and React for lightning-fast rendering.", icon: Layers },
      { label: "Style Compare", desc: "Compare glassmorphism, neo-brutalism, and minimalist aesthetics.", icon: Sliders }
    ],
    tags: ["React", "Vite", "Tailwind CSS", "Interactive Sandbox", "Design Tokens"],
    link: "https://ui-library-seven-beryl.vercel.app/",
    bgColor: "bg-[#F3F1FF]",
    borderRadius: "rounded-[32px_12px_32px_12px]",
    className: "col-span-12 lg:col-span-6"
  }
];

function Section({ id, title, children, className = "mb-[96px]" }: { id: string, title: string, children: React.ReactNode, className?: string }) {
  return (
    <section id={id} className={`${className} last:mb-[48px] transition-all duration-[0.8s] ease-[cubic-bezier(0.16,1,0.3,1)]`}>
      <div className="flex items-center gap-[16px] mb-[40px]">
        <div className="flex items-center">
          <div className="w-[8px] h-[8px] rounded-full bg-[#3B82F6] shadow-[0_0_12px_rgba(59,130,246,0.8)]"></div>
          <div className="w-[48px] h-[2px] bg-gradient-to-r from-[#3B82F6]/60 to-transparent"></div>
        </div>
        <h2 className="text-[16px] md:text-[18px] uppercase tracking-[0.2em] font-black text-[#0F172A] drop-shadow-sm">
          {title}
        </h2>
      </div>
      <div className="pl-[24px] md:pl-[0]">
        {children}
      </div>
    </section>
  );
}

function CognitiveObject({ 
  children, 
  className, 
  bgColor, 
  borderRadius, 
  perspective = "curious"
}: { 
  children: React.ReactNode, 
  className?: string, 
  bgColor: string, 
  borderRadius: string, 
  perspective?: string
}) {
  const capability = useDeviceCapability();
  const { isTouch, prefersReducedMotion, tier } = capability;
  const ref = React.useRef<HTMLDivElement>(null);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isTouch || prefersReducedMotion || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Normalize coordinates between -1 and 1
    x.set((e.clientX - centerX) / (rect.width / 2));
    y.set((e.clientY - centerY) / (rect.height / 2));
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  // Extremely soft spring for subtle tilt
  const isSkeptical = perspective === 'skeptical';
  const springConfig = { damping: 40, stiffness: 150, mass: 1 };
  const rotateX = useSpring(useTransform(y, [-1, 1], (isSkeptical || isTouch || prefersReducedMotion) ? [0, 0] : [1.5, -1.5]), springConfig);
  const rotateY = useSpring(useTransform(x, [-1, 1], (isSkeptical || isTouch || prefersReducedMotion) ? [0, 0] : [-1.5, 1.5]), springConfig);

  const shouldDisableHover = isTouch || prefersReducedMotion;

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={shouldDisableHover ? undefined : "hover"}
      style={{ perspective: 1200 }}
      className={`relative w-full h-full group cursor-default select-none ${className}`}
    >
      {/* 3D Tilted Background Layer */}
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        variants={{
          hover: { scale: 1.015, y: -6 }
        }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={`absolute inset-0 overflow-hidden ${
          tier === 'C' || tier === 'D' ? 'bg-white/95 border-slate-200' : 'backdrop-blur-md border-[1.5px] border-white/80'
        } shadow-[0_12px_40px_rgba(0,0,0,0.04),inset_0_2px_4px_rgba(255,255,255,0.8)] group-hover:shadow-[0_24px_64px_rgba(0,0,0,0.08),inset_0_2px_6px_rgba(255,255,255,1)] group-hover:border-white transition-all duration-[0.6s] ease-[cubic-bezier(0.16,1,0.3,1)] ${borderRadius}`}
      >
        <div className={`absolute inset-0 ${bgColor} opacity-90`} />
      </motion.div>

      {/* Flat Content Layer (No 3D rotation = perfectly crisp text) */}
      <motion.div
        variants={{
          hover: shouldDisableHover ? { scale: 1, y: 0 } : { scale: 1.015, y: -6 }
        }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={`relative z-10 w-full h-full flex flex-col justify-center pointer-events-auto transition-all duration-500 ${
          perspective === 'quick' ? 'p-[20px] md:p-[28px]' : 'p-[32px] md:p-[48px]'
        }`}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

function FloatingCognitiveSpace({ 
  perspective = "curious"
}: { 
  perspective?: string
}) {
  const capability = useDeviceCapability();
  const { isTouch, prefersReducedMotion } = capability;
  const isQuick = perspective === 'quick';

  return (
    <div className="relative w-full">
      {/* 12-column asymmetric grid simulating a floating constellation */}
      <div className={`grid grid-cols-12 transition-all duration-500 ${
        isQuick ? 'gap-[20px] md:gap-[24px]' : 'gap-[32px] md:gap-[48px]'
      }`}>
        
        {/* 1. Main Identity Anchor */}
        <CognitiveObject 
          perspective={perspective}
          className="col-span-12 md:col-span-7"
          bgColor="bg-[#FFFFFF]" 
          borderRadius="rounded-[36px]"
        >
          <h3 className={`heading-section leading-snug transition-all duration-500 ${
            isQuick ? 'text-[20px] md:text-[24px] mb-[8px]' : 'mb-[16px]'
          }`}>
            I build systems <br/>
            for clarity, curiosity, <br/>
            and <span className="text-[#64748B] italic">controlled chaos.</span>
          </h3>
          <p className="text-micro text-[#94A3B8]">
            code, design, experiments, observations.
          </p>
        </CognitiveObject>

        {/* 2. Philosophy (Top Right green-ish panel) */}
        <CognitiveObject 
          perspective={perspective}
          className="col-span-12 md:col-span-5 md:col-start-8 hidden md:block"
          bgColor="bg-[#E6F4F8]" 
          borderRadius="rounded-[32px_32px_32px_12px]"
        >
          <h4 className="text-micro text-[#94A3B8] mb-[16px]">Philosophy</h4>
          <p className={`heading-card font-medium text-[#0F172A] leading-relaxed transition-all duration-500 ${
            isQuick ? 'text-[14px] md:text-[15px]' : ''
          }`}>
            “I’m fascinated by systems that quietly shape human behavior.”
          </p>
        </CognitiveObject>

        {/* 3. Current State */}
        <CognitiveObject 
          perspective={perspective}
          className={`col-span-12 md:col-span-5 md:col-start-1 transition-all duration-500 ${
            isQuick ? 'md:mt-0' : 'md:mt-[64px]'
          }`}
          bgColor="bg-[#FFF4E8]" 
          borderRadius="rounded-[28px]"
        >
          <h4 className="text-micro text-[#94A3B8] mb-[16px]">Current State</h4>
          <p className={`font-medium text-[#0F172A] leading-relaxed transition-all duration-500 ${
            isQuick ? 'text-[13px] md:text-[14px]' : 'text-[15px] md:text-[17px]'
          }`}>
            Currently exploring emotionally adaptive interfaces, AI-assisted creativity systems, and experimental spatial UI design.
          </p>
        </CognitiveObject>

        {/* 4. Current Focus */}
        <CognitiveObject 
          perspective={perspective}
          className={`col-span-12 md:col-span-7 md:col-start-6 transition-all duration-500 ${
            isQuick ? 'md:mt-0' : 'md:mt-[48px]'
          }`}
          bgColor="bg-[#F1EEFF]" 
          borderRadius="rounded-[40px]"
        >
          <h4 className={`text-micro text-[#94A3B8] text-center transition-all duration-500 ${
            isQuick ? 'mb-[12px]' : 'mb-[24px]'
          }`}>Current Focus</h4>
          <div className="flex flex-wrap justify-center items-center gap-[12px]">
            {[
              { name: "DSA", icon: Database },
              { name: "UI/UX", icon: PenTool },
              { name: "Interface Psychology", icon: Brain },
              { name: "Systems Design", icon: Network },
              { name: "Full-Stack", icon: Layers },
              { name: "Problem Solving", icon: Lightbulb }
            ].map(concept => {
              const Icon = concept.icon;
              return (
                <motion.div 
                  key={concept.name} 
                  whileHover={isTouch || prefersReducedMotion ? undefined : { scale: 1.08, y: -2 }}
                  whileTap={{ scale: 0.92 }}
                  transition={{ type: "spring", stiffness: 400, damping: 15 }}
                  className={`flex items-center gap-[8px] bg-white/70 backdrop-blur-md rounded-full font-medium text-[#0F172A] shadow-[0_4px_12px_rgba(0,0,0,0.04)] border border-white cursor-pointer transition-all duration-500 ${
                    isQuick ? 'px-[10px] py-[6px] text-[11px]' : 'px-[14px] py-[8px] text-[13px]'
                  }`}
                >
                  <Icon size={isQuick ? 12 : 14} className="text-[#64748B]" strokeWidth={2.5} />
                  <span>{concept.name}</span>
                </motion.div>
              );
            })}
          </div>
        </CognitiveObject>

        {/* 5. Identity */}
        <CognitiveObject 
          perspective={perspective}
          className={`col-span-12 md:col-span-6 md:col-start-1 transition-all duration-500 ${
            isQuick ? 'md:mt-0' : 'md:mt-[64px]'
          }`}
          bgColor="bg-[#FAF8F5]" 
          borderRadius="rounded-[48px]"
        >
          <h4 className="text-micro text-[#94A3B8] mb-[24px]">Identity</h4>
          <div className="flex flex-col gap-[20px]">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0">
                <GraduationCap size={16} className="text-[#3B82F6]" strokeWidth={2.5} />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-[#64748B] font-bold uppercase tracking-[0.1em] mb-[2px]">Education</span>
                <span className={`font-semibold text-[#0F172A] transition-all duration-500 ${
                  isQuick ? 'text-[14px] md:text-[15px]' : 'text-[16px] md:text-[18px]'
                }`}>
                  Sri Vasavi Engineering College
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-[32px]">
              <div className="flex items-start gap-2.5">
                <div className="p-1.5 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Award size={14} className="text-emerald-600" strokeWidth={2.5} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-[#64748B] font-bold uppercase tracking-[0.1em] mb-[2px]">Program</span>
                  <span className="text-[13px] font-medium text-[#0F172A]">B.Tech CSE</span>
                </div>
              </div>
              
              <div className="w-[1px] h-[28px] bg-[#94A3B8]/20"></div>
              
              <div className="flex items-start gap-2.5">
                <div className="p-1.5 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Zap size={13} className="text-amber-600" strokeWidth={2.5} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-[#64748B] font-bold uppercase tracking-[0.1em] mb-[2px]">CGPA</span>
                  <span className="text-[13px] font-bold text-[#3B82F6]">8.7</span>
                </div>
              </div>
            </div>
          </div>
        </CognitiveObject>

        {/* 6. Learning Style */}
        <CognitiveObject 
          perspective={perspective}
          className={`col-span-12 md:col-span-6 md:col-start-7 transition-all duration-500 ${
            isQuick ? 'md:mt-0' : 'md:mt-[64px]'
          }`}
          bgColor="bg-[#EDF7F1]" 
          borderRadius="rounded-[24px_48px_24px_48px]"
        >
          <h4 className="text-micro text-[#94A3B8] mb-[24px] text-center">Learning Style</h4>
          <div className="flex flex-wrap justify-center gap-[12px]">
            {["experimentation", "reverse engineering", "first principles thinking", "visual exploration"].map(tag => (
              <span 
                key={tag} 
                className={`px-[16px] py-[8px] rounded-full bg-white/60 border border-white text-[#475569] font-medium shadow-sm transition-all duration-500 ${
                  isQuick ? 'text-[11px] px-[12px] py-[6px]' : 'text-[13px]'
                }`}
              >
                {tag}
              </span>
            ))}
          </div>
        </CognitiveObject>

      </div>

    </div>
  );
}

// 2. FaiLearns Reflective Note Component & Configuration
interface FaiLearn {
  obs: string;
  tag: string;
  time: string;
  primary: string;
  secondary: string;
  bgColor: string;
  rotationClass: string;
  className: string;
}

const FAILEARNS: FaiLearn[] = [
  {
    obs: "01",
    tag: "Avoidance",
    time: "11:45 PM",
    primary: "Spent an entire night researching the “perfect roadmap” for cracking GATE CSE.",
    secondary: "Ended up with seventeen tabs, four PDFs, two YouTube playlists, and absolutely zero solved questions. At this point, I think I’m preparing more for planning than for the actual exam.",
    bgColor: "bg-[#FAF6F1]",
    rotationClass: "md:rotate-[0.6deg]",
    className: "col-span-12 md:col-span-6"
  },
  {
    obs: "02",
    tag: "Existentialism",
    time: "01:20 AM",
    primary: "Kept redesigning my portfolio because it didn’t “feel right emotionally.”",
    secondary: "The About section has gone through more character development than I have this year. Somewhere between glassmorphism and existentialism, I forgot to ship the actual thing.",
    bgColor: "bg-[#FFF4E8]",
    rotationClass: "md:-rotate-[1deg]",
    className: "col-span-12 md:col-span-5 md:col-start-8 md:mt-[48px]"
  },
  {
    obs: "03",
    tag: "Side Quest",
    time: "02:15 AM",
    primary: "Tried learning concepts from first principles so deeply that a two-hour topic became a three-day philosophical side quest.",
    secondary: "Ended up reading about consciousness, memory, and why humans invented exams in the first place. Sometimes I don’t study concepts. I emotionally adopt them.",
    bgColor: "bg-[#F7EBDD]",
    rotationClass: "md:rotate-[0.8deg]",
    className: "col-span-12 md:col-span-8 md:col-start-3 md:mt-[32px]"
  },
  {
    obs: "04",
    tag: "Negotiation",
    time: "12:05 AM",
    primary: "Consistency doesn’t collapse dramatically.",
    secondary: "It disappears through tiny negotiations you make with yourself when nobody is watching. The slow decay is invisible until the collapse is absolute.",
    bgColor: "bg-[#F3E5D7]",
    rotationClass: "md:-rotate-[0.8deg]",
    className: "col-span-12 md:col-span-5 md:col-start-1 md:mt-[64px]"
  },
  {
    obs: "05",
    tag: "Preparation",
    time: "03:30 AM",
    primary: "I keep searching for the perfect system, perfect routine, perfect mindset, perfect architecture.",
    secondary: "Starting to realize the search itself became my comfort zone. It's hard to fail at execution when you permanently live in preparation mode.",
    bgColor: "bg-[#FAF6F1]",
    rotationClass: "md:rotate-[0.9deg]",
    className: "col-span-12 md:col-span-6 md:col-start-7 md:mt-[16px]"
  }
];

function FaiLearnNote({ 
  obs, 
  tag, 
  time, 
  primary, 
  secondary, 
  bgColor, 
  rotationClass, 
  className, 
  perspective = "deep"
}: {
  obs: string;
  tag: string;
  time: string;
  primary: string;
  secondary: string;
  bgColor: string;
  rotationClass: string;
  className?: string;
  perspective?: string;
}) {
  const capability = useDeviceCapability();
  const { isTouch, prefersReducedMotion } = capability;
  const [isExpanded, setIsExpanded] = useState(false);
  const isQuick = perspective === 'quick';

  const handleTap = () => {
    if (isTouch) {
      setIsExpanded(!isExpanded);
    }
  };

  const shouldHover = !isTouch && !prefersReducedMotion && perspective !== 'skeptical';
  const activeRotationClass = isTouch ? 'rotate-0' : rotationClass;

  const showDetail = isQuick || (isTouch ? isExpanded : true);

  return (
    <motion.div
      onTap={handleTap}
      whileHover={shouldHover ? { y: -6, scale: 1.015 } : undefined}
      animate={isTouch && isExpanded ? { scale: 1.015 } : { scale: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={`relative p-[24px] md:p-[48px] border border-[#785A3C]/10 shadow-[0_12px_36px_rgba(120,90,60,0.03),inset_0_2px_4px_rgba(255,255,255,0.7)] hover:shadow-[0_24px_50px_rgba(120,90,60,0.06),inset_0_2px_4px_rgba(255,255,255,0.95)] transition-shadow duration-[0.5s] rounded-[32px] ${bgColor} ${activeRotationClass} ${className} group cursor-pointer select-none`}
    >
      {/* Header Metadata - Soft initially, clearer on hover */}
      <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-[0.12em] text-[#8A7A6E]/65 group-hover:text-[#8A7A6E] transition-colors duration-500 mb-[20px]">
        <span>[Observation {obs}]</span>
        <div className="flex items-center gap-[8px]">
          <span className="w-[4px] h-[4px] rounded-full bg-[#8A7A6E]/40"></span>
          <span>{tag}</span>
          <span className="w-[4px] h-[4px] rounded-full bg-[#8A7A6E]/40"></span>
          <span className="font-mono">{time}</span>
        </div>
      </div>

      {/* Primary Struggle - Muted initially, Bold & Deep Dark on active/hover */}
      <h3 className={`text-[16px] md:text-[18px] font-bold leading-relaxed transition-all duration-500 ${
        (isTouch ? isExpanded : true) ? "text-[#2C2520]" : "text-[#8A7A6E]/80 group-hover:text-[#2C2520]"
      } ${showDetail ? "mb-[16px]" : "mb-0"}`}>
        {primary}
      </h3>

      <div className={`overflow-hidden transition-all duration-[0.6s] ease-[cubic-bezier(0.16,1,0.3,1)] ${
        isQuick 
          ? "max-h-[300px] opacity-100" 
          : (isTouch 
              ? (isExpanded ? "max-h-[300px] opacity-100 mt-[16px]" : "max-h-0 opacity-0")
              : "max-h-0 group-hover:max-h-[300px] opacity-0 group-hover:opacity-100")
      }`}>
        <div className="pt-[16px] border-t border-[#785A3C]/10">
          <p className="text-[14px] md:text-[15px] italic font-semibold text-[#2C2520]/80 leading-relaxed">
            {secondary}
          </p>
        </div>
      </div>

      {isTouch && !isQuick && (
        <div className="flex justify-end mt-[16px]">
          <span className="text-[9px] font-bold uppercase tracking-[0.1em] text-[#64748B]/40">
            {isExpanded ? "[ Tap to close ]" : "[ Tap to analyze ]"}
          </span>
        </div>
      )}
    </motion.div>
  );
}

function EchoFragment({ 
  content, 
  tag, 
  time, 
  floatDuration, 
  delay, 
  colorClass, 
  perspective = "deep",
  isActive,
  onToggle
}: {
  content: string;
  tag: string;
  time: string;
  floatDuration: number;
  delay: number;
  colorClass: string;
  perspective?: string;
  isActive: boolean;
  onToggle: () => void;
}) {
  const { isTouch, prefersReducedMotion } = useDeviceCapability();
  const [isHovered, setIsHovered] = useState(false);
  const isQuick = perspective === 'quick';
  const isSkeptical = perspective === 'skeptical';

  const shouldFloat = !isQuick && !isSkeptical && !isTouch && !prefersReducedMotion;
  const yAnim = shouldFloat ? (isHovered ? -12 : [0, -10, 0]) : 0;
  const xAnim = shouldFloat ? (isHovered ? 4 : [0, 6, 0]) : 0;

  const handleTap = () => {
    if (isTouch) {
      onToggle();
    }
  };

  const active = isTouch ? isActive : isHovered;

  return (
    <motion.div
      onMouseEnter={() => !isTouch && setIsHovered(true)}
      onMouseLeave={() => !isTouch && setIsHovered(false)}
      onTap={handleTap}
      animate={{
        y: yAnim,
        x: xAnim,
        scale: isTouch && isActive ? 1.015 : 1
      }}
      transition={{
        y: isHovered ? { duration: 0.6, ease: [0.22, 1, 0.36, 1] } : { duration: floatDuration, repeat: Infinity, ease: "easeInOut", delay },
        x: isHovered ? { duration: 0.6, ease: [0.22, 1, 0.36, 1] } : { duration: floatDuration * 1.2, repeat: Infinity, ease: "easeInOut", delay },
        scale: { type: "spring", stiffness: 350, damping: 25 }
      }}
      style={{ cursor: "pointer" }}
      className={`relative p-[24px] md:p-[32px] border border-white/20 bg-white/5 backdrop-blur-[2px] shadow-[0_4px_24px_rgba(0,0,0,0.02)] rounded-[32px] transition-all duration-[0.8s] cubic-bezier(0.22,1,0.36,1) ${colorClass} group`}
    >
      <div className={`absolute inset-0 -z-10 rounded-[32px] bg-gradient-to-tr from-[#EEF4FF]/10 to-[#F5F1FF]/10 blur-xl transition-opacity duration-700 pointer-events-none ${
        active ? "opacity-100" : "opacity-0"
      }`}></div>

      <motion.div
        animate={
          isTouch
            ? (isActive ? { opacity: 1, filter: "blur(0px)" } : { opacity: 0.55, filter: "blur(1.5px)" })
            : (isHovered ? { opacity: 1, filter: "blur(0px)" } : { opacity: [0.35, 0.5, 0.35], filter: ["blur(0.5px)", "blur(1.2px)", "blur(0.5px)"] })
        }
        transition={active ? { duration: 0.4 } : { duration: floatDuration * 1.5, repeat: Infinity, ease: "easeInOut", delay }}
        className="flex flex-col gap-[12px]"
      >
        <div className={`flex items-center justify-between text-[9px] font-bold uppercase tracking-[0.15em] transition-colors duration-500 ${
          active ? "text-[#64748B]/90" : "text-[#64748B]/60"
        }`}>
          <span>[Echo]</span>
          <div className="flex items-center gap-[6px]">
            <span>{tag}</span>
            <span className="w-[3px] h-[3px] rounded-full bg-[#64748B]/30"></span>
            <span className="font-mono">{time}</span>
          </div>
        </div>

        <p className={`text-[14px] md:text-[15px] font-semibold leading-relaxed transition-colors duration-500 ${
          active ? "text-[#0F172A]" : "text-[#64748B]"
        }`}>
          {content}
        </p>
      </motion.div>
    </motion.div>
  );
}

export function MainLayout() {
  const [perspective, setPerspective] = useState("curious");
  const [activeEchoIndex, setActiveEchoIndex] = useState<number | null>(null);
  const [resumeOpen, setResumeOpen] = useState(false);
  const { isTouch, prefersReducedMotion } = useDeviceCapability();

  const renderAbout = () => (
    <Section 
      id="about" 
      title="About"
      className={perspective === 'quick' ? 'mb-[56px] md:mb-[64px]' : 'mb-[96px] md:mb-[128px]'}
    >
      <div className="pt-[140px] md:pt-[180px] pb-[40px] md:pb-[80px]">
        <FloatingCognitiveSpace 
          perspective={perspective}
        />
      </div>
    </Section>
  );

  const renderExperiments = () => (
    <Section 
      id="experiments" 
      title="Experiments"
      className={perspective === 'quick' ? 'mb-[56px] md:mb-[64px]' : 'mb-[96px] md:mb-[128px]'}
    >
      <div className={`grid grid-cols-12 transition-all duration-500 ${
        perspective === 'quick' ? 'gap-[20px] md:gap-[24px]' : 'gap-[32px] md:gap-[48px]'
      }`}>
        {EXPERIMENTS.map((exp) => (
          <div key={exp.title} className={exp.className}>
            <CognitiveObject
              perspective={perspective}
              bgColor={exp.bgColor}
              borderRadius={exp.borderRadius}
              className="h-full"
            >
              <div className={`flex flex-col h-full justify-between transition-all duration-500 ${
                perspective === 'quick' ? 'gap-[16px]' : 'gap-[24px]'
              }`}>
                
                {/* Top Header & Subtitle */}
                <div>
                  <div className="flex items-center justify-between gap-[16px] mb-[8px]">
                    <h3 className={`font-black text-[#0F172A] leading-tight transition-all duration-500 ${
                      perspective === 'quick' ? 'text-[18px] md:text-[20px]' : 'text-[20px] md:text-[24px]'
                    }`}>
                      {exp.title}
                    </h3>
                    {exp.link && (
                      <span className="px-[10px] py-[4px] rounded-full bg-[#3B82F6]/10 text-[#3B82F6] text-[10px] font-bold uppercase tracking-wider">
                        Live
                      </span>
                    )}
                  </div>
                  <p className="text-micro text-[#64748B] mb-[16px] font-semibold">
                    {exp.subtitle}
                  </p>
                  <p className={`text-[#475569] leading-relaxed transition-all duration-500 ${
                    perspective === 'quick' ? 'text-[13px] md:text-[14px] mb-[12px]' : 'text-[14px] md:text-[16px] mb-[20px]'
                  }`}>
                    {exp.description}
                  </p>
                  {/* Pillars Dashboard */}
                  {exp.pillars && exp.pillars.length > 0 && (
                    <div className={`flex flex-col transition-all duration-500 ${
                      perspective === 'quick' ? 'gap-[12px] mb-[16px] mt-[8px]' : 'gap-[20px] mb-[28px] mt-[16px]'
                    }`}>
                      {exp.pillars.map((pillar, idx) => {
                        const PillarIcon = pillar.icon;
                        return (
                          <div key={idx} className="flex items-start gap-[16px] group/pillar">
                            {/* Glowing Icon Container */}
                            <div className={`flex-shrink-0 rounded-[12px] bg-white/70 border border-white flex items-center justify-center shadow-sm group-hover/pillar:scale-110 group-hover/pillar:border-[#3B82F6]/50 transition-all duration-[0.4s] ease-[cubic-bezier(0.16,1,0.3,1)] ${
                              perspective === 'quick' ? 'w-[32px] h-[32px]' : 'w-[40px] h-[40px]'
                            }`}>
                              <PillarIcon size={perspective === 'quick' ? 14 : 18} className="text-[#3B82F6] drop-shadow-[0_0_8px_rgba(59,130,246,0.2)]" strokeWidth={2} />
                            </div>
                            {/* Text Info */}
                            <div className="flex flex-col gap-[2px]">
                              <span className={`font-black text-[#0F172A] tracking-wide leading-tight group-hover/pillar:text-[#3B82F6] transition-colors duration-300 ${
                                perspective === 'quick' ? 'text-[13px]' : 'text-[14px] md:text-[15px]'
                              }`}>
                                {pillar.label}
                              </span>
                              <span className={`text-[#64748B] leading-snug ${
                                perspective === 'quick' ? 'text-[11px]' : 'text-[12px] md:text-[13px]'
                              }`}>
                                {pillar.desc}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Bottom Tech Tags & Links */}
                <div className="flex flex-col gap-[20px] mt-auto">
                  {/* Tech Stack Tags */}
                  <div className="flex flex-wrap gap-[6px]">
                    {exp.tags.map((tag) => (
                      <span 
                        key={tag} 
                        className={`rounded-full bg-white/60 border border-white text-[#475569] font-medium shadow-sm hover:scale-105 transition-all duration-200 ${
                          perspective === 'quick' ? 'text-[9px] px-[8px] py-[4px]' : 'px-[12px] py-[6px] text-[11px]'
                        }`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Action Link */}
                  {exp.link ? (
                    <a 
                      href={exp.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-[8px] text-[12px] font-bold uppercase tracking-[0.1em] text-[#3B82F6] hover:text-[#2563EB] transition-colors group/link mt-[8px]"
                    >
                      Explore Live
                      <MoveRight size={14} className="transform group-hover/link:translate-x-2 transition-transform duration-300" />
                    </a>
                  ) : (
                    <span className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-[0.1em] mt-[8px]">
                      System Experiment
                    </span>
                  )}
                </div>

              </div>
            </CognitiveObject>
          </div>
        ))}
      </div>
    </Section>
  );

  const renderFaiLearns = () => (
    <Section 
      id="fragments" 
      title="FaiLearns"
      className={perspective === 'quick' ? 'mb-[56px] md:mb-[64px]' : 'mb-[96px] md:mb-[128px]'}
    >
      <div className="relative w-full py-[16px]">
        {!(isTouch || prefersReducedMotion) && (
          <div className="absolute inset-0 -z-10 bg-radial from-[#F7EBDD]/15 via-transparent to-transparent pointer-events-none blur-3xl"></div>
        )}
        
        <div className={`grid grid-cols-12 items-start transition-all duration-500 ${
          perspective === 'quick' ? 'gap-[20px] md:gap-[24px]' : 'gap-[32px] md:gap-[48px]'
        }`}>
          {(isTouch ? FAILEARNS.slice(0, 3) : FAILEARNS).map((item) => (
            <div key={item.obs} className={item.className}>
              <FaiLearnNote 
                obs={item.obs}
                tag={item.tag}
                time={item.time}
                primary={item.primary}
                secondary={item.secondary}
                bgColor={item.bgColor}
                rotationClass={item.rotationClass}
                className={item.className}
                perspective={perspective}
              />
            </div>
          ))}
        </div>
      </div>
    </Section>
  );

  const renderEchoes = () => {
    const disableAtmosphere = isTouch || prefersReducedMotion || perspective === 'skeptical' || perspective === 'quick';
    return (
      <Section 
        id="signals" 
        title="Echoes"
        className={perspective === 'quick' ? 'mb-[56px] md:mb-[64px]' : 'mb-[96px] md:mb-[128px]'}
      >
        <div className={`relative w-full overflow-visible transition-all duration-500 ${
          isTouch ? 'py-[16px] min-h-0' : 'py-[64px] min-h-[900px]'
        }`}>
          {/* Soft, cool misty atmospheric fog patches - Hidden on Touch / Skeptical / Quick / Reduced Motion */}
          {!disableAtmosphere && (
            <>
              <div className="absolute top-[10%] left-[5%] w-[350px] h-[350px] -z-10 rounded-full bg-radial from-[#EEF4FF]/20 to-transparent pointer-events-none blur-[100px] animate-pulse" style={{ animationDuration: '10s' }}></div>
              <div className="absolute bottom-[20%] right-[5%] w-[400px] h-[400px] -z-10 rounded-full bg-radial from-[#F5F1FF]/15 to-transparent pointer-events-none blur-[120px] animate-pulse" style={{ animationDuration: '14s' }}></div>
              <div className="absolute top-[40%] left-[40%] w-[300px] h-[300px] -z-10 rounded-full bg-radial from-[#EEF4FF]/15 to-transparent pointer-events-none blur-[90px] animate-pulse" style={{ animationDuration: '12s' }}></div>
            </>
          )}

          {/* Faint falling dust particles - Hidden on Touch / Skeptical / Quick / Reduced Motion */}
          {!disableAtmosphere && (
            <div className="absolute inset-0 -z-10 pointer-events-none opacity-20 overflow-hidden">
              <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <circle cx="10%" cy="15%" r="1" fill="#3B82F6" className="animate-ping" style={{ animationDuration: '8s' }} />
                <circle cx="85%" cy="30%" r="1.5" fill="#3B82F6" className="animate-ping" style={{ animationDuration: '11s' }} />
                <circle cx="35%" cy="75%" r="1" fill="#8B5CF6" className="animate-ping" style={{ animationDuration: '9s' }} />
                <circle cx="70%" cy="80%" r="1.2" fill="#3B82F6" className="animate-ping" style={{ animationDuration: '13s' }} />
              </svg>
            </div>
          )}

          {/* Scattered asymmetrical thought array grid layout */}
          <div className="grid grid-cols-12 gap-y-[24px] md:gap-y-[80px] items-start relative z-10">
            
            {/* Echo 1: Human Control */}
            <div className="col-span-12 md:col-span-5 md:translate-x-[16px]">
              <EchoFragment 
                perspective={perspective}
                content="Humans love acting civilized until life removes comfort for five minutes. Then suddenly the software update fails and the factory settings return."
                tag="Human Control"
                time="02:10 AM"
                floatDuration={8}
                delay={0}
                colorClass="bg-[#EEF4FF]/20 hover:bg-[#EEF4FF]/30"
                isActive={activeEchoIndex === 0}
                onToggle={() => setActiveEchoIndex(activeEchoIndex === 0 ? null : 0)}
              />
            </div>

            {/* Echo 2: Endless Searching */}
            <div className="col-span-12 md:col-span-5 md:col-start-8 md:translate-y-[48px]">
              <EchoFragment 
                perspective={perspective}
                content="I keep searching for ‘the thing’ that will finally make life feel complete. Starting to suspect humans survive mostly on unfinished searches."
                tag="Searching"
                time="03:40 AM"
                floatDuration={9.5}
                delay={1.5}
                colorClass="bg-[#F3F6FB]/20 hover:bg-[#F3F6FB]/30"
                isActive={activeEchoIndex === 1}
                onToggle={() => setActiveEchoIndex(activeEchoIndex === 1 ? null : 1)}
              />
            </div>

            {/* Echo 3: Consciousness */}
            <div className="col-span-12 md:col-span-6 md:col-start-3 md:translate-y-[16px]">
              <EchoFragment 
                perspective={perspective}
                content="Consciousness is weird. Somehow the universe evolved enough to start asking itself why it exists, then gave itself exams and anxiety."
                tag="Consciousness"
                time="11:55 PM"
                floatDuration={7}
                delay={0.5}
                colorClass="bg-[#F5F1FF]/25 hover:bg-[#F5F1FF]/35"
                isActive={activeEchoIndex === 2}
                onToggle={() => setActiveEchoIndex(activeEchoIndex === 2 ? null : 2)}
              />
            </div>

            {/* Echo 4: Human Selfishness */}
            <div className="hidden md:block col-span-12 md:col-span-5 md:col-start-1 md:translate-y-[64px]">
              <EchoFragment 
                perspective={perspective}
                content="People hide selfishness like it’s evil. Meanwhile almost every important decision quietly asks: ‘Yeah, but what do I get from this?’"
                tag="Selfishness"
                time="01:15 AM"
                floatDuration={11}
                delay={2.2}
                colorClass="bg-[#F8FAFC]/30 hover:bg-[#F8FAFC]/40"
                isActive={activeEchoIndex === 3}
                onToggle={() => setActiveEchoIndex(activeEchoIndex === 3 ? null : 3)}
              />
            </div>

            {/* Echo 5: Adulthood & Certainty */}
            <div className="hidden md:block col-span-12 md:col-span-5 md:col-start-8 md:-translate-y-[32px]">
              <EchoFragment 
                perspective={perspective}
                content="I think half of adulthood is confidently saying ‘makes sense’ while internally running a full system crash."
                tag="Pretending"
                time="12:45 AM"
                floatDuration={8.5}
                delay={1}
                colorClass="bg-[#EEF4FF]/20 hover:bg-[#EEF4FF]/30"
                isActive={activeEchoIndex === 4}
                onToggle={() => setActiveEchoIndex(activeEchoIndex === 4 ? null : 4)}
              />
            </div>

            {/* Echo 6: Truth vs Comfort */}
            <div className="hidden md:block col-span-12 md:col-span-7 md:col-start-3 md:translate-y-[48px]">
              <EchoFragment 
                perspective={perspective}
                content="Most people don’t actually hate lies. They just hate lies that disturb the version of reality they already got emotionally attached to."
                tag="Truth vs Comfort"
                time="02:30 AM"
                floatDuration={10}
                delay={0.8}
                colorClass="bg-[#F3F6FB]/25 hover:bg-[#F3F6FB]/35"
                isActive={activeEchoIndex === 5}
                onToggle={() => setActiveEchoIndex(activeEchoIndex === 5 ? null : 5)}
              />
            </div>

            {/* Echo 7: Emotional Contradictions */}
            <div className="hidden md:block col-span-12 md:col-span-5 md:col-start-1 md:translate-y-[32px]">
              <EchoFragment 
                perspective={perspective}
                content="Humans say they want peace, then create chaos the second life becomes emotionally too quiet."
                tag="Chaos Trap"
                time="04:05 AM"
                floatDuration={9}
                delay={3}
                colorClass="bg-[#F5F1FF]/20 hover:bg-[#F5F1FF]/30"
                isActive={activeEchoIndex === 6}
                onToggle={() => setActiveEchoIndex(activeEchoIndex === 6 ? null : 6)}
              />
            </div>

            {/* Echo 8: Awareness */}
            <div className="hidden md:block col-span-12 md:col-span-5 md:col-start-7 md:translate-y-[16px]">
              <EchoFragment 
                perspective={perspective}
                content="The scary thing about self-awareness is once you notice your own patterns, you start catching yourself mid-destruction like a spectator with live commentary."
                tag="Awareness"
                time="03:15 AM"
                floatDuration={10.5}
                delay={1.8}
                colorClass="bg-[#F8FAFC]/30 hover:bg-[#F8FAFC]/40"
                isActive={activeEchoIndex === 7}
                onToggle={() => setActiveEchoIndex(activeEchoIndex === 7 ? null : 7)}
              />
            </div>

          </div>
        </div>
      </Section>
    );
  };

  const renderContact = () => {
    const isSkeptical = perspective === 'skeptical';

    const cardSpring = { type: "spring" as const, stiffness: 300, damping: 25 };

    const GithubIcon = ({ size = 16, className = "" }: { size?: number, className?: string }) => (
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width={size} 
        height={size} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2.2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className={className}
      >
        <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
        <path d="M9 18c-4.51 2-5-2-7-2" />
      </svg>
    );

    const LinkedinIcon = ({ size = 16, className = "" }: { size?: number, className?: string }) => (
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width={size} 
        height={size} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2.2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className={className}
      >
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect width="4" height="12" x="2" y="9" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    );

    const WhatsappIcon = ({ size = 16, className = "" }: { size?: number, className?: string }) => (
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width={size} 
        height={size} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2.2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className={className}
      >
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
      </svg>
    );

    const contacts = [
      {
        id: "email",
        label: "Email",
        value: "gsudhasagar2006@gmail.com",
        href: "mailto:gsudhasagar2006@gmail.com",
        icon: Mail,
        action: null
      },
      {
        id: "whatsapp",
        label: "WhatsApp",
        value: "+91 7997480180",
        href: "https://wa.me/917997480180",
        icon: WhatsappIcon,
        action: null
      },
      {
        id: "linkedin",
        label: "LinkedIn",
        value: "sudha-sagar-9a0739332",
        href: "https://www.linkedin.com/in/sudha-sagar-9a0739332/",
        icon: LinkedinIcon,
        action: null
      },
      {
        id: "github",
        label: "GitHub",
        value: "sudha-sagar",
        href: "https://github.com/sudha-sagar",
        icon: GithubIcon,
        action: null
      },
      {
        id: "resume",
        label: "Resume Archive",
        value: "Interactive Resume",
        href: "#",
        icon: FileText,
        action: () => setResumeOpen(true)
      }
    ];

    return (
      <Section id="contact" title="Connect" className="relative overflow-visible py-8">
        
        {/* Soft atmospheric blurred backing glow - Pearl cyan/gray - Hidden on touch/reduced motion */}
        {!(isTouch || prefersReducedMotion) && (
          <div className="absolute top-[20%] left-[25%] w-[450px] h-[350px] -z-10 rounded-full bg-radial from-[#3B82F6]/5 via-transparent to-transparent pointer-events-none blur-[110px]" />
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-[32px] lg:gap-[64px] items-start relative z-10">
          
          {/* Left Column: Calm Statement & Status Block */}
          <div className="lg:col-span-6 flex flex-col gap-[32px] text-left">
            <div>
              <h2 className="text-[32px] md:text-[40px] font-black text-[#0F172A] leading-tight tracking-tight mb-[16px]">
                Let’s build something meaningful.
              </h2>
              <p className="text-[16px] md:text-[18px] text-[#475569] leading-relaxed max-w-lg">
                I enjoy conversations around systems, design, engineering, psychology, and thoughtful digital experiences.
              </p>
            </div>

            {/* Currently Live Status Block */}
            <div className="inline-flex self-start items-center gap-[16px] px-[20px] py-[12px] rounded-[18px] bg-white/70 border border-slate-100 shadow-[0_2px_12px_rgba(15,23,42,0.01)] backdrop-blur-md">
              <div className="relative flex items-center justify-center w-2.5 h-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </div>
              <div className="flex flex-col gap-[1px]">
                <span className="text-[9px] text-[#94A3B8] font-bold uppercase tracking-widest">
                  Currently
                </span>
                <span className="text-[12.5px] font-semibold text-[#475569]">
                  Exploring interface psychology & building experimental systems
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Premium Tactile Communication Cards */}
          <div className="lg:col-span-6 flex flex-col gap-[16px] w-full">
            {contacts.map((item) => {
              const IconComponent = item.icon;
              const isResume = item.id === "resume";

              return (
                <motion.div
                  key={item.id}
                  onClick={(e) => {
                    if (item.action) {
                      e.preventDefault();
                      item.action();
                    }
                  }}
                  whileHover={isTouch || isSkeptical ? undefined : { y: -4, boxShadow: "0 8px 30px rgba(15,23,42,0.04)" }}
                  whileTap={{ scale: 0.98 }}
                  transition={cardSpring}
                  className="w-full cursor-pointer touch-manipulation select-none"
                >
                  {isResume ? (
                    <div className="flex items-center justify-between p-[20px] md:p-[24px] bg-white/80 border border-slate-200/80 hover:border-slate-300 hover:bg-white rounded-[24px] transition-colors duration-300 shadow-[0_4px_20px_rgba(15,23,42,0.01)] group">
                      <div className="flex items-center gap-[20px]">
                        <div className="w-[44px] h-[44px] rounded-[16px] bg-slate-50 border border-slate-100 flex items-center justify-center text-[#64748B] group-hover:text-[#3B82F6] transition-colors duration-300">
                          <IconComponent size={20} />
                        </div>
                        <div className="text-left flex flex-col">
                          <span className="text-[10px] text-[#94A3B8] font-bold uppercase tracking-wider mb-[2px]">
                            {item.label}
                          </span>
                          <span className="text-[14.5px] font-semibold text-[#0F172A] group-hover:text-[#3B82F6] transition-colors duration-300">
                            {item.value}
                          </span>
                        </div>
                      </div>
                      <div className="text-[#94A3B8] group-hover:text-[#3B82F6] transform group-hover:translate-x-1 transition-all duration-300">
                        <MoveRight size={16} />
                      </div>
                    </div>
                  ) : (
                    <a
                      href={item.href}
                      target={item.id === "email" ? "_self" : "_blank"}
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-[20px] md:p-[24px] bg-white/80 border border-slate-200/80 hover:border-slate-300 hover:bg-white rounded-[24px] transition-colors duration-300 shadow-[0_4px_20px_rgba(15,23,42,0.01)] group"
                    >
                      <div className="flex items-center gap-[20px]">
                        <div className="w-[44px] h-[44px] rounded-[16px] bg-slate-50 border border-slate-100 flex items-center justify-center text-[#64748B] group-hover:text-[#3B82F6] transition-colors duration-300">
                          <IconComponent size={20} />
                        </div>
                        <div className="text-left flex flex-col">
                          <span className="text-[10px] text-[#94A3B8] font-bold uppercase tracking-wider mb-[2px]">
                            {item.label}
                          </span>
                          <span className="text-[14.5px] font-semibold text-[#0F172A] group-hover:text-[#3B82F6] transition-colors duration-300">
                            {item.value}
                          </span>
                        </div>
                      </div>
                      <div className="text-[#94A3B8] group-hover:text-[#3B82F6] transform group-hover:translate-x-1 transition-all duration-300">
                        <MoveRight size={16} />
                      </div>
                    </a>
                  )}
                </motion.div>
              );
            })}
          </div>

        </div>

      </Section>
    );
  };

  return (
    <div className="w-full">
      
      {/* Hero Section */}
      <section className={`transition-all duration-[0.8s] ease-[cubic-bezier(0.16,1,0.3,1)] grid grid-cols-1 lg:grid-cols-12 gap-[32px] md:gap-[48px] items-center lg:items-start lg:-mt-4 ${
        perspective === 'quick' ? 'mb-[56px] md:mb-[64px]' : 'mb-[96px] md:mb-[128px]'
      }`}>
        {/* Hero Anchor 3D Avatar (Moved to Left) */}
        <div className="lg:col-span-5 relative w-full h-[380px] sm:h-[480px] md:h-[600px] rounded-[40px] overflow-visible bg-[#FFFFFF] border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.03)] z-20">
          <AvatarWidget perspective={perspective} />
          <ResumeArchive perspective={perspective} isOpen={resumeOpen} setIsOpen={setResumeOpen} isTouch={isTouch} />
        </div>

        <div className="lg:col-span-7 relative z-10 self-center lg:translate-y-[-44px] transition-all duration-[0.8s] ease-[cubic-bezier(0.16,1,0.3,1)]">
          <h1 className="heading-hero mb-[16px]">
            I build <span className="text-[#64748B] italic">calm</span> systems, <br />
            and occasionally break them.
          </h1>
          <p className="max-w-2xl text-[15.5px] text-[#475569] leading-relaxed mb-4 hidden md:block">
            A digital craftsman focused on minimalism, robust engineering, and intentional design. 
            Currently exploring the intersection of psychology and interfaces.
          </p>

          {/* Perspective Selection System */}
          <div className="mt-6 pt-5 border-t border-slate-100/80 flex flex-col gap-4 select-none max-w-xl">
            <div className="flex flex-col gap-1 text-left">
              <span className="text-[10px] font-black tracking-[0.25em] text-[#94A3B8] uppercase">
                Perspective Selection System
              </span>
              <h3 className="text-[14px] font-bold text-[#0F172A]">
                How are you entering this space?
              </h3>
            </div>

            {/* Premium Pill Select Bar */}
            <div className="flex flex-wrap gap-1.5 p-1 bg-[#F1F5F9]/60 backdrop-blur-md rounded-2xl border border-slate-200/50 self-start">
              {(["quick", "curious", "skeptical"] as const).map((mode) => {
                const isActive = perspective === mode;
                const labels = {
                  quick: "Quick Scan",
                  curious: "Curious (Default)",
                  skeptical: "Skeptical"
                };
                return (
                  <button
                    key={mode}
                    onClick={() => setPerspective(mode)}
                    className="relative px-[16px] py-[12px] md:py-[8px] rounded-xl text-[11px] font-black uppercase tracking-wider transition-all duration-300 focus:outline-none touch-manipulation select-none"
                  >
                    {/* Smooth background sliding indicator */}
                    {isActive && (
                      <motion.div
                        layoutId="activePerspectiveIndicator"
                        className="absolute inset-0 rounded-xl bg-white border border-slate-200 shadow-[0_4px_12px_rgba(15,23,42,0.05),inset_0_1px_1.5px_rgba(255,255,255,0.95)] z-0"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                    
                    {/* Button text */}
                    <span className={`relative z-10 transition-colors duration-300 ${
                      isActive 
                        ? "text-slate-800" 
                        : "text-slate-400 hover:text-slate-600"
                    }`}>
                      {labels[mode]}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Dynamic Perspective Details Box */}
            <div className="hidden md:flex min-h-[64px] items-start gap-3.5 p-[14px] bg-white/70 border border-slate-100 rounded-[20px] shadow-[0_4px_20px_rgba(15,23,42,0.015)] backdrop-blur-md">
              {/* Dynamic blinking active dot */}
              <div className="relative flex items-center justify-center w-2 h-2 mt-1.5 flex-shrink-0">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-60 ${
                  perspective === 'quick' ? 'bg-emerald-400' : (perspective === 'skeptical' ? 'bg-slate-400' : 'bg-blue-400')
                }`}></span>
                <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${
                  perspective === 'quick' ? 'bg-emerald-500' : (perspective === 'skeptical' ? 'bg-slate-500' : 'bg-blue-500')
                }`}></span>
              </div>

              <div className="flex flex-col gap-1 text-left">
                <AnimatePresence mode="wait">
                  {perspective === 'quick' && (
                    <motion.div
                      key="quick-info"
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.25 }}
                    >
                      <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest block mb-0.5">
                        Efficiency Prioritized • Compact Layout
                      </span>
                      <p className="text-[12.5px] leading-relaxed text-[#475569]">
                        Rearranges sections to display About, Experiments, and a direct Contact bar first. Compresses spacing and Bento elements by 40% for rapid parsing.
                      </p>
                    </motion.div>
                  )}
                  
                  {perspective === 'curious' && (
                    <motion.div
                      key="curious-info"
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.25 }}
                    >
                      <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest block mb-0.5">
                        Spatial Exploration • Full Experience
                      </span>
                      <p className="text-[12.5px] leading-relaxed text-[#475569]">
                        A rich interactive cognitive playground. Supports fully floating 3D parallax, layered cards holding philosophical realizations, and generous layout spacing.
                      </p>
                    </motion.div>
                  )}

                  {perspective === 'skeptical' && (
                    <motion.div
                      key="skeptical-info"
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.25 }}
                    >
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-0.5">
                        Direct Workspace • Zero Illusion
                      </span>
                      <p className="text-[12.5px] leading-relaxed text-[#475569]">
                        Strips out floating 3D translations, fogs, and coordinate tilts. Prioritizes raw learning and anomaly logs upfront, presenting direct code signatures without aesthetic distraction.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Dynamic Prioritization Section Render Grid */}
      {perspective === "quick" && (
        <>
          {renderAbout()}
          {renderExperiments()}
          {renderContact()}
          {renderFaiLearns()}
          {renderEchoes()}
        </>
      )}

      {perspective === "skeptical" && (
        <>
          {renderAbout()}
          {renderFaiLearns()}
          {renderEchoes()}
          {renderContact()}
          {renderExperiments()}
        </>
      )}

      {perspective === "curious" && (
        <>
          {renderAbout()}
          {renderExperiments()}
          {renderFaiLearns()}
          {renderEchoes()}
          {renderContact()}
        </>
      )}

      {/* Dynamic final concluding ending signature block */}
      <div className="text-center mt-24 pb-8 border-t border-slate-100/50 pt-12">
        <span className="text-[10.5px] font-bold tracking-[0.25em] text-[#94A3B8] uppercase">
          Still learning. Still building.
        </span>
      </div>

    </div>
  );
}
