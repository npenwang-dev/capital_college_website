import React from 'react';
import {
  X,
  BookOpen,
  ShieldCheck,
  Award,
  Users,
  CheckCircle,
  FileText,
  Calendar,
  Building,
  GraduationCap,
  HeartHandshake,
  ExternalLink,
  ChevronRight,
  School,
  Library,
  Download
} from 'lucide-react';

export default function CollegeInfoModal({ isOpen, onClose, topic = 'rules', onOpenAdmission }) {
  if (!isOpen) return null;

  const contentMap = {
    rules: {
      title: 'College Rules & Regulations',
      badge: 'Code of Conduct',
      subtitle: 'Official guidelines and disciplinary code of Capital College of Higher Education',
      render: () => (
        <div className="space-y-4">
          <div className="bg-[#fdf9f0] border-l-4 border-[#4a6b28] p-4 rounded-r-lg text-xs md:text-sm text-gray-700">
            <p className="font-semibold text-[#002858]">
              All enrolled students must adhere strictly to the institutional discipline and conduct rules:
            </p>
          </div>
          <ol className="list-decimal list-outside pl-5 space-y-2.5 text-xs md:text-sm text-gray-700 leading-relaxed">
            <li><strong>Class Timings:</strong> Classes commence from 9:00 a.m. till 3:15 p.m. on all weekdays and working Saturdays. Every student shall attend classes regularly and punctually.</li>
            <li><strong>Mandatory Attendance:</strong> 75% attendance is mandatory as per Nagaland University rules to be eligible for appearing in Semester Examinations. Application for leave of absence on medical grounds should be supported by relevant medical documents.</li>
            <li><strong>Proxy Attendance:</strong> Proxy or impersonation of attendance is strictly prohibited and considered a serious disciplinary offence.</li>
            <li><strong>College Uniform:</strong> Students are to compulsorily wear the prescribed College uniform on those days reserved for wearing uniforms.</li>
            <li><strong>Identity Cards:</strong> Every student must carry his/her Identity Card to the College at all times and produce it whenever asked for by college authorities.</li>
            <li><strong>Mobile Devices:</strong> Mobile phones and electronic gadgets are strictly prohibited inside the classroom during lecture sessions.</li>
            <li><strong>Examination Integrity:</strong> Cheating and any form of malpractice during examinations will be dealt with strictly according to university disciplinary regulations.</li>
            <li><strong>Substance Prohibition:</strong> Consumption of drugs, alcohol, tobacco, and intoxicants is strictly prohibited within the Campus premises.</li>
            <li><strong>Visitors Policy:</strong> Students are not allowed to bring unauthorized guests or visitors to the classes, library, or campus.</li>
            <li><strong>Campus Harmony:</strong> Riots, unauthorized campaigning, or unruly demonstrations by students will not be tolerated within the College Campus.</li>
            <li><strong>Zero Tolerance on Harassment:</strong> Any harassment or ragging in any form or degree on fellow students, juniors, and especially female students will be treated as a punishable offence under the Criminal Act and UGC Anti-Ragging Regulations.</li>
            <li><strong>Grievance Mechanism:</strong> Any grievances of any kind by students are to be formally addressed to the Student’s Grievance Redressal Cell of the College.</li>
            <li><strong>Accountability:</strong> So long as a student is enrolled in the College, he/she shall be held accountable and responsible for his/her actions within and outside the Campus. The Principal holds disciplinary authority outside the Campus as well.</li>
            <li><strong>Campus Cleanliness:</strong> It shall be the bounden duty of every student to maintain cleanliness of the Campus and protect College property from harm and damage.</li>
            <li><strong>Disciplinary Measures:</strong> Failure to comply with the College rules and regulations will invite fines, explanatory calls to parents/guardians, debarment from appearing in exams, and expulsion from the College according to the severity of the case.</li>
          </ol>
        </div>
      )
    },
    iqac: {
      title: 'Internal Quality Assurance Cell (IQAC)',
      subtitle: 'Statutory body ensuring academic excellence, transformative pedagogy, and curriculum delivery',
      render: () => (
        <div className="space-y-4">
          <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg text-xs md:text-sm text-slate-700">
            <p>
              In accordance with NAAC and UGC guidelines, the IQAC of Capital College of Higher Education guides continuous quality enhancement, faculty development programs, and pedagogical innovation.
            </p>
          </div>
          <h4 className="font-bold text-[#002858] text-sm uppercase tracking-wider">Official IQAC Composition:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs md:text-sm">
            {[
              { role: 'Chairperson', name: 'Dr. Rukulu Kezo Puro', desc: 'Principal, CCHE' },
              { role: 'Coordinator', name: 'Mrs. Opangmenla Jamir', desc: 'Asst. Prof, Dept. of English' },
              { role: 'Senior Member', name: 'Mrs. Tatongkala Lemtur', desc: 'Dean of Students' },
              { role: 'Senior Member', name: 'Mrs. Abeino Zashu', desc: 'Academic Dean' },
              { role: 'Member', name: 'Mr. Temsüwapang Lkr', desc: 'HOD, Dept. of History & NSS PO' },
              { role: 'Member', name: 'Mrs. Chubarenla Lkr', desc: 'HOD, Dept. of Political Science' },
              { role: 'Member', name: 'Ms. Shedulu Kezo', desc: 'HOD, Dept. of Education' },
              { role: 'Member', name: 'Mr. Theja Lohe', desc: 'HOD, Dept. of Tenyidie' },
              { role: 'Member', name: 'Ms. Akanjungla Kichu', desc: 'HOD, Dept. of Economics' },
              { role: 'Member', name: 'Dr. P. Kadunlung Gamei', desc: 'HOD, Dept. of Botany' },
              { role: 'Member', name: 'Ms. Nourhevinuo Kessiezie', desc: 'HOD, Dept. of Zoology' },
              { role: 'Member', name: 'Mr. Pyonphamo Ezung', desc: 'HOD, Dept. of Chemistry' },
              { role: 'Governing Body Rep', name: 'Mr. Vezuhu Keyho', desc: 'Chairman, Governing Body' },
              { role: 'Managing Director', name: 'Dr. Khrietuo Doulo', desc: 'Management Representative' },
              { role: 'Governing Body Member', name: 'Mr. Kekhwengulo Lea', desc: 'Member, Governing Body' },
              { role: 'Local Community Rep', name: 'Head Gaonbura', desc: 'Supply Colony, Kohima' },
              { role: 'Student Representative', name: 'President', desc: 'Students Council, CCHE' }
            ].map((m, idx) => (
              <div key={idx} className="p-3 bg-white rounded-lg border border-gray-200 shadow-sm flex items-start justify-between">
                <div>
                  <p className="font-bold text-[#002858]">{m.name}</p>
                  <p className="text-gray-500 text-[11px]">{m.desc}</p>
                </div>
                <span className="text-[10px] bg-[#fdf9f0] text-[#4a6b28] border border-[#e5b564] font-semibold px-2 py-0.5 rounded">
                  {m.role}
                </span>
              </div>
            ))}
          </div>
        </div>
      )
    },
    profile: {
      title: 'College Profile & Heritage',
      badge: 'Established 2004',
      subtitle: 'Permanent affiliation with Nagaland University & UGC 2(f) and 12(B) Recognition',
      render: () => (
        <div className="space-y-4 text-xs md:text-sm text-gray-700 leading-relaxed text-justify">
          <p>
            <strong>Capital College of Higher Education (CCHE)</strong>, established in 2004 on 20th August, is permanently affiliated to <strong>Nagaland University</strong>. The college is sponsored by <strong>National Academy Society</strong> and recognized by the University Grants Commission (UGC) under Section 2(f) and 12(B) of the UGC Act of 1956.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-3">
            <div className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
              <img
                src="https://capitalcollege.edu.in/wp-content/uploads/2023/05/Arts-Block-and-Girls-Hostel-scaled.jpg"
                alt="Arts Block P.R. Hill"
                className="w-full h-40 object-cover"
              />
              <div className="p-3">
                <h5 className="font-bold text-[#002858]">Arts Campus (P.R. Hill, Kohima)</h5>
                <p className="text-[11px] text-gray-500 mt-1">
                  Centrally located below State Library, walking distance from PHQ Junction. Houses Economics, Education, English, History, Political Science, Sociology & Tenyidie.
                </p>
              </div>
            </div>
            <div className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
              <img
                src="https://capitalcollege.edu.in/wp-content/uploads/2023/05/Science-Block-1-scaled.jpg"
                alt="Science Block Thegaba Phezhu"
                className="w-full h-40 object-cover"
              />
              <div className="p-3">
                <h5 className="font-bold text-[#002858]">Permanent Science Campus (Thegaba, Phezhu)</h5>
                <p className="text-[11px] text-gray-500 mt-1">
                  Serene scenic campus at Thegaba, Phezhu, Jotsoma housing advanced laboratories for Botany, Chemistry, Physics, and Zoology.
                </p>
              </div>
            </div>
          </div>
          <p>
            The College initially began with 5 regular students and has grown rapidly through dedicated faculty mentorship. Seventeen batches have successfully graduated, with alumni serving across state administration, higher education, scientific research, and civil services. The college maintains an intimate student-teacher ratio of about <strong>10:1</strong> for personalized care.
          </p>
        </div>
      )
    },
    admin_structure: {
      title: 'College Administration & Management',
      badge: 'Governance',
      subtitle: 'Sponsorship and Management under National Academy Society',
      render: () => (
        <div className="space-y-4 text-xs md:text-sm text-gray-700">
          <div className="bg-[#fdf9f0] border border-[#e5b564] p-4 rounded-lg">
            <h4 className="font-bold text-[#002858] mb-1">Sponsorship and Management</h4>
            <p>
              Capital College of Higher Education is sponsored and managed by the <strong>National Academy Society</strong>, a registered educational trust committed to making higher education accessible, inclusive, and transformative for youth in Nagaland and the Northeast.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              <h5 className="font-bold text-[#002858] mb-2 flex items-center gap-2">
                <ShieldCheck size={16} className="text-[#4a6b28]" />
                <span>Governing Body</span>
              </h5>
              <ul className="space-y-1.5 text-xs text-gray-600">
                <li>• <strong>Chairman:</strong> Mr. Vezuhu Keyho</li>
                <li>• <strong>Managing Director:</strong> Dr. Khrietuo Doulo</li>
                <li>• <strong>Secretary / Principal:</strong> Dr. Rukulu Kezo Puro</li>
                <li>• <strong>Members:</strong> Eminent Educationists, Senior Faculty & Community Leaders</li>
              </ul>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              <h5 className="font-bold text-[#002858] mb-2 flex items-center gap-2">
                <Users size={16} className="text-[#4a6b28]" />
                <span>Administrative Officers</span>
              </h5>
              <ul className="space-y-1.5 text-xs text-gray-600">
                <li>• <strong>Principal:</strong> Dr. Rukulu Kezo Puro, M.A, M.Phil, PhD</li>
                <li>• <strong>Academic Dean:</strong> Mrs. Abeino Zashu, M.A</li>
                <li>• <strong>Dean of Students:</strong> Mrs. Tatongkala Lemtur, M.A, M.Phil</li>
                <li>• <strong>NSS Nodal Officer:</strong> Mr. Temsuwapang Lkr, M.A</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    committees: {
      title: 'Committees & In-Charges',
      badge: 'Institutional Bodies',
      subtitle: 'Active statutory cells, clubs, and student welfare committees',
      render: () => (
        <div className="space-y-3 text-xs md:text-sm text-gray-700">
          {[
            { name: 'Internal Quality Assurance Cell (IQAC)', incharge: 'Mrs. Opangmenla Jamir (Coordinator)', desc: 'Quality benchmarking, academic audits, and faculty orientation' },
            { name: 'National Service Scheme (NSS) Unit', incharge: 'Mr. Temsuwapang Lkr (Nodal Officer)', desc: 'Community development, annual special camps, blood donation and rural drives' },
            { name: 'Red Ribbon Club (RRC)', incharge: 'Nodal Officer & Student Conveners', desc: 'HIV/AIDS awareness, voluntary blood screening camps, intensified campaigns' },
            { name: 'Eco Club', incharge: 'Faculty Conveners & Volunteers', desc: 'Environmental conservation, trekking to Pulie Badze, biodiversity protection' },
            { name: 'Anti-Ragging & Disciplinary Committee', incharge: 'Principal & Senior Faculty', desc: 'Strict zero-tolerance implementation of UGC regulations against ragging' },
            { name: 'Students Grievance Redressal Cell', incharge: 'Dean of Students & Committee Members', desc: 'Prompt, confidential redressal of academic and campus grievances' },
            { name: 'Parents Teachers Association (PTA)', incharge: 'Executive Committee', desc: 'Parental engagement, student performance reviews, and institutional feedback' },
            { name: 'College Alumni Association', incharge: 'Alumni Office Bearers', desc: 'Alumni networking, career guidance, and student scholarship contributions' }
          ].map((c, idx) => (
            <div key={idx} className="p-3 bg-white rounded-lg border border-gray-200 hover:border-[#4a6b28] transition-colors shadow-sm">
              <div className="flex items-center justify-between">
                <h5 className="font-bold text-[#002858]">{c.name}</h5>
                <span className="text-[11px] font-semibold text-[#4a6b28]">{c.incharge}</span>
              </div>
              <p className="text-gray-500 text-xs mt-1">{c.desc}</p>
            </div>
          ))}
        </div>
      )
    },
    library: {
      title: 'College Libraries',
      badge: 'Academic Resources',
      subtitle: 'Two dedicated library branches for Arts and Science streams',
      render: () => (
        <div className="space-y-4 text-xs md:text-sm text-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              <div className="flex items-center gap-2 mb-2 text-[#002858]">
                <Library size={18} className="text-[#4a6b28]" />
                <h4 className="font-bold">Kohima Campus (Arts Stream)</h4>
              </div>
              <p className="text-gray-600 leading-relaxed text-xs">
                Located at P.R. Hill campus, housing comprehensive collections of textbooks, reference works, peer-reviewed journals, and rare Naga cultural history texts in Tenyidie and English.
              </p>
              <div className="mt-3 text-[11px] text-gray-500 bg-gray-50 p-2 rounded">
                <strong>Timings:</strong> 9:00 am - 3:30 pm (Mon to Sat)
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              <div className="flex items-center gap-2 mb-2 text-[#002858]">
                <Library size={18} className="text-[#4a6b28]" />
                <h4 className="font-bold">Thegaba, Phezhu (Science Stream)</h4>
              </div>
              <p className="text-gray-600 leading-relaxed text-xs">
                Located at the Jotsoma science campus, equipped with modern scientific manuals, lab catalogues, research periodicals in Botany, Chemistry, Physics, and Zoology.
              </p>
              <div className="mt-3 text-[11px] text-gray-500 bg-gray-50 p-2 rounded">
                <strong>Timings:</strong> 9:00 am - 3:30 pm (Mon to Sat)
              </div>
            </div>
          </div>
          <div className="bg-[#fdf9f0] border border-[#e5b564] p-3 rounded-lg text-xs">
            <h5 className="font-bold text-[#002858] mb-1">Library Rules:</h5>
            <p>Every student must present their valid CCHE Identity / Library Card for book issuance. Absolute silence must be maintained in reading halls.</p>
          </div>
        </div>
      )
    },
    scholarships: {
      title: 'Scholarships & Student Welfare',
      badge: 'Financial Aid',
      subtitle: 'Government scholarships and institutional financial assistance schemes',
      render: () => (
        <div className="space-y-4 text-xs md:text-sm text-gray-700">
          <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <h5 className="font-bold text-[#002858] text-sm">State Scholarship Portal (Nagaland)</h5>
                <p className="text-gray-600 text-xs mt-1">
                  Post-Matric Scholarship for Scheduled Tribe (ST) students of Nagaland administered by the Department of Higher Education, Government of Nagaland.
                </p>
              </div>
              <a
                href="https://scholarship.nagaland.gov.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#4a6b28] hover:bg-[#3d5920] text-white text-xs px-3 py-1.5 rounded flex items-center gap-1 font-semibold whitespace-nowrap"
              >
                <span>State Portal</span>
                <ExternalLink size={12} />
              </a>
            </div>
          </div>

          <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <h5 className="font-bold text-[#002858] text-sm">National Scholarship Portal (NSP)</h5>
                <p className="text-gray-600 text-xs mt-1">
                  Centrally sponsored schemes including Central Sector Scheme for College and University Students, Ishan Uday Special Scholarship for NER, and Divyangjan scholarships.
                </p>
              </div>
              <a
                href="https://scholarships.gov.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#002858] hover:bg-[#001d40] text-white text-xs px-3 py-1.5 rounded flex items-center gap-1 font-semibold whitespace-nowrap"
              >
                <span>NSP Portal</span>
                <ExternalLink size={12} />
              </a>
            </div>
          </div>

          <div className="p-4 bg-[#fdf9f0] rounded-lg border border-[#e5b564]">
            <h5 className="font-bold text-[#002858] text-sm">CCHE Scheme for Economically Weak Students</h5>
            <p className="text-gray-700 text-xs mt-1 leading-relaxed">
              Capital College provides fee concessions, book bank support, and installment payment plans for deserving students from economically vulnerable backgrounds to ensure no student is denied higher education.
            </p>
          </div>
        </div>
      )
    },
    awards: {
      title: 'Institutional Awards',
      badge: 'Excellence & Merit',
      subtitle: 'Recognizing academic brilliance, leadership, and exemplary teaching',
      render: () => (
        <div className="space-y-4 text-xs md:text-sm text-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              <h5 className="font-bold text-[#002858] flex items-center gap-1.5 mb-2">
                <Award size={18} className="text-[#4a6b28]" />
                <span>Student Awards</span>
              </h5>
              <ul className="space-y-2 text-xs text-gray-600">
                <li>• <strong>College Topper Award:</strong> Conferred annually upon the student securing the highest aggregate percentage in final university degree exams.</li>
                <li>• <strong>Subject Distinction Awards:</strong> Awarded to top scorers in English, History, Pol. Science, Sociology, Tenyidie, Education, Botany, Zoology, Chemistry & Physics.</li>
                <li>• <strong>Best NSS Volunteer Award:</strong> Recognizing exceptional service to community camps.</li>
              </ul>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              <h5 className="font-bold text-[#002858] flex items-center gap-1.5 mb-2">
                <Award size={18} className="text-[#4a6b28]" />
                <span>Teacher Awards</span>
              </h5>
              <ul className="space-y-2 text-xs text-gray-600">
                <li>• <strong>Best Teacher Award:</strong> Conferred annually for pedagogical innovation, 100% subject pass results, student mentorship, and transformative teaching.</li>
                <li>• <strong>Research & Publication Grants:</strong> Honoring faculty members presenting papers in national/international seminars and journals.</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    examinations: {
      title: 'Examinations & Evaluation',
      badge: 'Academic Assessment',
      subtitle: 'Continuous Internal Assessment (CIA) & Nagaland University End-Term Examinations',
      render: () => (
        <div className="space-y-4 text-xs md:text-sm text-gray-700">
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <h5 className="font-bold text-[#002858] mb-2">Continuous Internal Assessment (CIA)</h5>
            <p className="text-gray-600 leading-relaxed text-xs">
              Under FYUGP guidelines, students are evaluated continuously throughout the semester through sessional tests, home assignments, classroom seminars, and field projects (25% weightage).
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <h5 className="font-bold text-[#002858] mb-2">External End-Term Examinations</h5>
            <p className="text-gray-600 leading-relaxed text-xs">
              Conducted at the end of each semester under the direct supervision of Nagaland University (75% weightage). Minimum 75% attendance is strictly enforced for exam eligibility.
            </p>
          </div>
          <div className="p-3 bg-[#fdf9f0] rounded border border-[#e5b564] text-xs">
            <strong>Results Declaration:</strong> Official grade cards and SGPA/CGPA result sheets are published by Nagaland University and verified through the CCHE Examination Cell.
          </div>
        </div>
      )
    },
    services: {
      title: "Students' Services & Fellowship",
      badge: 'Campus Life',
      subtitle: 'Evangelical Union & Students Council nurturing faith, ethics, and leadership',
      render: () => (
        <div className="space-y-4 text-xs md:text-sm text-gray-700">
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <h5 className="font-bold text-[#002858] text-sm mb-1">Evangelical Union (EU)</h5>
            <p className="text-gray-600 leading-relaxed text-xs">
              The Evangelical Union of Capital College conducts weekly fellowships, Bible study circles, prayer sessions, and annual spiritual retreats, nurturing spiritual growth and ethical uprightness among students.
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <h5 className="font-bold text-[#002858] text-sm mb-1">Students Council</h5>
            <p className="text-gray-600 leading-relaxed text-xs">
              The elected representative body of students bridging the student community and college administration. Organizes annual Freshers Day, Cultural Days, Trifecta festival, debate competitions, and sports meets.
            </p>
          </div>
        </div>
      )
    },
    mous: {
      title: "Memoranda of Understanding (MoU's)",
      badge: 'Academic Linkages',
      subtitle: 'Institutional partnerships fostering research, skill development, and career growth',
      render: () => (
        <div className="space-y-3 text-xs md:text-sm text-gray-700">
          <p>
            Capital College of Higher Education actively maintains formal institutional collaborations with reputed academic and skill training bodies across the state and country to offer value-added certifications, student exchange opportunities, and industry readiness.
          </p>
          <div className="p-3 bg-white rounded border border-gray-200 shadow-sm">
            <h5 className="font-bold text-[#002858]">Academic Collaborations & Training Linkages</h5>
            <p className="text-gray-600 text-xs mt-1">
              Collaborative programs with regional colleges, environmental NGOs, Red Ribbon Club state branches, and computer literacy institutes for soft-skills and skill-enhancement courses (SEC).
            </p>
          </div>
        </div>
      )
    }
  };

  const activeTopic = contentMap[topic] || contentMap.rules;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-3xl rounded-xl shadow-2xl overflow-hidden border border-gray-100 animate-fadeIn my-8">
        {/* Header */}
        <div className="bg-[#002858] text-white px-6 py-4 flex items-center justify-between border-b-2 border-[#4a6b28]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#4a6b28] text-white flex items-center justify-center font-bold">
              <GraduationCap size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base md:text-lg">{activeTopic.title}</h3>
                <span className="text-[10px] bg-[#4a6b28] text-white font-semibold px-2 py-0.5 rounded uppercase tracking-wider">
                  {activeTopic.badge}
                </span>
              </div>
              <p className="text-xs text-gray-300 hidden sm:block">{activeTopic.subtitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close Modal"
            className="text-gray-300 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 md:p-8 max-h-[72vh] overflow-y-auto">
          {activeTopic.render()}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <span className="text-gray-500 font-medium">
            Capital College of Higher Education, Kohima • Established 2004
          </span>
          <div className="flex items-center gap-2">
            <a
              href="/admission_form.pdf"
              download="admission_form.pdf"
              className="bg-[#4a6b28] hover:bg-[#3d5920] text-white font-semibold px-4 py-1.5 rounded uppercase tracking-wider transition-colors inline-flex items-center gap-1.5 text-xs cursor-pointer"
            >
              <Download size={13} />
              <span>Application Form (PDF)</span>
            </a>
            <button
              onClick={onClose}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold px-4 py-1.5 rounded uppercase tracking-wider transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
