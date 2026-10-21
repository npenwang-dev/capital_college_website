const { initDB, query } = require('../config/db');

async function setPassword() {
  const newPassword = process.argv[2];
  const username = process.argv[3] || 'admin';

  if (!newPassword) {
    console.log('Usage: node scripts/setPassword.js <new_password> [username]');
    console.log('Example: node scripts/setPassword.js MySecurePassword123 admin');
    process.exit(1);
  }

  await initDB();

  const users = await query('SELECT * FROM admin_users WHERE username = ?', [username]);
  if (!users || users.length === 0) {
    console.log(`❌ User "${username}" not found. Inserting new admin user...`);
    await query(
      'INSERT INTO admin_users (username, password, email, full_name, role) VALUES (?, ?, ?, ?, ?)',
      [username, newPassword.trim(), 'principal@capitalcollege.edu.in', 'College Administrator', 'SUPER_ADMIN']
    );
  } else {
    await query('UPDATE admin_users SET password = ? WHERE username = ?', [newPassword.trim(), username]);
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
        `UPDATE admin_users SET password = ? WHERE username = ?`,
        [newPassword.trim(), username],
        () => sdb.close()
      );
    }
  } catch (syncErr) {
    // Ignore SQLite optional sync error
  }

  console.log(`✅ Success! Password for admin user "${username}" has been set to: "${newPassword.trim()}"`);
  process.exit(0);
}

setPassword().catch(err => {
  console.error('❌ Error setting password:', err.message);
  process.exit(1);
});
