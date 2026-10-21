import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Compass,
  GraduationCap,
  FileText,
  MapPin,
  Users,
  Sparkles,
  ArrowRight,
  Landmark
} from 'lucide-react';
import { INITIAL_SLIDES } from '../../data/initialHeroSlides';

export default function HeroSlider({ onOpenAdmission, onNavigate }) {
  // Sanitize slides to replace outdated or barren photos with authentic high-res campus photography
  const sanitizeSlides = (rawSlides) => {
    return rawSlides.map(s => {
      if (s.image && s.image.includes('1a.jpg')) {
        return {
          ...s,
          image: 'https://capitalcollege.edu.in/wp-content/uploads/2024/10/DSC_5192-scaled.jpg'
        };
      }
      if (s.title === 'happy day') {
        return {
          ...s,
          title: 'Capital College Kohima Town Campus',
          subtitle: 'PHQ Junction, P.R. Hill — Heart of Undergraduate Academic Life in Kohima',
          image: 'https://capitalcollege.edu.in/wp-content/uploads/2023/05/Arts-Block-and-Girls-Hostel-scaled.jpg'
        };
      }
      return s;
    });
  };

  const [slides, setSlides] = useState(() => {
    try {
      const stored = localStorage.getItem('cche_admin_slides');
      if (stored) {
        const parsed = JSON.parse(stored);
        const active = parsed.filter(s => s.active !== false).sort((a, b) => (a.order || 0) - (b.order || 0));
        if (active.length > 0) return sanitizeSlides(active);
      }
    } catch (e) {}
    return sanitizeSlides(INITIAL_SLIDES);
  });

  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [heroHeight, setHeroHeight] = useState('calc(100vh - 134px)');

  // Sync slides with live admin updates
  useEffect(() => {
    const handleSync = () => {
      try {
        const stored = localStorage.getItem('cche_admin_slides');
        if (stored) {
          const parsed = JSON.parse(stored);
          const active = parsed.filter(s => s.active !== false).sort((a, b) => (a.order || 0) - (b.order || 0));
          if (active.length > 0) {
            setSlides(sanitizeSlides(active));
            return;
          }
        }
      } catch (e) {}
      setSlides(sanitizeSlides(INITIAL_SLIDES));
    };

    window.addEventListener('storage', handleSync);
    window.addEventListener('cche_slides_updated', handleSync);
    return () => {
      window.removeEventListener('storage', handleSync);
      window.removeEventListener('cche_slides_updated', handleSync);
    };
  }, []);

  // Ensure current index is within bounds when slides count changes
  useEffect(() => {
    if (current >= slides.length && slides.length > 0) {
      setCurrent(0);
    }
  }, [slides.length, current]);

  // Dynamically calculate exact available viewport height so the hero covers 100% of the screen above fold
  useEffect(() => {
    const calculateHeight = () => {
      const el = document.getElementById('hero-slider');
      if (el) {
        const rect = el.getBoundingClientRect();
        const headerHeight = rect.top > 0 ? rect.top : (document.querySelector('nav')?.offsetHeight || 96) + 38;
        const available = window.innerHeight - headerHeight;
        setHeroHeight(`${Math.max(580, available)}px`);
      } else {
        setHeroHeight(`${Math.max(580, window.innerHeight - 134)}px`);
      }
    };

    calculateHeight();
    window.addEventListener('resize', calculateHeight);
    const timer = setTimeout(calculateHeight, 350);
    return () => {
      window.removeEventListener('resize', calculateHeight);
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6500);
    return () => clearInterval(timer);
  }, [isPaused, slides.length]);

  const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

  const scrollDown = () => {
    const nextSection = document.getElementById('featured-page-left') || document.getElementById('about-section');
    if (nextSection) {
      const headerOffset = 95;
      const elementPosition = nextSection.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    } else {
      window.scrollBy({ top: window.innerHeight * 0.9, behavior: 'smooth' });
    }
  };

  const handleAction = (actionKey) => {
    if (actionKey === 'admission') {
      onOpenAdmission && onOpenAdmission();
    } else if (actionKey && onNavigate) {
      onNavigate(actionKey);
    }
  };

  const activeSlide = slides[current] || slides[0] || INITIAL_SLIDES[0] || {};

  return (
    <div
      id="hero-slider"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      style={{ height: heroHeight, minHeight: '580px' }}
      className="relative w-full overflow-hidden bg-slate-950 select-none flex flex-col justify-between"
    >
      {/* Background Images with smooth crossfade and continuous Ken Burns zoom */}
      {slides.map((slide, idx) => (
        <div
          key={slide.id || idx}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            idx === current ? 'opacity-100 z-0' : 'opacity-0 -z-10 pointer-events-none'
          }`}
        >
          <img
            src={slide.image}
            alt={slide.title}
            className={`w-full h-full object-cover object-center brightness-[1.03] contrast-[1.03] ${
              idx === current ? 'animate-kenburns' : 'scale-100'
            }`}
            loading={idx === 0 ? 'eager' : 'lazy'}
            decoding="async"
          />

          {/* 1. Targeted Left-Hand Directional Scrim: Dark strictly behind text, dropping off smoothly so students, campus & scenery stay 100% visible and bright */}
          <div className="absolute inset-y-0 left-0 w-full sm:w-[85%] md:w-[68%] lg:w-[56%] bg-gradient-to-r from-slate-950/90 via-slate-950/45 to-transparent pointer-events-none" />

          {/* 2. Soft Top Scrim for Navbar Legibility */}
          <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-slate-950/60 to-transparent pointer-events-none" />

          {/* 3. Soft Bottom Grounding for Dock Legibility */}
          <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent pointer-events-none" />
        </div>
      ))}

      {/* Main Collegiate Stage & Dock Container: Pushed to Left to Harmonize with Header Crest */}
      <div className="relative z-20 w-full max-w-[1600px] mx-auto px-4 sm:px-6 xl:px-8 2xl:px-10 flex-1 flex flex-col justify-between pt-16 sm:pt-24 lg:pt-32 xl:pt-36 pb-5 sm:pb-7">
        
        {/* Top/Middle: Majestic Typography & Symmetrical Dual CTAs */}
        <div key={current} className="max-w-2xl lg:max-w-3xl text-left space-y-4 sm:space-y-5 pt-4 sm:pt-6 lg:pt-8">
          
          {/* Main Headline: Sleek Contemporary Geometric Typography (Outfit) */}
          <h1 className="animate-hero-title-blur font-outfit text-3xl sm:text-5xl lg:text-[54px] xl:text-6xl text-white font-extrabold tracking-tight leading-[1.12] drop-shadow-[0_4px_24px_rgba(0,0,0,0.85)]">
            {activeSlide.title}
          </h1>

          {/* Subtitle / Contextual Narrative */}
          <p className="animate-hero-subtitle-blur text-sm sm:text-base md:text-lg text-slate-100 font-normal leading-relaxed max-w-xl drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)]">
            {activeSlide.subtitle}
          </p>

          {/* Symmetrical Dual Action Buttons */}
          <div className="animate-hero-buttons pt-2 sm:pt-3 flex flex-wrap items-center gap-3.5 sm:gap-4">
            {/* Primary Action: Deep Forest Green with Emerald Accent */}
            <button
              onClick={() => handleAction('admission')}
              className="btn-lift inline-flex items-center gap-2.5 px-6 sm:px-7 py-3 sm:py-3.5 rounded-xl bg-[#4a6b28] hover:bg-[#3d5920] text-white font-bold text-xs sm:text-sm uppercase tracking-wider transition-all duration-300 shadow-lg shadow-[#4a6b28]/35 hover:shadow-xl hover:shadow-[#4a6b28]/50 hover:-translate-y-0.5 cursor-pointer border border-[#648d35] group"
            >
              <FileText size={16} className="text-[#b5d697]" />
              <span>Apply Online 2026</span>
              <ArrowRight size={15} className="arrow-slide" />
            </button>

            {/* Secondary Action: Frosted Glass Button */}
            <button
              onClick={() => handleAction(activeSlide.btnOutlineAction || 'programs')}
              className="btn-lift inline-flex items-center gap-2.5 px-6 sm:px-7 py-3 sm:py-3.5 rounded-xl bg-white/12 hover:bg-white/20 backdrop-blur-md text-white font-bold text-xs sm:text-sm uppercase tracking-wider transition-all duration-300 border border-white/25 hover:border-white/50 shadow-md hover:-translate-y-0.5 cursor-pointer group"
            >
              <Compass size={16} className="text-[#b5d697] transform transition-transform group-hover:rotate-45" />
              <span>Explore Programmes</span>
            </button>
          </div>
        </div>

        {/* Bottom Area: Refined Slide Controls + Luminous 4-Card Dock */}
        <div className="pt-6 sm:pt-8 space-y-3">
          
          {/* Slide Navigation Pill */}
          <div className="flex items-center">
            
            {/* Minimalist Frosted Glass Slide Indicator (Clean Dots & Arrows - No Numbers) */}
            <div className="flex items-center gap-2 bg-slate-950/50 backdrop-blur-xl px-2.5 py-1.5 rounded-full border border-white/20 shadow-lg">
              <button
                onClick={prevSlide}
                aria-label="Previous Slide"
                className="w-7 h-7 rounded-full hover:bg-white/15 text-white flex items-center justify-center transition-colors cursor-pointer group"
              >
                <ChevronLeft size={16} className="transform transition-transform group-hover:-translate-x-0.5" />
              </button>

              {/* Progress Indicator Bars */}
              <div className="flex items-center gap-1.5 px-1.5">
                {slides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrent(idx)}
                    aria-label={`Go to slide ${idx + 1}`}
                    className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                      idx === current
                        ? 'w-7 bg-[#8fc35e] shadow-sm shadow-[#8fc35e]/50'
                        : 'w-2 bg-white/35 hover:bg-white/70'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={nextSlide}
                aria-label="Next Slide"
                className="w-7 h-7 rounded-full hover:bg-white/15 text-white flex items-center justify-center transition-colors cursor-pointer group"
              >
                <ChevronRight size={16} className="transform transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>
          </div>

          {/* 4-Card Luminous Frosted Glass Quick Access Dock */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3.5 p-2 sm:p-2.5 rounded-2xl bg-slate-950/50 backdrop-blur-2xl border border-white/15 shadow-2xl">
            
            {/* 1. Admissions 2026 */}
            <button
              onClick={() => handleAction('admission')}
              className="flex items-center gap-3 p-2.5 sm:p-3 rounded-xl hover:bg-white/10 transition-all duration-300 text-left group cursor-pointer border border-transparent hover:border-white/15 hover:-translate-y-0.5"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-[#b5d697] border border-emerald-400/25 flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:bg-[#4a6b28] group-hover:text-white group-hover:border-[#4a6b28] group-hover:shadow-md transition-all duration-300">
                <FileText size={18} />
              </div>
              <div className="min-w-0">
                <h4 className="text-white text-xs sm:text-sm font-bold group-hover:text-[#b5d697] transition-colors truncate">
                  Admissions 2026
                </h4>
                <p className="text-slate-300 text-[11px] truncate mt-0.5 group-hover:text-white/90 transition-colors">
                  Apply Online Portal
                </p>
              </div>
            </button>

            {/* 2. Academic Programmes */}
            <button
              onClick={() => handleAction('programs')}
              className="flex items-center gap-3 p-2.5 sm:p-3 rounded-xl hover:bg-white/10 transition-all duration-300 text-left group cursor-pointer border border-transparent hover:border-white/15 hover:-translate-y-0.5"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-[#b5d697] border border-emerald-400/25 flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:bg-[#4a6b28] group-hover:text-white group-hover:border-[#4a6b28] group-hover:shadow-md transition-all duration-300">
                <GraduationCap size={18} />
              </div>
              <div className="min-w-0">
                <h4 className="text-white text-xs sm:text-sm font-bold group-hover:text-[#b5d697] transition-colors truncate">
                  Academic Honours
                </h4>
                <p className="text-slate-300 text-[11px] truncate mt-0.5 group-hover:text-white/90 transition-colors">
                  12 B.A. &amp; B.Sc. Majors
                </p>
              </div>
            </button>

            {/* 3. Campus Notice Board */}
            <button
              onClick={() => {
                const el = document.getElementById('notices-section') || document.querySelector('section.border-t');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
                else handleAction('notice');
              }}
              className="flex items-center gap-3 p-2.5 sm:p-3 rounded-xl hover:bg-white/10 transition-all duration-300 text-left group cursor-pointer border border-transparent hover:border-white/15 hover:-translate-y-0.5"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-[#b5d697] border border-emerald-400/25 flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:bg-[#4a6b28] group-hover:text-white group-hover:border-[#4a6b28] group-hover:shadow-md transition-all duration-300">
                <Compass size={18} />
              </div>
              <div className="min-w-0">
                <h4 className="text-white text-xs sm:text-sm font-bold group-hover:text-[#b5d697] transition-colors truncate">
                  Notice Board
                </h4>
                <p className="text-slate-300 text-[11px] truncate mt-0.5 group-hover:text-white/90 transition-colors">
                  Circulars &amp; Events
                </p>
              </div>
            </button>

            {/* 4. Campus Locations */}
            <button
              onClick={() => {
                const el = document.getElementById('campus-location');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
                else handleAction('contact');
              }}
              className="flex items-center gap-3 p-2.5 sm:p-3 rounded-xl hover:bg-white/10 transition-all duration-300 text-left group cursor-pointer border border-transparent hover:border-white/15 hover:-translate-y-0.5"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-[#b5d697] border border-emerald-400/25 flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:bg-[#4a6b28] group-hover:text-white group-hover:border-[#4a6b28] group-hover:shadow-md transition-all duration-300">
                <MapPin size={18} />
              </div>
              <div className="min-w-0">
                <h4 className="text-white text-xs sm:text-sm font-bold group-hover:text-[#b5d697] transition-colors truncate">
                  Campus Locations
                </h4>
                <p className="text-slate-300 text-[11px] truncate mt-0.5 group-hover:text-white/90 transition-colors">
                  P.R. Hill &amp; Jotsoma
                </p>
              </div>
            </button>

          </div>
        </div>

      </div>
    </div>
  );
}
