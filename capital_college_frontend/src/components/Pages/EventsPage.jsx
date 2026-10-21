import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Sparkles,
  MapPin,
  Clock,
  ArrowRight,
  Filter,
  Eye,
  X,
  FileText,
  Trophy,
  CheckCircle2
} from 'lucide-react';
import { apiFetch } from '../../utils/api';
import LandingReveal from '../Common/LandingReveal';

const fallbackEvents = [
  {
    id: 1,
    title: 'ECO CLUB Trekking to Pulie Badze',
    category: 'Activities',
    item_type: 'event',
    event_date: 'May 5, 2026',
    image_url: 'https://capitalcollege.edu.in/wp-content/uploads/2026/05/WhatsApp-Image-2026-05-05-at-4.12.03-PM.jpeg',
    summary: 'CCHE ECO Club organised a trekking to Pulie Badze on 25th April 2026 spreading awareness about environmental issues, where students were encouraged to preserve nature.',
    content: 'CCHE ECO Club organised a trekking to Pulie Badze on 25th April 2026 spreading awareness about environmental issues. Students were encouraged to adopt responsible eco-habits and appreciate indigenous forest sanctuaries in the Kohima ridge.'
  },
  {
    id: 2,
    title: 'Blood Test Camp organised by Red Ribbon Club (RRC)',
    category: 'Health & Social',
    item_type: 'event',
    event_date: 'May 5, 2026',
    image_url: 'https://capitalcollege.edu.in/wp-content/uploads/2026/05/WhatsApp-Image-2026-05-05-at-4.19.40-PM.jpeg',
    summary: 'CCHE Red Ribbon Club organised a Blood Group test on 2nd May 2026. Mr. Temsuwapang, NSS Nodal Officer chaired the event.',
    content: 'CCHE Red Ribbon Club organised a Blood Group test on 2nd May 2026. Mr. Temsuwapang, NSS Nodal Officer chaired the session emphasizing the importance of knowing one’s blood group and voluntary civic blood donation.'
  },
  {
    id: 3,
    title: 'NSS Special Camp 2025',
    category: 'NSS',
    item_type: 'event',
    event_date: 'October 26, 2025',
    image_url: 'https://capitalcollege.edu.in/wp-content/uploads/2025/10/WhatsApp-Image-2025-10-26-at-8.42.53-AM.jpeg',
    summary: 'NSS CCHE Unit conducted Special Camp for the year 2025 on 24th-26th October, 2025 at Mezo Basa, Primary School.',
    content: 'NSS CCHE Unit conducted Special Camp for the year 2025 on 24th-26th October, 2025 at Mezo Basa, Primary School with community development and sanitation drives.'
  },
  {
    id: 4,
    title: 'Trifecta 2025 — Annual Cultural & Sports Festival',
    category: 'College Fest',
    item_type: 'event',
    event_date: 'September 30, 2025',
    image_url: 'https://capitalcollege.edu.in/wp-content/uploads/2025/10/Trifecta-2025.jpg',
    summary: 'CCHE conducted Trifecta on 29th-30th September, 2025 celebrating culture, arts, and competitive student athletic talent.',
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
    title: '18th Fresher’s Meet 2025',
    category: 'Events',
    item_type: 'event',
    event_date: 'August 5, 2025',
    image_url: 'https://capitalcollege.edu.in/wp-content/uploads/2025/08/teachers-with-freshers-copy-500x500.jpg',
    summary: 'Capital College of Higher Education (CCHE) hosted its 18th Freshers Day at State Academy Hall in Kohima.',
    content: 'On August 5, 2025, Capital College of Higher Education (CCHE) hosted its 18th Freshers Day at State Academy Hall in Kohima welcoming the new batch into the academic family.'
  },
  {
    id: 7,
    title: 'Teacher’s Orientation Programme — Transformative Pedagogy',
    category: 'Faculty Development',
    item_type: 'event',
    event_date: 'July 22, 2025',
    image_url: 'https://capitalcollege.edu.in/wp-content/uploads/2025/07/WhatsApp-Image-2025-07-22-at-10.59.40-AM-scaled.jpeg',
    summary: 'Internal Quality Assurance Cell (IQAC) of Capital College conducted a Teachers’ Orientation Programme on Transformative Pedagogy.',
    content: 'Internal Quality Assurance Cell (IQAC) of Capital College conducted a Teachers’ Orientation Programme, under the theme "Transformative Pedagogy for Higher Education".'
  }
];

export default function EventsPage({ onNavigate }) {
  const [events, setEvents] = useState(fallbackEvents);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    let isMounted = true;
    async function loadEvents() {
      try {
        const res = await apiFetch('/api/notices?type=event');
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data.success && Array.isArray(data.notices) && data.notices.length > 0) {
            setEvents(data.notices);
          }
        }
      } catch (err) {
        console.warn('Using fallback events:', err);
      }
    }
    loadEvents();
    return () => {
      isMounted = false;
    };
  }, []);

  const categories = [
    { key: 'ALL', label: 'All Campus Events' },
    { key: 'College Fest', label: 'College Fest & Trifecta' },
    { key: 'NSS', label: 'NSS & Community' },
    { key: 'Health & Social', label: 'Health & Social' },
    { key: 'Activities', label: 'Eco & Treks' },
    { key: 'Events', label: 'Fresher & Gatherings' }
  ];

  const filtered = events.filter((e) => {
    if (selectedCategory === 'ALL') return true;
    return e.category === selectedCategory;
  });

  return (
    <div className="space-y-8 font-sans text-gray-800">
      
      {/* Page Header */}
      <LandingReveal animation="fade-down" duration={600}>
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#002147] via-[#002f65] to-[#4a6b28] text-white p-6 sm:p-10 shadow-xl border border-white/10">
          <div className="relative z-10 max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/15 text-[#b5d697] text-xs font-bold uppercase tracking-widest border border-white/20">
              <Trophy size={13} className="text-[#b5d697]" />
              <span>Campus Life &amp; Activities</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Campus Events, Fests &amp; Outreach
            </h1>
            <p className="text-slate-200 text-xs sm:text-sm sm:leading-relaxed">
              From the annual Trifecta sports &amp; cultural festival to NSS community camps and ECO Club treks, discover the vibrant campus spirit at Capital College of Higher Education.
            </p>
            {onNavigate && (
              <div className="pt-2">
                <button
                  onClick={() => onNavigate('notice')}
                  className="bg-white hover:bg-slate-100 text-[#002147] px-4 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 shadow-md cursor-pointer transition-all"
                >
                  <FileText size={13} className="text-[#4a6b28]" />
                  <span>Go to Official Notices &amp; Routines</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            )}
          </div>
        </div>
      </LandingReveal>

      {/* Category Filter Pills */}
      <LandingReveal animation="fade-up" delay={80} duration={600}>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
          {categories.map((c) => (
            <button
              key={c.key}
              onClick={() => setSelectedCategory(c.key)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === c.key
                  ? 'bg-[#4a6b28] text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </LandingReveal>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((item, idx) => (
          <LandingReveal key={item.id} animation="fade-up" delay={Math.min(idx * 70, 280)} duration={600}>
            <div
              className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:border-[#4a6b28]/50 hover:shadow-lg transition-all overflow-hidden flex flex-col group h-full"
            >
              {/* Event Photo */}
              <div
                className="h-48 overflow-hidden relative bg-slate-100 cursor-pointer"
                onClick={() => item.image_url && setSelectedImage(item.image_url)}
              >
                <img
                  src={item.image_url || 'https://capitalcollege.edu.in/wp-content/uploads/2024/10/DSC_5192-scaled.jpg'}
                  alt={item.title}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none" />

                <div className="absolute bottom-3 left-3 right-3 text-white flex items-center justify-between text-xs">
                  <span className="font-mono flex items-center gap-1">
                    <Calendar size={12} /> {item.event_date}
                  </span>
                  <span className="text-[10px] bg-white/20 backdrop-blur-md px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                    <Eye size={10} /> View Photo
                  </span>
                </div>
              </div>

              {/* Event Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h3 className="font-bold text-[#002147] text-base group-hover:text-[#4a6b28] transition-colors leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    {item.summary || item.content}
                  </p>
                </div>

                {item.link_url && (
                  <div className="pt-2 border-t border-slate-100">
                    <a
                      href={item.link_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-[#4a6b28] hover:text-[#002147] font-bold inline-flex items-center gap-1"
                    >
                      <span>Event Details &amp; Registration</span>
                      <ArrowRight size={12} />
                    </a>
                  </div>
                )}
              </div>
            </div>
          </LandingReveal>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-70 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="bg-white rounded-2xl overflow-hidden max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-[#002147] text-white p-3.5 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider">Event Photo Preview</span>
              <button
                onClick={() => setSelectedImage(null)}
                className="p-1 hover:bg-white/10 rounded text-slate-300 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>
            <div className="p-3 overflow-auto flex-1 flex items-center justify-center bg-slate-900">
              <img
                src={selectedImage}
                alt="Event Preview"
                className="max-w-full max-h-[75vh] object-contain rounded"
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
