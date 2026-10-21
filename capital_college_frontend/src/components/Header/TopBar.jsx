import React, { useState, useEffect } from 'react';
import { Phone, Mail, MapPin, Clock, Search, ExternalLink, Facebook, Instagram, Youtube, Twitter, Linkedin, Send, MessageCircle } from 'lucide-react';
import { apiFetch } from '../../utils/api';

const WhatsAppIcon = ({ size = 12, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const renderSocialIcon = (platform, size = 12) => {
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

export default function TopBar({ onOpenTrackStatus, onOpenAdmission }) {
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

  return (
    <div className="bg-[#001e42] text-white text-xs border-b border-blue-900/60 py-2 px-3 sm:px-6 transition-all">
      <div className="max-w-[1600px] mx-auto flex flex-wrap items-center justify-between gap-2">
        {/* Left Side: Official Contact & Location */}
        <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-slate-200">
          <div className="flex items-center gap-1.5">
            <MapPin size={13} className="text-[#8fc35e]" />
            <span className="font-medium text-[11.5px] sm:text-xs">P.R. Hill, Kohima, Nagaland 797001</span>
          </div>
          <div className="hidden md:flex items-center gap-1.5">
            <Clock size={13} className="text-[#8fc35e]" />
            <span className="font-medium text-[11.5px] sm:text-xs">Timing: 9:00 am - 4:00 pm</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Phone size={13} className="text-[#8fc35e]" />
            <a href="tel:+919863636060" className="hover:text-[#b5d697] transition-colors font-semibold text-[11.5px] sm:text-xs">
              +91 9863636060
            </a>
          </div>
        </div>

        {/* Right Side: Social Media Links & Track Status */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="flex items-center gap-1.5 text-slate-300">
            {socialLinks.map((item) => {
              const p = (item.platform || '').toLowerCase();
              const isWa = p === 'whatsapp';
              return (
                <a
                  key={item.id || item.platform}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-6 h-6 rounded-md flex items-center justify-center transition-colors border ${
                    isWa
                      ? 'bg-[#25D366]/20 hover:bg-[#25D366] text-[#25D366] hover:text-white border-[#25D366]/40 hover:border-[#25D366]'
                      : 'bg-white/5 hover:bg-[#4a6b28] text-slate-200 hover:text-white border-white/10'
                  }`}
                  title={item.label || item.platform}
                  aria-label={item.label || item.platform}
                >
                  {renderSocialIcon(p, 12)}
                </a>
              );
            })}
          </div>

          {onOpenTrackStatus && (
            <button
              onClick={onOpenTrackStatus}
              className="hidden sm:inline-flex items-center gap-1 bg-[#4a6b28] hover:bg-[#3d5920] text-white border border-[#648d35]/60 px-2.5 py-1 rounded text-[11px] font-semibold transition-colors shadow-xs ml-1 cursor-pointer"
            >
              <span>Track Application</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
