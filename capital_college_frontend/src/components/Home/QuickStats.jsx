import React from 'react';
import { Award, Users, BookOpen, Landmark } from 'lucide-react';
import LandingReveal from '../Common/LandingReveal';

export default function QuickStats() {
  const stats = [
    {
      icon: <Landmark className="w-5 h-5 sm:w-8 sm:h-8 text-[#8fc35e]" />,
      value: '2004',
      label: 'Established Year',
      desc: '20+ Years of Academic Heritage'
    },
    {
      icon: <Award className="w-5 h-5 sm:w-8 sm:h-8 text-[#8fc35e]" />,
      value: '17+',
      label: 'Graduated Batches',
      desc: 'Alumni Across Civil & Corporate Spheres'
    },
    {
      icon: <Users className="w-5 h-5 sm:w-8 sm:h-8 text-[#8fc35e]" />,
      value: '10 : 1',
      label: 'Student-Teacher Ratio',
      desc: 'Personalized Mentorship & Care'
    },
    {
      icon: <BookOpen className="w-5 h-5 sm:w-8 sm:h-8 text-[#8fc35e]" />,
      value: 'B.A. & B.Sc.',
      label: 'Degree Programmes',
      desc: 'Arts & Science Honours Streams'
    }
  ];

  return (
    <div className="w-full bg-[#002858] text-white py-5 sm:py-12 relative overflow-hidden border-y-4 border-[#4a6b28]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-6 text-center">
          {stats.map((s, idx) => (
            <LandingReveal
              key={idx}
              animation="fade-up"
              delay={idx * 100}
              duration={700}
              className="card-interactive-dark card-accent-top group p-2.5 sm:p-5 rounded-xl bg-white/5 border border-white/10 text-center flex flex-col justify-between cursor-default"
            >
              <div className="flex justify-center mb-0.5 sm:mb-2">
                <div className="icon-hover-float">
                  {s.icon}
                </div>
              </div>
              <div>
                <div className="text-xl sm:text-3xl md:text-4xl font-extrabold text-[#b5d697] tracking-tight group-hover:scale-105 transition-transform duration-300 inline-block">
                  {s.value}
                </div>
                <div className="text-[11px] sm:text-sm md:text-base font-semibold text-white mt-1 leading-snug">
                  {s.label}
                </div>
                <div className="text-[10px] sm:text-[11px] text-gray-300 mt-0.5 leading-snug">
                  {s.desc}
                </div>
              </div>
            </LandingReveal>
          ))}
        </div>
      </div>
    </div>
  );
}
