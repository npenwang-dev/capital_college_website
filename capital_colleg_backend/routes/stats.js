const express = require('express');
const router = express.Router();
const { query, getDatabaseStatus } = require('../config/db');

router.get('/', async (req, res) => {
  try {
    const totalAppsRow = await query('SELECT COUNT(*) as count FROM applications');
    const coursesRow = await query('SELECT COUNT(*) as count FROM courses');
    const noticesRow = await query('SELECT COUNT(*) as count FROM notices');
    const facultyRow = await query('SELECT COUNT(*) as count FROM faculty');
    const inqRow = await query('SELECT COUNT(*) as count FROM inquiries');
    const unreadInqRow = await query("SELECT COUNT(*) as count FROM inquiries WHERE status = 'UNREAD'");
    const adminCountRow = await query('SELECT COUNT(*) as count FROM admin_users');

    // Status breakdown
    const statusRows = await query('SELECT status, COUNT(*) as count FROM applications GROUP BY status');
    const statusMap = { PENDING: 0, UNDER_REVIEW: 0, APPROVED: 0, REJECTED: 0 };
    statusRows.forEach((r) => {
      if (r.status) statusMap[r.status] = r.count;
    });

    // Stream breakdown
    const streamRows = await query('SELECT stream, COUNT(*) as count FROM applications GROUP BY stream');
    const streamMap = { ARTS: 0, SCIENCE: 0 };
    streamRows.forEach((r) => {
      if (r.stream) streamMap[r.stream] = r.count;
    });

    // Gender breakdown
    const genderRows = await query('SELECT gender, COUNT(*) as count FROM applications GROUP BY gender');
    const genderMap = {};
    genderRows.forEach((r) => {
      if (r.gender) genderMap[r.gender] = r.count;
    });

    // Major breakdown
    const majorRows = await query('SELECT major_subject, COUNT(*) as count FROM applications GROUP BY major_subject ORDER BY count DESC');

    // Average 12th marks
    const avgMarksRow = await query('SELECT AVG(marks_12th) as avgMarks FROM applications');
    const avgMarks = avgMarksRow[0]?.avgMarks ? parseFloat(avgMarksRow[0].avgMarks).toFixed(1) : '0.0';

    // Total notifications logged
    const notifRow = await query('SELECT COUNT(*) as count FROM notifications');

    // List of active admin accounts
    const adminList = await query('SELECT id, username, full_name, email, role, created_at FROM admin_users ORDER BY id ASC');

    return res.json({
      success: true,
      stats: {
        totalApplications: totalAppsRow[0]?.count || 0,
        pendingApplications: statusMap.PENDING || 0,
        underReviewApplications: statusMap.UNDER_REVIEW || 0,
        approvedApplications: statusMap.APPROVED || 0,
        rejectedApplications: statusMap.REJECTED || 0,
        streamBreakdown: streamMap,
        statusBreakdown: statusMap,
        genderBreakdown: genderMap,
        majorBreakdown: majorRows,
        averageMarks: avgMarks,
        totalInquiries: inqRow[0]?.count || 0,
        unreadInquiries: unreadInqRow[0]?.count || 0,
        totalNotificationsDispatched: notifRow[0]?.count || 0,
        totalCourses: coursesRow[0]?.count || 0,
        totalNotices: noticesRow[0]?.count || 0,
        totalFaculty: facultyRow[0]?.count || 0,
        totalAdmins: adminCountRow[0]?.count || 0,
        adminUsers: adminList || [],
        establishedYear: 2004,
        graduatedBatches: '17+',
        studentTeacherRatio: '10:1',
        campuses: 2,
        universityAffiliation: 'Nagaland University',
        ugcRecognition: 'Art. 2(f) & 12(B)'
      },
      database: getDatabaseStatus()
    });
  } catch (error) {
    console.error('Error fetching monitoring stats:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
