import React, { useState, useEffect } from 'react';
import {
  FileText,
  Download,
  ExternalLink,
  Search,
  Eye,
  Calendar,
  X,
  ArrowRight,
  FileCheck,
  CheckCircle2,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { apiFetch } from '../../utils/api';
import { isNoticeNew } from '../../utils/noticeUtils';
import LandingReveal from '../Common/LandingReveal';

const fallbackOfficialNotices = [
  {
    id: 101,
    title: 'Nagaland University Under Graduate End-Term Examination Routine 2024',
    category: 'Examination',
    ref_no: 'CCHE/NU-EXAM/2024-08',
    item_type: 'notice',
    event_date: 'August 14, 2024',
    summary: 'Schedule of B.A. & B.Sc. 2nd, 4th, and 6th Semester End Term Examinations under Nagaland University. Students are directed to verify their subject dates, session timings, and center regulations.',
    content: 'All undergraduate students of Capital College of Higher Education are hereby notified that Nagaland University has released the official End Term Examination Routine for 2nd, 4th, and 6th Semesters. Regular and backlog candidates must present their valid Admit Cards and college ID cards at the examination hall. Download the official routine PDF below for department-wise dates and center instructions.',
    pdf_url: 'https://capitalcollege.edu.in/wp-content/uploads/2023/05/UG-Examination-Routine-2023.pdf',
    pdf_name: 'NU_UG_Exam_Routine_2024.pdf',
    link_url: 'https://capitalcollege.edu.in/under-graduate-exam-routine-2023/',
    image_url: 'https://capitalcollege.edu.in/wp-content/uploads/2026/01/Notice-1-1024x1024.jpg',
    is_latest: true,
    is_featured: 1
  },
  {
    id: 102,
    title: 'Institutional Notification — Mandatory 75% Attendance Criteria & Exam Debarment',
    category: 'Administrative Circular',
    ref_no: 'CCHE/PRIN/CIR-2024/11',
    item_type: 'notice',
    event_date: 'August 2, 2024',
    summary: 'Office of the Principal notification regarding mandatory 75% lecture attendance criteria for undergraduate students under Nagaland University regulations.',
    content: 'Issued by the Office of the Principal, Capital College of Higher Education (P.R. Hill, Kohima). In accordance with Nagaland University ordinances, all students across Arts and Science streams are strictly required to maintain a minimum of 75% attendance in lectures and practical sessions. Students with attendance deficits will be debarred from appearing in end-term semester examinations.',
    image_url: 'https://capitalcollege.edu.in/wp-content/uploads/2026/01/Notice-1-1024x1024.jpg',
    pdf_url: '',
    link_url: '',
    is_latest: true,
    is_featured: 1
  },
  {
    id: 103,
    title: 'Offline & Online Admission Form Availability for Academic Session 2024-25',
    category: 'Admissions',
    ref_no: 'CCHE/ADM-FYUGP/2024/03',
    item_type: 'notice',
    event_date: 'July 15, 2024',
    summary: 'Availability and submission schedule of offline and online admission application forms for 4-Year FYUGP B.A. (Arts) and B.Sc. (Science) honours programmes.',
    content: 'Students seeking admission to 1st Semester B.A. (Arts) and B.Sc. (Science) for the academic session 2024-25 may download the official print admission form (PDF) or collect it from the college administrative office at P.R. Hill, Kohima. Duly filled forms with attested NBSE marksheets, pass certificates, and passport photographs must be submitted to the admission counter.',
    pdf_url: '/admission_form.pdf',
    pdf_name: 'admission_form.pdf',
    link_url: '',
    image_url: '',
    is_latest: true,
    is_featured: 1
  },
  {
    id: 104,
    title: 'Undergraduate Examination Guidelines, Center Regulations & Admit Card Distribution',
    category: 'Examination',
    ref_no: 'CCHE/EXAM-CELL/2024/05',
    item_type: 'notice',
    event_date: 'July 8, 2024',
    summary: 'Important instructions from the Examination Cell for undergraduate students appearing in end-term university assessments, including admit card verification and prohibited items.',
    content: 'The Examination Cell of Capital College notifies all examinees that university admit cards must be collected from their respective department mentors. Possession of mobile phones, smartwatches, and programmable devices inside the examination hall is strictly prohibited and subject to immediate cancellation of candidature.',
    pdf_url: '',
    link_url: '',
    image_url: '',
    is_latest: true,
    is_featured: 1
  },
  {
    id: 105,
    title: 'CCHE Students Welfare Scheme — 6th Semester Applications for Tuition Assistance',
    category: 'Student Welfare',
    ref_no: 'CCHE/SWS/2024/02',
    item_type: 'notice',
    event_date: 'June 28, 2024',
    summary: 'Applications invited for 2-student quota tuition fee assistance under CCHE Scheme for Economically Weak Students.',
    content: 'Applications are invited from deserving 6th Semester students for the CCHE Students Welfare Scheme. Eligible candidates must have maintained minimum 75% attendance across previous semesters. Applicants must submit a handwritten application and attend an interview with the Selection Committee accompanied by their parent/guardian.',
    pdf_url: 'https://capitalcollege.edu.in/wp-content/uploads/2024/04/CCHE-Prospectus-2024-05.pdf',
    pdf_name: 'CCHE_Welfare_Scheme_Guidelines.pdf',
    link_url: 'https://capitalcollege.edu.in/cche-scheme-for-economically-weak-students/',
    image_url: '',
    is_latest: false,
    is_featured: 0
  },
  {
    id: 106,
    title: 'Nagaland University FYUGP 4-Year B.A. & B.Sc. Academic Credit Framework',
    category: 'Academic Circular',
    ref_no: 'CCHE/ACAD-NEP/2024/01',
    item_type: 'notice',
    event_date: 'June 10, 2024',
    summary: 'Curriculum credit framework for Major, Minor, Multidisciplinary, and Skill Enhancement courses under NEP 2020.',
    content: 'As per the National Education Policy (NEP 2020) implemented by Nagaland University, undergraduate honours students at Capital College are advised to verify their semester course selections with respective Heads of Departments. Credit transfers, internship components, and research pathways are facilitated through the Academic Dean office.',
    link_url: 'https://nagalanduniversity.ac.in',
    pdf_url: '',
    image_url: '',
    is_latest: false,
    is_featured: 0
  },
  {
    id: 107,
    title: 'College Identity Card Issuance & Central Library Book Lending Orientation',
    category: 'Administrative Circular',
    ref_no: 'CCHE/LIB-ID/2024/04',
    item_type: 'notice',
    event_date: 'May 22, 2024',
    summary: 'Schedule for digital student ID card verification and orientation on the automated barcode library lending system at Kohima Town Campus library.',
    content: 'All newly enrolled 1st Semester students are required to verify their student biodata at the administrative office for generation of digital Barcode ID cards. Library borrower cards will be distributed concurrently. Each student is eligible to borrow up to 3 textbooks simultaneously for a duration of 14 days.',
    pdf_url: '',
    link_url: '',
    image_url: '',
    is_latest: false,
    is_featured: 0
  },
  {
    id: 108,
    title: 'Anti-Ragging Undertaking Submission & Institutional Code of Conduct 2024-25',
    category: 'Administrative Circular',
    ref_no: 'CCHE/ANTI-RAG/2024/01',
    item_type: 'notice',
    event_date: 'May 10, 2024',
    summary: 'Mandatory online anti-ragging affidavit submission for all students and parents as mandated by UGC and Supreme Court directives.',
    content: 'In strict compliance with UGC Anti-Ragging Regulations, Capital College maintains a zero-tolerance policy against any form of harassment or ragging on and off campus. All students and their guardians must complete the mandatory affidavit on the National Anti-Ragging Portal and submit the confirmation reference number to the mentor in-charge.',
    pdf_url: '',
    link_url: 'https://antiragging.in',
    image_url: '',
    is_latest: false,
    is_featured: 0
  }
];

function parseNoticeDate(dateStr) {
  if (!dateStr) return { day: '15', month: 'CIR', year: '2024' };
  try {
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) {
      const day = d.getDate().toString().padStart(2, '0');
      const month = d.toLocaleString('en-US', { month: 'short' }).toUpperCase();
      const year = d.getFullYear();
      return { day, month, year };
    }
  } catch (e) {}
  const parts = dateStr.split(/[\s,]+/);
  if (parts.length >= 3) {
    return {
      month: parts[0].substring(0, 3).toUpperCase(),
      day: parts[1].padStart(2, '0'),
      year: parts[2]
    };
  }
  return { day: '15', month: 'CIR', year: '2024' };
}

export default function NoticeBoardPage({ onNavigate }) {
  const [notices, setNotices] = useState(fallbackOfficialNotices);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [selectedImage, setSelectedImage] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    let isMounted = true;
    async function loadNotices() {
      try {
        const res = await apiFetch('/api/notices?type=notice');
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data.success && Array.isArray(data.notices) && data.notices.length > 0) {
            setNotices(data.notices);
          }
        }
      } catch (err) {
        // Fall back gracefully to curated institutional notices
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadNotices();
    return () => {
      isMounted = false;
    };
  }, []);

  const categories = [
    { key: 'ALL', label: 'All Notices' },
    { key: 'LATEST', label: 'Latest Notices' },
    { key: 'Examination', label: 'Examinations' },
    { key: 'Admissions', label: 'Admissions' },
    { key: 'Administrative Circular', label: 'Administration' },
    { key: 'Student Welfare', label: 'Student Welfare' },
    { key: 'Academic Circular', label: 'Academic & NEP' }
  ];

  const filtered = notices.filter((n, idx) => {
    const q = search.trim().toLowerCase();
    const matchesSearch =
      !q ||
      (n.title && n.title.toLowerCase().includes(q)) ||
      (n.summary && n.summary.toLowerCase().includes(q)) ||
      (n.content && n.content.toLowerCase().includes(q)) ||
      (n.category && n.category.toLowerCase().includes(q)) ||
      (n.ref_no && n.ref_no.toLowerCase().includes(q));

    const matchesCategory =
      categoryFilter === 'ALL' ||
      (categoryFilter === 'LATEST' && (isNoticeNew(n) || n.is_featured || idx < 3)) ||
      n.category?.toLowerCase() === categoryFilter.toLowerCase() ||
      (categoryFilter === 'Examination' && n.category?.toLowerCase().includes('exam')) ||
      (categoryFilter === 'Admissions' && n.category?.toLowerCase().includes('admiss'));

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 font-sans text-gray-800 max-w-6xl mx-auto">
      
      {/* =========================================================================
          1. AUTHENTIC INSTITUTIONAL NOTICE BOARD MASTHEAD
          ========================================================================= */}
      <LandingReveal animation="fade-down" duration={600}>
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
          <div className="border-t-4 border-[#002147] p-6 sm:p-8 bg-gradient-to-b from-slate-50/70 to-white">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 pb-6 border-b border-slate-200">
              <div className="flex items-center gap-4">
                <img
                  src="/college-crest-hd.png"
                  alt="Capital College Crest"
                  className="w-14 h-14 sm:w-16 sm:h-16 object-contain shrink-0 drop-shadow-xs"
                  onError={(e) => {
                    e.target.src = 'https://capitalcollege.edu.in/wp-content/uploads/2021/01/cropped-logo-1-3-1-1.png';
                  }}
                />
                <div>
                  <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#4a6b28] block">
                    Office of the Principal
                  </span>
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-[#002147] tracking-tight uppercase font-serif">
                    Capital College of Higher Education
                  </h1>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    P.R. Hill, Kohima, Nagaland 797001 • Estd. 2004
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-start sm:items-end text-xs text-slate-500 shrink-0">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#002147] text-white text-[11px] font-bold uppercase tracking-wider">
                  <FileText size={12} className="text-[#b5d697]" />
                  <span>Official Notice Board</span>
                </span>
                <span className="text-[11px] text-slate-500 font-medium mt-1.5">
                  Permanently Affiliated to Nagaland University
                </span>
                <span className="text-[10.5px] text-slate-400">
                  Recognized by UGC under Section 2(f) &amp; 12(B)
                </span>
              </div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-600">
              <p className="leading-relaxed max-w-3xl">
                Official notifications, university examination timetables, admission circulars, and institutional guidelines issued for students, parents, and faculty members.
              </p>
              <span className="font-semibold text-slate-400 shrink-0">
                Academic Session 2024–25
              </span>
            </div>
          </div>
        </div>
      </LandingReveal>

      {/* =========================================================================
          2. CLEAN SEARCH & CATEGORY FILTER BAR
          ========================================================================= */}
      <LandingReveal animation="fade-up" delay={80} duration={600}>
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Category Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-thin">
            {categories.map((c) => (
              <button
                key={c.key}
                onClick={() => setCategoryFilter(c.key)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  categoryFilter === c.key
                    ? 'bg-[#002147] text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 border border-transparent'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative min-w-[260px]">
            <Search size={15} className="absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search circulars, routines, subjects..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-8 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-[#4a6b28] focus:ring-2 focus:ring-[#4a6b28]/20 bg-slate-50/50 text-slate-800 placeholder-slate-400"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>
      </LandingReveal>

      {/* Notices Count & Campus Events Link */}
      <LandingReveal animation="fade-up" delay={120} duration={500}>
        <div className="flex items-center justify-between text-xs text-slate-500 px-1">
          <span>
            Showing <strong className="text-[#002147] font-semibold">{filtered.length}</strong> official circulars
          </span>
          {onNavigate && (
            <button
              onClick={() => onNavigate('events')}
              className="text-[#4a6b28] hover:text-[#002147] font-bold inline-flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <span>Looking for student fests &amp; campus activities?</span>
              <span className="underline">View Events</span>
              <ArrowRight size={13} />
            </button>
          )}
        </div>
      </LandingReveal>

      {/* =========================================================================
          3. SCANNABLE, HIGH-CONTRAST NOTICES FEED
          ========================================================================= */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500">
            <FileText size={36} className="mx-auto text-slate-300 mb-2" />
            <h4 className="font-bold text-slate-700 text-sm">No circulars found</h4>
            <p className="text-xs text-slate-400 mt-1">Try resetting the category filter or searching for another term.</p>
            <button
              onClick={() => {
                setSearch('');
                setCategoryFilter('ALL');
              }}
              className="mt-3 px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          filtered.map((item, idx) => {
            const isExpanded = expandedId === item.id;
            const dateObj = parseNoticeDate(item.event_date);
            const refNo = item.ref_no || `CCHE/NOTICE/2024-${item.id}`;

            return (
              <LandingReveal key={item.id} animation="fade-up" delay={Math.min(idx * 60, 240)} duration={600}>
                <div
                  className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-[#002147]/50 hover:shadow-md transition-all overflow-hidden group"
                >
                  <div className="p-5 sm:p-6 flex flex-col sm:flex-row items-start gap-4 sm:gap-5">
                    
                    {/* Left: Scannable Calendar Date Box */}
                    <div className="shrink-0 w-16 sm:w-20 rounded-xl bg-slate-50 border border-slate-200 flex flex-col items-center justify-center py-2.5 text-center shadow-2xs group-hover:border-[#4a6b28]/60 transition-colors">
                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#4a6b28]">
                        {dateObj.month}
                      </span>
                      <span className="text-2xl sm:text-3xl font-black text-[#002147] leading-none my-0.5">
                        {dateObj.day}
                      </span>
                      <span className="text-[10.5px] font-semibold text-slate-400">
                        {dateObj.year}
                      </span>
                    </div>

                    {/* Right: Main Content & Attachments */}
                    <div className="flex-1 min-w-0 space-y-2.5 w-full">
                      
                      {/* Notice Meta Line */}
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-md border border-slate-200">
                            {item.category || 'Official Notice'}
                          </span>
                          {item.is_featured ? (
                            <span className="text-[10.5px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
                              Notice • Important
                            </span>
                          ) : null}
                        </div>

                        <div className="flex items-center gap-2.5 ml-auto">
                          <span className="text-xs font-mono text-slate-400">
                            {refNo}
                          </span>
                          {isNoticeNew(item) && (
                            <span
                              className="inline-flex items-center gap-1.5 text-[10.5px] font-black uppercase tracking-wider text-white bg-[#1a4329] border border-[#285e3c] px-2.5 py-0.5 rounded-md shadow-xs ring-1 ring-emerald-950/20"
                              title="Released within last 3 days"
                            >
                              <span className="relative flex h-2 w-2 shrink-0">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-80"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                              </span>
                              <span>NEW</span>
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Notice Title */}
                      <h2 className="text-base sm:text-lg font-bold text-[#002147] tracking-tight leading-snug group-hover:text-[#4a6b28] transition-colors">
                        {item.title}
                      </h2>

                      {/* Factual, Readable Description */}
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                        {item.summary || (item.content ? item.content.substring(0, 180) + '...' : '')}
                      </p>

                      {/* Expandable Notice Body (Full Text) */}
                      {item.content && item.content !== item.summary && (
                        <div className="pt-1">
                          {isExpanded && (
                            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line mb-2">
                              {item.content}
                            </div>
                          )}
                          <button
                            onClick={() => setExpandedId(isExpanded ? null : item.id)}
                            className="text-xs text-[#002147] hover:text-[#4a6b28] font-bold inline-flex items-center gap-1 cursor-pointer transition-colors"
                          >
                            <span>{isExpanded ? 'Show Less' : 'Read Full Notice'}</span>
                            {isExpanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                          </button>
                        </div>
                      )}

                      {/* Action Attachments Cluster */}
                      {(item.pdf_url || item.image_url || item.link_url) && (
                        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2.5">
                          
                          {/* Download Attached PDF */}
                          {item.pdf_url && (
                            <a
                              href={item.pdf_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              download={item.pdf_name || 'Official_Notice.pdf'}
                              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-[#002147] hover:bg-[#4a6b28] transition-colors shadow-2xs cursor-pointer"
                            >
                              <Download size={13} className="shrink-0" />
                              <span>Download Official Routine / Form (PDF)</span>
                            </a>
                          )}

                          {/* View Official Paper Circular Scan */}
                          {item.image_url && (
                            <button
                              onClick={() => setSelectedImage(item.image_url)}
                              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-300 transition-colors shadow-2xs cursor-pointer"
                            >
                              <Eye size={13} className="text-[#4a6b28] shrink-0" />
                              <span>View Signed Circular Scan</span>
                            </button>
                          )}

                          {/* External Link / Google Form */}
                          {item.link_url && (
                            <a
                              href={item.link_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-300 transition-colors shadow-2xs cursor-pointer"
                            >
                              <ExternalLink size={13} className="text-blue-600 shrink-0" />
                              <span>Open Official Portal / Link</span>
                            </a>
                          )}

                        </div>
                      )}

                    </div>

                  </div>
                </div>
              </LandingReveal>
            );
          })
        )}
      </div>

      {/* =========================================================================
          4. LIGHTBOX IMAGE PREVIEW MODAL (SIGNED CIRCULAR SCAN)
          ========================================================================= */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-70 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="bg-white rounded-2xl overflow-hidden max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-[#002147] text-white p-3.5 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                <FileCheck size={14} className="text-[#b5d697]" />
                <span>Official Signed Circular Document Scan</span>
              </span>
              <div className="flex items-center gap-2">
                <a
                  href={selectedImage}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1 bg-white/10 hover:bg-white/20 rounded text-xs font-semibold inline-flex items-center gap-1 text-white transition-colors"
                >
                  <ExternalLink size={12} /> Open High-Res
                </a>
                <button
                  onClick={() => setSelectedImage(null)}
                  className="p-1 hover:bg-white/10 rounded text-slate-300 hover:text-white cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>
            </div>
            <div className="p-3 overflow-auto flex-1 flex items-center justify-center bg-slate-900">
              <img
                src={selectedImage}
                alt="Official Notice Scan"
                className="max-w-full max-h-[75vh] object-contain rounded shadow-lg"
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
