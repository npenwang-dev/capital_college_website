import React from 'react';
import { Award, Mail, BookOpen, GraduationCap, Sparkles, CheckCircle2, MapPin } from 'lucide-react';

/**
 * PersonCard
 * Contemporary portrait card inspired by modern studio design.
 * Supports:
 * - 'spotlight' / 'horizontal': Horizontal showcase card matching the HOD spotlight reference with golden ribbon,
 *   photo checkmark badge, green qualification, uppercase designation, amber-accented bio quote, email and campus pills.
 * - 'standard': Portrait card with nested curved portrait hero, typography, credentials, and campus pills.
 * - 'compact': Minimal directory row.
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
  campus = 'P.R. Hill Campus, Kohima',
  badgeText,
  variant = 'standard', // 'standard' | 'spotlight' | 'horizontal' | 'compact'
  className = '',
  onClick
}) {
  const finalImageUrl = imageUrl || image_url;
  const finalRole = designation || role;
  const isHead = Boolean(isHod || is_hod);
  const finalCampus = campus || 'P.R. Hill Campus, Kohima';

  // Helper to extract clean 2-letter monogram initials
  const getInitials = (fullName) => {
    if (!fullName) return 'CC';
    const clean = fullName.replace(/^(Dr\.|Prof\.|Mr\.|Mrs\.|Ms\.)\s+/i, '').trim();
    const parts = clean.split(' ').filter(Boolean);
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return (parts[0] ? parts[0].substring(0, 2) : 'CC').toUpperCase();
  };

  // =========================================================================
  // VARIANT 1: SPOTLIGHT / HORIZONTAL SHOWCASE CARD (HOD Reference Design)
  // =========================================================================
  if (variant === 'spotlight' || variant === 'horizontal') {
    return (
      <div
        onClick={onClick}
        className={`group relative bg-white rounded-3xl sm:rounded-[32px] border-2 border-amber-400/90 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col sm:flex-row items-center sm:items-stretch gap-6 sm:gap-7 p-6 sm:p-7 overflow-hidden ${
          onClick ? 'cursor-pointer' : ''
        } ${className}`}
      >
        {/* Top-Right Golden Ribbon */}
        {isHead ? (
          <div className="absolute top-0 right-0 bg-[#e58a00] text-white text-[10.5px] sm:text-[11px] font-black uppercase tracking-wider px-4 py-1.5 rounded-bl-2xl shadow-xs flex items-center gap-1.5 border-b border-l border-amber-600/30 select-none z-10">
            <Award size={13} className="text-white fill-white/20" />
            <span>HEAD OF DEPARTMENT</span>
          </div>
        ) : badgeText ? (
          <div className="absolute top-0 right-0 bg-[#002147] text-[#b5d697] text-[10.5px] font-bold uppercase tracking-wider px-3.5 py-1 rounded-bl-xl shadow-xs border-b border-l border-white/20 z-10">
            <span>{badgeText}</span>
          </div>
        ) : null}

        {/* Left Column: Portrait Container with Check Badge */}
        <div className="relative shrink-0 w-32 h-32 sm:w-36 sm:h-36 rounded-2xl overflow-hidden bg-slate-900 border border-slate-200/90 shadow-xs flex items-center justify-center self-center sm:self-auto">
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

          {/* Monogram Portrait (Fallback) */}
          <div
            style={{ display: finalImageUrl ? 'none' : 'flex' }}
            className="w-full h-full bg-gradient-to-br from-[#001736] via-[#002858] to-[#122c1e] text-[#b5d697] flex flex-col items-center justify-center relative p-3 select-none"
          >
            <div className="relative z-10 w-16 h-16 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-inner">
              <span className="font-outfit font-black text-2xl text-[#b5d697]">
                {getInitials(name)}
              </span>
            </div>
            {department && (
              <span className="relative z-10 text-[9px] uppercase font-bold tracking-widest text-slate-300 mt-2 line-clamp-1">
                {department}
              </span>
            )}
          </div>

          {/* Bottom-Right Verified Amber Checkmark Badge */}
          <div className="absolute bottom-1 right-1 bg-amber-500 text-white rounded-full p-1 shadow-md border-2 border-white flex items-center justify-center">
            <CheckCircle2 size={15} className="text-white fill-amber-500" />
          </div>
        </div>

        {/* Right Column: Faculty Details, Quote & Footer Pills */}
        <div className="flex-1 min-w-0 flex flex-col justify-between pt-1 sm:pt-0 sm:pr-24 text-center sm:text-left">
          <div>
            {/* Full Name & Title */}
            <h3 className="font-outfit font-black text-2xl sm:text-3xl text-[#002147] tracking-tight leading-tight group-hover:text-[#4a6b28] transition-colors">
              {name}
            </h3>

            {/* Academic Qualifications (Green) */}
            {qualification && (
              <p className="text-xs sm:text-sm font-bold text-[#4a6b28] mt-1 leading-snug">
                {qualification}
              </p>
            )}

            {/* Academic Designation (Uppercase Gray) */}
            <p className="text-[11px] sm:text-xs font-bold tracking-wider text-slate-500 uppercase mt-0.5">
              {finalRole}
            </p>

            {/* Academic Vision / Quote Statement (Amber Left Bar) */}
            {bio && (
              <div className="border-l-2 border-amber-400 pl-3.5 my-3 text-left">
                <p className="text-xs sm:text-sm text-slate-700 italic leading-relaxed">
                  "{bio}"
                </p>
              </div>
            )}
          </div>

          {/* Footer Contact Pills */}
          {(email || finalCampus) && (
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-2.5">
              {email && (
                <a
                  href={`mailto:${email}`}
                  onClick={(e) => e.stopPropagation()}
                  className="bg-slate-100/90 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-xl text-xs font-medium inline-flex items-center gap-1.5 transition-colors border border-slate-200/60 shrink-0"
                >
                  <Mail size={13} className="text-slate-500" />
                  <span className="font-mono text-[11px]">{email}</span>
                </a>
              )}

              {finalCampus && (
                <div className="bg-slate-100/90 text-slate-700 px-3 py-1.5 rounded-xl text-xs font-medium inline-flex items-center gap-1.5 border border-slate-200/60 shrink-0">
                  <MapPin size={13} className="text-[#4a6b28]" />
                  <span className="text-[11px]">{finalCampus}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  // =========================================================================
  // VARIANT 2: STANDARD PORTRAIT CARD (Grid Roster)
  // =========================================================================
  return (
    <div
      onClick={onClick}
      className={`group relative bg-white rounded-[26px] sm:rounded-[28px] border transition-all duration-300 flex flex-col justify-between overflow-hidden ${
        onClick ? 'cursor-pointer' : ''
      } ${
        isHead
          ? 'border-amber-300/80 shadow-[0_8px_30px_rgba(74,107,40,0.12)] hover:shadow-[0_16px_40px_rgba(74,107,40,0.20)] hover:border-[#4a6b28] ring-1 ring-amber-400/30 p-4 sm:p-5'
          : 'border-slate-200/90 shadow-xs hover:shadow-xl hover:border-[#4a6b28]/50 hover:-translate-y-1 p-3.5 sm:p-4'
      } ${className}`}
    >
      {/* 1. TOP PORTRAIT HERO */}
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

        {/* Fallback Monogram Portrait */}
        <div
          style={{ display: finalImageUrl ? 'none' : 'flex' }}
          className="w-full h-full bg-gradient-to-br from-[#001736] via-[#002858] to-[#122c1e] text-[#b5d697] flex flex-col items-center justify-center relative p-4 select-none"
        >
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#8fc35e_1px,transparent_1px)] [background-size:12px_12px] pointer-events-none" />
          <div className="relative z-10 w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform duration-500">
            <span className="font-outfit font-black text-3xl sm:text-4xl text-[#b5d697] tracking-tight drop-shadow-sm">
              {getInitials(name)}
            </span>
          </div>
          <span className="relative z-10 text-[10px] sm:text-[10.5px] uppercase font-bold tracking-widest text-slate-300 mt-2.5 line-clamp-1">
            {department || 'Capital College Kohima'}
          </span>
        </div>

        </div>

      {/* 2. CARD CONTENT */}
      <div className="pt-3.5 sm:pt-4 px-1 pb-1 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-outfit font-bold text-lg sm:text-xl text-[#002147] tracking-tight leading-snug line-clamp-1 group-hover:text-[#4a6b28] transition-colors">
            {name}
          </h3>

          <p className="text-xs sm:text-[13px] font-semibold text-[#4a6b28] mt-1 leading-snug line-clamp-1">
            {finalRole}
          </p>

          {qualification && (
            <p className="text-[11px] sm:text-xs text-slate-500 font-medium mt-1 leading-relaxed line-clamp-2">
              {qualification}
            </p>
          )}

          {bio && (
            <p className="text-[11.5px] sm:text-xs text-slate-600 mt-2.5 leading-relaxed line-clamp-2 italic border-l-2 border-[#4a6b28]/50 pl-2.5">
              "{bio}"
            </p>
          )}
        </div>

        {/* Footer: Department, Campus & Contact Info */}
        {(department || email || finalCampus) && (
          <div className="pt-3 mt-3 border-t border-slate-100 flex flex-col gap-1 text-[11px] text-slate-500">
            <div className="flex items-center justify-between gap-2">
              <span className="truncate font-semibold text-slate-600">
                {department}
              </span>
              {finalCampus && (
                <div className="flex items-center gap-1 text-[10.5px] text-slate-400 shrink-0">
                  <MapPin size={11} className="text-[#4a6b28]" />
                  <span className="truncate max-w-[120px]">{finalCampus}</span>
                </div>
              )}
            </div>
            {email && (
              <div className="flex items-center gap-1 font-mono text-[10.5px] text-slate-400 hover:text-[#4a6b28] shrink-0 truncate">
                <Mail size={11} className="text-[#4a6b28] shrink-0" />
                <span className="truncate">{email}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
