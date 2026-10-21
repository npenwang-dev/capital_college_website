import React, { useState, useEffect, useMemo } from 'react';
import {
  GraduationCap,
  BookOpen,
  Users,
  Award,
  ChevronRight,
  Download,
  Mail,
  MapPin,
  Calendar,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  FlaskConical,
  Compass,
  Briefcase,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  Printer
} from 'lucide-react';
import { apiFetch } from '../../utils/api';
import LandingReveal from '../Common/LandingReveal';
import PersonCard from '../Common/PersonCard';
import {
  DEPARTMENTS,
  ARTS_DEPARTMENTS,
  SCIENCE_DEPARTMENTS,
  getDepartmentBySlug
} from '../../data/departmentData';

// Fallback baseline faculty rosters
const BASELINE_FACULTY = {
  english: {
    hod: {
      name: 'Dr. Rukulu Kezo Puro',
      qualification: 'M.A., M.Phil., Ph.D., PGCTE',
      designation: 'Head of Department & Principal',
      bio: 'Pioneering Naga literary documentation, post-colonial literature, and transformative pedagogy at Capital College Kohima.',
      email: 'english.hod@capitalcollege.edu.in'
    },
    faculty: [
      {
        name: 'Mrs. Tatongkala Lemtur Lohe',
        qualification: 'M.A., M.Phil. in English',
        designation: 'Assistant Professor & Dean of Students',
        specialization: 'British Romanticism & Student Mentorship',
        email: 'dean.students@capitalcollege.edu.in'
      },
      {
        name: 'Mrs. Opangmenla Jamir',
        qualification: 'M.A., B.Ed.',
        designation: 'Assistant Professor & IQAC Coordinator',
        specialization: 'Linguistics & Quality Assurance',
        email: 'iqac@capitalcollege.edu.in'
      }
    ]
  },
  history: {
    hod: {
      name: 'Mr. Temsuwapang Lkr',
      qualification: 'M.A. in History',
      designation: 'Head of Department & NSS Nodal Officer',
      bio: 'Specialist in modern Indian history, oral historiography of Northeast tribes, and civic youth development.',
      email: 'history.hod@capitalcollege.edu.in'
    },
    faculty: [
      {
        name: 'Mrs. Kumuni Keppen',
        qualification: 'M.A. in History',
        designation: 'Assistant Professor',
        specialization: 'Ancient World Civilizations & Social Formations',
        email: 'kumuni.history@capitalcollege.edu.in'
      },
      {
        name: 'Mr. Niekhoto Chürhah',
        qualification: 'M.A. in History',
        designation: 'Assistant Professor',
        specialization: 'Northeast India & Tribal Institutions',
        email: 'niekhoto.history@capitalcollege.edu.in'
      }
    ]
  },
  'political-science': {
    hod: {
      name: 'Mrs. Chubarenla Lkr',
      qualification: 'M.A. in Political Science, UGC-NET',
      designation: 'Head of Department & Assistant Professor',
      bio: 'Academic leader in Indian constitutional governance, public policy, and comparative political institutions.',
      email: 'polscience.hod@capitalcollege.edu.in'
    },
    faculty: [
      {
        name: 'Mr. Vungthungo',
        qualification: 'M.A. in Political Science, UGC-NET',
        designation: 'Assistant Professor',
        specialization: 'Western Political Thought & International Relations',
        email: 'vungthungo.pol@capitalcollege.edu.in'
      },
      {
        name: 'Mr. Meyiepeo Puyie',
        qualification: 'M.A. in Political Science, UGC-NET',
        designation: 'Assistant Professor',
        specialization: 'Public Administration & Electoral Politics',
        email: 'meyiepeo.pol@capitalcollege.edu.in'
      }
    ]
  },
  sociology: {
    hod: {
      name: 'Mrs. Kevivonu Zhotso Chishi',
      qualification: 'M.A. in Sociology',
      designation: 'Head of Department & Assistant Professor',
      bio: 'Investigating tribal social change, kinship structures, and community resilience in Nagaland.',
      email: 'sociology.hod@capitalcollege.edu.in'
    },
    faculty: [
      {
        name: 'Mrs. Abeino Zashü',
        qualification: 'M.A. in Sociology, UGC-NET',
        designation: 'Assistant Professor & Academic Dean',
        specialization: 'Sociology of India & Tribal Stratification',
        email: 'dean.academic@capitalcollege.edu.in'
      },
      {
        name: 'Mr. Vizoboto Zhotso',
        qualification: 'M.A. in Sociology',
        designation: 'Assistant Professor',
        specialization: 'Social Research Methodology & Youth Studies',
        email: 'vizoboto.soc@capitalcollege.edu.in'
      }
    ]
  },
  education: {
    hod: {
      name: 'Mrs. Shedulu Kezo',
      qualification: 'M.A., B.Ed., M.Ed., UGC-NET',
      designation: 'Head of Department & Assistant Professor',
      bio: 'Championing pedagogical innovation, educational psychology, and child guidance methodologies.',
      email: 'education.hod@capitalcollege.edu.in'
    },
    faculty: []
  },
  economics: {
    hod: {
      name: 'Mrs. Akanjungla Kichu',
      qualification: 'M.A. in Economics',
      designation: 'Head of Department & Assistant Professor',
      bio: 'Focusing on macroeconomic stabilization, hill agriculture economics, and state fiscal policy.',
      email: 'economics.hod@capitalcollege.edu.in'
    },
    faculty: []
  },
  tenyidie: {
    hod: {
      name: 'Mr. Theja Lohe',
      qualification: 'M.A. in Tenyidie',
      designation: 'Head of Department & Assistant Professor',
      bio: 'Preserving and advancing indigenous Tenyidie literature, folklore, orthography, and cultural translation.',
      email: 'tenyidie.hod@capitalcollege.edu.in'
    },
    faculty: []
  },
  botany: {
    hod: {
      name: 'Dr. Kadunlung Gamei',
      qualification: 'M.Sc., Ph.D. in Botany',
      designation: 'Head of Department & Assistant Professor',
      bio: 'Leading research in Himalayan plant systematics, ethnobotany, and conservation of medicinal bio-resources in Nagaland.',
      email: 'botany.hod@capitalcollege.edu.in'
    },
    faculty: []
  },
  zoology: {
    hod: {
      name: 'Mrs. Nourhevinuo Kessiezie',
      qualification: 'M.Sc. in Zoology, UGC-NET',
      designation: 'Head of Department & Assistant Professor',
      bio: 'Dedicated to comparative animal anatomy, molecular genetics, and montane wildlife conservation.',
      email: 'zoology.hod@capitalcollege.edu.in'
    },
    faculty: [
      {
        name: 'Mr. Vevohu Kezo',
        qualification: 'M.Sc. in Zoology',
        designation: 'Vice Principal & Assistant Professor',
        specialization: 'Cell Biology, Entomology & Campus Academic Oversight',
        email: 'viceprincipal@capitalcollege.edu.in'
      }
    ]
  },
  chemistry: {
    hod: {
      name: 'Mr. Pyonphamo Ezung',
      qualification: 'M.Sc. in Chemistry',
      designation: 'Head of Department & Assistant Professor',
      bio: 'Advancing chemical education, organic reaction mechanisms, and green laboratory practices.',
      email: 'chemistry.hod@capitalcollege.edu.in'
    },
    faculty: []
  },
  mathematics: {
    hod: {
      name: 'Science Academic Faculty',
      qualification: 'M.Sc. in Mathematics',
      designation: 'Head of Department & Assistant Professor',
      bio: 'Teaching calculus, linear algebra, and computational mathematics across science programs.',
      email: 'mathematics.hod@capitalcollege.edu.in'
    },
    faculty: []
  }
};

export default function DepartmentPage({
  deptSlug = 'english',
  onNavigate,
  onOpenAdmission
}) {
  const [activeTab, setActiveTab] = useState('faculty'); // 'faculty' | 'about' | 'curriculum' | 'facilities'
  const [liveFaculty, setLiveFaculty] = useState([]);

  // Resolve department details from slug
  const dept = useMemo(() => {
    return getDepartmentBySlug(deptSlug) || DEPARTMENTS.english;
  }, [deptSlug]);

  // Fetch live faculty records from API
  useEffect(() => {
    let mounted = true;
    const fetchFaculty = async () => {
      try {
        const res = await apiFetch('/api/faculty');
        if (res.ok) {
          const data = await res.json();
          if (mounted && data.success && Array.isArray(data.faculty)) {
            setLiveFaculty(data.faculty);
          }
        }
      } catch (err) {
        console.warn('Could not fetch live faculty for department:', err);
      }
    };

    fetchFaculty();
    const handleUpdate = () => fetchFaculty();
    window.addEventListener('faculty-updated', handleUpdate);
    return () => {
      mounted = false;
      window.removeEventListener('faculty-updated', handleUpdate);
    };
  }, []);

  // Merge database faculty with baseline records for this department
  const { hodMember, facultyMembers } = useMemo(() => {
    const baseline = BASELINE_FACULTY[dept.slug] || {
      hod: {
        name: `${dept.name} HOD`,
        qualification: 'M.A. / M.Sc., UGC-NET',
        designation: 'Head of Department',
        bio: 'Leading academic and curricular progress for the department.',
        email: `${dept.slug}.hod@capitalcollege.edu.in`
      },
      faculty: []
    };

    // Filter live database faculty matching this department
    const deptDbFaculty = liveFaculty.filter((f) => {
      const fDept = (f.department || '').toLowerCase().trim();
      const targetSlug = dept.slug.toLowerCase().trim();
      const targetName = dept.name.toLowerCase().trim();
      return (
        fDept === targetSlug ||
        fDept.includes(targetSlug) ||
        targetName.includes(fDept) ||
        fDept === (dept.code || '').toLowerCase()
      );
    });

    // Extract HOD from database, fallback to baseline
    const dbHod = deptDbFaculty.find((f) => f.is_hod === 1 || f.is_hod === true);
    const hodMember = dbHod
      ? {
          name: dbHod.name,
          qualification: dbHod.qualification,
          designation: dbHod.designation || 'Head of Department',
          image_url: dbHod.image_url || '',
          bio: dbHod.bio || baseline.hod?.bio || 'Dedicated to inspiring academic rigor and empowering students toward lifelong achievement.',
          email: dbHod.email || baseline.hod?.email || `${dept.slug}.hod@capitalcollege.edu.in`,
          campus: dbHod.campus || 'P.R. Hill Campus, Kohima'
        }
      : baseline.hod;

    // Remaining faculty members
    const dbTeachers = deptDbFaculty.filter((f) => !f.is_hod);
    const facultyMembers =
      dbTeachers.length > 0
        ? dbTeachers.map((t) => ({
            name: t.name,
            qualification: t.qualification,
            designation: t.designation || 'Assistant Professor',
            image_url: t.image_url || '',
            specialization: t.bio || t.designation || 'Undergraduate Teaching & Research',
            bio: t.bio || '',
            email: t.email || `${t.name.toLowerCase().replace(/[^a-z]/g, '')}@capitalcollege.edu.in`,
            campus: t.campus || 'P.R. Hill Campus, Kohima'
          }))
        : baseline.faculty || [];

    return { hodMember, facultyMembers };
  }, [dept, liveFaculty]);

  // Compute initials monogram
  const getInitials = (name) => {
    if (!name) return 'CC';
    const clean = name.replace(/^(Dr\.|Prof\.|Mr\.|Mrs\.|Ms\.)\s+/i, '').trim();
    const parts = clean.split(' ').filter(Boolean);
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return (parts[0] ? parts[0].substring(0, 2) : 'CC').toUpperCase();
  };

  // Sibling departments in the same stream
  const siblingDepartments = useMemo(() => {
    return (dept.stream === 'ARTS' ? ARTS_DEPARTMENTS : SCIENCE_DEPARTMENTS).filter(
      (d) => d.slug !== dept.slug
    );
  }, [dept]);

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* 1. TOP INSTITUTIONAL BREADCRUMBS & STREAM MASTHEAD */}
      <div className="bg-gradient-to-r from-[#001736] via-[#002147] to-[#001736] text-white py-10 sm:py-14 border-b-4 border-[#4a6b28] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#8fc35e_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-1.5 text-xs text-slate-300 font-medium mb-4 flex-wrap">
            <button
              onClick={() => onNavigate && onNavigate('home')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Home
            </button>
            <ChevronRight size={12} className="text-slate-400" />
            <button
              onClick={() => onNavigate && onNavigate('faculty')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Academic Streams
            </button>
            <ChevronRight size={12} className="text-slate-400" />
            <span className="text-[#8fc35e] font-semibold">{dept.streamLabel}</span>
            <ChevronRight size={12} className="text-slate-400" />
            <span className="text-white font-bold">{dept.name}</span>
          </nav>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              {/* Stream Badge */}
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="bg-[#4a6b28] text-white text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-sm">
                  {dept.stream === 'ARTS' ? '🎨 Arts Stream' : '🔬 Science Stream'}
                </span>
                <span className="bg-white/10 text-slate-200 text-xs font-semibold px-2.5 py-1 rounded-full border border-white/15">
                  FYUGP 4-Year Honours
                </span>
                <span className="bg-white/10 text-slate-200 text-xs font-semibold px-2.5 py-1 rounded-full border border-white/15">
                  Code: {dept.code}
                </span>
                <span className="text-xs text-slate-300 font-mono">
                  Estd. {dept.established}
                </span>
              </div>

              {/* Department Title */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
                {dept.name}
              </h1>
              <p className="text-slate-200 text-sm sm:text-base max-w-3xl mt-2 leading-relaxed">
                {dept.tagline}
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <button
                onClick={() => onOpenAdmission && onOpenAdmission(dept.stream, dept.name)}
                className="bg-[#4a6b28] hover:bg-[#3d5920] text-white px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 shadow-lg transition-all hover:scale-105 cursor-pointer"
              >
                <GraduationCap size={16} />
                <span>Apply for Admission</span>
              </button>
              <a
                href="/admission_form.pdf"
                download="admission_form.pdf"
                className="bg-white/15 hover:bg-white/25 text-white border border-white/25 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer"
              >
                <Download size={15} />
                <span>Admission Form (PDF)</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* 2. SUB-NAVIGATION TABS BAR */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-3 overflow-x-auto no-scrollbar py-2">
          <div className="flex items-center gap-1 sm:gap-2">
            {[
              { id: 'faculty', label: 'HOD & Faculty Directory', icon: Users },
              { id: 'about', label: 'About & Vision', icon: Compass },
              { id: 'curriculum', label: 'Programmes & FYUGP Curriculum', icon: BookOpen },
              { id: 'facilities', label: 'Laboratories & Facilities', icon: FlaskConical }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold tracking-tight whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#002147] text-white shadow-xs'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Icon size={14} className={isActive ? 'text-[#8fc35e]' : 'text-gray-400'} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          <button
            onClick={() => window.print()}
            className="hidden md:flex items-center gap-1 text-xs text-gray-500 hover:text-gray-800 font-semibold px-2.5 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <Printer size={13} />
            <span>Print Department Profile</span>
          </button>
        </div>
      </div>

      {/* 3. MAIN CONTENT CONTAINER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* ========================================================
            TAB 1: HOD SPOTLIGHT (TOP MIDDLE) + FACULTY ROSTER
        ======================================================== */}
        {activeTab === 'faculty' && (
          <div className="space-y-12 animate-fadeIn">
            {/* SECTION 1: PROMINENT TOP-MIDDLE HOD SPOTLIGHT */}
            <div>
              <div className="text-center max-w-2xl mx-auto mb-6">
                <h2 className="text-2xl sm:text-3xl font-black text-[#002147]">
                  Head of Department (HOD)
                </h2>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">
                  Guiding academic curriculum, research, and student mentorship for the {dept.name}.
                </p>
              </div>

              {/* Centered HOD Card */}
              <div className="max-w-3xl sm:max-w-4xl mx-auto">
                <PersonCard
                  variant="spotlight"
                  isHod={true}
                  name={hodMember.name}
                  role={hodMember.designation || 'Head of Department'}
                  qualification={hodMember.qualification}
                  imageUrl={hodMember.image_url}
                  department={dept.name}
                  stream={dept.stream}
                  bio={hodMember.bio || 'Dedicated to inspiring academic rigor and empowering students toward lifelong achievement.'}
                  email={hodMember.email}
                  campus={hodMember.campus || 'P.R. Hill Campus, Kohima'}
                />
              </div>
            </div>

            {/* SECTION 2: FOLLOWED BY DEPARTMENT FACULTY DIRECTORY */}
            <div className="pt-4 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-[#002147] flex items-center gap-2">
                    <Users size={22} className="text-[#4a6b28]" />
                    <span>Department Faculty Members</span>
                    <span className="text-xs font-bold bg-slate-200 text-slate-700 px-2.5 py-0.5 rounded-full font-mono">
                      {facultyMembers.length + 1} Teaching Staff
                    </span>
                  </h3>
                  <p className="text-xs text-gray-600 mt-0.5">
                    Distinguished assistant professors and subject-matter educators in {dept.name}.
                  </p>
                </div>
              </div>

              {facultyMembers.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 sm:gap-7">
                  {facultyMembers.map((fac, idx) => (
                    <PersonCard
                      key={idx}
                      name={fac.name}
                      role={fac.designation}
                      qualification={fac.qualification}
                      imageUrl={fac.image_url}
                      department={dept.name}
                      stream={dept.stream}
                      bio={fac.bio || fac.specialization}
                      email={fac.email}
                      campus={fac.campus || 'P.R. Hill Campus, Kohima'}
                    />
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-8 text-center text-gray-500">
                  <p className="text-sm">
                    Additional faculty appointments for the {dept.name} are updated in coordination with the Academic Dean and IQAC.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 2: ABOUT & OBJECTIVES
        ======================================================== */}
        {activeTab === 'about' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 sm:p-10 space-y-6">
              <div>
                <span className="text-xs font-bold text-[#4a6b28] uppercase tracking-wider block mb-1">
                  Department Overview
                </span>
                <h3 className="text-2xl font-black text-[#002147]">
                  About the {dept.name}
                </h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed mt-3">
                  {dept.overview}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
                {/* Vision Box */}
                <div className="bg-emerald-50/60 p-6 rounded-2xl border border-emerald-200">
                  <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm mb-2">
                    <Compass size={18} className="text-[#4a6b28]" />
                    <span>Departmental Vision</span>
                  </div>
                  <p className="text-xs sm:text-sm text-emerald-950 leading-relaxed italic">
                    "{dept.vision}"
                  </p>
                </div>

                {/* Key Objectives */}
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                  <div className="flex items-center gap-2 text-[#002147] font-bold text-sm mb-2">
                    <ShieldCheck size={18} className="text-[#4a6b28]" />
                    <span>Core Academic Objectives</span>
                  </div>
                  <ul className="space-y-2 text-xs sm:text-sm text-gray-700">
                    {dept.objectives.map((obj, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 size={14} className="text-[#4a6b28] shrink-0 mt-0.5" />
                        <span>{obj}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Career Opportunities */}
            <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 sm:p-8">
              <h4 className="font-black text-[#002147] text-lg sm:text-xl flex items-center gap-2 mb-4">
                <Briefcase size={20} className="text-[#4a6b28]" />
                <span>Graduate Career Pathways &amp; Professional Horizons</span>
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {dept.careerPaths.map((cp, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-50 hover:bg-[#002147] hover:text-white transition-colors p-3.5 rounded-xl border border-slate-200 text-center font-bold text-xs text-slate-800 shadow-xs flex items-center justify-center"
                  >
                    {cp}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 3: PROGRAMMES & FYUGP CURRICULUM
        ======================================================== */}
        {activeTab === 'curriculum' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 sm:p-10 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-bold text-[#4a6b28] uppercase tracking-wider block mb-1">
                    Academic Framework (NEP 2020)
                  </span>
                  <h3 className="text-2xl font-black text-[#002147]">
                    {dept.degree}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 mt-1">
                    Structured under the Nagaland University Four-Year Undergraduate Programme (FYUGP) credit framework.
                  </p>
                </div>

                <div className="bg-slate-100 px-4 py-2 rounded-xl text-center shrink-0 border border-slate-200">
                  <span className="text-[10px] font-bold text-gray-500 uppercase block">Annual Intake</span>
                  <span className="text-lg font-black text-[#002147]">{dept.intake} Students</span>
                </div>
              </div>

              {/* Course Outline Table */}
              <div className="overflow-x-auto rounded-2xl border border-gray-200">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-[#002147] text-white font-bold uppercase text-[11px] tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Course Code</th>
                      <th className="py-3 px-4">Course Title &amp; Module</th>
                      <th className="py-3 px-4">Semester</th>
                      <th className="py-3 px-4 text-right">Credits</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {dept.curriculum.map((course, idx) => (
                      <tr key={idx} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-[#4a6b28]">
                          {course.code}
                        </td>
                        <td className="py-3 px-4 font-semibold text-gray-900">
                          {course.title}
                        </td>
                        <td className="py-3 px-4 text-gray-600">
                          {course.sem}
                        </td>
                        <td className="py-3 px-4 text-right font-mono font-bold text-slate-800">
                          {course.credits} Credits
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-gray-600 leading-relaxed flex items-start gap-2">
                <Sparkles size={16} className="text-amber-500 shrink-0 mt-0.5" />
                <span>
                  Students can opt for a <strong>Single Major</strong>, <strong>Major with Minor</strong>, or exit with a Certificate (1 Year), Diploma (2 Years), Bachelor’s Degree (3 Years), or <strong>Bachelor’s Degree with Honours / Research (4 Years)</strong> in alignment with NEP regulations.
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 4: LABORATORIES & FACILITIES
        ======================================================== */}
        {activeTab === 'facilities' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 sm:p-10 space-y-6">
              <div>
                <span className="text-xs font-bold text-[#4a6b28] uppercase tracking-wider block mb-1">
                  Department Infrastructure
                </span>
                <h3 className="text-2xl font-black text-[#002147]">
                  Laboratories, Learning Resources &amp; Facilities
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">
                  Tailored infrastructure supporting practical scientific experiments, field research, and seminars.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {dept.facilities.map((fac, idx) => (
                  <div
                    key={idx}
                    className="p-5 bg-gradient-to-br from-slate-50 to-white rounded-2xl border border-gray-200 shadow-xs flex items-start gap-3"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#002147] text-[#8fc35e] flex items-center justify-center shrink-0">
                      <CheckCircle2 size={16} />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm">
                        Facility {idx + 1}
                      </h4>
                      <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                        {fac}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            4. SIBLING DEPARTMENTS NAVIGATOR IN SAME STREAM
        ======================================================== */}
        <div className="mt-14 pt-8 border-t border-gray-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <span className="text-xs font-bold text-[#4a6b28] uppercase tracking-wider">
                Explore More Departments
              </span>
              <h4 className="text-xl font-black text-[#002147]">
                Other Departments in {dept.streamLabel}
              </h4>
            </div>

            <button
              onClick={() => onNavigate && onNavigate('faculty')}
              className="text-xs font-bold text-[#4a6b28] hover:text-[#002147] flex items-center gap-1 cursor-pointer"
            >
              <span>View All Streams &amp; Directory</span>
              <ArrowRight size={13} />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {siblingDepartments.map((sDept) => (
              <button
                key={sDept.slug}
                onClick={() => onNavigate && onNavigate(`department-${sDept.slug}`)}
                className="bg-white hover:bg-[#002147] hover:text-white p-3.5 rounded-2xl border border-gray-200 shadow-xs text-left transition-all group cursor-pointer"
              >
                <span className="text-[10px] font-mono font-bold text-slate-400 group-hover:text-[#8fc35e] block">
                  {sDept.code}
                </span>
                <span className="font-bold text-xs text-gray-800 group-hover:text-white line-clamp-1 mt-0.5">
                  {sDept.name.replace('Department of ', '')}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
