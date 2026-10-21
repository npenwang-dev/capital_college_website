const { query } = require('../config/db');

exports.getNotices = async (req, res) => {
  try {
    const { category, featured, type } = req.query;
    let sql = "SELECT * FROM notices WHERE 1=1 AND LOWER(TRIM(title)) NOT IN ('try', 'test', 'demo', 'asdf') AND LOWER(TRIM(summary)) NOT IN ('try1')";
    const params = [];

    if (type) {
      if (type === 'notice') {
        sql += " AND (item_type = 'notice' OR item_type IS NULL OR category IN ('Notice', 'Examination', 'Admissions', 'Administrative Circular', 'Academic Circular', 'Student Welfare'))";
      } else if (type === 'event') {
        sql += " AND ((item_type = 'event') OR (item_type != 'notice' AND category IN ('Activities', 'Health & Social', 'NSS', 'College Fest', 'Events', 'Campus Integrity', 'Faculty Development', 'IQAC')))";
      } else {
        sql += ' AND item_type = ?';
        params.push(type);
      }
    }
    if (category) {
      sql += ' AND category = ?';
      params.push(category);
    }
    if (featured === 'true' || featured === '1') {
      sql += ' AND is_featured = 1';
    }

    sql += ' ORDER BY is_featured DESC, id DESC';
    const notices = await query(sql, params);
    return res.json({ success: true, count: notices.length, notices });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getNoticeById = async (req, res) => {
  try {
    const { id } = req.params;
    const items = await query('SELECT * FROM notices WHERE id = ?', [id]);
    if (!items || items.length === 0) {
      return res.status(404).json({ success: false, message: 'Notice not found' });
    }
    return res.json({ success: true, notice: items[0] });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.createNotice = async (req, res) => {
  try {
    const {
      title,
      category = 'Notice',
      item_type = 'notice',
      summary,
      content,
      event_date,
      image_url,
      link_url,
      pdf_url,
      pdf_name,
      is_featured = 0
    } = req.body;

    if (!title || !content) {
      return res.status(400).json({ success: false, message: 'Title and content are required' });
    }

    const result = await query(
      `INSERT INTO notices (title, category, item_type, summary, content, event_date, image_url, link_url, pdf_url, pdf_name, is_featured)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title,
        category,
        item_type || 'notice',
        summary || content.substring(0, 150) + '...',
        content,
        event_date || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        image_url || '',
        link_url || '',
        pdf_url || '',
        pdf_name || '',
        is_featured ? 1 : 0
      ]
    );

    return res.status(201).json({ success: true, message: 'Notice published successfully', id: result.insertId });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateNotice = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      category,
      item_type,
      summary,
      content,
      event_date,
      image_url,
      link_url,
      pdf_url,
      pdf_name,
      is_featured
    } = req.body;

    const existing = await query('SELECT * FROM notices WHERE id = ?', [id]);
    if (!existing || existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Notice not found' });
    }

    const current = existing[0];
    await query(
      `UPDATE notices SET title = ?, category = ?, item_type = ?, summary = ?, content = ?, event_date = ?, image_url = ?, link_url = ?, pdf_url = ?, pdf_name = ?, is_featured = ?
       WHERE id = ?`,
      [
        title || current.title,
        category || current.category,
        item_type !== undefined ? item_type : (current.item_type || 'notice'),
        summary !== undefined ? summary : current.summary,
        content || current.content,
        event_date || current.event_date,
        image_url !== undefined ? image_url : current.image_url,
        link_url !== undefined ? link_url : current.link_url,
        pdf_url !== undefined ? pdf_url : current.pdf_url,
        pdf_name !== undefined ? pdf_name : current.pdf_name,
        is_featured !== undefined ? (is_featured ? 1 : 0) : current.is_featured,
        id
      ]
    );

    const updated = await query('SELECT * FROM notices WHERE id = ?', [id]);
    return res.json({ success: true, message: 'Notice updated successfully', notice: updated[0] });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteNotice = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await query('SELECT * FROM notices WHERE id = ?', [id]);
    if (!existing || existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Notice not found' });
    }
    await query('DELETE FROM notices WHERE id = ?', [id]);
    return res.json({ success: true, message: 'Notice deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.toggleFeatured = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await query('SELECT * FROM notices WHERE id = ?', [id]);
    if (!existing || existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Notice or event not found' });
    }
    const current = existing[0];
    const newFeatured = current.is_featured ? 0 : 1;
    await query('UPDATE notices SET is_featured = ? WHERE id = ?', [newFeatured, id]);
    return res.json({
      success: true,
      message: `Item ${newFeatured ? 'pinned to' : 'unpinned from'} Homepage Showcase`,
      is_featured: newFeatured
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};


