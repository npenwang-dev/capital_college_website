import React from 'react';
import { Award, Mail, BookOpen, GraduationCap, Sparkles, CheckCircle2 } from 'lucide-react';

/**
 * PersonCard
 * Contemporary portrait card inspired by modern studio design.
 * Features a high-radius outer frame (rounded-[26px]), nested curved portrait hero (rounded-[20px]),
 * crisp bold typography, academic credentials, and refined collegiate accents.
 */
export default function PersonCard({
  name,
  role = 'Faculty Member',
  designation,
  qualification,
  imageUrl,
  image_url,
  department,
  stream,
  isHod = false,
  is_hod,
  bio,
  email,
  badgeText,
  variant = 'standard', // 'standard' | 'spotlight' | 'compact'
  className = '',
  onClick
}) {
  const finalImageUrl = imageUrl || image_url;
  const finalRole = designation || role;
  const isHead = Boolean(isHod || is_hod);

  // Helper to extract clean 2-letter monogram initials
  const getInitials = (fullName) => {
    if (!fullName) return 'CC';
    const clean = fullName.replace(/^(Dr\.|Prof\.|Mr\.|Mrs\.|Ms\.)\s+/i, '').trim();
    const parts = clean.split(' ').filter(Boolean);
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return (parts[0] ? parts[0].substring(0, 2) : 'CC').toUpperCase();
  };

  const isSpotlight = variant === 'spotlight' || (isHead && variant !== 'compact');

  return (
    <div
      onClick={onClick}
      className={`group relative bg-white rounded-[26px] sm:rounded-[28px] border transition-all duration-300 flex flex-col justify-between overflow-hidden ${
        onClick ? 'cursor-pointer' : ''
      } ${
        isSpotlight
          ? 'border-amber-300/80 shadow-[0_8px_30px_rgba(74,107,40,0.12)] hover:shadow-[0_16px_40px_rgba(74,107,40,0.20)] hover:border-[#4a6b28] ring-1 ring-amber-400/30 p-4 sm:p-5'
          : 'border-slate-200/90 shadow-xs hover:shadow-xl hover:border-[#4a6b28]/50 hover:-translate-y-1 p-3.5 sm:p-4'
      } ${className}`}
    >
      {/* 1. TOP PORTRAIT HERO (Curved nested container with generous aspect ratio) */}
      <div className="relative w-full aspect-[4/3.8] sm:aspect-[4/3.7] rounded-[20px] sm:rounded-[22px] overflow-hidden bg-slate-900 shrink-0 border border-slate-100/80 shadow-2xs">
        {finalImageUrl ? (
          <img
            src={finalImageUrl}
            alt={name}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500 ease-out"
            onError={(e) => {
              e.target.style.display = 'none';
              if (e.target.nextSibling) {
                e.target.nextSibling.style.display = 'flex';
              }
            }}
          />
        ) : null}

        {/* Fallback Monogram Portrait (Displays if no image or on load error) */}
        <div
          style={{ display: finalImageUrl ? 'none' : 'flex' }}
          className="w-full h-full bg-gradient-to-br from-[#001736] via-[#002858] to-[#122c1e] text-[#b5d697] flex flex-col items-center justify-center relative p-4 select-none"
        >
          {/* Subtle micro-dot watermark */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#8fc35e_1px,transparent_1px)] [background-size:12px_12px] pointer-events-none" />

          {/* Large Monogram Lettering */}
          <div className="relative z-10 w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform duration-500">
            <span className="font-outfit font-black text-3xl sm:text-4xl text-[#b5d697] tracking-tight drop-shadow-sm">
              {getInitials(name)}
            </span>
          </div>

          <span className="relative z-10 text-[10px] sm:text-[10.5px] uppercase font-bold tracking-widest text-slate-300 mt-2.5 line-clamp-1">
            {department || 'Capital College Kohima'}
          </span>
        </div>

        {/* Soft bottom scrim to ground badges */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/60 via-black/20 to-transparent pointer-events-none" />

        {/* Top-Right: HOD Gold Crown Badge or Custom Badge */}
        {isHead ? (
          <div className="absolute top-2.5 right-2.5 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 text-white text-[10px] sm:text-[10.5px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-md flex items-center gap-1.5 border border-white/40 backdrop-blur-md">
            <Award size={12} className="text-amber-100" />
            <span>HEAD OF DEPT</span>
          </div>
        ) : badgeText ? (
          <div className="absolute top-2.5 right-2.5 bg-[#002147]/90 text-[#b5d697] text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-md border border-white/20 backdrop-blur-md">
            <span>{badgeText}</span>
          </div>
        ) : null}

        {/* Bottom-Left: Stream / Department Tag */}
        {(stream || department) && (
          <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1.5">
            {stream && (
              <span className={`text-[9.5px] sm:text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border backdrop-blur-md ${
                stream === 'SCIENCE'
                  ? 'bg-blue-900/80 text-blue-200 border-blue-400/30'
                  : 'bg-emerald-900/80 text-emerald-200 border-emerald-400/30'
              }`}>
                {stream} STREAM
              </span>
            )}
          </div>
        )}
      </div>

      {/* 2. CARD CONTENT (Clean, modern typography inspired by reference layout) */}
      <div className="pt-3.5 sm:pt-4 px-1 pb-1 flex-1 flex flex-col justify-between">
        <div>
          {/* Faculty / Person Full Name */}
          <h3 className="font-outfit font-bold text-lg sm:text-xl text-[#002147] tracking-tight leading-snug line-clamp-1 group-hover:text-[#4a6b28] transition-colors">
            {name}
          </h3>

          {/* Academic Role & Designation */}
          <p className="text-xs sm:text-[13px] font-semibold text-[#4a6b28] mt-1 leading-snug line-clamp-1">
            {finalRole}
          </p>

          {/* Qualifications & Degrees */}
          {qualification && (
            <p className="text-[11px] sm:text-xs text-slate-500 font-medium mt-1 leading-relaxed line-clamp-2">
              {qualification}
            </p>
          )}

          {/* Bio statement (Jack Lawson style brief statement) */}
          {bio && (
            <p className="text-[11.5px] sm:text-xs text-slate-600 mt-2.5 leading-relaxed line-clamp-2 italic border-l-2 border-[#4a6b28]/50 pl-2.5">
              "{bio}"
            </p>
          )}
        </div>

        {/* Footer: Department, Campus & Contact Info */}
        {(department || email) && (
          <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 gap-2">
            <span className="truncate font-semibold text-slate-600">
              {department}
            </span>
            {email && (
              <div className="flex items-center gap-1 font-mono text-[10.5px] text-slate-400 hover:text-[#4a6b28] shrink-0">
                <Mail size={11} className="text-[#4a6b28]" />
                <span className="truncate max-w-[140px]">{email}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
