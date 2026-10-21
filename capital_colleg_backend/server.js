const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { initDB, getDatabaseStatus } = require('./config/db');

const admissionsRoutes = require('./routes/admissions');
const noticesRoutes = require('./routes/notices');
const coursesRoutes = require('./routes/courses');
const contactRoutes = require('./routes/contact');
const statsRoutes = require('./routes/stats');
const authRoutes = require('./routes/auth');
const facultyRoutes = require('./routes/faculty');
const governingBodyRoutes = require('./routes/governingBody');
const announcementsRoutes = require('./routes/announcements');
const socialLinksRoutes = require('./routes/socialLinks');
const documentsRoutes = require('./routes/documents');
const settingsRoutes = require('./routes/settings');

const app = express();
const PORT = process.env.PORT || 5001;

const path = require('path');
const fs = require('fs');

// Middleware
app.use(cors());
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Static / Direct Download for Official Admission Form
app.get(['/admission_form.pdf', '/api/admission_form.pdf', '/api/download/admission_form.pdf'], (req, res) => {
  const backendFilePath = path.join(__dirname, 'data', 'admission_form.pdf');
  const frontendFilePath = path.join(__dirname, '..', 'capital_college_frontend', 'public', 'admission_form.pdf');

  let targetPath = backendFilePath;
  if (!fs.existsSync(targetPath) && fs.existsSync(frontendFilePath)) {
    targetPath = frontendFilePath;
  }

  res.download(targetPath, 'admission_form.pdf', (err) => {
    if (err) {
      console.error('Error sending admission_form.pdf:', err);
      if (!res.headersSent) res.status(404).send('Admission Form file not found.');
    }
  });
});

// API Routes
app.use('/api/admissions', admissionsRoutes);
app.use('/api/notices', noticesRoutes);
app.use('/api/courses', coursesRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/faculty', facultyRoutes);
app.use('/api/governing-body', governingBodyRoutes);
app.use('/api/announcements', announcementsRoutes);
app.use('/api/social-links', socialLinksRoutes);
app.use('/api/documents', documentsRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/admin', authRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    institution: 'Capital College of Higher Education, Kohima',
    timestamp: new Date().toISOString(),
    database: getDatabaseStatus()
  });
});

// Root welcome
app.get('/', (req, res) => {
  res.send('Capital College of Higher Education Backend API is running.');
});

// Start Server
async function start() {
  await initDB();
  const server = app.listen(PORT, () => {
    console.log(`🎓 Capital College API server running on port ${PORT}`);
    console.log(`📍 Health Check: http://localhost:${PORT}/api/health`);
  });
  server.on('error', (err) => {
    console.error('🚨 Server error:', err.code, err.message);
  });
}

start().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
