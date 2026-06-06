import { useState, useEffect } from 'react';

export type DeviceTier = 'A' | 'B' | 'C' | 'D';

export interface DeviceCapability {
  tier: DeviceTier;
  isTouch: boolean;
  hasHover: boolean;
  prefersReducedMotion: boolean;
  isMobileWidth: boolean;
  isTabletWidth: boolean;
  isLowEnd: boolean;
}

export function useDeviceCapability(): DeviceCapability {
  const [capability, setCapability] = useState<DeviceCapability>({
    tier: 'A', // Default to A before mount
    isTouch: false,
    hasHover: true,
    prefersReducedMotion: false,
    isMobileWidth: false,
    isTabletWidth: false,
    isLowEnd: false,
  });

  useEffect(() => {
    const checkCapability = () => {
      // 1. Hover & Pointer
      const hasHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
      const isTouch = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
      
      // 2. Reduced Motion
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      
      // 3. Screen Widths
      const width = window.innerWidth;
      const isMobileWidth = width < 768;
      const isTabletWidth = width >= 768 && width < 1024;
      
      // 4. Hardware limits (using typical navigator extensions)
      // @ts-ignore
      const memory = navigator.deviceMemory || 8; 
      const cores = navigator.hardwareConcurrency || 8;
      const isLowEnd = memory <= 4 || cores <= 4;

      // 5. Tier Classification
      let tier: DeviceTier = 'A';
      
      if (isLowEnd) {
        tier = 'D'; // Tier D: Low-end devices, prioritize pure performance
      } else if (isMobileWidth && isTouch) {
        tier = 'C'; // Tier C: High-end Mobile, smooth transitions but no heavy 3D overhead
      } else if (isTabletWidth && isTouch) {
        tier = 'B'; // Tier B: Tablet, balanced interaction
      } else if (hasHover && !isMobileWidth && !isTabletWidth) {
        tier = 'A'; // Tier A: Desktop, full cinematic experience
      } else if (isTouch) {
        tier = 'C'; // Fallback for edge case touch screens
      }

      setCapability({
        tier,
        isTouch,
        hasHover,
        prefersReducedMotion,
        isMobileWidth,
        isTabletWidth,
        isLowEnd,
      });
    };

    checkCapability();
    
    // Listen to resize and media query changes
    window.addEventListener('resize', checkCapability);
    
    return () => {
      window.removeEventListener('resize', checkCapability);
    };
  }, []);

  return capability;
}
