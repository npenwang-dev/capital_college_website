const express = require('express');
const router = express.Router();
const { query } = require('../config/db');

// GET /api/settings - Fetch all settings
router.get('/', async (req, res) => {
  try {
    const rows = await query('SELECT `key`, `value` FROM settings');
    const settings = {};
    if (rows && rows.length > 0) {
      rows.forEach((r) => {
        settings[r.key] = r.value;
      });
    }
    return res.json({ success: true, settings });
  } catch (error) {
    console.error('Error fetching settings:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/settings - Save or update multiple settings
router.post('/', async (req, res) => {
  try {
    const settings = req.body;
    if (!settings || typeof settings !== 'object') {
      return res.status(400).json({ success: false, message: 'Invalid settings payload' });
    }

    for (const [key, val] of Object.entries(settings)) {
      const valStr = typeof val === 'object' ? JSON.stringify(val) : String(val ?? '');
      const existing = await query('SELECT `key` FROM settings WHERE `key` = ?', [key]);
      if (existing && existing.length > 0) {
        await query('UPDATE settings SET `value` = ? WHERE `key` = ?', [valStr, key]);
      } else {
        await query('INSERT INTO settings (`key`, `value`) VALUES (?, ?)', [key, valStr]);
      }
    }

    return res.json({ success: true, message: 'Settings saved successfully' });
  } catch (error) {
    console.error('Error updating settings:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
