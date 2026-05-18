import React, { Suspense, useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Environment, ContactShadows } from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
import { User, FlaskConical, Grid, Radio, Mail } from "lucide-react";
import * as THREE from "three";

// Reusable Model component with support for dynamic GLB path and colors
function Model({ 
  modelPath, 
  proximity, 
  hoveredItem, 
  positionY 
}: { 
  modelPath: string, 
  proximity: number, 
  hoveredItem: string | null, 
  positionY: number
}) {
  const { scene } = useGLTF(modelPath, true);
  const ref = useRef<THREE.Group>(null);
  const skinMaterialsRef = useRef<THREE.MeshStandardMaterial[]>([]);
  const otherMaterialsRef = useRef<THREE.MeshStandardMaterial[]>([]);
  
  useEffect(() => {
    skinMaterialsRef.current = [];
    otherMaterialsRef.current = [];
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        const material = mesh.material as THREE.MeshStandardMaterial;
        if (material) {
          material.transparent = true;
          const name = (mesh.name + " " + material.name).toLowerCase();
          if (name.includes("skin") || name.includes("head") || name.includes("face") || name.includes("body")) {
            skinMaterialsRef.current.push(material);
          } else {
            otherMaterialsRef.current.push(material);
          }
        }
      }
    });
  }, [scene]);

  useFrame((state) => {
    if (ref.current) {
      // Subtle breathing motion
      ref.current.position.y = positionY + Math.sin(state.clock.elapsedTime) * 0.02;
      
      // Scale increases organically with proximity, but restrained
      const targetScale = 1.35 + proximity * 0.08;
      ref.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.05);
      
      // Minimal parallax rotation influenced by pointer and proximity
      const targetRotationX = proximity > 0 ? -(state.pointer.y * Math.PI) / 16 * proximity : 0;
      const targetRotationY = proximity > 0 ? -(state.pointer.x * Math.PI) / 12 * proximity : 0;
      ref.current.rotation.x += (targetRotationX - ref.current.rotation.x) * 0.05;
      ref.current.rotation.y += (targetRotationY - ref.current.rotation.y) * 0.05;
    }

    // Calm, light-themed material states
    const targetColor = new THREE.Color(0xF1F5F9);
    let targetMetalness = 0.1;
    let targetRoughness = 0.8;
    let targetOpacity = 1.0;

    if (hoveredItem) {
      targetColor.setHex(0xE2E8F0);
      targetRoughness = 0.6;
    }

    const skinColor = hoveredItem ? targetColor : new THREE.Color(0xFDE7D6);
    const otherColor = hoveredItem ? targetColor : new THREE.Color(0xF8FAFC);

    skinMaterialsRef.current.forEach((mat) => {
      mat.color.lerp(skinColor, 0.1);
      mat.opacity += (targetOpacity - mat.opacity) * 0.1;
      mat.metalness += (targetMetalness - mat.metalness) * 0.1;
      mat.roughness += (targetRoughness - mat.roughness) * 0.1;
    });

    otherMaterialsRef.current.forEach((mat) => {
      mat.color.lerp(otherColor, 0.1);
      mat.opacity += (targetOpacity - mat.opacity) * 0.1;
      mat.metalness += (targetMetalness - mat.metalness) * 0.1;
      mat.roughness += (targetRoughness - mat.roughness) * 0.1;
    });
  });

  return <primitive object={scene} ref={ref} position={[0, positionY, 0]} />;
}

function Fallback() {
  return (
    <mesh>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial color="#E2E8F0" wireframe />
    </mesh>
  );
}

// Orbital positions for navigation items (light minimal styling)
const navItems = [
  { id: "about", icon: User, label: "About", x: 140, y: -100, color: "group-hover:text-[#0F172A] group-hover:bg-[#F8FAFC] group-hover:border-[#94A3B8]/20 group-hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)]", textShadow: "group-hover:text-[#0F172A]" },
  { id: "experiments", icon: FlaskConical, label: "Experiments", x: 180, y: -20, color: "group-hover:text-[#3B82F6] group-hover:bg-[#EFF6FF] group-hover:border-[#BFDBFE] group-hover:shadow-[0_4px_12px_rgba(59,130,246,0.1)]", textShadow: "group-hover:text-[#3B82F6]" },
  { id: "fragments", icon: Grid, label: "FaiLearns", x: 180, y: 70, color: "group-hover:text-[#0F172A] group-hover:bg-[#F8FAFC] group-hover:border-[#94A3B8]/20 group-hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)]", textShadow: "group-hover:text-[#0F172A]" },
  { id: "signals", icon: Radio, label: "Echoes", x: 140, y: 150, color: "group-hover:text-[#0F172A] group-hover:bg-[#F8FAFC] group-hover:border-[#94A3B8]/20 group-hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)]", textShadow: "group-hover:text-[#0F172A]" },
  { id: "contact", icon: Mail, label: "Contact", x: 60, y: 200, color: "group-hover:text-[#0F172A] group-hover:bg-[#F8FAFC] group-hover:border-[#94A3B8]/20 group-hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)]", textShadow: "group-hover:text-[#0F172A]" },
];

export function AvatarWidget({ perspective = "curious" }: { perspective?: string }) {
  const [proximity, setProximity] = useState(0);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [isTouch, setIsTouch] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState(false);

  useEffect(() => {
    const checkTouch = () => {
      setIsTouch(window.matchMedia("(hover: none) and (pointer: coarse)").matches);
    };
    checkTouch();
    window.addEventListener("resize", checkTouch);
    return () => window.removeEventListener("resize", checkTouch);
  }, []);

  const isQuick = perspective === 'quick';
  const isSkeptical = perspective === 'skeptical';
  const isCurious = perspective === 'curious';

  let targetOpacity = 0.65 + proximity * 0.2;
  let targetScale = 0.95 + proximity * 0.1;
  let targetFilter = "blur(80px)";

  if (isQuick) {
    targetOpacity = 0.08;
    targetScale = 0.92;
    targetFilter = "blur(60px)";
  } else if (isSkeptical) {
    targetOpacity = 0.15;
    targetScale = 0.94;
    targetFilter = "blur(70px)";
  }

  const hoverScale = isCurious ? 1.12 : 1.05;
  const tapScale = isCurious ? 0.90 : 0.95;

  const handlePointerMove = (e: React.PointerEvent) => {
    if (isTouch) return;
    const rect = e.currentTarget.getBoundingClientRect();
    
    // Shift visual center math to match exact positioning coordinates: left-[38%] top-[28%]
    const centerX = rect.width * 0.38;
    const centerY = rect.height * 0.28;
    
    // Distance to visual center (Avatar)
    const dxCenter = e.clientX - rect.left - centerX;
    const dyCenter = e.clientY - rect.top - centerY;
    const distCenter = Math.sqrt(dxCenter * dxCenter + dyCenter * dyCenter);
    
    // Check distance to the avatar center OR any emerging orbital icons
    let minDistance = distCenter;

    // Use current proximity to calculate where icons are right now, so the mouse can trace them out
    navItems.forEach((item) => {
      const displayX = item.x * Math.min(1, proximity * 1.5);
      const displayY = item.y * Math.min(1, proximity * 1.5);
      
      const itemX = centerX + displayX;
      const itemY = centerY + displayY;
      
      const dxItem = e.clientX - rect.left - itemX;
      const dyItem = e.clientY - rect.top - itemY;
      const distItem = Math.sqrt(dxItem * dxItem + dyItem * dyItem);
      
      if (distItem < minDistance) {
        minDistance = distItem;
      }
    });
    
    // Increase active distance radius threshold from 400 to 520 to make the contracting zone highly generous and comfortable
    const maxDistance = 520;
    const newProx = Math.max(0, 1 - minDistance / maxDistance);
    
    setProximity(newProx);
  };

  const handlePointerLeave = () => {
    if (isTouch) return;
    setProximity(0);
  };

  const handleModelTap = (e: React.MouseEvent) => {
    if (!isTouch) return;
    e.stopPropagation();
    const nextState = !mobileExpanded;
    setMobileExpanded(nextState);
    setProximity(nextState ? 1 : 0);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      <div 
        className="relative flex flex-col items-center justify-center w-full min-h-[600px]"
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
      >
        {/* Navigation Icons Reveal */}
        <AnimatePresence>
          {proximity > 0.05 && navItems.map((item) => {
            const Icon = item.icon;
            // Interpolate position based on proximity so they organically emerge
            const displayX = item.x * Math.min(1, proximity * 1.5);
            const displayY = item.y * Math.min(1, proximity * 1.5);

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: 0, y: 0, scale: 0.8 }}
                animate={{ opacity: Math.min(1, proximity * 2), x: displayX, y: displayY, scale: 1 }}
                exit={{ opacity: 0, x: 0, y: 0, scale: 0.8 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
                onClick={() => {
                  document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' });
                  if (isTouch) {
                    setMobileExpanded(false);
                    setProximity(0);
                  }
                }}
                className="absolute left-[38%] top-[28%] -ml-6 -mt-6 w-12 h-12 flex flex-col items-center justify-center gap-1 cursor-pointer group z-30"
              >
                <motion.div 
                  whileHover={{ scale: hoverScale }}
                  whileTap={{ scale: tapScale }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  className={`w-10 h-10 rounded-full bg-[#FFFFFF]/80 backdrop-blur-md border border-[#94A3B8]/20 shadow-sm flex items-center justify-center text-[#64748B] transition-all duration-[0.3s] ease-[cubic-bezier(0.22,1,0.36,1)] ${item.color}`}
                >
                  <Icon size={16} strokeWidth={2} />
                </motion.div>
                <span className={`text-[10px] text-[#94A3B8] font-medium transition-colors duration-[0.3s] uppercase tracking-widest absolute -bottom-5 ${item.textShadow}`}>
                  {item.label}
                </span>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Transparent Touch Overlay for Mobile/Touch Toggle */}
        {isTouch && (
          <div 
            onClick={handleModelTap}
            className="absolute top-[28%] left-[38%] -translate-x-1/2 -translate-y-1/2 w-[220px] h-[280px] rounded-full z-25 cursor-pointer"
            style={{ touchAction: 'manipulation' }}
          />
        )}

        {/* Atmospheric Radial Depth Anchor */}
        <div 
          className="absolute top-[28%] left-[38%] -translate-x-1/2 -translate-y-1/2 w-[280px] h-[280px] md:w-[340px] md:h-[340px] rounded-full pointer-events-none z-10 transition-all duration-[0.8s] ease-out"
          style={{
            background: "radial-gradient(circle, rgba(203, 213, 225, 0.28) 0%, rgba(226, 232, 240, 0.12) 50%, rgba(255, 255, 255, 0) 100%)",
            filter: targetFilter,
            opacity: targetOpacity,
            transform: `translate(-50%, -50%) scale(${targetScale})`
          }}
        />

        {/* 3D Canvas - Light Minimal Configuration */}
        <div className="absolute top-[28%] left-[38%] -translate-x-1/2 -translate-y-1/2 w-[400px] h-[600px] md:w-[500px] pointer-events-none z-20">
          <Canvas camera={{ position: [0, 0, 15], fov: 45 }} style={{ pointerEvents: 'auto' }}>
            <ambientLight intensity={1.5 + proximity * 0.2} color="#FFFFFF" />
            
            {/* Soft Daylight Setup */}
            <directionalLight position={[5, 5, 5]} intensity={1.2} color="#FFFFFF" />
            <directionalLight position={[-5, -5, -5]} intensity={0.5} color="#F8FAFC" />
            <pointLight position={[0, 2, 5]} intensity={0.5} color="#FFFFFF" />
            
            <Suspense fallback={<Fallback />}>
              <group>
                <Model modelPath="/avatar2.glb" proximity={proximity} hoveredItem={hoveredItem} positionY={0} />
                {/* Soft environmental grounding shadow */}
                <ContactShadows 
                  position={[0, -3.5, 0]} 
                  opacity={0.55 + proximity * 0.15} 
                  scale={12} 
                  blur={3.5} 
                  far={4} 
                  color="#0F172A" 
                />
              </group>
            </Suspense>

            <Environment preset="city" environmentIntensity={0.5} />
          </Canvas>
        </div>
      </div>
    </div>
  );
}

// Preload the heavy 3D model asset so it starts downloading immediately on bundle load
useGLTF.preload("/avatar2.glb");
