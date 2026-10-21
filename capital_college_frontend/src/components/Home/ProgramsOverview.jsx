import React, { useState } from 'react';
import SectionTitle from '../Common/SectionTitle';
import { BookOpen, Atom, ArrowRight, CheckCircle, GraduationCap, Download } from 'lucide-react';

import { ARTS_DEPARTMENTS, SCIENCE_DEPARTMENTS } from '../../data/departmentData';

export default function ProgramsOverview({ onOpenAdmission, onOpenProgramsModal, onNavigate }) {
  const [activeTab, setActiveTab] = useState('arts');

  const handleOpenDetails = () => {
    if (onNavigate) {
      onNavigate('programs');
    } else if (onOpenProgramsModal) {
      onOpenProgramsModal();
    }
  };

  const handleDepartmentClick = (slug) => {
    window.location.href = `/department/${slug}`;
  };

  return (
    <section id="programs-overview" className="py-16 bg-[#fcfcfc] border-b border-gray-200 scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <SectionTitle
          eyebrow="ACADEMIC DISCIPLINES"
          title="Programmes & Courses"
          subtitle="Undergraduate Degree Programmes permanently affiliated to Nagaland University"
        />

        {/* Stream Toggle Tabs */}
        <div className="flex justify-center mb-6 sm:mb-8">
          <div className="inline-flex p-1.5 bg-gray-200 rounded-lg shadow-inner">
            <button
              onClick={() => setActiveTab('arts')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-md font-semibold text-xs md:text-sm transition-all ${
                activeTab === 'arts'
                  ? 'bg-[#002858] text-white shadow-md'
                  : 'text-gray-700 hover:text-[#002858]'
              }`}
            >
              <BookOpen size={16} />
              <span>Bachelor of Arts (B.A.)</span>
            </button>
            <button
              onClick={() => setActiveTab('science')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-md font-semibold text-xs md:text-sm transition-all ${
                activeTab === 'science'
                  ? 'bg-[#4a6b28] text-white shadow-md'
                  : 'text-gray-700 hover:text-[#4a6b28]'
              }`}
            >
              <Atom size={16} />
              <span>Bachelor of Science (B.Sc.)</span>
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'arts' && (
          <div>
            <div className="bg-blue-50/70 border border-blue-200/60 rounded-xl p-5 mb-8 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h4 className="font-bold text-[#002858] text-lg">Arts Stream Campus: P.R. Hill, Kohima</h4>
                <p className="text-xs text-gray-600 mt-1">
                  Permanently affiliated to Nagaland University. Offers Bachelor of Arts (Honours &amp; General) programmes.
                </p>
              </div>
              <a
                href="https://capitalcollege.edu.in/wp-content/uploads/2024/04/Admission-Form-2024.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#002858] hover:bg-[#001d40] text-white text-xs font-semibold px-4 py-2 rounded uppercase tracking-wider inline-flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
              >
                <Download size={13} />
                <span>Admission Form (PDF)</span>
              </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {ARTS_DEPARTMENTS.map((dept, idx) => (
                <div
                  key={dept.id}
                  style={{ animationDelay: `${idx * 60}ms` }}
                  className="card-interactive card-accent-top animate-card-in bg-white p-5 rounded-xl border border-gray-200/90 shadow-xs flex flex-col justify-between group cursor-default"
                >
                  <div>
                    <span className="text-[11px] font-bold text-[#4a6b28] uppercase tracking-wider">
                      {dept.degree}
                    </span>
                    <h3 className="text-lg font-bold text-[#002858] group-hover:text-[#4a6b28] transition-colors mt-1 mb-2">
                      {dept.name}
                    </h3>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      Affiliated to Nagaland University, Kohima Campus.
                    </p>
                  </div>
                  <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-[11px] text-gray-500 font-medium">Code: {dept.code}</span>
                    <a
                      href={`/department/${dept.slug}`}
                      className="text-xs font-bold text-[#002858] group-hover:text-[#4a6b28] inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <span>Faculty &amp; Details</span>
                      <ArrowRight size={13} className="arrow-hover-slide" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'science' && (
          <div>
            <div className="bg-[#fdf9f0] border border-[#e5b564] rounded-xl p-5 mb-8 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h4 className="font-bold text-[#002858] text-lg">Science Stream Campus: Thegaba, Phezhu, Jotsoma</h4>
                <p className="text-xs text-gray-600 mt-1">
                  Offers Bachelor of Science (B.Sc.) programmes with state-of-the-art laboratory facilities.
                </p>
              </div>
              <a
                href="https://capitalcollege.edu.in/wp-content/uploads/2024/04/Admission-Form-2024.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#4a6b28] hover:bg-[#3d5920] text-white text-xs font-semibold px-4 py-2 rounded uppercase tracking-wider inline-flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
              >
                <Download size={13} />
                <span>Admission Form (PDF)</span>
              </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {SCIENCE_DEPARTMENTS.map((dept, idx) => (
                <div
                  key={dept.id}
                  style={{ animationDelay: `${idx * 60}ms` }}
                  className="card-interactive card-accent-top animate-card-in bg-white p-5 rounded-xl border border-gray-200/90 shadow-xs flex flex-col justify-between group cursor-default"
                >
                  <div>
                    <span className="text-[11px] font-bold text-[#002858] uppercase tracking-wider">
                      {dept.degree}
                    </span>
                    <h3 className="text-lg font-bold text-[#002858] group-hover:text-[#4a6b28] transition-colors mt-1 mb-2">
                      {dept.name}
                    </h3>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      Affiliated to Nagaland University, Science Campus.
                    </p>
                  </div>
                  <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-[11px] text-gray-500 font-medium">Code: {dept.code}</span>
                    <a
                      href={`/department/${dept.slug}`}
                      className="text-xs font-bold text-[#4a6b28] group-hover:text-[#002858] inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <span>Faculty &amp; Details</span>
                      <ArrowRight size={13} className="arrow-hover-slide" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* View All Details Button */}
        <div className="text-center mt-10">
          <button
            onClick={handleOpenDetails}
            className="group inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-[#002858] border-2 border-[#002858] hover:border-[#4a6b28] hover:text-[#4a6b28] px-6 py-2.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 active:translate-y-0 active:scale-98 cursor-pointer"
          >
            <GraduationCap size={16} className="text-[#4a6b28] group-hover:rotate-6 transition-transform duration-300" />
            <span>View Full FYUGP Degree Framework & Course Outlines</span>
          </button>
        </div>
      </div>
    </section>
  );
}
