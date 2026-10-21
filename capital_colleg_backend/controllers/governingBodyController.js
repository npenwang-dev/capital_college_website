const { query } = require('../config/db');

exports.getGoverningBody = async (req, res) => {
  try {
    const { member_type, search } = req.query;
    let sql = 'SELECT * FROM governing_body WHERE 1=1';
    const params = [];

    if (member_type) {
      if (member_type.includes(',')) {
        const types = member_type.split(',').map(t => t.trim().toUpperCase());
        const placeholders = types.map(() => '?').join(',');
        sql += ` AND UPPER(member_type) IN (${placeholders})`;
        params.push(...types);
      } else {
        sql += ' AND UPPER(member_type) = UPPER(?)';
        params.push(member_type);
      }
    }

    if (search) {
      sql += ' AND (name LIKE ? OR role LIKE ? OR category LIKE ? OR affiliation LIKE ?)';
      const s = `%${search.trim()}%`;
      params.push(s, s, s, s);
    }

    sql += " ORDER BY CASE UPPER(member_type) WHEN 'OFFICER' THEN 1 WHEN 'MANAGEMENT' THEN 2 WHEN 'ADMINISTRATION' THEN 3 ELSE 4 END ASC, order_index ASC, id ASC";
    const members = await query(sql, params);

    return res.json({
      success: true,
      count: members.length,
      members
    });
  } catch (error) {
    console.error('Error fetching governing body members:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.createGoverningBodyMember = async (req, res) => {
  try {
    const {
      name,
      role = 'Member',
      category = 'Council Member',
      affiliation,
      member_type = 'MEMBER',
      order_index = 0,
      image_url = ''
    } = req.body;

    if (!name || !affiliation) {
      return res.status(400).json({
        success: false,
        message: 'Name and affiliation are required.'
      });
    }

    const result = await query(
      `INSERT INTO governing_body (name, role, category, affiliation, member_type, order_index, image_url)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        name.trim(),
        role.trim(),
        category.trim(),
        affiliation.trim(),
        member_type.trim().toUpperCase(),
        parseInt(order_index) || 0,
        image_url ? image_url.trim() : ''
      ]
    );

    const created = await query('SELECT * FROM governing_body WHERE id = ?', [result.insertId || result.lastID]);

    return res.status(201).json({
      success: true,
      message: 'Governing body member added successfully.',
      member: created[0]
    });
  } catch (error) {
    console.error('Error creating governing body member:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateGoverningBodyMember = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      role,
      category,
      affiliation,
      member_type,
      order_index,
      image_url
    } = req.body;

    const existing = await query('SELECT * FROM governing_body WHERE id = ?', [id]);
    if (!existing || existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Member not found.' });
    }

    const current = existing[0];
    await query(
      `UPDATE governing_body 
       SET name = ?, role = ?, category = ?, affiliation = ?, member_type = ?, order_index = ?, image_url = ?
       WHERE id = ?`,
      [
        name ? name.trim() : current.name,
        role ? role.trim() : current.role,
        category ? category.trim() : current.category,
        affiliation ? affiliation.trim() : current.affiliation,
        member_type ? member_type.trim().toUpperCase() : current.member_type,
        order_index !== undefined ? parseInt(order_index) : current.order_index,
        image_url !== undefined ? (image_url ? image_url.trim() : '') : (current.image_url || ''),
        id
      ]
    );

    const updated = await query('SELECT * FROM governing_body WHERE id = ?', [id]);

    return res.json({
      success: true,
      message: 'Member profile updated successfully.',
      member: updated[0]
    });
  } catch (error) {
    console.error('Error updating governing body member:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteGoverningBodyMember = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await query('SELECT * FROM governing_body WHERE id = ?', [id]);
    if (!existing || existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Member not found.' });
    }

    await query('DELETE FROM governing_body WHERE id = ?', [id]);

    return res.json({
      success: true,
      message: 'Governing body member removed successfully.'
    });
  } catch (error) {
    console.error('Error deleting governing body member:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
