const mysql = require('mysql2/promise');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
require('dotenv').config();

let dbType = 'none';
let mysqlPool = null;
let sqliteDb = null;

// Initialize SQLite fallback database
async function initSQLite() {
  const dataDir = path.join(__dirname, '..', 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  const dbFile = path.join(dataDir, 'capital_college.sqlite');

  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(dbFile, async (err) => {
      if (err) return reject(err);
      sqliteDb = db;
      dbType = 'sqlite';
      console.log('📦 Using persistent local SQLite storage (data/capital_college.sqlite)');
      await setupSQLiteTables(db);
      resolve();
    });
  });
}

function runSQLite(db, sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
}

function allSQLite(db, sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

async function setupSQLiteTables(db) {
  await runSQLite(db, `
    CREATE TABLE IF NOT EXISTS courses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      stream TEXT NOT NULL,
      course_name TEXT NOT NULL,
      degree_type TEXT NOT NULL DEFAULT 'Four Years Under Graduate Programme (FYUGP)',
      description TEXT,
      eligibility TEXT,
      duration TEXT DEFAULT '4 Years (8 Semesters)',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await runSQLite(db, `
    CREATE TABLE IF NOT EXISTS notices (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      category TEXT DEFAULT 'Notice',
      item_type TEXT DEFAULT 'notice',
      summary TEXT,
      content TEXT,
      event_date TEXT,
      image_url TEXT,
      link_url TEXT,
      pdf_url TEXT,
      pdf_name TEXT,
      is_featured INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Safe Alter Table migrations in case columns do not exist yet
  try { await runSQLite(db, "ALTER TABLE notices ADD COLUMN item_type TEXT DEFAULT 'notice'"); } catch (e) {}
  try { await runSQLite(db, "ALTER TABLE notices ADD COLUMN pdf_url TEXT"); } catch (e) {}
  try { await runSQLite(db, "ALTER TABLE notices ADD COLUMN pdf_name TEXT"); } catch (e) {}

  await runSQLite(db, `
    CREATE TABLE IF NOT EXISTS applications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      application_no TEXT NOT NULL UNIQUE,
      full_name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      dob TEXT NOT NULL,
      gender TEXT NOT NULL,
      category TEXT DEFAULT 'ST',
      stream TEXT NOT NULL,
      course_type TEXT NOT NULL DEFAULT 'HONOURS',
      major_subject TEXT NOT NULL,
      minor_subjects TEXT,
      marks_10th REAL,
      marks_12th REAL NOT NULL,
      previous_school TEXT,
      board_name TEXT DEFAULT 'NBSE',
      guardian_name TEXT NOT NULL,
      guardian_phone TEXT NOT NULL,
      address TEXT NOT NULL,
      status TEXT DEFAULT 'PENDING',
      remarks TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await runSQLite(db, `
    CREATE TABLE IF NOT EXISTS inquiries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      full_name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      subject TEXT NOT NULL,
      message TEXT NOT NULL,
      status TEXT DEFAULT 'UNREAD',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await runSQLite(db, `
    CREATE TABLE IF NOT EXISTS faculty (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      stream TEXT NOT NULL,
      department TEXT NOT NULL,
      qualification TEXT,
      designation TEXT NOT NULL,
      is_hod INTEGER DEFAULT 0,
      image_url TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  try {
    await runSQLite(db, `ALTER TABLE faculty ADD COLUMN image_url TEXT`);
  } catch (e) {
    // Column may already exist
  }

  await runSQLite(db, `
    CREATE TABLE IF NOT EXISTS admin_users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      email TEXT NOT NULL,
      full_name TEXT NOT NULL,
      role TEXT DEFAULT 'ADMIN',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await runSQLite(db, `
    CREATE TABLE IF NOT EXISTS notifications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      application_no TEXT NOT NULL,
      recipient_email TEXT,
      recipient_phone TEXT,
      status TEXT NOT NULL,
      title TEXT NOT NULL,
      message TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await runSQLite(db, `
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Seed default settings if empty
  const countSettings = await allSQLite(db, `SELECT COUNT(*) as cnt FROM settings`);
  if (countSettings[0].cnt === 0) {
    console.log('⚙️ Initializing institutional admission control settings (Closed for now)...');
    await runSQLite(db, `
      INSERT INTO settings (key, value) VALUES
      ('admissions_open', 'false'),
      ('admissions_notice', 'Online admissions for FYUGP 4-Year B.A. & B.Sc. programmes are closed for now. Please download the official print form (PDF) or visit the college office at P.R. Hill, Kohima.'),
      ('academic_year', '2024-25'),
      ('contact_email', 'principal@capitalcollege.edu.in'),
      ('contact_phone', '+91 9436002789')
    `);
  }

  // Seed default admin if empty
  const countAdmins = await allSQLite(db, `SELECT COUNT(*) as cnt FROM admin_users`);
  if (countAdmins[0].cnt === 0) {
    console.log('🌱 Seeding confidential admin user...');
    await runSQLite(db, `
      INSERT INTO admin_users (username, password, email, full_name, role)
      VALUES (?, ?, ?, ?, ?)
    `, ['admin', 'Capital@2024', 'principal@capitalcollege.edu.in', 'College Administrator', 'SUPER_ADMIN']);
  }

  // Seed courses if empty
  const countCourses = await allSQLite(db, `SELECT COUNT(*) as cnt FROM courses`);
  if (countCourses[0].cnt === 0) {
    console.log('🌱 Seeding initial courses...');
    const courses = [
      ['ARTS', 'Economics (Honours & General)', 'FYUGP Bachelor of Arts (B.A.)', 'Study micro/macro economics, development theories, Indian economic system and public finance under Nagaland University.', '10+2 / HSSLC passed or equivalent stage of education corresponding to level-4.'],
      ['ARTS', 'Education (Honours & General)', 'FYUGP Bachelor of Arts (B.A.)', 'Explores educational philosophies, child psychology, curriculum development, and modern teaching methodologies.', '10+2 / HSSLC passed or equivalent stage of education corresponding to level-4.'],
      ['ARTS', 'English (Honours & General)', 'FYUGP Bachelor of Arts (B.A.)', 'Comprehensive study of British, American, Indian English Literature, Linguistics, and critical literary theory.', '10+2 / HSSLC passed or equivalent stage of education corresponding to level-4.'],
      ['ARTS', 'History (Honours & General)', 'FYUGP Bachelor of Arts (B.A.)', 'Covers Ancient, Medieval, Modern Indian History, History of Northeast India, and World Civilization.', '10+2 / HSSLC passed or equivalent stage of education corresponding to level-4.'],
      ['ARTS', 'Political Science (Honours & General)', 'FYUGP Bachelor of Arts (B.A.)', 'Focus on political theory, Indian political system, international relations, and public administration.', '10+2 / HSSLC passed or equivalent stage of education corresponding to level-4.'],
      ['ARTS', 'Sociology (Honours & General)', 'FYUGP Bachelor of Arts (B.A.)', 'In-depth analysis of social institutions, tribal societies of Northeast India, sociological thought, and research methods.', '10+2 / HSSLC passed or equivalent stage of education corresponding to level-4.'],
      ['ARTS', 'Tenyidie (Honours & General)', 'FYUGP Bachelor of Arts (B.A.)', 'Indigenous linguistic and literary studies in Tenyidie language, poetry, folklore, and cultural history.', '10+2 / HSSLC passed or equivalent stage of education corresponding to level-4.'],
      ['SCIENCE', 'Botany (Honours & General)', 'FYUGP Bachelor of Science (B.Sc.)', 'Plant anatomy, morphology, biodiversity, physiology, ecology, genetics, and biotechnology.', '10+2 / HSSLC Science with Biology/Botany from recognized board.'],
      ['SCIENCE', 'Chemistry (Honours & General)', 'FYUGP Bachelor of Science (B.Sc.)', 'Inorganic, Organic, and Physical Chemistry with advanced lab coursework and analytical methods.', '10+2 / HSSLC Science with Chemistry from recognized board.'],
      ['SCIENCE', 'Mathematics (Honours & General)', 'FYUGP Bachelor of Science (B.Sc.)', 'Differential calculus, integral calculus, real analysis, abstract algebra, differential equations, linear algebra, numerical analysis, and mathematical modeling.', '10+2 / HSSLC Science with Mathematics from recognized board.'],
      ['SCIENCE', 'Physics (Honours & General)', 'FYUGP Bachelor of Science (B.Sc.)', 'Classical mechanics, quantum mechanics, electromagnetism, optics, electronics, and solid state physics.', '10+2 / HSSLC Science with Physics & Mathematics.'],
      ['SCIENCE', 'Zoology (Honours & General)', 'FYUGP Bachelor of Science (B.Sc.)', 'Animal biodiversity, evolutionary biology, physiology, cell biology, and wildlife conservation.', '10+2 / HSSLC Science with Biology/Zoology from recognized board.']
    ];
    for (const c of courses) {
      await runSQLite(db, `INSERT INTO courses (stream, course_name, degree_type, description, eligibility) VALUES (?, ?, ?, ?, ?)`, c);
    }
  }

  // Seed notices if empty
  const countNotices = await allSQLite(db, `SELECT COUNT(*) as cnt FROM notices`);
  if (countNotices[0].cnt === 0) {
    console.log('🌱 Seeding authentic college updates...');
    const notices = [
      ['ECO CLUB Trekking to Pulie Badze', 'Activities', 'CCHE ECO Club organised a trekking to Pulie Badze spreading awareness about environmental issues, where students were encouraged to preserve nature.', 'CCHE ECO Club organised a trekking to Pulie Badze on 25th April 2026 spreading awareness about environmental issues. Students are encouraged to take active roles in biodiversity protection.', 'May 5, 2026', 'https://capitalcollege.edu.in/wp-content/uploads/2026/05/WhatsApp-Image-2026-05-05-at-4.12.03-PM.jpeg', 1],
      ['Blood Test Camp organised by Red Ribbon Club (RRC)', 'Health & Social', 'CCHE Red Ribbon Club organised a Blood Group test. Mr. Temsuwapang, NSS Nodal Officer chaired the event.', 'CCHE Red Ribbon Club organised a Blood Group test on 2nd May 2026. Mr. Temsuwapang, NSS Nodal Officer chaired the session emphasizing the importance of knowing one blood group and voluntary blood donation.', 'May 5, 2026', 'https://capitalcollege.edu.in/wp-content/uploads/2026/05/WhatsApp-Image-2026-05-05-at-4.19.40-PM.jpeg', 1],
      ['NSS Special Camp 2025', 'NSS', 'NSS CCHE Unit conducted Special Camp for the year 2025 on 24th-26th October, 2025 at Mezo Basa, Primary School.', 'NSS CCHE Unit conducted Special Camp for the year 2025 on 24th-26th October, 2025 at Mezo Basa, Primary School with community development and sanitation drives.', 'October 26, 2025', 'https://capitalcollege.edu.in/wp-content/uploads/2025/10/WhatsApp-Image-2025-10-26-at-8.42.53-AM.jpeg', 1],
      ['Trifecta 2025', 'College Fest', 'CCHE conducted Trifecta on 29th-30th September, 2025 celebrating culture, arts, and competitive student talents.', 'Capital College of Higher Education hosts annual Trifecta fest in Kohima celebrating youth empowerment, sports, and cultural harmony.', 'September 30, 2025', 'https://capitalcollege.edu.in/wp-content/uploads/2025/10/Trifecta-2025.jpg', 1],
      ['Anti Ragging Day/ Week 2025 Observed', 'Campus Integrity', 'Capital College of Higher Education organized National Anti Ragging on the theme "Youth Against Ragging" held on August 12, 2025.', 'Capital College of Higher Education organized National Anti Ragging on the theme "Youth Against Ragging" and held on August 12, 2025 to reaffirm our 100% ragging-free campus pledge.', 'August 12, 2025', 'https://capitalcollege.edu.in/wp-content/uploads/2025/08/Anti-Ragging-500x500.jpg', 0],
      ['Fresher’s Meet 2025', 'Events', 'Capital College of Higher Education (CCHE) hosted its 18th Freshers Day at State Academy Hall in Kohima.', 'On August 5, 2025, Capital College of Higher Education (CCHE) hosted its 18th Freshers Day at State Academy Hall in Kohima welcoming the new batch into the academic family.', 'August 5, 2025', 'https://capitalcollege.edu.in/wp-content/uploads/2025/08/teachers-with-freshers-copy-500x500.jpg', 0],
      ['Teacher’s Orientation Programme', 'Faculty Development', 'Internal Quality Assurance Cell (IQAC) of Capital College conducted a Teachers’ Orientation Programme on Transformative Pedagogy.', 'Internal Quality Assurance Cell (IQAC) of Capital College conducted a Teachers’ Orientation Programme, under the theme "Transformative Pedagogy for Higher Education".', 'July 22, 2025', 'https://capitalcollege.edu.in/wp-content/uploads/2025/07/WhatsApp-Image-2025-07-22-at-10.59.40-AM-scaled.jpeg', 0]
    ];
    for (const n of notices) {
      await runSQLite(db, `INSERT INTO notices (title, category, item_type, summary, content, event_date, image_url, is_featured) VALUES (?, ?, 'event', ?, ?, ?, ?, ?)`, [n[0], n[1], n[2], n[3], n[4], n[5], n[6]]);
    }
  }

  // Ensure all existing event categories have item_type = 'event'
  await runSQLite(db, `UPDATE notices SET item_type = 'event' WHERE category IN ('Activities', 'Health & Social', 'NSS', 'College Fest', 'Events', 'Campus Integrity', 'Faculty Development', 'IQAC') AND (item_type IS NULL OR item_type = 'notice')`);

  // Ensure official notices / notice board items never pollute the Homepage Events Showcase (is_featured = 0)
  await runSQLite(db, `UPDATE notices SET is_featured = 0 WHERE item_type = 'notice' OR category IN ('Notice', 'Examination', 'Admissions', 'Administrative Circular', 'Academic Circular', 'Student Welfare')`);

  // Seed authentic official notices if none exist
  const countOfficialNotices = await allSQLite(db, `SELECT COUNT(*) as cnt FROM notices WHERE item_type = 'notice'`);
  if (countOfficialNotices[0].cnt === 0) {
    console.log('🌱 Seeding authentic official college notices...');
    const officialNotices = [
      [
        'Nagaland University Under Graduate Examination Routine 2024',
        'Examination',
        'notice',
        'Notification regarding the schedule of B.A. & B.Sc. 2nd, 4th, and 6th Semester End Term Examinations under Nagaland University.',
        'All regular and backlog undergraduate students of Capital College of Higher Education are hereby notified that Nagaland University has released the official End Term Examination Routine for 2nd, 4th, and 6th Semesters. Download the attached official schedule (PDF) for department-wise dates, session timings, and examination center codes.',
        'August 14, 2024',
        'https://capitalcollege.edu.in/wp-content/uploads/2026/01/Notice-1-1024x1024.jpg',
        'https://capitalcollege.edu.in/under-graduate-exam-routine-2023/',
        'https://capitalcollege.edu.in/wp-content/uploads/2023/05/UG-Examination-Routine-2023.pdf',
        'NU_UG_Exam_Routine_2024.pdf',
        0
      ],
      [
        'Official Institutional Notification — Academic Operations & Campus Schedule',
        'Administrative Circular',
        'notice',
        'Office of the Principal circular regarding class schedules, attendance norms, and upcoming holiday observances at Kohima campuses.',
        'Issued by the Office of the Principal, Capital College of Higher Education (P.R. Hill, Kohima). All students and faculty members are directed to adhere to the revised lecture hours and 75% minimum semester attendance criteria as mandated by Nagaland University FYUGP guidelines.',
        'August 2, 2024',
        'https://capitalcollege.edu.in/wp-content/uploads/2026/01/Notice-1-1024x1024.jpg',
        '',
        '',
        '',
        0
      ],
      [
        'Offline Admission Form 2024-25 Availability & Submission Schedule',
        'Admissions',
        'notice',
        'Official circular regarding offline submission of admission forms for 4-Year FYUGP B.A. and B.Sc. honours programmes.',
        'Students seeking admission to 1st Semester B.A. (Arts) and B.Sc. (Science) for the academic session 2024-25 may download the official print admission form (PDF) or collect it from the college administrative office at P.R. Hill, Kohima. Duly filled forms with NBSE marksheets and certificates must be submitted before the cutoff date.',
        'July 15, 2024',
        '',
        '',
        'https://capitalcollege.edu.in/wp-content/uploads/2024/04/Admission-Form-2024.pdf',
        'CCHE_Admission_Form_2024.pdf',
        0
      ],
      [
        'CCHE Students Welfare Scheme — 6th Semester Applications Open',
        'Student Welfare',
        'notice',
        'Applications invited for 2-student quota tuition fee assistance under CCHE Scheme for Economically Weak Students.',
        'Applications are invited from deserving 6th Semester students for the CCHE Students Welfare Scheme. Candidates must possess minimum 75% attendance across preceding semesters and submit a handwritten application accompanied by parent/guardian interview with the Selection Committee.',
        'June 28, 2024',
        '',
        'https://capitalcollege.edu.in/cche-scheme-for-economically-weak-students/',
        'https://capitalcollege.edu.in/wp-content/uploads/2024/04/CCHE-Prospectus-2024-05.pdf',
        'CCHE_Welfare_Scheme_Guidelines.pdf',
        0
      ],
      [
        'Nagaland University FYUGP 4-Year B.A. & B.Sc. Academic Credit Framework',
        'Academic Circular',
        'notice',
        'Guidelines on Major, Minor, Multidisciplinary, Skill Enhancement, and Research Pathway credit mobility.',
        'As per the National Education Policy (NEP 2020) implemented by Nagaland University, undergraduate honours students at Capital College are advised to verify their semester course selections with respective Heads of Departments.',
        'June 10, 2024',
        '',
        'https://nagalanduniversity.ac.in',
        '',
        '',
        0
      ]
    ];
    for (const on of officialNotices) {
      await runSQLite(db, `
        INSERT INTO notices (title, category, item_type, summary, content, event_date, image_url, link_url, pdf_url, pdf_name, is_featured)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, on);
    }
  }

  // Seed sample applications if empty
  const countApps = await allSQLite(db, `SELECT COUNT(*) as cnt FROM applications`);
  if (countApps[0].cnt === 0) {
    console.log('🌱 Seeding initial sample application...');
    await runSQLite(db, `
      INSERT INTO applications (
        application_no, full_name, email, phone, dob, gender, category, stream,
        course_type, major_subject, marks_12th, previous_school, board_name,
        guardian_name, guardian_phone, address, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      'CCH-2024-1001', 'Kevisenuo Angami', 'kevisenuo@example.com', '9862112233', '2005-04-12', 'Female', 'ST', 'ARTS',
      'HONOURS', 'Political Science', 82.40, 'Rüzhükhrie Higher Secondary School', 'NBSE',
      'Neibou Angami', '9862112234', 'Midland, Kohima, Nagaland', 'APPROVED'
    ]);
  }

  // Seed authentic faculty directory if empty or minimal
  const countFaculty = await allSQLite(db, `SELECT COUNT(*) as cnt FROM faculty`);
  if (countFaculty[0].cnt <= 1) {
    console.log('🌱 Seeding authentic faculty directory...');
    const initialFaculty = [
      ['Dr. Rukulu Kezo Puro', 'ARTS', 'English', 'M.A., M.Phil., Ph.D., PGCTE', 'Head of Department & Principal', 1, ''],
      ['Tatongkala Lemtur Lohe', 'ARTS', 'English', 'M.A., M.Phil.', 'Assistant Professor & Dean of Students', 0, ''],
      ['Opangmenla Jamir', 'ARTS', 'English', 'M.A., B.Ed.', 'Assistant Professor & IQAC Coordinator', 0, ''],
      ['Temsuwapang Lkr', 'ARTS', 'History', 'M.A.', 'Head of Department & NSS Nodal Officer', 1, ''],
      ['Kumuni Keppen', 'ARTS', 'History', 'M.A.', 'Assistant Professor', 0, ''],
      ['Niekhoto Chürhah', 'ARTS', 'History', 'M.A.', 'Assistant Professor', 0, ''],
      ['Chubarenla Lkr', 'ARTS', 'Political Science', 'M.A., UGC-NET', 'Head of Department & Assistant Professor', 1, ''],
      ['Vungthungo', 'ARTS', 'Political Science', 'M.A., UGC-NET', 'Assistant Professor', 0, ''],
      ['Meyiepeo Puyie', 'ARTS', 'Political Science', 'M.A., UGC-NET', 'Assistant Professor', 0, ''],
      ['Kevivonu Zhotso Chishi', 'ARTS', 'Sociology', 'M.A.', 'Head of Department & Assistant Professor', 1, ''],
      ['Abeino Zashü', 'ARTS', 'Sociology', 'M.A.', 'Assistant Professor & Academic Dean', 0, ''],
      ['Vizoboto Zhotso', 'ARTS', 'Sociology', 'M.A.', 'Assistant Professor', 0, ''],
      ['Theja Lohe', 'ARTS', 'Tenyidie', 'M.A.', 'Head of Department & Assistant Professor', 1, ''],
      ['Shedulu Kezo', 'ARTS', 'Education', 'M.A., B.Ed., M.Ed., UGC-NET', 'Head of Department & Assistant Professor', 1, ''],
      ['Akanjungla Kichu', 'ARTS', 'Economics', 'M.A.', 'Head of Department & Assistant Professor', 1, ''],
      ['Dr. Kadunlung Gamei', 'SCIENCE', 'Botany', 'M.Sc., Ph.D.', 'Head of Department & Assistant Professor', 1, ''],
      ['Pyonphamo Ezung', 'SCIENCE', 'Chemistry', 'M.Sc.', 'Head of Department & Assistant Professor', 1, ''],
      ['Nourhevinuo Kessiezie', 'SCIENCE', 'Zoology', 'M.Sc., UGC-NET', 'Head of Department & Assistant Professor', 1, ''],
      ['Vevohu Kezo', 'SCIENCE', 'Zoology', 'M.Sc.', 'Vice Principal & Assistant Professor', 0, ''],
      ['Science Academic Faculty', 'SCIENCE', 'Mathematics & Physics', 'M.Sc.', 'Head of Department & Assistant Professor', 1, '']
    ];
    for (const f of initialFaculty) {
      const existing = await allSQLite(db, `SELECT id FROM faculty WHERE name = ?`, [f[0]]);
      if (!existing || existing.length === 0) {
        await runSQLite(db, `
          INSERT INTO faculty (name, stream, department, qualification, designation, is_hod, image_url)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `, f);
      }
    }
  }

  // Create Governing Body table
  await runSQLite(db, `
    CREATE TABLE IF NOT EXISTS governing_body (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      role TEXT NOT NULL,
      category TEXT DEFAULT 'Council Member',
      affiliation TEXT NOT NULL,
      member_type TEXT NOT NULL DEFAULT 'MEMBER',
      order_index INTEGER DEFAULT 0,
      image_url TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  try {
    await runSQLite(db, `ALTER TABLE governing_body ADD COLUMN image_url TEXT`);
  } catch (e) {}

  // Create Announcements / Ticker Table
  await runSQLite(db, `
    CREATE TABLE IF NOT EXISTS announcements (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      tag TEXT NOT NULL,
      text TEXT NOT NULL,
      action_label TEXT NOT NULL,
      action_type TEXT DEFAULT 'page',
      action_page TEXT,
      action_href TEXT,
      secondary_label TEXT,
      secondary_href TEXT,
      is_active INTEGER DEFAULT 1,
      display_order INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Seed default authentic announcements if empty
  const countAnnouncements = await allSQLite(db, `SELECT COUNT(*) as cnt FROM announcements`);
  if (countAnnouncements[0].cnt === 0) {
    console.log('🌱 Seeding authentic announcements for Top Alert Bar & Ticker...');
    const defaultAnnouncements = [
      [
        'ADMISSION 2024-25',
        'Admissions Open for FYUGP 4-Year B.A. & B.Sc. Honours Degree Courses at Capital College Kohima.',
        'Admission Info',
        'page',
        'criteria',
        '',
        'Form (PDF)',
        '/admission_form.pdf',
        1,
        1
      ],
      [
        'EXAM ROUTINE',
        'Nagaland University CBCS & Non-CBCS Under Graduate End-Term Examination Routines 2023 Released.',
        'View Routines',
        'page',
        'under-graduate-exam-routine-2023',
        '',
        null,
        '',
        1,
        2
      ],
      [
        'SCHOLARSHIP',
        'CCHE Scheme for Economically Weak Students (6th Sem) & State Post-Matric Scholarship Active.',
        'Welfare Scheme',
        'page',
        'cche-scheme-for-economically-weak-students',
        '',
        '',
        '',
        1,
        3
      ],
      [
        'AWARDS',
        'University Distinction Citations & Cash Awards announced for meritorious students and faculty.',
        'View Awards',
        'page',
        'student-awards',
        '',
        '',
        '',
        1,
        4
      ]
    ];

    for (const a of defaultAnnouncements) {
      await runSQLite(db, `
        INSERT INTO announcements (tag, text, action_label, action_type, action_page, action_href, secondary_label, secondary_href, is_active, display_order)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, a);
    }
  }

  // Create Social Media & Channels Table
  await runSQLite(db, `
    CREATE TABLE IF NOT EXISTS social_links (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      platform TEXT NOT NULL,
      label TEXT NOT NULL,
      url TEXT NOT NULL,
      is_active INTEGER DEFAULT 1,
      display_order INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Seed default authentic social links if empty
  const countSocial = await allSQLite(db, `SELECT COUNT(*) as cnt FROM social_links`);
  if (countSocial[0].cnt === 0) {
    console.log('🌱 Seeding authentic social media channels (including WhatsApp)...');
    const defaultSocial = [
      ['facebook', 'Facebook', 'https://www.facebook.com/capitalcollege.kohima', 1, 1],
      ['instagram', 'Instagram', 'https://www.instagram.com/capital_college_of_higher_educ/', 1, 2],
      ['whatsapp', 'WhatsApp Helpline', 'https://wa.me/919436002789', 0, 3]
    ];
    for (const s of defaultSocial) {
      await runSQLite(db, `
        INSERT INTO social_links (platform, label, url, is_active, display_order)
        VALUES (?, ?, ?, ?, ?)
      `, s);
    }
  }

  // Deactivate WhatsApp across active channels
  await runSQLite(db, `UPDATE social_links SET is_active = 0 WHERE platform = 'whatsapp'`);

  // Create Institutional Documents & Forms Table
  await runSQLite(db, `
    CREATE TABLE IF NOT EXISTS documents (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      doc_key TEXT UNIQUE,
      title TEXT NOT NULL,
      category TEXT DEFAULT 'General',
      file_name TEXT NOT NULL,
      file_path TEXT,
      file_size INTEGER DEFAULT 0,
      mime_type TEXT DEFAULT 'application/pdf',
      is_active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Seed initial system documents if empty
  const countDocs = await allSQLite(db, `SELECT COUNT(*) as cnt FROM documents`);
  if (countDocs[0].cnt === 0) {
    console.log('🌱 Seeding institutional documents and official forms...');
    const defaultDocs = [
      ['admission_form', 'Official Undergraduate Admission Form', 'Admissions', 'admission_form.pdf', 'data/admission_form.pdf', 156400, 'application/pdf', 1],
      ['prospectus', 'Institutional Prospectus (FYUGP)', 'Prospectus', 'CCHE-Prospectus-2024.pdf', 'data/CCHE-Prospectus-2024.pdf', 2450000, 'application/pdf', 1],
      ['exam_routine', 'Nagaland University UG Exam Routine', 'Examinations', 'UG-Examination-Routine.pdf', 'data/UG-Examination-Routine.pdf', 342000, 'application/pdf', 1],
      ['welfare_scheme', 'CCHE Students Welfare Assistance Form', 'Student Welfare', 'CCHE-Welfare-Scheme.pdf', 'data/CCHE-Welfare-Scheme.pdf', 128000, 'application/pdf', 1]
    ];
    for (const d of defaultDocs) {
      await runSQLite(db, `
        INSERT INTO documents (doc_key, title, category, file_name, file_path, file_size, mime_type, is_active)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `, d);
    }
  }

  // Ensure default banner and social settings in settings table
  try {
    await runSQLite(db, `INSERT OR IGNORE INTO settings (key, value) VALUES ('top_banner_enabled', 'true')`);
    await runSQLite(db, `INSERT OR IGNORE INTO settings (key, value) VALUES ('top_banner_speed', '5500')`);
    await runSQLite(db, `INSERT OR REPLACE INTO settings (key, value) VALUES ('top_banner_show_notice_board', 'false')`);
  } catch (e) {}

  // Seed Board of Management members into governing_body if not present
  try {
    const countMgmt = await allSQLite(db, `SELECT COUNT(*) as cnt FROM governing_body WHERE member_type = 'MANAGEMENT'`);
    if (countMgmt[0].cnt === 0) {
      console.log('🌱 Seeding Board of Management (National Academy Society)...');
      const mgmtMembers = [
        ['Dr. Khrietuo Doulo', 'Managing Director', 'Executive Oversight', 'Asst. Professor (Retired), Kohima Science College, Jotsoma', 'MANAGEMENT', 1, ''],
        ['Mr. Vezuhu Keyho', 'Member — Board of Management', 'Academic & Civic Governance', 'Former College Principal & Current Chairman, Supply Colony, Kohima', 'MANAGEMENT', 2, ''],
        ['Mr. Kenneth Punyü', 'Member — Board of Management', 'Higher Education Leadership', 'Associate Professor, Kohima Science College, Jotsoma', 'MANAGEMENT', 3, '']
      ];
      for (const m of mgmtMembers) {
        await runSQLite(db, `
          INSERT INTO governing_body (name, role, category, affiliation, member_type, order_index, image_url)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `, m);
      }
    }
  } catch (e) {}

  // Seed College Administration leaders into governing_body if not present
  try {
    const countAdminLeaders = await allSQLite(db, `SELECT COUNT(*) as cnt FROM governing_body WHERE member_type = 'ADMINISTRATION'`);
    if (countAdminLeaders[0].cnt === 0) {
      console.log('🌱 Seeding College Administration leadership...');
      const adminLeaders = [
        ['Dr. Zokho Venuh', 'Principal & Head of Institution', 'Executive Head', 'M.A., M.Phil., Ph.D. in History (Nagaland University)', 'ADMINISTRATION', 1, ''],
        ['Mr. Vevohu Kezo', 'Vice Principal', 'Academic Operations & Campus Oversight', 'M.Sc. in Zoology', 'ADMINISTRATION', 2, ''],
        ['Mrs. Abeino Zashu', 'Academic Dean', 'Curriculum Framework & HoD Coordination', 'M.A. in Sociology, UGC-NET', 'ADMINISTRATION', 3, ''],
        ['Mrs. Tatongkala Lemtur Lohe', 'Dean of Students', 'Student Affairs, Mentorship & Campus Welfare', 'M.A., M.Phil. in English', 'ADMINISTRATION', 4, '']
      ];
      for (const m of adminLeaders) {
        await runSQLite(db, `
          INSERT INTO governing_body (name, role, category, affiliation, member_type, order_index, image_url)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `, m);
      }
    }
  } catch (e) {}
}

// Setup and verify MySQL tables for settings, announcements, governing_body, documents, social_links
async function setupMySQLTables(pool) {
  // 0. Column migrations for existing core tables (faculty, notices)
  try {
    const [facultyCols] = await pool.query("SHOW COLUMNS FROM `faculty` LIKE 'image_url'");
    if (!facultyCols || facultyCols.length === 0) {
      await pool.query("ALTER TABLE `faculty` ADD COLUMN `image_url` LONGTEXT");
    } else {
      await pool.query("ALTER TABLE `faculty` MODIFY COLUMN `image_url` LONGTEXT");
    }
  } catch (e) {}

  try {
    const [noticesCols] = await pool.query("SHOW COLUMNS FROM `notices`");
    const colNames = noticesCols.map(c => c.Field);
    if (!colNames.includes('item_type')) {
      await pool.query("ALTER TABLE `notices` ADD COLUMN `item_type` VARCHAR(50) DEFAULT 'notice'");
    }
    if (!colNames.includes('pdf_url')) {
      await pool.query("ALTER TABLE `notices` ADD COLUMN `pdf_url` LONGTEXT");
    }
    if (!colNames.includes('pdf_name')) {
      await pool.query("ALTER TABLE `notices` ADD COLUMN `pdf_name` VARCHAR(255)");
    }
    await pool.query("ALTER TABLE `notices` MODIFY COLUMN `image_url` LONGTEXT");
  } catch (e) {}

  // 1. Settings Table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS \`settings\` (
      \`key\` VARCHAR(100) NOT NULL PRIMARY KEY,
      \`value\` LONGTEXT NOT NULL,
      \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  // Seed default settings if empty
  const [settingsCount] = await pool.query('SELECT COUNT(*) as cnt FROM `settings`');
  if (settingsCount[0].cnt === 0) {
    console.log('⚙️ Initializing institutional admission control settings in MySQL...');
    await pool.query(`
      INSERT IGNORE INTO \`settings\` (\`key\`, \`value\`) VALUES
      ('admissions_open', 'false'),
      ('admissions_notice', 'Online admissions for FYUGP 4-Year B.A. & B.Sc. programmes are closed for now. Please download the official print form (PDF) or visit the college office at P.R. Hill, Kohima.'),
      ('academic_year', '2024-25'),
      ('top_banner_enabled', 'true'),
      ('top_banner_speed', '5500'),
      ('top_banner_show_notice_board', 'false'),
      ('contact_email', 'principal@capitalcollege.edu.in'),
      ('contact_phone', '+91 9436002789')
    `);
  }

  // 2. Governing Body Table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS \`governing_body\` (
      \`id\` INT AUTO_INCREMENT PRIMARY KEY,
      \`name\` VARCHAR(255) NOT NULL,
      \`role\` VARCHAR(255) NOT NULL,
      \`category\` VARCHAR(100) DEFAULT 'Council Member',
      \`affiliation\` VARCHAR(255) NOT NULL,
      \`member_type\` VARCHAR(50) NOT NULL DEFAULT 'MEMBER',
      \`order_index\` INT DEFAULT 0,
      \`image_url\` TEXT,
      \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  const [govCount] = await pool.query('SELECT COUNT(*) as cnt FROM `governing_body`');
  if (govCount[0].cnt === 0) {
    console.log('🌱 Seeding Governing Body in MySQL...');
    const mgmtMembers = [
      ['Dr. Khrietuo Doulo', 'Managing Director', 'Executive Oversight', 'Asst. Professor (Retired), Kohima Science College, Jotsoma', 'MANAGEMENT', 1, ''],
      ['Mr. Vezuhu Keyho', 'Member — Board of Management', 'Academic & Civic Governance', 'Former College Principal & Current Chairman, Supply Colony, Kohima', 'MANAGEMENT', 2, ''],
      ['Mr. Kenneth Punyü', 'Member — Board of Management', 'Higher Education Leadership', 'Associate Professor, Kohima Science College, Jotsoma', 'MANAGEMENT', 3, ''],
      ['Dr. Zokho Venuh', 'Principal & Head of Institution', 'Executive Head', 'M.A., M.Phil., Ph.D. in History (Nagaland University)', 'ADMINISTRATION', 1, ''],
      ['Mr. Vevohu Kezo', 'Vice Principal', 'Academic Operations & Campus Oversight', 'M.Sc. in Zoology', 'ADMINISTRATION', 2, ''],
      ['Mrs. Abeino Zashu', 'Academic Dean', 'Curriculum Framework & HoD Coordination', 'M.A. in Sociology, UGC-NET', 'ADMINISTRATION', 3, ''],
      ['Mrs. Tatongkala Lemtur Lohe', 'Dean of Students', 'Student Affairs, Mentorship & Campus Welfare', 'M.A., M.Phil. in English', 'ADMINISTRATION', 4, '']
    ];
    for (const m of mgmtMembers) {
      await pool.query(`
        INSERT INTO \`governing_body\` (\`name\`, \`role\`, \`category\`, \`affiliation\`, \`member_type\`, \`order_index\`, \`image_url\`)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `, m);
    }
  }

  // 3. Announcements Table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS \`announcements\` (
      \`id\` INT AUTO_INCREMENT PRIMARY KEY,
      \`tag\` VARCHAR(100) NOT NULL,
      \`text\` TEXT NOT NULL,
      \`action_label\` VARCHAR(100) NOT NULL,
      \`action_type\` VARCHAR(50) DEFAULT 'page',
      \`action_page\` VARCHAR(100),
      \`action_href\` TEXT,
      \`secondary_label\` VARCHAR(100),
      \`secondary_href\` TEXT,
      \`is_active\` TINYINT(1) DEFAULT 1,
      \`display_order\` INT DEFAULT 0,
      \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  const [annCount] = await pool.query('SELECT COUNT(*) as cnt FROM `announcements`');
  if (annCount[0].cnt === 0) {
    console.log('🌱 Seeding Announcements in MySQL...');
    const defaultAnnouncements = [
      ['ADMISSION 2024-25', 'Admissions Open for FYUGP 4-Year B.A. & B.Sc. Honours Degree Courses at Capital College Kohima.', 'Admission Info', 'page', 'criteria', '', 'Form (PDF)', '/admission_form.pdf', 1, 1],
      ['EXAM ROUTINE', 'Nagaland University CBCS & Non-CBCS Under Graduate End-Term Examination Routines 2023 Released.', 'View Routines', 'page', 'under-graduate-exam-routine-2023', '', null, '', 1, 2],
      ['SCHOLARSHIP', 'CCHE Scheme for Economically Weak Students (6th Sem) & State Post-Matric Scholarship Active.', 'Welfare Scheme', 'page', 'cche-scheme-for-economically-weak-students', '', '', '', 1, 3],
      ['AWARDS', 'University Distinction Citations & Cash Awards announced for meritorious students and faculty.', 'View Awards', 'page', 'student-awards', '', '', '', 1, 4]
    ];
    for (const a of defaultAnnouncements) {
      await pool.query(`
        INSERT INTO \`announcements\` (\`tag\`, \`text\`, \`action_label\`, \`action_type\`, \`action_page\`, \`action_href\`, \`secondary_label\`, \`secondary_href\`, \`is_active\`, \`display_order\`)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, a);
    }
  }

  // 4. Social Links Table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS \`social_links\` (
      \`id\` INT AUTO_INCREMENT PRIMARY KEY,
      \`platform\` VARCHAR(100) NOT NULL,
      \`label\` VARCHAR(100) NOT NULL,
      \`url\` TEXT NOT NULL,
      \`is_active\` TINYINT(1) DEFAULT 1,
      \`display_order\` INT DEFAULT 0,
      \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  const [socCount] = await pool.query('SELECT COUNT(*) as cnt FROM `social_links`');
  if (socCount[0].cnt === 0) {
    console.log('🌱 Seeding Social Links in MySQL...');
    const defaultSocial = [
      ['facebook', 'Facebook', 'https://www.facebook.com/capitalcollege.kohima', 1, 1],
      ['instagram', 'Instagram', 'https://www.instagram.com/capital_college_of_higher_educ/', 1, 2],
      ['whatsapp', 'WhatsApp Helpline', 'https://wa.me/919436002789', 0, 3]
    ];
    for (const s of defaultSocial) {
      await pool.query(`
        INSERT INTO \`social_links\` (\`platform\`, \`label\`, \`url\`, \`is_active\`, \`display_order\`)
        VALUES (?, ?, ?, ?, ?)
      `, s);
    }
  }

  // 5. Documents Table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS \`documents\` (
      \`id\` INT AUTO_INCREMENT PRIMARY KEY,
      \`doc_key\` VARCHAR(100) UNIQUE,
      \`title\` VARCHAR(255) NOT NULL,
      \`category\` VARCHAR(100) DEFAULT 'General',
      \`file_name\` VARCHAR(255) NOT NULL,
      \`file_path\` TEXT,
      \`file_size\` INT DEFAULT 0,
      \`mime_type\` VARCHAR(100) DEFAULT 'application/pdf',
      \`is_active\` TINYINT(1) DEFAULT 1,
      \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  const [docCount] = await pool.query('SELECT COUNT(*) as cnt FROM `documents`');
  if (docCount[0].cnt === 0) {
    console.log('🌱 Seeding Documents in MySQL...');
    const defaultDocs = [
      ['admission_form', 'Official Undergraduate Admission Form', 'Admissions', 'admission_form.pdf', 'data/admission_form.pdf', 156400, 'application/pdf', 1],
      ['prospectus', 'Institutional Prospectus (FYUGP)', 'Prospectus', 'CCHE-Prospectus-2024.pdf', 'data/CCHE-Prospectus-2024.pdf', 2450000, 'application/pdf', 1],
      ['exam_routine', 'Nagaland University UG Exam Routine', 'Examinations', 'UG-Examination-Routine.pdf', 'data/UG-Examination-Routine.pdf', 342000, 'application/pdf', 1],
      ['welfare_scheme', 'CCHE Students Welfare Assistance Form', 'Student Welfare', 'CCHE-Welfare-Scheme.pdf', 'data/CCHE-Welfare-Scheme.pdf', 128000, 'application/pdf', 1]
    ];
    for (const d of defaultDocs) {
      await pool.query(`
        INSERT INTO \`documents\` (\`doc_key\`, \`title\`, \`category\`, \`file_name\`, \`file_path\`, \`file_size\`, \`mime_type\`, \`is_active\`)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `, d);
    }
  }
}

// Initialize Database connection
async function initDB() {
  const host = process.env.DB_HOST || 'localhost';
  const user = process.env.DB_USER || 'root';
  const password = process.env.DB_PASSWORD || '';
  const database = process.env.DB_NAME || 'capital_college_db';
  const port = process.env.DB_PORT || 3306;

  try {
    const testConn = await mysql.createConnection({
      host,
      user,
      password,
      port,
      connectTimeout: 2000
    });

    await testConn.query(`CREATE DATABASE IF NOT EXISTS \`${database}\``);
    await testConn.end();

    mysqlPool = mysql.createPool({
      host,
      user,
      password,
      database,
      port,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });

    // Test query
    const [rows] = await mysqlPool.query('SELECT 1 as test');
    dbType = 'mysql';
    console.log(`🐬 Connected to MySQL database "${database}" on ${host}:${port}`);

    // Ensure tables exist in MySQL
    try {
      const [existingTables] = await mysqlPool.query("SHOW TABLES LIKE 'courses'");
      if (!existingTables || existingTables.length === 0) {
        console.log('🌱 Setting up MySQL tables from schema.sql...');
        const schemaSql = fs.readFileSync(path.join(__dirname, '..', 'scripts', 'schema.sql'), 'utf-8');
        const setupConn = await mysql.createConnection({
          host, user, password, database, port, multipleStatements: true
        });
        await setupConn.query(schemaSql);
        await setupConn.end();
        console.log('✅ MySQL schema applied and seeded successfully!');
      }

      // Ensure all extended tables (settings, governing_body, announcements, social_links, documents) exist in MySQL
      await setupMySQLTables(mysqlPool);
    } catch (schemaErr) {
      console.warn('Note on MySQL schema verification:', schemaErr.message);
    }
    return;
  } catch (err) {
    console.warn(`⚠️ MySQL connection to ${host}:${port} not available (${err.message}).`);
    console.warn('Switching to local persistent storage mode for immediate zero-config operation.');
    await initSQLite();
  }
}

// Unified query wrapper
async function query(sql, params = []) {
  if (dbType === 'mysql') {
    const [rows] = await mysqlPool.query(sql, params);
    return rows;
  } else if (dbType === 'sqlite') {
    const trimmed = sql.trim();
    if (trimmed.startsWith('SELECT') || trimmed.startsWith('PRAGMA') || trimmed.startsWith('select')) {
      return await allSQLite(sqliteDb, sql, params);
    } else {
      const result = await runSQLite(sqliteDb, sql, params);
      return {
        insertId: result.lastID,
        affectedRows: result.changes
      };
    }
  } else {
    throw new Error('Database not initialized');
  }
}

function getDatabaseStatus() {
  return {
    engine: dbType,
    isMySQL: dbType === 'mysql',
    database: process.env.DB_NAME || 'capital_college_db'
  };
}

module.exports = {
  initDB,
  query,
  getDatabaseStatus
};
