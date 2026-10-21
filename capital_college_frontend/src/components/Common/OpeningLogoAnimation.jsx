import React, { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';

/**
 * Brief, understated college crest intro. Click or press Escape, Enter, or Space to skip.
 */
export default function OpeningLogoAnimation({ onComplete }) {
  const [isExiting, setIsExiting] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  // Fade out cleanly without delaying the page once the intro is dismissed.
  const triggerExit = useCallback(() => {
    if (isExiting || !isVisible) return;
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      onComplete && onComplete();
    }, 420);
  }, [isExiting, isVisible, onComplete]);

  useEffect(() => {
    const introTimer = setTimeout(triggerExit, 1400);

    const handleKeyDown = (e) => {
      if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
        triggerExit();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      clearTimeout(introTimer);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [triggerExit]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!mediaQuery.matches) return;
    const t = setTimeout(triggerExit, 120);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!isVisible) return null;

  const content = (
    <div
      onClick={triggerExit}
      className={`fixed inset-0 z-[999999] w-screen h-screen flex items-center justify-center select-none cursor-pointer overflow-hidden bg-[#000d20] transition-opacity duration-[420ms] ease-out ${
        isExiting ? 'opacity-0' : 'opacity-100'
      }`}
      aria-label="Capital College Crest Loader"
      role="banner"
    >
      <div className="absolute w-[360px] h-[360px] sm:w-[440px] sm:h-[440px] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.045)_0%,rgba(74,107,40,0.11)_38%,transparent_72%)] pointer-events-none" />

      {/* College crest with a subtle, static accent ring. */}
      <div
        style={{ perspective: '900px' }}
        className={`relative z-10 transition-[transform,opacity] duration-[420ms] ease-out ${
          isExiting ? 'scale-[0.98] opacity-0' : 'scale-100 opacity-100'
        }`}
      >
        <div className="relative animate-pro-logo-reveal">
          <div className="absolute -inset-3 rounded-full border border-[#8fc35e]/25" aria-hidden="true" />
          <div className="relative h-36 w-36 sm:h-44 sm:w-44 md:h-48 md:w-48" style={{ transformStyle: 'preserve-3d' }}>
            <div className="absolute inset-0 flex items-center justify-center rounded-full border border-white/70 bg-white p-3 shadow-[0_16px_48px_rgba(0,0,0,0.42)] [backface-visibility:hidden]">
              <img
                src="/college-crest-hd.png"
                alt="Capital College Crest"
                className="h-full w-full select-none object-contain"
                draggable="false"
                onError={(e) => {
                  e.currentTarget.src = 'https://capitalcollege.edu.in/wp-content/uploads/2021/01/cropped-logo-1-3-1-1.png';
                }}
              />
            </div>
            <div
              className="absolute inset-0 flex items-center justify-center rounded-full border border-white/70 bg-white p-3 shadow-[0_16px_48px_rgba(0,0,0,0.42)] [backface-visibility:hidden]"
              style={{ transform: 'rotateY(180deg)' }}
              aria-hidden="true"
            >
              <img
                src="/college-crest-hd.png"
                alt=""
                className="h-full w-full select-none object-contain"
                draggable="false"
                onError={(e) => {
                  e.currentTarget.src = 'https://capitalcollege.edu.in/wp-content/uploads/2021/01/cropped-logo-1-3-1-1.png';
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(content, document.body) : content;
}
