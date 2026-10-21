import React from 'react';
import { Bell, Flame } from 'lucide-react';

export default function AnnouncementTicker({ onOpenAdmission, onOpenUpdates }) {
  return (
    <div className="bg-[#002858] text-white py-2.5 px-4 overflow-hidden border-b-2 border-[#4a6b28] shadow-inner flex items-center">
      <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-xs whitespace-nowrap bg-[#4a6b28] text-white px-3 py-1 rounded mr-4 flex-shrink-0 shadow-sm">
        <Flame size={14} className="text-emerald-200 animate-pulse" />
        <span>Latest Alert:</span>
      </div>

      <div className="overflow-hidden relative w-full text-xs md:text-sm">
        <div className="animate-marquee whitespace-nowrap flex items-center gap-10 text-gray-100">
          <a
            href="/admission_form.pdf"
            download="admission_form.pdf"
            className="hover:text-[#b5d697] hover:underline font-medium transition-colors"
          >
            📢 Admissions Open for B.A. &amp; B.Sc. Four Years Under Graduate Programme (FYUGP) — Download Admission Form (PDF)
          </a>
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#8fc35e]/80 shrink-0"></span>
          <span className="cursor-pointer hover:text-[#b5d697] hover:underline font-medium transition-colors" onClick={onOpenUpdates}>
            🌿 ECO CLUB Trekking to Pulie Badze successfully organized
          </span>
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#8fc35e]/80 shrink-0"></span>
          <span className="cursor-pointer hover:text-[#b5d697] hover:underline font-medium transition-colors" onClick={onOpenUpdates}>
            🩸 Blood Grouping &amp; Screening Camp organized by CCHE Red Ribbon Club (RRC)
          </span>
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#8fc35e]/80 shrink-0"></span>
          <span className="cursor-pointer hover:text-[#b5d697] hover:underline font-medium transition-colors" onClick={onOpenUpdates}>
            🏆 Annual College Trifecta Fest celebrated at Kohima
          </span>
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#8fc35e]/80 shrink-0"></span>
          <a
            href="/admission_form.pdf"
            download="admission_form.pdf"
            className="hover:text-[#b5d697] hover:underline font-medium transition-colors"
          >
            📜 Download Official Admission Form (PDF)
          </a>
        </div>
      </div>
    </div>
  );
}
