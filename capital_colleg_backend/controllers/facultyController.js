const { query } = require('../config/db');

exports.getFaculty = async (req, res) => {
  try {
    const { stream, department } = req.query;
    let sql = 'SELECT * FROM faculty WHERE 1=1';
    const params = [];

    if (stream) {
      sql += ' AND UPPER(stream) = UPPER(?)';
      params.push(stream);
    }
    if (department) {
      sql += ' AND UPPER(department) = UPPER(?)';
      params.push(department);
    }

    sql += ' ORDER BY stream ASC, department ASC, is_hod DESC, name ASC';
    const faculty = await query(sql, params);

    return res.json({
      success: true,
      count: faculty.length,
      faculty
    });
  } catch (error) {
    console.error('Error fetching faculty:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.createFaculty = async (req, res) => {
  try {
    const {
      name,
      stream,
      department,
      qualification,
      designation,
      is_hod = 0,
      image_url = '',
      bio = '',
      email = '',
      campus = 'P.R. Hill Campus, Kohima'
    } = req.body;

    if (!name || !stream || !department || !designation) {
      return res.status(400).json({
        success: false,
        message: 'Name, stream, department, and designation are required.'
      });
    }

    const result = await query(
      `INSERT INTO faculty (name, stream, department, qualification, designation, is_hod, image_url, bio, email, campus)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name.trim(),
        stream.trim().toUpperCase(),
        department.trim(),
        qualification || '',
        designation.trim(),
        is_hod ? 1 : 0,
        image_url ? image_url.trim() : '',
        bio ? bio.trim() : '',
        email ? email.trim() : '',
        campus ? campus.trim() : 'P.R. Hill Campus, Kohima'
      ]
    );

    const created = await query('SELECT * FROM faculty WHERE id = ?', [result.insertId || result.lastID]);

    return res.status(201).json({
      success: true,
      message: 'Faculty member added successfully.',
      faculty: created[0]
    });
  } catch (error) {
    console.error('Error creating faculty:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateFaculty = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, stream, department, qualification, designation, is_hod, image_url, bio, email, campus } = req.body;

    const existing = await query('SELECT * FROM faculty WHERE id = ?', [id]);
    if (!existing || existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Faculty member not found.' });
    }

    const current = existing[0];
    await query(
      `UPDATE faculty SET name = ?, stream = ?, department = ?, qualification = ?, designation = ?, is_hod = ?, image_url = ?, bio = ?, email = ?, campus = ?
       WHERE id = ?`,
      [
        name ? name.trim() : current.name,
        stream ? stream.trim().toUpperCase() : current.stream,
        department ? department.trim() : current.department,
        qualification !== undefined ? qualification : current.qualification,
        designation ? designation.trim() : current.designation,
        is_hod !== undefined ? (is_hod ? 1 : 0) : current.is_hod,
        image_url !== undefined ? (image_url ? image_url.trim() : '') : (current.image_url || ''),
        bio !== undefined ? (bio ? bio.trim() : '') : (current.bio || ''),
        email !== undefined ? (email ? email.trim() : '') : (current.email || ''),
        campus !== undefined ? (campus ? campus.trim() : 'P.R. Hill Campus, Kohima') : (current.campus || 'P.R. Hill Campus, Kohima'),
        id
      ]
    );

    const updated = await query('SELECT * FROM faculty WHERE id = ?', [id]);
    return res.json({
      success: true,
      message: 'Faculty profile updated successfully.',
      faculty: updated[0]
    });
  } catch (error) {
    console.error('Error updating faculty:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteFaculty = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await query('SELECT * FROM faculty WHERE id = ?', [id]);
    if (!existing || existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Faculty member not found.' });
    }

    await query('DELETE FROM faculty WHERE id = ?', [id]);
    return res.json({
      success: true,
      message: 'Faculty member deleted successfully.'
    });
  } catch (error) {
    console.error('Error deleting faculty:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
