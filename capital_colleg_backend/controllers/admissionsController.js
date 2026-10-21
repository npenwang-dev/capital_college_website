const { query } = require('../config/db');

// Helper to generate application number
function generateApplicationNo() {
  const year = new Date().getFullYear();
  const random = Math.floor(1000 + Math.random() * 9000);
  return `CCH-${year}-${random}`;
}

exports.submitApplication = async (req, res) => {
  try {
    const {
      full_name,
      email,
      phone,
      dob,
      gender,
      category = 'ST',
      stream,
      course_type = 'HONOURS',
      major_subject,
      minor_subjects = '',
      marks_10th = null,
      marks_12th,
      previous_school = '',
      board_name = 'NBSE',
      guardian_name,
      guardian_phone,
      address,
      is_admin_entry = false
    } = req.body;

    // Check if online admissions are currently open
    try {
      const settings = await query("SELECT `value` FROM settings WHERE `key` = 'admissions_open'");
      const isOpen = settings && settings[0] && settings[0].value === 'true';
      if (!isOpen && !is_admin_entry) {
        const noticeRow = await query("SELECT `value` FROM settings WHERE `key` = 'admissions_notice'");
        const notice = (noticeRow && noticeRow[0] && noticeRow[0].value) || 'Online admissions are closed for now for the current academic session. Please submit an offline application or contact the college office.';
        return res.status(403).json({
          success: false,
          admissions_closed: true,
          message: notice
        });
      }
    } catch (checkErr) {
      console.warn('Settings check warning:', checkErr.message);
    }

    if (!full_name || !email || !phone || !stream || !major_subject || !marks_12th || !guardian_name || !address) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in all required fields (Name, Email, Phone, Stream, Major, 12th Marks, Guardian Name, Address).'
      });
    }

    const application_no = generateApplicationNo();

    const result = await query(
      `INSERT INTO applications (
        application_no, full_name, email, phone, dob, gender, category,
        stream, course_type, major_subject, minor_subjects, marks_10th, marks_12th,
        previous_school, board_name, guardian_name, guardian_phone, address, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'PENDING')`,
      [
        application_no, full_name, email, phone, dob || '2005-01-01', gender || 'Other', category,
        stream, course_type, major_subject, minor_subjects, marks_10th, parseFloat(marks_12th),
        previous_school, board_name, guardian_name, guardian_phone || phone, address
      ]
    );

    const created = await query(`SELECT * FROM applications WHERE application_no = ?`, [application_no]);

    return res.status(201).json({
      success: true,
      message: 'Admission application submitted successfully!',
      application: created[0]
    });
  } catch (error) {
    console.error('Error submitting application:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to submit application: ' + error.message
    });
  }
};

exports.getApplications = async (req, res) => {
  try {
    const { stream, status, search } = req.query;
    let sql = 'SELECT * FROM applications WHERE 1=1';
    const params = [];

    if (stream) {
      sql += ' AND stream = ?';
      params.push(stream.toUpperCase());
    }
    if (status) {
      sql += ' AND status = ?';
      params.push(status.toUpperCase());
    }
    if (search) {
      sql += ' AND (full_name LIKE ? OR application_no LIKE ? OR email LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    sql += ' ORDER BY id DESC';
    const applications = await query(sql, params);

    return res.json({
      success: true,
      count: applications.length,
      applications
    });
  } catch (error) {
    console.error('Error fetching applications:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch applications'
    });
  }
};

exports.getApplicationById = async (req, res) => {
  try {
    const { id } = req.params;
    const apps = await query('SELECT * FROM applications WHERE id = ? OR application_no = ?', [id, id]);
    if (!apps || apps.length === 0) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }
    return res.json({ success: true, application: apps[0] });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, remarks = '' } = req.body;

    const validStatuses = ['PENDING', 'UNDER_REVIEW', 'APPROVED', 'REJECTED'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value' });
    }

    const existingApps = await query('SELECT * FROM applications WHERE id = ? OR application_no = ?', [id, id]);
    if (!existingApps || existingApps.length === 0) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }
    const app = existingApps[0];

    await query(
      'UPDATE applications SET status = ?, remarks = ? WHERE id = ? OR application_no = ?',
      [status, remarks, id, id]
    );

    const updated = await query('SELECT * FROM applications WHERE id = ? OR application_no = ?', [id, id]);
    const updatedApp = updated[0];

    // Notification Title & Message Formulation
    let notifTitle = `Admission Application Status: ${status}`;
    let notifMessage = remarks;

    if (status === 'APPROVED') {
      notifTitle = `Admission Application Approved - Capital College Kohima`;
      notifMessage = remarks || `Congratulations ${app.full_name}! Your application for admission to ${app.course_type || 'HONOURS'} in ${app.major_subject} (${app.stream}) has been APPROVED. Please report to the Principal's Office at Capital College Kohima for document verification and fee payment.`;
    } else if (status === 'REJECTED') {
      notifTitle = `Admission Application Review Notice - Capital College Kohima`;
      notifMessage = remarks || `Dear ${app.full_name}, we regret to inform you that your admission application for ${app.major_subject} could not be approved due to seat constraints or cut-off criteria. You are welcome to contact the academic counseling desk.`;
    } else if (status === 'UNDER_REVIEW') {
      notifTitle = `Admission Application Under Review - Capital College Kohima`;
      notifMessage = remarks || `Dear ${app.full_name}, your application credentials and marksheet are currently under active evaluation by the Admissions Committee.`;
    }

    // Insert into notifications table
    await query(
      `INSERT INTO notifications (application_no, recipient_email, recipient_phone, status, title, message)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [app.application_no, app.email, app.phone, status, notifTitle, notifMessage]
    );

    console.log(`🔔 [Applicant Notification Dispatched] Application: ${app.application_no} | Student: ${app.full_name} | Status: ${status} | Email: ${app.email}`);

    return res.json({
      success: true,
      message: `Application ${status.toLowerCase()} and notification sent to student.`,
      application: updatedApp,
      notification: {
        title: notifTitle,
        message: notifMessage,
        recipient_email: app.email,
        recipient_phone: app.phone
      }
    });
  } catch (error) {
    console.error('Error updating application status:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.trackApplication = async (req, res) => {
  try {
    const appNo = (req.query.application_no || req.params.appNo || req.query.appNo || '').trim();
    const phone = (req.query.phone || '').trim();

    if (!appNo) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an Application Reference Number (e.g. CCH-2024-XXXX).'
      });
    }

    let sql = 'SELECT * FROM applications WHERE UPPER(application_no) = UPPER(?)';
    const params = [appNo];

    if (phone) {
      sql += ' AND phone LIKE ?';
      params.push(`%${phone}%`);
    }

    const apps = await query(sql, params);

    if (!apps || apps.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No application found for Reference Number "${appNo}". Please verify your reference number.`
      });
    }

    const application = apps[0];

    // Fetch official notifications history
    const notifications = await query(
      'SELECT * FROM notifications WHERE application_no = ? ORDER BY id DESC',
      [application.application_no]
    );

    return res.json({
      success: true,
      application,
      notifications: notifications || []
    });
  } catch (error) {
    console.error('Error tracking application:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve application status: ' + error.message
    });
  }
};

exports.deleteApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await query('SELECT * FROM applications WHERE id = ? OR application_no = ?', [id, id]);
    if (!existing || existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }
    const app = existing[0];
    await query('DELETE FROM applications WHERE id = ? OR application_no = ?', [id, id]);
    await query('DELETE FROM notifications WHERE application_no = ?', [app.application_no]);
    return res.json({ success: true, message: `Application ${app.application_no} removed successfully.` });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAdmissionStatus = async (req, res) => {
  try {
    let admissions_open = false; // Closed for now by default
    let admissions_notice = 'Online admissions for FYUGP 4-Year B.A. & B.Sc. programmes are closed for now. Please download the official print form (PDF) or visit the college office at P.R. Hill, Kohima.';
    let academic_year = '2024-25';

    try {
      const rows = await query('SELECT `key`, `value` FROM settings');
      if (rows && rows.length > 0) {
        rows.forEach(r => {
          if (r.key === 'admissions_open') admissions_open = r.value === 'true';
          if (r.key === 'admissions_notice') admissions_notice = r.value;
          if (r.key === 'academic_year') academic_year = r.value;
        });
      }
    } catch (dbErr) {
      console.warn('Settings query warning:', dbErr.message);
    }

    // Monitoring stats
    let stats = {
      total: 0,
      arts: 0,
      science: 0,
      pending: 0,
      under_review: 0,
      approved: 0,
      rejected: 0
    };

    try {
      const allApps = await query('SELECT stream, status FROM applications');
      if (allApps && allApps.length > 0) {
        stats.total = allApps.length;
        allApps.forEach(a => {
          const st = (a.stream || '').toUpperCase();
          const s = (a.status || '').toUpperCase();
          if (st === 'ARTS') stats.arts++;
          if (st === 'SCIENCE') stats.science++;
          if (s === 'PENDING') stats.pending++;
          if (s === 'UNDER_REVIEW') stats.under_review++;
          if (s === 'APPROVED') stats.approved++;
          if (s === 'REJECTED') stats.rejected++;
        });
      }
    } catch (statErr) {
      console.warn('Stats computation error:', statErr.message);
    }

    return res.json({
      success: true,
      admissions_open,
      notice: admissions_notice,
      academic_year,
      stats
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateAdmissionStatus = async (req, res) => {
  try {
    const { admissions_open, notice, academic_year } = req.body;

    const boolVal = admissions_open === true || admissions_open === 'true' ? 'true' : 'false';

    const upsertSetting = async (k, v) => {
      const existing = await query('SELECT `key` FROM settings WHERE `key` = ?', [k]);
      if (existing && existing.length > 0) {
        await query('UPDATE settings SET `value` = ? WHERE `key` = ?', [String(v), k]);
      } else {
        await query('INSERT INTO settings (`key`, `value`) VALUES (?, ?)', [k, String(v)]);
      }
    };

    await upsertSetting('admissions_open', boolVal);
    if (notice !== undefined) await upsertSetting('admissions_notice', notice);
    if (academic_year !== undefined) await upsertSetting('academic_year', academic_year);

    console.log(`⚙️ [Admin Action] Online admissions set to: ${boolVal === 'true' ? 'OPEN' : 'CLOSED FOR NOW'}`);

    return res.json({
      success: true,
      message: `Online admissions ${boolVal === 'true' ? 'opened' : 'closed for now'} successfully.`,
      admissions_open: boolVal === 'true',
      notice: notice || 'Settings saved'
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};


