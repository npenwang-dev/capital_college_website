import React, { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';

/**
 * OpeningLogoAnimation (Pro Elite Edition)
 * Minimalist, ultra-smooth cinematic opening animation.
 * Features an orbiting jewel head particle, seamless gold-to-emerald gradient arc,
 * balanced concentric clearance, and a centered typographic status indicator.
 */
export default function OpeningLogoAnimation({ onComplete }) {
  const [isExiting, setIsExiting] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(0);

  // Smooth exit transition handler (silky 650ms dissolve)
  const triggerExit = useCallback(() => {
    if (isExiting || !isVisible) return;
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      onComplete && onComplete();
    }, 650);
  }, [isExiting, isVisible, onComplete]);

  // Buttery 60/120fps progress animation driven by requestAnimationFrame
  useEffect(() => {
    let animationFrameId;
    let holdTimer;
    const duration = 1900; // 1.9s presentation
    const startTime = performance.now();

    const frame = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progressRatio = Math.min(elapsed / duration, 1);
      // Smooth cubic-out easing curve for natural, organic deceleration
      const eased = 1 - Math.pow(1 - progressRatio, 2.5);
      const currentVal = Math.min(Math.round(eased * 100), 100);

      setProgress(currentVal);

      if (progressRatio < 1) {
        animationFrameId = requestAnimationFrame(frame);
      } else {
        // Upon 100% completion, hold for 140ms for visual satisfaction before dissolving
        holdTimer = setTimeout(() => {
          triggerExit();
        }, 140);
      }
    };

    animationFrameId = requestAnimationFrame(frame);

    const handleKeyDown = (e) => {
      if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
        triggerExit();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      cancelAnimationFrame(animationFrameId);
      clearTimeout(holdTimer);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [triggerExit]);

  if (!isVisible) return null;

  // SVG perimeter calculations: viewBox 0 0 220 220, center (110, 110), r = 100
  const radius = 100;
  const circumference = 2 * Math.PI * radius; // ~628.32
  const strokeOffset = circumference - (circumference * progress) / 100;

  // Orbiting jewel head coordinates (starts at -90deg / 12 o'clock, sweeps clockwise)
  const headAngleRad = (-90 + progress * 3.6) * (Math.PI / 180);
  const headX = 110 + radius * Math.cos(headAngleRad);
  const headY = 110 + radius * Math.sin(headAngleRad);

  const content = (
    <div
      onClick={triggerExit}
      className={`fixed inset-0 z-[999999] w-screen h-screen flex flex-col items-center justify-center select-none cursor-pointer overflow-hidden bg-[#000d20] transition-opacity duration-650 ease-out ${
        isExiting ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      aria-label="Capital College Crest Loader"
      role="banner"
    >
      {/* Studio Ambient Radial Spotlight */}
      <div className="absolute w-[440px] h-[440px] sm:w-[520px] sm:h-[520px] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.06)_0%,rgba(74,107,40,0.14)_35%,rgba(0,18,44,0.05)_65%,transparent_75%)] blur-2xl pointer-events-none animate-pro-spotlight" />

      {/* Centerpiece: Pure Pristine College Emblem with Circular Loader */}
      <div
        className={`relative z-10 flex flex-col items-center justify-center transition-all duration-650 ease-out ${
          isExiting
            ? 'scale-[1.04] opacity-0'
            : 'scale-100 opacity-100'
        }`}
      >
        <div className="relative animate-pro-logo-reveal">
          <div className="animate-pro-logo-drift flex flex-col items-center">
            
            {/* Medallion Disc & Concentric Circular SVG Loader */}
            <div className="relative flex items-center justify-center w-52 h-52 sm:w-60 sm:h-60 md:w-64 md:h-64">
              
              {/* Concentric Circular SVG Loader Ring */}
              <svg
                className="absolute -inset-5 sm:-inset-6 w-[calc(100%+2.5rem)] h-[calc(100%+2.5rem)] sm:w-[calc(100%+3rem)] sm:h-[calc(100%+3rem)] pointer-events-none"
                viewBox="0 0 220 220"
              >
                <defs>
                  {/* Harmonious Seamless Gradient: Warm Gold -> Emerald -> Mint Sage -> Warm Gold */}
                  <linearGradient id="proLoaderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#e5c068" />
                    <stop offset="30%" stopColor="#4a6b28" />
                    <stop offset="70%" stopColor="#8fc35e" />
                    <stop offset="100%" stopColor="#e5c068" />
                  </linearGradient>
                  
                  {/* Soft Luminescent Halo Filter */}
                  <filter id="proLoaderGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>

                  {/* Head Particle Radial Glow */}
                  <radialGradient id="proHeadGlowGrad" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
                    <stop offset="40%" stopColor="#f3e098" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#8fc35e" stopOpacity="0" />
                  </radialGradient>
                </defs>

                {/* Subtle Base Guide Ring */}
                <circle
                  cx="110"
                  cy="110"
                  r={radius}
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.08)"
                  strokeWidth="1.75"
                />

                {/* Ambient Luminous Halo Stroke (sweeps 360 clockwise from 12 o'clock) */}
                <circle
                  cx="110"
                  cy="110"
                  r={radius}
                  fill="none"
                  stroke="url(#proLoaderGrad)"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  transform="rotate(-90 110 110)"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeOffset}
                  filter="url(#proLoaderGlow)"
                  opacity="0.55"
                />

                {/* Crisp Primary Progress Stroke */}
                <circle
                  cx="110"
                  cy="110"
                  r={radius}
                  fill="none"
                  stroke="url(#proLoaderGrad)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  transform="rotate(-90 110 110)"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeOffset}
                />

                {/* Orbiting Jewel Head Particle (dynamic comet lead) */}
                {progress > 1 && progress < 100 && (
                  <g className="transition-transform duration-75">
                    {/* Soft outer glow bloom */}
                    <circle
                      cx={headX}
                      cy={headY}
                      r="6.5"
                      fill="url(#proHeadGlowGrad)"
                    />
                    {/* Diamond white core */}
                    <circle
                      cx={headX}
                      cy={headY}
                      r="2.5"
                      fill="#ffffff"
                      stroke="#d4af37"
                      strokeWidth="1"
                    />
                  </g>
                )}
              </svg>

              {/* Pristine Circular Medallion Disc — larger, crisper */}
              <div className="relative w-full h-full rounded-full bg-white p-3 sm:p-3.5 shadow-[0_20px_60px_rgba(0,0,0,0.75),0_0_30px_rgba(74,107,40,0.25)] border border-slate-200/90 flex items-center justify-center overflow-hidden ring-2 ring-white/40">
                {/* Refined Specular Light Sweep */}
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-pro-logo-shine pointer-events-none" />

                {/* Official Capital College Crest — local HD 400px version for clarity */}
                <img
                  src="/college-crest-hd.png"
                  alt="Capital College Crest"
                  className="w-full h-full object-contain select-none"
                  style={{ imageRendering: 'auto' }}
                  onError={(e) => {
                    e.target.src = 'https://capitalcollege.edu.in/wp-content/uploads/2021/01/cropped-logo-1-3-1-1.png';
                  }}
                />
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(content, document.body) : content;
}
