const { initDB, query } = require('../config/db');

async function createAdmin() {
  const username = process.argv[2];
  const password = process.argv[3];
  const fullName = process.argv[4] || 'College Administrator';
  const email = process.argv[5] || `${username}@capitalcollege.edu.in`;

  if (!username || !password) {
    console.log('📌 Usage: node scripts/createAdmin.js <username> <password> [fullName] [email]');
    console.log('📌 Example: node scripts/createAdmin.js npenwang MySecurePass123 "Npen Wang" npen@capitalcollege.edu.in');
    process.exit(1);
  }

  await initDB();

  const existing = await query('SELECT * FROM admin_users WHERE username = ?', [username.trim()]);
  if (existing && existing.length > 0) {
    console.log(`ℹ️ User "${username}" already exists. Updating password & profile...`);
    await query(
      'UPDATE admin_users SET password = ?, full_name = ?, email = ? WHERE username = ?',
      [password.trim(), fullName.trim(), email.trim(), username.trim()]
    );
  } else {
    await query(
      'INSERT INTO admin_users (username, password, email, full_name, role) VALUES (?, ?, ?, ?, ?)',
      [username.trim(), password.trim(), email.trim(), fullName.trim(), 'SUPER_ADMIN']
    );
  }

  // Also ensure SQLite persistent storage is updated if it exists
  try {
    const sqlite3 = require('sqlite3').verbose();
    const path = require('path');
    const fs = require('fs');
    const dbFile = path.join(__dirname, '..', 'data', 'capital_college.sqlite');
    if (fs.existsSync(dbFile)) {
      const sdb = new sqlite3.Database(dbFile);
      sdb.run(
        `INSERT INTO admin_users (username, password, email, full_name, role)
         VALUES (?, ?, ?, ?, 'SUPER_ADMIN')
         ON CONFLICT(username) DO UPDATE SET password = excluded.password, full_name = excluded.full_name, email = excluded.email`,
        [username.trim(), password.trim(), email.trim(), fullName.trim()],
        () => sdb.close()
      );
    }
  } catch (syncErr) {
    // Ignore SQLite optional sync error
  }

  console.log(`✅ Success! Custom Admin Account Configured:`);
  console.log(`   Username  : ${username.trim()}`);
  console.log(`   Password  : ${password.trim()}`);
  console.log(`   Full Name : ${fullName.trim()}`);
  console.log(`   Role      : SUPER_ADMIN`);
  console.log(`\nYou can now sign in at http://localhost:5173/admin with this username & password!`);
  process.exit(0);
}

createAdmin().catch(err => {
  console.error('❌ Error creating admin user:', err.message);
  process.exit(1);
});
