import React from 'react';
import { X, CheckCircle, FileText, Download, Calendar } from 'lucide-react';

export default function AdmissionCriteriaModal({ isOpen, onClose, onOpenAdmission }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden border border-gray-100 animate-fadeIn my-8">
        <div className="bg-[#002858] text-white px-6 py-4 flex items-center justify-between border-b-2 border-[#4a6b28]">
          <h3 className="font-bold text-lg md:text-xl">Criteria & Eligibility (FYUGP)</h3>
          <button onClick={onClose} aria-label="Close" className="text-gray-300 hover:text-white p-1 rounded-full">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 md:p-8 space-y-5 text-gray-700 text-xs md:text-sm leading-relaxed max-h-[75vh] overflow-y-auto">
          <div className="bg-blue-50/70 p-4 rounded-lg border border-blue-200">
            <h4 className="font-bold text-[#002858] text-base mb-2">Nagaland University FYUGP Framework</h4>
            <p className="text-justify">
              Based on the decision of <strong>Nagaland University</strong> to introduce the <strong>Four Years Under Graduate Programme (FYUGP)</strong> from the 2023-2024 session onwards, in alignment with the Curriculum and Credit Framework Guidelines, eligibility for admission is as follows:
            </p>
          </div>

          <div className="space-y-3">
            <h5 className="font-bold text-gray-900 uppercase tracking-wide text-xs">Minimum Academic Qualifications</h5>
            <div className="p-3 bg-gray-50 rounded border border-gray-200 flex items-start gap-3">
              <CheckCircle size={18} className="text-[#4a6b28] mt-0.5 flex-shrink-0" />
              <div>
                <strong>Undergraduate Degree (B.A. & B.Sc.)</strong>
                <p className="text-gray-600 mt-1">
                  "Senior Secondary School Leaving Certificate or Higher Secondary (12th Grade) Certificate obtained after successful completion of Grade 12 or equivalent stage of education corresponding to level-4" as specified in the Nagaland University Guidelines.
                </p>
              </div>
            </div>

            <div className="p-3 bg-gray-50 rounded border border-gray-200 flex items-start gap-3">
              <CheckCircle size={18} className="text-[#4a6b28] mt-0.5 flex-shrink-0" />
              <div>
                <strong>Science Stream Special Requirement</strong>
                <p className="text-gray-600 mt-1">
                  Candidates seeking admission into Bachelor of Science (Botany, Zoology, Chemistry, Physics) must have passed Class 12 / HSSLC Science stream with the relevant subject combinations from a recognized board (NBSE/CBSE/ICSE/State Board).
                </p>
              </div>
            </div>
          </div>

          <div className="border-t pt-4">
            <h5 className="font-bold text-gray-900 uppercase tracking-wide text-xs mb-2">Documents Required at Verification</h5>
            <ul className="list-disc list-inside space-y-1 text-gray-600 pl-1">
              <li>Original & attested copies of Class 10 & 12 Marksheets</li>
              <li>Pass Certificates & Admit Cards</li>
              <li>Registration Card of previous Board/Council</li>
              <li>Transfer Certificate & Conduct Certificate from institution last attended</li>
              <li>Indigenous Inhabitant / Scheduled Tribe (ST) Certificate (if applicable)</li>
              <li>Passport size color photographs (3 copies)</li>
            </ul>
          </div>

          <div className="border-t pt-4 flex flex-wrap items-center justify-between gap-4">
            <a
              href="https://capitalcollege.edu.in/wp-content/uploads/2024/04/CCHE-Prospectus-2024-05.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-[#002858] font-semibold hover:underline"
            >
              <Download size={14} className="text-[#4a6b28]" />
              <span>Download Official Prospectus</span>
            </a>

            <a
              href="/admission_form.pdf"
              download="admission_form.pdf"
              className="bg-[#4a6b28] text-white px-5 py-2 rounded text-xs font-bold uppercase tracking-wider hover:bg-[#3d5920] transition-colors inline-flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Download size={14} />
              <span>Download Admission Form (PDF)</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
