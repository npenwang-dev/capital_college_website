// Authentic Department Data for Capital College of Higher Education, Kohima
// Affiliated to Nagaland University (Accredited by NAAC)

export const DEPARTMENTS = {
  // ==========================================
  // ARTS STREAM DEPARTMENTS (B.A. Honours)
  // ==========================================
  english: {
    id: 'english',
    slug: 'english',
    name: 'Department of English',
    stream: 'ARTS',
    streamLabel: 'B.A. Arts Honours',
    code: 'ENG',
    established: 2004,
    degree: 'B.A. (Honours) in English — FYUGP 4-Year',
    intake: 60,
    tagline: 'Cultivating critical inquiry, literary appreciation, and linguistic eloquence.',
    overview:
      'The Department of English at Capital College Kohima is dedicated to providing students with rigorous intellectual training in world literatures, British and Commonwealth literature, Indian writing in English, and Naga indigenous folklore. The department fosters analytical thinking, creative writing, and advanced communicative competence essential for modern academic and professional careers.',
    vision:
      'To empower students through literary and linguistic excellence, equipping them to become articulate global communicators and culturally empathetic thinkers.',
    objectives: [
      'Provide comprehensive understanding of major literary movements, theory, and linguistic structures.',
      'Develop sharp analytical, rhetorical, and creative writing abilities through student seminars and journals.',
      'Document and critically analyze oral literatures and indigenous cultural narratives of Nagaland.',
      'Prepare graduates for civil services, media, publishing, higher research, and pedagogical careers.'
    ],
    curriculum: [
      { code: 'ENG-101', title: 'Indian Classical Literature & Naga Oral Narratives', sem: 'Semester I', credits: 4 },
      { code: 'ENG-102', title: 'European Classical Literature & Greek Drama', sem: 'Semester I', credits: 4 },
      { code: 'ENG-201', title: 'British Poetry & Drama (14th to 17th Century)', sem: 'Semester II', credits: 4 },
      { code: 'ENG-202', title: 'Academic Writing & Compositional Rhetoric', sem: 'Semester II', credits: 4 },
      { code: 'ENG-301', title: 'Romantic & Victorian Literary Traditions', sem: 'Semester III', credits: 4 },
      { code: 'ENG-401', title: 'Post-Colonial Literatures & Modern Critical Theory', sem: 'Semester IV', credits: 4 },
      { code: 'ENG-501', title: 'Literary Criticism & Contemporary Cultural Studies', sem: 'Semester V', credits: 4 },
      { code: 'ENG-601', title: 'Undergraduate Dissertation & Research Project', sem: 'Semester VI', credits: 6 }
    ],
    facilities: [
      'Departmental Seminar Library with 1,200+ curated literary texts and critical monographs.',
      'Language Proficiency & Communication Laboratory.',
      'CCHE Literary Club & Annual College Magazine Editorial Desk.',
      'Creative Writing and Debate Society.'
    ],
    careerPaths: ['Civil & Administrative Services', 'Publishing & Journalism', 'Content Strategy & Media', 'Teaching & Academia', 'Creative Writing & Research']
  },

  history: {
    id: 'history',
    slug: 'history',
    name: 'Department of History',
    stream: 'ARTS',
    streamLabel: 'B.A. Arts Honours',
    code: 'HIS',
    established: 2004,
    degree: 'B.A. (Honours) in History — FYUGP 4-Year',
    intake: 60,
    tagline: 'Understanding human heritage, historical trajectories, and socio-political evolution.',
    overview:
      'The Department of History offers deep historical inquiry spanning ancient world civilizations, medieval and modern Indian history, and specialized modules on Northeast India and Naga history. Students gain rigorous methodological training in archival analysis, historiography, and empirical documentation of cultural heritage.',
    vision:
      'To build a historical consciousness that inspires civic responsibility, critical judgment, and preservation of local and global heritage.',
    objectives: [
      'Inculcate analytical understanding of key historical processes, state formation, and socio-economic systems.',
      'Emphasize local history, tribal institutions, and oral historical methodologies in Northeast India.',
      'Promote field trips, archival visits, and museum internships for hands-on historical learning.',
      'Equip students for administrative competitive examinations, heritage management, and research.'
    ],
    curriculum: [
      { code: 'HIS-101', title: 'History of India from the Earliest Times to c. 300 CE', sem: 'Semester I', credits: 4 },
      { code: 'HIS-102', title: 'Social Formations & Cultural Patterns of Ancient World', sem: 'Semester I', credits: 4 },
      { code: 'HIS-201', title: 'History of India (c. 300 to 1206 CE)', sem: 'Semester II', credits: 4 },
      { code: 'HIS-301', title: 'History of Northeast India (Early to 1972)', sem: 'Semester III', credits: 4 },
      { code: 'HIS-401', title: 'Rise of the Modern West & European Revolutions', sem: 'Semester IV', credits: 4 },
      { code: 'HIS-501', title: 'Naga History & Tribal Customary Institutions', sem: 'Semester V', credits: 4 },
      { code: 'HIS-601', title: 'Historiography & Research Methodology Project', sem: 'Semester VI', credits: 6 }
    ],
    facilities: [
      'Departmental Historical Archive and Naga Artefacts Documentation Cell.',
      'Field survey equipment and oral history recording station.',
      'Historical Society & Heritage Excursion Forum.'
    ],
    careerPaths: ['UPSC & NPSC Civil Services', 'Archaeology & Heritage Tourism', 'Museum Curation & Archives', 'Teaching & Research', 'Legal & Policy Analysis']
  },

  'political-science': {
    id: 'political-science',
    slug: 'political-science',
    name: 'Department of Political Science',
    stream: 'ARTS',
    streamLabel: 'B.A. Arts Honours',
    code: 'POL',
    established: 2004,
    degree: 'B.A. (Honours) in Political Science — FYUGP 4-Year',
    intake: 60,
    tagline: 'Analyzing governance, constitutional democracy, and international relations.',
    overview:
      'The Department of Political Science is one of the premier academic divisions at Capital College Kohima. It prepares students with comprehensive grounding in political theory, comparative government, public administration, Indian constitutional law, and international affairs. It cultivates civic awareness and constitutional stewardship.',
    vision:
      'To nurture informed, active, and ethically grounded citizens capable of contributing meaningfully to democratic governance and public policy.',
    objectives: [
      'Impart robust theoretical foundation in Western and Indian political thought.',
      'Analyze the dynamics of Indian federalism, local self-governing bodies, and constitutional provisions.',
      'Examine international politics, regional security, and diplomacy in contemporary geopolitics.',
      'Foster debating, mock parliaments, and public policy problem-solving skills.'
    ],
    curriculum: [
      { code: 'POL-101', title: 'Understanding Political Theory & Concepts', sem: 'Semester I', credits: 4 },
      { code: 'POL-102', title: 'Constitutional Government & Democracy in India', sem: 'Semester I', credits: 4 },
      { code: 'POL-201', title: 'Political Processes in India & State Politics', sem: 'Semester II', credits: 4 },
      { code: 'POL-301', title: 'Introduction to Comparative Government & Politics', sem: 'Semester III', credits: 4 },
      { code: 'POL-401', title: 'Global Politics & International Relations', sem: 'Semester IV', credits: 4 },
      { code: 'POL-501', title: 'Public Policy, Governance & Administration in India', sem: 'Semester V', credits: 4 },
      { code: 'POL-601', title: 'Contemporary Political Issues & Research Dissertation', sem: 'Semester VI', credits: 6 }
    ],
    facilities: [
      'Youth Parliament and Electoral Literacy Club.',
      'Departmental Policy & Constitutional Law Library.',
      'Mock Assembly & Public Debate Podium.'
    ],
    careerPaths: ['Administrative Services (NPSC / UPSC)', 'Law & Judiciary', 'Public Policy & Think Tanks', 'Political Journalism & Media', 'NGO & International Development']
  },

  sociology: {
    id: 'sociology',
    slug: 'sociology',
    name: 'Department of Sociology',
    stream: 'ARTS',
    streamLabel: 'B.A. Arts Honours',
    code: 'SOC',
    established: 2004,
    degree: 'B.A. (Honours) in Sociology — FYUGP 4-Year',
    intake: 60,
    tagline: 'Investigating social structures, tribal transformations, and human communities.',
    overview:
      'The Department of Sociology provides scientific inquiry into society, social institutions, tribal customs, kinship, gender dynamics, and social change in Northeast India. Students are trained in quantitative and qualitative sociological field methods, community research, and developmental sociology.',
    vision:
      'To build sociological insight and empathetic understanding of societal complexities, fostering inclusive community growth.',
    objectives: [
      'Provide strong conceptual grounding in classical and contemporary sociological theories.',
      'Equip students with sociological research methodologies and field fieldwork skills.',
      'Analyze tribal social structures, modernization, urbanization, and youth culture in Nagaland.',
      'Address social problems like inequality, health, environmental justice, and community resilience.'
    ],
    curriculum: [
      { code: 'SOC-101', title: 'Introduction to Sociology: Concepts & Perspectives', sem: 'Semester I', credits: 4 },
      { code: 'SOC-102', title: 'Sociology of India & Social Stratification', sem: 'Semester I', credits: 4 },
      { code: 'SOC-201', title: 'Classical Sociological Thinkers (Marx, Weber, Durkheim)', sem: 'Semester II', credits: 4 },
      { code: 'SOC-301', title: 'Sociology of Tribal Societies with focus on Northeast India', sem: 'Semester III', credits: 4 },
      { code: 'SOC-401', title: 'Social Research Methods & Fieldwork Techniques', sem: 'Semester IV', credits: 4 },
      { code: 'SOC-501', title: 'Gender, Society & Social Development', sem: 'Semester V', credits: 4 },
      { code: 'SOC-601', title: 'Community Fieldwork Project & Monograph', sem: 'Semester VI', credits: 6 }
    ],
    facilities: [
      'Sociological Field Survey & Data Analytics Desk.',
      'Community Outreach & Village Social Impact Cell.',
      'Departmental Reference Collection on Tribal Studies.'
    ],
    careerPaths: ['Social Work & Community Development', 'Corporate Social Responsibility (CSR)', 'Public Administration', 'Human Resource Management', 'Academic Research & Field Analysis']
  },

  education: {
    id: 'education',
    slug: 'education',
    name: 'Department of Education',
    stream: 'ARTS',
    streamLabel: 'B.A. Arts Honours',
    code: 'EDU',
    established: 2005,
    degree: 'B.A. (Honours) in Education — FYUGP 4-Year',
    intake: 50,
    tagline: 'Shaping pedagogical paradigms, psychological foundations, and educational leadership.',
    overview:
      'The Department of Education investigates philosophical, psychological, and sociological foundations of learning. It emphasizes curriculum development, educational technology, teacher training methodologies, and educational administration tailored to the modern NEP 2020 framework.',
    vision:
      'To mold visionary educators, counselors, and educational administrators dedicated to holistic learning.',
    objectives: [
      'Examine philosophical and sociological doctrines underpinning educational systems.',
      'Develop mastery over educational psychology, child development, and counseling techniques.',
      'Train students in modern instructional technologies, evaluation tools, and classroom management.',
      'Conduct school visits and pedagogical internships across Kohima educational institutions.'
    ],
    curriculum: [
      { code: 'EDU-101', title: 'Philosophical Foundations of Education', sem: 'Semester I', credits: 4 },
      { code: 'EDU-102', title: 'Psychological Foundations of Learning', sem: 'Semester I', credits: 4 },
      { code: 'EDU-201', title: 'Development of Education in India & NEP Policies', sem: 'Semester II', credits: 4 },
      { code: 'EDU-301', title: 'Curriculum Development & Instructional Design', sem: 'Semester III', credits: 4 },
      { code: 'EDU-401', title: 'Educational Guidance & Psychological Counseling', sem: 'Semester IV', credits: 4 },
      { code: 'EDU-501', title: 'Educational Measurement, Assessment & Statistics', sem: 'Semester V', credits: 4 },
      { code: 'EDU-601', title: 'Institutional Internship & Educational Research Project', sem: 'Semester VI', credits: 6 }
    ],
    facilities: [
      'Psychological Assessment & Testing Laboratory.',
      'Smart Teaching Practice & Educational Technology Cell.',
      'School Internship Coordination Unit.'
    ],
    careerPaths: ['School & College Teaching', 'Educational Counseling & Guidance', 'Curriculum Designing & EdTech', 'Educational Administration & DIET', 'Civil Services']
  },

  economics: {
    id: 'economics',
    slug: 'economics',
    name: 'Department of Economics',
    stream: 'ARTS',
    streamLabel: 'B.A. Arts Honours',
    code: 'ECO',
    established: 2005,
    degree: 'B.A. (Honours) in Economics — FYUGP 4-Year',
    intake: 50,
    tagline: 'Analyzing macroeconomic trends, developmental policies, and regional economies.',
    overview:
      'The Department of Economics provides students with deep analytical training in microeconomic theory, macroeconomics, public finance, developmental economics, and quantitative data analysis. It provides practical focus on hill economies, rural banking, and entrepreneurship in Northeast India.',
    vision:
      'To develop economically astute minds skilled in quantitative analysis and capable of formulating sustainable development policies.',
    objectives: [
      'Build strong understanding of market mechanisms, fiscal policies, and economic systems.',
      'Train students in statistical tools, economic modeling, and empirical research.',
      'Explore hill agriculture, organic farming economies, and infrastructure financing in Nagaland.',
      'Prepare graduates for banking, corporate finance, economic planning, and statistical services.'
    ],
    curriculum: [
      { code: 'ECO-101', title: 'Introductory Microeconomics: Consumer & Producer Theory', sem: 'Semester I', credits: 4 },
      { code: 'ECO-102', title: 'Mathematical & Statistical Methods for Economics', sem: 'Semester I', credits: 4 },
      { code: 'ECO-201', title: 'Introductory Macroeconomics: National Income & Fiscal Policy', sem: 'Semester II', credits: 4 },
      { code: 'ECO-301', title: 'Development Economics & Environmental Sustainability', sem: 'Semester III', credits: 4 },
      { code: 'ECO-401', title: 'Public Finance, Taxation & Monetary Economics', sem: 'Semester IV', credits: 4 },
      { code: 'ECO-501', title: 'Economy of Northeast India & Nagaland State Finances', sem: 'Semester V', credits: 4 },
      { code: 'ECO-601', title: 'Applied Econometric Research & Project Dissertation', sem: 'Semester VI', credits: 6 }
    ],
    facilities: [
      'Economic Data & Financial Literacy Center.',
      'Statistical Computing & Budget Analysis Workstation.',
      'CCHE Economics & Commerce Forum.'
    ],
    careerPaths: ['Banking & Financial Services', 'Economic Advisory & Statistical Services (ISS)', 'Civil Services', 'Data Analytics & Market Research', 'Corporate Strategy & Trade']
  },

  tenyidie: {
    id: 'tenyidie',
    slug: 'tenyidie',
    name: 'Department of Tenyidie',
    stream: 'ARTS',
    streamLabel: 'B.A. Arts Honours',
    code: 'TEN',
    established: 2007,
    degree: 'B.A. (Honours) in Tenyidie — FYUGP 4-Year',
    intake: 40,
    tagline: 'Preserving indigenous mother tongue, linguistic heritage, and folklore traditions.',
    overview:
      'The Department of Tenyidie is committed to the advancement, research, and preservation of Tenyidie literature, linguistics, cultural grammar, and folklore traditions. The department trains scholars who document indigenous Naga linguistic heritage and advance literary translation.',
    vision:
      'To celebrate and enrich indigenous linguistic identity through rigorous literary creation and philological research.',
    objectives: [
      'Provide comprehensive understanding of Tenyidie orthography, syntax, and literary canon.',
      'Promote scholarly research into oral narratives, proverbs, poetry, and traditional music.',
      'Develop translation capabilities between Tenyidie, English, and other regional languages.',
      'Train language teachers and cultural custodians for schools, media, and publishing houses.'
    ],
    curriculum: [
      { code: 'TEN-101', title: 'Tenyidie Poetry & Classical Prose', sem: 'Semester I', credits: 4 },
      { code: 'TEN-102', title: 'Cultural Heritage & Oral Traditions of the Tenyimi', sem: 'Semester I', credits: 4 },
      { code: 'TEN-201', title: 'Drama, Fiction & Modern Tenyidie Literature', sem: 'Semester II', credits: 4 },
      { code: 'TEN-301', title: 'Tenyidie Grammar, Phonetics & Lexicography', sem: 'Semester III', credits: 4 },
      { code: 'TEN-401', title: 'Translation Studies: Theory & Practice', sem: 'Semester IV', credits: 4 },
      { code: 'TEN-501', title: 'Indigenous Folklore & Ethno-Linguistic Studies', sem: 'Semester V', credits: 4 },
      { code: 'TEN-601', title: 'Field Documentation & Translation Dissertation', sem: 'Semester VI', credits: 6 }
    ],
    facilities: [
      'Tenyidie Language Archives & Cultural Documentation Desk.',
      'Indigenous Heritage & Folklore Research Center.',
      'Tenyidie Literary Club & Publishing Cell.'
    ],
    careerPaths: ['Language Teaching in Higher Secondary Schools', 'Translation & Lexicography', 'Broadcast Media & Journalism', 'Cultural Documentation & Heritage Research', 'Civil Services']
  },

  // ==========================================
  // SCIENCE STREAM DEPARTMENTS (B.Sc. Honours)
  // ==========================================
  botany: {
    id: 'botany',
    slug: 'botany',
    name: 'Department of Botany',
    stream: 'SCIENCE',
    streamLabel: 'B.Sc. Science Honours',
    code: 'BOT',
    established: 2022,
    degree: 'B.Sc. (Honours) in Botany — FYUGP 4-Year',
    intake: 40,
    tagline: 'Exploring plant diversity, bio-resources, and Himalayan flora ecology.',
    overview:
      'The Department of Botany at Capital College offers cutting-edge education in plant sciences, cellular biology, biodiversity conservation, ethnobotany, and medicinal flora of Nagaland. Positioned within the Indo-Burma biodiversity hotspot, the department emphasizes hands-on laboratory investigation and botanical field excursions.',
    vision:
      'To inspire scientific excellence in plant biology and pioneer research in conservation of bio-diverse Himalayan ecosystems.',
    objectives: [
      'Provide theoretical and practical training in cryptogamic botany, phanerogams, genetics, and biotechnology.',
      'Document indigenous medicinal plants and traditional ethnobotanical knowledge of Naga communities.',
      'Maintain well-equipped laboratory facilities for cytology, anatomy, microbiology, and plant physiology.',
      'Prepare students for botanical research, forestry, environmental consulting, and biotechnology.'
    ],
    curriculum: [
      { code: 'BOT-101', title: 'Microbiology, Algae, Fungi & Plant Pathology (Theory + Lab)', sem: 'Semester I', credits: 4 },
      { code: 'BOT-102', title: 'Archegoniate: Bryophytes, Pteridophytes & Gymnosperms', sem: 'Semester I', credits: 4 },
      { code: 'BOT-201', title: 'Plant Anatomy & Embryology of Angiosperms', sem: 'Semester II', credits: 4 },
      { code: 'BOT-301', title: 'Plant Ecology, Phytogeography & Bio-conservation', sem: 'Semester III', credits: 4 },
      { code: 'BOT-401', title: 'Plant Physiology, Biochemistry & Molecular Biology', sem: 'Semester IV', credits: 4 },
      { code: 'BOT-501', title: 'Ethnobotany & Medicinal Flora of Nagaland', sem: 'Semester V', credits: 4 },
      { code: 'BOT-601', title: 'Botanical Field Research Project & Herbarium Curation', sem: 'Semester VI', credits: 6 }
    ],
    facilities: [
      'Advanced Botanical Laboratory with binocular research microscopes, laminar air flow, and autoclaves.',
      'Departmental Herbarium with categorized specimen records of Kohima flora.',
      'Botanical Garden & Medicinal Plants Nursery.',
      'Field survey & GPS flora tracking equipment.'
    ],
    careerPaths: ['Forestry & Wildlife Management', 'Agricultural & Horticultural Research', 'Pharmaceuticals & Herbal Products', 'Biotechnology & Plant Genetics', 'Environmental Impact Assessment (EIA)']
  },

  zoology: {
    id: 'zoology',
    slug: 'zoology',
    name: 'Department of Zoology',
    stream: 'SCIENCE',
    streamLabel: 'B.Sc. Science Honours',
    code: 'ZOO',
    established: 2022,
    degree: 'B.Sc. (Honours) in Zoology — FYUGP 4-Year',
    intake: 40,
    tagline: 'Deciphering animal physiology, wildlife biodiversity, and cellular mechanisms.',
    overview:
      'The Department of Zoology provides comprehensive scientific training in non-chordate and chordate diversity, animal physiology, biochemistry, genetics, evolutionary biology, and wildlife ecology. Located in Nagaland’s rich montane habitat, the department integrates laboratory microscopy with field ecology expeditions.',
    vision:
      'To advance knowledge of animal biology, champion wildlife conservation, and cultivate biomedical inquiry.',
    objectives: [
      'Impart rigorous training in comparative animal anatomy, physiology, and developmental biology.',
      'Examine ecological dynamics of Himalayan wildlife, endangered fauna, and conservation strategies.',
      'Conduct practical investigations in histology, biochemistry, parasitology, and genetics.',
      'Prepare graduates for civil services, ecological research, fisheries, sericulture, and veterinary fields.'
    ],
    curriculum: [
      { code: 'ZOO-101', title: 'Non-Chordates: Protista to Pseudocoelomates (Theory + Lab)', sem: 'Semester I', credits: 4 },
      { code: 'ZOO-102', title: 'Principles of Ecology & Environmental Biology', sem: 'Semester I', credits: 4 },
      { code: 'ZOO-201', title: 'Diversity of Chordates & Comparative Anatomy', sem: 'Semester II', credits: 4 },
      { code: 'ZOO-301', title: 'Cell Biology, Cytogenetics & Molecular Genetics', sem: 'Semester III', credits: 4 },
      { code: 'ZOO-401', title: 'Animal Physiology: Controlling & Co-ordinating Systems', sem: 'Semester IV', credits: 4 },
      { code: 'ZOO-501', title: 'Immunology, Applied Zoology (Apiculture/Sericulture/Fisheries)', sem: 'Semester V', credits: 4 },
      { code: 'ZOO-601', title: 'Zoological Research Project & Wildlife Fieldwork', sem: 'Semester VI', credits: 6 }
    ],
    facilities: [
      'Zoological Specimen Museum showcasing diverse invertebrate and vertebrate fauna.',
      'Physiology & Biochemistry Laboratory with spectrophotometer and microtome.',
      'Field Ecology & Wildlife Survey Binoculars and camera traps.',
      'Departmental Life Sciences Library.'
    ],
    careerPaths: ['Wildlife Biology & Conservation Services', 'Biomedical & Clinical Diagnostics', 'Fisheries & Aquaculture Management', 'Sericulture & Apiculture Entrepreneurship', 'Civil Services & Environmental Law']
  },

  chemistry: {
    id: 'chemistry',
    slug: 'chemistry',
    name: 'Department of Chemistry',
    stream: 'SCIENCE',
    streamLabel: 'B.Sc. Science Honours',
    code: 'CHE',
    established: 2022,
    degree: 'B.Sc. (Honours) in Chemistry — FYUGP 4-Year',
    intake: 35,
    tagline: 'Bridging molecular discovery, chemical synthesis, and green chemistry solutions.',
    overview:
      'The Department of Chemistry offers a modern curriculum in inorganic, organic, and physical chemistry. The department emphasizes laboratory safety, quantitative chemical analysis, spectroscopic characterization, and green chemical principles relevant to environmental chemistry and material sciences.',
    vision:
      'To inspire curiosity in the molecular world and develop innovative chemical solutions for human health and the environment.',
    objectives: [
      'Build thorough foundation in atomic structure, chemical bonding, thermodynamics, and reaction mechanisms.',
      'Train students in volumetric, gravimetric, organic synthesis, and instrumental chemical analysis.',
      'Emphasize green chemistry, water testing, and soil health analysis in rural Nagaland.',
      'Prepare students for higher research in chemical sciences, chemical manufacturing, and competitive exams.'
    ],
    curriculum: [
      { code: 'CHE-101', title: 'Inorganic Chemistry: Atomic Structure & Chemical Bonding', sem: 'Semester I', credits: 4 },
      { code: 'CHE-102', title: 'Physical Chemistry: States of Matter & Chemical Kinetics', sem: 'Semester I', credits: 4 },
      { code: 'CHE-201', title: 'Organic Chemistry: Hydrocarbons & Stereochemistry', sem: 'Semester II', credits: 4 },
      { code: 'CHE-301', title: 'Transition Elements, Coordination Chemistry & Organometallics', sem: 'Semester III', credits: 4 },
      { code: 'CHE-401', title: 'Chemical Thermodynamics, Electrochemistry & Quantum Chemistry', sem: 'Semester IV', credits: 4 },
      { code: 'CHE-501', title: 'Spectroscopy, Analytical & Green Environmental Chemistry', sem: 'Semester V', credits: 4 },
      { code: 'CHE-601', title: 'Experimental Chemistry Project & Instrumental Dissertation', sem: 'Semester VI', credits: 6 }
    ],
    facilities: [
      'Modern Wet Chemical Laboratory with fume hoods, digital balances, and distillation units.',
      'Instrumental Analysis Room (pH meters, colorimeters, conductometers, UV-Vis units).',
      'Safety Showers, Eye Wash Stations, and Fire Suppression safety protocols.',
      'Reagent Storage and Waste Neutralization Facility.'
    ],
    careerPaths: ['Chemical Analysis & Quality Control', 'Pharmaceuticals & Food Testing', 'Environmental & Water Quality Labs', 'Forensic Sciences', 'Academia & Higher Research']
  },

  mathematics: {
    id: 'mathematics',
    slug: 'mathematics',
    name: 'Department of Mathematics & Physics',
    stream: 'SCIENCE',
    streamLabel: 'B.Sc. Science Honours',
    code: 'MAT',
    established: 2022,
    degree: 'B.Sc. (Honours) in Mathematics — FYUGP 4-Year',
    intake: 35,
    tagline: 'Cultivating abstract reasoning, mathematical modeling, and quantitative rigor.',
    overview:
      'The Department of Mathematics & Physics at Capital College Kohima delivers rigorous training in calculus, linear algebra, differential equations, real analysis, mechanics, and computational modeling. The curriculum provides analytical and algorithmic tools that serve as the foundation for modern science, technology, and data science.',
    vision:
      'To cultivate logical rigor, mathematical creativity, and computational prowess for scientific breakthroughs.',
    objectives: [
      'Inculcate deep mastery over pure and applied mathematics.',
      'Develop problem-solving techniques applicable to physics, cryptography, and engineering modeling.',
      'Introduce numerical methods, scientific computing, and statistical programming.',
      'Prepare students for competitive examinations, data analytics, actuarial sciences, and research.'
    ],
    curriculum: [
      { code: 'MAT-101', title: 'Calculus, Analytical Geometry & Vector Analysis', sem: 'Semester I', credits: 4 },
      { code: 'MAT-102', title: 'Algebra: Matrix Theory, Systems of Linear Equations', sem: 'Semester I', credits: 4 },
      { code: 'MAT-201', title: 'Real Analysis & Differential Equations', sem: 'Semester II', credits: 4 },
      { code: 'MAT-301', title: 'Group Theory, Ring Theory & Abstract Algebra', sem: 'Semester III', credits: 4 },
      { code: 'MAT-401', title: 'Complex Analysis, Mechanics & Classical Dynamics', sem: 'Semester IV', credits: 4 },
      { code: 'MAT-501', title: 'Numerical Analysis, Probability & Mathematical Statistics', sem: 'Semester V', credits: 4 },
      { code: 'MAT-601', title: 'Mathematical Modeling & Computational Project', sem: 'Semester VI', credits: 6 }
    ],
    facilities: [
      'Computational Mathematics Lab equipped with statistical software and modeling tools.',
      'Departmental Mathematical Library with classical texts and problem-solving journals.',
      'Problem Solving & Quantitative Aptitude Forum.'
    ],
    careerPaths: ['Data Science & Analytics', 'Actuarial Sciences & Risk Analysis', 'Information Technology & Software', 'Banking, Finance & Operations Research', 'Higher Research in Pure & Applied Math']
  }
};

// Helper lists
export const ARTS_DEPARTMENTS = Object.values(DEPARTMENTS).filter((d) => d.stream === 'ARTS');
export const SCIENCE_DEPARTMENTS = Object.values(DEPARTMENTS).filter((d) => d.stream === 'SCIENCE');
export const ALL_DEPARTMENTS = Object.values(DEPARTMENTS);

export function getDepartmentBySlug(slug) {
  if (!slug) return null;
  const clean = slug.toLowerCase().trim().replace(/^department-/, '');
  if (DEPARTMENTS[clean]) return DEPARTMENTS[clean];
  return Object.values(DEPARTMENTS).find(
    (d) =>
      d.slug === clean ||
      d.code.toLowerCase() === clean ||
      d.name.toLowerCase().includes(clean)
  ) || null;
}
