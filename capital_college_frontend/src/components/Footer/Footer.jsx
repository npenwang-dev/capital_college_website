import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  Search,
  Download,
  ExternalLink,
  MapPin,
  Facebook,
  Instagram,
  Youtube,
  Twitter,
  Linkedin,
  Send,
  MessageCircle
} from 'lucide-react';
import LandingReveal from '../Common/LandingReveal';
import { apiFetch } from '../../utils/api';

// Authentic Official WhatsApp Icon
const WhatsAppIcon = ({ size = 18, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const renderSocialIcon = (platform, size = 18) => {
  const p = (platform || '').toLowerCase();
  if (p === 'whatsapp') return <WhatsAppIcon size={size} />;
  if (p === 'facebook') return <Facebook size={size} />;
  if (p === 'instagram') return <Instagram size={size} />;
  if (p === 'youtube') return <Youtube size={size} />;
  if (p === 'twitter') return <Twitter size={size} />;
  if (p === 'linkedin') return <Linkedin size={size} />;
  if (p === 'telegram') return <Send size={size} />;
  return <MessageCircle size={size} />;
};

const DEFAULT_SOCIAL = [
  { id: 1, platform: 'facebook', label: 'Facebook', url: 'https://www.facebook.com/capitalcollege.kohima', is_active: 1 },
  { id: 2, platform: 'instagram', label: 'Instagram', url: 'https://www.instagram.com/capital_college_of_higher_educ/', is_active: 1 }
];

export default function Footer({ onOpenAdmission, onOpenAdmin, onOpenTopic, onNavigate }) {
  const [searchVal, setSearchVal] = useState('');
  const [socialLinks, setSocialLinks] = useState(DEFAULT_SOCIAL);

  const loadSocial = async () => {
    try {
      const res = await apiFetch('/api/social-links?active_only=true');
      if (res.ok) {
        const data = await res.json();
        if (data && data.success && Array.isArray(data.links) && data.links.length > 0) {
          const filtered = data.links.filter((l) => (l.platform || '').toLowerCase() !== 'whatsapp');
          setSocialLinks(filtered);
        }
      }
    } catch {}
  };

  useEffect(() => {
    loadSocial();
    const handleUpdate = () => loadSocial();
    window.addEventListener('cche_social_updated', handleUpdate);
    return () => window.removeEventListener('cche_social_updated', handleUpdate);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchVal.trim()) return;
    const term = searchVal.trim().toLowerCase();

    if (/course|program|degree|subject|art|science|ba|bsc|fyugp/i.test(term)) {
      if (onNavigate) onNavigate('programs');
      else window.location.href = '/programs-and-courses';
    } else if (term.includes('form') || term.includes('admiss') || term.includes('criteria') || term.includes('fee')) {
      if (onNavigate) onNavigate('criteria');
      else window.open('/admission_form.pdf', '_blank');
    } else if (term.includes('princ') || term.includes('speech')) {
      if (onNavigate) onNavigate('principal-message');
      else window.location.href = '/principal-message';
    } else if (term.includes('facul') || term.includes('dep') || term.includes('teacher') || term.includes('prof')) {
      if (onNavigate) onNavigate('department-english');
      else window.location.href = '/department/english';
    } else if (term.includes('routine') || term.includes('exam')) {
      if (onNavigate) onNavigate('under-graduate-exam-routine-2023');
      else window.location.href = '/under-graduate-exam-routine-2023';
    } else if (term.includes('notice') || term.includes('update') || term.includes('event')) {
      if (onNavigate) onNavigate('notice');
      else window.location.href = '/notice';
    } else if (term.includes('committee') || term.includes('alumni') || term.includes('cell')) {
      if (onNavigate) onNavigate('committees-and-in-charges');
      else window.location.href = '/committees-and-in-charges';
    } else if (term.includes('scholarship') || term.includes('welfare')) {
      if (onNavigate) onNavigate('cche-scheme-for-economically-weak-students');
      else window.location.href = '/cche-scheme-for-economically-weak-students';
    } else if (term.includes('award')) {
      if (onNavigate) onNavigate('student-awards');
      else window.location.href = '/student-awards';
    } else if (term.includes('map') || term.includes('location')) {
      if (onNavigate) onNavigate('campus-location');
      else window.location.href = '/#campus-location';
    } else if (term.includes('contact') || term.includes('mail') || term.includes('query') || term.includes('helpdesk')) {
      if (onNavigate) onNavigate('contact');
      else window.location.href = '/contact';
    } else if (term.includes('prof') || term.includes('about')) {
      if (onNavigate) onNavigate('profile');
      else window.location.href = '/college-profile-1';
    } else {
      if (onNavigate) onNavigate('programs');
      else window.location.href = '/programs-and-courses';
    }
    setSearchVal('');
  };

  return (
    <footer className="bg-[#002147] text-white pt-8 pb-6 sm:pt-12 sm:pb-8 border-t-4 border-[#4a6b28]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <LandingReveal animation="fade-up" duration={750}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-7 sm:gap-8 pb-7 sm:pb-10 border-b border-blue-900/60">
            
            {/* Column 1: Campus Address */}
            <div>
              <h3 className="text-sm sm:text-base font-extrabold uppercase tracking-wider text-white">
                Campus Address
              </h3>
              <div className="flex items-center gap-1.5 mt-2 mb-3.5">
                <span className="h-[2.5px] w-8 bg-[#4a6b28] rounded-full"></span>
                <span className="h-[2.5px] w-2.5 bg-[#8fc35e] rounded-full"></span>
              </div>
              <div className="text-xs text-gray-300 leading-relaxed space-y-2 pt-0.5">
                <p className="font-medium text-slate-200">Capital College of Higher Education</p>
                <p>P.R. Hill, Kohima, Nagaland 797001</p>
                <p className="text-slate-400">College Timing: 9:00 am to 4:00 pm</p>
                <div className="pt-1">
                  <a
                    href="https://maps.app.goo.gl/2KvZgYK1h9WKFdvv7?g_st=ac"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-9 items-center gap-1.5 py-1 text-[#b5d697] hover:text-white font-semibold transition-colors group cursor-pointer"
                    title="Open Capital College Kohima in Google Maps"
                  >
                    <MapPin size={13} className="text-[#8fc35e] group-hover:scale-110 transition-transform" />
                    <span>View on Google Maps</span>
                    <ExternalLink size={10} />
                  </a>
                </div>
              </div>
            </div>

            {/* Column 2: Important Links */}
            <div>
              <h3 className="text-sm sm:text-base font-extrabold uppercase tracking-wider text-white">
                Important Links
              </h3>
              <div className="flex items-center gap-1.5 mt-2 mb-3.5">
                <span className="h-[2.5px] w-8 bg-[#4a6b28] rounded-full"></span>
                <span className="h-[2.5px] w-2.5 bg-[#8fc35e] rounded-full"></span>
              </div>
              <ul className="space-y-1.5 sm:space-y-2 text-xs text-gray-300 pt-0.5 font-medium">
                <li>
                  <a
                    href="https://scholarship.nagaland.gov.in/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="min-h-9 py-2 hover:text-[#b5d697] transition-colors inline-flex items-center gap-1"
                  >
                    <span>State Scholarship Portal</span>
                    <ExternalLink size={10} className="text-slate-400" />
                  </a>
                </li>
                <li>
                  <a
                    href="https://scholarships.gov.in/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="min-h-9 py-2 hover:text-[#b5d697] transition-colors inline-flex items-center gap-1"
                  >
                    <span>National Scholarship Portal</span>
                    <ExternalLink size={10} className="text-slate-400" />
                  </a>
                </li>
                <li>
                  <a
                    href="https://nagalanduniversity.ac.in/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="min-h-9 py-2 hover:text-[#b5d697] transition-colors inline-flex items-center gap-1"
                  >
                    <span>Nagaland University</span>
                    <ExternalLink size={10} className="text-slate-400" />
                  </a>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => onNavigate && onNavigate('contact')}
                    className="min-h-9 py-2 hover:text-[#b5d697] transition-colors inline-flex items-center gap-1 cursor-pointer"
                  >
                    <span>Contact Us &amp; Helpdesk</span>
                  </button>
                </li>
                <li className="pt-1.5">
                  <a
                    href="/admission_form.pdf"
                    download="admission_form.pdf"
                    className="inline-flex min-h-10 items-center gap-1.5 bg-[#4a6b28] hover:bg-[#3d5920] text-white px-3 py-2 rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer"
                  >
                    <Download size={13} />
                    <span>Admission Form (PDF)</span>
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 3: Social & Media */}
            <div>
              <h3 className="text-sm sm:text-base font-extrabold uppercase tracking-wider text-white">
                Social Media Links
              </h3>
              <div className="flex items-center gap-1.5 mt-2 mb-3.5">
                <span className="h-[2.5px] w-8 bg-[#4a6b28] rounded-full"></span>
                <span className="h-[2.5px] w-2.5 bg-[#8fc35e] rounded-full"></span>
              </div>
              <p className="text-xs text-slate-300 mb-3">
                Follow our official college channels for campus life updates &amp; student activities.
              </p>
              <div className="flex flex-wrap items-center gap-2.5 pt-0.5">
                {socialLinks.map((item) => {
                  const p = (item.platform || '').toLowerCase();
                  const isWa = p === 'whatsapp';
                  return (
                    <a
                      key={item.id || item.platform}
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg border cursor-pointer ${
                        isWa
                          ? 'bg-[#25D366]/20 hover:bg-[#25D366] text-[#25D366] hover:text-white border-[#25D366]/40 hover:border-[#25D366]'
                          : 'bg-white/10 hover:bg-[#4a6b28] text-slate-200 hover:text-white border-white/10 hover:border-[#648d35]'
                      }`}
                      title={item.label || item.platform}
                      aria-label={item.label || item.platform}
                    >
                      {renderSocialIcon(p, 18)}
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Column 4: Search Widget */}
            <div className="hidden sm:block">
              <h3 className="text-sm sm:text-base font-extrabold uppercase tracking-wider text-white">
                Search
              </h3>
              <div className="flex items-center gap-1.5 mt-2 mb-3.5">
                <span className="h-[2.5px] w-8 bg-[#4a6b28] rounded-full"></span>
                <span className="h-[2.5px] w-2.5 bg-[#8fc35e] rounded-full"></span>
              </div>
              <form onSubmit={handleSearch} className="flex items-center pt-0.5">
                <input
                  type="search"
                  placeholder="Search courses, notices, routines..."
                  value={searchVal}
                  onChange={(e) => setSearchVal(e.target.value)}
                  className="bg-white text-gray-900 text-xs px-3.5 py-2 rounded-l-xl focus:outline-none w-full border border-gray-300 h-11 placeholder-slate-400"
                />
                <button
                  type="submit"
                  aria-label="Submit search"
                  title="Search Capital College"
                  className="bg-[#4a6b28] hover:bg-[#3d5920] text-white px-3.5 py-2 rounded-r-xl transition-colors cursor-pointer h-11 flex items-center justify-center shrink-0 border border-l-0 border-[#4a6b28]"
                >
                  <Search size={15} />
                </button>
              </form>
              <div className="flex flex-wrap gap-1.5 mt-2.5">
                <button
                  onClick={() => onNavigate && onNavigate('programs')}
                  className="text-[10px] text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 px-2 py-0.5 rounded-md border border-white/10 cursor-pointer"
                >
                  FYUGP Courses
                </button>
                <button
                  onClick={() => onNavigate && onNavigate('notice')}
                  className="text-[10px] text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 px-2 py-0.5 rounded-md border border-white/10 cursor-pointer"
                >
                  Notice Board
                </button>
              </div>
            </div>
          </div>
        </LandingReveal>

        {/* Bottom Copyright and Official Attribution Bar (Permanently Visible) */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-300 gap-3">
          <p className="font-normal text-center sm:text-left text-slate-300 max-w-xl">
            © {new Date().getFullYear()} Capital College of Higher Education, Kohima. All Rights Reserved.
          </p>
          <div className="flex items-center">
            <span className="font-medium text-slate-200">
              Powered by{' '}
              <a
                href="https://excellogics.co.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#8fc35e] hover:text-[#b5d697] font-semibold underline decoration-[#8fc35e]/60 hover:decoration-[#b5d697] transition-all cursor-pointer"
                title="Excellogics Tech Solutions"
              >
                Excellogics Tech Solutions
              </a>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
