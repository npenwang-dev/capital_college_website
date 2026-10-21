const { query } = require('../config/db');

exports.getCourses = async (req, res) => {
  try {
    const { stream } = req.query;
    let sql = 'SELECT * FROM courses';
    const params = [];
    if (stream) {
      sql += ' WHERE stream = ?';
      params.push(stream.toUpperCase());
    }
    sql += ' ORDER BY stream ASC, course_name ASC';
    const courses = await query(sql, params);

    return res.json({
      success: true,
      count: courses.length,
      courses
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.createCourse = async (req, res) => {
  try {
    const { stream, course_name, degree_type = 'Four Years Under Graduate Programme (FYUGP)', description, eligibility, duration = '4 Years (8 Semesters)' } = req.body;
    if (!stream || !course_name) {
      return res.status(400).json({ success: false, message: 'Stream and course name are required.' });
    }
    const result = await query(
      `INSERT INTO courses (stream, course_name, degree_type, description, eligibility, duration)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [stream.toUpperCase(), course_name.trim(), degree_type, description || '', eligibility || '', duration]
    );
    const created = await query('SELECT * FROM courses WHERE id = ?', [result.insertId]);
    return res.status(201).json({ success: true, message: 'Course created successfully', course: created[0] });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const { stream, course_name, degree_type, description, eligibility, duration } = req.body;
    const existing = await query('SELECT * FROM courses WHERE id = ?', [id]);
    if (!existing || existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }
    const current = existing[0];
    await query(
      `UPDATE courses SET stream = ?, course_name = ?, degree_type = ?, description = ?, eligibility = ?, duration = ?
       WHERE id = ?`,
      [
        stream ? stream.toUpperCase() : current.stream,
        course_name ? course_name.trim() : current.course_name,
        degree_type || current.degree_type,
        description !== undefined ? description : current.description,
        eligibility !== undefined ? eligibility : current.eligibility,
        duration || current.duration,
        id
      ]
    );
    const updated = await query('SELECT * FROM courses WHERE id = ?', [id]);
    return res.json({ success: true, message: 'Course updated successfully', course: updated[0] });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;
    await query('DELETE FROM courses WHERE id = ?', [id]);
    return res.json({ success: true, message: 'Course deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

