import React, { useState, useEffect, useMemo } from 'react';
import { Bell, Download, ExternalLink, ArrowRight, X, Sparkles, FileText, CheckCircle } from 'lucide-react';
import { apiFetch } from '../../utils/api';

const DEFAULT_ANNOUNCEMENTS = [
  {
    id: 1,
    tag: 'ADMISSION 2024-25',
    text: 'Admissions Open for FYUGP 4-Year B.A. & B.Sc. Honours Degree Courses at Capital College Kohima.',
    action_label: 'Admission Info',
    action_type: 'page',
    action_page: 'criteria',
    secondary_label: 'Form (PDF)',
    secondary_href: '/admission_form.pdf',
    is_active: 1
  },
  {
    id: 2,
    tag: 'EXAM ROUTINE',
    text: 'Nagaland University CBCS & Non-CBCS Under Graduate End-Term Examination Routines 2023 Released.',
    action_label: 'View Routines',
    action_type: 'page',
    action_page: 'under-graduate-exam-routine-2023',
    secondary_label: null,
    secondary_href: '',
    is_active: 1
  },
  {
    id: 3,
    tag: 'SCHOLARSHIP',
    text: 'CCHE Scheme for Economically Weak Students (6th Sem) & State Post-Matric Scholarship Active.',
    action_label: 'Welfare Scheme',
    action_type: 'page',
    action_page: 'cche-scheme-for-economically-weak-students',
    secondary_label: null,
    secondary_href: '',
    is_active: 1
  },
  {
    id: 4,
    tag: 'AWARDS',
    text: 'University Distinction Citations & Cash Awards announced for meritorious students and faculty.',
    action_label: 'View Awards',
    action_type: 'page',
    action_page: 'student-awards',
    secondary_label: null,
    secondary_href: '',
    is_active: 1
  }
];

export default function StickyAnnouncementBar({
  onOpenAdmission,
  onNavigate,
  onOpenTrackStatus,
  admissionsActive = false
}) {
  const [items, setItems] = useState(DEFAULT_ANNOUNCEMENTS);
  const [bannerSettings, setBannerSettings] = useState({
    top_banner_enabled: true,
    top_banner_speed: 5500,
    top_banner_show_notice_board: false
  });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Fetch announcements & settings from backend
  const loadAnnouncements = async () => {
    try {
      const res = await apiFetch('/api/announcements');
      if (res.ok) {
        const data = await res.json();
        if (data && data.success && Array.isArray(data.announcements) && data.announcements.length > 0) {
          setItems(data.announcements);
        }
        if (data && data.settings) {
          setBannerSettings((prev) => ({
            ...prev,
            ...data.settings
          }));
        }
      }
    } catch (err) {
      console.warn('Using default institutional announcements fallback:', err.message);
    }
  };

  useEffect(() => {
    loadAnnouncements();

    const handleUpdate = () => {
      loadAnnouncements();
    };

    window.addEventListener('cche_announcements_updated', handleUpdate);
    return () => window.removeEventListener('cche_announcements_updated', handleUpdate);
  }, []);

  // Filter to only active items (decide what to show and what not to show)
  const activeAnnouncements = useMemo(() => {
    const activeOnly = items.filter((item) => item.is_active === 1 || item.is_active === true);
    if (activeOnly.length === 0) return [];

    return activeOnly.map((item) => {
      // Dynamic admission status label/behavior for the admission announcement
      const isAdmissionTag =
        (item.tag || '').toUpperCase().includes('ADMISSION') ||
        (item.action_page === 'criteria') ||
        (item.secondary_href === '/admission_form.pdf');

      if (isAdmissionTag && !admissionsActive) {
        return {
          ...item,
          tag: 'ADMISSIONS CLOSED',
          text: 'Online admissions closed for now. Download official Admission Form (PDF) for offline submission.',
          action_label: 'Form (PDF)',
          action_href: '/admission_form.pdf',
          action_page: '',
          secondary_label: 'Track Status',
          secondary_action: 'track'
        };
      }
      return item;
    });
  }, [items, admissionsActive]);

  // Handle Rotation timer
  useEffect(() => {
    if (isPaused || isDismissed || activeAnnouncements.length <= 1) return;
    const speed = bannerSettings.top_banner_speed || 5500;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeAnnouncements.length);
    }, speed);
    return () => clearInterval(interval);
  }, [isPaused, isDismissed, activeAnnouncements.length, bannerSettings.top_banner_speed]);

  // Safe index clamp
  useEffect(() => {
    if (currentIndex >= activeAnnouncements.length) {
      setCurrentIndex(0);
    }
  }, [activeAnnouncements.length, currentIndex]);

  // Master switch / dismissed check
  if (!bannerSettings.top_banner_enabled || isDismissed || activeAnnouncements.length === 0) {
    return null;
  }

  const activeItem = activeAnnouncements[currentIndex] || activeAnnouncements[0];
  if (!activeItem) return null;

  const handleAction = (item) => {
    if (item.action_href) {
      const link = document.createElement('a');
      link.href = item.action_href;
      link.download = 'admission_form.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (item.action_type === 'apply' || item.action_page === 'admission') {
      onOpenAdmission && onOpenAdmission();
    } else if (item.action_page) {
      onNavigate && onNavigate(item.action_page);
    } else if (item.secondary_action === 'track') {
      onOpenTrackStatus && onOpenTrackStatus();
    }
  };

  const handleSecondaryAction = (item) => {
    if (item.secondary_action === 'track') {
      onOpenTrackStatus && onOpenTrackStatus();
    } else if (item.secondary_href) {
      const link = document.createElement('a');
      link.href = item.secondary_href;
      link.download = 'admission_form.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="bg-gradient-to-r from-[#001736] via-[#002147] to-[#001736] text-white border-b border-[#4a6b28]/40 text-xs py-2 px-3 sm:px-6 relative z-50 shadow-sm transition-all duration-300"
    >
      <div className="max-w-[1600px] mx-auto flex items-center justify-between gap-3">
        {/* Left: Animated Pulse Tag + Announcement Text */}
        <div className="flex items-center gap-2.5 sm:gap-3 flex-1 min-w-0">
          <div className="inline-flex items-center gap-1.5 bg-[#446224] text-white border border-[#5d8731]/70 font-black px-2.5 py-0.5 rounded-md text-[10.5px] tracking-wider uppercase shrink-0 shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#a1cb7d] animate-pulse"></span>
            <span>{activeItem.tag}</span>
          </div>

          <p className="truncate text-slate-100 text-xs sm:text-[13px] font-medium leading-tight">
            {activeItem.text}
          </p>
        </div>

        {/* Right: Quick Action CTAs */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={() => handleAction(activeItem)}
            className="inline-flex items-center gap-1 bg-[#4a6b28] hover:bg-[#3d5920] text-white border border-[#648d35]/70 px-3 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider transition-all shadow-xs cursor-pointer"
          >
            <span>{activeItem.action_label || 'View Info'}</span>
            <ArrowRight size={11} />
          </button>


          {activeItem.secondary_label ? (
            <button
              onClick={() => handleSecondaryAction(activeItem)}
              className="hidden md:inline-flex items-center gap-1 bg-white/10 hover:bg-[#4a6b28] hover:border-[#648d35]/60 text-slate-200 hover:text-white px-2.5 py-1 rounded text-[11px] font-semibold transition-colors shadow-xs border border-white/15 cursor-pointer"
            >
              <Download size={11} />
              <span>{activeItem.secondary_label}</span>
            </button>
          ) : null}

          {/* Dismiss button */}
          <button
            onClick={() => setIsDismissed(true)}
            aria-label="Dismiss Announcement"
            className="text-slate-400 hover:text-white p-1 rounded transition-colors ml-1 cursor-pointer"
          >
            <X size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
