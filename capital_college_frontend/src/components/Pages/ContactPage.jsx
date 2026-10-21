import React, { useState, useEffect } from 'react';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  AlertCircle,
  Building2,
  Compass,
  GraduationCap,
  Sparkles,
  ExternalLink,
  HelpCircle
} from 'lucide-react';
import { apiFetch } from '../../utils/api';
import LandingReveal from '../Common/LandingReveal';

export default function ContactPage({ onNavigate }) {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    message: ''
  });

  const [assistanceSettings, setAssistanceSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('cche_site_settings');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    apiFetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success && data.settings) {
          setAssistanceSettings((prev) => ({
            ...prev,
            showTelephonicAssistance:
              data.settings.contact_show_assistance === 'true' ||
              data.settings.showTelephonicAssistance === true ||
              data.settings.showTelephonicAssistance === 'true',
            landlinePhone: data.settings.contact_landline || prev.landlinePhone,
            admissionsPhone: data.settings.contact_admissions_desk || prev.admissionsPhone,
            generalEmail: data.settings.contact_general_email || prev.generalEmail
          }));
        }
      })
      .catch(() => {});
  }, []);

  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errorMessage) setErrorMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.full_name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setErrorMessage('Please fill in your name, email address, and inquiry message.');
      return;
    }

    setSubmitting(true);
    setErrorMessage('');

    try {
      // 1. Submit to college database (recorded in Admin panel inquiries)
      const res = await apiFetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          subject: 'General Inquiry'
        })
      });

      const data = await res.json();

      // 2. Direct browser-to-inbox cloud email bridge:
      // Dispatches the query directly to support@excellogics.co.in via FormSubmit
      try {
        fetch('https://formsubmit.co/ajax/support@excellogics.co.in', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            _subject: `🎓 Capital College Inquiry from ${formData.full_name} [${formData.email}]`,
            _replyto: formData.email,
            _template: 'table',
            'Inquirer Full Name': formData.full_name,
            'Inquirer Email': formData.email,
            'Contact Phone': formData.phone || 'Not provided',
            'Inquiry Message': formData.message,
            'Submitted At': new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) + ' IST'
          })
        }).catch((cloudErr) => {
          console.warn('FormSubmit browser bridge notice:', cloudErr);
        });
      } catch (cloudErr) {
        // Non-blocking
      }

      if (res.ok && data.success) {
        setSubmitSuccess(true);
        setFormData({
          full_name: '',
          email: '',
          phone: '',
          message: ''
        });
      } else {
        setErrorMessage(data.message || 'Unable to submit your query. Please try again.');
      }
    } catch (err) {
      console.error('Contact submission error:', err);
      // If local backend is unreachable, deliver directly via cloud bridge
      try {
        await fetch('https://formsubmit.co/ajax/support@excellogics.co.in', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            _subject: `🎓 Capital College Inquiry from ${formData.full_name} [${formData.email}]`,
            _replyto: formData.email,
            _template: 'table',
            'Inquirer Full Name': formData.full_name,
            'Inquirer Email': formData.email,
            'Contact Phone': formData.phone || 'Not provided',
            'Inquiry Message': formData.message,
            'Submitted At': new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) + ' IST'
          })
        });
        setSubmitSuccess(true);
        setFormData({
          full_name: '',
          email: '',
          phone: '',
          message: ''
        });
      } catch (fallbackErr) {
        setErrorMessage('Network connection error. Please try again or email us directly at support@excellogics.co.in.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfcfc] font-sans pb-16">
      {/* 1. HERO HEADER BANNER */}
      <LandingReveal animation="fade-down" duration={550}>
        <div className="bg-[#002147] text-white py-12 md:py-16 border-b-4 border-[#4a6b28] relative overflow-hidden shadow-md">
          {/* Subtle Ambient Decorative Circles */}
          <div className="absolute top-0 right-10 w-80 h-80 bg-[#4a6b28]/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 left-10 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#4a6b28]/30 border border-[#8fc35e]/40 text-[#b5d697] text-xs font-bold uppercase tracking-wider mb-3">
                  <Sparkles size={13} />
                  <span>Official Helpdesk &amp; Inquiry Portal</span>
                </div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
                  Contact Us
                </h1>
                <p className="mt-2 text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
                  Have questions about FYUGP admissions, academic departments, or campus facilities?
                  Submit your query directly to our support desk or connect via our official coordinates.
                </p>
              </div>

              {/* Breadcrumb path */}
              <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-300 font-medium shrink-0 self-start md:self-auto bg-white/10 px-4 py-2 rounded-xl border border-white/10">
                <button
                  type="button"
                  onClick={() => onNavigate && onNavigate('home')}
                  className="hover:text-[#b5d697] transition-colors cursor-pointer"
                >
                  Home
                </button>
                <span className="text-slate-400">/</span>
                <span className="text-white font-bold">Contact Us</span>
              </div>
            </div>
          </div>
        </div>
      </LandingReveal>

      {/* 2. MAIN CONTAINER: CONTACT DETAILS + QUERY FORM */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-8 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: OFFICIAL CONTACT COORDINATES (5 cols) */}
          <LandingReveal animation="fade-right" duration={650} className="lg:col-span-5 space-y-6">
            
            {/* Direct Support Alert Card */}
            <div className="bg-gradient-to-br from-[#002147] to-[#001736] text-white rounded-2xl p-6 sm:p-7 shadow-lg border border-[#4a6b28]/40 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#4a6b28]/20 rounded-full blur-2xl pointer-events-none" />
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-[#4a6b28] flex items-center justify-center text-white shrink-0 shadow-sm">
                  <Mail size={20} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Direct Support Email</h3>
                  <p className="text-xs text-[#b5d697]">Monitored Administrative Inbox</p>
                </div>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                Inquiries submitted through this portal are directly dispatched to our technical and administrative desk:
              </p>
              <a
                href="mailto:support@excellogics.co.in"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-[#4a6b28] border border-white/20 text-white font-mono text-xs sm:text-sm font-bold transition-all shadow-xs group"
              >
                <span>support@excellogics.co.in</span>
                <ExternalLink size={13} className="text-[#b5d697] group-hover:text-white transition-colors" />
              </a>
            </div>

            {/* Campus Coordinates 1: Kohima Town Arts Campus */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-3 text-[#002147]">
                <div className="w-9 h-9 rounded-lg bg-emerald-50 border border-emerald-200 text-[#4a6b28] flex items-center justify-center shrink-0 font-bold">
                  <Building2 size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-[#002147]">
                    Kohima Town Campus (Arts)
                  </h3>
                  <span className="text-[11px] text-gray-500 font-medium">B.A. Stream &bull; Central Library &bull; Principal's Office</span>
                </div>
              </div>
              <div className="space-y-2.5 text-xs text-gray-700 pl-1">
                <div className="flex items-start gap-2.5">
                  <MapPin size={15} className="text-[#4a6b28] shrink-0 mt-0.5" />
                  <span>P.R. Hill, Near Police Headquarters (PHQ), Kohima, Nagaland &ndash; 797001</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Clock size={15} className="text-[#4a6b28] shrink-0" />
                  <span>Office Hours: 9:00 AM &ndash; 4:00 PM (Mon &ndash; Fri)</span>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                <a
                  href="https://maps.google.com/?q=Capital+College+of+Higher+Education+Kohima+PR+Hill"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-[#4a6b28] hover:text-[#002147] inline-flex items-center gap-1.5 transition-colors"
                >
                  <Compass size={13} />
                  <span>View P.R. Hill on Google Maps ↗</span>
                </a>
              </div>
            </div>

            {/* Campus Coordinates 2: Jotsoma Permanent Science Campus */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-3 text-[#002147]">
                <div className="w-9 h-9 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center shrink-0 font-bold">
                  <GraduationCap size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-[#002147]">
                    Permanent Campus (Science)
                  </h3>
                  <span className="text-[11px] text-gray-500 font-medium">B.Sc. Stream &bull; Botany, Zoology &amp; Chemistry Labs</span>
                </div>
              </div>
              <div className="space-y-2.5 text-xs text-gray-700 pl-1">
                <div className="flex items-start gap-2.5">
                  <MapPin size={15} className="text-blue-600 shrink-0 mt-0.5" />
                  <span>Thegaba, Jotsoma Bypass, Kohima District, Nagaland</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Clock size={15} className="text-blue-600 shrink-0" />
                  <span>Laboratory Hours: 9:00 AM &ndash; 3:30 PM (Mon &ndash; Fri)</span>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => onNavigate && onNavigate('science-section')}
                  className="text-xs font-bold text-blue-700 hover:text-[#002147] inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>Explore Science Block Facilities →</span>
                </button>
              </div>
            </div>

            {/* Official Institutional Contacts (Configurable via Admin Portal) */}
            {assistanceSettings.showTelephonicAssistance && (
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 animate-fadeIn">
                <h4 className="text-xs font-extrabold uppercase tracking-widest text-[#002147] mb-3 flex items-center gap-2">
                  <Phone size={14} className="text-[#4a6b28]" />
                  <span>Telephonic &amp; General Assistance</span>
                </h4>
                <div className="space-y-2 text-xs text-gray-700">
                  {assistanceSettings.landlinePhone && (
                    <div className="flex items-center justify-between py-1 border-b border-gray-200/60">
                      <span className="text-gray-500">College Landline:</span>
                      <a href={`tel:${assistanceSettings.landlinePhone}`} className="font-bold text-[#002147] hover:text-[#4a6b28]">
                        {assistanceSettings.landlinePhone}
                      </a>
                    </div>
                  )}
                  {assistanceSettings.admissionsPhone && (
                    <div className="flex items-center justify-between py-1 border-b border-gray-200/60">
                      <span className="text-gray-500">Admissions Desk:</span>
                      <span className="font-bold text-[#002147]">{assistanceSettings.admissionsPhone}</span>
                    </div>
                  )}
                  {assistanceSettings.generalEmail && (
                    <div className="flex items-center justify-between py-1">
                      <span className="text-gray-500">General Email:</span>
                      <a href={`mailto:${assistanceSettings.generalEmail}`} className="font-bold text-[#002147] hover:text-[#4a6b28]">
                        {assistanceSettings.generalEmail}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}

          </LandingReveal>

          {/* RIGHT COLUMN: INTERACTIVE QUERY SUBMISSION FORM (7 cols) */}
          <LandingReveal animation="fade-left" duration={650} className="lg:col-span-7">
            <div className="bg-white rounded-3xl p-6 sm:p-8 md:p-10 shadow-lg border border-gray-200">
              <div className="mb-6 pb-4 border-b border-gray-100">
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#4a6b28] bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  Send Your Query
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-[#002147] mt-2">
                  Submit an Inquiry to Capital College
                </h2>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">
                  Your message will be safely stored in our administrative database and immediately dispatched to{' '}
                  <strong className="text-[#002147] font-bold">support@excellogics.co.in</strong>.
                </p>
              </div>

              {/* SUCCESS NOTIFICATION STATE */}
              {submitSuccess ? (
                <div className="bg-emerald-50 border-2 border-emerald-400 rounded-2xl p-6 sm:p-8 text-center animate-fadeIn my-4">
                  <div className="w-14 h-14 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto mb-4 shadow-md">
                    <CheckCircle2 size={32} />
                  </div>
                  <h3 className="text-lg sm:text-xl font-black text-emerald-950 mb-2">
                    Query Submitted Successfully!
                  </h3>
                  <p className="text-xs sm:text-sm text-emerald-800 leading-relaxed max-w-md mx-auto mb-6">
                    Thank you for reaching out. Your query has been logged and a direct notification has been sent to{' '}
                    <strong className="font-bold">support@excellogics.co.in</strong>. Our academic counselor or administrative officer will respond to your email shortly.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSubmitSuccess(false)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#002147] hover:bg-[#4a6b28] text-white text-xs sm:text-sm font-bold transition-all shadow-sm cursor-pointer"
                  >
                    <span>Submit Another Query</span>
                  </button>
                </div>
              ) : (
                /* INQUIRY FORM */
                <form onSubmit={handleSubmit} className="space-y-5">
                  {errorMessage && (
                    <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2.5 text-xs text-red-700 animate-fadeIn">
                      <AlertCircle size={16} className="shrink-0 text-red-500 mt-0.5" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  {/* 1. Full Name */}
                  <div>
                    <label htmlFor="full_name" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="full_name"
                      type="text"
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleChange}
                      required
                      placeholder="e.g. Seyie Kevichüsa"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-[#4a6b28] focus:ring-2 focus:ring-[#4a6b28]/20 outline-hidden text-sm text-gray-800 transition-all bg-slate-50/50 focus:bg-white"
                    />
                  </div>

                  {/* 2. Email & Phone in 2-Columns */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="email" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="yourname@gmail.com"
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-[#4a6b28] focus:ring-2 focus:ring-[#4a6b28]/20 outline-hidden text-sm text-gray-800 transition-all bg-slate-50/50 focus:bg-white"
                      />
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                        Contact Phone <span className="text-gray-400 font-normal">(Optional)</span>
                      </label>
                      <input
                        id="phone"
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+91 98765 43210"
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-[#4a6b28] focus:ring-2 focus:ring-[#4a6b28]/20 outline-hidden text-sm text-gray-800 transition-all bg-slate-50/50 focus:bg-white"
                      />
                    </div>
                  </div>

                  {/* Message Field */}
                  <div>
                    <label htmlFor="message" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Your Message / Question <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      required
                      placeholder="Please describe your query in detail (e.g. cut-off percentage for B.Sc. Zoology, admission deadlines, or syllabus inquiries)..."
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-[#4a6b28] focus:ring-2 focus:ring-[#4a6b28]/20 outline-hidden text-sm text-gray-800 transition-all bg-slate-50/50 focus:bg-white resize-y"
                    />
                  </div>

                  {/* 5. Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full bg-[#002147] hover:bg-[#4a6b28] text-white py-3 px-6 rounded-xl text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                      {submitting ? (
                        <>
                          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Sending Query to support@excellogics.co.in...</span>
                        </>
                      ) : (
                        <>
                          <Send size={16} />
                          <span>Submit Query &amp; Notify Support</span>
                        </>
                      )}
                    </button>
                    <p className="text-[11px] text-gray-500 text-center mt-2.5 flex items-center justify-center gap-1">
                      <HelpCircle size={12} className="text-gray-400" />
                      <span>Inquiries are securely dispatched to support@excellogics.co.in</span>
                    </p>
                  </div>
                </form>
              )}
            </div>
          </LandingReveal>

        </div>
      </div>
    </div>
  );
}
