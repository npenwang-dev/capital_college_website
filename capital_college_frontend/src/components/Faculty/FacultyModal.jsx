import React, { useState, useEffect } from 'react';
import { X, GraduationCap, Mail, Award, BookOpen, User } from 'lucide-react';
import PersonCard from '../Common/PersonCard';

const defaultFacultyList = [
  {
    department: 'Department of English',
    stream: 'ARTS',
    members: [
      { name: 'Dr. Rukulu Kezo Puro', qualification: 'M.A, M.Phil, PhD, PGCTE', role: 'Head of Department & Principal' },
      { name: 'Tatongkala Lemtur Lohe', qualification: 'M.A, M.Phil', role: 'Assistant Professor & Dean of Students' },
      { name: 'Opangmenla Jamir', qualification: 'M.A, B.Ed', role: 'Assistant Professor & IQAC Coordinator' }
    ]
  },
  {
    department: 'Department of History',
    stream: 'ARTS',
    members: [
      { name: 'Temsuwapang Lkr', qualification: 'M.A', role: 'Head of Department & NSS Nodal Officer' },
      { name: 'Kumuni Keppen', qualification: 'M.A', role: 'Assistant Professor' },
      { name: 'Niekhoto Chürhah', qualification: 'M.A', role: 'Assistant Professor' }
    ]
  },
  {
    department: 'Department of Political Science',
    stream: 'ARTS',
    members: [
      { name: 'Chubarenla Lkr', qualification: 'M.A (NET)', role: 'Head of Department' },
      { name: 'Vungthungo', qualification: 'M.A, NET', role: 'Assistant Professor' },
      { name: 'Meyiepeo Puyie', qualification: 'M.A, NET', role: 'Assistant Professor' }
    ]
  },
  {
    department: 'Department of Sociology',
    stream: 'ARTS',
    members: [
      { name: 'Kevivonu Zhotso Chishi', qualification: 'M.A', role: 'Head of Department' },
      { name: 'Abeino Zashii', qualification: 'M.A', role: 'Assistant Professor & Academic Dean' },
      { name: 'Vizoboto Zhotso', qualification: 'M.A', role: 'Assistant Professor' }
    ]
  },
  {
    department: 'Department of Tenyidie',
    stream: 'ARTS',
    members: [
      { name: 'Theja Lohe', qualification: 'M.A', role: 'Head of Department' }
    ]
  },
  {
    department: 'Department of Education',
    stream: 'ARTS',
    members: [
      { name: 'Shedulu Kezo', qualification: 'M.A, B.Ed, M.Ed, NET', role: 'Head of Department' }
    ]
  },
  {
    department: 'Department of Economics',
    stream: 'ARTS',
    members: [
      { name: 'Akanjungla Kichu', qualification: 'M.A', role: 'Head of Department' }
    ]
  },
  {
    department: 'Visiting Faculty (Arts)',
    stream: 'ARTS',
    members: [
      { name: 'Vezolu Puro', qualification: 'M.A (NET), PhD Research Scholar (IIITDM)', role: 'Visiting Faculty' },
      { name: 'Sekulu Nienu', qualification: 'M.A (JRF), B.Ed, M.Ed, Research Scholar (NU)', role: 'Visiting Faculty' }
    ]
  },
  {
    department: 'Department of Botany',
    stream: 'SCIENCE',
    members: [
      { name: 'Dr. Kadunlung Gamei', qualification: 'M.Sc, PhD', role: 'Head of Department' },
      { name: 'Pelo-o', qualification: 'M.Sc (Theta Tutorials)', role: 'Visiting Faculty' }
    ]
  },
  {
    department: 'Department of Chemistry',
    stream: 'SCIENCE',
    members: [
      { name: 'Pyonphamo Ezung', qualification: 'M.Sc', role: 'Head of Department' },
      { name: 'Kenneth Punyu', qualification: 'M.Sc, Assoc. Prof. Dept. of Chemistry (Science College)', role: 'Visiting Faculty' }
    ]
  },
  {
    department: 'Department of Zoology',
    stream: 'SCIENCE',
    members: [
      { name: 'Nourhevinuo Kessiezie', qualification: 'M.Sc, NET', role: 'Head of Department' },
      { name: 'Vevohu Kezo', qualification: 'M.Sc', role: 'Assistant Professor' }
    ]
  },
  {
    department: 'Visiting Faculty (Science & Mathematics)',
    stream: 'SCIENCE',
    members: [
      { name: 'Dr. Abhijit Bora', qualification: 'Assoc. Prof. (Rtd), Dept. of Physics, Science College', role: 'Visiting Faculty (Physics)' },
      { name: 'M.N. Murali', qualification: 'Assoc. Prof. (Rtd), Dept. of Mathematics, Science College', role: 'Visiting Faculty (Mathematics)' },
      { name: 'Dr. Khrietuo Doulo', qualification: 'Asst. Prof. (Rtd), Dept. of Mathematics, Science College', role: 'Managing Director & Visiting Faculty' }
    ]
  }
];

const getInitials = (name) => {
  if (!name) return 'CC';
  const clean = name.replace(/^(Dr\.|Mr\.|Mrs\.|Ms\.|Prof\.)\s+/i, '').trim();
  const parts = clean.split(/\s+/).filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

export default function FacultyModal({ isOpen, onClose }) {
  const [filterStream, setFilterStream] = useState('ALL');
  const [dbFaculty, setDbFaculty] = useState([]);

  useEffect(() => {
    if (!isOpen) return;
    fetch('/api/faculty')
      .then((r) => r.json())
      .then((data) => {
        if (data?.success && Array.isArray(data.faculty)) {
          setDbFaculty(data.faculty);
        }
      })
      .catch(() => {});
  }, [isOpen]);

  if (!isOpen) return null;

  // Build departments with photo enrichments
  const clean = (s) => (s || '').toLowerCase().replace(/^(department of|dept\.? of)\s+/i, '').trim();

  const enrichedDepts = defaultFacultyList.map((dept) => {
    const enrichedMembers = dept.members.map((m) => {
      const match = dbFaculty.find((df) => df.name.toLowerCase() === m.name.toLowerCase());
      return {
        ...m,
        image_url: match?.image_url || '',
        is_hod: match ? Boolean(match.is_hod) : m.role.toLowerCase().includes('head of department')
      };
    });

    // Check for any extra members in DB for this department
    const extraInDb = dbFaculty.filter((df) => {
      const dfDept = clean(df.department);
      const dDept = clean(dept.department);
      const matchesDept = dfDept === dDept || dfDept.includes(dDept) || dDept.includes(dfDept);
      const notInDefault = !dept.members.some((m) => m.name.toLowerCase() === df.name.toLowerCase());
      return matchesDept && notInDefault;
    });

    extraInDb.forEach((df) => {
      enrichedMembers.push({
        name: df.name,
        qualification: df.qualification || '',
        role: df.designation || (df.is_hod ? 'Head of Department' : 'Faculty Member'),
        image_url: df.image_url || '',
        is_hod: Boolean(df.is_hod)
      });
    });

    return {
      ...dept,
      members: enrichedMembers
    };
  });

  const filteredDepts = enrichedDepts.filter(
    (d) => filterStream === 'ALL' || d.stream === filterStream
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden border border-gray-100 animate-fadeIn my-8 flex flex-col max-h-[88vh]">
        <div className="bg-[#002858] text-white px-6 py-4 flex items-center justify-between border-b-2 border-[#4a6b28] shrink-0">
          <div>
            <h3 className="font-bold text-lg md:text-xl">Faculty Members & Academic Staff</h3>
            <p className="text-xs text-gray-300">Capital College of Higher Education, Kohima — Departmental Directory</p>
          </div>
          <button onClick={onClose} aria-label="Close" className="text-gray-300 hover:text-white p-1 rounded-full cursor-pointer hover:bg-white/10">
            <X size={20} />
          </button>
        </div>

        {/* Filter controls */}
        <div className="bg-gray-50 border-b border-gray-200 px-6 py-3 flex gap-2 shrink-0">
          {['ALL', 'ARTS', 'SCIENCE'].map((s) => (
            <button
              key={s}
              onClick={() => setFilterStream(s)}
              className={`text-xs font-semibold px-4 py-1.5 rounded-lg transition-all cursor-pointer ${
                filterStream === s
                  ? 'bg-[#4a6b28] text-white shadow-xs'
                  : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-100'
              }`}
            >
              {s === 'ALL' ? 'All Departments' : `${s} Stream`}
            </button>
          ))}
        </div>

        <div className="p-6 md:p-8 space-y-6 overflow-y-auto">
          {filteredDepts.map((dept, idx) => (
            <div key={idx} className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs">
              <h4 className="font-bold text-[#002858] text-base border-b border-gray-100 pb-2 mb-3.5 flex items-center gap-2">
                <BookOpen size={16} className="text-[#4a6b28]" />
                <span>{dept.department}</span>
                <span className={`ml-auto text-[10px] font-bold px-2 py-0.5 rounded ${
                  dept.stream === 'SCIENCE' ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                }`}>
                  {dept.stream} STREAM
                </span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {dept.members.map((m, mIdx) => (
                  <PersonCard
                    key={mIdx}
                    name={m.name}
                    role={m.role}
                    qualification={m.qualification}
                    image_url={m.image_url}
                    is_hod={m.is_hod || (m.role && m.role.toLowerCase().includes('head of department'))}
                    department={dept.department}
                    stream={dept.stream}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
