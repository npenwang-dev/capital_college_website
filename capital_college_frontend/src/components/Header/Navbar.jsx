import React, { useState, useEffect } from 'react';
import { Home, Menu, X, ChevronDown, ChevronRight, ArrowRight, GraduationCap, Search, Download, ExternalLink, Bell, FileText, Sparkles, Building2, Mail } from 'lucide-react';
import { ARTS_DEPARTMENTS, SCIENCE_DEPARTMENTS } from '../../data/departmentData';

export default function Navbar({
  currentPage = 'home',
  onNavigate,
  onOpenAdmission,
  onOpenTrackStatus,
  onOpenPrincipalMessage,
  onOpenCriteria,
  onOpenPrograms,
  onOpenFaculty,
  admissionsActive = false
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const [streamMenuOpen, setStreamMenuOpen] = useState(false);
  const [mobileStreamOpen, setMobileStreamOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 25) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleDropdown = (name) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  const handleSearchSubmit = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    const query = searchQuery.trim().toLowerCase();
    if (!query) return;

    setSearchOpen(false);
    setSearchQuery('');

    // 1. Courses & Academic Programmes (BA, B.Sc, NEP FYUGP)
    if (/course|program|degree|subject|art|science|ba|bsc|fyugp|honour|curriculum/i.test(query)) {
      onNavigate('programs');
      return;
    }

    // 2. Faculty & Departments
    if (/faculty|teacher|lecturer|prof|hod|department|staff/i.test(query)) {
      onNavigate('department-english');
      return;
    }

    // 3. Exam Routines & External Term Examinations
    if (/routine|exam|schedule|semester|cbcs/i.test(query)) {
      onNavigate('under-graduate-exam-routine-2023');
      return;
    }

    // 4. Official Notices & Circulars
    if (/notice|circular|news|update|event|announcement/i.test(query)) {
      onNavigate('notice');
      return;
    }

    // 5. Admissions, Criteria, Fees & Prospectus
    if (/admission|criteria|eligib|fee|prospectus|cutoff|form/i.test(query)) {
      onNavigate('criteria');
      return;
    }

    // 6. Principal's Message
    if (/principal|message|speech|vision|welcome/i.test(query)) {
      onNavigate('principal-message');
      return;
    }

    // 7. Profile & Institutional History
    if (/profile|about|history|management|sponsorship|governing/i.test(query)) {
      onNavigate('profile');
      return;
    }

    // 8. Students Council & Evangelical Union (EU)
    if (/student\s*council|council|evangelical|eu\b|student\s*union|cchesu/i.test(query)) {
      onNavigate('students-council-eu');
      return;
    }

    // 8b. Committees, Cells, Anti-Ragging, Alumni & Student Bodies
    if (/committee|cell|anti\s*ragging|grievance|alumni|pta/i.test(query)) {
      onNavigate('committees-and-in-charges');
      return;
    }

    // 9. Scholarships & Economically Weak Students Welfare Scheme
    if (/scholarship|welfare|scheme|financial|aid|quota/i.test(query)) {
      onNavigate('cche-scheme-for-economically-weak-students');
      return;
    }

    // 10. Student & Teacher Awards
    if (/award|topper|merit|cash/i.test(query)) {
      onNavigate('student-awards');
      return;
    }

    // 11. Rules & Regulations
    if (/rule|regulation|conduct|discipline|attendance/i.test(query)) {
      onNavigate('rules');
      return;
    }

    // 12. Academic Calendar
    if (/calendar|holiday|date|session/i.test(query)) {
      onNavigate('academic-calendar');
      return;
    }

    // 13. Campus Location, Maps & Directions
    if (/map|location|address|contact|p\.?r\.?\s*hill|thegaba|direction|reach/i.test(query)) {
      onNavigate('campus-location');
      return;
    }

    // 14. Photo Gallery
    if (/gallery|photo|picture|image|sports|cultural/i.test(query)) {
      onNavigate('gallery');
      return;
    }

    // 15. IQAC Composition
    if (/iqac|quality|naac/i.test(query)) {
      onNavigate('iqac');
      return;
    }

    // Fallback: Default directly to courses/programs
    onNavigate('programs');
  };

  // Streamlined 6 Consolidated Menus - Concise names to prevent horizontal overflow on all screen sizes
  const navLinks = [
    {
      name: 'Home',
      isHome: true,
      action: () => onNavigate('home'),
      isActive: currentPage === 'home'
    },
    {
      name: 'About Us',
      isActive: [
        'profile', 'college-profile-1', 'principal-message', 'sponsorship-and-management',
        'governing-body', 'college-administration', 'mous', 'iqac'
      ].includes(currentPage),
      children: [
        { label: 'College Profile', action: () => onNavigate('profile'), desc: 'History, emblem & objectives' },
        { label: 'Sponsorship & Management', action: () => onNavigate('sponsorship-and-management'), desc: 'Institutional trust & oversight' },
        { label: 'Governing Body', action: () => onNavigate('governing-body'), desc: 'Statutory governing council' },
        { label: 'College Administration', action: () => onNavigate('college-administration'), desc: 'Executive leadership & deans' },
        { label: 'IQAC Composition', action: () => onNavigate('iqac'), desc: 'Internal quality assurance cell' },
        { label: "MoU's & Collaborations", action: () => onNavigate('mous'), desc: 'Academic partnerships' }
      ]
    },
    {
      name: 'Academics',
      isActive: [
        'programs', 'rules', 'academic-calendar', 'arts-block', 'science-section',
        'under-graduate-exam-routine-2023', 'exam-routine'
      ].includes(currentPage) || (Boolean(currentPage) && currentPage.startsWith('department-')),
      children: [
        {
          label: 'Academic Departments',
          isStreamNav: true,
          desc: 'Arts & Science degree departments'
        },
        { label: 'Programmes & Courses (FYUGP)', action: () => onNavigate('programs'), desc: 'B.A. & B.Sc. 4-Year degrees' },
        { label: 'Academic Calendar', action: () => onNavigate('academic-calendar'), desc: 'Semester dates & holidays' },
        { label: 'UG Exam Routine (Nagaland Univ)', action: () => onNavigate('under-graduate-exam-routine-2023'), desc: 'CBCS & FYUGP semester exam schedules' },
        { label: 'Evaluation & Assessment', action: () => onNavigate('criteria'), desc: 'Grading & semester exams' },
        { label: 'Kohima Campus Library (Arts)', action: () => onNavigate('arts-block'), desc: 'P.R. Hill campus resources' },
        { label: 'Thegaba Campus Library (Science)', action: () => onNavigate('science-section'), desc: 'Permanent campus science block' },
        { label: 'Rules & Regulations', action: () => onNavigate('rules'), desc: 'Campus discipline & conduct' }
      ]
    },
    {
      name: 'Admissions',
      isActive: ['criteria'].includes(currentPage),
      children: [
        {
          label: admissionsActive ? 'Online Admission Form' : 'Online Admission Form (Closed for Now)',
          action: onOpenAdmission,
          highlight: admissionsActive,
          desc: admissionsActive ? 'Direct online application portal' : 'Online submissions paused for now'
        },
        {
          label: 'Admission Form (PDF)',
          href: '/admission_form.pdf',
          download: 'admission_form.pdf',
          desc: 'Download official print form for offline submission',
          highlight: !admissionsActive
        },
        { label: 'Criteria & Eligibility', action: () => onNavigate('criteria'), desc: 'Stream requirements & cutoff' },
        { label: 'Fee Structure', action: () => onNavigate('criteria'), desc: 'Affordable academic fees' },
        { label: 'CCHE Prospectus (PDF)', href: 'https://capitalcollege.edu.in/wp-content/uploads/2024/04/CCHE-Prospectus-2024-05.pdf', desc: 'Full institutional guide' },
        { label: 'Track Application Status', action: onOpenTrackStatus, desc: 'Real-time applicant tracking' }
      ]
    },
    {
      name: 'Campus Life',
      isActive: [
        'events', 'campus-events', 'committees-and-in-charges', 'committees', 'list-of-committees',
        'cche-scheme-for-economically-weak-students', 'scholarship', 'welfare-scheme',
        'student-awards', 'teachers-award', 'gallery', 'students-council-eu', 'student-council-eu',
        'students-council', 'eu'
      ].includes(currentPage),
      children: [
        { label: 'Campus Events & Activities', action: () => onNavigate('events'), desc: 'Trifecta fest, NSS, treks & fests', highlight: true },
        { label: 'Committees & In-Charges', action: () => onNavigate('committees-and-in-charges'), desc: '26 statutory committees & cells' },
        { label: 'Students Welfare Scheme', action: () => onNavigate('cche-scheme-for-economically-weak-students'), desc: 'CCHE 2-student quota criteria' },
        { label: 'State Scholarship Portal', href: 'https://scholarship.nagaland.gov.in/', desc: 'Govt. of Nagaland portal' },
        { label: 'Students Awards', action: () => onNavigate('student-awards'), desc: 'Toppers & distinction cash awards' },
        { label: 'Teachers Awards', action: () => onNavigate('teachers-award'), desc: 'Faculty excellence recognition' },
        { label: 'Students Council & EU', action: () => onNavigate('students-council-eu'), desc: 'Student Union, leadership & fellowship' },
        { label: 'Campus Map & Directions', action: () => onNavigate('campus-location'), desc: 'P.R. Hill & Thegaba maps' },
        { label: 'Photo Gallery', action: () => onNavigate('gallery'), desc: 'Sports, festivals & memories' }
      ]
    }
  ];

  return (
    <nav
      className={`bg-[#002147] text-white sticky top-0 z-40 w-full transition-all duration-300 border-b ${
        scrolled
          ? 'shadow-2xl border-[#4a6b28]/40 bg-[#002147]/95 backdrop-blur-md'
          : 'shadow-lg border-blue-900/80 bg-[#002147]'
      }`}
    >
      <div className="max-w-[1600px] mx-auto px-2.5 min-[400px]:px-3 sm:px-5 xl:px-4 2xl:px-8">
        <div className="flex items-center justify-between min-h-[82px] md:min-h-[96px] py-2 gap-3 sm:gap-3 xl:gap-3 2xl:gap-4">
          
          {/* Official College Brand Identity: Authentic Crest + Razor-Sharp Modern Typography */}
          <div
            className="flex items-center gap-1.5 min-[400px]:gap-2 sm:gap-3 cursor-pointer py-1 group select-none shrink-0"
            onClick={() => onNavigate('home')}
            title="Capital College of Higher Education, Kohima"
          >
            <div className="relative shrink-0 flex items-center justify-center">
              <img
                src="/college-crest-hd.png"
                alt="Capital College Crest"
                className="h-10 min-[400px]:h-12 sm:h-14 md:h-16 lg:h-[62px] w-auto object-contain block transition-all duration-400 ease-out group-hover:scale-108 group-hover:-rotate-1 group-hover:drop-shadow-[0_4px_16px_rgba(143,195,94,0.45)] drop-shadow-md shrink-0"
                onError={(e) => {
                  e.target.src = 'https://capitalcollege.edu.in/wp-content/uploads/2021/01/cropped-logo-1-3-1-1.png';
                }}
              />
              {/* Subtle specular gleam flash on hover */}
              <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
              </div>
            </div>
            <div className="flex flex-col text-left justify-center">
              <span className="font-sans font-black text-white text-[13px] min-[400px]:text-base sm:text-lg md:text-xl xl:text-[20px] 2xl:text-[22px] tracking-wide uppercase leading-tight drop-shadow-sm group-hover:text-[#b5d697] group-hover:drop-shadow-[0_2px_12px_rgba(181,214,151,0.35)] transition-all duration-300">
                Capital College
              </span>
              <span className="text-[8px] min-[400px]:text-[10px] sm:text-[11px] md:text-xs font-bold text-[#b5d697] tracking-[0.1em] min-[400px]:tracking-[0.15em] group-hover:tracking-[0.18em] uppercase leading-tight mt-0.5 transition-all duration-300">
                Of Higher Education
              </span>
              <span className="text-[9px] sm:text-[9.5px] text-slate-300/85 tracking-widest uppercase font-medium mt-0.5 hidden sm:block">
                Kohima, Nagaland • Estd. 2004
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links (Consolidated 6 Menus with comfortable sizing & height parity) */}
          <div className="hidden xl:flex items-center space-x-0.5 xl:space-x-1 2xl:space-x-1.5 flex-nowrap">
            {navLinks.map((item) => (
              <div
                key={item.name}
                className="relative group"
                onMouseEnter={() => setOpenDropdown(item.name)}
                onMouseLeave={() => {
                  setOpenDropdown(null);
                  setStreamMenuOpen(false);
                }}
              >
                <button
                  onClick={() => {
                    if (item.action) {
                      item.action();
                    } else if (item.children && item.children.length > 0) {
                      item.children[0].action && item.children[0].action();
                    }
                  }}
                  title={item.name}
                  aria-label={item.name}
                  className={`h-10 ${
                    item.isHome ? 'w-10 px-0 justify-center' : 'px-2 xl:px-2.5 2xl:px-4 justify-start'
                  } text-[12.5px] xl:text-[13px] 2xl:text-[14px] font-semibold rounded-lg transition-all flex items-center gap-1 xl:gap-1.5 whitespace-nowrap tracking-wide select-none cursor-pointer ${
                    item.isActive
                      ? 'text-[#b5d697] bg-white/10 font-bold'
                      : openDropdown === item.name
                      ? 'text-white bg-white/10 font-semibold'
                      : 'text-slate-100 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {item.isHome ? (
                    <Home size={18} className="transition-transform duration-200 group-hover:scale-110 shrink-0" />
                  ) : (
                    <span>{item.name}</span>
                  )}
                  {item.children && (
                    <ChevronDown
                      size={13}
                      className={`transition-transform duration-300 ${
                        openDropdown === item.name
                          ? 'rotate-180 text-[#b5d697]'
                          : item.isActive
                          ? 'text-[#b5d697]'
                          : 'text-slate-400 group-hover:text-[#b5d697]'
                      }`}
                    />
                  )}
                </button>

                {/* Submenu Mega Dropdown with Solid High-Contrast Background */}
                {item.children && openDropdown === item.name && (
                  <div
                    className="absolute left-0 mt-1 w-72 border-t-2 border-[#4a6b28] shadow-[0_20px_50px_rgba(0,0,0,0.7)] rounded-b-2xl py-2 z-50 animate-fadeIn border-x border-b border-white/10 divide-y divide-white/5"
                    style={{ backgroundColor: '#001428' }}
                  >
                    {item.children.map((subItem) => {
                      if (subItem.isStreamNav) {
                        return (
                          <div
                            key={subItem.label}
                            className="group/stream"
                            onMouseEnter={() => setStreamMenuOpen(true)}
                            onMouseLeave={() => setStreamMenuOpen(false)}
                          >
                            <button
                              type="button"
                              onClick={() => setStreamMenuOpen(!streamMenuOpen)}
                              className="w-full text-left px-4 py-2.5 hover:bg-white/10 transition-colors flex items-center justify-between cursor-pointer group/stream"
                            >
                              <div className="flex-1 pr-2">
                                <span className="text-[13px] font-semibold text-slate-200 group-hover/stream:text-[#b5d697] transition-colors">
                                  {subItem.label}
                                </span>
                                {subItem.desc && (
                                  <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                                    {subItem.desc}
                                  </p>
                                )}
                              </div>
                              <ChevronRight
                                size={14}
                                className={`text-slate-400 transition-transform ${
                                  streamMenuOpen ? 'translate-x-1 text-white' : 'group-hover/stream:translate-x-1 group-hover/stream:text-white'
                                }`}
                              />
                            </button>

                            {/* Flyout Submenu to the right: Clean Collegiate Departments Directory */}
                            {streamMenuOpen && (
                              <div
                                className="absolute left-full top-0 -ml-1 w-[460px] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.85)] rounded-xl p-4 z-50 animate-fadeIn before:absolute before:-left-3 before:top-0 before:w-3 before:bottom-0 before:content-[''] select-none"
                                style={{ backgroundColor: '#001428', opacity: 1 }}
                                onMouseEnter={() => setStreamMenuOpen(true)}
                                onMouseLeave={() => setStreamMenuOpen(false)}
                              >
                                <div className="pb-2.5 mb-3 border-b border-white/10">
                                  <h4 className="text-[13px] font-bold text-white tracking-wide">
                                    Academic Departments
                                  </h4>
                                  <p className="text-[11px] text-slate-400 font-normal mt-0.5">
                                    Undergraduate Degree Programmes • Nagaland University (FYUGP)
                                  </p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                  {/* ARTS STREAM */}
                                  <div>
                                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider pb-1.5 border-b border-white/10 mb-2">
                                      Arts Stream (B.A.)
                                    </div>
                                    <div className="space-y-0.5">
                                      {ARTS_DEPARTMENTS.map((dept) => (
                                        <button
                                          key={dept.slug}
                                          type="button"
                                          onClick={() => {
                                            setOpenDropdown(null);
                                            setStreamMenuOpen(false);
                                            onNavigate(`department-${dept.slug}`);
                                          }}
                                          className="w-full text-left px-2 py-1.5 rounded-md text-[12px] font-medium text-slate-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                                        >
                                          {dept.name.replace('Department of ', '')}
                                        </button>
                                      ))}
                                    </div>
                                  </div>

                                  {/* SCIENCE STREAM */}
                                  <div className="flex flex-col justify-between">
                                    <div>
                                      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider pb-1.5 border-b border-white/10 mb-2">
                                        Science Stream (B.Sc.)
                                      </div>
                                      <div className="space-y-0.5">
                                        {SCIENCE_DEPARTMENTS.map((dept) => (
                                          <button
                                            key={dept.slug}
                                            type="button"
                                            onClick={() => {
                                              setOpenDropdown(null);
                                              setStreamMenuOpen(false);
                                              onNavigate(`department-${dept.slug}`);
                                            }}
                                            className="w-full text-left px-2 py-1.5 rounded-md text-[12px] font-medium text-slate-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                                          >
                                            {dept.name.replace('Department of ', '')}
                                          </button>
                                        ))}
                                      </div>
                                    </div>

                                    {/* Science Section Campus Link */}
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setOpenDropdown(null);
                                        setStreamMenuOpen(false);
                                        onNavigate('science-section');
                                      }}
                                      className="pt-2.5 mt-3 border-t border-white/10 text-[11px] font-medium text-slate-400 hover:text-white flex items-center justify-between cursor-pointer transition-colors w-full"
                                    >
                                      <span>Science Campus, Thegaba</span>
                                      <ChevronRight size={12} className="text-slate-400" />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      }

                      return subItem.href ? (
                        <a
                          key={subItem.label}
                          href={subItem.href}
                          onMouseEnter={() => setStreamMenuOpen(false)}
                          download={subItem.download || undefined}
                          target={subItem.download ? undefined : "_blank"}
                          rel="noopener noreferrer"
                          className="block px-4 py-2.5 hover:bg-white/10 transition-colors group/item"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[13px] font-semibold text-slate-200 group-hover/item:text-[#b5d697] transition-colors">
                              {subItem.label}
                            </span>
                            {subItem.download ? (
                              <Download size={13} className="text-slate-400 group-hover/item:text-[#b5d697] arrow-slide" />
                            ) : (
                              <ExternalLink size={12} className="text-slate-400 group-hover/item:text-[#b5d697]" />
                            )}
                          </div>
                          {subItem.desc && (
                            <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                              {subItem.desc}
                            </p>
                          )}
                        </a>
                      ) : (
                        <button
                          key={subItem.label}
                          onMouseEnter={() => setStreamMenuOpen(false)}
                          onClick={() => {
                            setOpenDropdown(null);
                            subItem.action && subItem.action();
                          }}
                          className={`w-full text-left px-4 py-2.5 hover:bg-white/10 transition-colors group/item cursor-pointer ${
                            subItem.highlight ? 'bg-[#4a6b28]/25' : ''
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span
                              className={`text-[13px] font-semibold transition-colors ${
                                subItem.highlight
                                  ? 'text-[#b5d697] font-bold'
                                  : 'text-slate-200 group-hover/item:text-[#b5d697]'
                              }`}
                            >
                              {subItem.label}
                            </span>
                          </div>
                          {subItem.desc && (
                            <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                              {subItem.desc}
                            </p>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Header Action Buttons: Exact Parity in Height & Theme */}
          <div className="hidden xl:flex items-center gap-2 2xl:gap-3 shrink-0">
            {/* Notice Board Page Button */}
            <button
              onClick={() => onNavigate('notice')}
              className={`h-10 px-3 2xl:px-3.5 rounded-lg text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5 shadow-xs hover:shadow transition-all whitespace-nowrap btn-lift cursor-pointer group border ${
                ['notice', 'notices'].includes(currentPage)
                  ? 'bg-[#4a6b28] text-white border-[#648d35]'
                  : 'bg-white/10 hover:bg-[#4a6b28] text-slate-100 hover:text-white border-white/20 hover:border-[#648d35]'
              }`}
              title="Official Notice Board & Circulars"
            >
              <Bell size={14} className="text-amber-300 animate-bell-blink group-hover:text-white transition-colors shrink-0" />
              <span>Notice Board</span>
            </button>

            {/* Contact Us Page Button */}
            <button
              onClick={() => onNavigate('contact')}
              className={`h-10 px-3 2xl:px-3.5 rounded-lg text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5 shadow-xs hover:shadow transition-all whitespace-nowrap btn-lift cursor-pointer group border ${
                ['contact', 'contact-us'].includes(currentPage)
                  ? 'bg-[#4a6b28] text-white border-[#648d35]'
                  : 'bg-white/10 hover:bg-[#4a6b28] text-slate-100 hover:text-white border-white/20 hover:border-[#648d35]'
              }`}
              title="Contact Us & Helpdesk"
            >
              <Mail size={14} className="text-[#8fc35e] group-hover:text-white transition-colors shrink-0" />
              <span>Contact Us</span>
            </button>

            {admissionsActive ? (
              /* When Admissions Open: Primary Apply Online */
              <button
                onClick={onOpenAdmission}
                className="h-10 bg-[#4a6b28] hover:bg-[#3d5920] text-white border border-[#648d35] px-3.5 2xl:px-4 rounded-lg text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5 shadow-sm hover:shadow transition-all whitespace-nowrap btn-lift cursor-pointer group"
                title="Online Admission Application"
              >
                <GraduationCap size={15} className="icon-spring" />
                <span>Apply Online</span>
              </button>
            ) : (
              /* When Admissions Closed for Now: Primary Offline PDF Form in Official Logo Green */
              <a
                href="/admission_form.pdf"
                download="admission_form.pdf"
                className="h-10 bg-[#4a6b28] hover:bg-[#3d5920] text-white border border-[#648d35] px-3.5 2xl:px-4 rounded-lg text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2 shadow-sm hover:shadow transition-all whitespace-nowrap btn-lift cursor-pointer group"
                title="Download Official Capital College Admission Form (PDF)"
              >
                <Download size={14} className="icon-spring" />
                <span><span className="hidden 2xl:inline">Offline </span>Form (PDF)</span>
              </a>
            )}

            {/* Desktop Search Toggle Button */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className={`h-10 w-10 flex items-center justify-center rounded-lg transition-all cursor-pointer shrink-0 border btn-lift ${
                searchOpen
                  ? 'bg-[#4a6b28] text-white border-[#648d35] shadow-sm'
                  : 'text-slate-200 hover:text-white bg-white/10 hover:bg-[#4a6b28] border-white/20 hover:border-[#648d35]'
              }`}
              title={searchOpen ? 'Close Search' : 'Search Capital College'}
              aria-label={searchOpen ? 'Close Search' : 'Search'}
            >
              {searchOpen ? <X size={18} /> : <Search size={16} />}
            </button>

          </div>

          {/* Mobile & Tablet Toggle Controls */}
          <div className="xl:hidden flex items-center gap-2 min-[400px]:gap-2.5 sm:gap-2 shrink-0 ml-1">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigate('home');
              }}
              className={`h-8 w-8 sm:h-9 sm:w-9 rounded-lg flex items-center justify-center transition-all cursor-pointer border ${
                currentPage === 'home'
                  ? 'bg-[#4a6b28] text-white border-[#648d35]'
                  : 'bg-white/10 hover:bg-[#4a6b28] text-slate-200 hover:text-white border-white/20'
              }`}
              title="Home"
              aria-label="Home"
            >
              <Home size={16} />
            </button>

            {/* Mobile Notice Board Button */}
            <button
              onClick={() => onNavigate('notice')}
              className={`h-8 sm:h-9 px-2 sm:px-2.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer border text-[11px] sm:text-xs font-bold ${
                ['notice', 'notices'].includes(currentPage)
                  ? 'bg-[#4a6b28] text-white border-[#648d35]'
                  : 'bg-white/10 hover:bg-[#4a6b28] text-slate-200 hover:text-white border-white/20'
              }`}
              title="Official Notice Board"
            >
              <Bell size={13} className="text-amber-300 animate-bell-blink" />
              <span className="hidden xs:inline">Notices</span>
            </button>

            {/* Mobile Search Toggle Button */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className={`h-8 w-8 sm:h-9 sm:w-9 rounded-lg flex items-center justify-center transition-all cursor-pointer border ${
                searchOpen
                  ? 'bg-[#4a6b28] text-white border-[#648d35]'
                  : 'bg-white/10 hover:bg-[#4a6b28] text-slate-200 hover:text-white border-white/20'
              }`}
              title={searchOpen ? 'Close Search' : 'Search Capital College'}
              aria-label="Search"
            >
              {searchOpen ? <X size={16} /> : <Search size={15} />}
            </button>

            {admissionsActive ? (
              <button
                onClick={onOpenAdmission}
                className="bg-[#4a6b28] hover:bg-[#3d5920] text-white border border-[#648d35] px-2.5 sm:px-3 py-1.5 rounded-lg text-[11px] sm:text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5 shadow-xs whitespace-nowrap cursor-pointer"
              >
                <GraduationCap size={13} />
                <span>Apply</span>
              </button>
            ) : null}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-slate-200 hover:text-white p-1.5 rounded focus:outline-none cursor-pointer"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Expandable Search Bar */}
        {searchOpen && (
          <form
            onSubmit={handleSearchSubmit}
            className="py-2.5 sm:py-3 px-3.5 sm:px-5 bg-[#001736]/95 backdrop-blur-xl border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-center gap-2 sm:gap-3 animate-fadeIn rounded-2xl mb-3 mt-1.5"
          >
            <Search size={17} className="text-[#8fc35e] shrink-0" />
            <input
              type="text"
              placeholder="Search Capital College (Courses, Faculty, Notices, Routines, Admissions)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSearchSubmit(e);
                }
              }}
              className="w-full bg-transparent text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none py-1"
              autoFocus
            />

            {/* Clear Input Button */}
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-slate-400 hover:text-white p-1 rounded transition-colors cursor-pointer shrink-0"
                title="Clear input"
              >
                <X size={15} />
              </button>
            )}

            {/* Primary Search Submit Button */}
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-1.5 text-xs font-bold uppercase tracking-wider bg-[#4a6b28] hover:bg-[#3d5920] text-white border border-[#648d35] px-3.5 sm:px-4 py-2 rounded-lg shadow-sm hover:shadow transition-all cursor-pointer shrink-0 active:scale-95"
              title="Search Capital College"
            >
              <Search size={13} className="shrink-0" />
              <span>Search</span>
            </button>

            {/* Close Search Bar Button */}
            <button
              type="button"
              onClick={() => setSearchOpen(false)}
              className="text-slate-300 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer shrink-0"
              title="Close search"
              aria-label="Close search"
            >
              <X size={17} />
            </button>
          </form>
        )}

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="xl:hidden py-4 border-t border-blue-900/80 space-y-2 max-h-[80vh] overflow-y-auto px-1 animate-fadeIn">
            {navLinks.map((item) => (
              <div key={item.name} className="border-b border-blue-900/40 pb-1.5">
                {item.children ? (
                  <div>
                    <button
                      onClick={() => toggleDropdown(item.name)}
                      className={`w-full text-left px-3.5 py-2.5 text-sm sm:text-base font-bold flex items-center justify-between ${
                        item.isActive ? 'text-[#b5d697]' : 'text-slate-200 hover:text-[#b5d697]'
                      }`}
                    >
                      <span>{item.name}</span>
                      <ChevronDown
                        size={16}
                        className={`transition-transform duration-200 ${
                          openDropdown === item.name ? 'rotate-180 text-[#8fc35e]' : 'text-slate-400'
                        }`}
                      />
                    </button>
                    {openDropdown === item.name && (
                      <div className="bg-[#001736] py-2 pl-4 pr-3 space-y-1 rounded-lg mb-2 divide-y divide-blue-900/30">
                        {item.children.map((subItem) => {
                          if (subItem.isStreamNav) {
                            return (
                              <div key={subItem.label} className="py-1">
                                <button
                                  type="button"
                                  onClick={() => setMobileStreamOpen(!mobileStreamOpen)}
                                  className="w-full text-left py-2 text-sm text-slate-200 font-medium flex items-center justify-between cursor-pointer"
                                >
                                  <span>{subItem.label}</span>
                                  <ChevronDown
                                    size={14}
                                    className={`transition-transform duration-200 ${
                                      mobileStreamOpen ? 'rotate-180 text-white' : 'text-slate-400'
                                    }`}
                                  />
                                </button>

                                {mobileStreamOpen && (
                                  <div className="pl-3 pr-2 py-2 space-y-2 bg-white/5 rounded-lg border border-white/10 text-xs">
                                    <div>
                                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 pt-1">
                                        Arts Stream (B.A.)
                                      </div>
                                      <div className="space-y-0.5 pl-1">
                                        {ARTS_DEPARTMENTS.map((dept) => (
                                          <button
                                            key={dept.slug}
                                            onClick={() => {
                                              setMobileMenuOpen(false);
                                              onNavigate(`department-${dept.slug}`);
                                            }}
                                            className="block w-full text-left py-1 text-xs text-slate-300 hover:text-white"
                                          >
                                            {dept.name.replace('Department of ', '')}
                                          </button>
                                        ))}
                                      </div>
                                    </div>

                                    <div className="pt-2 border-t border-white/10">
                                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 pt-1">
                                        Science Stream (B.Sc.)
                                      </div>
                                      <div className="space-y-0.5 pl-1">
                                        {SCIENCE_DEPARTMENTS.map((dept) => (
                                          <button
                                            key={dept.slug}
                                            onClick={() => {
                                              setMobileMenuOpen(false);
                                              onNavigate(`department-${dept.slug}`);
                                            }}
                                            className="block w-full text-left py-1 text-xs text-slate-300 hover:text-white"
                                          >
                                            {dept.name.replace('Department of ', '')}
                                          </button>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          }

                          return subItem.href ? (
                            <a
                              key={subItem.label}
                              href={subItem.href}
                              download={subItem.download || undefined}
                              target={subItem.download ? undefined : "_blank"}
                              rel="noopener noreferrer"
                              className="block py-2 text-sm text-slate-300 hover:text-[#b5d697]"
                            >
                              <div className="flex items-center justify-between">
                                <span>{subItem.label}</span>
                                {subItem.download ? (
                                  <Download size={13} className="text-slate-400" />
                                ) : (
                                  <ExternalLink size={12} className="text-slate-400" />
                                )}
                              </div>
                            </a>
                          ) : (
                            <button
                              key={subItem.label}
                              onClick={() => {
                                setMobileMenuOpen(false);
                                subItem.action && subItem.action();
                              }}
                              className={`block w-full text-left py-2 text-sm ${
                                subItem.highlight
                                  ? 'text-[#b5d697] font-bold'
                                  : 'text-slate-300 hover:text-[#b5d697]'
                              }`}
                            >
                              {subItem.label}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      item.action();
                    }}
                    className={`w-full text-left px-3.5 py-2.5 text-sm sm:text-base font-bold flex items-center gap-2.5 ${
                      item.isActive ? 'text-[#b5d697]' : 'text-slate-200 hover:text-[#b5d697]'
                    }`}
                  >
                    {item.isHome && <Home size={18} className="shrink-0" />}
                    <span>{item.name}</span>
                  </button>
                )}
              </div>
            ))}

            <div className="pt-3 flex flex-col gap-2">
              {/* Mobile Drawer Notice Board Button */}
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onNavigate && onNavigate('notice');
                }}
                className="w-full bg-[#001736] hover:bg-[#4a6b28] text-white border border-[#4a6b28]/60 py-2.5 rounded-lg text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
              >
                <Bell size={16} className="text-amber-300 animate-bell-blink" />
                <span>Official Notice Board</span>
              </button>

              {/* Mobile Drawer Contact Us Button */}
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onNavigate && onNavigate('contact');
                }}
                className={`w-full py-2.5 rounded-lg text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 border transition-all cursor-pointer shadow-xs ${
                  ['contact', 'contact-us'].includes(currentPage)
                    ? 'bg-[#4a6b28] text-white border-[#648d35]'
                    : 'bg-white/10 hover:bg-[#4a6b28] text-slate-100 hover:text-white border-white/20'
                }`}
              >
                <Mail size={16} className="text-[#8fc35e]" />
                <span>Contact Us &amp; Helpdesk</span>
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAdmission && onOpenAdmission();
                }}
                className="w-full bg-[#4a6b28] hover:bg-[#3d5920] text-white border border-[#648d35] py-2.5 rounded-lg text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-xs cursor-pointer"
              >
                <GraduationCap size={16} />
                <span>Apply Online</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
