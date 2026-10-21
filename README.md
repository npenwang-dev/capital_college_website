# Capital College Kohima — Full-Stack Web Application

A full-stack replica of [Capital College Kohima](https://capitalcollege.edu.in/) built with **React** for the frontend, **Node.js / Express** for the backend, and **MySQL** for the database.

---

## 🏛️ Project Architecture

```
capital college website/
├── capital_college_frontend/      # React 18 + Vite + Tailwind CSS Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header/            # TopBar, Navbar with Mega-Menu
│   │   │   ├── Home/              # HeroSlider, AnnouncementTicker, QuickStats, PrincipalMessage, AboutCollege, LatestUpdatesCarousel, ProgramsOverview
│   │   │   ├── Admission/         # OnlineAdmissionModal (Full application form), CriteriaModal
│   │   │   ├── Academic/          # ProgramsModal (FYUGP syllabus & curriculum)
│   │   │   ├── Faculty/           # FacultyModal (Official faculty roster by department)
│   │   │   ├── Admin/             # AdminModal (Application management & notice publishing)
│   │   │   └── Footer/            # Footer (4-column layout matching original)
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   └── package.json
│
└── capital_colleg_backend/        # Node.js + Express + MySQL Backend API
    ├── config/
    │   └── db.js                  # MySQL connection pool with persistent fallback
    ├── controllers/
    │   ├── admissionsController.js# Admission submissions & review
    │   ├── noticesController.js   # Campus news & updates
    │   ├── coursesController.js   # Arts & Science FYUGP catalog
    │   └── contactController.js   # Inquiries handling
    ├── routes/                    # Express REST endpoints
    ├── scripts/
    │   └── schema.sql             # Full MySQL DDL & Seed Data
    ├── server.js                  # Main server entrypoint
    └── .env                       # Environment variables
```

---

## ⚡ Quick Start

### 1. Start the Backend API (Port 5001)
```bash
cd capital_colleg_backend
npm start
```
- API Base URL: `http://localhost:5001`
- Health Check: `http://localhost:5001/api/health`

*(Note: Port 5001 is used by default because macOS ControlCenter/AirPlay reserves port 5000).*

### 2. Start the Frontend Application (Port 5173)
```bash
cd capital_college_frontend
npm run dev
```
- Web Application: `http://localhost:5173`

---

## 🐬 MySQL Database Configuration

1. Make sure your MySQL server is running (e.g., MySQL Community Server, XAMPP, or Docker).
2. Configure your MySQL credentials in `capital_colleg_backend/.env`:
   ```env
   PORT=5000
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=capital_college_db
   DB_PORT=3306
   ```
3. Import the database schema and seed data:
   ```bash
   mysql -u root -p < capital_colleg_backend/scripts/schema.sql
   ```
4. *Zero-Config Fallback:* If a MySQL server is not currently running, the backend automatically activates a persistent local fallback database so all features (student admission submissions, inquiries, news updates, and the admin panel) work immediately without crashes!

---

## ✨ Features

- **Authentic Design & Branding**: Exact `#002858` Navy Blue and `#fd5308` Vivid Orange palette, official logos, graduation cap dividers, and responsive layout.
- **Hero Slider**: Cycling campus photos from Capital College with slide indicators and action buttons.
- **Breaking News Ticker**: Animated alert banner for timely announcements.
- **Principal's Message**: Portrait and welcoming address from Principal Dr. Rukulu Kezo Puro.
- **About College**: Comprehensive background detailing permanent affiliation to Nagaland University and UGC Art. 2(f) & 12(B) status.
- **Programmes & Courses**: FYUGP 4-year degree structures for Arts (Economics, Education, English, History, Political Science, Sociology, Tenyidie) and Science (Botany, Chemistry, Physics, Zoology).
- **Online Admission Application**: Full student admission workflow with validation, unique application number generation (`CCH-YYYY-XXXX`), and printable receipt.
- **Latest Updates Carousel**: 15+ authentic campus events (Eco Club Trekking, Blood Test Camp, NSS Camp, Trifecta Fest, Freshers Meet, Anti-Ragging Week).
- **Faculty Roster**: Department-wise faculty qualifications and designations.
- **Admin Portal**: Filter admission applications by stream/status, approve/reject students, and publish live notices.
- **4-Column Footer**: Official contact info, important links (State/National scholarship portals, Nagaland University), and quick message form.
