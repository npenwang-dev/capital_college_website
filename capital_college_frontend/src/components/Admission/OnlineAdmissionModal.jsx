import React, { useState } from 'react';
import { X, CheckCircle, GraduationCap, AlertCircle, Printer, Download, Search } from 'lucide-react';
import { apiFetch } from '../../utils/api';

export default function OnlineAdmissionModal({
  isOpen,
  onClose,
  initialStream = 'ARTS',
  initialMajor = '',
  onOpenTrackStatus,
  admissionsOpen = false,
  admissionsNotice = 'Online admissions for FYUGP 4-Year B.A. & B.Sc. degree programmes are currently closed for now. Please download the official print form (PDF) or visit the college office.'
}) {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    dob: '',
    gender: 'Male',
    category: 'ST',
    stream: initialStream,
    course_type: 'HONOURS',
    major_subject: initialMajor || (initialStream === 'ARTS' ? 'Political Science' : 'Botany'),
    minor_subjects: '',
    marks_10th: '',
    marks_12th: '',
    previous_school: '',
    board_name: 'NBSE',
    guardian_name: '',
    guardian_phone: '',
    address: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [submittedApp, setSubmittedApp] = useState(null);

  // Live real-time admission status synchronization
  const [liveStatus, setLiveStatus] = useState({
    checked: false,
    open: admissionsOpen,
    notice: admissionsNotice
  });

  React.useEffect(() => {
    if (isOpen) {
      apiFetch('/api/admissions/status')
        .then((res) => res.json())
        .then((data) => {
          if (data && data.success) {
            setLiveStatus({
              checked: true,
              open: Boolean(data.admissions_open),
              notice: data.notice || admissionsNotice
            });
          }
        })
        .catch(() => {
          setLiveStatus((prev) => ({ ...prev, checked: true }));
        });
    }
  }, [isOpen, admissionsOpen, admissionsNotice]);

  const isAdmissionActive = liveStatus.checked ? liveStatus.open : admissionsOpen;
  const currentNotice = liveStatus.checked ? liveStatus.notice : admissionsNotice;

  if (!isOpen) return null;

  const artsMajors = ['Economics', 'Education', 'English', 'History', 'Political Science', 'Sociology', 'Tenyidie'];
  const scienceMajors = ['Botany', 'Chemistry', 'Mathematics', 'Physics', 'Zoology'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'stream') {
      const defaultMajor = value === 'ARTS' ? 'Political Science' : 'Botany';
      setFormData(prev => ({ ...prev, stream: value, major_subject: defaultMajor }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await apiFetch('/api/admissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Submission failed');
      }

      setSubmittedApp(data.application);
    } catch (err) {
      setError(err.message || 'Failed to submit application. Please check your details and try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSubmittedApp(null);
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-md flex items-center justify-center p-4 transition-all duration-300 print:static print:inset-auto print:bg-white print:p-0 print:m-0 print:overflow-visible print:block">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden border border-slate-200 animate-scaleUp my-8 print:max-h-none print:max-w-none print:w-full print:border-none print:shadow-none print:rounded-none print:my-0 print:overflow-visible print:p-0 print:block">
        {/* Modal Header */}
        <div className="bg-[#002147] text-white px-6 py-4 flex items-center justify-between border-b-2 border-[#4a6b28] print:hidden">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#4a6b28] rounded-xl text-white shadow-xs">
              <GraduationCap size={22} />
            </div>
            <div>
              <h3 className="font-bold text-lg md:text-xl">Online Admission Portal 2024–25</h3>
              <p className="text-xs text-gray-300">Capital College of Higher Education, Kohima (FYUGP)</p>
            </div>
          </div>
          <button
            onClick={resetForm}
            className="text-gray-300 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
          >
            <X size={22} />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 md:p-8 max-h-[75vh] overflow-y-auto print:p-0 print:overflow-visible print:block">
          {submittedApp ? (
            <>
              {/* Screen View */}
              <div className="text-center py-6 space-y-6 print:hidden">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle size={36} />
                </div>

                <div>
                  <span className="text-xs font-semibold text-[#4a6b28] uppercase tracking-wider">Application Submitted</span>
                  <h4 className="text-2xl font-bold text-[#002858] mt-1">
                    Congratulations, {submittedApp.full_name}!
                  </h4>
                  <p className="text-sm text-gray-600 mt-2 max-w-md mx-auto">
                    Your application for the Four Years Under Graduate Programme (FYUGP) has been recorded successfully in the college database.
                  </p>
                </div>

                {/* Receipt Summary Card */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-5 text-left max-w-lg mx-auto text-xs md:text-sm space-y-2.5">
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-gray-500 font-medium">Application Reference No:</span>
                    <span className="font-mono font-bold text-[#4a6b28] text-base">{submittedApp.application_no}</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-gray-500 font-medium">Stream & Major:</span>
                    <span className="font-semibold text-gray-800">{submittedApp.stream} - {submittedApp.major_subject} ({submittedApp.course_type})</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-gray-500 font-medium">Contact Phone:</span>
                    <span className="font-semibold text-gray-800">{submittedApp.phone}</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-gray-500 font-medium">12th Grade Marks:</span>
                    <span className="font-semibold text-gray-800">{submittedApp.marks_12th}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 font-medium">Application Status:</span>
                    <span className="inline-block bg-yellow-100 text-yellow-800 text-xs px-2 py-0.5 rounded font-bold">
                      {submittedApp.status}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
                  <button
                    onClick={() => {
                      const no = submittedApp.application_no;
                      resetForm();
                      if (onOpenTrackStatus) onOpenTrackStatus(no);
                    }}
                    className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded text-sm font-semibold transition-colors shadow-sm"
                  >
                    <Search size={16} />
                    <span>Track Application Status Now</span>
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="inline-flex items-center gap-2 bg-[#002858] text-white px-5 py-2.5 rounded text-sm font-semibold hover:bg-[#001c3d] transition-colors"
                  >
                    <Printer size={16} />
                    <span>Print Receipt</span>
                  </button>
                  <button
                    onClick={resetForm}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-5 py-2.5 rounded text-sm font-semibold transition-colors"
                  >
                    Close & Back to Homepage
                  </button>
                </div>
              </div>

              {/* PRINT-ONLY OFFICIAL 1-PAGE ADMISSION RECEIPT */}
              <div className="hidden print:block print-page-fit w-full text-slate-900 bg-white p-4">
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
                        Arts Campus: P.R. Hill, Kohima | Science Campus: Thegaba, Phezhu, Jotsoma
                      </p>
                    </div>
                    <div className="w-14 h-14 border border-slate-300 rounded p-1 flex flex-col items-center justify-center text-center text-[7.5px] text-slate-600 font-mono shrink-0">
                      <span className="font-bold text-[#002147]">SUBMISSION</span>
                      <span>RECEIPT</span>
                      <span className="text-[#4a6b28] font-bold">2026–27</span>
                    </div>
                  </div>
                </div>

                <div className="bg-[#002147] text-white text-center py-1 px-3 rounded mb-2.5">
                  <h3 className="text-[11px] font-black uppercase tracking-wider">
                    Official Online Admission Application Receipt
                  </h3>
                  <p className="text-[8.5px] text-emerald-200 uppercase tracking-widest font-semibold">
                    Four-Year Undergraduate Programme (FYUGP) • NEP 2020 • Academic Session 2026–2027
                  </p>
                </div>

                <div className="flex items-center justify-between border border-slate-300 rounded p-2 mb-2.5 bg-slate-50 text-[10.5px]">
                  <div>
                    <span className="text-[8.5px] uppercase font-bold text-slate-500 block">Application Reference No.</span>
                    <span className="text-sm font-mono font-black text-[#002147]">{submittedApp.application_no}</span>
                  </div>
                  <div className="text-center">
                    <span className="text-[8.5px] uppercase font-bold text-slate-500 block">Registration Timestamp</span>
                    <span className="font-semibold text-slate-800">
                      {new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[8.5px] uppercase font-bold text-slate-500 block mb-0.5">Registration Status</span>
                    <span className="inline-block bg-emerald-700 text-white font-bold px-2 py-0.5 rounded text-[9.5px] uppercase tracking-wider">
                      Successfully Registered
                    </span>
                  </div>
                </div>

                <div className="border border-slate-300 rounded overflow-hidden mb-2.5 text-[10px]">
                  <table className="w-full text-left">
                    <tbody>
                      <tr className="border-b border-slate-200">
                        <td className="w-1/4 p-1.5 bg-slate-50/70 font-semibold text-slate-600">Applicant Name:</td>
                        <td className="w-1/4 p-1.5 font-bold text-slate-900">{submittedApp.full_name}</td>
                        <td className="w-1/4 p-1.5 bg-slate-50/70 font-semibold text-slate-600">Guardian Name:</td>
                        <td className="w-1/4 p-1.5 font-medium text-slate-800">{submittedApp.guardian_name || 'N/A'}</td>
                      </tr>
                      <tr className="border-b border-slate-200">
                        <td className="p-1.5 bg-slate-50/70 font-semibold text-slate-600">Stream &amp; Degree:</td>
                        <td className="p-1.5 font-bold text-[#002147]">{submittedApp.stream} (FYUGP)</td>
                        <td className="p-1.5 bg-slate-50/70 font-semibold text-slate-600">Major / Honours Subject:</td>
                        <td className="p-1.5 font-bold text-[#4a6b28] uppercase">{submittedApp.major_subject}</td>
                      </tr>
                      <tr className="border-b border-slate-200">
                        <td className="p-1.5 bg-slate-50/70 font-semibold text-slate-600">12th Grade Aggregate:</td>
                        <td className="p-1.5 font-medium text-slate-800">{submittedApp.marks_12th}%</td>
                        <td className="p-1.5 bg-slate-50/70 font-semibold text-slate-600">Contact Number:</td>
                        <td className="p-1.5 font-mono text-slate-800">{submittedApp.phone}</td>
                      </tr>
                      <tr>
                        <td className="p-1.5 bg-slate-50/70 font-semibold text-slate-600">Permanent Address:</td>
                        <td colSpan={3} className="p-1.5 font-medium text-slate-800 text-[9.5px]">{submittedApp.address}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="border border-slate-300 rounded p-2.5 mb-3 text-[9.5px] bg-slate-50/50">
                  <span className="font-bold text-[#002147] uppercase tracking-wider block mb-0.5">
                    Important Instructions for Applicants:
                  </span>
                  <ul className="list-disc list-inside space-y-0.5 text-slate-700">
                    <li>Please keep this Application Reference Number <strong>({submittedApp.application_no})</strong> safe for tracking admission status online.</li>
                    <li>Applicants can track live review decisions anytime at <strong>capitalcollege.edu.in</strong> using the Track Status modal.</li>
                    <li>Upon provisional selection, report to the College Office at P.R. Hill, Kohima with original marksheets, Admit Cards, Transfer Certificate (TC), and 3 passport photos.</li>
                  </ul>
                </div>

                <div className="pt-3 mt-1 border-t border-slate-300 flex items-end justify-between text-[10px]">
                  <div className="text-center w-1/3">
                    <div className="border-b border-slate-400 w-32 mx-auto mb-1"></div>
                    <p className="font-bold text-slate-800 text-[9px]">Candidate Signature</p>
                  </div>
                  <div className="text-center w-1/3">
                    <div className="inline-block border-2 border-dashed border-[#002147] px-3 py-1 rounded text-center">
                      <p className="font-bold text-[#002147] text-[8.5px] uppercase tracking-wider">CCHE Admission Desk</p>
                      <p className="text-[7.5px] text-slate-500 font-mono">Computer Generated</p>
                    </div>
                  </div>
                  <div className="text-center w-1/3">
                    <div className="border-b border-slate-400 w-32 mx-auto mb-1"></div>
                    <p className="font-bold text-[#002147] text-[9px]">Admissions Authority</p>
                    <p className="text-[8px] text-slate-600">Capital College Kohima</p>
                  </div>
                </div>
              </div>
            </>
          ) : !isAdmissionActive ? (
            /* Admissions Closed Screen */
            <div className="py-2 space-y-5 animate-fadeIn">
              <div className="p-4 sm:p-5 bg-slate-50 border border-slate-300 rounded-2xl flex items-start gap-3.5 shadow-xs">
                <AlertCircle size={24} className="text-[#002147] shrink-0 mt-0.5" />
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-slate-200 text-slate-800 mb-1.5 border border-slate-300">
                    <span>Online Submissions Paused</span>
                  </div>
                  <h4 className="font-bold text-[#002147] text-base sm:text-lg">
                    Online Admissions Closed for Now
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-700 mt-1 leading-relaxed">
                    {currentNotice || 'Online admissions for FYUGP 4-Year B.A. & B.Sc. degree programmes are currently closed for now by college administration.'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Option 1: Offline Form */}
                <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/70 hover:bg-white hover:border-[#4a6b28] transition-all shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-[#002147] text-white flex items-center justify-center mb-3 shadow-xs">
                      <Download size={18} />
                    </div>
                    <h5 className="font-bold text-sm text-[#002147]">Download Official Print Form (PDF)</h5>
                    <p className="text-xs text-gray-600 mt-1.5 leading-relaxed">
                      Download, print and complete the official Admission Form 2024 to submit offline directly at the campus office.
                    </p>
                  </div>
                  <div className="pt-4">
                    <a
                      href="/admission_form.pdf"
                      download="admission_form.pdf"
                      className="inline-flex items-center gap-1.5 text-xs font-bold bg-[#4a6b28] hover:bg-[#3d5920] text-white px-4 py-2 rounded-xl transition-all shadow-sm cursor-pointer"
                    >
                      <Download size={13} />
                      <span>Download Form (PDF)</span>
                    </a>
                  </div>
                </div>

                {/* Option 2: Track Status */}
                <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/70 hover:bg-white hover:border-[#4a6b28] transition-all shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-[#002147] text-amber-300 flex items-center justify-center mb-3 shadow-xs">
                      <Search size={18} />
                    </div>
                    <h5 className="font-bold text-sm text-[#002147]">Check Previously Submitted Application</h5>
                    <p className="text-xs text-gray-600 mt-1.5 leading-relaxed">
                      Already submitted an application? Enter your application reference (CCH-2024-XXXX) to check your review status.
                    </p>
                  </div>
                  <div className="pt-4">
                    <button
                      onClick={() => {
                        resetForm();
                        onOpenTrackStatus && onOpenTrackStatus();
                      }}
                      className="inline-flex items-center gap-1.5 text-xs font-bold bg-[#002147] hover:bg-[#001736] text-white px-4 py-2 rounded-xl transition-all shadow-sm"
                    >
                      <Search size={13} />
                      <span>Track Application Status</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Campus Desk Info */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-gray-600 space-y-1">
                <p className="font-bold text-[#002147] uppercase tracking-wider text-[11px]">Admissions & Inquiries Desk</p>
                <p>Capital College of Higher Education, P.R. Hill, Kohima, Nagaland 797001</p>
                <p>College Timing: 9:00 am to 4:00 pm</p>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors"
                >
                  Close Window
                </button>
              </div>
            </div>
          ) : (
            /* Application Form */
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs md:text-sm rounded flex items-center gap-2">
                  <AlertCircle size={18} className="flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Section 1: Stream & Program */}
              <div className="bg-blue-50/50 p-4 rounded-lg border border-blue-100 space-y-4">
                <h4 className="font-bold text-sm text-[#002858] uppercase tracking-wide flex items-center gap-1.5">
                  <span className="w-5 h-5 bg-[#002858] text-white rounded-full flex items-center justify-center text-xs">1</span>
                  Program & Stream Choice
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Stream *</label>
                    <select
                      name="stream"
                      value={formData.stream}
                      onChange={handleChange}
                      className="w-full text-xs md:text-sm border border-gray-300 rounded px-3 py-2 bg-white focus:outline-none focus:border-[#4a6b28]"
                      required
                    >
                      <option value="ARTS">Bachelor of Arts (B.A.)</option>
                      <option value="SCIENCE">Bachelor of Science (B.Sc.)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Major Subject *</label>
                    <select
                      name="major_subject"
                      value={formData.major_subject}
                      onChange={handleChange}
                      className="w-full text-xs md:text-sm border border-gray-300 rounded px-3 py-2 bg-white focus:outline-none focus:border-[#4a6b28]"
                      required
                    >
                      {(formData.stream === 'ARTS' ? artsMajors : scienceMajors).map((m) => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Degree Type *</label>
                    <select
                      name="course_type"
                      value={formData.course_type}
                      onChange={handleChange}
                      className="w-full text-xs md:text-sm border border-gray-300 rounded px-3 py-2 bg-white focus:outline-none focus:border-[#4a6b28]"
                    >
                      <option value="HONOURS">Honours (FYUGP 4-Year)</option>
                      <option value="GENERAL">General (Pass Course)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Section 2: Personal Details */}
              <div className="space-y-4">
                <h4 className="font-bold text-sm text-[#002858] uppercase tracking-wide flex items-center gap-1.5">
                  <span className="w-5 h-5 bg-[#002858] text-white rounded-full flex items-center justify-center text-xs">2</span>
                  Applicant Personal Details
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Full Name (as per HSLC/Class 10) *</label>
                    <input
                      type="text"
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleChange}
                      placeholder="e.g. Kevisenuo Angami"
                      required
                      className="w-full text-xs md:text-sm border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-[#4a6b28]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="student@example.com"
                      required
                      className="w-full text-xs md:text-sm border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-[#4a6b28]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Mobile Phone Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="e.g. 9863XXXXXX"
                      required
                      className="w-full text-xs md:text-sm border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-[#4a6b28]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Date of Birth *</label>
                      <input
                        type="date"
                        name="dob"
                        value={formData.dob}
                        onChange={handleChange}
                        required
                        className="w-full text-xs md:text-sm border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-[#4a6b28]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Gender *</label>
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        className="w-full text-xs md:text-sm border border-gray-300 rounded px-3 py-2 bg-white focus:outline-none focus:border-[#4a6b28]"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 3: Academic Background */}
              <div className="space-y-4">
                <h4 className="font-bold text-sm text-[#002858] uppercase tracking-wide flex items-center gap-1.5">
                  <span className="w-5 h-5 bg-[#002858] text-white rounded-full flex items-center justify-center text-xs">3</span>
                  Academic Background & Qualifying Exam
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Class 12th Marks (%) *</label>
                    <input
                      type="number"
                      step="0.01"
                      name="marks_12th"
                      value={formData.marks_12th}
                      onChange={handleChange}
                      placeholder="e.g. 78.50"
                      required
                      className="w-full text-xs md:text-sm border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-[#4a6b28]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Board / Council *</label>
                    <select
                      name="board_name"
                      value={formData.board_name}
                      onChange={handleChange}
                      className="w-full text-xs md:text-sm border border-gray-300 rounded px-3 py-2 bg-white focus:outline-none focus:border-[#4a6b28]"
                    >
                      <option value="NBSE">Nagaland Board (NBSE)</option>
                      <option value="CBSE">CBSE</option>
                      <option value="ICSE">ICSE / ISC</option>
                      <option value="Other">Other State Board</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Last School Attended</label>
                    <input
                      type="text"
                      name="previous_school"
                      value={formData.previous_school}
                      onChange={handleChange}
                      placeholder="e.g. Kohima Govt. HSS"
                      className="w-full text-xs md:text-sm border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-[#4a6b28]"
                    />
                  </div>
                </div>
              </div>

              {/* Section 4: Guardian & Address */}
              <div className="space-y-4">
                <h4 className="font-bold text-sm text-[#002858] uppercase tracking-wide flex items-center gap-1.5">
                  <span className="w-5 h-5 bg-[#002858] text-white rounded-full flex items-center justify-center text-xs">4</span>
                  Guardian & Residential Address
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Parent / Guardian Name *</label>
                    <input
                      type="text"
                      name="guardian_name"
                      value={formData.guardian_name}
                      onChange={handleChange}
                      placeholder="Parent's Name"
                      required
                      className="w-full text-xs md:text-sm border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-[#4a6b28]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Guardian Contact Phone *</label>
                    <input
                      type="tel"
                      name="guardian_phone"
                      value={formData.guardian_phone}
                      onChange={handleChange}
                      placeholder="Guardian Contact Number"
                      required
                      className="w-full text-xs md:text-sm border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-[#4a6b28]"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Permanent Residential Address *</label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      rows={2}
                      placeholder="Colony/Village, Town, District, PIN code"
                      required
                      className="w-full text-xs md:text-sm border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-[#4a6b28]"
                    />
                  </div>
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-4 border-t border-gray-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-5 py-2.5 text-xs font-semibold text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-[#4a6b28] hover:bg-[#3d5920] text-white font-bold px-6 py-2.5 rounded text-xs md:text-sm uppercase tracking-wider shadow-md hover:shadow-lg transition-all disabled:opacity-50"
                >
                  {loading ? 'Submitting Application...' : 'Submit Admission Application'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
