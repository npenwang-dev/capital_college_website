import React from 'react';
import { Mail, MapPin } from 'lucide-react';

/**
 * PersonCard
 * Simple, clean, compact and minimal portrait/showcase card.
 * Scaled down for high information density, elegant typography, and zero clutter.
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
  onClick,
  actions,
  children
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
  // VARIANT 1: SPOTLIGHT / HORIZONTAL SHOWCASE CARD (Compact & Minimal)
  // =========================================================================
  if (variant === 'spotlight' || variant === 'horizontal') {
    return (
      <div
        onClick={onClick}
        className={`group relative bg-white rounded-xl border border-slate-200/80 shadow-2xs hover:shadow-sm transition-all duration-200 flex flex-col sm:flex-row items-center sm:items-start gap-3.5 p-3 sm:p-3.5 overflow-hidden ${
          onClick ? 'cursor-pointer' : ''
        } ${className}`}
      >
        {/* Left Column: Portrait Container */}
        <div className="relative shrink-0 w-22 h-22 sm:w-24 sm:h-24 rounded-lg overflow-hidden bg-slate-100 border border-slate-200/60 flex items-center justify-center self-center sm:self-auto">
          {finalImageUrl ? (
            <img
              src={finalImageUrl}
              alt={name}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover object-top group-hover:scale-102 transition-transform duration-300"
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
            className="w-full h-full bg-slate-800 text-slate-200 flex flex-col items-center justify-center relative p-2 select-none"
          >
            <span className="font-outfit font-bold text-lg text-slate-100">
              {getInitials(name)}
            </span>
            {department && (
              <span className="text-[8.5px] uppercase font-medium tracking-wider text-slate-400 mt-0.5 line-clamp-1">
                {department}
              </span>
            )}
          </div>
        </div>

        {/* Right Column: Faculty Details & Footer */}
        <div className="flex-1 min-w-0 flex flex-col justify-between pt-0.5 text-center sm:text-left">
          <div>
            {/* Full Name */}
            <h3 className="font-outfit font-bold text-sm sm:text-base text-slate-900 tracking-tight leading-snug line-clamp-1">
              {name}
            </h3>

            {/* Academic Designation / Role */}
            <p className="text-[11px] sm:text-xs font-medium text-slate-600 mt-0.5 line-clamp-1">
              {finalRole}
            </p>

            {/* Academic Qualifications */}
            {qualification && (
              <p className="text-[10px] sm:text-[10.5px] text-slate-400 mt-0.5 leading-snug line-clamp-1">
                {qualification}
              </p>
            )}

            {/* Academic Vision / Quote Statement */}
            {bio && (
              <div className="border-l-2 border-slate-200 pl-2 my-1.5 text-left">
                <p className="text-[10.5px] sm:text-[11px] text-slate-500 italic leading-relaxed line-clamp-2">
                  "{bio}"
                </p>
              </div>
            )}
          </div>

          {/* Footer Contact */}
          {(email || finalCampus) && (
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1.5 border-t border-slate-100 mt-1.5 text-[10px]">
              {email && (
                <a
                  href={`mailto:${email}`}
                  onClick={(e) => e.stopPropagation()}
                  className="text-slate-500 hover:text-slate-800 inline-flex items-center gap-1 transition-colors font-mono shrink-0"
                >
                  <Mail size={11} className="text-slate-400" />
                  <span>{email}</span>
                </a>
              )}

              {finalCampus && (
                <div className="text-slate-400 inline-flex items-center gap-1 shrink-0">
                  <MapPin size={11} className="text-slate-400" />
                  <span>{finalCampus}</span>
                </div>
              )}
            </div>
          )}

          {actions && (
            <div className="pt-1.5 mt-1.5 flex items-center justify-center sm:justify-start gap-1.5 border-t border-slate-100">
              {actions}
            </div>
          )}
          {children}
        </div>
      </div>
    );
  }

  // =========================================================================
  // VARIANT 2: STANDARD PORTRAIT CARD (Simple, Clean, Minimal & Smaller)
  // =========================================================================
  return (
    <div
      onClick={onClick}
      className={`group relative bg-white rounded-xl border border-slate-200/80 shadow-2xs hover:shadow-sm transition-all duration-200 flex flex-col justify-between overflow-hidden p-2.5 sm:p-3 ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
    >
      {/* 1. TOP PORTRAIT HERO (Compact fixed height, clean, zero overlays) */}
      <div className="relative w-full h-36 sm:h-40 rounded-lg overflow-hidden bg-slate-100 shrink-0 border border-slate-200/50">
        {finalImageUrl ? (
          <img
            src={finalImageUrl}
            alt={name}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover object-top group-hover:scale-102 transition-transform duration-300"
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
          className="w-full h-full bg-slate-800 text-slate-200 flex flex-col items-center justify-center relative p-2 select-none"
        >
          <div className="w-11 h-11 rounded-lg bg-white/10 flex items-center justify-center">
            <span className="font-outfit font-bold text-lg text-slate-100 tracking-tight">
              {getInitials(name)}
            </span>
          </div>
          <span className="text-[9px] uppercase font-medium tracking-wider text-slate-400 mt-1.5 line-clamp-1">
            {department || 'Capital College Kohima'}
          </span>
        </div>
      </div>

      {/* 2. CARD CONTENT */}
      <div className="pt-2 px-0.5 pb-0.5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-outfit font-bold text-[13.5px] sm:text-[14.5px] text-slate-900 tracking-tight leading-snug line-clamp-1">
            {name}
          </h3>

          <p className="text-[11px] sm:text-[11.5px] font-medium text-slate-600 mt-0.5 line-clamp-1">
            {finalRole}
          </p>

          {qualification && (
            <p className="text-[10px] sm:text-[10.5px] text-slate-400 font-normal mt-0.5 leading-snug line-clamp-1">
              {qualification}
            </p>
          )}

          {bio && (
            <p className="text-[10.5px] sm:text-[11px] text-slate-500 mt-1.5 leading-snug line-clamp-2 italic border-l-2 border-slate-200 pl-2">
              "{bio}"
            </p>
          )}
        </div>

        {/* Footer: Department & Contact Info */}
        {(department || email || finalCampus) && (
          <div className="pt-2 mt-2 border-t border-slate-100 flex items-center justify-between gap-1.5 text-[10px] text-slate-400">
            <span className="truncate font-medium text-slate-500">
              {department}
            </span>
            {email && (
              <a
                href={`mailto:${email}`}
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-1 font-mono text-[9.5px] text-slate-400 hover:text-slate-700 shrink-0 truncate transition-colors"
                title={email}
              >
                <Mail size={10} className="text-slate-400 shrink-0" />
                <span className="truncate max-w-[110px]">{email}</span>
              </a>
            )}
          </div>
        )}

        {/* Action Controls */}
        {actions && (
          <div className="pt-1.5 mt-1.5 flex items-center justify-end gap-1.5 border-t border-slate-100">
            {actions}
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
