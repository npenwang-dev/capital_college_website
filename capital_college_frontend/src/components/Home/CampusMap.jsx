import React from 'react';
import SectionTitle from '../Common/SectionTitle';
import { MapPin, Clock, Navigation } from 'lucide-react';
import LandingReveal from '../Common/LandingReveal';

export default function CampusMap() {

  return (
    <section id="campus-location" className="pt-8 sm:pt-10 pb-12 md:pb-16 bg-gradient-to-b from-slate-50/50 via-slate-50/70 to-slate-100/60 border-t border-b border-gray-200/80 relative overflow-hidden scroll-mt-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Heading */}
        <SectionTitle
          title="Visit Our Campuses"
          subtitle="Operating two dedicated locations: Kohima Town Arts Campus (P.R. Hill) and Jotsoma Permanent Science Campus"
          className="mb-6 sm:mb-8"
        />

        {/* 2-Column Layout: Left Official Info & Action, Right Interactive Map */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch pt-2">
          
          {/* Left Column: Only Verified Factual Details (4 cols) */}
          <LandingReveal
            animation="fade-right"
            duration={800}
            className="lg:col-span-4 flex flex-col justify-center space-y-4"
          >
            
            {/* Official Address Card */}
            <div className="card-interactive card-accent-top group bg-white p-5 rounded-2xl border border-slate-200 shadow-sm cursor-default">
              <div className="flex items-center gap-2.5 mb-2 text-[#002147]">
                <span className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 text-[#4a6b28] flex items-center justify-center font-bold shrink-0 icon-spring">
                  <MapPin size={18} />
                </span>
                <h4 className="text-sm font-bold uppercase tracking-wider group-hover:text-[#4a6b28] transition-colors">
                  Address
                </h4>
              </div>
              <p className="text-sm text-gray-700 font-medium pl-10 leading-relaxed">
                P.R. Hill, Kohima, Nagaland 797001
              </p>
            </div>

            {/* Official College Timing Card */}
            <div className="card-interactive card-accent-top group bg-white p-5 rounded-2xl border border-slate-200 shadow-sm cursor-default">
              <div className="flex items-center gap-2.5 mb-2 text-[#002147]">
                <span className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 text-[#002147] flex items-center justify-center font-bold shrink-0 icon-spring">
                  <Clock size={18} />
                </span>
                <h4 className="text-sm font-bold uppercase tracking-wider group-hover:text-[#4a6b28] transition-colors">
                  College Timing
                </h4>
              </div>
              <p className="text-sm text-gray-700 font-medium pl-10 leading-relaxed">
                9:00 am to 4:00 pm
              </p>
            </div>

            {/* Direct Google Maps Navigation Button */}
            <a
              href="https://maps.google.com/?q=Capital+College+of+Higher+Education+Kohima+PR+Hill"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-lift bg-[#4a6b28] hover:bg-[#3d5920] text-white p-4 rounded-2xl border border-[#648d35] shadow-sm hover:shadow-md transition-all flex items-center justify-between group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <span className="w-9 h-9 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center font-bold shrink-0 icon-spring">
                  <Navigation size={18} className="text-[#b5d697]" />
                </span>
                <div className="text-left">
                  <h4 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-white">
                    Get Driving Directions
                  </h4>
                  <p className="text-[11px] text-emerald-100 font-medium">
                    Open in Google Maps Navigation
                  </p>
                </div>
              </div>
              <span className="text-xs font-bold bg-white/20 px-2.5 py-1 rounded-lg border border-white/25 arrow-slide">
                Navigate &rarr;
              </span>
            </a>

          </LandingReveal>

          {/* Right Column: Interactive Embedded Google Map (8 cols) */}
          <LandingReveal
            animation="fade-left"
            duration={850}
            delay={150}
            className="lg:col-span-8 flex flex-col"
          >
            <div className="relative w-full h-[360px] sm:h-[420px] lg:h-full min-h-[380px] rounded-2xl overflow-hidden shadow-2xl border-4 border-white ring-1 ring-slate-200/90 bg-slate-100 group">
              
              {/* Google Maps Responsive Iframe */}
              <iframe
                title="Capital College Kohima Location"
                src="https://maps.google.com/maps?q=Capital+College+of+Higher+Education+Kohima+PR+Hill&t=&z=16&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: '100%' }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full grayscale-[5%] group-hover:grayscale-0 transition-all duration-500"
              />

            </div>
          </LandingReveal>

        </div>
      </div>
    </section>
  );
}
