const { query } = require('../config/db');

// GET /api/social-links
exports.getSocialLinks = async (req, res) => {
  try {
    const { active_only } = req.query;
    let sql = 'SELECT * FROM social_links';
    const params = [];

    if (active_only === 'true' || active_only === '1') {
      sql += ' WHERE is_active = 1';
    }

    sql += ' ORDER BY display_order ASC, id ASC';
    const links = await query(sql, params);

    return res.json({
      success: true,
      count: links.length,
      links
    });
  } catch (error) {
    console.error('Error fetching social links:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/social-links
exports.createSocialLink = async (req, res) => {
  try {
    const { platform, label, url, is_active = 1, display_order = 0 } = req.body;

    if (!platform || !url) {
      return res.status(400).json({ success: false, message: 'Platform and URL are required.' });
    }

    const defaultLabels = {
      whatsapp: 'WhatsApp Helpline',
      facebook: 'Facebook',
      instagram: 'Instagram',
      youtube: 'YouTube Channel',
      twitter: 'Twitter / X',
      linkedin: 'LinkedIn',
      telegram: 'Telegram'
    };

    const finalLabel = label && label.trim() ? label.trim() : (defaultLabels[platform.toLowerCase()] || platform);

    const result = await query(
      `INSERT INTO social_links (platform, label, url, is_active, display_order)
       VALUES (?, ?, ?, ?, ?)`,
      [
        platform.trim().toLowerCase(),
        finalLabel,
        url.trim(),
        is_active ? 1 : 0,
        parseInt(display_order, 10) || 0
      ]
    );

    const created = await query('SELECT * FROM social_links WHERE id = ?', [result.insertId || result.lastID]);

    return res.status(201).json({
      success: true,
      message: 'Social channel added successfully.',
      link: created[0]
    });
  } catch (error) {
    console.error('Error creating social link:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/social-links/:id
exports.updateSocialLink = async (req, res) => {
  try {
    const { id } = req.params;
    const { platform, label, url, is_active, display_order } = req.body;

    const existing = await query('SELECT * FROM social_links WHERE id = ?', [id]);
    if (!existing || existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Social link not found.' });
    }

    const cur = existing[0];
    await query(
      `UPDATE social_links
       SET platform = ?, label = ?, url = ?, is_active = ?, display_order = ?
       WHERE id = ?`,
      [
        platform ? platform.trim().toLowerCase() : cur.platform,
        label !== undefined ? label.trim() : cur.label,
        url ? url.trim() : cur.url,
        is_active !== undefined ? (is_active ? 1 : 0) : cur.is_active,
        display_order !== undefined ? parseInt(display_order, 10) : cur.display_order,
        id
      ]
    );

    const updated = await query('SELECT * FROM social_links WHERE id = ?', [id]);
    return res.json({
      success: true,
      message: 'Social link updated successfully.',
      link: updated[0]
    });
  } catch (error) {
    console.error('Error updating social link:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// PATCH /api/social-links/:id/toggle (Show / Hide toggle)
exports.toggleSocialLink = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await query('SELECT * FROM social_links WHERE id = ?', [id]);
    if (!existing || existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Social link not found.' });
    }

    const newActive = existing[0].is_active ? 0 : 1;
    await query('UPDATE social_links SET is_active = ? WHERE id = ?', [newActive, id]);

    return res.json({
      success: true,
      message: `Channel ${newActive ? 'enabled' : 'hidden'} on public website.`,
      id: parseInt(id, 10),
      is_active: newActive
    });
  } catch (error) {
    console.error('Error toggling social link:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/social-links/:id
exports.deleteSocialLink = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await query('SELECT * FROM social_links WHERE id = ?', [id]);
    if (!existing || existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Social link not found.' });
    }

    await query('DELETE FROM social_links WHERE id = ?', [id]);
    return res.json({ success: true, message: 'Social link removed successfully.' });
  } catch (error) {
    console.error('Error deleting social link:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
