-- =======================================================
-- Database Schema for Capital College Kohima
-- Database: capital_college_db
-- =======================================================

CREATE DATABASE IF NOT EXISTS capital_college_db;
USE capital_college_db;

-- 1. Courses Table
CREATE TABLE IF NOT EXISTS courses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    stream ENUM('ARTS', 'SCIENCE') NOT NULL,
    course_name VARCHAR(150) NOT NULL,
    degree_type VARCHAR(100) NOT NULL DEFAULT 'Four Years Under Graduate Programme (FYUGP)',
    description TEXT,
    eligibility TEXT,
    duration VARCHAR(50) DEFAULT '4 Years (8 Semesters)',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Notices & Events Table
CREATE TABLE IF NOT EXISTS notices (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) DEFAULT 'Notice',
    item_type VARCHAR(50) DEFAULT 'notice',
    summary TEXT,
    content TEXT,
    event_date VARCHAR(50),
    image_url LONGTEXT,
    link_url TEXT,
    pdf_url LONGTEXT,
    pdf_name VARCHAR(255),
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Student Admission Applications Table
CREATE TABLE IF NOT EXISTS applications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    application_no VARCHAR(50) NOT NULL UNIQUE,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    dob DATE NOT NULL,
    gender ENUM('Male', 'Female', 'Other') NOT NULL,
    category VARCHAR(50) DEFAULT 'ST',
    stream ENUM('ARTS', 'SCIENCE') NOT NULL,
    course_type ENUM('HONOURS', 'GENERAL') NOT NULL DEFAULT 'HONOURS',
    major_subject VARCHAR(100) NOT NULL,
    minor_subjects VARCHAR(255),
    marks_10th DECIMAL(5,2),
    marks_12th DECIMAL(5,2) NOT NULL,
    previous_school VARCHAR(200),
    board_name VARCHAR(100) DEFAULT 'NBSE',
    guardian_name VARCHAR(150) NOT NULL,
    guardian_phone VARCHAR(20) NOT NULL,
    address TEXT NOT NULL,
    status ENUM('PENDING', 'UNDER_REVIEW', 'APPROVED', 'REJECTED') DEFAULT 'PENDING',
    remarks TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Contact Inquiries Table
CREATE TABLE IF NOT EXISTS inquiries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL,
    phone VARCHAR(20),
    subject VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    status ENUM('UNREAD', 'READ', 'RESOLVED') DEFAULT 'UNREAD',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Faculty Table
CREATE TABLE IF NOT EXISTS faculty (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    stream ENUM('ARTS', 'SCIENCE') NOT NULL,
    department VARCHAR(100) NOT NULL,
    qualification VARCHAR(255),
    designation VARCHAR(150) NOT NULL,
    is_hod BOOLEAN DEFAULT FALSE,
    image_url LONGTEXT,
    bio TEXT,
    email VARCHAR(150),
    campus VARCHAR(150) DEFAULT 'P.R. Hill Campus, Kohima',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. Confidential Admin Users Table
CREATE TABLE IF NOT EXISTS admin_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(150) NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    role VARCHAR(50) DEFAULT 'ADMIN',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. Notifications Log Table
CREATE TABLE IF NOT EXISTS notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    application_no VARCHAR(50) NOT NULL,
    recipient_email VARCHAR(150),
    recipient_phone VARCHAR(20),
    status VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed Default Admin Credentials
INSERT IGNORE INTO admin_users (username, password, email, full_name, role)
VALUES ('admin', 'Capital@2024', 'principal@capitalcollege.edu.in', 'College Administrator', 'SUPER_ADMIN');

-- Seed Courses
INSERT INTO courses (stream, course_name, degree_type, description, eligibility) VALUES
('ARTS', 'Economics (Honours & General)', 'FYUGP Bachelor of Arts (B.A.)', 'Study micro/macro economics, development theories, Indian economic system and public finance under Nagaland University.', '10+2 / HSSLC passed or equivalent stage of education corresponding to level-4.'),
('ARTS', 'Education (Honours & General)', 'FYUGP Bachelor of Arts (B.A.)', 'Explores educational philosophies, child psychology, curriculum development, and modern teaching methodologies.', '10+2 / HSSLC passed or equivalent stage of education corresponding to level-4.'),
('ARTS', 'English (Honours & General)', 'FYUGP Bachelor of Arts (B.A.)', 'Comprehensive study of British, American, Indian English Literature, Linguistics, and critical literary theory.', '10+2 / HSSLC passed or equivalent stage of education corresponding to level-4.'),
('ARTS', 'History (Honours & General)', 'FYUGP Bachelor of Arts (B.A.)', 'Covers Ancient, Medieval, Modern Indian History, History of Northeast India, and World Civilization.', '10+2 / HSSLC passed or equivalent stage of education corresponding to level-4.'),
('ARTS', 'Political Science (Honours & General)', 'FYUGP Bachelor of Arts (B.A.)', 'Focus on political theory, Indian political system, international relations, and public administration.', '10+2 / HSSLC passed or equivalent stage of education corresponding to level-4.'),
('ARTS', 'Sociology (Honours & General)', 'FYUGP Bachelor of Arts (B.A.)', 'In-depth analysis of social institutions, tribal societies of Northeast India, sociological thought, and research methods.', '10+2 / HSSLC passed or equivalent stage of education corresponding to level-4.'),
('ARTS', 'Tenyidie (Honours & General)', 'FYUGP Bachelor of Arts (B.A.)', 'Indigenous linguistic and literary studies in Tenyidie language, poetry, folklore, and cultural history.', '10+2 / HSSLC passed or equivalent stage of education corresponding to level-4.'),
('SCIENCE', 'Botany (Honours & General)', 'FYUGP Bachelor of Science (B.Sc.)', 'Plant anatomy, morphology, biodiversity, physiology, ecology, genetics, and biotechnology.', '10+2 / HSSLC Science with Biology/Botany from recognized board.'),
('SCIENCE', 'Chemistry (Honours & General)', 'FYUGP Bachelor of Science (B.Sc.)', 'Inorganic, Organic, and Physical Chemistry with advanced lab coursework and analytical methods.', '10+2 / HSSLC Science with Chemistry from recognized board.'),
('SCIENCE', 'Physics (Honours & General)', 'FYUGP Bachelor of Science (B.Sc.)', 'Classical mechanics, quantum mechanics, electromagnetism, optics, electronics, and solid state physics.', '10+2 / HSSLC Science with Physics & Mathematics.'),
('SCIENCE', 'Zoology (Honours & General)', 'FYUGP Bachelor of Science (B.Sc.)', 'Animal biodiversity, evolutionary biology, physiology, cell biology, and wildlife conservation.', '10+2 / HSSLC Science with Biology/Zoology from recognized board.');

-- Seed Notices & Updates
INSERT INTO notices (title, category, summary, content, event_date, image_url, is_featured) VALUES
('ECO CLUB Trekking to Pulie Badze', 'Activities', 'CCHE ECO Club organised a trekking to Pulie Badze spreading awareness about environmental issues, where students were encouraged to preserve nature.', 'CCHE ECO Club organised a trekking to Pulie Badze on 25th April 2026 spreading awareness about environmental issues. Students are encouraged to take active roles in biodiversity protection.', 'May 5, 2026', 'https://capitalcollege.edu.in/wp-content/uploads/2026/05/WhatsApp-Image-2026-05-05-at-4.12.03-PM.jpeg', TRUE),
('Blood Test Camp organised by Red Ribbon Club (RRC)', 'Health & Social', 'CCHE Red Ribbon Club organised a Blood Group test. Mr. Temsuwapang, NSS Nodal Officer chaired the event.', 'CCHE Red Ribbon Club organised a Blood Group test on 2nd May 2026. Mr. Temsuwapang, NSS Nodal Officer chaired the session emphasizing the importance of knowing one blood group and voluntary blood donation.', 'May 5, 2026', 'https://capitalcollege.edu.in/wp-content/uploads/2026/05/WhatsApp-Image-2026-05-05-at-4.19.40-PM.jpeg', TRUE),
('NSS Special Camp 2025', 'NSS', 'NSS CCHE Unit conducted Special Camp for the year 2025 on 24th-26th October, 2025 at Mezo Basa, Primary School.', 'NSS CCHE Unit conducted Special Camp for the year 2025 on 24th-26th October, 2025 at Mezo Basa, Primary School with community development and sanitation drives.', 'October 26, 2025', 'https://capitalcollege.edu.in/wp-content/uploads/2025/10/WhatsApp-Image-2025-10-26-at-8.42.53-AM.jpeg', TRUE),
('Trifecta 2025', 'College Fest', 'CCHE conducted Trifecta on 29th-30th September, 2025 celebrating culture, arts, and competitive student talents.', 'Capital College of Higher Education hosts annual Trifecta fest in Kohima celebrating youth empowerment, sports, and cultural harmony.', 'September 30, 2025', 'https://capitalcollege.edu.in/wp-content/uploads/2025/10/Trifecta-2025.jpg', TRUE),
('Anti Ragging Day/ Week 2025 Observed', 'Campus Integrity', 'Capital College of Higher Education organized National Anti Ragging on the theme "Youth Against Ragging" held on August 12, 2025.', 'Capital College of Higher Education organized National Anti Ragging on the theme "Youth Against Ragging" and held on August 12, 2025 to reaffirm our 100% ragging-free campus pledge.', 'August 12, 2025', 'https://capitalcollege.edu.in/wp-content/uploads/2025/08/Anti-Ragging-500x500.jpg', FALSE),
('Fresher’s Meet 2025', 'Events', 'Capital College of Higher Education (CCHE) hosted its 18th Freshers Day at State Academy Hall in Kohima.', 'On August 5, 2025, Capital College of Higher Education (CCHE) hosted its 18th Freshers Day at State Academy Hall in Kohima welcoming the new batch into the academic family.', 'August 5, 2025', 'https://capitalcollege.edu.in/wp-content/uploads/2025/08/teachers-with-freshers-copy-500x500.jpg', FALSE),
('Teacher’s Orientation Programme', 'Faculty Development', 'Internal Quality Assurance Cell (IQAC) of Capital College conducted a Teachers’ Orientation Programme on Transformative Pedagogy.', 'Internal Quality Assurance Cell (IQAC) of Capital College conducted a Teachers’ Orientation Programme, under the theme "Transformative Pedagogy for Higher Education".', 'July 22, 2025', 'https://capitalcollege.edu.in/wp-content/uploads/2025/07/WhatsApp-Image-2025-07-22-at-10.59.40-AM-scaled.jpeg', FALSE);

-- Seed Faculty
INSERT INTO faculty (name, stream, department, qualification, designation, is_hod) VALUES
('Dr. Rukulu Kezo Puro', 'ARTS', 'English', 'M.A, M.Phil, PhD, PGCTE', 'Head of Department & Assistant Professor', TRUE),
('Tatongkala Lemtur Lohe', 'ARTS', 'English', 'M.A, M.Phil', 'Assistant Professor', FALSE),
('Opangmenla Jamir', 'ARTS', 'English', 'M.A, B.Ed', 'Assistant Professor', FALSE),
('Temsuwapang Lkr', 'ARTS', 'History', 'M.A', 'Head of Department & NSS Nodal Officer', TRUE),
('Kumuni Keppen', 'ARTS', 'History', 'M.A', 'Assistant Professor', FALSE),
('Niekhoto Chürhah', 'ARTS', 'History', 'M.A', 'Assistant Professor', FALSE),
('Chubarenla Lkr', 'ARTS', 'Political Science', 'M.A (NET)', 'Head of Department & Assistant Professor', TRUE),
('Vungthungo', 'ARTS', 'Political Science', 'M.A. NET', 'Assistant Professor', FALSE),
('Meyiepeo Puyie', 'ARTS', 'Political Science', 'M.A. NET', 'Assistant Professor', FALSE),
('Kevivonu Zhotso Chishi', 'ARTS', 'Sociology', 'M.A', 'Head of Department & Assistant Professor', TRUE),
('Abeino Zashii', 'ARTS', 'Sociology', 'M.A', 'Assistant Professor', FALSE),
('Vizoboto Zhotso', 'ARTS', 'Sociology', 'M.A', 'Assistant Professor', FALSE),
('Theja Lohe', 'ARTS', 'Tenyidie', 'M.A', 'Head of Department & Assistant Professor', TRUE),
('Shedulu Kezo', 'ARTS', 'Education', 'M.A, B.Ed, M.Ed, NET', 'Head of Department & Assistant Professor', TRUE),
('Dr. Kadunlung Gamei', 'SCIENCE', 'Botany', 'M.Sc, PhD', 'Head of Department & Assistant Professor', TRUE),
('Pyonphamo', 'SCIENCE', 'Chemistry', 'M.Sc', 'Head of Department & Assistant Professor', TRUE),
('Nourhevinuo', 'SCIENCE', 'Zoology', 'M.Sc, NET', 'Head of Department & Assistant Professor', TRUE),
('Vevohu Kezo', 'SCIENCE', 'Zoology', 'M.Sc', 'Assistant Professor', FALSE);
