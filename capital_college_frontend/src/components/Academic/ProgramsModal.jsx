import React from 'react';
import { X, BookOpen, Award, CheckCircle, GraduationCap, Download } from 'lucide-react';

export default function ProgramsModal({ isOpen, onClose, onOpenAdmission }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-4xl rounded-xl shadow-2xl overflow-hidden border border-gray-100 animate-fadeIn my-8">
        <div className="bg-[#002858] text-white px-6 py-4 flex items-center justify-between border-b-2 border-[#4a6b28]">
          <div>
            <h3 className="font-bold text-lg md:text-xl">Academic Programmes & Curriculum Structure</h3>
            <p className="text-xs text-gray-300">Nagaland University FYUGP 4-Year Undergraduate Degree Structure</p>
          </div>
          <button onClick={onClose} aria-label="Close" className="text-gray-300 hover:text-white p-1 rounded-full">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 md:p-8 space-y-6 text-gray-700 text-xs md:text-sm leading-relaxed max-h-[75vh] overflow-y-auto">
          {/* Arts Section */}
          <div className="border border-blue-200 bg-blue-50/30 p-5 rounded-lg">
            <h4 className="font-bold text-[#002858] text-base mb-2 flex items-center gap-2">
              <BookOpen size={18} className="text-[#4a6b28]" />
              <span>Bachelor of Arts (B.A.) - Arts Stream</span>
            </h4>
            <p className="text-gray-600 mb-3">
              Offered at P.R. Hill Campus, Kohima. Students can choose Honours or General programmes in seven major disciplines:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 font-medium text-gray-800">
              <div className="p-2 bg-white rounded border">✓ Economics</div>
              <div className="p-2 bg-white rounded border">✓ Education</div>
              <div className="p-2 bg-white rounded border">✓ English</div>
              <div className="p-2 bg-white rounded border">✓ History</div>
              <div className="p-2 bg-white rounded border">✓ Political Science</div>
              <div className="p-2 bg-white rounded border">✓ Sociology</div>
              <div className="p-2 bg-white rounded border">✓ Tenyidie</div>
            </div>
          </div>

          {/* Science Section */}
          <div className="border border-emerald-200 bg-emerald-50/30 p-5 rounded-lg">
            <h4 className="font-bold text-[#002858] text-base mb-2 flex items-center gap-2">
              <BookOpen size={18} className="text-[#4a6b28]" />
              <span>Bachelor of Science (B.Sc.) - Science Stream</span>
            </h4>
            <p className="text-gray-600 mb-3">
              Offered at Thegaba, Phezhu Campus, Jotsoma with modern laboratory setups (5 Disciplines):
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 font-medium text-gray-800">
              <div className="p-2 bg-white rounded border">✓ Botany</div>
              <div className="p-2 bg-white rounded border">✓ Chemistry</div>
              <div className="p-2 bg-white rounded border">✓ Mathematics</div>
              <div className="p-2 bg-white rounded border">✓ Physics</div>
              <div className="p-2 bg-white rounded border">✓ Zoology</div>
            </div>
          </div>

          {/* Skill Development & Vocational Section */}
          <div className="border border-slate-200 bg-slate-50/70 p-5 rounded-lg">
            <h4 className="font-bold text-[#002858] text-base mb-1.5 flex items-center gap-2">
              <Award size={18} className="text-[#4a6b28]" />
              <span>Skill Development &amp; Professional Certification</span>
            </h4>
            <p className="text-xs text-gray-600 mb-3">
              Institutional collaboration with <strong>Indianeers Skills Academy</strong> (official training partner of <strong>National Skill Development Corporation - NSDC</strong>):
            </p>
            <div className="p-3 bg-white rounded border border-slate-200 flex items-start gap-2.5">
              <CheckCircle size={16} className="text-[#4a6b28] shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-[#002858]">Skill Development Course in Tourism and Marketing</p>
                <p className="text-[11px] text-gray-500 mt-0.5">
                  3-Month intensive job-oriented certification course with direct job placement assistance for young graduates and unemployed youth. 5th Semester students are especially encouraged to enroll.
                </p>
              </div>
            </div>
          </div>

          {/* FYUGP Exit Options */}
          <div className="bg-gray-50 border p-4 rounded-lg">
            <h5 className="font-bold text-[#002858] uppercase tracking-wide text-xs mb-2">
              FYUGP Exit Pathway Options (National Education Policy &amp; Nagaland University)
            </h5>
            <ul className="space-y-1.5 text-gray-600 text-xs">
              <li>• <strong>1 Year (2 Semesters / 44 Credits):</strong> Undergraduate Certificate in Arts / Science</li>
              <li>• <strong>2 Years (4 Semesters / 88 Credits):</strong> Undergraduate Diploma in Arts / Science</li>
              <li>• <strong>3 Years (6 Semesters / 132 Credits):</strong> Bachelor Degree in Arts / Science (B.A. / B.Sc.)</li>
              <li>• <strong>4 Years (8 Semesters / 176 Credits):</strong> Bachelor Degree with Honours / Research (B.A. Hons. / B.Sc. Hons.)</li>
            </ul>
          </div>

          <div className="flex justify-end gap-3 pt-3">
            <a
              href="/admission_form.pdf"
              download="admission_form.pdf"
              className="bg-[#4a6b28] hover:bg-[#3d5920] text-white px-5 py-2 rounded text-xs font-bold uppercase tracking-wider transition-colors shadow-sm inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Download size={14} />
              <span>Application Form (PDF)</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
