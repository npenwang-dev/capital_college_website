import React, { useState, useEffect, useMemo } from 'react';
import {
  ExternalLink,
  Download,
  BookOpen,
  GraduationCap,
  ArrowRight,
  Search,
  FileText,
  Eye,
  CheckCircle2,
  Atom,
  Award,
  Layers,
  Sparkles,
  MapPin,
  Clock,
  ShieldCheck,
  CheckCircle,
  Briefcase,
  TrendingUp,
  Landmark,
  Scale,
  Users,
  FlaskConical,
  Compass,
  Leaf,
  Dna,
  Feather,
  Info,
  ChevronRight,
  X,
  Calendar,
  Check,
  HeartHandshake,
  Building2,
  ShieldAlert,
  Medal,
  Trophy,
  Scroll,
  BadgeCheck,
  UserCheck,
  School,
  FileCheck,
  Phone,
  Mail,
  FileSignature,
  Music,
  Flag,
  Shield
} from 'lucide-react';
import NoticeBoardPage from './NoticeBoardPage';
import EventsPage from './EventsPage';
import DepartmentPage from './DepartmentPage';
import ContactPage from './ContactPage';
import { getDepartmentBySlug } from '../../data/departmentData';
import LandingReveal from '../Common/LandingReveal';
import PersonCard from '../Common/PersonCard';

function CommitteesAndInChargesSection() {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('table'); // 'table' | 'scan'
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const committees = [
    {
      slNo: 1,
      category: 'DEAN',
      categoryLabel: 'Dean Office',
      name: 'Dean of Students',
      inCharge: 'Mrs. Tatongkala (Dean of Students)',
      coordination: [
        'Students Alumni',
        'Students Welfare Scheme',
        'Anti Ragging Committee',
        'Evangelical Union',
        "Student's Guidance Cell",
        "Students' Grievance Cell",
        'Counseling & Monitoring'
      ]
    },
    {
      slNo: 2,
      category: 'DEAN',
      categoryLabel: 'Dean Office',
      name: 'Academic Dean',
      inCharge: 'Mrs. Abeino (Academic Dean)',
      coordination: [
        'Curriculum Framework & Delivery',
        'HoD Reports',
        'Admission Committee',
        'Examination Committee',
        'Internship Monitoring Committee'
      ]
    },
    { slNo: 3, category: 'ACADEMIC', categoryLabel: 'Academic & IQAC', name: 'NAAC & IQAC', inCharge: 'Opangnenla & Theja (Assistant)' },
    { slNo: 4, category: 'ASSOCIATION', categoryLabel: 'Associations & Alumni', name: 'Students Alumni', inCharge: 'Kevivono, Opangmenla and Abeino' },
    { slNo: 5, category: 'ACADEMIC', categoryLabel: 'Academic & IQAC', name: 'Literary', inCharge: 'English and Tenyidie Department' },
    { slNo: 6, category: 'ACADEMIC', categoryLabel: 'Academic & IQAC', name: 'Admission Committee', inCharge: 'All HoDs' },
    { slNo: 7, category: 'ACADEMIC', categoryLabel: 'Academic & IQAC', name: 'Examination Committee', inCharge: 'Vevohu Kezo (Convenor)' },
    { slNo: 8, category: 'ACADEMIC', categoryLabel: 'Academic & IQAC', name: 'Research Cell', inCharge: 'Dr. Rukulu, Shedulu' },
    { slNo: 9, category: 'GOVERNANCE', categoryLabel: 'Governance & Policy', name: 'College NEP FYUGP Board', inCharge: 'Principal (Chairperson), Vice Principal (Vice Chairperson), Academic Dean, All HoDs, IQAC Coordinator & Dean of Students' },
    { slNo: 10, category: 'WELFARE', categoryLabel: 'Welfare & Grievance', name: "Teacher's Welfare Board", inCharge: 'Mrs. Abeino Zhasu (Convenor), Chubarenla, Theja' },
    { slNo: 11, category: 'WELFARE', categoryLabel: 'Welfare & Grievance', name: 'Women Cell', inCharge: 'Chubarenla, Meyiepeo, Girl Student Representative' },
    { slNo: 12, category: 'ACTIVITIES', categoryLabel: 'Campus Life & Activities', name: 'NSS / RRC', inCharge: 'Temsuwapang, Theja, Vizoboto' },
    { slNo: 13, category: 'CELL', categoryLabel: 'Student Guidance & Cells', name: 'Career Guidance Cell', inCharge: 'Niekhoto, Akanjungla, Wanshimongla, Dr. Rukulu' },
    { slNo: 14, category: 'ACADEMIC', categoryLabel: 'Academic & IQAC', name: 'Seminars workshops', inCharge: 'Temsuwapang, Chubarenla, Khrielakuo' },
    { slNo: 15, category: 'WELFARE', categoryLabel: 'Welfare & Grievance', name: 'Anti ragging Cell', inCharge: 'Kevivono, Kumuni' },
    { slNo: 16, category: 'WELFARE', categoryLabel: 'Welfare & Grievance', name: 'Tobacco Control', inCharge: 'Niekhoto, Meyiepeo, Shedulu, Akanjungla' },
    { slNo: 17, category: 'ASSOCIATION', categoryLabel: 'Associations & Alumni', name: 'Parents Teacher Association', inCharge: 'Vevohu, Akanjungla, Shedulu, Niekhoto, Kumuni & 2 Parent Reps.' },
    { slNo: 18, category: 'CELL', categoryLabel: 'Student Guidance & Cells', name: 'Counseling and mentoring', inCharge: 'Shedulu, Kumuni, Akanjungla, Niekhoto' },
    { slNo: 19, category: 'WELFARE', categoryLabel: 'Welfare & Grievance', name: "Student's grievance", inCharge: 'Akanjungla, Shedulu, Niekhoto' },
    { slNo: 20, category: 'MEDIA', categoryLabel: 'IT, Media & Web', name: 'IT & Media Cell', inCharge: 'Niekhoto, Kumuni, Akanjungla' },
    { slNo: 21, category: 'ACTIVITIES', categoryLabel: 'Campus Life & Activities', name: 'Games and Sports', inCharge: 'Vizoboto, Temsuwapang, Wanshimongla, Khrielakuo' },
    { slNo: 22, category: 'MEDIA', categoryLabel: 'IT, Media & Web', name: 'Magazine / Bulletin', inCharge: 'Vizoboto, Khrielakuo, Dr. Rukulu, Among, Kevivono' },
    { slNo: 23, category: 'ASSOCIATION', categoryLabel: 'Associations & Alumni', name: 'Evangelical Union', inCharge: 'Vevohu, Theja' },
    { slNo: 24, category: 'WELFARE', categoryLabel: 'Welfare & Grievance', name: "Student's Welfare Scheme", inCharge: 'Kevivono, Meyiepeo' },
    {
      slNo: 25,
      category: 'ACTIVITIES',
      categoryLabel: 'Campus Life & Activities',
      name: 'Clubs',
      inCharge: 'Eco, Art, Photography, Music, Drama',
      clubs: [
        { name: 'Eco Club', inCharge: 'Temsuwapang, Theja' },
        { name: 'Art, Photography & Music Club', inCharge: 'Vizoboto, Khrielakuo, Theja, Wanshimongla, Dr. Rukulu' },
        { name: 'Drama Club', inCharge: 'English Department' }
      ]
    },
    { slNo: 26, category: 'MEDIA', categoryLabel: 'IT, Media & Web', name: 'College Website', inCharge: 'Theja' }
  ];

  const categories = [
    { key: 'ALL', label: 'All Bodies (26)' },
    { key: 'DEAN', label: 'Deans Coordination' },
    { key: 'ACADEMIC', label: 'Academics & NAAC' },
    { key: 'WELFARE', label: 'Student Welfare & Safety' },
    { key: 'CELL', label: 'Guidance & Mentoring' },
    { key: 'ACTIVITIES', label: 'Sports, NSS & Clubs' },
    { key: 'ASSOCIATION', label: 'Alumni, PTA & EU' },
    { key: 'MEDIA', label: 'IT, Media & Website' }
  ];

  const filtered = committees.filter((item) => {
    const q = search.trim().toLowerCase();
    const matchesSearch =
      !q ||
      item.name.toLowerCase().includes(q) ||
      item.inCharge.toLowerCase().includes(q) ||
      (item.coordination && item.coordination.some((c) => c.toLowerCase().includes(q))) ||
      (item.clubs && item.clubs.some((cl) => cl.name.toLowerCase().includes(q) || cl.inCharge.toLowerCase().includes(q)));
    if (selectedCategory === 'ALL') return matchesSearch;
    return matchesSearch && item.category === selectedCategory;
  });

  return (
    <div className="space-y-6 text-gray-800 text-sm md:text-base leading-relaxed font-sans">
      {/* Official Notice Header */}
      <div className="border border-blue-900/20 bg-gradient-to-r from-blue-50/60 via-amber-50/30 to-blue-50/60 p-5 md:p-6 rounded-2xl shadow-xs">
        <div className="text-center pb-4 border-b border-gray-200">
          <p className="text-xs uppercase tracking-widest font-semibold text-gray-500">Office of the Principal</p>
          <h2 className="text-xl sm:text-2xl font-bold text-[#002858] tracking-tight mt-0.5">
            Capital College of Higher Education
          </h2>
          <p className="text-xs text-gray-600 font-medium">P.R. Hill, Kohima, Nagaland 797001</p>
          <div className="inline-block mt-3 px-3 py-1 bg-[#002858] text-white rounded-md text-xs font-bold uppercase tracking-wider">
            Office Circular
          </div>
          <p className="text-xs text-gray-500 mt-2 font-medium">
            Dated the <span className="font-semibold text-gray-800">2nd Aug. 2024</span> • Effective w.e.f <span className="font-semibold text-gray-800">5th Aug. 2024</span>
          </p>
        </div>
        <p className="text-xs md:text-sm text-gray-700 leading-relaxed text-justify pt-4">
          This is to inform all the faculty members that changes have been made in the teachers-in-charges for the different committees. All faculty members are to note that the changes and re-assignments as given in the table below shall be followed w.e.f 5th Aug. 2024.
        </p>
      </div>

      {/* Tabs Switcher: Interactive Directory vs Scanned Document */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-1.5 p-1 bg-gray-100 rounded-xl border border-gray-200 text-xs sm:text-sm font-semibold">
          <button
            onClick={() => setActiveTab('table')}
            className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
              activeTab === 'table'
                ? 'bg-[#002858] text-white shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <FileText size={15} />
            <span>Interactive Directory ({committees.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('scan')}
            className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
              activeTab === 'scan'
                ? 'bg-[#002858] text-white shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Eye size={15} />
            <span>Official Scanned Document</span>
          </button>
        </div>

        <a
          href="https://capitalcollege.edu.in/wp-content/uploads/2023/05/WhatsApp-Image-2024-09-09-at-10.31.18-AM-scaled.jpeg"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 bg-[#4a6b28] hover:bg-[#3d5920] text-white px-3.5 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors shadow-xs"
        >
          <Download size={13} />
          <span>Download Document (Image)</span>
        </a>
      </div>

      {activeTab === 'table' ? (
        <div className="space-y-4 pt-2">
          {/* Search & Category Filter */}
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between bg-gray-50 p-3.5 rounded-xl border border-gray-200">
            <div className="relative flex-1">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search committee name, in-charge teacher, or cell..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#002858] text-gray-800"
              />
            </div>
            {search && (
              <button
                onClick={() => setSearch('')}
                className="text-xs text-gray-500 hover:text-gray-800 self-center"
              >
                Clear Search
              </button>
            )}
          </div>

          {/* Quick Categories */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setSelectedCategory(cat.key)}
                className={`px-3 py-1.5 rounded-full whitespace-nowrap transition-colors font-medium border ${
                  selectedCategory === cat.key
                    ? 'bg-[#002858] text-white border-[#002858]'
                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-100'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Structured Table */}
          <div className="overflow-hidden border border-gray-200 rounded-xl shadow-xs bg-white">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="bg-[#002858] text-white">
                    <th className="py-3 px-3 sm:px-4 font-bold w-14 sm:w-16 text-center border-r border-blue-900/60">
                      Sl. No
                    </th>
                    <th className="py-3 px-3 sm:px-4 font-bold w-1/3 border-r border-blue-900/60">
                      Bodies / Committees
                    </th>
                    <th className="py-3 px-3 sm:px-4 font-bold">
                      In charge(s)
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan="3" className="text-center py-8 text-gray-500">
                        No committees match your search "{search}".
                      </td>
                    </tr>
                  ) : (
                    filtered.map((item) => (
                      <tr
                        key={item.slNo}
                        className={`hover:bg-amber-50/40 transition-colors ${
                          item.category === 'DEAN' ? 'bg-blue-50/30' : ''
                        }`}
                      >
                        <td className="py-3.5 px-3 sm:px-4 text-center font-bold text-gray-700 align-top border-r border-gray-100">
                          {item.slNo}
                        </td>
                        <td className="py-3.5 px-3 sm:px-4 font-bold text-[#002858] align-top border-r border-gray-100">
                          <span>{item.name}</span>
                          <span className="block mt-0.5 text-[10px] font-semibold uppercase text-gray-400">
                            {item.categoryLabel}
                          </span>
                        </td>
                        <td className="py-3.5 px-3 sm:px-4 text-gray-800 align-top">
                          <p className="font-semibold text-gray-900 leading-snug">{item.inCharge}</p>

                          {/* Coordinated Sub-Wings for Deans */}
                          {item.coordination && (
                            <div className="mt-2.5 pl-3 border-l-2 border-amber-400 space-y-1 bg-amber-50/50 p-2.5 rounded-r-lg">
                              <p className="text-[11px] font-bold text-[#002858] uppercase tracking-wide">
                                Coordinating Responsibilities:
                              </p>
                              {item.coordination.map((coord, idx) => (
                                <p key={idx} className="text-xs text-gray-700 font-medium pl-1">
                                  {coord}
                                </p>
                              ))}
                            </div>
                          )}

                          {/* Sub-clubs */}
                          {item.clubs && (
                            <div className="mt-2 space-y-1.5 pl-3 border-l-2 border-[#002858] bg-gray-50 p-2.5 rounded-r-lg">
                              {item.clubs.map((subClub, idx) => (
                                <div key={idx} className="text-xs">
                                  <strong className="text-[#002858]">{subClub.name}:</strong>{' '}
                                  <span className="text-gray-700">{subClub.inCharge}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 flex flex-wrap items-center justify-between gap-3 text-xs text-gray-600">
            <p>
              Showing <strong className="text-gray-900">{filtered.length}</strong> of{' '}
              <strong className="text-gray-900">{committees.length}</strong> official committees and bodies.
            </p>
            <p className="font-semibold text-gray-800">
              Authority: Dr. Zokho Venuh, Principal, CCHE Kohima
            </p>
          </div>
        </div>
      ) : (
        /* Scanned Circular View */
        <div className="space-y-4 pt-2">
          <div className="p-4 bg-amber-50/80 border border-amber-200 rounded-xl text-xs sm:text-sm text-gray-800 flex items-center justify-between flex-wrap gap-2">
            <div>
              <p className="font-bold text-[#002858]">Official Signed Scanned Copy</p>
              <p className="text-xs text-gray-600">
                Official document issued on 2nd August 2024 from the Office of the Principal.
              </p>
            </div>
            <a
              href="https://capitalcollege.edu.in/wp-content/uploads/2023/05/WhatsApp-Image-2024-09-09-at-10.31.18-AM-scaled.jpeg"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#002858] hover:text-[#4a6b28] underline"
            >
              <ExternalLink size={13} />
              <span>Open Full Size Image</span>
            </a>
          </div>

          <div className="rounded-2xl overflow-hidden border border-gray-200 bg-white shadow-md p-2 sm:p-4 flex items-center justify-center">
            <img
              src="https://capitalcollege.edu.in/wp-content/uploads/2023/05/WhatsApp-Image-2024-09-09-at-10.31.18-AM-scaled.jpeg"
              alt="Committees and In-charges Capital College Kohima"
              className="w-full h-auto object-contain block mx-auto max-w-4xl rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
}

function ProgramsAndCoursesSection({ onNavigate, onOpenAdmission }) {
  const [activeTab, setActiveTab] = useState('disciplines'); // 'disciplines' | 'fyugp' | 'skill' | 'evaluation' | 'eligibility'
  const [streamFilter, setStreamFilter] = useState('ALL'); // 'ALL' | 'ARTS' | 'SCIENCE'
  const [search, setSearch] = useState('');
  const [selectedDiscipline, setSelectedDiscipline] = useState(null);

  const allDisciplines = [
    // 7 Arts Disciplines (P.R. Hill Campus, Kohima)
    {
      id: 'economics',
      name: 'Economics',
      stream: 'ARTS',
      degree: 'B.A. (Honours & Regular)',
      campus: 'P.R. Hill Campus, Kohima',
      campusShort: 'P.R. Hill, Kohima',
      icon: TrendingUp,
      desc: 'Micro & Macroeconomics, Development Economics, Quantitative Methods, Public Finance, Monetary Policy, and the Indian & Northeast Economic System under Nagaland University.',
      eligibility: '10+2 / HSSLC passed in any stream from a recognized board.',
      keyAreas: ['Micro & Macro Theory', 'Public Finance & Budgeting', 'Statistical & Quantitative Tools', 'Indian & Northeast Economic Policy'],
      coreModules: [
        'Introductory & Advanced Microeconomics',
        'Macroeconomic Analysis & Monetary Economics',
        'Mathematical Methods & Statistics for Economics',
        'Development Economics & Public Finance',
        'Economy of Nagaland & Northeast Region'
      ],
      minors: ['Political Science', 'History', 'Mathematics', 'Sociology', 'English'],
      careerPaths: ['UPSC / NPSC State Civil Services', 'Banking & Financial Policy Analytics', 'Economic Advisory & Planning Boards', 'Postgraduate Studies (M.A./Ph.D.) & Academia']
    },
    {
      id: 'education',
      name: 'Education',
      stream: 'ARTS',
      degree: 'B.A. (Honours & Regular)',
      campus: 'P.R. Hill Campus, Kohima',
      campusShort: 'P.R. Hill, Kohima',
      icon: GraduationCap,
      desc: 'Philosophical & Sociological Foundations of Education, Educational Psychology, Curriculum Development, Educational Technology, Pedagogy, and Guidance & Counseling.',
      eligibility: '10+2 / HSSLC passed in any stream from a recognized board.',
      keyAreas: ['Educational Psychology', 'Curriculum Pedagogy', 'Educational Measurement & Evaluation', 'Guidance & Counseling'],
      coreModules: [
        'Philosophical & Sociological Bases of Education',
        'Developmental Psychology of the Learner',
        'Educational Measurement, Statistics & Evaluation',
        'Educational Technology, Pedagogy & Management',
        'Guidance, Counseling & Special Education'
      ],
      minors: ['Sociology', 'English', 'History', 'Political Science'],
      careerPaths: ['School & Higher Secondary Teaching', 'Educational Administration & DIET / SCERT', 'Curriculum Development & Counseling Services', 'NGOs & Child Development Projects']
    },
    {
      id: 'english',
      name: 'English',
      stream: 'ARTS',
      degree: 'B.A. (Honours & Regular)',
      campus: 'P.R. Hill Campus, Kohima',
      campusShort: 'P.R. Hill, Kohima',
      icon: BookOpen,
      desc: 'British, American, and Indian English Literatures, Linguistics, Phonetics, Modern Literary Theory, Cultural Studies, and Professional Academic Writing.',
      eligibility: '10+2 / HSSLC passed in any stream from a recognized board.',
      keyAreas: ['World & Indian Literatures', 'Linguistics & Phonetics', 'Literary Criticism & Theory', 'Academic & Professional Writing'],
      coreModules: [
        'British Poetry, Drama & Fiction from Chaucer to Modernism',
        'Indian Writing in English & Postcolonial Literatures',
        'Introduction to Linguistics, Phonetics & Syntax',
        'Literary Criticism, Modern Critical Theory & Cultural Studies',
        'Professional Academic Writing & Communication Skills'
      ],
      minors: ['History', 'Political Science', 'Sociology', 'Tenyidie', 'Education'],
      careerPaths: ['UPSC / NPSC Civil Services', 'Publishing, Journalism, Media & Communications', 'Content Creation, Copywriting & Public Relations', 'College Lecturership, UGC NET & Research']
    },
    {
      id: 'history',
      name: 'History',
      stream: 'ARTS',
      degree: 'B.A. (Honours & Regular)',
      campus: 'P.R. Hill Campus, Kohima',
      campusShort: 'P.R. Hill, Kohima',
      icon: Landmark,
      desc: 'Ancient, Medieval, and Modern Indian History, History of Northeast India, World Civilizations, Archaeological Methods, and Historical Research.',
      eligibility: '10+2 / HSSLC passed in any stream from a recognized board.',
      keyAreas: ['Ancient & Medieval India', 'Modern National Movement', 'Northeast India & Naga Heritage', 'Archaeology & Historiography'],
      coreModules: [
        'History of Ancient & Early Medieval India',
        'Medieval Indian Polity, Society & Culture',
        'Modern Indian History & the National Freedom Struggle',
        'History of Northeast India & Nagas through the Ages',
        'Historiography, Archival Methods & World Civilizations'
      ],
      minors: ['Political Science', 'Sociology', 'Economics', 'English'],
      careerPaths: ['UPSC / NPSC Civil Services (Core General Studies synergy)', 'Archaeological Survey of India (ASI) & Heritage Trusts', 'Archival Management, Museums & Cultural Tourism', 'Academic Teaching & Historical Research']
    },
    {
      id: 'political-science',
      name: 'Political Science',
      stream: 'ARTS',
      degree: 'B.A. (Honours & Regular)',
      campus: 'P.R. Hill Campus, Kohima',
      campusShort: 'P.R. Hill, Kohima',
      icon: Scale,
      desc: 'Political Theory, Indian Constitutional Framework & Governance, International Relations, Comparative Politics, Public Administration, and Human Rights.',
      eligibility: '10+2 / HSSLC passed in any stream from a recognized board.',
      keyAreas: ['Political Theory & Thought', 'Indian Constitutional Governance', 'International Relations & Global Geopolitics', 'Public Administration & Human Rights'],
      coreModules: [
        'Western & Indian Political Thought',
        'Indian Political System, Constitution & Institutional Governance',
        'International Relations, Global Organizations & Geopolitics',
        'Comparative Politics & Political Sociology',
        'Public Administration, Policy Analysis & Human Rights'
      ],
      minors: ['History', 'Sociology', 'Economics', 'English'],
      careerPaths: ['UPSC & NPSC Civil Services (High scoring optional)', 'Public Policy Think-tanks, Legislative Research & NGOs', 'Legal Studies (LL.B.) & International Bodies', 'College Faculty, Political Journalism & Diplomacy']
    },
    {
      id: 'sociology',
      name: 'Sociology',
      stream: 'ARTS',
      degree: 'B.A. (Honours & Regular)',
      campus: 'P.R. Hill Campus, Kohima',
      campusShort: 'P.R. Hill, Kohima',
      icon: Users,
      desc: 'Classical & Contemporary Sociological Thought, Tribal Society of Northeast India, Social Stratification, Research Methodology, Gender Studies, and Social Change.',
      eligibility: '10+2 / HSSLC passed in any stream from a recognized board.',
      keyAreas: ['Sociological Theory', 'Tribal Society of Northeast India', 'Social Stratification & Gender', 'Social Research Methodologies'],
      coreModules: [
        'Principles of Sociology & Sociological Thinkers (Marx, Weber, Durkheim)',
        'Indian Society: Structure, Diversity & Social Processes',
        'Society and Culture in Northeast India & Tribal Studies',
        'Social Research Methods, Fieldwork & Qualitative Techniques',
        'Gender Studies, Social Stratification & Social Movements'
      ],
      minors: ['Political Science', 'Education', 'History', 'Economics'],
      careerPaths: ['Social Welfare Administration & CDPO', 'Non-Governmental Organizations (NGOs) & UN Agencies', 'Corporate Social Responsibility (CSR) & HR Consulting', 'Academic Research, Demographic Studies & Faculty']
    },
    {
      id: 'tenyidie',
      name: 'Tenyidie',
      stream: 'ARTS',
      degree: 'B.A. (Honours & Regular)',
      campus: 'P.R. Hill Campus, Kohima',
      campusShort: 'P.R. Hill, Kohima',
      icon: Feather,
      desc: 'Indigenous Linguistic Traditions, Tenyidie Classical & Modern Literature, Grammar, Poetry, Folkloristics, Cultural Heritage, and Regional Literary Translation.',
      eligibility: '10+2 / HSSLC passed in any stream from a recognized board.',
      keyAreas: ['Indigenous Linguistics', 'Tenyidie Classical Literature', 'Grammar, Syntax & Phonology', 'Naga Poetics, Folklore & Translation'],
      coreModules: [
        'Tenyidie Poetry & Classical Literary Traditions',
        'Grammar, Syntax, Lexicography & Phonology of Tenyidie',
        'Naga Folklore, Oral Narratives & Cultural Heritage',
        'Modern Tenyidie Prose, Drama & Fiction',
        'Translation Studies & Regional Literary Hermeneutics'
      ],
      minors: ['English', 'History', 'Education', 'Sociology'],
      careerPaths: ['State Educational Institutions & High School Language Faculty', 'State Language Translation Bureaus & Cultural Affairs', 'Regional Media, Radio Broadcasters & Publishing', 'Anthropological & Linguistic Research Archives']
    },

    // 5 Science Disciplines (Thegaba, Phezhu Campus, Jotsoma)
    {
      id: 'botany',
      name: 'Botany',
      stream: 'SCIENCE',
      degree: 'B.Sc. (Honours & Regular)',
      campus: 'Thegaba, Phezhu Campus, Jotsoma',
      campusShort: 'Thegaba, Phezhu',
      icon: Leaf,
      desc: 'Plant Diversity, Cryptogams, Phanerogams, Plant Anatomy, Physiology, Genetics, Microbiology, Ecology, Economic Botany, and Extensive Laboratory Work.',
      eligibility: '10+2 / HSSLC Science with Biology/Botany from a recognized board.',
      keyAreas: ['Cryptogams & Phanerogams', 'Plant Physiology & Biochemistry', 'Plant Ecology & Morphology', 'Microbiology & Botanical Labs'],
      coreModules: [
        'Diversity of Cryptogams (Algae, Fungi, Bryophytes, Pteridophytes)',
        'Gymnosperms, Angiosperm Taxonomy & Plant Anatomy',
        'Plant Physiology, Metabolism & Biochemistry',
        'Cell Biology, Genetics & Plant Biotechnology',
        'Ecology, Environmental Biology & Field Taxonomy Practicals'
      ],
      minors: ['Chemistry', 'Zoology'],
      careerPaths: ['Botanical Survey of India (BSI) & Indian Forest Service (IFS)', 'Pharmaceutical, Floriculture & Agricultural Research', 'Biotechnology Labs & Environmental Impact Consulting', 'M.Sc. Botany, CSIR-NET & Doctoral Research']
    },
    {
      id: 'chemistry',
      name: 'Chemistry',
      stream: 'SCIENCE',
      degree: 'B.Sc. (Honours & Regular)',
      campus: 'Thegaba, Phezhu Campus, Jotsoma',
      campusShort: 'Thegaba, Phezhu',
      icon: FlaskConical,
      desc: 'Inorganic, Organic, and Physical Chemistry, Chemical Thermodynamics, Coordination Chemistry, Spectroscopy, Analytical Techniques, and Wet Lab Experimentation.',
      eligibility: '10+2 / HSSLC Science with Chemistry from a recognized board.',
      keyAreas: ['Inorganic & Coordination Chemistry', 'Organic Reaction Mechanisms', 'Physical Chemistry & Kinetics', 'Analytical & Spectroscopic Wet Labs'],
      coreModules: [
        'Atomic Structure, Chemical Bonding & Coordination Compounds',
        'Organic Reaction Mechanisms, Stereochemistry & Functional Groups',
        'Chemical Thermodynamics, Electrochemistry & Kinetics',
        'Spectroscopic Techniques (UV-Vis, IR, NMR) & Analytical Methods',
        'Qualitative & Quantitative Wet Chemical Laboratory Analysis'
      ],
      minors: ['Physics', 'Mathematics', 'Botany', 'Zoology'],
      careerPaths: ['Chemical, Petrochemical & Polymer Industries', 'Pharmaceutical Quality Assurance, Testing & R&D Labs', 'Forensic Science Laboratories & Geological Survey of India', 'CSIR-NET, GATE, IIT JAM, M.Sc. & Chemical Research']
    },
    {
      id: 'mathematics',
      name: 'Mathematics',
      stream: 'SCIENCE',
      degree: 'B.Sc. (Honours & Regular)',
      campus: 'Thegaba, Phezhu Campus, Jotsoma',
      campusShort: 'Thegaba, Phezhu',
      icon: Compass,
      desc: 'Differential Calculus, Integral Calculus, Real Analysis, Abstract Algebra, Differential Equations, Linear Algebra, Numerical Analysis, and Mathematical Modeling.',
      eligibility: '10+2 / HSSLC Science with Mathematics from a recognized board.',
      keyAreas: ['Differential & Integral Calculus', 'Real & Complex Analysis', 'Abstract & Linear Algebra', 'Differential Equations & Numerical Modeling'],
      coreModules: [
        'Differential & Integral Calculus with Applications',
        'Real Analysis, Sequences, Series & Metric Spaces',
        'Abstract Algebra: Groups, Rings & Linear Vector Spaces',
        'Ordinary & Partial Differential Equations',
        'Numerical Analysis, Probability & Mathematical Modeling'
      ],
      minors: ['Physics', 'Chemistry', 'Economics'],
      careerPaths: ['Data Science, Quantitative Analytics & AI/ML Modeling', 'Actuarial Sciences, Banking, Risk Analysis & Investment', 'Defense Research (DRDO), Cryptography & Information Security', 'CSIR-NET, IIT JAM, M.Sc. Mathematics & University Faculty']
    },
    {
      id: 'physics',
      name: 'Physics',
      stream: 'SCIENCE',
      degree: 'B.Sc. (Honours & Regular)',
      campus: 'Thegaba, Phezhu Campus, Jotsoma',
      campusShort: 'Thegaba, Phezhu',
      icon: Atom,
      desc: 'Classical Mechanics, Electrodynamics, Quantum Mechanics, Waves & Optics, Thermodynamics, Solid State Physics, Digital Electronics, and Practical Experiments.',
      eligibility: '10+2 / HSSLC Science with Physics & Mathematics from a recognized board.',
      keyAreas: ['Classical Mechanics & Waves', 'Electrodynamics & Optics', 'Quantum Mechanics & Solid State', 'Digital Electronics & Experimental Labs'],
      coreModules: [
        'Classical Mechanics, Relativity & Oscillations',
        'Electricity, Magnetism & Electromagnetic Theory',
        'Waves, Geometric & Physical Optics',
        'Quantum Mechanics, Atomic & Solid State Physics',
        'Analog & Digital Electronics, Precision Practical Instrumentation'
      ],
      minors: ['Mathematics', 'Chemistry'],
      careerPaths: ['Defense Research (DRDO), ISRO & Atomic Research (BARC)', 'Telecommunications, Semiconductor & Electronics Engineering', 'Meteorological Department & Renewable Energy Research', 'CSIR-NET, GATE, IIT JAM, M.Sc. Physics & Ph.D. Academia']
    },
    {
      id: 'zoology',
      name: 'Zoology',
      stream: 'SCIENCE',
      degree: 'B.Sc. (Honours & Regular)',
      campus: 'Thegaba, Phezhu Campus, Jotsoma',
      campusShort: 'Thegaba, Phezhu',
      icon: Dna,
      desc: 'Non-Chordata & Chordata Biodiversity, Animal Physiology, Cell Biology, Genetics, Developmental Biology, Evolutionary Biology, Wildlife Ecology, and Anatomy Labs.',
      eligibility: '10+2 / HSSLC Science with Biology/Zoology from a recognized board.',
      keyAreas: ['Biodiversity of Non-Chordata & Chordata', 'Animal Physiology & Cell Biology', 'Genetics, Evolution & Wildlife Ecology', 'Developmental Biology & Anatomy Labs'],
      coreModules: [
        'Non-Chordate & Chordate Structural Organization & Taxonomy',
        'Comparative Animal Physiology & Biochemistry',
        'Cell Biology, Molecular Genetics & Evolutionary Biology',
        'Developmental Biology, Embryology & Histology',
        'Wildlife Ecology, Conservation Biology & Dissection Laboratory'
      ],
      minors: ['Botany', 'Chemistry'],
      careerPaths: ['Zoological Survey of India (ZSI) & Wildlife Institute of India', 'Indian Forest Service (IFS) & State Wildlife Protection Wings', 'Sericulture, Fisheries, Apiculture & Biomedical Laboratories', 'CSIR-NET, M.Sc. Zoology, Bioinformatics & Doctoral Research']
    }
  ];

  const exitOptions = [
    {
      year: 'Year 1',
      semesters: 'Semesters 1 & 2',
      credits: '44 Credits',
      title: 'Undergraduate Certificate in Arts / Science',
      desc: 'Awarded after completion of 44 credits, including a 4-credit summer internship or vocational skill course. Suitable for foundational workforce entry or lateral re-entry within statutory guidelines.',
      badge: 'Level 4.5'
    },
    {
      year: 'Year 2',
      semesters: 'Semesters 3 & 4',
      credits: '88 Credits',
      title: 'Undergraduate Diploma in Arts / Science',
      desc: 'Awarded after completion of 88 credits, incorporating an industry-oriented vocational internship or laboratory skill practicum.',
      badge: 'Level 5.0'
    },
    {
      year: 'Year 3',
      semesters: 'Semesters 5 & 6',
      credits: '132 Credits',
      title: 'Bachelor Degree (B.A. / B.Sc.)',
      desc: 'Traditional 3-Year Bachelor Degree awarded upon completing 132 credits with approved Major and Minor concentration requirements.',
      badge: 'Level 5.5'
    },
    {
      year: 'Year 4',
      semesters: 'Semesters 7 & 8',
      credits: '176 Credits',
      title: 'Bachelor Degree with Honours / Research (B.A. Hons. / B.Sc. Hons.)',
      desc: 'Advanced 4-Year Honours degree featuring faculty-mentored research dissertation and academic seminar defense, qualifying candidates for direct Ph.D. admission under UGC guidelines.',
      badge: 'Level 6.0'
    }
  ];

  const fyugpComponents = [
    { code: 'DSC / Major', name: 'Discipline Specific Core (Major)', desc: 'Primary academic specialization providing in-depth theoretical foundation and rigorous research mastery.' },
    { code: 'Minor', name: 'Minor Complementary Discipline', desc: 'Secondary subject studied alongside the major to foster interdisciplinary breadth and analytical balance.' },
    { code: 'MDC', name: 'Multidisciplinary Courses', desc: 'Broad-based exposure spanning Natural Sciences, Social Sciences, Humanities, and Commerce.' },
    { code: 'AEC', name: 'Ability Enhancement Courses', desc: 'Modern Indian Language (MIL / Tenyidie), English communication, and academic writing competencies.' },
    { code: 'SEC', name: 'Skill Enhancement Courses', desc: 'Hands-on vocational capabilities, digital literacy, and applied employability tools.' },
    { code: 'VAC', name: 'Value Added Courses', desc: 'Environmental Studies, Understanding India, Digital Technologies, Ethics, and Health & Wellness.' }
  ];

  // Filtering
  const filteredDisciplines = allDisciplines.filter(item => {
    const matchesStream = streamFilter === 'ALL' || item.stream === streamFilter;
    if (!matchesStream) return false;
    if (!search.trim()) return true;
    const q = search.trim().toLowerCase();
    return (
      item.name.toLowerCase().includes(q) ||
      item.desc.toLowerCase().includes(q) ||
      item.campus.toLowerCase().includes(q) ||
      item.keyAreas.some(k => k.toLowerCase().includes(q)) ||
      item.careerPaths.some(c => c.toLowerCase().includes(q))
    );
  });

  const artsCount = allDisciplines.filter(d => d.stream === 'ARTS').length;
  const scienceCount = allDisciplines.filter(d => d.stream === 'SCIENCE').length;

  return (
    <div className="space-y-8 text-slate-800 text-sm md:text-base leading-relaxed font-sans">

      {/* Refined Institutional Header */}
      <div className="bg-gradient-to-br from-emerald-50/70 via-white to-slate-50 border border-emerald-200/90 rounded-2xl p-6 sm:p-8 shadow-xs relative overflow-hidden">
        <div className="flex flex-wrap items-center gap-2.5 mb-3.5">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#4a6b28] text-white shadow-xs">
            <Sparkles size={14} />
            <span>FYUGP • NEP 2020 Framework</span>
          </span>
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wider bg-white text-[#002147] border border-slate-300/80 shadow-2xs">
            <span>Permanently Affiliated to Nagaland University</span>
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-slate-600 bg-slate-100">
            <span>UGC 2(f) &amp; 12(B) Recognized</span>
          </span>
        </div>

        <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#002147] tracking-tight">
          Undergraduate Programmes &amp; Academic Curricula
        </h2>
        <p className="text-sm sm:text-base md:text-lg text-slate-600 mt-3 max-w-5xl leading-relaxed">
          Capital College of Higher Education offers Four-Year Undergraduate Programmes (FYUGP) structured under the National Education Policy (NEP 2020) and Nagaland University guidelines. Students pursue single or double major pathways across dedicated campuses in Arts (P.R. Hill) and Science (Thegaba, Phezhu, Jotsoma) with flexible exit credentials and industry-recognized skill certifications.
        </p>

        {/* 4-Item Metric Ribbon */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 mt-6 border-t border-slate-200/90">
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-xs transition-shadow">
            <p className="text-2xl sm:text-3xl font-black text-[#002147]">2 Campuses</p>
            <p className="text-xs sm:text-sm font-bold text-[#4a6b28] uppercase tracking-wider mt-1">Arts &amp; Science</p>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-normal">P.R. Hill &amp; Thegaba, Phezhu</p>
          </div>
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-xs transition-shadow">
            <p className="text-2xl sm:text-3xl font-black text-[#002147]">12 Disciplines</p>
            <p className="text-xs sm:text-sm font-bold text-[#4a6b28] uppercase tracking-wider mt-1">Major &amp; Minor</p>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-normal">7 B.A. Arts + 5 B.Sc. Science</p>
          </div>
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-xs transition-shadow">
            <p className="text-2xl sm:text-3xl font-black text-[#002147]">4 Pathways</p>
            <p className="text-xs sm:text-sm font-bold text-[#4a6b28] uppercase tracking-wider mt-1">Flexible Exits</p>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-normal">Cert • Dip • Degree • Hons/Res</p>
          </div>
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-xs transition-shadow">
            <p className="text-2xl sm:text-3xl font-black text-[#002147]">10 : 1 Ratio</p>
            <p className="text-xs sm:text-sm font-bold text-[#4a6b28] uppercase tracking-wider mt-1">Faculty Guidance</p>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-normal">Individual Student Mentorship</p>
          </div>
        </div>
      </div>

      {/* Main Tab Navigation Bar */}
      <div className="bg-slate-100/90 p-2 sm:p-2.5 rounded-2xl border border-slate-200/90 shadow-2xs">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {[
            { id: 'disciplines', label: `Academic Disciplines (${allDisciplines.length})`, icon: BookOpen },
            { id: 'fyugp', label: 'FYUGP 4-Year Framework', icon: Layers },
            { id: 'skill', label: 'Skill Certification (NSDC)', icon: Award },
            { id: 'evaluation', label: 'Marking & Evaluation', icon: FileText },
            { id: 'eligibility', label: 'Eligibility & Combinations', icon: CheckCircle2 }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2.5 px-4 sm:px-5 py-3 rounded-xl text-xs sm:text-sm md:text-base font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#002147] text-white shadow-md'
                    : 'text-slate-700 hover:bg-white hover:text-[#002147] shadow-2xs'
                }`}
              >
                <Icon size={17} className={isActive ? 'text-[#8fc35e]' : 'text-slate-400'} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab 1: Academic Disciplines & Courses */}
      {activeTab === 'disciplines' && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* Sub-Filters: Stream Switcher & Live Search */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-xs">
            {/* Stream Pills */}
            <div className="flex flex-wrap items-center gap-2">
              {[
                { id: 'ALL', label: `All Disciplines (${allDisciplines.length})` },
                { id: 'ARTS', label: `Arts Stream — B.A. (${artsCount})` },
                { id: 'SCIENCE', label: `Science Stream — B.Sc. (${scienceCount})` }
              ].map(st => (
                <button
                  key={st.id}
                  onClick={() => setStreamFilter(st.id)}
                  className={`px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                    streamFilter === st.id
                      ? st.id === 'ARTS'
                        ? 'bg-[#4a6b28] text-white shadow-sm'
                        : st.id === 'SCIENCE'
                        ? 'bg-[#002147] text-white shadow-sm'
                        : 'bg-slate-900 text-white shadow-sm'
                      : 'bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>

            {/* Live Search Box */}
            <div className="relative min-w-[260px] sm:min-w-[320px]">
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search discipline, syllabus, topic..."
                className="w-full pl-10 pr-9 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 bg-slate-50/60 hover:bg-white focus:bg-white focus:outline-none focus:border-[#4a6b28] focus:ring-2 focus:ring-[#4a6b28]/20 transition-all"
              />
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-sm cursor-pointer"
                  title="Clear search"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Stream Information Callout Ribbons */}
          {(streamFilter === 'ALL' || streamFilter === 'ARTS') && !search && (
            <div className="bg-gradient-to-r from-emerald-50/90 via-emerald-50/40 to-white border border-emerald-200/90 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#4a6b28] text-white flex items-center justify-center font-bold shrink-0 shadow-xs">
                  <BookOpen size={22} />
                </div>
                <div>
                  <h4 className="font-bold text-[#002147] text-base sm:text-lg">Arts Stream Campus: P.R. Hill, Kohima</h4>
                  <p className="text-xs sm:text-sm text-slate-600 mt-0.5 leading-relaxed">
                    Permanently affiliated to Nagaland University. Offers 4-Year B.A. Honours degrees with Major and Minor concentrations across 7 academic disciplines.
                  </p>
                </div>
              </div>
              <span className="text-xs sm:text-sm font-bold text-[#4a6b28] bg-white border border-emerald-200 px-4 py-1.5 rounded-full shadow-2xs whitespace-nowrap">
                7 Major Disciplines
              </span>
            </div>
          )}
          {/* Disciplines Card Grid */}
          {filteredDisciplines.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 shadow-xs">
              <BookOpen size={44} className="mx-auto text-slate-400 mb-3" />
              <h4 className="text-lg font-bold text-slate-800">No matching disciplines found</h4>
              <p className="text-sm text-slate-500 mt-1">Try adjusting your search terms or clearing the filter.</p>
              <button
                onClick={() => { setSearch(''); setStreamFilter('ALL'); }}
                className="mt-5 px-5 py-2.5 bg-[#002147] text-white rounded-xl text-sm font-bold cursor-pointer hover:bg-[#001736] transition-all shadow-xs"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-7">
              {filteredDisciplines.map((item, idx) => {
                const Icon = item.icon;
                const isArts = item.stream === 'ARTS';
                return (
                  <div
                    key={item.id}
                    style={{ animationDelay: `${idx * 40}ms` }}
                    className="card-interactive animate-card-in bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-lg flex flex-col justify-between group cursor-default overflow-hidden hover:-translate-y-1 transition-all duration-300"
                  >
                    {/* Top colored accent stripe */}
                    <div className={`h-1.5 w-full ${isArts ? 'bg-[#4a6b28]' : 'bg-[#002147]'}`} />

                    <div className="p-6 sm:p-7">
                      {/* Top Header Strip */}
                      <div className="flex items-center justify-between mb-3.5">
                        <span className={`text-xs font-black uppercase px-3 py-1 rounded-full tracking-wider border ${
                          isArts
                            ? 'bg-emerald-50 text-[#4a6b28] border-emerald-200'
                            : 'bg-blue-50 text-[#002147] border-blue-200'
                        }`}>
                          {item.degree}
                        </span>
                        <span className="text-xs sm:text-sm text-slate-500 flex items-center gap-1.5 font-medium">
                          <MapPin size={14} className={isArts ? 'text-[#4a6b28]' : 'text-[#002147]'} />
                          <span>{item.campusShort}</span>
                        </span>
                      </div>

                      {/* Title & Department Icon */}
                      <div className="flex items-start gap-3.5 mb-3">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-2xs ${
                          isArts ? 'bg-emerald-50 text-[#4a6b28] border border-emerald-200/70' : 'bg-blue-50 text-[#002147] border border-blue-200/70'
                        }`}>
                          <Icon size={22} />
                        </div>
                        <div>
                          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">
                            Department of
                          </span>
                          <h3 className={`text-xl sm:text-2xl font-black transition-colors tracking-tight ${
                            isArts ? 'text-[#002147] group-hover:text-[#4a6b28]' : 'text-[#002147] group-hover:text-blue-900'
                          }`}>
                            {item.name}
                          </h3>
                        </div>
                      </div>

                      {/* Scope Description */}
                      <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-4">
                        {item.desc}
                      </p>

                      {/* Key Curricular Focus Tags */}
                      <div className="space-y-2 pt-3 border-t border-slate-100">
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                          Curricular Focus:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {item.keyAreas.slice(0, 3).map((tag, tIdx) => (
                            <span
                              key={tIdx}
                              className="text-xs sm:text-sm font-semibold bg-slate-100/90 text-slate-700 px-3 py-1 rounded-lg border border-slate-200/60"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Card Action Footer */}
                    <div className="px-6 sm:px-7 py-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between gap-3">
                      <button
                        onClick={() => setSelectedDiscipline(item)}
                        className="text-xs sm:text-sm font-bold text-[#002147] hover:text-[#4a6b28] inline-flex items-center gap-1.5 transition-colors cursor-pointer py-1"
                      >
                        <Info size={15} />
                        <span>Curriculum &amp; Scope</span>
                      </button>

                      <button
                        onClick={() => {
                          if (onOpenAdmission) {
                            onOpenAdmission(item.stream, item.name);
                          } else if (onNavigate) {
                            onNavigate('criteria');
                          }
                        }}
                        className={`text-xs sm:text-sm font-bold px-4 py-2 rounded-xl text-white transition-all shadow-2xs inline-flex items-center gap-1.5 cursor-pointer ${
                          isArts
                            ? 'bg-[#4a6b28] hover:bg-[#3d5920]'
                            : 'bg-[#002147] hover:bg-[#001736]'
                        }`}
                      >
                        <span>Select Major</span>
                        <ChevronRight size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Science Stream Campus Banner (Bottom Callout) */}
          {(streamFilter === 'ALL' || streamFilter === 'SCIENCE') && !search && (
            <div className="bg-gradient-to-r from-blue-50/90 via-blue-50/40 to-white border border-blue-200/90 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs mt-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#002147] text-white flex items-center justify-center font-bold shrink-0 shadow-xs">
                  <Atom size={22} />
                </div>
                <div>
                  <h4 className="font-bold text-[#002147] text-base sm:text-lg">Science Stream Campus: Thegaba, Phezhu, Jotsoma</h4>
                  <p className="text-xs sm:text-sm text-slate-600 mt-0.5 leading-relaxed">
                    Modern research &amp; undergraduate science campus equipped with standard laboratories across Botany, Chemistry, Mathematics, Physics, and Zoology.
                  </p>
                </div>
              </div>
              <span className="text-xs sm:text-sm font-bold text-[#002147] bg-white border border-blue-200 px-4 py-1.5 rounded-full shadow-2xs whitespace-nowrap">
                5 Science Disciplines
              </span>
            </div>
          )}

        </div>
      )}

      {/* Tab 2: FYUGP 4-Year Degree Framework */}
      {activeTab === 'fyugp' && (
        <div className="space-y-7 animate-fadeIn">
          
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-[#002147] mb-2">
              FYUGP Progressive Exit &amp; Certification Pathways (NEP 2020)
            </h3>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Under the National Education Policy and Nagaland University FYUGP regulations, undergraduate students have the flexibility to exit at multiple levels with recognized certifications, or proceed to 4-Year Honours with Research:
            </p>
          </div>

          {/* Visual 4-Stage Pathway Timeline */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {exitOptions.map((opt, i) => (
              <div
                key={i}
                style={{ animationDelay: `${i * 60}ms` }}
                className="card-interactive animate-card-in p-6 sm:p-7 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md group cursor-default flex flex-col justify-between transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-3.5">
                    <span className="px-3.5 py-1.5 bg-[#4a6b28] text-white text-xs sm:text-sm font-bold rounded-xl uppercase tracking-wider shadow-2xs">
                      {opt.year} • {opt.semesters}
                    </span>
                    <span className="text-xs sm:text-sm font-extrabold text-[#002147] bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-xl">
                      {opt.credits} ({opt.badge})
                    </span>
                  </div>

                  <h4 className="text-lg sm:text-xl font-bold text-[#002147] group-hover:text-[#4a6b28] transition-colors mt-2 mb-2 leading-snug">
                    {opt.title}
                  </h4>

                  <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                    {opt.desc}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs sm:text-sm text-slate-500 font-medium">
                  <span>Nagaland University FYUGP</span>
                  <span className="text-[#4a6b28] font-semibold">UGC Approved</span>
                </div>
              </div>
            ))}
          </div>

          {/* Curricular Course Components Breakdown */}
          <div className="bg-slate-50/80 p-6 sm:p-7 rounded-2xl border border-slate-200/90">
            <h4 className="font-bold text-[#002147] text-base sm:text-lg mb-4 flex items-center gap-2.5">
              <Layers size={18} className="text-[#4a6b28]" />
              <span>FYUGP Curricular Course Typology &amp; Components</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {fyugpComponents.map((c, i) => (
                <div
                  key={i}
                  style={{ animationDelay: `${i * 40}ms` }}
                  className="card-interactive animate-card-in bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs hover:shadow-xs group cursor-default transition-all"
                >
                  <span className="text-xs font-black text-[#4a6b28] bg-emerald-50 px-2.5 py-1 rounded-md uppercase border border-emerald-200">
                    {c.code}
                  </span>
                  <p className="text-sm sm:text-base font-bold text-[#002147] group-hover:text-[#4a6b28] transition-colors mt-2.5 mb-1.5">{c.name}</p>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{c.desc}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* Tab 3: Skill Development (NSDC) */}
      {activeTab === 'skill' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-gradient-to-br from-emerald-50/80 via-white to-blue-50/60 p-6 sm:p-8 rounded-2xl border border-emerald-200/90 shadow-xs">
            <div className="flex items-center gap-2.5 text-[#4a6b28] text-xs sm:text-sm font-bold uppercase tracking-wider mb-2.5">
              <Award size={18} />
              <span>Vocational Training &amp; Career Placement Partner</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#002147] mb-3">
              Skill Development Course in Tourism and Marketing
            </h3>
            <p className="text-sm sm:text-base md:text-lg text-slate-700 leading-relaxed mb-6">
              In formal institutional collaboration with the <strong>Indianeers Skills Academy</strong> (an authorized training partner of the <strong>National Skill Development Corporation — NSDC</strong>), Capital College of Higher Education conducts regular job-oriented skill development certifications.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-5 sm:p-6 bg-white rounded-2xl border border-slate-200/90 shadow-2xs">
                <p className="text-xs sm:text-sm font-bold text-[#002147]">Course Duration</p>
                <p className="text-base sm:text-lg font-extrabold text-[#4a6b28] mt-1">3 Months</p>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">Intensive practical, interactive &amp; field training sessions</p>
              </div>
              <div className="p-5 sm:p-6 bg-white rounded-2xl border border-slate-200/90 shadow-2xs">
                <p className="text-xs sm:text-sm font-bold text-[#002147]">Target Group</p>
                <p className="text-base sm:text-lg font-extrabold text-[#002147] mt-1">5th Semester Students</p>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">And educated unemployed youth seeking career skills</p>
              </div>
              <div className="p-5 sm:p-6 bg-white rounded-2xl border border-slate-200/90 shadow-2xs">
                <p className="text-xs sm:text-sm font-bold text-[#002147]">Placement Support</p>
                <p className="text-base sm:text-lg font-extrabold text-[#4a6b28] mt-1">Direct Placement Linkages</p>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">Tourism, travel management, and regional marketing enterprises</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Assessment & Evaluation Criteria */}
      {activeTab === 'evaluation' && (
        <div className="space-y-6 animate-fadeIn">
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-[#002147] mb-2">
              Assessment Criteria &amp; Mark Distribution Scheme
            </h3>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Official assessment scheme for all undergraduate papers as published in the CCHE Prospectus 2024-25 under Nagaland University guidelines:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 4-Credit Papers */}
            <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200/90 shadow-xs">
              <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
                <h4 className="text-base sm:text-lg font-bold text-[#002147]">
                  A) 4-Credit Papers (Total: 100 Marks)
                </h4>
                <span className="text-xs sm:text-sm font-extrabold text-[#4a6b28] bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200">
                  4 Credits
                </span>
              </div>
              <div className="space-y-2.5 text-xs sm:text-sm">
                <div className="flex justify-between p-3 bg-slate-50 rounded-xl">
                  <span className="font-semibold text-slate-800">End-Term University Examination</span>
                  <span className="font-bold text-[#002147]">75 Marks (Pass: 30)</span>
                </div>
                <div className="flex justify-between p-3 bg-emerald-50/60 rounded-xl">
                  <span className="font-semibold text-slate-800">Internal Assessment Total</span>
                  <span className="font-bold text-[#4a6b28]">25 Marks (Pass: 10)</span>
                </div>
                <div className="pl-4 border-l-2 border-emerald-400 space-y-2 text-xs sm:text-sm text-slate-700 pt-1.5">
                  <div className="flex justify-between"><span>• Class Test</span><span className="font-semibold">10 Marks</span></div>
                  <div className="flex justify-between"><span>• Assignment Submission</span><span className="font-semibold">5 Marks</span></div>
                  <div className="flex justify-between"><span>• Seminar Presentation</span><span className="font-semibold">5 Marks</span></div>
                  <div className="flex justify-between"><span>• Class Attendance</span><span className="font-semibold">5 Marks</span></div>
                </div>
              </div>
            </div>

            {/* 3 & 2-Credit Papers */}
            <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200/90 shadow-xs">
              <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
                <h4 className="text-base sm:text-lg font-bold text-[#002147]">
                  B) 3 &amp; 2-Credit Papers (Total: 50 Marks)
                </h4>
                <span className="text-xs sm:text-sm font-extrabold text-[#002147] bg-blue-50 px-3 py-1 rounded-lg border border-blue-200">
                  2 / 3 Credits
                </span>
              </div>
              <div className="space-y-2.5 text-xs sm:text-sm">
                <div className="flex justify-between p-3 bg-slate-50 rounded-xl">
                  <span className="font-semibold text-slate-800">End-Term University Examination</span>
                  <span className="font-bold text-[#002147]">37.5 Marks (Pass: 15)</span>
                </div>
                <div className="flex justify-between p-3 bg-blue-50/60 rounded-xl">
                  <span className="font-semibold text-slate-800">Internal Assessment Total</span>
                  <span className="font-bold text-[#4a6b28]">12.5 Marks (Pass: 5)</span>
                </div>
                <div className="pl-4 border-l-2 border-blue-400 space-y-2 text-xs sm:text-sm text-slate-700 pt-1.5">
                  <div className="flex justify-between"><span>• Class Test</span><span className="font-semibold">5 Marks</span></div>
                  <div className="flex justify-between"><span>• Assignment Submission</span><span className="font-semibold">2.5 Marks</span></div>
                  <div className="flex justify-between"><span>• Seminar Presentation</span><span className="font-semibold">2.5 Marks</span></div>
                  <div className="flex justify-between"><span>• Class Attendance</span><span className="font-semibold">2.5 Marks</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Eligibility & Subject Combinations */}
      {activeTab === 'eligibility' && (
        <div className="space-y-6 animate-fadeIn">
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-[#002147] mb-2">
              Admission Eligibility &amp; Permissible Subject Combinations
            </h3>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Admission requirements for FYUGP 4-Year Bachelor of Arts and Bachelor of Science programmes:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Arts Stream Eligibility */}
            <div className="p-6 sm:p-7 bg-white rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
              <div className="flex items-center gap-2.5 text-[#4a6b28]">
                <BookOpen size={20} />
                <h4 className="font-bold text-base sm:text-lg text-[#002147]">
                  Arts Stream Eligibility (B.A.)
                </h4>
              </div>
              <ul className="space-y-3 text-xs sm:text-sm text-slate-700 leading-relaxed">
                <li className="flex items-start gap-2.5">
                  <Check size={16} className="text-[#4a6b28] shrink-0 mt-0.5" />
                  <span>Passed 10+2 / HSSLC or equivalent examination from NBSE, CBSE, or any recognized State/Central Board in Arts, Science, or Commerce stream.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check size={16} className="text-[#4a6b28] shrink-0 mt-0.5" />
                  <span>For Honours / Major in English: Minimum 45% in English in HSSLC is preferred.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check size={16} className="text-[#4a6b28] shrink-0 mt-0.5" />
                  <span>Personal interview of the candidate along with parents/guardians before the Admission Committee.</span>
                </li>
              </ul>
            </div>

            {/* Science Stream Eligibility */}
            <div className="p-6 sm:p-7 bg-white rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
              <div className="flex items-center gap-2.5 text-[#002147]">
                <Atom size={20} />
                <h4 className="font-bold text-base sm:text-lg text-[#002147]">
                  Science Stream Eligibility (B.Sc.)
                </h4>
              </div>
              <ul className="space-y-3 text-xs sm:text-sm text-slate-700 leading-relaxed">
                <li className="flex items-start gap-2.5">
                  <Check size={16} className="text-[#002147] shrink-0 mt-0.5" />
                  <span>Passed 10+2 / HSSLC Science examination from a recognized board with minimum 45% aggregate in science subjects.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check size={16} className="text-[#002147] shrink-0 mt-0.5" />
                  <span>Major in Botany / Zoology requires Biology in 10+2.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check size={16} className="text-[#002147] shrink-0 mt-0.5" />
                  <span>Major in Physics / Mathematics requires Mathematics in 10+2.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check size={16} className="text-[#002147] shrink-0 mt-0.5" />
                  <span>Active practical laboratory records and marks verification during admission interview.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Mandatory Documents Checklist */}
          <div className="p-6 sm:p-7 bg-slate-50/90 rounded-2xl border border-slate-200/90">
            <h4 className="text-xs sm:text-sm font-bold text-[#002147] uppercase tracking-wider mb-3.5 flex items-center gap-2.5">
              <FileText size={18} className="text-[#4a6b28]" />
              <span>Mandatory Documents Required for Admission (Hard Copy Verification)</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs sm:text-sm text-slate-700">
              <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 flex items-center gap-2.5 shadow-2xs">
                <CheckCircle2 size={16} className="text-[#4a6b28] shrink-0" />
                <span>Original &amp; Attested HSSLC Marksheet</span>
              </div>
              <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 flex items-center gap-2.5 shadow-2xs">
                <CheckCircle2 size={16} className="text-[#4a6b28] shrink-0" />
                <span>HSLC (10th) Admit Card / DOB Proof</span>
              </div>
              <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 flex items-center gap-2.5 shadow-2xs">
                <CheckCircle2 size={16} className="text-[#4a6b28] shrink-0" />
                <span>Pass Certificate &amp; Transfer Certificate (TC)</span>
              </div>
              <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 flex items-center gap-2.5 shadow-2xs">
                <CheckCircle2 size={16} className="text-[#4a6b28] shrink-0" />
                <span>Migration Certificate (Non-NBSE Boards)</span>
              </div>
              <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 flex items-center gap-2.5 shadow-2xs">
                <CheckCircle2 size={16} className="text-[#4a6b28] shrink-0" />
                <span>ST / SC / OBC / Indigenous Certificate</span>
              </div>
              <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 flex items-center gap-2.5 shadow-2xs">
                <CheckCircle2 size={16} className="text-[#4a6b28] shrink-0" />
                <span>3 Recent Passport Size Photographs</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Refined Bottom Action & Resource Footer */}
      <div className="pt-8 mt-6 border-t border-slate-200 flex flex-wrap items-center justify-between gap-5">
        <div className="text-xs sm:text-sm text-slate-500">
          <p className="font-bold text-slate-800">Official Course Source: Capital College Prospectus 2024-25</p>
          <p className="mt-0.5">Permanently Affiliated to Nagaland University • UGC 2(f) &amp; 12(B) Recognized</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <a
            href="https://capitalcollege.edu.in/wp-content/uploads/2024/04/CCHE-Prospectus-2024-05.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 hover:border-[#4a6b28] px-5 py-3 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-all shadow-2xs cursor-pointer"
          >
            <Download size={15} className="text-[#4a6b28]" />
            <span>Prospectus 2024-25 (PDF)</span>
          </a>
          <a
            href="/admission_form.pdf"
            download="admission_form.pdf"
            className="inline-flex items-center gap-2 bg-[#4a6b28] hover:bg-[#3d5920] text-white px-5 py-3 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-all shadow-md hover:shadow-lg cursor-pointer"
          >
            <Download size={15} />
            <span>Admission Form (PDF)</span>
          </a>
          {onOpenAdmission && (
            <button
              onClick={() => onOpenAdmission('ARTS')}
              className="inline-flex items-center gap-2 bg-[#002147] hover:bg-[#001736] text-white px-6 py-3 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-all shadow-md hover:shadow-lg cursor-pointer"
            >
              <GraduationCap size={17} className="text-[#8fc35e]" />
              <span>Apply Online</span>
            </button>
          )}
        </div>
      </div>

      {/* Interactive Discipline Detail Modal */}
      {selectedDiscipline && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 sm:p-6 animate-fadeIn">
          <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden border border-slate-200 animate-scaleUp max-h-[90vh] flex flex-col">
            
            {/* Modal Header */}
            <div className={`p-6 sm:p-7 flex items-center justify-between text-white border-b-2 ${
              selectedDiscipline.stream === 'ARTS'
                ? 'bg-gradient-to-r from-[#002147] via-[#001d40] to-[#4a6b28] border-[#4a6b28]'
                : 'bg-gradient-to-r from-[#002147] via-[#001736] to-[#002858] border-[#002147]'
            }`}>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/10 backdrop-blur-xs rounded-2xl border border-white/20 shrink-0">
                  {React.createElement(selectedDiscipline.icon, { size: 26, className: 'text-[#8fc35e]' })}
                </div>
                <div>
                  <span className="text-xs font-black uppercase tracking-widest text-[#b5d697] block mb-0.5">
                    Department Curriculum &amp; Career Scope
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                    Department of {selectedDiscipline.name}
                  </h3>
                </div>
              </div>

              <button
                onClick={() => setSelectedDiscipline(null)}
                className="text-gray-300 hover:text-white p-2 rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
                aria-label="Close Modal"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-sm sm:text-base text-slate-700 leading-relaxed">
              {/* Stream, Degree & Campus Info Bar */}
              <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="text-xs uppercase font-bold text-slate-400 block mb-0.5">Degree Awarded</span>
                  <span className="font-black text-[#002147] text-base">{selectedDiscipline.degree}</span>
                </div>
                <div>
                  <span className="text-xs uppercase font-bold text-slate-400 block mb-0.5">Stream &amp; Campus</span>
                  <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                    <MapPin size={14} className="text-[#4a6b28]" />
                    <span>{selectedDiscipline.campus}</span>
                  </span>
                </div>
                <div>
                  <span className="text-xs uppercase font-bold text-slate-400 block mb-0.5">Duration</span>
                  <span className="font-semibold text-slate-800">4 Years (8 Semesters)</span>
                </div>
              </div>

              {/* Course Overview */}
              <div>
                <h4 className="font-bold text-xs sm:text-sm uppercase tracking-wider text-[#002147] mb-2">
                  Academic Overview &amp; Curriculum Scope
                </h4>
                <p className="text-slate-600 leading-relaxed">
                  {selectedDiscipline.desc}
                </p>
              </div>

              {/* Core Syllabus Modules */}
              <div>
                <h4 className="font-bold text-xs sm:text-sm uppercase tracking-wider text-[#002147] mb-3 flex items-center gap-2">
                  <Layers size={16} className="text-[#4a6b28]" />
                  <span>Key Course Papers &amp; Syllabus Modules</span>
                </h4>
                <div className="space-y-2 bg-slate-50/80 p-4 sm:p-5 rounded-2xl border border-slate-200/90 text-sm text-slate-700">
                  {selectedDiscipline.coreModules.map((mod, mIdx) => (
                    <div key={mIdx} className="flex items-start gap-2.5">
                      <CheckCircle2 size={16} className="text-[#4a6b28] shrink-0 mt-0.5" />
                      <span>{mod}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Permissible Minor Subject Combinations */}
              <div>
                <h4 className="font-bold text-xs sm:text-sm uppercase tracking-wider text-[#002147] mb-2">
                  Permissible Minor Subject Combinations (Nagaland University)
                </h4>
                <p className="text-xs sm:text-sm text-slate-500 mb-3">
                  Under the FYUGP NEP 2020 curriculum, students majoring in {selectedDiscipline.name} can select complementary minor subjects:
                </p>
                <div className="flex flex-wrap gap-2">
                  {selectedDiscipline.minors.map((min, mIdx) => (
                    <span
                      key={mIdx}
                      className="px-3.5 py-1.5 bg-emerald-50 text-[#4a6b28] border border-emerald-200 rounded-xl text-xs sm:text-sm font-bold"
                    >
                      + {min}
                    </span>
                  ))}
                </div>
              </div>

              {/* Career & Competitive Horizons */}
              <div>
                <h4 className="font-bold text-xs sm:text-sm uppercase tracking-wider text-[#002147] mb-3 flex items-center gap-2">
                  <Briefcase size={16} className="text-[#4a6b28]" />
                  <span>Career Horizons &amp; Postgraduate Pathways</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
                  {selectedDiscipline.careerPaths.map((cp, cIdx) => (
                    <div key={cIdx} className="p-3.5 bg-white border border-slate-200/90 rounded-xl flex items-center gap-2.5 shadow-2xs">
                      <Sparkles size={15} className="text-[#4a6b28] shrink-0" />
                      <span className="font-medium text-slate-700">{cp}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Eligibility */}
              <div className="p-4 sm:p-5 bg-amber-50/80 border border-amber-200/90 rounded-2xl text-xs sm:text-sm text-amber-900">
                <span className="font-bold block mb-1">Eligibility Requirement:</span>
                <span>{selectedDiscipline.eligibility}</span>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="p-5 sm:p-6 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4">
              <a
                href="/admission_form.pdf"
                download="admission_form.pdf"
                className="text-xs sm:text-sm font-bold text-slate-700 hover:text-[#4a6b28] inline-flex items-center gap-2 cursor-pointer"
              >
                <Download size={16} />
                <span>Admission Form (PDF)</span>
              </a>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSelectedDiscipline(null)}
                  className="px-5 py-2.5 border border-slate-300 hover:bg-slate-100 rounded-xl text-xs sm:text-sm font-bold text-slate-700 cursor-pointer transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    const subj = selectedDiscipline;
                    setSelectedDiscipline(null);
                    if (onOpenAdmission) {
                      onOpenAdmission(subj.stream, subj.name);
                    } else if (onNavigate) {
                      onNavigate('criteria');
                    }
                  }}
                  className="px-5 py-2.5 bg-[#4a6b28] hover:bg-[#3d5920] text-white rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider shadow-sm hover:shadow-md transition-all cursor-pointer"
                >
                  Apply for {selectedDiscipline.name}
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}


/* =========================================================================
   REFINED INSTITUTIONAL SUBPAGES (100% FACTUAL, OFFICIAL BRAND PALETTE)
   ========================================================================= */

// Helper for extracting clean initials for institutional leadership & faculty
const getMemberInitials = (name) => {
  if (!name) return 'CC';
  const clean = name.replace(/^(Dr\.|Mr\.|Mrs\.|Ms\.|Prof\.|Smt\.)\s+/i, '').trim();
  const parts = clean.split(/\s+/).filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

// 1. COLLEGE PROFILE COMPONENT
function CollegeProfileSection({ onNavigate, onOpenAdmission }) {
  const milestones = [
    { year: '2004', title: 'Institutional Inception', desc: 'Established on 20th August 2004 as National Academy of Higher Education with 5 pioneer students, dedicating its mission to accessible quality education in Kohima.' },
    { year: '2008', title: 'Permanent University Affiliation', desc: 'Granted permanent institutional affiliation to Nagaland University for its Bachelor of Arts degree programs.' },
    { year: '2012', title: 'UGC Statutory Recognition', desc: 'Recognized by the University Grants Commission under Sections 2(f) & 12(B) of the UGC Act of 1956, validating national academic standing.' },
    { year: '2021', title: 'Introduction of Science Stream', desc: 'Expanded academic horizons with the launch of Bachelor of Science (B.Sc. Honours & General) across 5 core disciplines at the permanent Thegaba campus.' },
    { year: '2023', title: 'NEP 2020 FYUGP Implementation', desc: 'Adopted the Four-Year Undergraduate Programme (FYUGP) framework under Nagaland University guidelines, offering holistic multidisciplinary degrees.' }
  ];

  return (
    <div className="space-y-10 font-sans text-gray-800">
      {/* 1. Institutional Hero Banner Ribbon */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#002147] via-[#002d5f] to-[#12281e] p-6 sm:p-8 md:p-10 text-white shadow-xl border border-white/10">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#4a6b28] text-white text-xs font-bold uppercase tracking-wider shadow-xs">
              <ShieldCheck size={13} />
              <span>UGC 2(f) & 12(B) Recognized</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-[#b5d697] text-xs font-semibold backdrop-blur-sm border border-white/15">
              <span>Permanent Nagaland University Affiliation</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-gray-200 text-xs font-semibold backdrop-blur-sm border border-white/15">
              <span>Estd. August 20, 2004</span>
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Capital College of Higher Education
          </h2>

          <p className="text-sm sm:text-base text-gray-200 leading-relaxed font-normal">
            Sponsored by <strong className="text-white font-semibold">National Academy Society</strong> • Kohima, Nagaland 797001
          </p>

          <div className="pt-1 flex flex-wrap items-center gap-3">
            <span className="inline-block px-3.5 py-1 rounded-lg bg-emerald-950/60 border border-[#8fc35e]/30 text-[#b5d697] text-xs font-semibold italic">
              Motto: “Towards Total Development” • “On to Greater Heights”
            </span>
            <span className="text-xs text-gray-300 font-medium">
              Co-Educational Undergraduate Degree College
            </span>
          </div>
        </div>

        <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
          <Landmark size={280} />
        </div>
      </div>

      {/* 2. Key Institutional Metrics Strip (4 Metric Pillars) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: Landmark, value: '2004', label: 'Established', sub: '20+ Years Excellence' },
          { icon: Award, value: '2(f) & 12(B)', label: 'UGC Act 1956', sub: 'Statutory Recognition' },
          { icon: GraduationCap, value: '17+', label: 'Batches Graduated', sub: 'Global Alumni Network' },
          { icon: Users, value: '10 : 1', label: 'Mentorship Ratio', sub: 'Individual Scholar Care' }
        ].map((stat, i) => (
          <div
            key={i}
            className="card-interactive card-accent-top bg-white rounded-2xl border border-gray-200 p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition-all duration-300"
          >
            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-[#4a6b28] border border-emerald-100 flex items-center justify-center mb-3">
              <stat.icon size={22} />
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-[#002147] tracking-tight">{stat.value}</div>
              <div className="text-xs font-bold text-gray-900 mt-1">{stat.label}</div>
              <div className="text-[11px] text-gray-500">{stat.sub}</div>
            </div>
          </div>
        ))}
      </div>

      {/* 3. Core Institutional Narrative & Vision/Mission (2-Column Side-by-Side Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Column: Genesis Narrative (7 cols) */}
        <div className="lg:col-span-7 card-interactive bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-3 border-b border-gray-100 pb-4 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#002147] text-[#8fc35e] flex items-center justify-center font-bold">
                <BookOpen size={20} />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-[#002147]">Institutional Overview & Genesis</h3>
                <p className="text-xs text-gray-500">Capital College of Higher Education, Kohima</p>
              </div>
            </div>

            <p className="text-gray-700 text-sm leading-relaxed text-justify mb-3">
              Capital College of Higher Education (CCHE), established on <strong>August 20, 2004</strong>, is permanently affiliated to <strong>Nagaland University</strong>. The College is sponsored by the <strong>National Academy Society</strong>. The college is recognized by the University Grants Commission (UGC) under Section 2(f) &amp; 12(B) of the Central UGC Act of 1956.
            </p>
            <p className="text-gray-700 text-sm leading-relaxed text-justify mb-3">
              The college offers Bachelor of Arts (Honours) across core disciplines and Bachelor of Arts (General). Expanding its academic horizon from session 2021-22, CCHE introduced Bachelor of Science (B.Sc. Honours &amp; General) across five foundational science disciplines at its permanent Thegaba campus.
            </p>
            <p className="text-gray-700 text-sm leading-relaxed text-justify">
              In the learning process, the college considers it imperative that students excel in their quest for knowledge. To achieve this, CCHE provides an inspiring academic environment by imparting total quality education through experienced, qualified, and committed faculty mentors. Over fifteen cohorts have successfully graduated, distinguishing themselves across public administration, academia, civil service, and entrepreneurship.
            </p>
          </div>

          <div className="pt-3 border-t border-gray-100 flex flex-wrap gap-2">
            {[
              'National Academy Society Sponsored',
              'Permanent NU Affiliation',
              'UGC 2(f) & 12(B)',
              'NEP 2020 FYUGP 4-Year Degrees',
              'Inclusive Co-Educational Ethos'
            ].map((tag, idx) => (
              <span key={idx} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-emerald-50 text-[#4a6b28] text-xs font-semibold border border-emerald-200">
                <CheckCircle2 size={12} />
                <span>{tag}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Right Column: Institutional Vision, Mission & Values (5 cols) */}
        <div className="lg:col-span-5 card-interactive bg-gradient-to-br from-gray-50 via-white to-emerald-50/20 rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-xs flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-[#4a6b28] text-white flex items-center justify-center font-bold">
                <Compass size={18} />
              </div>
              <h3 className="text-lg font-bold text-[#002147]">Institutional Philosophy</h3>
            </div>

            <div className="space-y-4">
              {/* Vision Card */}
              <div className="p-4 rounded-xl bg-white border border-gray-200 shadow-2xs">
                <div className="text-xs font-bold uppercase tracking-wider text-[#4a6b28] mb-1 flex items-center gap-1.5">
                  <Sparkles size={13} />
                  <span>Institutional Vision</span>
                </div>
                <p className="text-xs sm:text-sm text-gray-700 leading-relaxed text-justify">
                  To nurture intellectually empowered, morally grounded, and culturally rooted graduates equipped to navigate higher academic horizons and provide ethical leadership in societal transformation.
                </p>
              </div>

              {/* Mission Card */}
              <div className="p-4 rounded-xl bg-white border border-gray-200 shadow-2xs">
                <div className="text-xs font-bold uppercase tracking-wider text-[#002147] mb-1 flex items-center gap-1.5">
                  <ShieldCheck size={13} className="text-[#4a6b28]" />
                  <span>Educational Mission</span>
                </div>
                <p className="text-xs sm:text-sm text-gray-700 leading-relaxed text-justify">
                  To impart total quality education through committed pedagogical mentoring, modern scientific labs, rich digital library access, and inclusive opportunities for all strata of students.
                </p>
              </div>

              {/* Core Values */}
              <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200/80">
                <div className="text-xs font-bold uppercase tracking-wider text-emerald-900 mb-2">
                  Core Institutional Values
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs text-gray-700 font-semibold">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#4a6b28]" />
                    <span>Academic Rigour</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#4a6b28]" />
                    <span>Ethical Integrity</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#4a6b28]" />
                    <span>Student Welfare</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#4a6b28]" />
                    <span>Community Service</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-2 text-[11px] text-gray-500 italic text-center">
            “On to Greater Heights — Committed to Student Transformation”
          </div>
        </div>
      </div>

      {/* 4. Dual Specialized Campuses (Infrastructure & Facilities) */}
      <div>
        <div className="mb-6">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#4a6b28] uppercase tracking-wider mb-1">
            <Building2 size={14} />
            <span>Infrastructure & Learning Facilities</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-[#002147]">Dual Specialized Campuses</h3>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            Dedicated academic environments situated in Kohima Town (P.R. Hill) and Thegaba, Phezhu (Jotsoma).
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Permanent Campus - Science Stream */}
          <div className="card-interactive card-accent-top bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs flex flex-col group">
            <div className="relative h-60 sm:h-64 overflow-hidden bg-gray-100">
              <img
                src="https://capitalcollege.edu.in/wp-content/uploads/2023/05/Science-Block-1-scaled.jpg"
                alt="Permanent Campus Science Block"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute bottom-3 left-3 right-3 bg-black/60 backdrop-blur-md text-white text-xs p-2.5 rounded-xl border border-white/15 flex items-center gap-1.5 shadow-lg">
                <MapPin size={14} className="text-[#8fc35e] shrink-0" />
                <span className="truncate">Thegaba, Phezhu, Jotsoma (Walking distance from Kohima Town)</span>
              </div>
            </div>

            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <h4 className="font-bold text-lg text-[#002147]">Permanent Campus Science Block</h4>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">B.Sc. Honours</span>
                </div>
                <p className="text-gray-700 text-xs sm:text-sm leading-relaxed text-justify mb-3">
                  The permanent campus is located at Thegaba, Phezhu, Jotsoma which is at a convenient walking distance from Kohima Town. Presently, the permanent campus houses the science programme, featuring modern scientific laboratories, spacious lecture theatres, and dedicated research facilities.
                </p>

                <div className="space-y-2">
                  <div className="text-xs font-bold text-gray-900">Key Scientific Disciplines:</div>
                  <div className="flex flex-wrap gap-1.5">
                    {['Botany', 'Chemistry', 'Mathematics', 'Physics', 'Zoology'].map((sub, i) => (
                      <span key={i} className="text-[11px] font-semibold px-2.5 py-1 bg-blue-50 text-blue-800 rounded-md border border-blue-200">
                        {sub}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                <span>Facilities: Modern Labs • Lecture Halls • Herbarium</span>
                <button
                  onClick={() => onNavigate && onNavigate('science-section')}
                  className="font-bold text-[#4a6b28] hover:underline cursor-pointer flex items-center gap-1"
                >
                  <span>Explore Science Campus</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            </div>
          </div>

          {/* City Campus - Arts Stream */}
          <div className="card-interactive card-accent-top bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs flex flex-col group">
            <div className="relative h-60 sm:h-64 overflow-hidden bg-gray-100">
              <img
                src="https://capitalcollege.edu.in/wp-content/uploads/2023/05/Arts-Block-and-Girls-Hostel-scaled.jpg"
                alt="Arts Block in P.R. Hill, Kohima Town"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute bottom-3 left-3 right-3 bg-black/60 backdrop-blur-md text-white text-xs p-2.5 rounded-xl border border-white/15 flex items-center gap-1.5 shadow-lg">
                <MapPin size={14} className="text-[#8fc35e] shrink-0" />
                <span className="truncate">Below State Library, PHQ Junction, P.R. Hill, Kohima</span>
              </div>
            </div>

            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <h4 className="font-bold text-lg text-[#002147]">Arts Block &amp; Girls Hostel</h4>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-[#4a6b28] border border-emerald-200">B.A. Honours</span>
                </div>
                <p className="text-gray-700 text-xs sm:text-sm leading-relaxed text-justify mb-3">
                  The campus which houses the arts programme is located in the heart of the capital town below the State Library, and within walking distance from PHQ Junction, P.R. Hill. The environment is congenial and conducive for study in terms of immediate access to transportation, medical aid, and communication.
                </p>

                <div className="space-y-2">
                  <div className="text-xs font-bold text-gray-900">Key Humanities Disciplines:</div>
                  <div className="flex flex-wrap gap-1.5">
                    {['Economics', 'Education', 'English', 'History', 'Pol. Science', 'Sociology', 'Tenyidie'].map((sub, i) => (
                      <span key={i} className="text-[11px] font-semibold px-2.5 py-1 bg-emerald-50 text-[#4a6b28] rounded-md border border-emerald-200">
                        {sub}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                <span>Facilities: Central Library • Girls Hostel • Assembly Hall</span>
                <button
                  onClick={() => onNavigate && onNavigate('arts-block')}
                  className="font-bold text-[#4a6b28] hover:underline cursor-pointer flex items-center gap-1"
                >
                  <span>Explore Town Campus</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Institutional Milestones Timeline (Stepped Collegiate Timeline) */}
      <div className="card-interactive bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#4a6b28] uppercase tracking-wider mb-1">
            <Clock size={14} />
            <span>Evolutionary Journey</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-[#002147]">Milestones in Academic Excellence</h3>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Key historical landmarks defining the institutional growth of Capital College of Higher Education.
          </p>
        </div>

        <div className="relative pl-4 sm:pl-6 border-l-2 border-emerald-200 space-y-6">
          {milestones.map((m, idx) => (
            <div key={idx} className="relative group">
              {/* Year Marker Badge */}
              <div className="absolute -left-[25px] sm:-left-[33px] top-0 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-[#002147] text-[#8fc35e] border-2 border-white flex items-center justify-center font-bold text-[10px] sm:text-xs shadow-md group-hover:bg-[#4a6b28] group-hover:text-white transition-colors">
                {idx + 1}
              </div>

              <div className="p-4 sm:p-5 rounded-xl bg-gray-50 hover:bg-white border border-gray-200 hover:border-emerald-300 transition-all duration-300 shadow-2xs hover:shadow-xs">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                  <h4 className="text-sm sm:text-base font-bold text-gray-900 group-hover:text-[#4a6b28] transition-colors">
                    {m.title}
                  </h4>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#002147] text-white text-xs font-extrabold tracking-wider">
                    {m.year}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed text-justify">
                  {m.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 6. Institutional Pathways Portals (Connected Ecosystem) */}
      <div>
        <div className="mb-4">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#4a6b28] uppercase tracking-wider mb-0.5">
            <Layers size={14} />
            <span>Institutional Pathways</span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-[#002147]">Explore Capital College Ecosystem</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              title: 'Academic Programmes',
              desc: '12 B.A. & B.Sc. honours disciplines under FYUGP framework.',
              icon: BookOpen,
              action: () => onNavigate && onNavigate('programs'),
              btnText: 'Explore Courses'
            },
            {
              title: 'Faculty Directory',
              desc: 'Meet our distinguished professors, HODs, and academic mentors.',
              icon: Users,
              action: () => onNavigate && onNavigate('faculty'),
              btnText: 'View Faculty'
            },
            {
              title: 'Governing Body',
              desc: 'Apex policy council, managing director, and institutional board.',
              icon: Landmark,
              action: () => onNavigate && onNavigate('governing-body'),
              btnText: 'Governance'
            },
            {
              title: 'Admissions 2024-25',
              desc: 'Online application dossiers, criteria, and scholarship schemes.',
              icon: GraduationCap,
              action: () => onOpenAdmission ? onOpenAdmission('ARTS') : onNavigate && onNavigate('criteria'),
              btnText: 'Apply Online'
            }
          ].map((portal, idx) => (
            <div
              key={idx}
              className="card-interactive bg-white rounded-xl border border-gray-200 p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition-all duration-300"
            >
              <div>
                <div className="w-10 h-10 rounded-lg bg-emerald-50 text-[#4a6b28] border border-emerald-100 flex items-center justify-center mb-3">
                  <portal.icon size={20} />
                </div>
                <h4 className="font-bold text-sm sm:text-base text-[#002147] mb-1">{portal.title}</h4>
                <p className="text-xs text-gray-600 leading-relaxed mb-4">{portal.desc}</p>
              </div>
              <button
                onClick={portal.action}
                className="w-full text-xs font-bold uppercase tracking-wider py-2 rounded-lg bg-gray-50 hover:bg-[#4a6b28] text-gray-800 hover:text-white border border-gray-200 hover:border-[#4a6b28] transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>{portal.btnText}</span>
                <ArrowRight size={13} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 7. Official Download & Admissions Action Dock */}
      <div className="rounded-2xl bg-gradient-to-r from-gray-50 via-emerald-50/40 to-gray-50 border border-gray-200 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
        <div>
          <h4 className="text-base sm:text-lg font-bold text-[#002147]">Institutional Documents & Admissions</h4>
          <p className="text-xs sm:text-sm text-gray-600 mt-0.5">Official CCHE Prospectus 2024-25 and Degree Programmes framework.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <a
            href="https://capitalcollege.edu.in/wp-content/uploads/2024/04/CCHE-Prospectus-2024-05.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#002147] hover:bg-[#001736] text-white px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors shadow-xs"
          >
            <Download size={14} />
            <span>Prospectus (PDF)</span>
          </a>
          <button
            onClick={() => onNavigate && onNavigate('programs')}
            className="inline-flex items-center gap-2 bg-[#4a6b28] hover:bg-[#3d5920] text-white px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors shadow-xs cursor-pointer"
          >
            <BookOpen size={14} />
            <span>View FYUGP Courses</span>
          </button>
          <button
            onClick={() => onOpenAdmission ? onOpenAdmission('ARTS') : onNavigate && onNavigate('criteria')}
            className="inline-flex items-center gap-2 bg-[#d4af37] hover:bg-[#c29e2f] text-[#002147] px-4 py-2.5 rounded-lg text-xs font-extrabold uppercase tracking-wider transition-colors shadow-xs cursor-pointer"
          >
            <GraduationCap size={14} />
            <span>Apply Online</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// 2. SPONSORSHIP AND MANAGEMENT COMPONENT
function SponsorshipAndManagementSection({ onNavigate }) {
  const defaultBoardMembers = [
    {
      name: 'Dr. Khrietuo Doulo',
      designation: 'Managing Director',
      role: 'Executive Financial & Strategic Administration',
      background: 'Asst. Professor (Retired), Kohima Science College, Jotsoma',
      badge: 'Executive Oversight',
      image_url: ''
    },
    {
      name: 'Mr. Vezuhu Keyho',
      designation: 'Member — Board of Management',
      role: 'Institutional Development & Civic Governance',
      background: 'Former College Principal & Current Chairman, Supply Colony, Kohima',
      badge: 'Academic & Civic Governance',
      image_url: ''
    },
    {
      name: 'Mr. Kenneth Punyü',
      designation: 'Member — Board of Management',
      role: 'Financial Strategy & Higher Education Policy',
      background: 'Associate Professor, Kohima Science College, Jotsoma',
      badge: 'Higher Education Leadership',
      image_url: ''
    }
  ];

  const [dbBoardMembers, setDbBoardMembers] = useState([]);

  const loadBoard = () => {
    fetch('/api/governing-body?member_type=MANAGEMENT')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success && Array.isArray(data.members) && data.members.length > 0) {
          setDbBoardMembers(data.members);
        }
      })
      .catch((err) => {
        console.warn('Could not load board of management from API:', err);
      });
  };

  useEffect(() => {
    loadBoard();
    const handleUpdate = () => loadBoard();
    window.addEventListener('governing-body-updated', handleUpdate);
    return () => window.removeEventListener('governing-body-updated', handleUpdate);
  }, []);

  const boardMembers = useMemo(() => {
    if (dbBoardMembers.length > 0) {
      return dbBoardMembers.map((m) => ({
        id: m.id,
        name: m.name,
        designation: m.role || 'Member — Board of Management',
        role: m.category || 'Executive Financial & Strategic Administration',
        background: m.affiliation || '',
        badge: m.category || 'Executive Oversight',
        image_url: m.image_url || ''
      }));
    }
    return defaultBoardMembers;
  }, [dbBoardMembers]);

  return (
    <div className="space-y-10 font-sans text-gray-800">
      {/* Society Mandate Ribbon */}
      <div className="rounded-2xl bg-gradient-to-br from-[#002147] to-[#1e3a2b] p-6 sm:p-8 text-white shadow-md border border-white/10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#4a6b28] text-white text-xs font-bold uppercase tracking-wider mb-3">
          <Building2 size={13} />
          <span>Founding Institutional Trust</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
          National Academy Society
        </h2>
        <p className="text-sm sm:text-base text-gray-200 leading-relaxed max-w-3xl text-justify">
          Capital College of Higher Education is sponsored by <strong>National Academy Society</strong>. The members of the Society are comprised of educationists, social workers, retired government servants and public leaders who have a common interest in social transformation and working for the welfare of the people particularly in the field of education.
        </p>
      </div>

      {/* Board of Management Cards */}
      <div>
        <div className="mb-6">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#4a6b28] uppercase tracking-wider mb-1">
            <ShieldCheck size={14} />
            <span>Statutory Executive Authority</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-[#002147]">Board of Management</h3>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            All matters of funding and execution of institutional plans is the statutory responsibility of the Board of Management.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {boardMembers.map((member, idx) => (
            <PersonCard
              key={member.id || idx}
              name={member.name}
              role={member.designation}
              qualification={member.role}
              bio={member.background}
              image_url={member.image_url}
              department="Board of Management"
            />
          ))}
        </div>
      </div>

      {/* Society Mission Pillars */}
      <div className="card-interactive bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-xs">
        <h4 className="text-base sm:text-lg font-bold text-[#002147] mb-4">Core Society Mandates & Objectives</h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs sm:text-sm">
          <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
            <div className="font-bold text-[#002147] mb-1 flex items-center gap-1.5">
              <Landmark size={15} className="text-[#4a6b28]" />
              <span>Social Transformation</span>
            </div>
            <p className="text-gray-600 leading-relaxed">Dedicated to community upliftment and youth empowerment through higher education in Nagaland.</p>
          </div>
          <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
            <div className="font-bold text-[#002147] mb-1 flex items-center gap-1.5">
              <Scale size={15} className="text-[#4a6b28]" />
              <span>Financial Sustainability</span>
            </div>
            <p className="text-gray-600 leading-relaxed">Prudent capital allocation, infrastructure maintenance, and non-profit educational stewardship.</p>
          </div>
          <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
            <div className="font-bold text-[#002147] mb-1 flex items-center gap-1.5">
              <GraduationCap size={15} className="text-[#4a6b28]" />
              <span>Educational Welfare</span>
            </div>
            <p className="text-gray-600 leading-relaxed">Providing subsidized fee structures, scholarships, and institutional assistance for economically weak students.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// 3. GOVERNING BODY COMPONENT
function GoverningBodySection() {
  const defaultOfficers = [
    {
      id: 1,
      name: 'Mr. Vezuhu Keyho',
      role: 'Chairman',
      affiliation: 'Former College Principal & Current Chairman, Supply Colony, Kohima',
      member_type: 'OFFICER',
      category: 'Executive Leadership',
      image_url: ''
    },
    {
      id: 2,
      name: 'Dr. Zokho Venuh',
      role: 'Member Secretary',
      affiliation: 'Principal, Capital College of Higher Education (CCHE)',
      member_type: 'OFFICER',
      category: 'Executive Leadership',
      image_url: ''
    }
  ];

  const defaultMembers = [
    { id: 3, name: 'Mr. Vevohu Kezo', role: 'Member', affiliation: 'Vice Principal, Capital College of Higher Education (CCHE)', category: 'Administration', member_type: 'MEMBER', image_url: '' },
    { id: 4, name: 'Dr. Khrietuo Doulo', role: 'Member', affiliation: 'Asst. Prof., Science College, Jotsoma (Retired)', category: 'Higher Education', member_type: 'MEMBER', image_url: '' },
    { id: 5, name: 'Mr. Zacilhu Vadeo', role: 'Member', affiliation: 'Ex-Minister, Nagaland Legislative Assembly (NLA)', category: 'Public Leadership', member_type: 'MEMBER', image_url: '' },
    { id: 6, name: 'Mr. Kekhwengulo Lea', role: 'Member', affiliation: 'Vice Chairman, Nagaland Co-Operative Bank, Nagaland', category: 'Finance & Banking', member_type: 'MEMBER', image_url: '' },
    { id: 7, name: 'Mr. Vekhozo Khamo', role: 'Member', affiliation: 'Former Principal, Alder College', category: 'Academic Leadership', member_type: 'MEMBER', image_url: '' },
    { id: 8, name: 'Mr. Kenneth Punyü', role: 'Member', affiliation: 'Associate Prof., Science College, Jotsoma', category: 'Higher Education', member_type: 'MEMBER', image_url: '' },
    { id: 9, name: 'Smt. Suohienuo', role: 'Member', affiliation: 'Principal, State Institute of Rural Development (SIRD), Nagaland', category: 'Government & Research', member_type: 'MEMBER', image_url: '' },
    { id: 10, name: 'Smt. Abeino Zashu', role: 'Member', affiliation: 'Senior Lecturer & Academic Dean, CCHE', category: 'Faculty Representation', member_type: 'MEMBER', image_url: '' },
    { id: 11, name: 'Prof. S.K. Singh', role: 'Member', affiliation: 'Department of Geology, Nagaland University (NU), Kohima', category: 'University Nominee', member_type: 'MEMBER', image_url: '' }
  ];

  const [dbMembers, setDbMembers] = useState([]);

  const loadGoverningBody = () => {
    fetch('/api/governing-body')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success && Array.isArray(data.members) && data.members.length > 0) {
          setDbMembers(data.members);
        }
      })
      .catch((err) => {
        console.warn('Could not load governing body from API:', err);
      });
  };

  useEffect(() => {
    loadGoverningBody();
    const handleUpdate = () => loadGoverningBody();
    window.addEventListener('governing-body-updated', handleUpdate);
    return () => window.removeEventListener('governing-body-updated', handleUpdate);
  }, []);

  const officers = useMemo(() => {
    const live = dbMembers.filter((m) => m.member_type === 'OFFICER');
    return live.length > 0 ? live : defaultOfficers;
  }, [dbMembers]);

  const members = useMemo(() => {
    const live = dbMembers.filter((m) => m.member_type !== 'OFFICER');
    return live.length > 0 ? live : defaultMembers;
  }, [dbMembers]);

  return (
    <div className="space-y-10 font-sans text-gray-800">
      {/* Mandate Hero */}
      <div className="rounded-2xl bg-gradient-to-br from-[#002147] to-[#122822] p-6 sm:p-8 text-white shadow-md border border-white/10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#4a6b28] text-white text-xs font-bold uppercase tracking-wider mb-3">
          <Landmark size={13} />
          <span>Apex Policy Authority</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
          College Governing Body
        </h2>
        <p className="text-sm sm:text-base text-gray-200 leading-relaxed max-w-3xl text-justify">
          All policy matters regarding the college are looked after by the <strong>College Governing Body</strong>. Composed of eminent educationists, Nagaland University nominees, public leaders, and institutional administrators, the Governing Body ensures strategic alignment, academic integrity, and statutory compliance.
        </p>
      </div>

      {/* Council Executive Officers */}
      <div>
        <h3 className="text-base font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
          <BadgeCheck size={16} className="text-[#4a6b28]" />
          <span>Council Executive Officers</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto">
          {officers.map((officer, idx) => (
            <PersonCard
              key={officer.id || idx}
              name={officer.name}
              role={officer.role}
              bio={officer.affiliation}
              image_url={officer.image_url}
              department="College Governing Body"
            />
          ))}
        </div>
      </div>

      {/* Council Members Grid */}
      <div>
        <h3 className="text-base font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
          <Users size={16} className="text-[#4a6b28]" />
          <span>Council Members Matrix</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {members.map((m, idx) => (
            <div
              key={m.id || idx}
              className="card-interactive bg-white rounded-xl border border-gray-200 p-5 shadow-xs flex flex-col justify-between group hover:border-[#4a6b28]/40 hover:shadow-md transition-all duration-300"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-gray-100 text-gray-600 border border-gray-200">
                    {m.category || 'Council Member'}
                  </span>
                  <span className="text-[11px] font-bold text-[#4a6b28]">{m.role || 'Member'}</span>
                </div>

                <div className="flex items-start gap-3 mb-2">
                  {m.image_url ? (
                    <img
                      src={m.image_url}
                      alt={m.name}
                      className="w-12 h-12 rounded-xl object-cover ring-1 ring-gray-200 shadow-xs shrink-0 transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#002147]/10 to-[#4a6b28]/15 text-[#002147] border border-gray-200 flex items-center justify-center font-bold text-xs shrink-0">
                      {getMemberInitials(m.name)}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <h4 className="font-bold text-gray-900 text-sm md:text-base leading-snug group-hover:text-[#002147] transition-colors">{m.name}</h4>
                  </div>
                </div>

                <p className="text-xs text-gray-600 leading-relaxed text-justify">{m.affiliation}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// 4. COLLEGE ADMINISTRATION COMPONENT
function CollegeAdministrationSection({ onNavigate }) {
  const defaultLeaders = [
    {
      name: 'Dr. Zokho Venuh',
      qualification: 'M.A., M.Phil., Ph.D. in History (Nagaland University)',
      role: 'Principal & Head of Institution',
      portfolio: 'Executive Head of Academic, Administrative & Statutory Affairs',
      desc: 'Oversees institutional policy, faculty governance, university affiliations, and campus development.',
      image_url: ''
    },
    {
      name: 'Mr. Vevohu Kezo',
      qualification: 'M.Sc. in Zoology',
      role: 'Vice Principal',
      portfolio: 'Academic Operations, Examination Coordination & Campus Oversight',
      desc: 'Assists the Principal in institutional administration, daily campus operations, and science stream affairs.',
      image_url: ''
    },
    {
      name: 'Mrs. Abeino Zashu',
      qualification: 'M.A. in Sociology, UGC-NET',
      role: 'Academic Dean',
      portfolio: 'Curriculum Framework, HoD Coordination & Quality Oversight',
      desc: 'Heads FYUGP curriculum framework delivery, HoD reports, admissions committee, and academic compliance.',
      image_url: ''
    },
    {
      name: 'Mrs. Tatongkala Lemtur Lohe',
      qualification: 'M.A., M.Phil. in English',
      role: 'Dean of Students',
      portfolio: 'Student Affairs, Guidance, Mentorship & Campus Welfare',
      desc: 'Coordinates Students Alumni, Welfare Scheme, Anti-Ragging Committee, Evangelical Union, and Grievance Cell.',
      image_url: ''
    }
  ];

  const [dbLeaders, setDbLeaders] = useState([]);

  const loadLeaders = () => {
    fetch('/api/governing-body?member_type=ADMINISTRATION')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success && Array.isArray(data.members) && data.members.length > 0) {
          setDbLeaders(data.members);
        }
      })
      .catch((err) => {
        console.warn('Could not load administration from API:', err);
      });
  };

  useEffect(() => {
    loadLeaders();
    const handleUpdate = () => loadLeaders();
    window.addEventListener('governing-body-updated', handleUpdate);
    return () => window.removeEventListener('governing-body-updated', handleUpdate);
  }, []);

  const leaders = useMemo(() => {
    if (dbLeaders.length > 0) {
      return dbLeaders.map((m) => ({
        id: m.id,
        name: m.name,
        role: m.role || 'Executive Leader',
        qualification: m.affiliation || '',
        portfolio: m.category || 'Institutional Administration',
        desc: m.category ? `Coordinates ${m.category} under institutional authority.` : 'Oversees collegiate administration.',
        image_url: m.image_url || ''
      }));
    }
    return defaultLeaders;
  }, [dbLeaders]);

  return (
    <div className="space-y-10 font-sans text-gray-800">
      {/* Hierarchy Banner */}
      <div className="rounded-2xl bg-gradient-to-br from-[#002147] via-[#0b2b4d] to-[#1a382b] p-6 sm:p-8 text-white shadow-md border border-white/10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#4a6b28] text-white text-xs font-bold uppercase tracking-wider mb-3">
          <Building2 size={13} />
          <span>Institutional Administrative Framework</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
          College Administration
        </h2>
        <p className="text-sm sm:text-base text-gray-200 leading-relaxed max-w-3xl text-justify">
          The Principal is the Administrative Head of the institution. All institutional activities are headed by the principal. The principal is assisted by the Vice Principal, the Academic Dean, Dean of Students, Department HODs, and the different committee in-charges who are delegated to carry out specific assignments. The Students’ Council plays a vital role in coordinating the different college activities and matters concerning the welfare of the students.
        </p>
      </div>

      {/* 4 Executive Officers */}
      <div>
        <h3 className="text-base font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
          <UserCheck size={16} className="text-[#4a6b28]" />
          <span>Executive Administrative Leadership</span>
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3.5 sm:gap-4">
          {leaders.map((leader, idx) => (
            <PersonCard
              key={leader.id || idx}
              name={leader.name}
              role={leader.role}
              qualification={leader.qualification}
              bio={leader.desc}
              image_url={leader.image_url}
              department="College Administration"
            />
          ))}
        </div>
      </div>

      {/* Administrative Coordination Wings */}
      <div className="card-interactive bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 border-b border-gray-100 pb-4">
          <div>
            <h4 className="text-lg font-bold text-[#002147]">Statutory Administrative Wings & Committees</h4>
            <p className="text-xs text-gray-500">26 specialized cells and committees operate under administrative oversight.</p>
          </div>
          <button
            onClick={() => onNavigate && onNavigate('committees-and-in-charges')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#4a6b28] hover:text-[#3d5920] underline underline-offset-4 cursor-pointer"
          >
            <span>View All 26 Committees</span>
            <ArrowRight size={14} />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div className="p-3.5 rounded-lg bg-gray-50 border border-gray-200">
            <strong className="text-[#002147] block mb-1">Principal’s Office</strong>
            <p className="text-gray-600 text-[11px]">Overall institutional authority, NU liaison, and statutory governance.</p>
          </div>
          <div className="p-3.5 rounded-lg bg-gray-50 border border-gray-200">
            <strong className="text-[#002147] block mb-1">Academic Dean’s Council</strong>
            <p className="text-gray-600 text-[11px]">Curriculum delivery, HoD monthly reports, and academic scheduling.</p>
          </div>
          <div className="p-3.5 rounded-lg bg-gray-50 border border-gray-200">
            <strong className="text-[#002147] block mb-1">Dean of Students’ Wing</strong>
            <p className="text-gray-600 text-[11px]">Student welfare, alumni coordination, anti-ragging & counseling.</p>
          </div>
          <div className="p-3.5 rounded-lg bg-gray-50 border border-gray-200">
            <strong className="text-[#002147] block mb-1">Examination Cell</strong>
            <p className="text-gray-600 text-[11px]">Internal assessments, university routines, and result certifications.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper for collegiate faculty initials
const getFacultyInitials = (name) => {
  if (!name) return 'CC';
  const clean = name.replace(/^(Dr\.|Mr\.|Mrs\.|Ms\.|Prof\.)\s+/i, '').trim();
  const parts = clean.split(/\s+/).filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

// 5. FACULTY DIRECTORY COMPONENT
function FacultySection({ onNavigate }) {
  const [activeStream, setActiveStream] = useState('ALL');
  const [search, setSearch] = useState('');
  const [dbFaculty, setDbFaculty] = useState([]);

  // Fetch live faculty and listen for admin updates
  const loadFaculty = () => {
    fetch('/api/faculty')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success && Array.isArray(data.faculty)) {
          setDbFaculty(data.faculty);
        }
      })
      .catch((err) => {
        console.warn('Could not load faculty directory from API:', err);
      });
  };

  useEffect(() => {
    loadFaculty();
    const handleUpdate = () => loadFaculty();
    window.addEventListener('faculty-updated', handleUpdate);
    return () => window.removeEventListener('faculty-updated', handleUpdate);
  }, []);

  // Baseline authentic Arts departments catalog
  const baseArtsDepartments = [
    {
      key: 'english',
      dept: 'Department of English',
      icon: Feather,
      hod: 'Dr. Rukulu Kezo Puro',
      hodQual: 'M.A., M.Phil., Ph.D., PGCTE',
      hodDesignation: 'Head of Department & Principal',
      faculty: [
        { name: 'Tatongkala Lemtur Lohe', qual: 'M.A., M.Phil.', designation: 'Assistant Professor & Dean of Students' },
        { name: 'Opangmenla Jamir', qual: 'M.A., B.Ed.', designation: 'Assistant Professor & IQAC Coordinator' }
      ]
    },
    {
      key: 'history',
      dept: 'Department of History',
      icon: Landmark,
      hod: 'Temsuwapang Lkr',
      hodQual: 'M.A.',
      hodDesignation: 'Head of Department & NSS Nodal Officer',
      faculty: [
        { name: 'Kumuni Keppen', qual: 'M.A.', designation: 'Assistant Professor' },
        { name: 'Niekhoto Chürhah', qual: 'M.A.', designation: 'Assistant Professor' }
      ]
    },
    {
      key: 'political science',
      dept: 'Department of Political Science',
      icon: Scale,
      hod: 'Chubarenla Lkr',
      hodQual: 'M.A., UGC-NET',
      hodDesignation: 'Head of Department & Assistant Professor',
      faculty: [
        { name: 'Vungthungo', qual: 'M.A., UGC-NET', designation: 'Assistant Professor' },
        { name: 'Meyiepeo Puyie', qual: 'M.A., UGC-NET', designation: 'Assistant Professor' }
      ]
    },
    {
      key: 'sociology',
      dept: 'Department of Sociology',
      icon: Users,
      hod: 'Kevivonu Zhotso Chishi',
      hodQual: 'M.A.',
      hodDesignation: 'Head of Department & Assistant Professor',
      faculty: [
        { name: 'Abeino Zashü', qual: 'M.A.', designation: 'Assistant Professor & Academic Dean' },
        { name: 'Vizoboto Zhotso', qual: 'M.A.', designation: 'Assistant Professor' }
      ]
    },
    {
      key: 'tenyidie',
      dept: 'Department of Tenyidie',
      icon: BookOpen,
      hod: 'Theja Lohe',
      hodQual: 'M.A.',
      hodDesignation: 'Head of Department & Assistant Professor',
      faculty: []
    },
    {
      key: 'education',
      dept: 'Department of Education',
      icon: GraduationCap,
      hod: 'Shedulu Kezo',
      hodQual: 'M.A., B.Ed., M.Ed., UGC-NET',
      hodDesignation: 'Head of Department & Assistant Professor',
      faculty: []
    },
    {
      key: 'economics',
      dept: 'Department of Economics',
      icon: TrendingUp,
      hod: 'Akanjungla Kichu',
      hodQual: 'M.A.',
      hodDesignation: 'Head of Department & Assistant Professor',
      faculty: []
    }
  ];

  // Baseline authentic Science departments catalog
  const baseScienceDepartments = [
    {
      key: 'botany',
      dept: 'Department of Botany',
      icon: Leaf,
      hod: 'Dr. Kadunlung Gamei',
      hodQual: 'M.Sc., Ph.D.',
      hodDesignation: 'Head of Department & Assistant Professor',
      faculty: []
    },
    {
      key: 'chemistry',
      dept: 'Department of Chemistry',
      icon: FlaskConical,
      hod: 'Pyonphamo Ezung',
      hodQual: 'M.Sc.',
      hodDesignation: 'Head of Department & Assistant Professor',
      faculty: []
    },
    {
      key: 'zoology',
      dept: 'Department of Zoology',
      icon: Dna,
      hod: 'Nourhevinuo Kessiezie',
      hodQual: 'M.Sc., UGC-NET',
      hodDesignation: 'Head of Department & Assistant Professor',
      faculty: [
        { name: 'Vevohu Kezo', qual: 'M.Sc.', designation: 'Vice Principal & Assistant Professor' }
      ]
    },
    {
      key: 'mathematics & physics',
      dept: 'Department of Mathematics & Physics',
      icon: Atom,
      hod: 'Science Academic Faculty',
      hodQual: 'M.Sc.',
      hodDesignation: 'Head of Department & Assistant Professor',
      faculty: []
    }
  ];

  // Baseline authentic visiting scholars
  const baseVisitingArts = [
    { name: 'Vezolu Puro', qual: 'M.A. (NET), Ph.D. Research Scholar, IIITDM, Kurnool, Andhra Pradesh' },
    { name: 'Sekulu Nienu', qual: 'M.A. (JRF), B.Ed., M.Ed., Research Scholar, Nagaland University' }
  ];

  const baseVisitingScience = [
    { name: 'Kenneth Punyü', qual: 'M.Sc. Associate Prof. Dept. of Chemistry, Science College, Jotsoma' },
    { name: 'Pelo-o', qual: 'M.Sc. Faculty Member, Dept. of Botany, Theta Tutorials, Kohima' },
    { name: 'M.N. Murali', qual: 'Associate Prof. (Rtd), Dept. of Mathematics, Science College, Jotsoma' },
    { name: 'Dr. Khrietuo Doulo', qual: 'Asst. Prof. (Rtd), Dept. of Mathematics, Science College, Jotsoma' },
    { name: 'Dr. Abhijit Bora', qual: 'Associate Prof. (Rtd), Dept. of Physics, Science College, Jotsoma' }
  ];

  // Helper to normalize department names
  const cleanDeptName = (d) =>
    (d || '').toLowerCase().replace(/^(department of|dept\.? of)\s+/i, '').trim();

  // Dynamically merge DB faculty into departments
  const buildDepartmentRoster = (baseList, streamName) => {
    // 1. Process standard departments
    const processed = baseList.map((base) => {
      // Find all DB entries belonging to this department
      const matches = dbFaculty.filter((f) => {
        const fDept = cleanDeptName(f.department);
        const bDept = cleanDeptName(base.key || base.dept);
        return fDept === bDept || fDept.includes(bDept) || bDept.includes(fDept);
      });

      // Determine HOD: check DB for is_hod === 1, or matching base.hod name
      const dbHod = matches.find((m) => Boolean(m.is_hod)) || matches.find((m) => m.name.toLowerCase() === base.hod.toLowerCase());
      const hodName = dbHod ? dbHod.name : base.hod;
      const hodQual = dbHod ? (dbHod.qualification || base.hodQual) : base.hodQual;
      const hodDesignation = dbHod ? (dbHod.designation || base.hodDesignation) : base.hodDesignation;
      const hodImage = dbHod?.image_url || '';

      // Determine other faculty members
      const dbNonHod = matches.filter((m) => m !== dbHod);
      let facultyList = [];

      if (dbNonHod.length > 0) {
        // Use DB members and enrich with photo and designation
        facultyList = dbNonHod.map((m) => ({
          name: m.name,
          qual: m.qualification || '',
          designation: m.designation || 'Faculty Member',
          image_url: m.image_url || ''
        }));
      } else {
        // Fallback to base.faculty and attach any DB photo matching by name
        facultyList = base.faculty.map((bf) => {
          const matchInDb = dbFaculty.find((df) => df.name.toLowerCase() === bf.name.toLowerCase());
          return {
            ...bf,
            image_url: matchInDb?.image_url || ''
          };
        });
      }

      return {
        ...base,
        hod: hodName,
        hodQual,
        hodDesignation,
        hodImage,
        faculty: facultyList
      };
    });

    // 2. Append any custom departments from DB for this stream that are not in baseList
    const customDeptNames = Array.from(
      new Set(
        dbFaculty
          .filter((f) => f.stream === streamName && !f.department?.toLowerCase().includes('visiting'))
          .map((f) => f.department)
          .filter((d) => d && !baseList.some((b) => cleanDeptName(b.dept) === cleanDeptName(d)))
      )
    );

    customDeptNames.forEach((cDept) => {
      const cMatches = dbFaculty.filter((f) => f.department === cDept && f.stream === streamName);
      const cHod = cMatches.find((m) => Boolean(m.is_hod)) || cMatches[0];
      const cNonHod = cMatches.filter((m) => m !== cHod);

      processed.push({
        dept: cDept.startsWith('Department of') ? cDept : `Department of ${cDept}`,
        icon: streamName === 'SCIENCE' ? Atom : BookOpen,
        hod: cHod ? cHod.name : 'Head of Department',
        hodQual: cHod ? (cHod.qualification || '') : '',
        hodDesignation: cHod ? (cHod.designation || 'Head of Department') : 'Head of Department',
        hodImage: cHod?.image_url || '',
        faculty: cNonHod.map((m) => ({
          name: m.name,
          qual: m.qualification || '',
          designation: m.designation || 'Faculty Member',
          image_url: m.image_url || ''
        }))
      });
    });

    return processed;
  };

  const artsDepartments = buildDepartmentRoster(baseArtsDepartments, 'ARTS');
  const scienceDepartments = buildDepartmentRoster(baseScienceDepartments, 'SCIENCE');

  // Enrich visiting scholars with any DB photos
  const enrichVisiting = (list) =>
    list.map((v) => {
      const matchInDb = dbFaculty.find((df) => df.name.toLowerCase() === v.name.toLowerCase());
      return {
        ...v,
        image_url: matchInDb?.image_url || ''
      };
    });

  const visitingArts = enrichVisiting(baseVisitingArts);
  const visitingScience = enrichVisiting(baseVisitingScience);

  // Filtering by search term
  const filterList = (list) => {
    if (!search.trim()) return list;
    const q = search.toLowerCase();
    return list.filter((item) => {
      const matchDept = item.dept.toLowerCase().includes(q);
      const matchHod = (item.hod || '').toLowerCase().includes(q);
      const matchHodQual = (item.hodQual || '').toLowerCase().includes(q);
      const matchFaculty = item.faculty.some(
        (f) =>
          f.name.toLowerCase().includes(q) ||
          (f.qual && f.qual.toLowerCase().includes(q)) ||
          (f.designation && f.designation.toLowerCase().includes(q))
      );
      return matchDept || matchHod || matchHodQual || matchFaculty;
    });
  };

  const filteredArts = filterList(artsDepartments);
  const filteredScience = filterList(scienceDepartments);

  const [popOutDept, setPopOutDept] = useState(null);

  // Quick department suggestions based on search
  const allDepartmentsList = useMemo(() => {
    return [
      ...artsDepartments.map((d) => ({ ...d, stream: 'ARTS' })),
      ...scienceDepartments.map((d) => ({ ...d, stream: 'SCIENCE' }))
    ];
  }, [artsDepartments, scienceDepartments]);

  const matchedDeptFromSearch = useMemo(() => {
    if (!search.trim() || search.trim().length < 2) return null;
    const q = search.toLowerCase().trim();
    return allDepartmentsList.find((d) => {
      const clean = cleanDeptName(d.dept);
      return clean.includes(q) || d.dept.toLowerCase().includes(q) || (d.key && d.key.includes(q));
    });
  }, [search, allDepartmentsList]);

  return (
    <div className="space-y-10 font-sans text-gray-800">
      {/* Official Faculty Banner Group Photo */}
      <div className="relative rounded-2xl overflow-hidden border border-gray-200 shadow-md bg-gray-50 group card-image-zoom">
        <img
          src="https://capitalcollege.edu.in/wp-content/uploads/2023/05/058f6e23-4351-4688-b666-a9738ed932eb-1.jpg"
          alt="Faculty Assembly CCHE"
          className="w-full h-auto max-h-[460px] object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent p-4 sm:p-6 text-white pointer-events-none">
          <h3 className="text-lg sm:text-xl font-extrabold text-white drop-shadow-md">Faculty Assembly & Academic Mentors</h3>
          <p className="text-xs sm:text-sm text-gray-200 drop-shadow-xs">Capital College of Higher Education, Kohima — Experienced, Qualified & Dedicated Teachers</p>
        </div>
      </div>

      {/* Stream & Department Navigation Controls */}
      <div className="space-y-3 p-4 sm:p-5 rounded-2xl bg-gray-50 border border-gray-200 shadow-2xs">
        {/* Stream Tabs + Search Input */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'ALL', label: `All Departments (${artsDepartments.length + scienceDepartments.length})` },
              { id: 'ARTS', label: `Arts Stream (${artsDepartments.length})` },
              { id: 'SCIENCE', label: `Science Stream (${scienceDepartments.length})` },
              { id: 'VISITING', label: 'Visiting Scholars' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveStream(tab.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeStream === tab.id
                    ? 'bg-[#002147] text-white shadow-xs'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative min-w-[280px]">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Type department (e.g. English, Zoology) to pop out..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-gray-300 text-xs text-gray-800 focus:outline-none focus:border-[#4a6b28] focus:ring-1 focus:ring-[#4a6b28] shadow-2xs"
            />
          </div>
        </div>

        {/* Instant Department Pop-Out Banner when typing department name */}
        {matchedDeptFromSearch && (
          <div className="p-3 bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border border-emerald-300 rounded-xl flex items-center justify-between gap-3 animate-fadeIn shadow-xs">
            <div className="flex items-center gap-2 text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="font-bold text-[#002147]">
                Department Found: <strong>{matchedDeptFromSearch.dept}</strong>
              </span>
              <span className="text-gray-500 hidden sm:inline">
                (HOD: {matchedDeptFromSearch.hod} + {matchedDeptFromSearch.faculty?.length || 0} Teachers)
              </span>
            </div>
            <button
              onClick={() => setPopOutDept(matchedDeptFromSearch)}
              className="inline-flex items-center gap-1.5 bg-[#4a6b28] hover:bg-[#3d5920] text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-xs transition-colors cursor-pointer shrink-0"
            >
              <span>Pop Out HOD &amp; Teachers</span>
              <ArrowRight size={13} />
            </button>
          </div>
        )}

        {/* Interactive Department Quick-Chips Under Streams */}
        <div className="pt-2 border-t border-gray-200/80">
          <div className="text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-2 flex items-center justify-between">
            <span>Select a Department to Pop Out HOD &amp; Teachers:</span>
            <span className="text-[10px] text-gray-400 font-normal">Click any department chip</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {(activeStream === 'ALL' || activeStream === 'ARTS') && (
              <>
                {artsDepartments.map((d) => {
                  const slug = d.key || cleanDeptName(d.dept).replace(/\s+/g, '-');
                  return (
                    <button
                      key={d.key || d.dept}
                      onClick={() => {
                        if (onNavigate) {
                          onNavigate(`department-${slug}`);
                        } else {
                          setPopOutDept({ ...d, stream: 'ARTS' });
                        }
                      }}
                      className="inline-flex items-center gap-1.5 bg-white hover:bg-emerald-50 border border-gray-200 hover:border-[#4a6b28] text-gray-800 hover:text-[#002147] px-2.5 py-1 rounded-lg text-xs font-semibold transition-all shadow-2xs hover:shadow-xs cursor-pointer group"
                      title={`Open dedicated ${d.dept} page`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#4a6b28] group-hover:scale-125 transition-transform"></span>
                      <span>{cleanDeptName(d.dept)}</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-gray-100 text-gray-500 font-mono group-hover:bg-[#4a6b28] group-hover:text-white">
                        {(d.faculty?.length || 0) + 1}
                      </span>
                      <ArrowRight size={10} className="text-gray-400 group-hover:text-[#4a6b28] group-hover:translate-x-0.5 transition-all" />
                    </button>
                  );
                })}
              </>
            )}

            {(activeStream === 'ALL' || activeStream === 'SCIENCE') && (
              <>
                {scienceDepartments.map((d) => {
                  const slug = d.key || cleanDeptName(d.dept).replace(/\s+/g, '-');
                  return (
                    <button
                      key={d.key || d.dept}
                      onClick={() => {
                        if (onNavigate) {
                          onNavigate(`department-${slug}`);
                        } else {
                          setPopOutDept({ ...d, stream: 'SCIENCE' });
                        }
                      }}
                      className="inline-flex items-center gap-1.5 bg-white hover:bg-blue-50 border border-gray-200 hover:border-blue-500 text-gray-800 hover:text-[#002147] px-2.5 py-1 rounded-lg text-xs font-semibold transition-all shadow-2xs hover:shadow-xs cursor-pointer group"
                      title={`Open dedicated ${d.dept} page`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600 group-hover:scale-125 transition-transform"></span>
                      <span>{cleanDeptName(d.dept)}</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-gray-100 text-gray-500 font-mono group-hover:bg-blue-600 group-hover:text-white">
                        {(d.faculty?.length || 0) + 1}
                      </span>
                      <ArrowRight size={10} className="text-gray-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
                    </button>
                  );
                })}
              </>
            )}
          </div>
        </div>
      </div>

      {/* POP-OUT SPOTLIGHT MODAL FOR DEPARTMENT HOD & TEACHERS */}
      {popOutDept && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 animate-fadeIn">
          <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col max-h-[90vh]">
            {/* Header with Department Name & Stream Badge */}
            <div className="bg-gradient-to-r from-[#001736] via-[#002858] to-[#001736] text-white p-5 sm:p-6 flex items-start justify-between border-b-4 border-[#4a6b28] shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-white/10 text-[#8fc35e] border border-white/15 flex items-center justify-center font-bold shadow-xs">
                  {popOutDept.icon ? <popOutDept.icon size={24} /> : <BookOpen size={24} />}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-[#4a6b28] text-white tracking-wider">
                      {popOutDept.stream === 'SCIENCE' ? 'Science Stream (B.Sc.)' : 'Arts Stream (B.A.)'}
                    </span>
                    <span className="text-[10px] text-slate-300 font-medium">NEP 2020 FYUGP</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-white">{popOutDept.dept}</h3>
                </div>
              </div>

              <button
                onClick={() => setPopOutDept(null)}
                className="text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-xl transition-all cursor-pointer"
                title="Close Department View"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-7 overflow-y-auto space-y-7 bg-slate-50/50">
              {/* Highlighted HOD Showcase Card */}
              <div>
                <div className="text-xs font-extrabold uppercase tracking-wider text-[#4a6b28] mb-3 flex items-center gap-1.5">
                  <Award size={15} className="text-amber-500" />
                  <span>Head of Department (HOD)</span>
                </div>

                <div className="max-w-md">
                  <PersonCard
                    variant="spotlight"
                    isHod={true}
                    name={popOutDept.hod}
                    designation={popOutDept.hodDesignation || 'Head of Department'}
                    qualification={popOutDept.hodQual}
                    imageUrl={popOutDept.hodImage}
                    department={popOutDept.dept}
                    stream={popOutDept.stream}
                    bio={`Oversees academic curriculum delivery, departmental assessments, student seminars, and faculty coordination for ${popOutDept.dept}.`}
                  />
                </div>
              </div>

              {/* Department Faculty Members / Teachers */}
              <div>
                <div className="text-xs font-extrabold uppercase tracking-wider text-[#002147] mb-3 flex items-center justify-between">
                  <span>Department Teachers &amp; Faculty Members ({popOutDept.faculty?.length || 0})</span>
                  <span className="text-[11px] text-gray-400 font-normal">Dedicated Academic Mentors</span>
                </div>

                {popOutDept.faculty && popOutDept.faculty.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {popOutDept.faculty.map((f, fi) => (
                      <PersonCard
                        key={fi}
                        name={f.name}
                        role={f.designation || 'Faculty Member'}
                        qualification={f.qual}
                        image_url={f.image_url}
                        department={popOutDept.dept}
                        stream={popOutDept.stream}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="p-6 bg-white rounded-2xl border border-gray-200 text-center text-xs text-gray-500 shadow-2xs">
                    Department faculty records are overseen directly by the Head of Department.
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-gray-50 border-t border-gray-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
              <span className="text-xs text-gray-500">Capital College of Higher Education, Kohima</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const slug = popOutDept.key || cleanDeptName(popOutDept.dept).replace(/\s+/g, '-');
                    setPopOutDept(null);
                    if (onNavigate) onNavigate(`department-${slug}`);
                  }}
                  className="bg-[#4a6b28] hover:bg-[#3d5920] text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Open Dedicated Department Page</span>
                  <ArrowRight size={13} />
                </button>
                <button
                  onClick={() => setPopOutDept(null)}
                  className="bg-[#002147] hover:bg-[#001736] text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Arts Departments */}
      {(activeStream === 'ALL' || activeStream === 'ARTS') && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
            <span className="w-3 h-3 rounded-full bg-[#4a6b28]"></span>
            <h3 className="text-lg sm:text-xl font-extrabold text-[#002147]">Arts Stream Departments (P.R. Hill Campus)</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredArts.map((dept, idx) => (
              <div
                key={idx}
                className="card-interactive card-accent-top bg-white rounded-2xl border border-gray-200 p-5 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-lg bg-emerald-50 text-[#4a6b28] border border-emerald-100 flex items-center justify-center font-bold">
                        <dept.icon size={18} />
                      </div>
                      <h4 className="font-bold text-[#002147] text-base">{dept.dept}</h4>
                    </div>
                    <button
                      onClick={() => setPopOutDept({ ...dept, stream: 'ARTS' })}
                      className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100/70 hover:bg-[#4a6b28] text-emerald-800 hover:text-white transition-colors cursor-pointer flex items-center gap-1 shadow-2xs"
                      title="Pop out this department's HOD and teachers"
                    >
                      <span>B.A. FYUGP</span>
                      <span className="font-extrabold text-[9px] bg-black/10 px-1 rounded">Pop Out ↗</span>
                    </button>
                  </div>

                  {/* HOD Card with Profile Picture */}
                  <div className="p-3.5 rounded-xl bg-gradient-to-r from-gray-50 to-emerald-50/20 border border-gray-200 mb-3.5 flex items-center gap-3.5 hover:shadow-2xs transition-shadow">
                    <div className="relative shrink-0">
                      {dept.hodImage ? (
                        <img
                          src={dept.hodImage}
                          alt={dept.hod}
                          className="w-14 h-14 rounded-full object-cover border-2 border-emerald-600/50 shadow-xs ring-2 ring-emerald-500/20"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#002147] to-emerald-800 text-white font-extrabold flex items-center justify-center text-sm shadow-xs border-2 border-white/20">
                          {getFacultyInitials(dept.hod)}
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1.5 mb-0.5">
                        <span className="text-[10px] font-extrabold text-[#4a6b28] uppercase tracking-wider flex items-center gap-1">
                          <Award size={12} className="text-[#4a6b28]" />
                          Head of Department
                        </span>
                        {dept.hodDesignation && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-100/70 text-emerald-800 truncate max-w-[130px]">
                            {dept.hodDesignation}
                          </span>
                        )}
                      </div>
                      <div className="font-bold text-gray-900 text-sm truncate">{dept.hod}</div>
                      <div className="text-xs text-gray-500 font-medium truncate">{dept.hodQual}</div>
                    </div>
                  </div>

                  {/* Other Faculty Members with Profile Pictures */}
                  {dept.faculty && dept.faculty.length > 0 && (
                    <div className="space-y-2 mt-2 pt-2 border-t border-gray-100">
                      <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                        Faculty Members ({dept.faculty.length})
                      </div>
                      <div className="space-y-1.5">
                        {dept.faculty.map((f, fi) => (
                          <div
                            key={fi}
                            className="flex items-center justify-between gap-2.5 text-xs py-1.5 px-2 rounded-lg hover:bg-gray-50/80 transition-colors border border-transparent hover:border-gray-200"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              {f.image_url ? (
                                <img
                                  src={f.image_url}
                                  alt={f.name}
                                  className="w-8 h-8 rounded-full object-cover border border-emerald-600/30 shadow-2xs shrink-0 ring-1 ring-emerald-500/20"
                                />
                              ) : (
                                <div className="w-8 h-8 rounded-full bg-slate-100 text-[#002147] border border-slate-200 flex items-center justify-center font-bold text-[11px] shrink-0">
                                  {getFacultyInitials(f.name)}
                                </div>
                              )}
                              <div className="min-w-0">
                                <span className="font-bold text-gray-800 block truncate">{f.name}</span>
                                {f.designation && (
                                  <span className="text-[10px] text-gray-400 block truncate">{f.designation}</span>
                                )}
                              </div>
                            </div>
                            <span className="text-gray-500 font-medium text-[11px] text-right shrink-0 max-w-[160px] truncate">
                              {f.qual}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Dedicated Page Button */}
                  <div className="pt-3 mt-3 border-t border-gray-100 flex items-center justify-between">
                    <button
                      onClick={() => {
                        const slug = dept.key || cleanDeptName(dept.dept).replace(/\s+/g, '-');
                        if (onNavigate) onNavigate(`department-${slug}`);
                      }}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#4a6b28] hover:text-[#002147] transition-colors cursor-pointer group/btn"
                    >
                      <span>Visit Department Page</span>
                      <ArrowRight size={13} className="group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                    <button
                      onClick={() => setPopOutDept({ ...dept, stream: 'ARTS' })}
                      className="text-[11px] text-gray-400 hover:text-gray-700 font-semibold cursor-pointer"
                    >
                      Quick Pop-Out
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Science Departments */}
      {(activeStream === 'ALL' || activeStream === 'SCIENCE') && (
        <div className="space-y-4 pt-4">
          <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
            <span className="w-3 h-3 rounded-full bg-[#002147]"></span>
            <h3 className="text-lg sm:text-xl font-extrabold text-[#002147]">Science Stream Departments (Thegaba Campus)</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredScience.map((dept, idx) => (
              <div
                key={idx}
                className="card-interactive card-accent-top bg-white rounded-2xl border border-gray-200 p-5 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-lg bg-blue-50 text-[#002147] border border-blue-100 flex items-center justify-center font-bold">
                        <dept.icon size={18} />
                      </div>
                      <h4 className="font-bold text-[#002147] text-base">{dept.dept}</h4>
                    </div>
                    <button
                      onClick={() => setPopOutDept({ ...dept, stream: 'SCIENCE' })}
                      className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100/70 hover:bg-blue-600 text-blue-800 hover:text-white transition-colors cursor-pointer flex items-center gap-1 shadow-2xs"
                      title="Pop out this department's HOD and teachers"
                    >
                      <span>B.Sc. FYUGP</span>
                      <span className="font-extrabold text-[9px] bg-black/10 px-1 rounded">Pop Out ↗</span>
                    </button>
                  </div>

                  {/* HOD Card with Profile Picture */}
                  <div className="p-3.5 rounded-xl bg-gradient-to-r from-gray-50 to-blue-50/20 border border-gray-200 mb-3.5 flex items-center gap-3.5 hover:shadow-2xs transition-shadow">
                    <div className="relative shrink-0">
                      {dept.hodImage ? (
                        <img
                          src={dept.hodImage}
                          alt={dept.hod}
                          className="w-14 h-14 rounded-full object-cover border-2 border-[#002147]/50 shadow-xs ring-2 ring-blue-500/20"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#002147] to-blue-900 text-white font-extrabold flex items-center justify-center text-sm shadow-xs border-2 border-white/20">
                          {getFacultyInitials(dept.hod)}
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1.5 mb-0.5">
                        <span className="text-[10px] font-extrabold text-[#002147] uppercase tracking-wider flex items-center gap-1">
                          <Award size={12} className="text-[#002147]" />
                          Head of Department
                        </span>
                        {dept.hodDesignation && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-100/70 text-blue-800 truncate max-w-[130px]">
                            {dept.hodDesignation}
                          </span>
                        )}
                      </div>
                      <div className="font-bold text-gray-900 text-sm mt-0.5 truncate">{dept.hod}</div>
                      <div className="text-xs text-gray-500 font-medium truncate">{dept.hodQual}</div>
                    </div>
                  </div>

                  {/* Other Faculty Members with Profile Pictures */}
                  {dept.faculty && dept.faculty.length > 0 && (
                    <div className="space-y-2 mt-2 pt-2 border-t border-gray-100">
                      <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                        Faculty Members ({dept.faculty.length})
                      </div>
                      <div className="space-y-1.5">
                        {dept.faculty.map((f, fi) => (
                          <div
                            key={fi}
                            className="flex items-center justify-between gap-2.5 text-xs py-1.5 px-2 rounded-lg hover:bg-gray-50/80 transition-colors border border-transparent hover:border-gray-200"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              {f.image_url ? (
                                <img
                                  src={f.image_url}
                                  alt={f.name}
                                  className="w-8 h-8 rounded-full object-cover border border-blue-600/30 shadow-2xs shrink-0 ring-1 ring-blue-500/20"
                                />
                              ) : (
                                <div className="w-8 h-8 rounded-full bg-slate-100 text-[#002147] border border-slate-200 flex items-center justify-center font-bold text-[11px] shrink-0">
                                  {getFacultyInitials(f.name)}
                                </div>
                              )}
                              <div className="min-w-0">
                                <span className="font-bold text-gray-800 block truncate">{f.name}</span>
                                {f.designation && (
                                  <span className="text-[10px] text-gray-400 block truncate">{f.designation}</span>
                                )}
                              </div>
                            </div>
                            <span className="text-gray-500 font-medium text-[11px] text-right shrink-0 max-w-[160px] truncate">
                              {f.qual}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Dedicated Page Button */}
                  <div className="pt-3 mt-3 border-t border-gray-100 flex items-center justify-between">
                    <button
                      onClick={() => {
                        const slug = dept.key || cleanDeptName(dept.dept).replace(/\s+/g, '-');
                        if (onNavigate) onNavigate(`department-${slug}`);
                      }}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 hover:text-[#002147] transition-colors cursor-pointer group/btn"
                    >
                      <span>Visit Department Page</span>
                      <ArrowRight size={13} className="group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                    <button
                      onClick={() => setPopOutDept({ ...dept, stream: 'SCIENCE' })}
                      className="text-[11px] text-gray-400 hover:text-gray-700 font-semibold cursor-pointer"
                    >
                      Quick Pop-Out
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Visiting Faculty */}
      {(activeStream === 'ALL' || activeStream === 'VISITING') && (
        <div className="card-interactive bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="border-b border-gray-100 pb-3">
            <h3 className="text-lg sm:text-xl font-extrabold text-[#002147]">Distinguished Visiting Faculty & Scholars</h3>
            <p className="text-xs text-gray-500 mt-0.5">Eminent professors and researchers contributing specialized academic modules.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#4a6b28] mb-3">Visiting Faculty (Arts)</h4>
              <div className="space-y-2.5">
                {visitingArts.map((v, i) => (
                  <div key={i} className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 flex items-center gap-3 text-xs">
                    {v.image_url ? (
                      <img src={v.image_url} alt={v.name} className="w-10 h-10 rounded-full object-cover border border-emerald-600/30 shrink-0" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-[#002147]/10 text-[#002147] font-bold text-xs flex items-center justify-center shrink-0 border border-gray-200">
                        {getFacultyInitials(v.name)}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-gray-900 text-sm truncate">{v.name}</div>
                      <div className="text-gray-600 mt-0.5 leading-snug">{v.qual}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#002147] mb-3">Visiting Faculty (Science)</h4>
              <div className="space-y-2.5">
                {visitingScience.map((v, i) => (
                  <div key={i} className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 flex items-center gap-3 text-xs">
                    {v.image_url ? (
                      <img src={v.image_url} alt={v.name} className="w-10 h-10 rounded-full object-cover border border-blue-600/30 shrink-0" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-[#002147]/10 text-[#002147] font-bold text-xs flex items-center justify-center shrink-0 border border-gray-200">
                        {getFacultyInitials(v.name)}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-gray-900 text-sm truncate">{v.name}</div>
                      <div className="text-gray-600 mt-0.5 leading-snug">{v.qual}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// 6. IQAC COMPONENT
function IQACSection() {
  const leadership = [
    { name: 'Dr. Zokho Venuh', role: 'Chairperson', desc: 'Principal, Capital College of Higher Education' },
    { name: 'Mrs. Opangmenla Jamir', role: 'Coordinator', desc: 'Associate Professor, Department of English' },
    { name: 'Mr. Vezuhu Keyho', role: 'Member', desc: 'Chairman, College Governing Body' }
  ];

  const artsFacultyMembers = [
    { name: 'Dr. Rukulu Kezo', desc: 'HOD, Dept. of English' },
    { name: 'Mrs. Tatongkala Lemtur', desc: 'Dean of Students' },
    { name: 'Mr. Temsüwapang Lkr', desc: 'HOD, Dept. of History' },
    { name: 'Mrs. Abeino Zashu', desc: 'Academic Dean' },
    { name: 'Mrs. Chubarenla', desc: 'HOD, Dept. of Pol. Science' },
    { name: 'Ms. Shedulu Kezo', desc: 'HOD, Dept. of Education' },
    { name: 'Mr. Theja Lohe', desc: 'HOD, Dept. of Tenyidie' },
    { name: 'Ms. Akanjungla Kichu', desc: 'HOD, Dept. of Economics' }
  ];

  const scienceFacultyMembers = [
    { name: 'Dr. P. Kadunlung', desc: 'HOD, Dept. of Botany' },
    { name: 'Ms. Nourhevinuo Kessiezie', desc: 'HOD, Dept. of Zoology' },
    { name: 'Mr. Pyonphamo Ezung', desc: 'HOD, Dept. of Chemistry' }
  ];

  const managementCommunity = [
    { name: 'Head Gaonbura', desc: 'Supply Colony, Kohima (Community Stakeholder)' },
    { name: 'Dr. Khrietuo Doulo', desc: 'Managing Director, CCHE' },
    { name: 'Mr. Kekhwengulo Lea', desc: 'Member, College Governing Body' },
    { name: 'President, Students Council', desc: 'Student Representative (Student Body)' }
  ];

  return (
    <div className="space-y-10 font-sans text-gray-800">
      {/* IQAC Mandate Banner */}
      <div className="rounded-2xl bg-gradient-to-br from-[#002147] to-[#173a2c] p-6 sm:p-8 text-white shadow-md border border-white/10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#4a6b28] text-white text-xs font-bold uppercase tracking-wider mb-3">
          <ShieldCheck size={13} />
          <span>Internal Quality Assurance System</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
          Internal Quality Assurance Cell (IQAC)
        </h2>
        <p className="text-sm sm:text-base text-gray-200 leading-relaxed max-w-3xl text-justify">
          Based on the recommendation of the Governing Body, the IQAC has been restructured and the following members are hereby appointed as members of the Internal Quality Assurance Cell (IQAC) of Capital College of Higher Education to benchmark institutional quality, promote academic research, and foster student excellence.
        </p>
      </div>

      {/* Leadership Trio */}
      <div>
        <h3 className="text-base font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
          <BadgeCheck size={16} className="text-[#4a6b28]" />
          <span>IQAC Executive Leadership</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {leadership.map((l, idx) => (
            <div
              key={idx}
              className="card-interactive card-accent-top bg-white rounded-2xl border-2 border-emerald-100 p-5 shadow-xs"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-[#002147] text-white">
                  {l.role}
                </span>
                <ShieldCheck size={16} className="text-[#4a6b28]" />
              </div>
              <h4 className="font-extrabold text-[#002147] text-base mt-2">{l.name}</h4>
              <p className="text-xs text-gray-600 mt-1">{l.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Categorized Member Panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Arts Faculty Representatives */}
        <div className="card-interactive bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h4 className="font-bold text-base text-[#002147]">Arts Department Heads & Deans</h4>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-[#4a6b28]">8 Members</span>
          </div>
          <div className="space-y-2.5">
            {artsFacultyMembers.map((m, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs p-2 rounded-lg bg-gray-50 border border-gray-100">
                <span className="font-bold text-gray-900">{m.name}</span>
                <span className="text-gray-500">{m.desc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Science Stream & Community Representatives */}
        <div className="space-y-6">
          <div className="card-interactive bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h4 className="font-bold text-base text-[#002147]">Science Department Heads</h4>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-[#002147]">3 Members</span>
            </div>
            <div className="space-y-2">
              {scienceFacultyMembers.map((m, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs p-2 rounded-lg bg-gray-50 border border-gray-100">
                  <span className="font-bold text-gray-900">{m.name}</span>
                  <span className="text-gray-500">{m.desc}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card-interactive bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h4 className="font-bold text-base text-[#002147]">Management, Community & Students</h4>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-50 text-purple-700">4 Members</span>
            </div>
            <div className="space-y-2">
              {managementCommunity.map((m, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs p-2 rounded-lg bg-gray-50 border border-gray-100">
                  <span className="font-bold text-gray-900">{m.name}</span>
                  <span className="text-gray-500">{m.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 7. RULES AND REGULATIONS COMPONENT
function RulesSection({ onNavigate }) {
  const ruleCategories = [
    {
      category: 'Class Schedule & Mandatory Attendance',
      icon: Clock,
      rules: [
        '1. Classes commence from 9:00 a.m till 3:15 p.m on all week days and working Saturdays. Every student shall attend classes regularly and punctually.',
        '2. 75 % attendance is mandatory as per university rules to be eligible for appearing Semester Examinations. Application for leave of absence on medical grounds should be supported by relevant documents.',
        '3. Proxy / impersonation of attendance is considered a serious offence.'
      ]
    },
    {
      category: 'Institutional Identity & Uniform Code',
      icon: Users,
      rules: [
        '4. Students are to compulsorily wear College uniform on those days reserved for wearing uniforms.',
        '5. Every student must carry his/her Identity Card to the College and produce it when asked for.'
      ]
    },
    {
      category: 'Classroom Decorum & Electronic Devices',
      icon: Eye,
      rules: [
        '6. Mobile phones and any gadgets are prohibited inside the classroom.',
        '9. Students are not allowed to bring guests/visitors to the class, library and Campus.'
      ]
    },
    {
      category: 'Academic Integrity & Examination Ethics',
      icon: BookOpen,
      rules: [
        '7. Cheating and any form of malpractice during examinations will be strictly dealt with.'
      ]
    },
    {
      category: 'Zero-Tolerance Safety, Anti-Ragging & Health',
      icon: ShieldAlert,
      rules: [
        '8. Consumption of drugs, alcohol, tobacco and intoxicants is prohibited within the Campus.',
        '10. Riots / Campaigning / demonstrations by students will not be tolerated within the College Campus.',
        '11. Any harassment in any form or degree on fellow students, juniors and especially female students will be treated as punishable offence under the Criminal Act.',
        '14. It shall be the bounden duty of every student to maintain cleanliness of the Campus and protect the College property from harm and damage.'
      ]
    },
    {
      category: 'Student Accountability, Grievances & Enforcement',
      icon: Scale,
      rules: [
        '12. Any grievances of any kind by the students are to be addressed to the Student’s Grievance Redressal Cell of the College.',
        '13. So long as a student is enrolled in the College, he/she shall be held accountable and responsible for his/her actions within and outside the Campus. The Principal will hold authority outside the Campus as well.',
        '15. Failure to comply with the College rules and regulations will invite fines, explanatory calls, debarment from appearing exams and expulsions from the College according to the nature and severity of the case.'
      ]
    }
  ];

  return (
    <div className="space-y-10 font-sans text-gray-800">
      {/* Rules Hero Ribbon */}
      <div className="rounded-2xl bg-gradient-to-br from-[#002147] to-[#241a1a] p-6 sm:p-8 text-white shadow-md border border-white/10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#4a6b28] text-white text-xs font-bold uppercase tracking-wider mb-3">
          <ShieldAlert size={13} />
          <span>Institutional Code of Conduct</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
          College Rules & Regulations
        </h2>
        <p className="text-sm sm:text-base text-gray-200 leading-relaxed max-w-3xl text-justify">
          All students enrolled at Capital College of Higher Education are subject to institutional disciplinary regulations and university statutes. Compliance ensures a peaceful, scholarly, and dignified academic environment.
        </p>
      </div>

      {/* 6 Thematic Rule Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {ruleCategories.map((cat, idx) => (
          <div
            key={idx}
            className="card-interactive card-accent-top bg-white rounded-2xl border border-gray-200 p-6 shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#4a6b28] border border-emerald-100 flex items-center justify-center font-bold">
                  <cat.icon size={20} />
                </div>
                <h4 className="font-extrabold text-base text-[#002147]">{cat.category}</h4>
              </div>
              <div className="space-y-3">
                {cat.rules.map((r, ri) => (
                  <p key={ri} className="text-xs sm:text-sm text-gray-700 leading-relaxed text-justify">
                    {r}
                  </p>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Enforcement & Grievance Quick Action */}
      <div className="rounded-2xl bg-gray-50 border border-gray-200 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="font-bold text-base text-[#002147]">Students’ Grievance Redressal Cell</h4>
          <p className="text-xs text-gray-600 mt-0.5">Submit appeals, academic concerns, or disciplinary inquiries directly to the cell in-charges.</p>
        </div>
        <button
          onClick={() => onNavigate && onNavigate('committees-and-in-charges')}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#002147] hover:bg-[#4a6b28] text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
        >
          <span>View Grievance Cell In-Charges</span>
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}

// 8. CRITERIA AND ELIGIBILITY COMPONENT
function CriteriaSection({ onNavigate, onOpenAdmission }) {
  return (
    <div className="space-y-10 font-sans text-gray-800">
      {/* Criteria Hero Ribbon */}
      <div className="rounded-2xl bg-gradient-to-br from-[#002147] via-[#09294a] to-[#1a382b] p-6 sm:p-8 text-white shadow-md border border-white/10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#4a6b28] text-white text-xs font-bold uppercase tracking-wider mb-3">
          <GraduationCap size={13} />
          <span>FYUGP Admission Eligibility</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
          Admission Criteria & Guidelines
        </h2>
        <p className="text-sm sm:text-base text-gray-200 leading-relaxed max-w-3xl text-justify">
          Based on the decision of Nagaland University to introduce the Four Years Under Graduate Programme (FYUGP) from 2023-2024 session onwards, admission is conducted strictly according to university statutory guidelines.
        </p>
      </div>

      {/* Official Guidelines Quotation */}
      <div className="card-interactive bg-white rounded-2xl border-l-4 border-l-[#4a6b28] border border-gray-200 p-6 sm:p-8 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-bold text-[#4a6b28] uppercase tracking-wider mb-2">
          <BookOpen size={14} />
          <span>Curriculum and Credit Framework Guidelines (Page 6)</span>
        </div>
        <p className="text-gray-800 text-sm sm:text-base italic leading-relaxed font-serif bg-emerald-50/50 p-4 rounded-xl border border-emerald-100">
          “Senior Secondary School Leaving Certificate or Higher Secondary (12th Grade) Certificate obtained after successful completion of Grade 12 or equivalent stage of education corresponding to level-4” as given in page 6(six) of the University Guidelines.
        </p>
      </div>

      {/* Stream Criteria Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Arts B.A. */}
        <div className="card-interactive card-accent-top bg-white rounded-2xl border border-gray-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-[#4a6b28] border border-emerald-200">
                Arts Stream (B.A.)
              </span>
              <BookOpen size={18} className="text-[#4a6b28]" />
            </div>
            <h4 className="text-xl font-extrabold text-[#002147] mb-2">Bachelor of Arts (FYUGP)</h4>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-4">
              Offered at Kohima Town campus below State Library, P.R. Hill. Open to 12th Standard graduates from Arts, Commerce, or Science streams.
            </p>
            <div className="space-y-2 text-xs text-gray-700">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={13} className="text-[#4a6b28]" />
                <span>Eligibility: 10+2 / HSSLC Pass in any recognized stream</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={13} className="text-[#4a6b28]" />
                <span>Available Majors: 7 Academic Disciplines</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={13} className="text-[#4a6b28]" />
                <span>Minors: Multidisciplinary combinations under NU guidelines</span>
              </div>
            </div>
          </div>
        </div>

        {/* Science B.Sc. */}
        <div className="card-interactive card-accent-top bg-white rounded-2xl border border-gray-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-50 text-[#002147] border border-blue-200">
                Science Stream (B.Sc.)
              </span>
              <FlaskConical size={18} className="text-[#002147]" />
            </div>
            <h4 className="text-xl font-extrabold text-[#002147] mb-2">Bachelor of Science (FYUGP)</h4>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-4">
              Offered at permanent Science Block, Thegaba, Phezhu, Jotsoma. Dedicated lab infrastructure for practical and computational science.
            </p>
            <div className="space-y-2 text-xs text-gray-700">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={13} className="text-[#002147]" />
                <span>Eligibility: 10+2 / HSSLC Science with relevant subject background</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={13} className="text-[#002147]" />
                <span>Available Majors: Botany, Chemistry, Mathematics, Physics, Zoology</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={13} className="text-[#002147]" />
                <span>Hands-on Laboratory practicals and field research training</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mandatory Enclosures Checklist */}
      <div className="card-interactive bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-xs">
        <h4 className="font-bold text-base sm:text-lg text-[#002147] mb-3">Mandatory Enclosures for Admission</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
          {[
            'Photocopy of Class 10 Admit Card & Marksheet',
            'Photocopy of Class 12 Admit Card & Marksheet',
            'Class 12 Pass Certificate / Provisional Certificate',
            'Original Migration Certificate (for Non-NBSE boards)',
            'Recent Passport Size Photographs (3 copies)',
            'ST / SC / OBC / Indigenous Certificate (if applicable)'
          ].map((item, idx) => (
            <div key={idx} className="p-3 rounded-lg bg-gray-50 border border-gray-200 flex items-start gap-2">
              <CheckCircle size={14} className="text-[#4a6b28] shrink-0 mt-0.5" />
              <span className="text-gray-700 font-medium">{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Official Actions */}
      <div className="rounded-2xl bg-gradient-to-r from-gray-50 via-emerald-50/50 to-gray-50 border border-gray-200 p-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h4 className="font-bold text-base text-[#002147]">Download Official Application Documents</h4>
          <p className="text-xs text-gray-600 mt-0.5">Official print form for offline submission or review institutional prospectus.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <a
            href="https://capitalcollege.edu.in/wp-content/uploads/2024/04/CCHE-Prospectus-2024-05.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#002147] hover:bg-[#001736] text-white px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors shadow-xs"
          >
            <Download size={14} />
            <span>Prospectus (PDF)</span>
          </a>
          <a
            href="/admission_form.pdf"
            download="admission_form.pdf"
            className="inline-flex items-center gap-2 bg-[#4a6b28] hover:bg-[#3d5920] text-white px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors shadow-xs"
          >
            <Download size={14} />
            <span>Admission Form (PDF)</span>
          </a>
        </div>
      </div>
    </div>
  );
}

// 9. MOUS AND COLLABORATIONS COMPONENT
function MoUsSection() {
  const mous = [
    {
      title: 'MOU with CIS (Centre for Integrated Counseling Services)',
      tag: 'Counseling & Mental Wellness',
      pdf: 'https://capitalcollege.edu.in/wp-content/uploads/2023/05/MOU-with-CIS-2.pdf',
      img: 'https://capitalcollege.edu.in/wp-content/uploads/2023/05/MOU-with-CIS-1-300x300.jpg',
      desc: 'Collaborative partnership providing regular mental health guidance, psycho-social counseling, and individual student mentoring.'
    },
    {
      title: 'MoU With CUE Academy',
      tag: 'Skill Acquisition & Professional Mentorship',
      img: 'https://capitalcollege.edu.in/wp-content/uploads/2024/08/aa-1024x1024.jpg',
      desc: 'Skill development programs, student aptitude testing, and workplace readiness training.'
    },
    {
      title: 'MoU With Bethesda Hospital',
      tag: 'Healthcare & Emergency Care',
      img: 'https://capitalcollege.edu.in/wp-content/uploads/2024/08/Bethesda-Hospital-001-1024x1024.jpg',
      desc: 'Medical emergency care agreement, student first aid workshops, and seasonal health screenings.'
    }
  ];

  const coachingPartners = [
    { name: 'Centre for Integrated Counseling Services Kohima', type: 'Counseling & Psychosocial Support' },
    { name: 'Prepschool for Civil Services Guwahati', type: 'Civil Services Mentorship & Test Prep' },
    { name: 'Mahendra Educational Private Limited, Kohima Branch', type: 'Banking & Staff Selection Coaching' },
    { name: 'Imperial IAS Academy, Kohima', type: 'UPSC & NPSC Examination Guidance' },
    { name: 'Peace Channel (NEISSR) Dimapur', type: 'Peace Building & Conflict Resolution Workshops' }
  ];

  return (
    <div className="space-y-10 font-sans text-gray-800">
      {/* MoU Hero Ribbon */}
      <div className="rounded-2xl bg-gradient-to-br from-[#002147] via-[#09294a] to-[#12362b] p-6 sm:p-8 text-white shadow-md border border-white/10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#4a6b28] text-white text-xs font-bold uppercase tracking-wider mb-3">
          <HeartHandshake size={13} />
          <span>Strategic Collaborations</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
          Memorandums of Understanding (MoU’s)
        </h2>
        <p className="text-sm sm:text-base text-gray-200 leading-relaxed max-w-3xl text-justify">
          The college does not only aim to execute the course curriculum but also considers it vital to nurture and develop the personality and character of the learners as well and to help them find their place in the community.
        </p>
      </div>

      {/* Official Signed MoU Showcase */}
      <div className="space-y-6">
        <h3 className="text-base font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
          <FileText size={16} className="text-[#4a6b28]" />
          <span>Official Signed Memorandums & Documentation</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {mous.map((mou, idx) => (
            <div
              key={idx}
              className="card-interactive card-accent-top bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="relative h-56 bg-gray-100 overflow-hidden">
                  <img
                    src={mou.img}
                    alt={mou.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>

                <div className="p-5">
                  <h4 className="font-bold text-[#002147] text-base mb-1.5">{mou.title}</h4>
                  <p className="text-xs text-gray-600 leading-relaxed">{mou.desc}</p>
                </div>
              </div>

              {mou.pdf && (
                <div className="p-5 pt-0">
                  <a
                    href={mou.pdf}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-1.5 bg-[#002147] hover:bg-[#4a6b28] text-white py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors"
                  >
                    <Download size={13} />
                    <span>Download MoU (PDF)</span>
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Career Coaching & Counseling Partners */}
      <div className="card-interactive bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-xs">
        <h4 className="font-bold text-base sm:text-lg text-[#002147] mb-2">Institutional Partnerships & Guidance Alliances</h4>
        <p className="text-xs sm:text-sm text-gray-600 mb-4">
          In order to instill in the students competitive spirit and help them gain better confidence and professionalism, the college engages with premier institutions:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {coachingPartners.map((item, idx) => (
            <div key={idx} className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 flex items-start gap-2.5">
              <CheckCircle2 size={16} className="text-[#4a6b28] shrink-0 mt-0.5" />
              <div>
                <strong className="text-gray-900 block">{item.name}</strong>
                <span className="text-gray-500">{item.type}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// 10. SCHOLARSHIPS COMPONENT
function ScholarshipsSection() {
  const schemes = [
    {
      title: 'State Post-Matric Scholarship (Nagaland)',
      authority: 'Department of Higher Education, Kohima, Govt. of Nagaland',
      desc: 'Administered for Scheduled Tribe undergraduate students of Nagaland. Provides annual maintenance allowance and fee assistance.',
      link: 'https://scholarship.nagaland.gov.in/',
      buttonText: 'State Scholarship Portal',
      badge: 'State Government'
    },
    {
      title: 'National Scholarship Portal (NSP)',
      authority: 'Ministry of Education & Central Government',
      desc: 'Centrally sponsored schemes including the prestigious Ishan Uday Special Scholarship Scheme for North Eastern Region (NER) college students.',
      link: 'https://scholarships.gov.in/',
      buttonText: 'National Scholarship Portal',
      badge: 'Central Government'
    },
    {
      title: 'CCHE Scheme for Economically Weak Students',
      authority: 'Capital College Institutional Trust Fund',
      desc: 'College welfare quota offering financial fee waivers, installment relief, and book bank support for deserving students facing financial constraints.',
      badge: 'Institutional Quota'
    }
  ];

  return (
    <div className="space-y-10 font-sans text-gray-800">
      {/* Scholarship Hero Ribbon */}
      <div className="rounded-2xl bg-gradient-to-br from-[#002147] to-[#1e3a2b] p-6 sm:p-8 text-white shadow-md border border-white/10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#4a6b28] text-white text-xs font-bold uppercase tracking-wider mb-3">
          <Award size={13} />
          <span>Financial Aid & Welfare</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
          Scholarship Schemes & Financial Assistance
        </h2>
        <p className="text-sm sm:text-base text-gray-200 leading-relaxed max-w-3xl text-justify">
          Capital College of Higher Education actively facilitates state, central, and institutional scholarship schemes to ensure that deserving students achieve their academic aspirations without financial hindrance.
        </p>
      </div>

      {/* 3 Scheme Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {schemes.map((scheme, idx) => (
          <div
            key={idx}
            className="card-interactive card-accent-top bg-white rounded-2xl border border-gray-200 p-6 shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-[#4a6b28] border border-emerald-200">
                  {scheme.badge}
                </span>
                <Award size={16} className="text-[#4a6b28]" />
              </div>
              <h4 className="font-extrabold text-base sm:text-lg text-[#002147] mb-1">{scheme.title}</h4>
              <p className="text-xs font-bold text-gray-500 mb-2">{scheme.authority}</p>
              <p className="text-xs text-gray-600 leading-relaxed">{scheme.desc}</p>
            </div>

            {scheme.link && (
              <div className="pt-4 mt-4 border-t border-gray-100">
                <a
                  href={scheme.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-1.5 bg-[#002147] hover:bg-[#4a6b28] text-white py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors"
                >
                  <span>{scheme.buttonText}</span>
                  <ExternalLink size={13} />
                </a>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// 11. PRINCIPAL MESSAGE COMPONENT
function PrincipalMessageSection({ onNavigate, onOpenAdmission }) {
  const defaultData = {
    badge: 'Office of the Principal',
    headerTitle: 'Principal’s Welcome Message',
    headerSubtitle: 'Official Institutional Address • Capital College of Higher Education, Kohima',
    name: 'Dr. Zokho Venuh',
    designation: 'Principal, Capital College of Higher Education',
    qualification: 'M.A., M.Phil., Ph.D. in History (Nagaland University)',
    imageUrl: 'https://capitalcollege.edu.in/wp-content/uploads/2024/06/IMG20240604134403.jpg',
    quoteBadge: 'Verbatim Official Message',
    message: 'The Capital College of Higher Education formally known As Nation Academy of Higher Education was established in 2004 on 20th August. The College initially began with 5 regular students and gradually increased year after year because of the constant effort rendered by the faculty to achieve the goal of the college, keeping in mind to help and give opportunities to all the Students.',
    signoffName: '— Dr. Zokho Venuh',
    signoffRole: 'Principal, CCHE Kohima',
    highlight1Title: 'Founded August 20, 2004',
    highlight1Desc: 'Over two decades of dedicated higher learning in the state capital.',
    highlight2Title: 'Opportunity for Every Student',
    highlight2Desc: 'Inclusive education, personalized mentorship, and quality instruction.'
  };

  const [principal, setPrincipal] = useState(() => {
    try {
      const saved = localStorage.getItem('cche_principal_settings');
      return saved ? { ...defaultData, ...JSON.parse(saved) } : defaultData;
    } catch {
      return defaultData;
    }
  });

  const loadSettings = () => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success && data.settings) {
          const s = data.settings;
          setPrincipal((prev) => ({
            ...prev,
            badge: s.principal_badge || prev.badge,
            headerTitle: s.principal_header_title || prev.headerTitle,
            headerSubtitle: s.principal_header_subtitle || prev.headerSubtitle,
            name: s.principal_name || prev.name,
            designation: s.principal_designation || prev.designation,
            qualification: s.principal_qualification !== undefined ? s.principal_qualification : prev.qualification,
            imageUrl: s.principal_image_url || prev.imageUrl,
            quoteBadge: s.principal_quote_badge || prev.quoteBadge,
            message: s.principal_message || prev.message,
            signoffName: s.principal_signoff_name || prev.signoffName,
            signoffRole: s.principal_signoff_role || prev.signoffRole,
            highlight1Title: s.principal_highlight1_title || prev.highlight1Title,
            highlight1Desc: s.principal_highlight1_desc || prev.highlight1Desc,
            highlight2Title: s.principal_highlight2_title || prev.highlight2Title,
            highlight2Desc: s.principal_highlight2_desc || prev.highlight2Desc,
          }));
        }
      })
      .catch((err) => {
        console.warn('Could not load principal settings from API:', err);
      });
  };

  useEffect(() => {
    loadSettings();
    const handleUpdate = (e) => {
      if (e && e.detail) {
        setPrincipal((prev) => ({ ...prev, ...e.detail }));
      } else {
        loadSettings();
      }
    };
    window.addEventListener('principal-settings-updated', handleUpdate);
    return () => window.removeEventListener('principal-settings-updated', handleUpdate);
  }, []);

  return (
    <div className="space-y-10 font-sans text-gray-800">
      {/* Editorial Header */}
      <div className="rounded-2xl bg-gradient-to-br from-[#002147] to-[#17382b] p-6 sm:p-8 text-white shadow-md border border-white/10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#4a6b28] text-white text-xs font-bold uppercase tracking-wider mb-3">
          <BookOpen size={13} />
          <span>{principal.badge}</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
          {principal.headerTitle}
        </h2>
        <p className="text-sm sm:text-base text-gray-200">
          {principal.headerSubtitle}
        </p>
      </div>

      {/* Main Editorial Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Left Column: Dignified Portrait */}
        <div className="md:col-span-5 card-interactive bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs p-3">
          <div className="rounded-xl overflow-hidden aspect-square bg-gray-100">
            <img
              src={principal.imageUrl || "https://capitalcollege.edu.in/wp-content/uploads/2024/06/IMG20240604134403.jpg"}
              alt={`Principal ${principal.name}`}
              className="w-full h-full object-cover object-top"
              onError={(e) => {
                e.target.src = "https://capitalcollege.edu.in/wp-content/uploads/2024/06/IMG20240604134403.jpg";
              }}
            />
          </div>
          <div className="p-4 text-center">
            <h3 className="font-extrabold text-lg text-[#002147]">{principal.name}</h3>
            <p className="text-xs font-bold text-[#4a6b28] uppercase tracking-wider mt-0.5">
              {principal.designation}
            </p>
            {principal.qualification && (
              <p className="text-xs text-gray-500 mt-1">{principal.qualification}</p>
            )}
          </div>
        </div>

        {/* Right Column: Verbatim Speech & Highlights */}
        <div className="md:col-span-7 space-y-6">
          <div className="card-interactive bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-xs space-y-4">
            <div className="text-xs font-bold text-[#4a6b28] uppercase tracking-wider flex items-center gap-1.5">
              <Scroll size={14} />
              <span>{principal.quoteBadge}</span>
            </div>

            <p className="text-gray-800 text-base sm:text-lg leading-relaxed text-justify font-serif italic border-l-4 border-l-[#4a6b28] pl-4 py-1 whitespace-pre-line">
              “{principal.message ? principal.message.replace(/^[“"]|[”"]$/g, '') : ''}”
            </p>

            <div className="pt-2 text-right">
              <span className="font-bold text-gray-900 block">{principal.signoffName}</span>
              <span className="text-xs text-gray-500">{principal.signoffRole}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
              <strong className="text-[#002147] block mb-1">{principal.highlight1Title}</strong>
              <p className="text-gray-600">{principal.highlight1Desc}</p>
            </div>
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
              <strong className="text-[#002147] block mb-1">{principal.highlight2Title}</strong>
              <p className="text-gray-600">{principal.highlight2Desc}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 12. CAMPUS LIBRARIES & FACILITIES (ARTS BLOCK & SCIENCE SECTION)
function CampusBlockSection({ type }) {
  const isScience = type === 'science';

  return (
    <div className="space-y-8 font-sans text-gray-800">
      <div className="rounded-2xl bg-gradient-to-br from-[#002147] to-[#12362b] p-6 sm:p-8 text-white shadow-md border border-white/10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#4a6b28] text-white text-xs font-bold uppercase tracking-wider mb-3">
          <Building2 size={13} />
          <span>{isScience ? 'Science Stream Campus' : 'Arts Stream Campus'}</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
          {isScience ? 'Thegaba, Phezhu Campus (Science Stream)' : 'Kohima Town Campus (Arts Stream)'}
        </h2>
        <p className="text-sm sm:text-base text-gray-200">
          {isScience
            ? 'Permanent Campus housing Bachelor of Science (B.Sc.) programmes and specialized scientific research laboratories.'
            : 'City Campus housing Bachelor of Arts (B.A.) programmes, Central Library, Girls Hostel, and administrative offices.'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        <div className="md:col-span-7 card-interactive bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs">
          <img
            src={isScience
              ? 'https://capitalcollege.edu.in/wp-content/uploads/2023/05/Science-Block-1-scaled.jpg'
              : 'https://capitalcollege.edu.in/wp-content/uploads/2023/05/Arts-Block-and-Girls-Hostel-scaled.jpg'}
            alt={isScience ? 'Permanent Campus Science Block' : 'Arts Block in P.R. Hill'}
            className="w-full h-auto max-h-[420px] object-cover"
          />
        </div>

        <div className="md:col-span-5 space-y-4">
          <div className="card-interactive bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-3">
            <h4 className="font-bold text-[#002147] text-base">Campus Overview & Access</h4>
            <p className="text-xs sm:text-sm text-gray-700 leading-relaxed text-justify">
              {isScience
                ? 'The Science Section library is located at the permanent campus in Thegaba, Phezhu, Jotsoma. It provides specialized lab manuals, scientific journals, biological encyclopedias, and digital catalogues in Botany, Chemistry, Physics, and Zoology.'
                : 'The Arts Stream Library is located at the main Kohima campus below the State Library at P.R. Hill. It houses thousands of curriculum volumes, reference encyclopedias, national journals, periodicals, and indigenous Naga history resources.'}
            </p>
            <div className="pt-3 border-t border-gray-100 text-xs text-gray-600 space-y-1">
              <div><strong>Location:</strong> {isScience ? 'Thegaba, Phezhu, Jotsoma (Kohima)' : 'Below State Library, near PHQ Junction, P.R. Hill'}</div>
              <div><strong>College Timings:</strong> 9:00 am to 3:30 pm (Monday through Saturday)</div>
              <div><strong>Access:</strong> Valid CCHE student ID card required.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 13. STUDENTS' COUNCIL & EVANGELICAL UNION (EU) COMPONENT
function StudentCouncilAndEUSection({ onNavigate }) {
  const [activeTab, setActiveTab] = useState('ALL'); // 'ALL' | 'COUNCIL' | 'EU' | 'CELLS'

  const councilEvents = [
    {
      title: 'Trifecta Festival (Annual Collegiate Fest)',
      tag: 'Flagship Event',
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
      desc: 'The college’s signature multi-disciplinary festival featuring literary debates, extempore speech, cultural dance and indigenous attire showcases, vocal and acoustic music competitions, and fine arts exhibitions across departments.',
      period: 'Annual Event (Autumn Semester)'
    },
    {
      title: "Freshers' Day Celebration",
      tag: 'Welcoming Tradition',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      desc: 'Formal institutional reception organized by the student council to warmly induct incoming 1st-Semester B.A. and B.Sc. students into the collegiate community, featuring the Mr. & Miss Fresher pageant, musical showcases, and cultural talent displays.',
      period: 'Commencement of Academic Session'
    },
    {
      title: 'Annual Sports & Athletics Meet',
      tag: 'Collegiate Athletics',
      badgeColor: 'bg-blue-100 text-blue-800 border-blue-300',
      desc: 'Exciting week-long inter-house sports meet encompassing track and field events, football, basketball, volleyball, badminton, arm wrestling, and traditional Naga indigenous games.',
      period: 'Annual (Winter / Spring)'
    },
    {
      title: 'Parting Social & Valedictory Farewell',
      tag: 'Graduation Tradition',
      badgeColor: 'bg-purple-100 text-purple-800 border-purple-300',
      desc: 'Solemn convocation and valediction ceremony honoring graduating 6th-Semester students, featuring speech tributes, academic awards conferral, memory albums, and inspirational farewell exhortations.',
      period: 'End of 6th Semester'
    },
    {
      title: 'Swachh Campus & Social Work Drives',
      tag: 'Civic Responsibility',
      badgeColor: 'bg-teal-100 text-teal-800 border-teal-300',
      desc: 'Collaborative cleanliness, environmental beautification, and sapling plantation drives conducted across both Kohima Town and Thegaba Science campuses.',
      period: 'Monthly & National Observances'
    }
  ];

  const euActivities = [
    {
      title: 'Weekend Fellowship Services',
      tag: 'Spiritual Life',
      badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-300',
      desc: 'Regular weekend chapel services and fellowship assemblies conducted on campus featuring inspiring messages, student worship, personal testimonies, and moral reflection.',
      schedule: 'Regular Weekend Gatherings'
    },
    {
      title: 'Bible Study & Discipleship Circles',
      tag: 'Character Formation',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      desc: 'Small-group interactive study circles addressing student challenges, ethical living, moral character, peer support, and Christian discipleship.',
      schedule: 'Mid-week Sessions'
    },
    {
      title: 'Annual EU Camp & Spiritual Retreat',
      tag: 'Signature Camp',
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
      desc: 'Off-campus spiritual retreat camp bringing students together for multi-day leadership workshops, inspirational speaker sessions, praise nights, and character formation.',
      schedule: 'Annual Institutional Calendar'
    },
    {
      title: 'Choral & Music Ministry',
      tag: 'Praise & Worship',
      badgeColor: 'bg-rose-100 text-rose-800 border-rose-300',
      desc: 'Talented student musicians and vocalists leading acoustic praise, choral anthems, and special presentations during college ceremonies, festivals, and Christmas celebrations.',
      schedule: 'Weekly & College Functions'
    },
    {
      title: 'Community Outreach & Charity Visits',
      tag: 'Social Service',
      badgeColor: 'bg-teal-100 text-teal-800 border-teal-300',
      desc: 'Compassionate outreach initiatives visiting local orphanages, healthcare institutions, and elderly care homes in Kohima, sharing resources and practical love.',
      schedule: 'Semester Observances'
    }
  ];

  const studentCells = [
    {
      title: "Student's Guidance & Mentoring Cell",
      inCharge: 'Niekhoto, Akanjungla, Wanshimongla, Dr. Rukulu',
      desc: 'Provides confidential academic, psychological, and career mentoring for all enrolled students.',
      category: 'Mentorship',
      icon: UserCheck
    },
    {
      title: "Students' Grievance Redressal Cell",
      inCharge: 'Akanjungla, Shedulu, Niekhoto',
      desc: 'Provides a secure, prompt channel for resolving any student grievances, academic difficulties, or facility issues.',
      category: 'Welfare',
      icon: Scale
    },
    {
      title: 'Anti-Ragging Committee & Squad',
      inCharge: 'Kevivono, Kumuni',
      desc: 'Enforces strict UGC zero-tolerance anti-ragging policies, maintaining a 100% harassment-free, safe campus environment.',
      category: 'Campus Safety',
      icon: ShieldAlert
    },
    {
      title: 'Eco Club',
      inCharge: 'Temsuwapang, Theja',
      desc: 'Promotes botanical preservation, zero-waste initiatives, tree plantation, and ecological cleanliness on campus.',
      category: 'Campus Club',
      icon: Leaf
    },
    {
      title: 'Art, Photography & Music Club',
      inCharge: 'Vizoboto, Khrielakuo, Theja, Wanshimongla, Dr. Rukulu',
      desc: 'Nurtures creative expression, acoustic musicianship, visual arts, and photography documentation of campus memories.',
      category: 'Campus Club',
      icon: Music
    },
    {
      title: 'Drama & Literary Club',
      inCharge: 'English Department',
      desc: 'Fosters theatrical arts, poetry recitations, stage productions, public speaking, and debate competitions.',
      category: 'Campus Club',
      icon: Feather
    },
    {
      title: 'National Service Scheme (NSS) / Red Ribbon Club (RRC)',
      inCharge: 'Temsuwapang, Theja, Vizoboto',
      desc: 'Active youth service wing organizing community blood donation camps, health awareness drives, and rural service camps.',
      category: 'National Service',
      icon: Flag
    },
    {
      title: "Students' Welfare Scheme (CCHE Quota)",
      inCharge: 'Kevivono, Meyiepeo',
      desc: 'Institutional financial aid scheme providing tuition assistance for economically weak, meritorious 6th-semester students.',
      category: 'Financial Aid',
      icon: HeartHandshake
    }
  ];

  return (
    <div className="space-y-10 font-sans text-gray-800">
      {/* 1. Institutional Hero Banner */}
      <div className="rounded-2xl bg-gradient-to-br from-[#002147] via-[#002d5f] to-[#1e3e26] p-6 sm:p-8 md:p-10 text-white shadow-lg border border-white/10 relative overflow-hidden">
        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#4a6b28] text-white text-xs font-bold uppercase tracking-wider shadow-xs">
              <Users size={13} />
              <span>Student Services &amp; Campus Life</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-emerald-200 text-xs font-semibold backdrop-blur-xs">
              <HeartHandshake size={13} />
              <span>Office of the Dean of Students Oversight</span>
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-wide uppercase leading-tight drop-shadow-sm">
            Students' Council &amp; Evangelical Union (EU)
          </h2>

          <p className="text-sm sm:text-base text-slate-200 leading-relaxed max-w-3xl">
            At Capital College of Higher Education, student life flourishes through vibrant democratic representation, character formation, and spiritual fellowship. The <strong>Students' Council</strong> coordinates student self-governance and collegiate festivals, while the <strong>Evangelical Union (EU)</strong> nurtures spiritual resilience and moral leadership.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3 text-xs text-slate-300">
            <div className="flex items-center gap-1.5 bg-black/25 px-3 py-1.5 rounded-lg border border-white/10">
              <span className="text-[#8fc35e] font-bold">Dean of Students:</span>
              <span>Mrs. Tatongkala Lemtur</span>
            </div>
            <div className="flex items-center gap-1.5 bg-black/25 px-3 py-1.5 rounded-lg border border-white/10">
              <span className="text-[#8fc35e] font-bold">EU Staff Advisers:</span>
              <span>Mr. Vevohu Kezo &amp; Mr. Theja Lohe</span>
            </div>
          </div>
        </div>

        {/* Decorative background accent */}
        <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-[#4a6b28]/20 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* 2. Interactive Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-100 rounded-xl border border-slate-200">
        {[
          { key: 'ALL', label: 'All Student Bodies & Cells', count: 'Overview' },
          { key: 'COUNCIL', label: "Students' Council (CCHESU)", count: '5 Key Traditions' },
          { key: 'EU', label: 'Evangelical Union (EU)', count: 'Fellowship & Outreach' },
          { key: 'CELLS', label: 'Guidance Cells & Campus Clubs', count: '8 Bodies' }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2.5 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === tab.key
                ? 'bg-[#002147] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                activeTab === tab.key
                  ? 'bg-white/20 text-white'
                  : 'bg-slate-200 text-slate-600'
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* 3. Section: Students' Council (CCHESU) */}
      {(activeTab === 'ALL' || activeTab === 'COUNCIL') && (
        <div className="card-interactive bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#002147] border border-blue-200 flex items-center justify-center font-bold text-lg shrink-0">
                <Users size={24} />
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#4a6b28] block">
                  Statutory Student Body
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-[#002147]">
                  The Students' Council (CCHESU)
                </h3>
              </div>
            </div>

            <button
              onClick={() => onNavigate && onNavigate('events')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#002147] hover:text-[#4a6b28] bg-slate-50 hover:bg-slate-100 px-3.5 py-2 rounded-lg border border-slate-200 transition-colors cursor-pointer"
            >
              <Calendar size={13} />
              <span>View Campus Events Calendar</span>
              <ChevronRight size={14} />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-7 space-y-4 text-xs sm:text-sm text-gray-700 leading-relaxed text-justify">
              <p>
                The <strong>Students' Council</strong> (functioning alongside the Capital College of Higher Education Students' Union - CCHESU) serves as the primary authorized representative body for all enrolled undergraduate students across the Arts and Science streams.
              </p>
              <p>
                Operating under the direct guidance of the <strong>Office of the Dean of Students</strong>, the Council acts as a democratic bridge between the student community, the faculty departments, and the college executive administration. It actively ensures student rights, addresses campus welfare needs, and maintains collegiate harmony.
              </p>

              <div className="p-4 rounded-xl bg-gradient-to-r from-slate-50 to-emerald-50/40 border border-slate-200 space-y-2">
                <h4 className="font-extrabold text-[#002147] text-xs uppercase tracking-wider flex items-center gap-2">
                  <ShieldCheck size={15} className="text-[#4a6b28]" />
                  <span>Core Mandates &amp; Responsibilities</span>
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={13} className="text-[#4a6b28] shrink-0 mt-0.5" />
                    <span>Organizing premier institutional festivals, academic seminars, and cultural meets.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={13} className="text-[#4a6b28] shrink-0 mt-0.5" />
                    <span>Serving as a collaborative forum for student representation before the IQAC and Academic Dean.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={13} className="text-[#4a6b28] shrink-0 mt-0.5" />
                    <span>Coordinating student participation in inter-college sports, debates, and youth festivals across Nagaland.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={13} className="text-[#4a6b28] shrink-0 mt-0.5" />
                    <span>Upholding campus discipline, mutual respect, and student adherence to college regulations.</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Council Structure Card */}
            <div className="lg:col-span-5 p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3.5">
              <h4 className="font-bold text-[#002147] text-sm flex items-center gap-2">
                <BadgeCheck size={16} className="text-[#002147]" />
                <span>Executive Council Composition</span>
              </h4>
              <div className="space-y-2 text-xs">
                {[
                  { role: 'President & Vice President', desc: 'Apex student leadership coordinating all portfolios' },
                  { role: 'General Secretary & Joint Secretary', desc: 'Administrative documentation, records & institutional liaisons' },
                  { role: 'Cultural Secretary', desc: 'Coordination of literary, music, dance & cultural fests' },
                  { role: 'Games & Sports Secretary', desc: 'Annual sports meet, indoor/outdoor tournaments & athletics' },
                  { role: 'Information & Magazine Secretary', desc: 'Publishing college bulletins, newsletters & media outreach' },
                  { role: 'Class Representatives (CRs)', desc: '2 elected/selected CRs from each semester across Arts & Science' }
                ].map((item, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-white border border-slate-200/90 shadow-2xs">
                    <strong className="text-[#002147] block font-bold">{item.role}</strong>
                    <span className="text-gray-500 text-[11px]">{item.desc}</span>
                  </div>
                ))}
              </div>

              <div className="pt-2 text-[11px] text-gray-500 border-t border-slate-200 flex items-center gap-1.5">
                <Clock size={12} className="text-[#4a6b28]" />
                <span>Eligibility: Minimum 75% attendance and clean conduct record.</span>
              </div>
            </div>
          </div>

          {/* Signature Annual Events Grid */}
          <div className="space-y-3 pt-2">
            <h4 className="font-bold text-[#002147] text-sm uppercase tracking-wider flex items-center gap-2">
              <Trophy size={16} className="text-[#4a6b28]" />
              <span>Signature Annual Events Organized by the Students' Council</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {councilEvents.map((evt, i) => (
                <div key={i} className="p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-[#4a6b28] transition-all flex flex-col justify-between gap-3 shadow-2xs">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${evt.badgeColor}`}>
                        {evt.tag}
                      </span>
                      <span className="text-[10.5px] text-gray-400 font-mono">{evt.period}</span>
                    </div>
                    <h5 className="font-bold text-gray-900 text-sm mb-1.5">{evt.title}</h5>
                    <p className="text-xs text-gray-600 leading-relaxed text-justify">{evt.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 4. Section: Evangelical Union (EU) */}
      {(activeTab === 'ALL' || activeTab === 'EU') && (
        <div className="card-interactive bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#4a6b28] border border-emerald-200 flex items-center justify-center font-bold text-lg shrink-0">
                <HeartHandshake size={24} />
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#4a6b28] block">
                  UESI Affiliated Student Movement
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-[#002147]">
                  The Evangelical Union (EU)
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500 bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-lg">
                Affiliated: Union of Evangelical Students of India (UESI)
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-7 space-y-4 text-xs sm:text-sm text-gray-700 leading-relaxed text-justify">
              <p>
                The <strong>Evangelical Union (EU)</strong> is an active, vibrant student body dedicated to fostering the spiritual, moral, and personal growth of students at Capital College of Higher Education, Kohima.
              </p>
              <p>
                Affiliated with the <strong>Union of Evangelical Students of India (UESI / Nagaland EU)</strong>, the EU operates with the vision of nurturing students with sound moral values, integrity, and visionary Christian character. Through regular weekend services and devotional activities, students find spiritual renewal, peer encouragement, and purposeful mentorship.
              </p>

              <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-2">
                <h4 className="font-extrabold text-[#002147] text-xs uppercase tracking-wider flex items-center gap-2">
                  <Sparkles size={15} className="text-[#4a6b28]" />
                  <span>Key Aims &amp; Spiritual Objectives</span>
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={13} className="text-[#4a6b28] shrink-0 mt-0.5" />
                    <span>Providing a welcoming platform for regular fellowship, joint worship, and moral character formation.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={13} className="text-[#4a6b28] shrink-0 mt-0.5" />
                    <span>Encouraging biblical literacy, thoughtful ethical reasoning, and positive peer influence.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={13} className="text-[#4a6b28] shrink-0 mt-0.5" />
                    <span>Nurturing future leadership through annual spiritual retreat camps and discipleship seminars.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={13} className="text-[#4a6b28] shrink-0 mt-0.5" />
                    <span>Extending compassionate social action to marginalized communities, orphanages, and elders in Kohima.</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Faculty Advisers Card */}
            <div className="lg:col-span-5 p-5 bg-gradient-to-br from-slate-50 to-emerald-50/30 rounded-2xl border border-emerald-200 space-y-3.5">
              <h4 className="font-bold text-[#002147] text-sm flex items-center gap-2">
                <UserCheck size={16} className="text-[#4a6b28]" />
                <span>EU Faculty Mentors &amp; Advisers</span>
              </h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                Dedicated faculty members provide pastoral guidance, mentorship, and supervision to student leaders under the Office of the Dean of Students.
              </p>

              <div className="space-y-2.5">
                <div className="p-3 rounded-xl bg-white border border-emerald-200/90 shadow-2xs flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-emerald-100 text-[#4a6b28] font-bold flex items-center justify-center shrink-0 text-xs">
                    VK
                  </div>
                  <div>
                    <h5 className="font-bold text-gray-900 text-xs sm:text-sm">Mr. Vevohu Kezo</h5>
                    <p className="text-gray-500 text-[11px]">Faculty In-Charge • Convener, Examination Committee</p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-white border border-emerald-200/90 shadow-2xs flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-100 text-[#002147] font-bold flex items-center justify-center shrink-0 text-xs">
                    TL
                  </div>
                  <div>
                    <h5 className="font-bold text-gray-900 text-xs sm:text-sm">Mr. Theja Lohe</h5>
                    <p className="text-gray-500 text-[11px]">Faculty In-Charge • Assistant Professor, Tenyidie</p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-white border border-emerald-200/90 shadow-2xs flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-purple-100 text-purple-800 font-bold flex items-center justify-center shrink-0 text-xs">
                    TL
                  </div>
                  <div>
                    <h5 className="font-bold text-gray-900 text-xs sm:text-sm">Mrs. Tatongkala Lemtur</h5>
                    <p className="text-gray-500 text-[11px]">Institutional Dean of Students</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Core Activities Grid */}
          <div className="space-y-3 pt-2">
            <h4 className="font-bold text-[#002147] text-sm uppercase tracking-wider flex items-center gap-2">
              <Calendar size={16} className="text-[#4a6b28]" />
              <span>Core Fellowship Programs &amp; Spiritual Activities</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {euActivities.map((act, i) => (
                <div key={i} className="p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-[#4a6b28] transition-all flex flex-col justify-between gap-3 shadow-2xs">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${act.badgeColor}`}>
                        {act.tag}
                      </span>
                      <span className="text-[10.5px] text-gray-400 font-mono">{act.schedule}</span>
                    </div>
                    <h5 className="font-bold text-gray-900 text-sm mb-1.5">{act.title}</h5>
                    <p className="text-xs text-gray-600 leading-relaxed text-justify">{act.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 5. Section: Associated Student Support Cells & Campus Clubs */}
      {(activeTab === 'ALL' || activeTab === 'CELLS') && (
        <div className="card-interactive bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 flex items-center justify-center font-bold text-lg shrink-0">
                <Compass size={24} />
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#4a6b28] block">
                  Dean of Students Coordination
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-[#002147]">
                  Student Guidance Cells, Welfare &amp; Campus Clubs
                </h3>
              </div>
            </div>

            <button
              onClick={() => onNavigate && onNavigate('committees-and-in-charges')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#002147] hover:text-[#4a6b28] bg-slate-50 hover:bg-slate-100 px-3.5 py-2 rounded-lg border border-slate-200 transition-colors cursor-pointer"
            >
              <FileText size={13} />
              <span>Full 26 Committees Directory</span>
              <ChevronRight size={14} />
            </button>
          </div>

          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed max-w-4xl">
            In coordination with the Students' Council and the Office of the Dean of Students, Capital College hosts dedicated functional cells and student clubs designed to support every dimension of collegiate life—from academic mentoring and personal counseling to creative arts and environmental action.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {studentCells.map((cell, idx) => {
              const IconComp = cell.icon || Users;
              return (
                <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-[#4a6b28] hover:bg-white transition-all flex flex-col justify-between gap-3 shadow-2xs">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="w-8 h-8 rounded-lg bg-[#002147]/5 text-[#002147] flex items-center justify-center">
                        <IconComp size={16} />
                      </div>
                      <span className="text-[9.5px] font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-700 uppercase tracking-wider">
                        {cell.category}
                      </span>
                    </div>
                    <h5 className="font-bold text-gray-900 text-sm mb-1">{cell.title}</h5>
                    <p className="text-xs text-gray-600 leading-relaxed mb-3">{cell.desc}</p>
                  </div>
                  <div className="pt-2.5 border-t border-slate-200/80 text-[11px] text-gray-500">
                    <span className="font-semibold text-slate-700">In-Charge:</span> {cell.inCharge}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 6. Action Footer & Related Institutional Resources */}
      <div className="p-6 bg-gradient-to-r from-slate-50 to-emerald-50/50 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h4 className="font-bold text-[#002147] text-sm">Need Assistance or Want to Join a Student Club?</h4>
          <p className="text-xs text-gray-600 mt-0.5">
            Visit the Office of the Dean of Students during college hours (9:00 am – 3:30 pm) or connect through your Class Representative.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => onNavigate && onNavigate('rules')}
            className="inline-flex items-center gap-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
          >
            <ShieldCheck size={13} className="text-[#4a6b28]" />
            <span>Rules &amp; Regulations</span>
          </button>
          <button
            onClick={() => onNavigate && onNavigate('contact')}
            className="inline-flex items-center gap-1.5 bg-[#002147] hover:bg-[#4a6b28] text-white px-4 py-2 rounded-lg text-xs font-bold transition-colors shadow-xs cursor-pointer"
          >
            <Mail size={13} />
            <span>Contact Dean Office</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function InnerPage({ pageId, onNavigate, onOpenAdmission, onOpenAdmin }) {
  // Dedicated Contact Us & Query Submission Page
  if (pageId === 'contact' || pageId === 'contact-us') {
    return <ContactPage onNavigate={onNavigate} />;
  }

  // Dedicated Individual Department Pages (Each department has its own standalone page)
  if (pageId && (pageId.startsWith('department-') || getDepartmentBySlug(pageId))) {
    const cleanSlug = pageId.replace(/^department-/, '');
    return (
      <DepartmentPage
        deptSlug={cleanSlug}
        onNavigate={onNavigate}
        onOpenAdmission={onOpenAdmission}
      />
    );
  }

  const pages = {
    profile: {
      title: 'College Profile',
      breadcrumbTitle: 'College Profile',
      render: () => <CollegeProfileSection onNavigate={onNavigate} onOpenAdmission={onOpenAdmission} />
    },
    'sponsorship-and-management': {
      title: 'Sponsorship and Management',
      breadcrumbTitle: 'Sponsorship and Management',
      render: () => <SponsorshipAndManagementSection onNavigate={onNavigate} />
    },
    'governing-body': {
      title: 'Governing Body',
      breadcrumbTitle: 'Governing Body',
      render: () => <GoverningBodySection />
    },
    'college-administration': {
      title: 'College Administration',
      breadcrumbTitle: 'College Administration',
      render: () => <CollegeAdministrationSection onNavigate={onNavigate} />
    },
    faculty: {
      title: 'Faculty Directory',
      breadcrumbTitle: 'Faculty',
      render: () => <FacultySection onNavigate={onNavigate} />
    },
    iqac: {
      title: 'INTERNAL QUALITY ASSURANCE CELL (IQAC)',
      breadcrumbTitle: 'Internal Quality Assurance Cell (IQAC)',
      render: () => <IQACSection />
    },
    rules: {
      title: 'COLLEGE RULES AND REGULATIONS',
      breadcrumbTitle: 'College Rules and Regulations',
      render: () => <RulesSection onNavigate={onNavigate} />
    },
    'students-council-eu': {
      title: "STUDENTS' COUNCIL & EVANGELICAL UNION (EU)",
      breadcrumbTitle: "Students' Council & EU",
      render: () => <StudentCouncilAndEUSection onNavigate={onNavigate} />
    },
    criteria: {
      title: 'CRITERIA & ELIGIBILITY',
      breadcrumbTitle: 'Criteria',
      render: () => <CriteriaSection onNavigate={onNavigate} onOpenAdmission={onOpenAdmission} />
    },
    programs: {
      title: 'Programs and Courses',
      breadcrumbTitle: 'Programs and Courses',
      render: () => (
        <ProgramsAndCoursesSection
          onNavigate={onNavigate}
          onOpenAdmission={onOpenAdmission}
        />
      )
    },
    mous: {
      title: "MoU’s & Collaborations",
      breadcrumbTitle: "MoU’s",
      render: () => <MoUsSection />
    },
    scholarship: {
      title: 'SCHOLARSHIP',
      breadcrumbTitle: 'Scholarship',
      render: () => <ScholarshipsSection />
    },
    'principal-message': {
      title: "PRINCIPAL'S MESSAGE",
      breadcrumbTitle: "Principal's Message",
      render: () => <PrincipalMessageSection onNavigate={onNavigate} onOpenAdmission={onOpenAdmission} />
    },
    'arts-block': {
      title: 'KOHIMA CAMPUS (ARTS STREAM)',
      breadcrumbTitle: 'Kohima Campus (Arts Stream)',
      render: () => <CampusBlockSection type="arts" />
    },
    'science-section': {
      title: 'THEGABA, PHEZHU (SCIENCE STREAM)',
      breadcrumbTitle: 'Thegaba, Phezhu (Science Stream)',
      render: () => <CampusBlockSection type="science" />
    },
    gallery: {
      title: 'GALLERY',
      breadcrumbTitle: 'Gallery',
      render: () => (
        <div className="space-y-6 text-gray-800 text-sm md:text-base leading-relaxed">
          <p className="font-semibold text-gray-900 text-base md:text-lg">
            Campus Moments & Photo Archives
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { img: 'https://capitalcollege.edu.in/wp-content/uploads/2023/05/sports.jpeg', caption: 'Sports Meet' },
              { img: 'https://capitalcollege.edu.in/wp-content/uploads/2023/05/cultural-day.jpeg', caption: 'Cultural Day' },
              { img: 'https://capitalcollege.edu.in/wp-content/uploads/2024/10/DSC_5192-scaled.jpg', caption: 'Trifecta Festival' },
              { img: 'https://capitalcollege.edu.in/wp-content/uploads/2023/05/DSC_0764-scaled.jpg', caption: 'NSS Special Camp' },
              { img: 'https://capitalcollege.edu.in/wp-content/uploads/2025/08/teachers-with-freshers-copy-500x500.jpg', caption: 'Freshers Day' },
              { img: 'https://capitalcollege.edu.in/wp-content/uploads/2023/05/DSC_3190-scaled.jpg', caption: 'Athletics Meet' }
            ].map((item, idx) => (
              <div key={idx} className="card-interactive card-accent-top group rounded-xl overflow-hidden border border-gray-200 shadow-xs bg-gray-50 flex flex-col justify-between cursor-pointer">
                <div className="card-image-zoom overflow-hidden relative h-48 bg-slate-100">
                  <img
                    src={item.img}
                    alt={item.caption}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <p className="p-3 text-center text-xs font-bold text-[#002147] group-hover:text-[#4a6b28] transition-colors">{item.caption}</p>
              </div>
            ))}
          </div>
        </div>
      )
    },
    'academic-calendar': {
      title: 'Academic Calendar',
      breadcrumbTitle: 'Academic Calendar',
      render: () => (
        <div className="space-y-6 text-gray-800 text-sm md:text-base leading-relaxed">
          <div className="flex flex-wrap items-center justify-between gap-4 p-5 bg-gradient-to-r from-gray-50 to-emerald-50/40 rounded-2xl border border-gray-200">
            <div>
              <h3 className="font-bold text-[#002147] text-base md:text-lg">
                Capital College Academic Calendar
              </h3>
              <p className="text-xs text-gray-600 mt-1">
                Official Institutional Academic Schedule & Semester Activities
              </p>
            </div>
            <a
              href="https://capitalcollege.edu.in/wp-content/uploads/2024/08/WhatsApp-Image-2024-08-17-at-11.13.51-AM-scaled.jpeg"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#002147] hover:bg-[#4a6b28] text-white px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors shadow-xs"
            >
              <Download size={14} />
              <span>Download Calendar</span>
            </a>
          </div>

          <div className="entry-content rounded-2xl overflow-hidden border border-gray-200 bg-white shadow-xs p-2 sm:p-4">
            <img
              src="https://capitalcollege.edu.in/wp-content/uploads/2024/08/WhatsApp-Image-2024-08-17-at-11.13.51-AM-scaled.jpeg"
              alt="Academic Calendar Capital College Kohima"
              className="w-full h-auto object-contain block mx-auto max-w-4xl"
            />
          </div>
        </div>
      )
    },
    notice: {
      title: 'Official Notice Board',
      breadcrumbTitle: 'Notice Board',
      render: () => <NoticeBoardPage onNavigate={onNavigate} onOpenAdmin={onOpenAdmin} />
    },
    notices: {
      title: 'Official Notice Board',
      breadcrumbTitle: 'Notice Board',
      render: () => <NoticeBoardPage onNavigate={onNavigate} onOpenAdmin={onOpenAdmin} />
    },
    events: {
      title: 'Campus Events & Activities',
      breadcrumbTitle: 'Campus Events',
      render: () => <EventsPage onNavigate={onNavigate} />
    },
    'under-graduate-exam-routine-2023': {
      title: 'External- End Term Examination',
      breadcrumbTitle: 'External- End Term Examination',
      render: () => (
        <div className="space-y-6 text-gray-800 text-sm md:text-base leading-relaxed">
          <div className="p-5 bg-gradient-to-r from-gray-50 to-emerald-50/40 rounded-2xl border border-gray-200">
            <h3 className="font-bold text-[#002147] text-base md:text-lg">
              Nagaland University Under Graduate Examination Routines
            </h3>
            <p className="text-xs text-gray-600 mt-1">
              Official End-Term examination timetables and schedules for B.A. and B.Sc. undergraduate semesters.
            </p>
          </div>

          <div className="space-y-3">
            {[
              {
                title: '2023 UG 2nd Semester CBCS Exam Routine',
                url: 'https://capitalcollege.edu.in/wp-content/uploads/2023/05/2023-UG-2Sem-CBCS-Exam-Routine.pdf',
                desc: 'CBCS System Examination Routine for 2nd Semester Undergraduates'
              },
              {
                title: '2023 UG 2nd Semester Exam Routine',
                url: 'https://capitalcollege.edu.in/wp-content/uploads/2023/05/2023-UG-2Sem-Exam-Routine.pdf',
                desc: 'Regular Undergraduate Examination Schedule for 2nd Semester'
              },
              {
                title: '2023 UG 4th Semester Exam Routine',
                url: 'https://capitalcollege.edu.in/wp-content/uploads/2023/05/2023-UG-4Sem-Exam-Routine.pdf',
                desc: 'Undergraduate Examination Timetable for 4th Semester Arts & Science'
              },
              {
                title: '2023 UG 5th Semester Exam Routine',
                url: 'https://capitalcollege.edu.in/wp-content/uploads/2023/05/2023-UG-5Sem-Exam-Routine.pdf',
                desc: 'Degree Examination Schedule for 5th Semester Undergraduates'
              },
              {
                title: '2023 UG 6th Semester Exam Routine',
                url: 'https://capitalcollege.edu.in/wp-content/uploads/2023/05/2023-UG-6Sem-Exam-Routine.pdf',
                desc: 'Final Degree Examination Timetable for 6th Semester Batch'
              }
            ].map((pdf, idx) => (
              <div
                key={idx}
                className="card-interactive card-accent-top flex flex-wrap items-center justify-between p-4 bg-white rounded-xl border border-gray-200 shadow-xs hover:border-[#4a6b28] transition-all gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-red-50 text-red-700 border border-red-200 flex items-center justify-center shrink-0 font-bold text-xs">
                    PDF
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">{pdf.title}</h4>
                    <p className="text-xs text-gray-500">{pdf.desc}</p>
                  </div>
                </div>
                <a
                  href={pdf.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 bg-[#002147] hover:bg-[#4a6b28] text-white px-3.5 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors shadow-xs"
                >
                  <Download size={13} />
                  <span>Download Routine</span>
                </a>
              </div>
            ))}
          </div>
        </div>
      )
    },
    'committees-and-in-charges': {
      title: 'COMMITTEES AND IN-CHARGES',
      breadcrumbTitle: 'Committees and In-Charges',
      render: () => <CommitteesAndInChargesSection />
    },
    'cche-scheme-for-economically-weak-students': {
      title: 'CCHE Scheme for Economically Weak Students',
      breadcrumbTitle: 'Students Welfare Scheme',
      render: () => (
        <div className="space-y-6 text-gray-800 text-sm md:text-base leading-relaxed font-sans">
          <div className="p-6 bg-gradient-to-r from-emerald-50/90 to-teal-50/70 rounded-2xl border border-emerald-200 space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#4a6b28] text-white text-xs font-bold uppercase tracking-wider mb-2">
              <ShieldCheck size={13} />
              <span>Institutional Financial Aid</span>
            </div>
            <h3 className="font-bold text-[#002147] text-lg md:text-xl">
              CCHE Scheme for Economically Weak Students
            </h3>
            <p className="text-xs sm:text-sm text-gray-700">
              Number of Students/Applicants to be selected : <strong className="text-[#4a6b28] font-black text-sm">2 (Two)</strong>
            </p>
          </div>

          <div className="card-interactive bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-xs space-y-5 text-gray-800">
            <h4 className="font-extrabold text-[#002147] text-base border-b border-gray-100 pb-3">
              Official Eligibility Criteria (Selection Committee Mandate)
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
              {[
                { no: 'i.', text: 'The scheme shall be available only for 6th Semester Students.' },
                { no: 'ii.', text: 'Only economically weak students shall avail the scheme.' },
                { no: 'iii.', text: 'Only Students consistently securing 75% in attendance shall be eligible.' },
                { no: 'iv.', text: 'Student’s should possess Good and consistent academic performance till 5th Semester.' },
                { no: 'v.', text: 'In a year, the scheme shall be awarded to 2(two) students only.' },
                { no: 'vi.', text: 'Parents of the applicants shall be invited to interact with the Selection Committee to verify/confirm the background of the student.' }
              ].map((c, ci) => (
                <div key={ci} className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 flex items-start gap-3">
                  <span className="w-6 h-6 rounded-md bg-[#002147] text-white font-bold flex items-center justify-center shrink-0 text-xs">
                    {c.no}
                  </span>
                  <p className="text-gray-700 leading-relaxed font-medium">{c.text}</p>
                </div>
              ))}
            </div>

            <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-200 text-xs sm:text-sm text-gray-800">
              <strong className="text-[#002147] font-bold block mb-1">Application Submission Procedure:</strong>
              Application in the student’s own hand writing may be submitted directly to the Selection Committee In-charges.
            </div>
          </div>
        </div>
      )
    },
    'student-awards': {
      title: 'Students Awards',
      breadcrumbTitle: 'Students Awards',
      render: () => (
        <div className="space-y-6 text-gray-800 text-sm md:text-base leading-relaxed font-sans">
          <div className="p-6 bg-gradient-to-r from-emerald-50/90 to-teal-50/70 rounded-2xl border border-emerald-200">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#4a6b28] text-white text-xs font-bold uppercase tracking-wider mb-2">
              <Trophy size={13} />
              <span>Academic Distinctions</span>
            </div>
            <h3 className="font-bold text-[#002147] text-lg md:text-xl">
              Institutional Awards & Student Distinctions
            </h3>
            <p className="text-xs text-gray-700 mt-1">
              Capital College of Higher Education, Kohima recognizes and rewards academic merit, discipline, and outstanding student commitment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="card-interactive card-accent-top bg-white rounded-2xl border border-gray-200 p-5 shadow-xs flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center font-bold text-lg shrink-0">
                <Trophy size={22} />
              </div>
              <div>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-amber-100 text-amber-800 uppercase tracking-wider">
                  Cash Award: Rs. 10,000
                </span>
                <h4 className="font-bold text-[#002147] text-base mt-1">1. University Topper Award</h4>
                <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                  Students securing Topper’s position/rank in University Final (6th Semester) Examinations shall be given a cash award of <strong>Rs. 10,000 (Ten Thousand)</strong> with citation.
                </p>
              </div>
            </div>

            <div className="card-interactive card-accent-top bg-white rounded-2xl border border-gray-200 p-5 shadow-xs flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#002147] border border-blue-200 flex items-center justify-center font-bold text-lg shrink-0">
                <Medal size={22} />
              </div>
              <div>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-blue-100 text-blue-800 uppercase tracking-wider">
                  Citation & Cash Award
                </span>
                <h4 className="font-bold text-[#002147] text-base mt-1">2. University Distinction Award</h4>
                <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                  Citation with cash awards shall also be awarded to students securing distinction in certain papers in University Final Examinations, as well as to the subject-teacher.
                </p>
              </div>
            </div>

            <div className="card-interactive card-accent-top bg-white rounded-2xl border border-gray-200 p-5 shadow-xs flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#4a6b28] border border-emerald-200 flex items-center justify-center font-bold text-lg shrink-0">
                <Clock size={22} />
              </div>
              <div>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 uppercase tracking-wider">
                  Annual Award
                </span>
                <h4 className="font-bold text-[#002147] text-base mt-1">3. Best Attendance</h4>
                <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                  Cash award conferred upon students demonstrating consistent punctuality and outstanding campus attendance throughout the academic year.
                </p>
              </div>
            </div>

            <div className="card-interactive card-accent-top bg-white rounded-2xl border border-gray-200 p-5 shadow-xs flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-700 border border-purple-200 flex items-center justify-center font-bold text-lg shrink-0">
                <Scroll size={22} />
              </div>
              <div>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-purple-100 text-purple-800 uppercase tracking-wider">
                  Certificate & Gift Package
                </span>
                <h4 className="font-bold text-[#002147] text-base mt-1">4. Best Discipline & Best Academic Performance</h4>
                <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                  Conferred with official Certificate and gift packages recognizing peer leadership, integrity, and exceptional grade points.
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    'teachers-award': {
      title: 'Teacher Awards',
      breadcrumbTitle: 'Teacher Awards',
      render: () => (
        <div className="space-y-6 text-gray-800 text-sm md:text-base leading-relaxed font-sans">
          <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#002147] text-white text-xs font-bold uppercase tracking-wider mb-2">
              <Award size={13} />
              <span>Faculty Excellence</span>
            </div>
            <h3 className="font-bold text-[#002147] text-lg md:text-xl">
              Faculty Recognition & Subject-Teacher Awards
            </h3>
            <p className="text-xs text-gray-700 mt-1">
              Honoring teaching excellence, academic mentorship, and outstanding university results at Capital College of Higher Education.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card-interactive card-accent-top bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-2">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 text-[#4a6b28] border border-emerald-100 flex items-center justify-center font-bold mb-2">
                <Medal size={20} />
              </div>
              <h4 className="font-bold text-[#002147] text-base">
                1. University Distinction Citation & Cash Award for Subject-Teachers
              </h4>
              <p className="text-gray-700 text-xs sm:text-sm leading-relaxed text-justify">
                Under the official academic award policy of Capital College of Higher Education: Citation with cash awards shall also be awarded to students securing distinction in certain papers in University Final Examinations, <strong>as well as to the subject-teacher</strong>.
              </p>
            </div>

            <div className="card-interactive card-accent-top bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-2">
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-[#002147] border border-blue-100 flex items-center justify-center font-bold mb-2">
                <Award size={20} />
              </div>
              <h4 className="font-bold text-[#002147] text-base">
                2. Excellence in Transformative Pedagogy Honors
              </h4>
              <p className="text-gray-700 text-xs sm:text-sm leading-relaxed text-justify">
                Conferred annually by the College Management and Internal Quality Assurance Cell (IQAC) recognizing faculty commitment to innovative instructional design, student mentoring, institutional research, and character formation.
              </p>
            </div>
          </div>
        </div>
      )
    }
  };

  const aliases = {
    'college-profile-1': 'profile',
    'dep': 'faculty',
    'dep/#': 'faculty',
    'departments': 'faculty',
    'academic-departments': 'faculty',
    'mou': 'mous',
    'programs-and-courses': 'programs',
    'programs-and-courses/': 'programs',
    'programs': 'programs',
    'courses': 'programs',
    'course': 'programs',
    'programme': 'programs',
    'programmes': 'programs',
    'programmes-and-courses': 'programs',
    'academic-programmes': 'programs',
    'subjects': 'programs',
    'admission': 'criteria',
    'admissions': 'criteria',
    'criteria': 'criteria',
    'academic-calendar': 'academic-calendar',
    'notice': 'notice',
    'notice/': 'notice',
    'notices': 'notice',
    'events': 'events',
    'events/': 'events',
    'campus-events': 'events',
    'activities': 'events',
    'under-graduate-exam-routine-2023': 'under-graduate-exam-routine-2023',
    'under-graduate-exam-routine-2023/': 'under-graduate-exam-routine-2023',
    'exam-routine': 'under-graduate-exam-routine-2023',
    'committees-and-in-charges': 'committees-and-in-charges',
    'committees-and-in-charges/': 'committees-and-in-charges',
    'committees': 'committees-and-in-charges',
    'list-of-committees': 'committees-and-in-charges',
    'cche-scheme-for-economically-weak-students': 'cche-scheme-for-economically-weak-students',
    'cche-scheme-for-economically-weak-students/': 'cche-scheme-for-economically-weak-students',
    'welfare-scheme': 'cche-scheme-for-economically-weak-students',
    'student-awards': 'student-awards',
    'student-awards/': 'student-awards',
    'students-awards': 'student-awards',
    'teachers-award': 'teachers-award',
    'teachers-award/': 'teachers-award',
    'teacher-awards': 'teachers-award',
    'students-council-eu': 'students-council-eu',
    'students-council-eu/': 'students-council-eu',
    'student-council-eu': 'students-council-eu',
    'students-council': 'students-council-eu',
    'student-council': 'students-council-eu',
    'students-council-and-eu': 'students-council-eu',
    'student-council-and-eu': 'students-council-eu',
    'eu': 'students-council-eu',
    'evangelical-union': 'students-council-eu',
    'student-services': 'students-council-eu',
    'students-services': 'students-council-eu'
  };
  const resolvedKey = aliases[pageId] || pageId;
  const pageData = pages[resolvedKey] || pages[pageId] || pages.programs || pages.iqac;
  const isProgramsPage = ['programs', 'courses'].includes(resolvedKey);

  return (
    <div className="min-h-screen bg-[#fcfcfc]">
      {/* Education Base Inner Main Title Banner - Exactly like capitalcollege.edu.in */}
      <LandingReveal animation="fade-down" duration={550}>
        <div className="wrapper inner-main-title bg-[#20252b] text-white py-12 md:py-16 border-b border-gray-700/50 shadow-inner relative overflow-hidden">
          <div className={`${isProgramsPage ? 'max-w-[1440px] 2xl:max-w-[1536px]' : 'max-w-7xl'} mx-auto px-4 sm:px-6 lg:px-8 relative z-10`}>
            <header className="entry-header">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-wide uppercase drop-shadow-sm font-sans leading-tight">
                {pageData.title}
              </h1>
              <div className="breadcrumbs mt-3 flex items-center gap-2 text-xs md:text-sm text-gray-300 font-medium">
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:text-[#8fc35e] transition-colors underline-offset-2 hover:underline cursor-pointer"
                >
                  Home
                </button>
                <span className="text-gray-400">»</span>
                <span className="text-white font-semibold">{pageData.breadcrumbTitle || pageData.title}</span>
              </div>
            </header>
          </div>
        </div>
      </LandingReveal>

      {/* Main Content Area */}
      <LandingReveal animation="fade-up" delay={100} duration={650}>
        <div id="content" className={`site-content ${isProgramsPage ? 'max-w-[1440px] 2xl:max-w-[1536px]' : 'max-w-7xl'} mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12`}>
          <main className="site-main">
            <article className={`bg-white border border-gray-200/90 rounded-2xl ${isProgramsPage ? 'p-6 sm:p-8 md:p-10 lg:p-12' : 'p-6 sm:p-8 md:p-12'} shadow-sm font-sans`}>
              {pageData.render()}
            </article>
          </main>
        </div>
      </LandingReveal>
    </div>
  );
}
