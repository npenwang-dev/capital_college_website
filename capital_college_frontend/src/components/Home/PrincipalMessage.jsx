import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  ArrowRight,
  Quote,
  Sparkles,
  Award,
  CheckCircle2,
  Mail,
  MapPin,
  Download,
  X,
  FileText
} from 'lucide-react';
import LandingReveal from '../Common/LandingReveal';

export default function PrincipalMessage({ onOpenFullMessage, onNavigate }) {
  const [modalOpen, setModalOpen] = useState(false);

  const defaultData = {
    name: 'Dr. Zokho Venuh',
    designation: 'Principal, Capital College of Higher Education',
    qualification: 'M.A., Ph.D. • Nagaland University',
    imageUrl: 'https://capitalcollege.edu.in/wp-content/uploads/2024/06/IMG20240604134403-1024x1024.jpg',
    message: 'The Capital College of Higher Education formally known As Nation Academy of Higher Education was established in 2004 on 20th August. The College initially began with 5 regular students and gradually increased year after year because of the constant effort rendered by the faculty to achieve the goal of the college, keeping in mind to help and give opportunities to all the Students.',
    signoffName: 'Dr. Zokho Venuh',
    signoffRole: 'Principal, CCHE Kohima'
  };

  const [principal, setPrincipal] = useState(() => {
    try {
      const saved = localStorage.getItem('cche_principal_settings');
      if (saved) {
        const s = JSON.parse(saved);
        return {
          name: s.name || defaultData.name,
          designation: s.designation || defaultData.designation,
          qualification: s.qualification || defaultData.qualification,
          imageUrl: s.imageUrl || defaultData.imageUrl,
          message: s.message || defaultData.message,
          signoffName: (s.signoffName || defaultData.signoffName).replace(/^[—\-\s]+/, ''),
          signoffRole: s.signoffRole || defaultData.signoffRole
        };
      }
      return defaultData;
    } catch {
      return defaultData;
    }
  });

  const loadSettings = () => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success && data.settings) {
          const s = data.settings;
          setPrincipal((prev) => ({
            ...prev,
            name: s.principal_name || prev.name,
            designation: s.principal_designation || prev.designation,
            qualification: s.principal_qualification || prev.qualification,
            imageUrl: s.principal_image_url || prev.imageUrl,
            message: s.principal_message || prev.message,
            signoffName: (s.principal_signoff_name || prev.signoffName).replace(/^[—\-\s]+/, ''),
            signoffRole: s.principal_signoff_role || prev.signoffRole
          }));
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    loadSettings();
    const handleUpdate = (e) => {
      if (e && e.detail) {
        const s = e.detail;
        setPrincipal((prev) => ({
          ...prev,
          name: s.name || prev.name,
          designation: s.designation || prev.designation,
          qualification: s.qualification || prev.qualification,
          imageUrl: s.imageUrl || prev.imageUrl,
          message: s.message || prev.message,
          signoffName: (s.signoffName || prev.signoffName).replace(/^[—\-\s]+/, ''),
          signoffRole: s.signoffRole || prev.signoffRole
        }));
      } else {
        loadSettings();
      }
    };
    window.addEventListener('principal-settings-updated', handleUpdate);
    return () => window.removeEventListener('principal-settings-updated', handleUpdate);
  }, []);

  const keyCommitments = [
    {
      title: 'Optimal 10:1 Mentorship',
      desc: 'Individualized academic attention, doubts clearing, and moral guidance.'
    },
    {
      title: 'NEP 2020 FYUGP Curriculum',
      desc: '4-Year Honours degree courses in Arts & Science disciplines.'
    },
    {
      title: 'Dual Campus Infrastructure',
      desc: 'Arts stream at P.R. Hill & Science research campus at Thegaba, Phezhu.'
    }
  ];

  const handleReadFull = () => {
    if (onOpenFullMessage) {
      onOpenFullMessage();
    } else if (onNavigate) {
      onNavigate('principal-message');
    } else {
      setModalOpen(true);
    }
  };

  return (
    <section id="featured-page-left" className="py-10 md:py-16 bg-gradient-to-br from-slate-50 via-white to-amber-50/25 border-b border-gray-200/80 relative overflow-hidden scroll-mt-28 md:scroll-mt-36">
      {/* Decorative ambient background accents */}
      <div className="absolute top-10 left-10 w-80 h-80 bg-blue-900/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Column: Principal Portrait Card with Official Crest & Office Badge */}
          <LandingReveal
            animation="fade-right"
            duration={800}
            className="lg:col-span-5 flex flex-col items-center"
          >
            <div className="w-full max-w-sm relative">
              {/* Subtle green decorative glow underlay */}
              <div className="absolute -inset-2 bg-gradient-to-tr from-[#002147] to-[#4a6b28] rounded-3xl opacity-20 blur-lg"></div>

              {/* Main Portrait Card */}
              <div className="relative rounded-2xl overflow-hidden bg-white shadow-2xl border-4 border-white ring-1 ring-slate-200/90 group transition-all duration-300 hover:shadow-emerald-500/10">
                
                {/* Floating Office Badge */}
                <div className="absolute top-3.5 left-3.5 z-20 bg-[#001736]/80 backdrop-blur-md text-[#b5d697] border border-white/20 text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full flex items-center gap-1.5 shadow-md">
                  <Award size={12} className="text-[#8fc35e]" />
                  <span>Office of the Principal</span>
                </div>

                {/* Portrait Image */}
                <div className="overflow-hidden bg-slate-900 aspect-square">
                  <img
                    src={principal.imageUrl || 'https://capitalcollege.edu.in/wp-content/uploads/2024/06/IMG20240604134403-1024x1024.jpg'}
                    alt={`Principal ${principal.name} - Capital College of Higher Education`}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700 block"
                    onError={(e) => {
                      e.target.src = 'https://capitalcollege.edu.in/wp-content/uploads/2024/06/IMG20240604134403.jpg';
                    }}
                  />
                </div>

                {/* Official Nameplate & Credentials */}
                <div className="p-4 bg-gradient-to-r from-[#002147] via-[#001d40] to-[#001736] text-white text-center border-t border-[#4a6b28]/50">
                  <h4 className="font-extrabold text-base sm:text-lg text-[#b5d697] tracking-wide">
                    {principal.name}
                  </h4>
                  <p className="text-xs text-gray-200 font-medium mt-0.5">
                    {principal.designation}
                  </p>
                  {principal.qualification && (
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      {principal.qualification}
                    </p>
                  )}
                </div>
              </div>

              {/* Official Location Bar Underneath */}
              <div className="mt-3.5 bg-white/80 backdrop-blur-md border border-slate-200/80 rounded-xl p-3 text-xs text-gray-700 flex flex-col gap-1.5 shadow-xs">
                <div className="flex items-center gap-2">
                  <MapPin size={13} className="text-[#4a6b28] shrink-0" />
                  <span className="font-medium">P.R. Hill, Kohima, Nagaland 797001</span>
                </div>
                <div className="flex items-center gap-2 text-gray-500 text-[11px]">
                  <span>College Timing: 9:00 am to 4:00 pm</span>
                </div>
              </div>
            </div>
          </LandingReveal>

          {/* Right Column: Title, Official Message & Action CTAs */}
          <LandingReveal
            animation="fade-left"
            duration={800}
            delay={150}
            className="lg:col-span-7 space-y-4"
          >
            
            {/* Header with Title & Collegiate Accent Bar */}
            <div>
              <div className="inline-flex items-center gap-1.5 mb-1.5 text-xs font-bold uppercase tracking-widest text-[#4a6b28]">
                <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                <span>LEADERSHIP &amp; VISION</span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#002147] tracking-tight leading-tight">
                Principal’s Welcome
              </h2>
              <div className="flex items-center gap-1.5 my-3">
                <span className="w-10 h-1 rounded-full animate-accent-grow bg-[#4a6b28]"></span>
                <span className="w-2.5 h-1 rounded-full animate-accent-grow bg-[#002147]"></span>
              </div>
            </div>

            {/* Official Message (Exact Verbatim from Official Source) */}
            <div className="relative bg-white/85 backdrop-blur-sm border-l-4 border-[#4a6b28] p-5 sm:p-6 rounded-r-2xl shadow-sm border-t border-b border-r border-slate-200/80">
              <Quote size={28} className="text-[#4a6b28]/25 mb-2 pointer-events-none" />
              <p className="text-gray-800 text-sm sm:text-base leading-relaxed text-justify whitespace-pre-line">
                {principal.message ? principal.message.replace(/^[“"]|[”"]$/g, '') : ''}
              </p>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-[#002147] tracking-wider uppercase">{principal.signoffName}</span>
                <span className="text-xs text-gray-500 font-medium">{principal.signoffRole}</span>
              </div>
            </div>

            {/* Single Clear Action CTA (No duplicate buttons) & Signature Block */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-4 border-t border-slate-200/80">
              <button
                onClick={handleReadFull}
                className="inline-flex items-center gap-2.5 bg-[#002147] hover:bg-[#4a6b28] text-white px-6 py-3 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-300 shadow-md hover:shadow-xl transform hover:-translate-y-0.5 cursor-pointer group"
              >
                <span>Read Full Message</span>
                <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
              </button>

              {/* Digital Signature / Seal */}
              <div className="text-right">
                <span className="font-serif italic text-lg sm:text-xl font-bold text-[#002147] block tracking-wide">
                  {principal.signoffName}
                </span>
                <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                  {principal.signoffRole}
                </span>
              </div>
            </div>

          </LandingReveal>

        </div>
      </div>

      {/* Full Principal Message Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-fadeIn">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border border-slate-200 animate-scaleUp max-h-[90vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="bg-[#002147] text-white p-5 flex items-center justify-between border-b-2 border-[#4a6b28]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#4a6b28]/25 border border-[#4a6b28]/50 flex items-center justify-center text-[#b5d697]">
                  <GraduationCap size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Principal's Address</h3>
                  <p className="text-xs text-[#b5d697]">Capital College of Higher Education, Kohima</p>
                </div>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="text-gray-300 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
                aria-label="Close Modal"
              >
                <X size={22} />
              </button>
            </div>

            {/* Modal Scrollable Content */}
            <div className="p-6 overflow-y-auto space-y-4 text-sm text-gray-700 leading-relaxed text-justify">
              <div className="flex items-center gap-4 bg-emerald-50/80 p-4 rounded-xl border border-emerald-200/80">
                <img
                  src={principal.imageUrl || 'https://capitalcollege.edu.in/wp-content/uploads/2024/06/IMG20240604134403-1024x1024.jpg'}
                  alt={principal.name}
                  className="w-14 h-14 rounded-full object-cover border-2 border-[#4a6b28] shadow-sm shrink-0"
                />
                <div>
                  <h4 className="font-bold text-base text-[#002147]">{principal.name}</h4>
                  <p className="text-xs text-[#4a6b28] font-semibold">{principal.designation}</p>
                  {principal.qualification && (
                    <p className="text-[11px] text-gray-500">{principal.qualification}</p>
                  )}
                </div>
              </div>

              <div className="bg-gray-50 border-l-4 border-[#4a6b28] p-4 rounded-r-md text-gray-800">
                <p className="text-sm md:text-base leading-relaxed text-justify whitespace-pre-line">
                  {principal.message ? principal.message.replace(/^[“"]|[”"]$/g, '') : ''}
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              {onOpenFullMessage && (
                <button
                  onClick={() => {
                    setModalOpen(false);
                    onOpenFullMessage();
                  }}
                  className="text-xs font-bold text-[#4a6b28] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>Open Full Article Page</span>
                  <ArrowRight size={13} />
                </button>
              )}

              <button
                onClick={() => setModalOpen(false)}
                className="bg-[#002147] hover:bg-[#4a6b28] text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}
    </section>
  );
}
