import React from 'react';
import {
  X,
  Calendar,
  Tag,
  ExternalLink,
  Download,
  FileText,
  Eye,
  FileCheck,
  Building
} from 'lucide-react';
import { isNoticeNew } from '../../utils/noticeUtils';

export default function NoticeDetailModal({ notice, onClose }) {
  if (!notice) return null;

  const isNotice =
    notice.item_type === 'notice' ||
    ['notice', 'examination', 'admissions', 'admission', 'routine', 'welfare', 'circular'].some(
      (k) => (notice.category || '').toLowerCase().includes(k)
    );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-md flex items-center justify-center p-4 transition-all duration-300">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border border-slate-200 animate-scaleUp my-8 transform transition-transform">
        
        {/* Header */}
        <div className="bg-[#002147] text-white px-6 py-4 flex items-center justify-between border-b-2 border-[#4a6b28]">
          <div className="flex items-center gap-2">
            <span className="text-xs font-extrabold bg-[#4a6b28] text-white px-3 py-1 rounded-full uppercase tracking-wider shadow-xs">
              {notice.category || (isNotice ? 'Official Notice' : 'Campus Event')}
            </span>
            {notice.ref_no && (
              <span className="text-[11px] font-mono text-[#b5d697] bg-white/10 px-2.5 py-0.5 rounded-full border border-white/15 hidden sm:inline">
                {notice.ref_no}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            {isNoticeNew(notice) && (
              <span
                className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-white bg-[#1a4329] border border-[#285e3c] px-2.5 py-0.5 rounded-md shadow-xs ring-1 ring-emerald-950/20"
                title="Released within last 3 days"
              >
                <span className="relative flex h-2 w-2 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-85"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                </span>
                <span>NEW</span>
              </span>
            )}
            <button
              onClick={onClose}
              aria-label="Close"
              className="text-gray-300 hover:text-white p-1 rounded-full transition-transform duration-200 hover:rotate-90 hover:bg-white/10 cursor-pointer"
            >
              <X size={22} />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 md:p-8 space-y-5 max-h-[75vh] overflow-y-auto">
          
          {/* Display image ONLY if present (Event photo or Circular Scan) */}
          {notice.image_url ? (
            <div className="rounded-xl overflow-hidden max-h-80 w-full bg-slate-900 shadow-md border border-gray-100 flex flex-col items-center justify-center relative group">
              <img
                src={notice.image_url}
                alt={notice.title}
                className="w-full h-auto max-h-80 object-contain mx-auto"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
              <div className="absolute bottom-2 right-2 flex items-center gap-2">
                <a
                  href={notice.image_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-black/70 hover:bg-black/90 backdrop-blur-md text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg border border-white/20 inline-flex items-center gap-1 transition-colors"
                >
                  <Eye size={12} /> Open Full View
                </a>
              </div>
            </div>
          ) : null}

          {/* Date & Reference Meta */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-gray-500 font-medium">
            <div className="flex items-center gap-2">
              <Calendar size={14} className="text-[#4a6b28]" />
              <span className="font-semibold text-slate-700">{notice.event_date || 'Recent Notice'}</span>
            </div>
            {notice.ref_no && (
              <span className="text-[11px] font-mono text-slate-400 sm:hidden">
                {notice.ref_no}
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="text-xl md:text-2xl font-extrabold text-[#002147] leading-snug tracking-tight">
            {notice.title}
          </h3>

          {/* Full Text Content */}
          <div className="text-gray-700 text-sm md:text-base leading-relaxed whitespace-pre-line space-y-3 pt-3 border-t border-gray-100">
            <p>{notice.content || notice.summary}</p>
          </div>

          {/* Attachments Section if PDF or Link attached */}
          {(notice.pdf_url || notice.link_url) && (
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                Official Attachments &amp; Actions
              </span>
              <div className="flex flex-wrap items-center gap-2.5">
                {notice.pdf_url && (
                  <a
                    href={notice.pdf_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    download={notice.pdf_name || 'Official_Notice.pdf'}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#002147] hover:bg-[#4a6b28] transition-colors shadow-2xs"
                  >
                    <Download size={13} />
                    <span>Download Routine / Form (PDF)</span>
                  </a>
                )}
                {notice.link_url && (
                  <a
                    href={notice.link_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-slate-800 bg-white hover:bg-slate-100 border border-slate-300 transition-colors shadow-2xs"
                  >
                    <ExternalLink size={13} className="text-blue-600" />
                    <span>Open Official Portal / Link</span>
                  </a>
                )}
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200/80 flex items-center justify-between">
          <span className="text-xs text-gray-500 flex items-center gap-1.5">
            <Building size={13} className="text-[#4a6b28]" />
            <span>Capital College of Higher Education, Kohima</span>
          </span>
          <button
            onClick={onClose}
            className="bg-[#002147] hover:bg-[#4a6b28] text-white px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow-xs cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
