import React, { useState } from 'react';
import SectionTitle from '../Common/SectionTitle';
import { BookOpen, Atom, ArrowRight, CheckCircle, GraduationCap, Download } from 'lucide-react';

export default function ProgramsOverview({ onOpenAdmission, onOpenProgramsModal, onNavigate }) {
  const [activeTab, setActiveTab] = useState('arts');

  const handleOpenDetails = () => {
    if (onNavigate) {
      onNavigate('programs');
    } else if (onOpenProgramsModal) {
      onOpenProgramsModal();
    }
  };

  const artsCourses = [
    { name: 'Economics', type: 'Honours & General', desc: 'Micro/Macro Economics, Quantitative Methods, Public Finance & Indian Economic Policy.' },
    { name: 'Education', type: 'Honours & General', desc: 'Educational Psychology, Curriculum Pedagogy, Evaluation & Comparative Education.' },
    { name: 'English', type: 'Honours & General', desc: 'World Literatures, Literary Criticism, Linguistic Structures & Academic Writing.' },
    { name: 'History', type: 'Honours & General', desc: 'Ancient, Medieval, Modern Indian History & Northeast Regional History Archives.' },
    { name: 'Political Science', type: 'Honours & General', desc: 'Constitutional Government, Political Theory, Comparative Politics & International Relations.' },
    { name: 'Sociology', type: 'Honours & General', desc: 'Social Stratification, Tribal Communities, Research Methodologies & Cultural Sociology.' },
    { name: 'Tenyidie', type: 'Honours & General', desc: 'Indigenous Linguistic Traditions, Naga Cultural Poetics, Grammar & Folkloristics.' }
  ];

  const scienceCourses = [
    { name: 'Botany', type: 'Honours & General', desc: 'Plant Morphology, Taxonomy, Ecology, Biochemistry & Practical Laboratory Experiments.' },
    { name: 'Chemistry', type: 'Honours & General', desc: 'Inorganic, Organic & Physical Chemistry, Chemical Kinetics & Analytical Instrumentation.' },
    { name: 'Mathematics', type: 'Honours & General', desc: 'Differential & Integral Calculus, Real Analysis, Abstract Algebra, Differential Equations & Numerical Methods.' },
    { name: 'Physics', type: 'Honours & General', desc: 'Classical Mechanics, Electrodynamics, Solid State Physics & Experimental Physics.' },
    { name: 'Zoology', type: 'Honours & General', desc: 'Animal Diversity, Cell Biology, Physiology, Genetics, Evolution & Wildlife Ecology.' }
  ];

  return (
    <section id="programs-overview" className="py-16 bg-[#fcfcfc] border-b border-gray-200 scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <SectionTitle
          eyebrow="ACADEMIC DISCIPLINES"
          title="Programmes & Courses"
          subtitle="Four-Year Undergraduate Honours Programmes (FYUGP) affiliated to Nagaland University"
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
                  Permanently affiliated to Nagaland University. Offers 4-Year Bachelor of Arts degrees with Major and Minor subject combinations.
                </p>
              </div>
              <a
                href="/admission_form.pdf"
                download="admission_form.pdf"
                className="bg-[#002858] hover:bg-[#001d40] text-white text-xs font-semibold px-4 py-2 rounded uppercase tracking-wider inline-flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
              >
                <Download size={13} />
                <span>Admission Form (PDF)</span>
              </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {artsCourses.map((c, idx) => (
                <div
                  key={c.name}
                  style={{ animationDelay: `${idx * 60}ms` }}
                  className="card-interactive card-accent-top animate-card-in bg-white p-5 rounded-xl border border-gray-200/90 shadow-xs flex flex-col justify-between group cursor-default"
                >
                  <div>
                    <span className="text-[11px] font-bold text-[#4a6b28] uppercase tracking-wider">
                      {c.type}
                    </span>
                    <h3 className="text-lg font-bold text-[#002858] group-hover:text-[#4a6b28] transition-colors mt-1 mb-2">
                      Department of {c.name}
                    </h3>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      {c.desc}
                    </p>
                  </div>
                  <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-[11px] text-gray-500 font-medium">4 Years (8 Semesters)</span>
                    <a
                      href="/admission_form.pdf"
                      download="admission_form.pdf"
                      className="text-xs font-bold text-[#002858] group-hover:text-[#4a6b28] inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <span>Form (PDF)</span>
                      <Download size={13} className="arrow-hover-slide" />
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
                  Modern campus equipped with high-standard science laboratories, precision instrumentation, and experimental research facilities.
                </p>
              </div>
              <a
                href="/admission_form.pdf"
                download="admission_form.pdf"
                className="bg-[#4a6b28] hover:bg-[#3d5920] text-white text-xs font-semibold px-4 py-2 rounded uppercase tracking-wider inline-flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
              >
                <Download size={13} />
                <span>Admission Form (PDF)</span>
              </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {scienceCourses.map((c, idx) => (
                <div
                  key={c.name}
                  style={{ animationDelay: `${idx * 60}ms` }}
                  className="card-interactive card-accent-top animate-card-in bg-white p-5 rounded-xl border border-gray-200/90 shadow-xs flex flex-col justify-between group cursor-default"
                >
                  <div>
                    <span className="text-[11px] font-bold text-[#002858] uppercase tracking-wider">
                      {c.type}
                    </span>
                    <h3 className="text-lg font-bold text-[#002858] group-hover:text-[#4a6b28] transition-colors mt-1 mb-2">
                      Department of {c.name}
                    </h3>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      {c.desc}
                    </p>
                  </div>
                  <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-[11px] text-gray-500 font-medium">4 Years (8 Semesters)</span>
                    <a
                      href="/admission_form.pdf"
                      download="admission_form.pdf"
                      className="text-xs font-bold text-[#4a6b28] group-hover:text-[#002858] inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <span>Form (PDF)</span>
                      <Download size={13} className="arrow-hover-slide" />
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
