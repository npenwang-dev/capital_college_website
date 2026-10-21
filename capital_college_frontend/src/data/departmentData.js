// Authentic Department Data for Capital College of Higher Education, Kohima
// Verified against official website: https://capitalcollege.edu.in/programs-and-courses/

export const DEPARTMENTS = {
  // ARTS STREAM
  economics: {
    id: 'economics',
    slug: 'economics',
    name: 'Department of Economics',
    stream: 'ARTS',
    streamLabel: 'B.A. Arts',
    code: 'ECO',
    established: 2004,
    degree: 'Bachelor of Arts (BA)'
  },
  education: {
    id: 'education',
    slug: 'education',
    name: 'Department of Education',
    stream: 'ARTS',
    streamLabel: 'B.A. Arts',
    code: 'EDU',
    established: 2004,
    degree: 'Bachelor of Arts (BA)'
  },
  english: {
    id: 'english',
    slug: 'english',
    name: 'Department of English',
    stream: 'ARTS',
    streamLabel: 'B.A. Arts',
    code: 'ENG',
    established: 2004,
    degree: 'Bachelor of Arts (BA)'
  },
  history: {
    id: 'history',
    slug: 'history',
    name: 'Department of History',
    stream: 'ARTS',
    streamLabel: 'B.A. Arts',
    code: 'HIS',
    established: 2004,
    degree: 'Bachelor of Arts (BA)'
  },
  'political-science': {
    id: 'political-science',
    slug: 'political-science',
    name: 'Department of Political Science',
    stream: 'ARTS',
    streamLabel: 'B.A. Arts',
    code: 'POL',
    established: 2004,
    degree: 'Bachelor of Arts (BA)'
  },
  sociology: {
    id: 'sociology',
    slug: 'sociology',
    name: 'Department of Sociology',
    stream: 'ARTS',
    streamLabel: 'B.A. Arts',
    code: 'SOC',
    established: 2004,
    degree: 'Bachelor of Arts (BA)'
  },
  tenyidie: {
    id: 'tenyidie',
    slug: 'tenyidie',
    name: 'Department of Tenyidie',
    stream: 'ARTS',
    streamLabel: 'B.A. Arts',
    code: 'TEN',
    established: 2004,
    degree: 'Bachelor of Arts (BA)'
  },

  // SCIENCE STREAM
  botany: {
    id: 'botany',
    slug: 'botany',
    name: 'Department of Botany',
    stream: 'SCIENCE',
    streamLabel: 'B.Sc. Science',
    code: 'BOT',
    established: 2021,
    degree: 'Bachelor of Science (B.Sc.)'
  },
  chemistry: {
    id: 'chemistry',
    slug: 'chemistry',
    name: 'Department of Chemistry',
    stream: 'SCIENCE',
    streamLabel: 'B.Sc. Science',
    code: 'CHE',
    established: 2021,
    degree: 'Bachelor of Science (B.Sc.)'
  },
  physics: {
    id: 'physics',
    slug: 'physics',
    name: 'Department of Physics',
    stream: 'SCIENCE',
    streamLabel: 'B.Sc. Science',
    code: 'PHY',
    established: 2021,
    degree: 'Bachelor of Science (B.Sc.)'
  },
  zoology: {
    id: 'zoology',
    slug: 'zoology',
    name: 'Department of Zoology',
    stream: 'SCIENCE',
    streamLabel: 'B.Sc. Science',
    code: 'ZOO',
    established: 2021,
    degree: 'Bachelor of Science (B.Sc.)'
  }
};

export const ARTS_DEPARTMENTS = Object.values(DEPARTMENTS).filter((d) => d.stream === 'ARTS');
export const SCIENCE_DEPARTMENTS = Object.values(DEPARTMENTS).filter((d) => d.stream === 'SCIENCE');
export const ALL_DEPARTMENTS = Object.values(DEPARTMENTS);

export function getDepartmentBySlug(slug) {
  if (!slug) return null;
  const clean = slug.toLowerCase().replace(/^department-/, '');
  return DEPARTMENTS[clean] || Object.values(DEPARTMENTS).find((d) => d.slug === clean) || null;
}
