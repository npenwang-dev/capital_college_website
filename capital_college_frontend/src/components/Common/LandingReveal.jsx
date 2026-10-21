import React, { useRef, useState, useEffect } from 'react';

/**
 * LandingReveal
 * High-performance scroll-triggered landing & entrance animation wrapper.
 * Smoothly glides sections and elements into view when scrolled to or landed upon.
 */
export default function LandingReveal({
  children,
  animation = 'fade-up', // 'fade-up', 'fade-down', 'fade-left', 'fade-right', 'scale-up', 'fade-in'
  delay = 0,
  duration = 750,
  threshold = 0.12,
  className = '',
  as: Component = 'div',
  ...props
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [isTransitionComplete, setIsTransitionComplete] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.IntersectionObserver) {
      setIsVisible(true);
      setIsTransitionComplete(true);
      return;
    }

    const el = ref.current;
    if (el) {
      const rect = el.getBoundingClientRect();
      if (rect.top <= (window.innerHeight || document.documentElement.clientHeight)) {
        setIsVisible(true);
        return;
      }
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (ref.current) {
            observer.unobserve(ref.current);
          }
        }
      },
      {
        threshold,
        rootMargin: '0px 0px 60px 0px'
      }
    );

    if (el) {
      observer.observe(el);
    }

    return () => {
      if (el) observer.unobserve(el);
    };
  }, [threshold]);

  // Clean up GPU will-change allocation once entrance transition settles
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        setIsTransitionComplete(true);
      }, duration + delay + 100);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, delay]);

  const getInitialStyle = () => {
    switch (animation) {
      case 'fade-up':
        return 'translate-y-8 sm:translate-y-12 opacity-0 pointer-events-none';
      case 'fade-down':
        return '-translate-y-8 sm:-translate-y-12 opacity-0 pointer-events-none';
      case 'fade-left':
        return 'translate-x-8 sm:translate-x-12 opacity-0 pointer-events-none';
      case 'fade-right':
        return '-translate-x-8 sm:-translate-x-12 opacity-0 pointer-events-none';
      case 'scale-up':
        return 'scale-95 translate-y-6 opacity-0 pointer-events-none';
      case 'fade-in':
      default:
        return 'opacity-0 pointer-events-none';
    }
  };

  const getLandedStyle = () => {
    switch (animation) {
      case 'fade-up':
      case 'fade-down':
        return 'translate-y-0 opacity-100 pointer-events-auto';
      case 'fade-left':
      case 'fade-right':
        return 'translate-x-0 opacity-100 pointer-events-auto';
      case 'scale-up':
        return 'scale-100 translate-y-0 opacity-100 pointer-events-auto';
      case 'fade-in':
      default:
        return 'opacity-100 pointer-events-auto';
    }
  };

  return (
    <Component
      ref={ref}
      style={{
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
        transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
        transform: 'translateZ(0)',
        backfaceVisibility: 'hidden',
        WebkitBackfaceVisibility: 'hidden',
        willChange: isTransitionComplete ? 'auto' : 'transform, opacity'
      }}
      className={`transition-[transform,opacity] ${
        isVisible ? getLandedStyle() : getInitialStyle()
      } ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
}

export function useLandingReveal(threshold = 0.12) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.IntersectionObserver) {
      setIsVisible(true);
      return;
    }

    const el = ref.current;
    if (el) {
      const rect = el.getBoundingClientRect();
      if (rect.top <= (window.innerHeight || document.documentElement.clientHeight)) {
        setIsVisible(true);
        return;
      }
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (ref.current) observer.unobserve(ref.current);
        }
      },
      { threshold, rootMargin: '0px 0px 60px 0px' }
    );

    if (el) observer.observe(el);

    return () => {
      if (el) observer.unobserve(el);
    };
  }, [threshold]);

  return [ref, isVisible];
}
