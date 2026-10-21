import React from 'react';
import {
  ArrowRight,
  GraduationCap,
  Award,
  Users,
  Building2,
  FileText,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import LandingReveal from '../Common/LandingReveal';

export default function AboutCollege({ onNavigate }) {
  const highlights = [
    {
      icon: <GraduationCap size={22} />,
      title: '12 Honours Depts',
      desc: 'NEP 2020 FYUGP in B.A. & B.Sc. honours streams'
    },
    {
      icon: <Users size={22} />,
      title: '10:1 Mentorship',
      desc: 'Dedicated individual scholar faculty guidance'
    },
    {
      icon: <Award size={22} />,
      title: 'UGC 2(f) & 12(B)',
      desc: 'Permanent Nagaland University affiliation'
    },
    {
      icon: <Building2 size={22} />,
      title: 'Dual Campuses',
      desc: 'Kohima Town Campus & Jotsoma Science Campus'
    }
  ];

  return (
    <section id="about-section" className="py-16 sm:py-24 bg-white border-b border-slate-200 relative overflow-hidden font-sans scroll-mt-20">
      {/* Subtle Ambient Background Gradients */}
      <div className="absolute top-0 right-10 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-96 h-96 bg-blue-900/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Column: About Us Content & Quick Features (7 cols) */}
          <LandingReveal
            animation="fade-right"
            duration={800}
            className="lg:col-span-7 space-y-6"
          >
            
            {/* Eyebrow Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-[#4a6b28] text-xs font-bold uppercase tracking-wider shadow-2xs">
              <Sparkles size={14} className="text-[#4a6b28] animate-pulse" />
              <span>CAPITAL COLLEGE • ESTD. 2004</span>
            </div>

            {/* Title & Concise Intro */}
            <div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#002147] tracking-tight leading-tight">
                About Us
              </h2>
              <div className="flex items-center gap-2 my-3.5">
                <span className="w-14 h-1.5 rounded-full bg-[#4a6b28]" />
                <span className="w-4 h-1.5 rounded-full bg-[#002147]" />
              </div>
              <p className="text-slate-600 text-sm sm:text-base lg:text-lg leading-relaxed max-w-2xl">
                Established on August 20, 2004, Capital College of Higher Education is a premier undergraduate institution in Kohima, permanently affiliated with Nagaland University and recognized under UGC Sections 2(f) &amp; 12(B).
              </p>
            </div>

            {/* 4 Interactive Highlight Cards (2x2 Grid) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4 pt-1">
              {highlights.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 sm:p-5 rounded-2xl border border-slate-200/90 bg-slate-50/70 hover:bg-white hover:border-[#4a6b28]/50 hover:shadow-md hover:-translate-y-1 transition-all duration-300 group flex items-start gap-3.5 sm:gap-4 cursor-default"
                >
                  <div className="w-11 h-11 rounded-xl bg-white border border-slate-200 text-[#4a6b28] shadow-2xs flex items-center justify-center shrink-0 group-hover:bg-[#4a6b28] group-hover:text-white group-hover:border-[#4a6b28] transition-all duration-300">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="text-sm sm:text-base font-bold text-[#002147] group-hover:text-[#4a6b28] transition-colors">
                      {item.title}
                    </h4>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Symmetrical Action CTAs */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              {onNavigate && (
                <button
                  onClick={() => onNavigate('profile')}
                  className="inline-flex items-center gap-2.5 bg-[#002147] hover:bg-[#4a6b28] text-white px-7 py-3.5 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 cursor-pointer group btn-lift"
                >
                  <span>Read Full Profile</span>
                  <ArrowRight size={16} className="arrow-slide" />
                </button>
              )}
              <a
                href="https://capitalcollege.edu.in/wp-content/uploads/2024/04/CCHE-Prospectus-2024-05.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-[#002147] border border-slate-300 px-6 py-3.5 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-all hover:-translate-y-0.5 cursor-pointer group"
              >
                <FileText size={16} className="text-[#4a6b28]" />
                <span>Prospectus (PDF)</span>
              </a>
            </div>

          </LandingReveal>

          {/* Right Column: Visual Photo Showcase with Floating Badges & Animations (5 cols) */}
          <LandingReveal
            animation="fade-left"
            duration={850}
            delay={150}
            className="lg:col-span-5 relative"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white ring-1 ring-slate-200/90 group/photo aspect-4/3 sm:aspect-5/4 lg:aspect-auto lg:h-[440px] xl:h-[460px]">
              <img
                src="https://capitalcollege.edu.in/wp-content/uploads/2024/10/DSC_5192-scaled.jpg"
                alt="Capital College Induction Ceremony"
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover object-center group-hover/photo:scale-105 transition-transform duration-700 ease-out"
                onError={(e) => {
                  e.target.src = 'https://capitalcollege.edu.in/wp-content/uploads/2023/05/DSC_0764-scaled.jpg';
                }}
              />
              {/* Gradient Scrim */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent pointer-events-none" />

              {/* Light Sweep Animation on Hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/photo:translate-x-full transition-transform duration-1000 ease-out pointer-events-none" />

              {/* Floating Top Badge with subtle floating animation */}
              <div className="absolute top-4 right-4 bg-[#002147]/90 backdrop-blur-md text-[#b5d697] text-xs font-bold uppercase tracking-wider px-4 py-1.5 rounded-full border border-white/20 shadow-md animate-float-subtle">
                <span>Kohima, Nagaland</span>
              </div>

              {/* Floating Bottom Verified Accreditation Strip */}
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-3.5 sm:p-4 rounded-2xl border border-white/50 shadow-lg flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckCircle2 size={20} className="text-[#4a6b28] shrink-0" />
                  <div>
                    <span className="text-xs sm:text-sm font-bold text-[#002147] block leading-tight">
                      Nagaland University Affiliated
                    </span>
                    <span className="text-[11px] sm:text-xs text-slate-500 block mt-0.5">
                      UGC 2(f) &amp; 12(B) Recognized
                    </span>
                  </div>
                </div>
                <span className="text-xs font-bold text-[#4a6b28] bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 shrink-0">
                  20+ Years
                </span>
              </div>
            </div>
          </LandingReveal>

        </div>
      </div>
    </section>
  );
}
