const nodemailer = require('nodemailer');
const { query } = require('../config/db');

const DEFAULT_NOTIFICATION_EMAIL = 'support@excellogics.co.in';

/**
 * Retrieve SMTP configuration from settings table or process.env
 */
async function getSmtpConfig() {
  let dbConfig = {};
  try {
    const rows = await query(
      "SELECT key, value FROM settings WHERE key IN ('smtp_host', 'smtp_port', 'smtp_user', 'smtp_pass', 'smtp_secure', 'notification_email')"
    );
    if (rows && rows.length > 0) {
      rows.forEach((r) => {
        dbConfig[r.key] = r.value;
      });
    }
  } catch (err) {
    // If db query fails, fall through to process.env
  }

  const host = dbConfig.smtp_host || process.env.SMTP_HOST || '';
  const port = Number(dbConfig.smtp_port || process.env.SMTP_PORT) || 587;
  const user = dbConfig.smtp_user || process.env.SMTP_USER || '';
  const pass = dbConfig.smtp_pass || process.env.SMTP_PASS || '';
  const secure = dbConfig.smtp_secure === 'true' || port === 465;
  const notificationEmail = dbConfig.notification_email || process.env.NOTIFICATION_EMAIL || DEFAULT_NOTIFICATION_EMAIL;

  return {
    host,
    port,
    user,
    pass,
    secure,
    notificationEmail,
    isConfigured: Boolean(host && user && pass)
  };
}

/**
 * Build a Nodemailer transporter based on resolved SMTP config
 */
function createTransporter(cfg) {
  if (cfg.isConfigured) {
    return nodemailer.createTransport({
      host: cfg.host,
      port: cfg.port,
      secure: cfg.secure,
      auth: {
        user: cfg.user,
        pass: cfg.pass
      },
      tls: {
        rejectUnauthorized: false
      }
    });
  }

  // Fallback json transport for offline development
  return nodemailer.createTransport({
    jsonTransport: true
  });
}

/**
 * Send inquiry notification email to support@excellogics.co.in
 */
async function sendInquiryNotification({ id, full_name, email, phone, subject, message }) {
  const cfg = await getSmtpConfig();
  const recipient = cfg.notificationEmail || DEFAULT_NOTIFICATION_EMAIL;

  const mailOptions = {
    from: cfg.user ? `"Capital College Contact" <${cfg.user}>` : `"Capital College Helpdesk" <no-reply@capitalcollege.edu.in>`,
    to: recipient,
    replyTo: `"${full_name}" <${email}>`,
    subject: `🎓 New Inquiry: [${subject || 'General Inquiry'}] from ${full_name}`,
    text: `New Query Submitted via Capital College Contact Portal\n\n` +
      `Inquirer Details:\n` +
      `- Full Name: ${full_name}\n` +
      `- Email Address: ${email}\n` +
      `- Phone Number: ${phone || 'Not provided'}\n` +
      `- Inquiry Subject: ${subject || 'General Inquiry'}\n` +
      `- Inquiry ID: #${id || 'N/A'}\n` +
      `- Timestamp: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST\n\n` +
      `Message:\n${message}\n\n` +
      `--------------------------------------------------\n` +
      `Reply directly to this email to respond to ${full_name} (${email}).`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 620px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; background-color: #ffffff; box-shadow: 0 4px 14px rgba(0,0,0,0.06);">
        <div style="background-color: #002147; padding: 22px 24px; text-align: center; border-bottom: 4px solid #4a6b28;">
          <h2 style="color: #ffffff; margin: 0; font-size: 20px; font-weight: 800; letter-spacing: 0.5px;">Capital College of Higher Education</h2>
          <p style="color: #b5d697; margin: 6px 0 0; font-size: 13px; font-weight: 600;">Official Contact &amp; Helpdesk Portal • New User Query</p>
        </div>
        
        <div style="padding: 24px;">
          <div style="display: inline-block; background-color: #f0fdf4; border: 1px solid #86efac; color: #166534; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 700; margin-bottom: 18px;">
            ✉️ New Student / Parent Query Notification
          </div>

          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 14px;">
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 10px 0; color: #64748b; font-weight: 700; width: 130px;">Full Name:</td>
              <td style="padding: 10px 0; color: #0f172a; font-weight: 700;">${full_name}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 10px 0; color: #64748b; font-weight: 700;">Email Address:</td>
              <td style="padding: 10px 0; color: #0f172a;"><a href="mailto:${email}" style="color: #2563eb; text-decoration: none; font-weight: 600;">${email}</a></td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 10px 0; color: #64748b; font-weight: 700;">Contact Phone:</td>
              <td style="padding: 10px 0; color: #0f172a; font-weight: 600;">${phone || 'Not provided'}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 10px 0; color: #64748b; font-weight: 700;">Query Subject:</td>
              <td style="padding: 10px 0; color: #4a6b28; font-weight: 800;">${subject || 'General Inquiry'}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; color: #64748b; font-weight: 700;">Submitted At:</td>
              <td style="padding: 10px 0; color: #64748b; font-size: 13px;">${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST</td>
            </tr>
          </table>

          <div style="background-color: #f8fafc; border-left: 4px solid #4a6b28; border-radius: 8px; padding: 16px 18px; margin: 18px 0;">
            <h4 style="margin: 0 0 8px; color: #002147; font-size: 13px; text-transform: uppercase; tracking: 0.5px;">User Query Message:</h4>
            <p style="margin: 0; color: #334155; line-height: 1.6; font-size: 14px; white-space: pre-wrap;">${message}</p>
          </div>

          <div style="margin-top: 24px; text-align: center;">
            <a href="mailto:${email}?subject=Re: Capital College Query - ${encodeURIComponent(subject || 'General Inquiry')}" style="display: inline-block; background-color: #4a6b28; color: #ffffff; font-weight: 700; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-size: 14px; box-shadow: 0 2px 6px rgba(74,107,40,0.3);">Reply Directly to ${full_name}</a>
          </div>
        </div>

        <div style="background-color: #f8fafc; padding: 14px; text-align: center; border-top: 1px solid #e2e8f0; font-size: 12px; color: #64748b;">
          Notification dispatched to <strong>${recipient}</strong> &bull; Inquiry securely stored in Capital College Admin Database.
        </div>
      </div>
    `
  };

  try {
    const transporter = createTransporter(cfg);
    const info = await transporter.sendMail(mailOptions);
    if (!cfg.isConfigured) {
      console.warn(`⚠️ Outgoing SMTP not configured yet. Email was simulated locally via jsonTransport (Recipient: ${recipient}). Configure SMTP credentials in Admin Settings or .env to deliver real emails.`);
    } else {
      console.log(`✅ Outgoing inquiry notification successfully sent to ${recipient}:`, info.messageId || 'DELIVERED');
    }
    return {
      success: true,
      delivered: cfg.isConfigured,
      messageId: info.messageId || 'LOCAL_SIMULATED',
      recipient
    };
  } catch (err) {
    console.error(`🚨 Failed to send inquiry email to ${recipient}:`, err.message);
    return { success: false, error: err.message, recipient };
  }
}

/**
 * Test SMTP connection by sending a diagnostic test message
 */
async function testSmtpConnection(overrideConfig = {}) {
  const cfg = await getSmtpConfig();
  const merged = { ...cfg, ...overrideConfig };
  merged.isConfigured = Boolean(merged.host && merged.user && merged.pass);

  if (!merged.isConfigured) {
    return {
      success: false,
      error: 'SMTP host, user/email, and password must all be provided to test real email dispatch.'
    };
  }

  const transporter = createTransporter(merged);
  const targetEmail = merged.notificationEmail || DEFAULT_NOTIFICATION_EMAIL;

  try {
    // Verify connection first
    await transporter.verify();

    // Send test email
    const info = await transporter.sendMail({
      from: `"Capital College Test" <${merged.user}>`,
      to: targetEmail,
      subject: `🧪 Capital College Test Notification — ${new Date().toLocaleTimeString('en-IN')} IST`,
      text: `This is a test notification verifying that the Capital College contact form mail dispatch system is active and functioning.\n\nNotification recipient: ${targetEmail}\nSMTP Account: ${merged.user}\nHost: ${merged.host}:${merged.port}`,
      html: `
        <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #86efac; background-color: #f0fdf4; border-radius: 8px;">
          <h2 style="color: #166534; margin: 0 0 10px;">✅ SMTP Connection Successful!</h2>
          <p style="color: #14532d; font-size: 14px; line-height: 1.5;">This email confirms that your SMTP mail settings are properly configured. All future user queries from the Capital College Contact Us page will be delivered to <strong>${targetEmail}</strong>.</p>
          <hr style="border: none; border-top: 1px solid #bbf7d0; margin: 15px 0;" />
          <p style="color: #64748b; font-size: 12px; margin: 0;">Sent via ${merged.host}:${merged.port} on ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST</p>
        </div>
      `
    });

    return {
      success: true,
      message: `Test email successfully dispatched to ${targetEmail}!`,
      messageId: info.messageId
    };
  } catch (err) {
    return {
      success: false,
      error: err.message
    };
  }
}

module.exports = {
  sendInquiryNotification,
  testSmtpConnection,
  getSmtpConfig,
  NOTIFICATION_EMAIL: DEFAULT_NOTIFICATION_EMAIL
};
