const { query } = require('../config/db');
const { sendInquiryNotification, NOTIFICATION_EMAIL } = require('../services/mailService');

exports.submitInquiry = async (req, res) => {
  try {
    const { full_name, email, phone = '', subject, message } = req.body;
    if (!full_name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Please provide your full name, email address, and message.' });
    }

    const cleanSubject = (subject && typeof subject === 'string' && subject.trim()) ? subject.trim() : 'General Inquiry';

    const result = await query(
      `INSERT INTO inquiries (full_name, email, phone, subject, message, status) VALUES (?, ?, ?, ?, ?, 'UNREAD')`,
      [full_name, email, phone, cleanSubject, message]
    );

    const inquiryId = result.insertId || result.lastID;

    // Asynchronously notify support@excellogics.co.in
    sendInquiryNotification({
      id: inquiryId,
      full_name,
      email,
      phone,
      subject: cleanSubject,
      message
    }).catch(err => {
      console.warn('Mail notification delivery notice:', err.message);
    });

    return res.status(201).json({
      success: true,
      message: `Thank you! Your inquiry has been sent to our administration team at ${NOTIFICATION_EMAIL}.`,
      id: inquiryId
    });
  } catch (error) {
    console.error('Submit inquiry error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getInquiries = async (req, res) => {
  try {
    const inquiries = await query('SELECT * FROM inquiries ORDER BY id DESC');
    return res.json({ success: true, count: inquiries.length, inquiries });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateInquiryStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ success: false, message: 'Status is required' });
    }
    await query('UPDATE inquiries SET status = ? WHERE id = ?', [status.toUpperCase(), id]);
    const updated = await query('SELECT * FROM inquiries WHERE id = ?', [id]);
    return res.json({ success: true, message: 'Inquiry status updated', inquiry: updated[0] });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteInquiry = async (req, res) => {
  try {
    const { id } = req.params;
    await query('DELETE FROM inquiries WHERE id = ?', [id]);
    return res.json({ success: true, message: 'Inquiry deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.testEmail = async (req, res) => {
  try {
    const { testSmtpConnection } = require('../services/mailService');
    const overrideConfig = req.body || {};
    const result = await testSmtpConnection(overrideConfig);
    if (result.success) {
      return res.json({ success: true, message: result.message, messageId: result.messageId });
    } else {
      return res.status(400).json({ success: false, message: result.error });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getMailStatus = async (req, res) => {
  try {
    const { getSmtpConfig } = require('../services/mailService');
    const cfg = await getSmtpConfig();
    return res.json({
      success: true,
      configured: cfg.isConfigured,
      host: cfg.host,
      port: cfg.port,
      user: cfg.user,
      notificationEmail: cfg.notificationEmail
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};


