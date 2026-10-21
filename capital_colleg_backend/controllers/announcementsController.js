const { query } = require('../config/db');

// GET /api/announcements
exports.getAnnouncements = async (req, res) => {
  try {
    const { active_only } = req.query;
    let sql = 'SELECT * FROM announcements';
    const params = [];

    if (active_only === 'true' || active_only === '1') {
      sql += ' WHERE is_active = 1';
    }

    sql += ' ORDER BY display_order ASC, id DESC';
    const announcements = await query(sql, params);

    // Fetch banner global settings
    let settings = {
      top_banner_enabled: true,
      top_banner_speed: 5500,
      top_banner_show_notice_board: true
    };

    try {
      const sRows = await query("SELECT `key`, `value` FROM settings WHERE `key` LIKE 'top_banner_%'");
      if (sRows && sRows.length > 0) {
        sRows.forEach((r) => {
          if (r.key === 'top_banner_enabled') settings.top_banner_enabled = r.value === 'true';
          if (r.key === 'top_banner_speed') settings.top_banner_speed = parseInt(r.value, 10) || 5500;
          if (r.key === 'top_banner_show_notice_board') settings.top_banner_show_notice_board = r.value === 'true';
        });
      }
    } catch (sErr) {
      console.warn('Could not read banner settings:', sErr.message);
    }

    return res.json({
      success: true,
      count: announcements.length,
      settings,
      announcements
    });
  } catch (error) {
    console.error('Error fetching announcements:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/announcements
exports.createAnnouncement = async (req, res) => {
  try {
    const {
      tag,
      text,
      action_label,
      action_type = 'page',
      action_page = '',
      action_href = '',
      secondary_label = '',
      secondary_href = '',
      is_active = 1,
      display_order = 0
    } = req.body;

    if (!tag || !text) {
      return res.status(400).json({ success: false, message: 'Tag and announcement text are required.' });
    }

    const result = await query(
      `INSERT INTO announcements (tag, text, action_label, action_type, action_page, action_href, secondary_label, secondary_href, is_active, display_order)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        tag.trim().toUpperCase(),
        text.trim(),
        (action_label || 'Learn More').trim(),
        action_type || 'page',
        action_page ? action_page.trim() : '',
        action_href ? action_href.trim() : '',
        secondary_label ? secondary_label.trim() : '',
        secondary_href ? secondary_href.trim() : '',
        is_active ? 1 : 0,
        parseInt(display_order, 10) || 0
      ]
    );

    const inserted = await query('SELECT * FROM announcements WHERE id = ?', [result.insertId || result.lastID]);

    return res.status(201).json({
      success: true,
      message: 'Announcement published to ticker successfully.',
      announcement: inserted[0]
    });
  } catch (error) {
    console.error('Error creating announcement:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/announcements/:id
exports.updateAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      tag,
      text,
      action_label,
      action_type,
      action_page,
      action_href,
      secondary_label,
      secondary_href,
      is_active,
      display_order
    } = req.body;

    const existing = await query('SELECT * FROM announcements WHERE id = ?', [id]);
    if (!existing || existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Announcement not found.' });
    }

    const cur = existing[0];
    await query(
      `UPDATE announcements 
       SET tag = ?, text = ?, action_label = ?, action_type = ?, action_page = ?, action_href = ?, secondary_label = ?, secondary_href = ?, is_active = ?, display_order = ?
       WHERE id = ?`,
      [
        tag ? tag.trim().toUpperCase() : cur.tag,
        text ? text.trim() : cur.text,
        action_label !== undefined ? action_label.trim() : cur.action_label,
        action_type !== undefined ? action_type : cur.action_type,
        action_page !== undefined ? action_page.trim() : cur.action_page,
        action_href !== undefined ? action_href.trim() : cur.action_href,
        secondary_label !== undefined ? secondary_label.trim() : cur.secondary_label,
        secondary_href !== undefined ? secondary_href.trim() : cur.secondary_href,
        is_active !== undefined ? (is_active ? 1 : 0) : cur.is_active,
        display_order !== undefined ? parseInt(display_order, 10) : cur.display_order,
        id
      ]
    );

    const updated = await query('SELECT * FROM announcements WHERE id = ?', [id]);
    return res.json({
      success: true,
      message: 'Announcement updated successfully.',
      announcement: updated[0]
    });
  } catch (error) {
    console.error('Error updating announcement:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// PATCH /api/announcements/:id/toggle (Instant Decide What to Show / Hide)
exports.toggleAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await query('SELECT * FROM announcements WHERE id = ?', [id]);
    if (!existing || existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Announcement not found.' });
    }

    const newActive = existing[0].is_active ? 0 : 1;
    await query('UPDATE announcements SET is_active = ? WHERE id = ?', [newActive, id]);

    return res.json({
      success: true,
      message: `Announcement ${newActive ? 'activated on live ticker' : 'hidden from public view'}.`,
      id: parseInt(id, 10),
      is_active: newActive
    });
  } catch (error) {
    console.error('Error toggling announcement:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/announcements/:id
exports.deleteAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await query('SELECT * FROM announcements WHERE id = ?', [id]);
    if (!existing || existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Announcement not found.' });
    }

    await query('DELETE FROM announcements WHERE id = ?', [id]);
    return res.json({ success: true, message: 'Announcement deleted successfully.' });
  } catch (error) {
    console.error('Error deleting announcement:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/announcements/settings
exports.updateBannerSettings = async (req, res) => {
  try {
    const { top_banner_enabled, top_banner_speed, top_banner_show_notice_board } = req.body;

    const upsert = async (k, val) => {
      const existing = await query('SELECT `key` FROM settings WHERE `key` = ?', [k]);
      if (existing && existing.length > 0) {
        await query('UPDATE settings SET `value` = ? WHERE `key` = ?', [String(val), k]);
      } else {
        await query('INSERT INTO settings (`key`, `value`) VALUES (?, ?)', [k, String(val)]);
      }
    };

    if (top_banner_enabled !== undefined) {
      await upsert('top_banner_enabled', top_banner_enabled ? 'true' : 'false');
    }
    if (top_banner_speed !== undefined) {
      await upsert('top_banner_speed', String(top_banner_speed));
    }
    if (top_banner_show_notice_board !== undefined) {
      await upsert('top_banner_show_notice_board', top_banner_show_notice_board ? 'true' : 'false');
    }

    return res.json({
      success: true,
      message: 'Top Alert Bar settings saved successfully.',
      settings: {
        top_banner_enabled: Boolean(top_banner_enabled),
        top_banner_speed: parseInt(top_banner_speed, 10) || 5500,
        top_banner_show_notice_board: Boolean(top_banner_show_notice_board)
      }
    });
  } catch (error) {
    console.error('Error saving banner settings:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/announcements/from-notice (1-click feature notice in ticker)
exports.importFromNotice = async (req, res) => {
  try {
    const { notice_id } = req.body;
    if (!notice_id) {
      return res.status(400).json({ success: false, message: 'Notice ID is required.' });
    }

    const notices = await query('SELECT * FROM notices WHERE id = ?', [notice_id]);
    if (!notices || notices.length === 0) {
      return res.status(404).json({ success: false, message: 'Notice not found.' });
    }

    const n = notices[0];
    const tag = (n.category || 'NOTICE').toUpperCase();
    const text = n.title;
    const action_label = n.item_type === 'event' ? 'View Event' : 'Read Notice';
    const action_type = 'page';
    const action_page = 'notice';
    const secondary_label = n.pdf_url ? 'PDF' : '';
    const secondary_href = n.pdf_url || '';

    const result = await query(
      `INSERT INTO announcements (tag, text, action_label, action_type, action_page, action_href, secondary_label, secondary_href, is_active, display_order)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, 0)`,
      [tag, text, action_label, action_type, action_page, '', secondary_label, secondary_href]
    );

    const created = await query('SELECT * FROM announcements WHERE id = ?', [result.insertId || result.lastID]);

    return res.status(201).json({
      success: true,
      message: 'Notice added to Top Alert Bar successfully!',
      announcement: created[0]
    });
  } catch (error) {
    console.error('Error importing notice to ticker:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
