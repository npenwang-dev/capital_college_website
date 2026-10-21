import React from 'react';
import LandingReveal from './LandingReveal';

export default function SectionTitle({
  eyebrow,
  title,
  subtitle,
  align = 'center',
  light = false,
  className = ''
}) {
  const isLeft = align === 'left';

  return (
    <LandingReveal
      animation="fade-up"
      duration={700}
      className={`mb-8 sm:mb-10 ${isLeft ? 'text-left' : 'text-center'} ${className}`}
    >
      {eyebrow && (
        <div className={`inline-flex items-center gap-1.5 mb-2 text-xs font-bold uppercase tracking-widest ${
          light ? 'text-[#b5d697]' : 'text-[#4a6b28]'
        }`}>
          <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
          <span>{eyebrow}</span>
        </div>
      )}

      <h2 className={`text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight ${
        light ? 'text-white' : 'text-[#002147]'
      }`}>
        {title}
      </h2>

      {/* Sleek Collegiate Accent Bar with landing draw animation */}
      <div className={`flex items-center gap-1.5 my-3 ${isLeft ? 'justify-start' : 'justify-center'}`}>
        <span className={`w-10 h-1 rounded-full ${isLeft ? 'animate-accent-grow' : 'animate-accent-grow-center'} ${light ? 'bg-[#8fc35e]' : 'bg-[#4a6b28]'}`}></span>
        <span className={`w-2.5 h-1 rounded-full ${isLeft ? 'animate-accent-grow' : 'animate-accent-grow-center'} ${light ? 'bg-white/60' : 'bg-[#002147]'}`}></span>
      </div>

      {subtitle && (
        <p className={`text-sm sm:text-base leading-relaxed ${
          isLeft ? 'max-w-2xl' : 'max-w-2xl mx-auto'
        } ${light ? 'text-slate-200' : 'text-slate-600'}`}>
          {subtitle}
        </p>
      )}
    </LandingReveal>
  );
}

