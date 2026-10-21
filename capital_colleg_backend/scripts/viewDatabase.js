const { initDB, query, getDatabaseStatus } = require('../config/db');
const path = require('path');

async function viewDatabase() {
  const tableArg = (process.argv[2] || '').toLowerCase();

  await initDB();
  const dbStatus = getDatabaseStatus();

  console.log('\n======================================================');
  console.log('🏛️  CAPITAL COLLEGE DATABASE INSPECTOR');
  console.log('======================================================');
  console.log(`📡 Active Database Engine : ${dbStatus.engine.toUpperCase()}`);
  console.log(`📁 Database Name          : ${dbStatus.database}`);
  if (dbStatus.engine === 'sqlite') {
    const sqlitePath = path.join(__dirname, '..', 'data', 'capital_college.sqlite');
    console.log(`📍 File Location          : ${sqlitePath}`);
  } else {
    console.log(`📍 Host Server            : localhost:3306`);
  }
  console.log('------------------------------------------------------\n');

  // Summary Table Counts
  const tables = ['applications', 'admin_users', 'courses', 'notices', 'inquiries', 'notifications', 'faculty'];
  const summary = [];

  for (const t of tables) {
    try {
      const rows = await query(`SELECT COUNT(*) as count FROM ${t}`);
      summary.push({ Table: t, 'Total Records': rows[0]?.count || 0 });
    } catch (e) {
      summary.push({ Table: t, 'Total Records': 'Table not created' });
    }
  }

  console.log('📊 DATABASE TABLES & RECORD COUNTS:');
  console.table(summary);

  // If specific table requested or by default show applications and admin users
  if (tableArg === 'admins' || tableArg === 'admin_users' || !tableArg) {
    console.log('\n🔐 REGISTERED ADMINISTRATOR ACCOUNTS (admin_users):');
    try {
      const admins = await query('SELECT id, username, password, full_name, role, email, created_at FROM admin_users');
      console.table(admins);
    } catch (e) {
      console.log('Could not fetch admins:', e.message);
    }
  }

  if (tableArg === 'applications' || tableArg === 'apps' || !tableArg) {
    console.log('\n🎓 LATEST ADMISSION APPLICATIONS (applications):');
    try {
      const apps = await query('SELECT id, application_no, full_name, stream, major_subject, marks_12th, phone, status FROM applications ORDER BY id DESC LIMIT 10');
      console.table(apps);
    } catch (e) {
      console.log('Could not fetch applications:', e.message);
    }
  }

  if (tableArg === 'notices') {
    console.log('\n📢 CAMPUS NOTICES & BULLETINS:');
    const notices = await query('SELECT id, title, category, event_date FROM notices LIMIT 10');
    console.table(notices);
  }

  if (tableArg === 'notifications') {
    console.log('\n🔔 STUDENT NOTIFICATION LOGS:');
    const notifs = await query('SELECT id, application_no, recipient_email, recipient_phone, status, title FROM notifications ORDER BY id DESC LIMIT 10');
    console.table(notifs);
  }

  console.log('\n💡 Tip: To view a specific table, run:');
  console.log('   node scripts/viewDatabase.js <table_name>');
  console.log('   e.g. node scripts/viewDatabase.js applications');
  console.log('        node scripts/viewDatabase.js admins');
  console.log('        node scripts/viewDatabase.js notifications\n');

  process.exit(0);
}

viewDatabase().catch(err => {
  console.error('Error inspecting database:', err);
  process.exit(1);
});
