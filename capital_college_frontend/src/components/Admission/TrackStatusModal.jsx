import React, { useState, useEffect } from 'react';
import { X, Search, CheckCircle2, Clock, AlertTriangle, XCircle, FileText, Printer, Building2, Phone, Mail, Award, Calendar } from 'lucide-react';
import { apiFetch } from '../../utils/api';

export default function TrackStatusModal({ isOpen, onClose, initialAppNo = '' }) {
  const [appNo, setAppNo] = useState(initialAppNo);
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [applicationData, setApplicationData] = useState(null);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (initialAppNo) {
      setAppNo(initialAppNo);
      handleTrack(initialAppNo);
    }
  }, [initialAppNo, isOpen]);

  if (!isOpen) return null;

  const handleTrack = async (searchNo = appNo) => {
    const trimmedNo = (searchNo || '').trim();
    if (!trimmedNo) {
      setError('Please enter your Application Reference Number (e.g., CCH-2024-1001).');
      return;
    }
    setError('');
    setLoading(true);

    try {
      let url = `/api/admissions/track?application_no=${encodeURIComponent(trimmedNo)}`;
      if (phone.trim()) {
        url += `&phone=${encodeURIComponent(phone.trim())}`;
      }
      const res = await apiFetch(url);
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'No admission record found with this Application Number.');
      }

      setApplicationData(data.application);
      setNotifications(data.notifications || []);
    } catch (err) {
      setError(err.message || 'Unable to fetch status. Please check your reference number.');
      setApplicationData(null);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'APPROVED':
        return (
          <span className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-800 border border-emerald-300 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm">
            <CheckCircle2 size={14} className="text-emerald-600" />
            <span>Admission Approved</span>
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center gap-1.5 bg-rose-100 text-rose-800 border border-rose-300 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm">
            <XCircle size={14} className="text-rose-600" />
            <span>Not Selected</span>
          </span>
        );
      case 'UNDER_REVIEW':
        return (
          <span className="inline-flex items-center gap-1.5 bg-blue-100 text-blue-800 border border-blue-300 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm">
            <Clock size={14} className="text-blue-600" />
            <span>Under Verification</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-800 border border-amber-300 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm">
            <Clock size={14} className="text-amber-600" />
            <span>Pending Review</span>
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/65 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 print:static print:inset-auto print:bg-white print:p-0 print:m-0 print:overflow-visible print:block">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border border-gray-100 animate-fadeIn my-6 flex flex-col max-h-[90vh] print:max-h-none print:max-w-none print:w-full print:border-none print:shadow-none print:rounded-none print:my-0 print:overflow-visible print:p-0 print:block">
        {/* Header - Screen only */}
        <div className="bg-[#002858] text-white px-6 py-4 flex items-center justify-between border-b-2 border-[#4a6b28] print:hidden">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#4a6b28] flex items-center justify-center font-bold text-white shadow-md">
              <FileText size={20} />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg">Track Admission Status</h3>
              <p className="text-[11px] text-gray-300">
                Capital College of Higher Education, Kohima • FYUGP Admission Portal
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-300 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Search Bar - Screen only */}
        <div className="p-4 sm:p-6 bg-gray-50 border-b border-gray-200 print:hidden">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleTrack();
            }}
            className="space-y-3"
          >
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              <div className="sm:col-span-7">
                <label className="block text-[11px] font-bold uppercase text-gray-700 mb-1">
                  Application Reference No. *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="e.g. CCH-2024-1001"
                    value={appNo}
                    onChange={(e) => setAppNo(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-lg pl-9 pr-3 py-2 text-xs sm:text-sm font-mono font-semibold text-gray-900 focus:outline-none focus:border-[#4a6b28] focus:ring-1 focus:ring-[#4a6b28]"
                  />
                  <Search size={15} className="absolute left-3 top-3 text-gray-400" />
                </div>
              </div>

              <div className="sm:col-span-5">
                <label className="block text-[11px] font-bold uppercase text-gray-700 mb-1">
                  Registered Phone (Optional)
                </label>
                <input
                  type="tel"
                  placeholder="e.g. 9862112233"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs sm:text-sm text-gray-900 focus:outline-none focus:border-[#4a6b28]"
                />
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 pt-1">
              <span className="text-[11px] text-gray-500">
                Found on your online admission receipt or email acknowledgement.
              </span>
              <button
                type="submit"
                disabled={loading}
                className="bg-[#4a6b28] hover:bg-[#3d5920] text-white px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-sm disabled:opacity-50 cursor-pointer"
              >
                {loading ? (
                  <span>Checking...</span>
                ) : (
                  <>
                    <Search size={14} />
                    <span>Check Status</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {error && (
            <div className="mt-3 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg flex items-center gap-2">
              <AlertTriangle size={15} className="flex-shrink-0 text-red-500" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Content Area */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-5 print:p-0 print:overflow-visible print:block">
          {applicationData ? (
            <>
              {/* SCREEN VIEW (Interactive Browser Display) */}
              <div className="space-y-5 animate-fadeIn print:hidden">
                {/* Applicant Status Header Card */}
                <div className="bg-white border-2 border-gray-200 rounded-xl p-5 shadow-sm">
                  <div className="flex flex-wrap items-start justify-between gap-3 border-b pb-4">
                    <div>
                      <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block">
                        Application Reference
                      </span>
                      <span className="text-xl font-mono font-extrabold text-[#002858]">
                        {applicationData.application_no}
                      </span>
                      <h4 className="text-base font-bold text-gray-900 mt-0.5">
                        {applicationData.full_name}
                      </h4>
                    </div>
                    <div>
                      {getStatusBadge(applicationData.status)}
                    </div>
                  </div>

                  {/* Academic Choice Details */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 text-xs">
                    <div>
                      <span className="text-gray-500 block text-[10px] uppercase font-semibold">Stream</span>
                      <span className="font-bold text-[#002858] text-sm">{applicationData.stream}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block text-[10px] uppercase font-semibold">Major Subject</span>
                      <span className="font-bold text-gray-800 text-sm">{applicationData.major_subject}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block text-[10px] uppercase font-semibold">Course Type</span>
                      <span className="font-semibold text-gray-800">{applicationData.course_type}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block text-[10px] uppercase font-semibold">12th Marks</span>
                      <span className="font-bold text-emerald-700 text-sm">
                        {applicationData.marks_12th}% ({applicationData.board_name})
                      </span>
                    </div>
                  </div>
                </div>

                {/* Status Banner & Official Instructions */}
                {applicationData.status === 'APPROVED' && (
                  <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-400 rounded-xl p-5 text-emerald-950 space-y-3 shadow-sm">
                    <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm uppercase tracking-wide">
                      <Award size={18} className="text-emerald-600" />
                      <span>Official Provisional Admission Granted</span>
                    </div>

                    <p className="text-xs sm:text-sm text-emerald-900 leading-relaxed font-medium">
                      {applicationData.remarks ||
                        `Congratulations ${applicationData.full_name}! You have been provisionally selected for admission into Four Years Under Graduate Programme (FYUGP) in ${applicationData.major_subject}.`}
                    </p>

                    <div className="bg-white/90 border border-emerald-200 rounded-lg p-3 text-xs text-gray-700 space-y-1.5">
                      <p className="font-bold text-[#002858]">Next Steps & Document Verification Checklist:</p>
                      <ul className="list-disc list-inside space-y-1 text-gray-600 text-[11px]">
                        <li>Original Class 10 & Class 12 Admit Cards and Marksheets</li>
                        <li>3 recent passport size photographs (plain background)</li>
                        <li>Transfer Certificate (TC) & Conduct Certificate from previous institution</li>
                        <li>ST / Indigenous Certificate (if applicable)</li>
                        <li>Report to College Campus (P.R. Hill, Kohima) between 9:00 AM – 3:00 PM</li>
                      </ul>
                    </div>
                  </div>
                )}

                {applicationData.status === 'REJECTED' && (
                  <div className="bg-rose-50 border-2 border-rose-300 rounded-xl p-5 text-rose-950 space-y-2">
                    <div className="flex items-center gap-2 text-rose-800 font-bold text-sm uppercase">
                      <XCircle size={18} className="text-rose-600" />
                      <span>Admission Review Notice</span>
                    </div>
                    <p className="text-xs sm:text-sm text-rose-900 leading-relaxed">
                      {applicationData.remarks ||
                        'We regret to inform you that your application could not be selected due to high cut-off competition or seat availability in this subject. You are invited to contact the academic counseling desk for alternative subjects or General stream.'}
                    </p>
                  </div>
                )}

                {applicationData.status === 'PENDING' && (
                  <div className="bg-amber-50 border-2 border-amber-300 rounded-xl p-5 text-amber-950 space-y-2">
                    <div className="flex items-center gap-2 text-amber-800 font-bold text-sm uppercase">
                      <Clock size={18} className="text-amber-600" />
                      <span>Application Under Active Review</span>
                    </div>
                    <p className="text-xs text-amber-900 leading-relaxed">
                      Your application has been received and registered into the college admission database. The Admissions Committee evaluates applications based on Merit cut-offs and category criteria. You will be notified once a decision has been taken.
                    </p>
                  </div>
                )}

                {/* Notification History Log */}
                {notifications && notifications.length > 0 && (
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-3">
                    <h5 className="font-bold text-xs uppercase tracking-wider text-[#002858] flex items-center gap-1.5">
                      <Mail size={14} className="text-[#4a6b28]" />
                      <span>Official Communications & Alerts ({notifications.length})</span>
                    </h5>
                    <div className="space-y-2">
                      {notifications.map((n) => (
                        <div
                          key={n.id}
                          className="bg-white border border-gray-200 rounded-lg p-3 text-xs space-y-1 shadow-2xs"
                        >
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="font-bold text-[#002858]">{n.title}</span>
                            <span className="text-gray-400 font-mono text-[10px]">
                              {new Date(n.created_at).toLocaleString('en-IN', {
                                dateStyle: 'medium',
                                timeStyle: 'short'
                              })}
                            </span>
                          </div>
                          <p className="text-gray-700 leading-relaxed text-[11px]">{n.message}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <button
                    onClick={() => window.print()}
                    className="inline-flex items-center gap-1.5 bg-[#002858] hover:bg-[#001d40] text-white px-4 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer shadow-sm hover:shadow"
                  >
                    <Printer size={14} />
                    <span>Print Status Acknowledgement</span>
                  </button>

                  <button
                    onClick={() => {
                      setApplicationData(null);
                      setAppNo('');
                    }}
                    className="text-gray-600 hover:text-gray-900 text-xs font-medium underline cursor-pointer"
                  >
                    Track Another Application
                  </button>
                </div>
              </div>

              {/* PRINT-ONLY OFFICIAL 1-PAGE CERTIFICATE (Only visible when printing) */}
              <div className="hidden print:block print-page-fit w-full text-slate-900 bg-white p-4">
                {/* Official College Letterhead */}
                <div className="border-b-2 border-[#4a6b28] pb-2.5 mb-2.5">
                  <div className="flex items-center justify-between gap-3">
                    <img
                      src="https://capitalcollege.edu.in/wp-content/uploads/2023/05/1a.jpg"
                      alt="College Crest"
                      className="w-14 h-14 object-contain shrink-0"
                    />
                    <div className="text-center flex-1">
                      <h2 className="text-lg font-black text-[#002147] tracking-tight uppercase leading-tight">
                        Capital College of Higher Education
                      </h2>
                      <p className="text-[11px] font-bold text-slate-700 tracking-wide uppercase mt-0.5">
                        Kohima • Nagaland • Established 2004
                      </p>
                      <p className="text-[9.5px] text-slate-600 mt-0.5">
                        Permanently Affiliated to Nagaland University | Recognized by UGC under Section 2(f) &amp; 12(B) of 1956
                      </p>
                      <p className="text-[8.5px] text-slate-500 mt-0.5">
                        Arts Campus: Below State Library, P.R. Hill, Kohima | Science Campus: Thegaba, Phezhu, Jotsoma
                      </p>
                      <p className="text-[8.5px] text-slate-500">
                        Website: capitalcollege.edu.in • Email: principal@capitalcollege.edu.in • Helpline: +91 9436002789 / 9863636060
                      </p>
                    </div>
                    <div className="w-14 h-14 border border-slate-300 rounded p-1 flex flex-col items-center justify-center text-center text-[7.5px] text-slate-600 font-mono shrink-0">
                      <span className="font-bold text-[#002147]">OFFICIAL</span>
                      <span>RECORD</span>
                      <span className="text-[#4a6b28] font-bold">2026–27</span>
                    </div>
                  </div>
                </div>

                {/* Document Title Banner */}
                <div className="bg-[#002147] text-white text-center py-1 px-3 rounded mb-2.5">
                  <h3 className="text-[11px] font-black uppercase tracking-wider">
                    Official Provisional Admission Status Acknowledgement
                  </h3>
                  <p className="text-[8.5px] text-emerald-200 uppercase tracking-widest font-semibold">
                    Four-Year Undergraduate Programme (FYUGP) • NEP 2020 • Academic Session 2026–2027
                  </p>
                </div>

                {/* Reference & Decision Strip */}
                <div className="flex items-center justify-between border border-slate-300 rounded p-2 mb-2.5 bg-slate-50 text-[10.5px]">
                  <div>
                    <span className="text-[8.5px] uppercase font-bold text-slate-500 block">Application Reference No.</span>
                    <span className="text-sm font-mono font-black text-[#002147]">{applicationData.application_no}</span>
                  </div>
                  <div className="text-center">
                    <span className="text-[8.5px] uppercase font-bold text-slate-500 block">Date of Issue</span>
                    <span className="font-semibold text-slate-800">
                      {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[8.5px] uppercase font-bold text-slate-500 block mb-0.5">Status Decision</span>
                    {applicationData.status === 'APPROVED' ? (
                      <span className="inline-block bg-emerald-700 text-white font-bold px-2 py-0.5 rounded text-[9.5px] uppercase tracking-wider">
                        Provisional Admission Granted
                      </span>
                    ) : applicationData.status === 'UNDER_REVIEW' ? (
                      <span className="inline-block bg-blue-700 text-white font-bold px-2 py-0.5 rounded text-[9.5px] uppercase tracking-wider">
                        Under Active Verification
                      </span>
                    ) : applicationData.status === 'REJECTED' ? (
                      <span className="inline-block bg-rose-700 text-white font-bold px-2 py-0.5 rounded text-[9.5px] uppercase tracking-wider">
                        Not Selected
                      </span>
                    ) : (
                      <span className="inline-block bg-amber-700 text-white font-bold px-2 py-0.5 rounded text-[9.5px] uppercase tracking-wider">
                        Pending Committee Review
                      </span>
                    )}
                  </div>
                </div>

                {/* Candidate & Programme Particulars Table */}
                <div className="border border-slate-300 rounded overflow-hidden mb-2.5 text-[10px]">
                  <div className="bg-slate-100 font-bold px-2.5 py-0.5 text-[#002147] border-b border-slate-300 uppercase text-[9px] tracking-wider">
                    1. Candidate &amp; Programme Particulars
                  </div>
                  <table className="w-full text-left">
                    <tbody>
                      <tr className="border-b border-slate-200">
                        <td className="w-1/4 p-1.5 bg-slate-50/70 font-semibold text-slate-600">Candidate Full Name:</td>
                        <td className="w-1/4 p-1.5 font-bold text-slate-900">{applicationData.full_name}</td>
                        <td className="w-1/4 p-1.5 bg-slate-50/70 font-semibold text-slate-600">Guardian / Father's Name:</td>
                        <td className="w-1/4 p-1.5 font-medium text-slate-800">{applicationData.guardian_name || 'N/A'}</td>
                      </tr>
                      <tr className="border-b border-slate-200">
                        <td className="p-1.5 bg-slate-50/70 font-semibold text-slate-600">Stream &amp; Degree:</td>
                        <td className="p-1.5 font-bold text-[#002147]">
                          {applicationData.stream === 'SCIENCE' ? 'Science (B.Sc. FYUGP)' : 'Arts (B.A. FYUGP)'}
                        </td>
                        <td className="p-1.5 bg-slate-50/70 font-semibold text-slate-600">Major / Honours Subject:</td>
                        <td className="p-1.5 font-bold text-[#4a6b28] uppercase">{applicationData.major_subject}</td>
                      </tr>
                      <tr className="border-b border-slate-200">
                        <td className="p-1.5 bg-slate-50/70 font-semibold text-slate-600">Qualifying Exam (12th):</td>
                        <td className="p-1.5 font-medium text-slate-800">
                          {applicationData.marks_12th}% ({applicationData.board_name || 'NBSE'})
                        </td>
                        <td className="p-1.5 bg-slate-50/70 font-semibold text-slate-600">Category &amp; Quota:</td>
                        <td className="p-1.5 font-medium text-slate-800">
                          {applicationData.category || 'ST'} • {applicationData.gender || 'General'}
                        </td>
                      </tr>
                      <tr>
                        <td className="p-1.5 bg-slate-50/70 font-semibold text-slate-600">Registered Phone:</td>
                        <td className="p-1.5 font-mono text-slate-800">{applicationData.phone}</td>
                        <td className="p-1.5 bg-slate-50/70 font-semibold text-slate-600">Registered Email:</td>
                        <td className="p-1.5 font-mono text-slate-800 text-[9.5px]">{applicationData.email}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Official Intimation & Decision Remarks */}
                <div className="border border-[#4a6b28] rounded p-2.5 mb-2.5 bg-emerald-50/30 text-[10px]">
                  <div className="font-bold text-[#002147] uppercase text-[9px] tracking-wider mb-0.5">
                    2. Official Intimation &amp; Admissions Committee Decision
                  </div>
                  <p className="text-slate-800 leading-relaxed text-[10px]">
                    {applicationData.remarks ||
                      `Congratulations ${applicationData.full_name}! You have been granted provisional admission to Major in ${applicationData.major_subject} (${applicationData.stream} Stream) under the Four-Year Undergraduate Programme (FYUGP) at Capital College of Higher Education, Kohima. Please report to the college administrative office with original marksheets and admission fee by the scheduled date.`}
                  </p>
                </div>

                {/* Verification Checklist & Venue */}
                <div className="grid grid-cols-2 gap-2.5 border border-slate-300 rounded p-2.5 mb-3 text-[9.5px] bg-slate-50/50">
                  <div>
                    <span className="font-bold text-[#002147] uppercase tracking-wider block mb-0.5">
                      Mandatory Original Documents Checklist:
                    </span>
                    <ul className="list-disc list-inside space-y-0.5 text-slate-700">
                      <li>Original Class 10 &amp; Class 12 Admit Cards &amp; Marksheets</li>
                      <li>Transfer Certificate (TC) &amp; Conduct Certificate</li>
                      <li>3 recent passport size photographs (plain background)</li>
                      <li>ST / Indigenous / Category Certificate (if applicable)</li>
                    </ul>
                  </div>
                  <div className="border-l border-slate-200 pl-2.5">
                    <span className="font-bold text-[#002147] uppercase tracking-wider block mb-0.5">
                      Reporting Venue &amp; Office Timings:
                    </span>
                    <p className="text-slate-700 leading-snug">
                      Administrative Office, Capital College Campus<br />
                      Below State Library, PHQ Junction, P.R. Hill, Kohima<br />
                      <strong>Reporting Hours:</strong> 9:00 AM – 3:00 PM (Mon – Sat)<br />
                      <strong>Helpline:</strong> +91 9863636060 / +91 9436002789
                    </p>
                  </div>
                </div>

                {/* Institutional Signatures Block */}
                <div className="pt-3 mt-1 border-t border-slate-300 flex items-end justify-between text-[10px]">
                  <div className="text-center w-1/3">
                    <div className="border-b border-slate-400 w-32 mx-auto mb-1"></div>
                    <p className="font-bold text-slate-800 text-[9px]">Signature of Candidate</p>
                    <p className="text-[8px] text-slate-500">Date: _______________</p>
                  </div>

                  <div className="text-center w-1/3">
                    <div className="inline-block border-2 border-dashed border-[#002147] px-3 py-1 rounded text-center">
                      <p className="font-bold text-[#002147] text-[8.5px] uppercase tracking-wider">CCHE Institutional Seal</p>
                      <p className="text-[7.5px] text-slate-500 font-mono">Admission Committee</p>
                    </div>
                  </div>

                  <div className="text-center w-1/3">
                    <div className="border-b border-slate-400 w-32 mx-auto mb-1"></div>
                    <p className="font-bold text-[#002147] text-[9px]">Convenor, Admission Committee</p>
                    <p className="text-[8px] text-slate-600">Capital College Kohima</p>
                  </div>
                </div>

                {/* System Footnote */}
                <div className="mt-2.5 pt-1.5 border-t border-slate-200 text-center text-[7.5px] text-slate-500">
                  This is an official system-generated admission document issued under the authority of Capital College of Higher Education, Kohima. Provisional admission is subject to physical verification of original marksheets and statutory eligibility requirements.
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-10 space-y-3 text-gray-500 print:hidden">
              <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto text-gray-400">
                <Search size={26} />
              </div>
              <h4 className="font-bold text-gray-700 text-sm">
                Enter Your Application Number Above
              </h4>
              <p className="text-xs max-w-sm mx-auto text-gray-500">
                Enter your reference number (e.g. CCH-2024-1001) to view real-time admission decisions, reviewer remarks, and orientation instructions.
              </p>
            </div>
          )}
        </div>

        {/* Footer - Screen only */}
        <div className="bg-gray-100 px-6 py-3 border-t border-gray-200 flex items-center justify-between text-[11px] text-gray-500 print:hidden">
          <span>Admissions Helpline: +91 9863636060</span>
          <span>Capital College Kohima</span>
        </div>
      </div>
    </div>
  );
}

