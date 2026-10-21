import React, { useState, useEffect, useMemo } from 'react';
import {
  BookOpen,
  Users,
  Award,
  ChevronRight,
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
// Baseline faculty rosters verified against official college website (https://capitalcollege.edu.in/dep)
const BASELINE_FACULTY = {
  english: {
    hod: {
      name: 'Dr. Rukulu Kezo Puro',
      qualification: 'M.A., M.Phil., Ph.D., PGCTE',
      designation: 'Head of Department'
    },
    faculty: [
      {
        name: 'Tatongkala Lemtur Lohe',
        qualification: 'M.A., M.Phil.',
        designation: 'Faculty Member'
      },
      {
        name: 'Opangmenla Jamir',
        qualification: 'M.A., B.Ed.',
        designation: 'Faculty Member'
      },
      {
        name: 'Vezolu Puro',
        qualification: 'M.A. (NET), Ph.D. Research Scholar, IIITDM Kurnool',
        designation: 'Visiting Faculty'
      }
    ]
  },
  history: {
    hod: {
      name: 'Temsuwapang Lkr',
      qualification: 'M.A.',
      designation: 'Head of Department'
    },
    faculty: [
      {
        name: 'Kumuni Keppen',
        qualification: 'M.A.',
        designation: 'Faculty Member'
      },
      {
        name: 'Niekhoto Chürhah',
        qualification: 'M.A.',
        designation: 'Faculty Member'
      }
    ]
  },
  'political-science': {
    hod: {
      name: 'Chubarenla Lkr',
      qualification: 'M.A. (NET)',
      designation: 'Head of Department'
    },
    faculty: [
      {
        name: 'Vungthungo',
        qualification: 'M.A., NET',
        designation: 'Faculty Member'
      },
      {
        name: 'Meyiepeo Puyie',
        qualification: 'M.A., NET',
        designation: 'Faculty Member'
      }
    ]
  },
  sociology: {
    hod: {
      name: 'Kevivonu Zhotso Chishi',
      qualification: 'M.A.',
      designation: 'Head of Department'
    },
    faculty: [
      {
        name: 'Abeino Zashii',
        qualification: 'M.A.',
        designation: 'Faculty Member'
      },
      {
        name: 'Vizoboto Zhotso',
        qualification: 'M.A.',
        designation: 'Faculty Member'
      }
    ]
  },
  education: {
    hod: {
      name: 'Shedulu Kezo',
      qualification: 'M.A., B.Ed., M.Ed., NET',
      designation: 'Head of Department'
    },
    faculty: [
      {
        name: 'Sekulu Nienu',
        qualification: 'M.A. (JRF), B.Ed., M.Ed., Research Scholar, Nagaland University',
        designation: 'Visiting Faculty'
      }
    ]
  },
  economics: {
    hod: {
      name: 'Akanjungla Kichu',
      qualification: 'M.A.',
      designation: 'Head of Department'
    },
    faculty: []
  },
  tenyidie: {
    hod: {
      name: 'Theja Lohe',
      qualification: 'M.A.',
      designation: 'Head of Department'
    },
    faculty: []
  },
  botany: {
    hod: {
      name: 'Dr. Kadunlung Gamei',
      qualification: 'M.Sc., Ph.D.',
      designation: 'Head of Department'
    },
    faculty: [
      {
        name: 'Pelo-o',
        qualification: 'M.Sc., Faculty Member Dept. of Botany, Theta Tutorials',
        designation: 'Visiting Faculty'
      }
    ]
  },
  zoology: {
    hod: {
      name: 'Nourhevinuo Kessiezie',
      qualification: 'M.Sc., NET',
      designation: 'Head of Department'
    },
    faculty: [
      {
        name: 'Vevohu Kezo',
        qualification: 'M.Sc.',
        designation: 'Faculty Member'
      }
    ]
  },
  chemistry: {
    hod: {
      name: 'Pyonphamo Ezung',
      qualification: 'M.Sc.',
      designation: 'Head of Department'
    },
    faculty: [
      {
        name: 'Kenneth Punyu',
        qualification: 'M.Sc., Associate Prof. Dept. of Chemistry, Science College Jotsoma',
        designation: 'Visiting Faculty'
      }
    ]
  },
  physics: {
    hod: {
      name: 'Science Academic Faculty',
      qualification: 'M.Sc.',
      designation: 'Head of Department'
    },
    faculty: [
      {
        name: 'Dr. Abhijit Bora',
        qualification: 'Associate Prof. (Rtd), Dept. of Physics, Science College Jotsoma',
        designation: 'Visiting Faculty'
      }
    ]
  },
  mathematics: {
    hod: {
      name: 'Science Academic Faculty',
      qualification: 'M.Sc.',
      designation: 'Head of Department'
    },
    faculty: [
      {
        name: 'M.N. Murali',
        qualification: 'Associate Prof. (Rtd), Dept. of Mathematics, Science College Jotsoma',
        designation: 'Visiting Faculty'
      },
      {
        name: 'Dr. Khrietuo Doulo',
        qualification: 'Asst. Prof. (Rtd), Dept. of Mathematics, Science College Jotsoma',
        designation: 'Visiting Faculty'
      }
    ]
  }
};

export default function DepartmentPage({
  deptSlug = 'english',
  onNavigate
}) {
  const [activeTab, setActiveTab] = useState('faculty'); // 'faculty' | 'curriculum'
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
              onClick={() => onNavigate && onNavigate('programs')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Academic Programmes
            </button>
            <ChevronRight size={12} className="text-slate-400" />
            <span className="text-[#8fc35e] font-semibold">{dept.streamLabel}</span>
            <ChevronRight size={12} className="text-slate-400" />
            <span className="text-white font-bold">{dept.name}</span>
          </nav>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              {/* Department Meta */}
              <div className="flex items-center gap-2 mb-2 text-xs font-medium text-slate-300 flex-wrap">
                <span>{dept.stream === 'ARTS' ? 'Arts Stream' : 'Science Stream'}</span>
                <span>•</span>
                <span>{dept.degree}</span>
                <span>•</span>
                <span>Nagaland University</span>
              </div>

              {/* Department Title */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
                {dept.name}
              </h1>
              <p className="text-slate-200 text-sm sm:text-base max-w-3xl mt-2 leading-relaxed">
                Capital College of Higher Education, Kohima — {dept.stream === 'ARTS' ? 'Arts Stream' : 'Science Stream'}
              </p>
            </div>

          </div>
        </div>
      </div>

      {/* 2. SUB-NAVIGATION TABS BAR (ONLY FACULTY & CURRICULUM) */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-2 py-2.5 overflow-x-auto no-scrollbar">
          {[
            { id: 'faculty', label: 'HOD & Faculty Directory', icon: Users },
            { id: 'curriculum', label: 'Programmes & FYUGP Curriculum', icon: BookOpen }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#002147] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                <Icon size={15} className={isActive ? 'text-[#8fc35e]' : 'text-slate-400'} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. MAIN CONTENT CONTAINER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-12">
        {/* TAB 1: FACULTY & HOD SPOTLIGHT + ABOUT */}
        {activeTab === 'faculty' && (
          <div className="space-y-12 animate-fadeIn">
            {/* SECTION 1: HOD SPOTLIGHT + FACULTY ROSTER */}
            <div className="space-y-12">
              {/* PROMINENT TOP-MIDDLE HOD SPOTLIGHT */}
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
                <div className="max-w-[340px] sm:max-w-[380px] mx-auto">
                  <PersonCard
                    isHod={true}
                    name={hodMember.name}
                    role={hodMember.designation || 'Head of Department'}
                    qualification={hodMember.qualification}
                    imageUrl={hodMember.image_url}
                    department={dept.name}
                    stream={dept.stream}
                    bio={hodMember.bio}
                    email={hodMember.email}
                    campus={hodMember.campus || 'P.R. Hill Campus, Kohima'}
                  />
                </div>
              </div>

              {/* DEPARTMENT FACULTY DIRECTORY */}
              <div className="pt-4 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-black text-[#002147] flex items-center gap-2">
                      <Users size={22} className="text-[#4a6b28]" />
                      <span>Department Faculty Members</span>
                    </h3>
                    <p className="text-xs text-gray-600 mt-0.5">
                      Distinguished assistant professors and subject-matter educators in {dept.name}.
                    </p>
                  </div>
                </div>

                {facultyMembers.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3.5 sm:gap-4">
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
          </div>
        )}

        {/* TAB 2: PROGRAMMES & FYUGP CURRICULUM */}
        {activeTab === 'curriculum' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-xs p-6 sm:p-8 space-y-6">
              <div className="border-b border-gray-100 pb-4">
                <span className="text-xs font-bold text-[#4a6b28] uppercase tracking-wider block mb-1">
                  {dept.stream === 'ARTS' ? 'Arts Stream' : 'Science Stream'}
                </span>
                <h3 className="text-2xl font-bold text-[#002147]">
                  {dept.stream === 'ARTS' ? 'Bachelor of Arts (BA)' : 'Bachelor of Science (B.Sc.)'} — {dept.name.replace('Department of ', '')}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">
                  Capital College of Higher Education, Kohima — Nagaland University
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1.5">
                  <span className="font-bold text-[#002147] block uppercase text-[11px] tracking-wide">
                    Affiliation &amp; Recognition
                  </span>
                  <p className="text-gray-600 leading-relaxed">
                    Permanently affiliated to Nagaland University and recognized by the University Grants Commission (UGC) under Art. 2(f) &amp; 12(B) of the UGC Act of 1956.
                  </p>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1.5">
                  <span className="font-bold text-[#002147] block uppercase text-[11px] tracking-wide">
                    Campus Location
                  </span>
                  <p className="text-gray-600 leading-relaxed">
                    {dept.stream === 'ARTS'
                      ? 'Kohima Campus (Arts Stream): P.R. Hill, Kohima, Nagaland 797001'
                      : 'Science Section: Thegaba, Phezhu, Jotsoma, Nagaland'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            4. SIBLING DEPARTMENTS NAVIGATOR IN SAME STREAM
        ======================================================== */}
        <div className="mt-10 pt-6 sm:mt-14 sm:pt-8 border-t border-gray-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3 mb-4 sm:mb-6">
            <div>
              <span className="text-[11px] sm:text-xs font-bold text-[#4a6b28] uppercase tracking-wider">
                Explore More Departments
              </span>
              <h4 className="text-lg sm:text-xl font-black text-[#002147]">
                Other Departments in {dept.streamLabel}
              </h4>
            </div>

            <button
              onClick={() => onNavigate && onNavigate('programs')}
              className="text-xs font-bold text-[#4a6b28] hover:text-[#002147] flex items-center gap-1 cursor-pointer"
            >
              <span>View All Programmes &amp; Courses</span>
              <ArrowRight size={13} />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 sm:gap-3">
            {siblingDepartments.map((sDept) => (
              <button
                key={sDept.slug}
                onClick={() => onNavigate && onNavigate(`department-${sDept.slug}`)}
                className="min-w-0 bg-white hover:bg-[#002147] hover:text-white p-2 sm:p-3.5 rounded-xl sm:rounded-2xl border border-gray-200 shadow-xs text-left transition-all group cursor-pointer"
              >
                <span className="text-[9px] sm:text-[10px] font-mono font-bold text-slate-400 group-hover:text-[#8fc35e] block">
                  {sDept.code}
                </span>
                <span className="font-bold text-[11px] sm:text-xs text-gray-800 group-hover:text-white line-clamp-1 mt-0.5 leading-tight">
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
