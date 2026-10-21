import React, { useState, useEffect, useRef, useMemo } from 'react';
import SectionTitle from '../Common/SectionTitle';
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  ArrowUpRight,
  Sparkles
} from 'lucide-react';
import { apiFetch } from '../../utils/api';

const fallbackEvents = [
  {
    id: 1,
    title: 'ECO CLUB Trekking to Pulie Badze',
    category: 'Eco Club & Treks',
    item_type: 'event',
    event_date: 'May 5, 2026',
    image_url: 'https://capitalcollege.edu.in/wp-content/uploads/2026/05/WhatsApp-Image-2026-05-05-at-4.12.03-PM.jpeg',
    summary: 'CCHE ECO Club organised a trekking to Pulie Badze spreading awareness about environmental issues, where students were encouraged to preserve indigenous biodiversity.',
    content: 'CCHE ECO Club organised a trekking to Pulie Badze on 25th April 2026 spreading awareness about environmental issues. Students were encouraged to adopt responsible eco-habits and appreciate indigenous forest sanctuaries in the Kohima ridge.'
  },
  {
    id: 2,
    title: 'Blood Test Camp organised by Red Ribbon Club (RRC)',
    category: 'NSS & Social',
    item_type: 'event',
    event_date: 'May 5, 2026',
    image_url: 'https://capitalcollege.edu.in/wp-content/uploads/2026/05/WhatsApp-Image-2026-05-05-at-4.19.40-PM.jpeg',
    summary: 'CCHE Red Ribbon Club organised a Blood Group test on 2nd May 2026. Mr. Temsuwapang, NSS Nodal Officer chaired the event.',
    content: 'CCHE Red Ribbon Club organised a Blood Group test on 2nd May 2026. Mr. Temsuwapang, NSS Nodal Officer chaired the session emphasizing voluntary civic blood donation and community health awareness.'
  },
  {
    id: 3,
    title: 'NSS Special Camp 2025 at Mezo Basa',
    category: 'NSS & Social',
    item_type: 'event',
    event_date: 'October 28, 2025',
    image_url: 'https://capitalcollege.edu.in/wp-content/uploads/2025/10/WhatsApp-Image-2025-10-26-at-8.42.53-AM.jpeg',
    summary: 'NSS CCHE Unit conducted Special Camp for the year 2025 on 24th-26th October, 2025 at Mezo Basa, Primary School with village sanitation & civic drives.',
    content: 'NSS CCHE Unit conducted Special Camp for the year 2025 on 24th-26th October, 2025 at Mezo Basa, Primary School with community development and sanitation drives.'
  },
  {
    id: 4,
    title: 'Trifecta 2025 — Annual Cultural & Sports Festival',
    category: 'College Fest',
    item_type: 'event',
    event_date: 'October 18, 2025',
    image_url: 'https://capitalcollege.edu.in/wp-content/uploads/2025/10/Trifecta-2025.jpg',
    summary: 'CCHE conducted Trifecta on 29th-30th September, 2025. Annual fest celebrating student sports, culture, and talents in Kohima.',
    content: 'Capital College of Higher Education hosts annual Trifecta fest in Kohima celebrating youth empowerment, sports, and cultural harmony.'
  },
  {
    id: 5,
    title: 'Anti Ragging Day / Week 2025 Observed',
    category: 'Campus Integrity',
    item_type: 'event',
    event_date: 'August 12, 2025',
    image_url: 'https://capitalcollege.edu.in/wp-content/uploads/2025/08/Anti-Ragging-500x500.jpg',
    summary: 'Capital College of Higher Education organized National Anti Ragging on the theme "Youth Against Ragging" held on August 12, 2025.',
    content: 'Capital College of Higher Education organized National Anti Ragging on the theme "Youth Against Ragging" and held on August 12, 2025 to reaffirm our 100% ragging-free campus pledge.'
  },
  {
    id: 6,
    title: '18th Fresher’s Meet 2025 at State Academy Hall',
    category: 'Campus Life',
    item_type: 'event',
    event_date: 'August 8, 2025',
    image_url: 'https://capitalcollege.edu.in/wp-content/uploads/2025/08/teachers-with-freshers-copy-500x500.jpg',
    summary: 'On August 5, 2025, Capital College of Higher Education (CCHE) hosted its 18th Freshers Day at State Academy Hall in Kohima welcoming the new batch.',
    content: 'On August 5, 2025, Capital College of Higher Education (CCHE) hosted its 18th Freshers Day at State Academy Hall in Kohima welcoming the new batch into the academic family.'
  },
  {
    id: 7,
    title: 'Teacher’s Orientation Programme — Transformative Pedagogy',
    category: 'Campus Life',
    item_type: 'event',
    event_date: 'July 22, 2025',
    image_url: 'https://capitalcollege.edu.in/wp-content/uploads/2025/07/WhatsApp-Image-2025-07-22-at-10.59.40-AM-scaled.jpeg',
    summary: 'Internal Quality Assurance Cell (IQAC) of Capital College conducted a Teachers’ Orientation Programme on Transformative Pedagogy.',
    content: 'Internal Quality Assurance Cell (IQAC) of Capital College conducted a Teachers’ Orientation Programme under the theme "Transformative Pedagogy for Higher Education".'
  },
  {
    id: 8,
    title: 'Annual Sports & Athletics Meet',
    category: 'College Fest',
    item_type: 'event',
    event_date: 'May 12, 2025',
    image_url: 'https://capitalcollege.edu.in/wp-content/uploads/2023/05/sports.jpeg',
    summary: 'Inter-departmental track and field events, football tournaments, and volleyball matches celebrating athleticism and teamwork.',
    content: 'Inter-departmental track and field events, football tournaments, and volleyball matches celebrating athleticism and teamwork.'
  },
  {
    id: 9,
    title: 'Cultural Diversity Day & Traditional Dress Showcase',
    category: 'Campus Life',
    item_type: 'event',
    event_date: 'April 20, 2025',
    image_url: 'https://capitalcollege.edu.in/wp-content/uploads/2023/05/cultural-day.jpeg',
    summary: 'Celebration of rich Naga heritage, folk melodies, indigenous attires, and traditional culinary exhibitions by student bodies.',
    content: 'Celebration of rich Naga heritage, folk melodies, indigenous attires, and traditional culinary exhibitions by student bodies.'
  }
];

function isNoticeItem(item) {
  if (item.item_type === 'notice') return true;
  if (item.item_type === 'event') return false;
  const cat = (item.category || '').toLowerCase();
  const noticeKeywords = [
    'notice',
    'circular',
    'examination',
    'admissions',
    'admission',
    'routine',
    'welfare',
    'academic circular',
    'administrative circular'
  ];
  return noticeKeywords.some((k) => cat.includes(k));
}

export default function LatestUpdatesCarousel({ onSelectNotice, onViewMore, onViewEvents }) {
  const [events, setEvents] = useState(fallbackEvents);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [centerIndex, setCenterIndex] = useState(1); // Default center card (index 1)
  const [isPaused, setIsPaused] = useState(false);
  const [hasLanded, setHasLanded] = useState(false);
  const [isIntroAnimating, setIsIntroAnimating] = useState(false);
  const [introTransitionDuration, setIntroTransitionDuration] = useState(1150);
  const introPlayed = useRef(false);
  const touchStartX = useRef(0);
  const sectionRef = useRef(null);

  const loadEvents = async () => {
    try {
      const res = await apiFetch('/api/notices?type=event');
      if (res && res.ok) {
        const data = await res.json();
        if (data && data.success && Array.isArray(data.notices)) {
          const sanitized = data.notices.filter((n) => {
            const t = (n.title || '').trim().toLowerCase();
            const s = (n.summary || n.content || '').trim().toLowerCase();
            if (
              !t ||
              t === 'try' ||
              t === 'test' ||
              t === 'demo' ||
              t === 'asdf' ||
              t.startsWith('try ') ||
              s === 'try1'
            ) {
              return false;
            }
            // Strictly exclude notice board / circular items from the Showcase
            if (n.item_type === 'notice' || isNoticeItem(n)) {
              return false;
            }
            return true;
          });

          if (sanitized.length > 0) {
            // Prioritize pinned / featured showcase events first
            const sorted = [...sanitized].sort((a, b) => {
              const aFeatured = a.is_featured ? 1 : 0;
              const bFeatured = b.is_featured ? 1 : 0;
              if (bFeatured !== aFeatured) return bFeatured - aFeatured;
              return (b.id || 0) - (a.id || 0);
            });
            setEvents(sorted);
          }
        }
      }
    } catch (err) {
      // Fall back gracefully to curated events
    }
  };

  useEffect(() => {
    loadEvents();
    const handleUpdate = () => {
      loadEvents();
    };
    window.addEventListener('cche_notices_updated', handleUpdate);
    return () => window.removeEventListener('cche_notices_updated', handleUpdate);
  }, []);

  const categories = [
    { key: 'ALL', label: 'All Events' },
    { key: 'College Fest', label: 'College Fest' },
    { key: 'NSS', label: 'NSS & Social' },
    { key: 'Activities', label: 'Eco Club & Treks' },
    { key: 'Campus Life', label: 'Campus Life' }
  ];

  const filteredEvents = events.filter((item) => {
    if (selectedCategory === 'ALL') return true;
    const cat = (item.category || '').toLowerCase();
    const sel = selectedCategory.toLowerCase();
    if (sel === 'nss') {
      return (
        cat.includes('nss') ||
        cat.includes('health') ||
        cat.includes('social') ||
        cat.includes('red ribbon')
      );
    }
    if (sel === 'activities') {
      return cat.includes('activities') || cat.includes('eco') || cat.includes('trek');
    }
    if (sel === 'campus life') {
      return (
        cat.includes('campus') ||
        cat.includes('integrity') ||
        cat.includes('events') ||
        cat.includes('faculty') ||
        cat.includes('culture')
      );
    }
    return cat === sel || cat.includes(sel);
  });

  // Create circular display list with at least 6 items for seamless cover-flow stage geometry
  const displayList = useMemo(() => {
    if (filteredEvents.length === 0) return [];
    if (filteredEvents.length === 1) return filteredEvents;
    if (filteredEvents.length >= 5) return filteredEvents;

    let list = [];
    while (list.length < 6) {
      list = [...list, ...filteredEvents];
    }
    return list;
  }, [filteredEvents]);

  // Reset center card when category or events change
  useEffect(() => {
    setCenterIndex(displayList.length > 1 ? 1 : 0);
  }, [selectedCategory, displayList.length]);

  // Viewport Landing Observer: detects when the user opens the website and lands over this section
  useEffect(() => {
    if (typeof window === 'undefined' || !window.IntersectionObserver) {
      setHasLanded(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasLanded(true);
        }
      },
      {
        threshold: 0.18,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current);
    };
  }, []);

  // Spin the carousel once when the section first enters the viewport.
  useEffect(() => {
    if (!hasLanded || displayList.length <= 1 || introPlayed.current) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      introPlayed.current = true;
      return;
    }

    setIsIntroAnimating(true);
    const spinDurations = [70, 75, 80, 85, 95, 105, 115, 125, 135];
    let step = 0;
    let timer;

    const spin = () => {
      setIntroTransitionDuration(spinDurations[step]);
      setCenterIndex((prev) => (prev + 1) % displayList.length);
      step += 1;

      if (step < spinDurations.length) {
        timer = setTimeout(spin, spinDurations[step - 1]);
      } else {
        timer = setTimeout(() => {
          setIsIntroAnimating(false);
          introPlayed.current = true;
        }, spinDurations[step - 1]);
      }
    };

    spin();

    return () => {
      clearTimeout(timer);
    };
  }, [hasLanded, displayList.length]);

  // Infinite Circle Loop: Advance through middle every 4.2 seconds in steady state (paused on hover or intro)
  useEffect(() => {
    if (displayList.length <= 1 || isPaused || !hasLanded || isIntroAnimating) return;

    const timer = setInterval(() => {
      setCenterIndex((prev) => (prev + 1) % displayList.length);
    }, 4200);

    return () => clearInterval(timer);
  }, [displayList.length, isPaused, hasLanded, isIntroAnimating]);

  // Circular loop navigation
  const next = () => {
    if (displayList.length <= 1) return;
    setCenterIndex((prev) => (prev + 1) % displayList.length);
  };

  const prev = () => {
    if (displayList.length <= 1) return;
    setCenterIndex((prev) => (prev - 1 + displayList.length) % displayList.length);
  };

  // Mobile touch gesture support
  const handleTouchStart = (e) => {
    if (e.touches && e.touches[0]) {
      touchStartX.current = e.touches[0].clientX;
      setIsPaused(true);
    }
  };

  const handleTouchEnd = (e) => {
    if (e.changedTouches && e.changedTouches[0]) {
      const touchEndX = e.changedTouches[0].clientX;
      const diff = touchStartX.current - touchEndX;
      if (diff > 45) {
        next();
      } else if (diff < -45) {
        prev();
      }
    }
    setIsPaused(false);
  };

  return (
    <section
      ref={sectionRef}
      id="campus-events-section"
      className="pt-12 sm:pt-16 pb-6 sm:pb-8 bg-gradient-to-b from-white via-slate-50/40 to-white border-t border-gray-200/80 scroll-mt-24"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Section Header: Pure Campus Events */}
        <SectionTitle
          title="Campus Events & Activities"
          subtitle="Experience vibrant student life at Capital College — from the annual Trifecta festival and athletic meets to NSS outreach camps and Eco Club expeditions."
        />

        {/* Minimalist Segmented Category Switcher */}
        <div className="flex items-center justify-center gap-1.5 sm:gap-2 overflow-x-auto pb-2 mb-8 no-scrollbar flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => {
                setSelectedCategory(cat.key);
                setCenterIndex(0);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold tracking-wide whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat.key
                  ? 'bg-[#002147] text-white shadow-sm'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Pro 3-Card Circular Stage with Infinite Circle Loop & True Center Spotlight */}
        <div className="relative">
          
          {/* Desktop Floating Left Navigation Arrow */}
          <button
            onClick={prev}
            aria-label="Previous Slide"
            className="flex absolute left-1 sm:-left-5 xl:-left-7 top-1/2 -translate-y-1/2 z-40 w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-md hover:shadow-xl items-center justify-center transition-all duration-300 cursor-pointer text-[#002147] hover:bg-[#002147] hover:text-white hover:scale-105 active:scale-95"
          >
            <ChevronLeft size={18} className="sm:hidden" />
            <ChevronLeft size={22} className="hidden sm:block" />
          </button>

          {/* Genuine Circular Swapping Stage (Cards glide into the middle in a seamless loop) */}
          <div
            className="campus-event-carousel-stage relative w-full h-[460px] sm:h-[550px] lg:h-[580px] overflow-hidden flex items-center justify-center select-none"
            style={{ perspective: '1200px', transformStyle: 'preserve-3d' }}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {displayList.map((item, index) => {
              const N = displayList.length;
              let diff = (index - centerIndex) % N;
              if (diff > N / 2) diff -= N;
              if (diff < -N / 2) diff += N;

              const isCenter = diff === 0;
              const isLeft = diff === -1;
              const isRight = diff === 1;

              // Transform & Appearance styles for physical circular swap
              let transformStyle = '';
              let zIndex = 10;
              let opacity = 0;
              let pointerEvents = 'none';
              let visibility = 'hidden';
              let rotationY = 0;

              if (isCenter) {
                // Middle card: noticeably bigger (scale 1.10), elevated (-16px), full opacity
                transformStyle = 'translateX(-50%) translateY(-16px) scale(var(--campus-carousel-center-scale, 1.10)) rotateY(0deg)';
                zIndex = 30;
                opacity = 1;
                pointerEvents = 'auto';
                visibility = 'visible';
              } else if (isLeft) {
                // Left card: recessed (scale 0.88), lower opacity, clickable to swap to center
                rotationY = isIntroAnimating ? 16 : 0;
                transformStyle = `translateX(calc(-50% - var(--campus-carousel-side-offset, 105%))) translateY(10px) scale(0.88) rotateY(${rotationY}deg)`;
                zIndex = 20;
                opacity = 0.65;
                pointerEvents = 'auto';
                visibility = 'visible';
              } else if (isRight) {
                // Right card: recessed (scale 0.88), lower opacity, clickable to swap to center
                rotationY = isIntroAnimating ? -16 : 0;
                transformStyle = `translateX(calc(-50% + var(--campus-carousel-side-offset, 105%))) translateY(10px) scale(0.88) rotateY(${rotationY}deg)`;
                zIndex = 20;
                opacity = 0.65;
                pointerEvents = 'auto';
                visibility = 'visible';
              } else if (diff === -2) {
                // Exited stage left: smoothly fades out offstage
                rotationY = isIntroAnimating ? 24 : 0;
                transformStyle = `translateX(calc(-50% - 210%)) translateY(16px) scale(0.74) rotateY(${rotationY}deg)`;
                opacity = 0;
                pointerEvents = 'none';
                visibility = 'visible';
              } else if (diff === 2) {
                // Entering stage right: smoothly fades in from offstage
                rotationY = isIntroAnimating ? -24 : 0;
                transformStyle = `translateX(calc(-50% + 210%)) translateY(16px) scale(0.74) rotateY(${rotationY}deg)`;
                opacity = 0;
                pointerEvents = 'none';
                visibility = 'visible';
              } else {
                // Far offstage: hidden completely to prevent cross-viewport jumps
                transformStyle = diff < 0
                  ? 'translateX(calc(-50% - 240%)) scale(0.70)'
                  : 'translateX(calc(-50% + 240%)) scale(0.70)';
                opacity = 0;
                pointerEvents = 'none';
                visibility = 'hidden';
              }

              return (
                <div
                  key={`${item.id || item.title || 'event'}-${index}`}
                  style={{
                    position: 'absolute',
                    left: '50%',
                    width: 'min(var(--campus-carousel-card-width, 90%), 390px)',
                    transform: transformStyle,
                    zIndex: zIndex,
                    opacity: opacity,
                    visibility: visibility,
                    pointerEvents: pointerEvents,
                    transformStyle: 'preserve-3d',
                    willChange: 'transform, opacity',
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                    transition: isIntroAnimating
                      ? `transform ${introTransitionDuration}ms linear, opacity ${introTransitionDuration}ms linear, box-shadow ${introTransitionDuration}ms linear`
                      : 'transform 1150ms cubic-bezier(0.22, 1, 0.36, 1), opacity 850ms ease, box-shadow 850ms ease'
                  }}
                  className="py-4"
                >
                  {/* Clean Interactive Event Card: Middle card is bigger & spotlighted */}
                  <div
                    onClick={() => {
                      if (isCenter) {
                        onSelectNotice(item);
                      } else {
                        setCenterIndex(index);
                      }
                    }}
                    className={`h-full bg-white rounded-2xl sm:rounded-3xl overflow-hidden cursor-pointer flex flex-col group select-none transition-all duration-700 ease-out ${
                      isCenter
                        ? 'border-2 border-[#4a6b28] ring-4 ring-[#4a6b28]/25 shadow-[0_24px_50px_rgba(74,107,40,0.30)]'
                        : 'border border-slate-200/90 shadow-md hover:border-[#4a6b28]/40 hover:opacity-95'
                    }`}
                  >
                    {/* Event Photographic Cover */}
                    <div className="relative h-48 sm:h-60 overflow-hidden bg-slate-900">
                      <img
                        src={item.image_url || 'https://capitalcollege.edu.in/wp-content/uploads/2024/10/DSC_5192-scaled.jpg'}
                        alt={item.title}
                        loading="lazy"
                        decoding="async"
                        className={`w-full h-full object-cover transition-transform duration-700 ease-out ${
                          isCenter ? 'group-hover:scale-108' : 'group-hover:scale-104'
                        }`}
                        onError={(e) => {
                          e.target.src = 'https://capitalcollege.edu.in/wp-content/uploads/2024/10/DSC_5192-scaled.jpg';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent opacity-85 group-hover:opacity-75 transition-opacity" />

                      {/* Top Bar on Image: Category Badge & Arrow */}
                      <div className="absolute top-3.5 inset-x-3.5 flex items-center justify-between">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="bg-[#002147]/90 backdrop-blur-md text-[#b5d697] text-[10.5px] sm:text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full border border-white/20 shadow-sm">
                            {item.category || 'Campus Event'}
                          </span>
                          {item.is_featured ? (
                            <span className="bg-amber-500 text-white text-[10px] sm:text-[10.5px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-sm flex items-center gap-1 border border-amber-300">
                              <Sparkles size={11} className="text-amber-100" />
                              <span>Featured</span>
                            </span>
                          ) : null}
                        </div>
                        <span className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-300 shadow-sm ${
                          isCenter
                            ? 'bg-[#4a6b28] text-white border-white/40 scale-110'
                            : 'bg-white/20 backdrop-blur-md text-white border-white/30 group-hover:bg-[#4a6b28] group-hover:scale-110'
                        }`}>
                          <ArrowUpRight size={15} />
                        </span>
                      </div>

                      {/* Date Badge on Image Bottom */}
                      <div className="absolute bottom-3 left-3.5 flex items-center gap-1.5 text-xs text-white/95 font-semibold bg-black/50 backdrop-blur-sm px-2.5 py-1 rounded-lg border border-white/15">
                        <Calendar size={13} className="text-[#8fc35e]" />
                        <span>{item.event_date || 'Campus Event'}</span>
                      </div>
                    </div>

                    {/* Card Content & Dynamic Hover Arrow */}
                    <div className="p-4 sm:p-6 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className={`font-bold transition-colors line-clamp-2 leading-snug tracking-tight ${
                          isCenter
                            ? 'text-base sm:text-lg text-[#002147]'
                            : 'text-sm sm:text-base text-slate-800 group-hover:text-[#4a6b28]'
                        }`}>
                          {item.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 mt-2 leading-relaxed">
                          {item.summary || (item.content ? item.content.substring(0, 120) + '...' : '')}
                        </p>
                      </div>

                      {/* Subtle Interactive Footer */}
                      <div className={`pt-3 mt-3 border-t flex items-center justify-between text-xs transition-colors ${
                        isCenter
                          ? 'border-[#4a6b28]/20 text-[#4a6b28]'
                          : 'border-slate-100 text-slate-400 group-hover:text-[#4a6b28]'
                      }`}>
                        <span className="font-medium">Capital College Life</span>
                        <span className="inline-flex items-center gap-1 font-bold">
                          <span>{isCenter ? 'View Details' : <><span className="sm:hidden">Tap to Focus</span><span className="hidden sm:inline">Click to Focus</span></>}</span>
                          <ArrowRight size={12} className={`transform transition-transform ${isCenter ? 'translate-x-1' : 'group-hover:translate-x-1'}`} />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Desktop Floating Right Navigation Arrow */}
          <button
            onClick={next}
            aria-label="Next Slide"
            className="flex absolute right-1 sm:-right-5 xl:-right-7 top-1/2 -translate-y-1/2 z-40 w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-md hover:shadow-xl items-center justify-center transition-all duration-300 cursor-pointer text-[#002147] hover:bg-[#002147] hover:text-white hover:scale-105 active:scale-95"
          >
            <ChevronRight size={18} className="sm:hidden" />
            <ChevronRight size={22} className="hidden sm:block" />
          </button>
        </div>

        {/* Sleek Minimalist Slider Navigation & Pagination Bar */}
        <div className="flex items-center justify-center gap-2 mt-6 sm:mt-8">
          {/* Dynamic Progress Indicator Dashes */}
          {filteredEvents.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCenterIndex(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                (centerIndex % filteredEvents.length) === idx
                  ? 'w-8 bg-[#4a6b28] shadow-xs'
                  : 'w-2 bg-slate-300 hover:bg-slate-400'
              }`}
            />
          ))}
        </div>

        {/* Understated Link to Full Events Gallery */}
        {onViewEvents && (
          <div className="mt-4 sm:mt-5 text-center">
            <button
              onClick={onViewEvents}
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#4a6b28] hover:text-[#002147] transition-colors cursor-pointer group"
            >
              <Sparkles size={14} className="text-[#8fc35e]" />
              <span>Explore All Campus Events &amp; Gallery</span>
              <ArrowRight size={14} className="transform group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        )}

      </div>
    </section>
  );
}
