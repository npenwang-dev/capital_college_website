const fs = require('fs');
const path = require('path');
const { query } = require('../config/db');

const DATA_DIR = path.join(__dirname, '..', 'data');
const DOCS_DIR = path.join(DATA_DIR, 'documents');
const FRONTEND_PUBLIC_DIR = path.join(__dirname, '..', '..', 'capital_college_frontend', 'public');
const FRONTEND_DIST_DIR = path.join(__dirname, '..', '..', 'capital_college_frontend', 'dist');

// Ensure storage directories exist
if (!fs.existsSync(DOCS_DIR)) {
  fs.mkdirSync(DOCS_DIR, { recursive: true });
}

// GET /api/documents
exports.getDocuments = async (req, res) => {
  try {
    const { category, active_only } = req.query;
    let sql = 'SELECT * FROM documents WHERE 1=1';
    const params = [];

    if (active_only === 'true' || active_only === '1') {
      sql += ' AND is_active = 1';
    }
    if (category && category !== 'ALL') {
      sql += ' AND category = ?';
      params.push(category);
    }

    sql += ' ORDER BY CASE WHEN doc_key IS NOT NULL THEN 1 ELSE 2 END ASC, id ASC';
    const documents = await query(sql, params);

    // Compute public download URLs and verify file sizes
    const enriched = documents.map((doc) => {
      let localPath = doc.file_path ? path.resolve(DATA_DIR, '..', doc.file_path) : null;
      let actualSize = doc.file_size;

      if (localPath && fs.existsSync(localPath)) {
        try {
          actualSize = fs.statSync(localPath).size;
        } catch {}
      }

      return {
        ...doc,
        file_size: actualSize,
        download_url: doc.doc_key === 'admission_form' ? '/admission_form.pdf' : `/api/documents/${doc.id}/download`
      };
    });

    return res.json({
      success: true,
      count: enriched.length,
      documents: enriched
    });
  } catch (error) {
    console.error('Error fetching documents:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/documents/upload (Upload from Device or base64)
exports.uploadDocument = async (req, res) => {
  try {
    const {
      doc_key,
      title,
      category = 'General',
      file_name,
      file_data // base64 string "data:application/pdf;base64,..."
    } = req.body;

    if (!file_data) {
      return res.status(400).json({ success: false, message: 'PDF file data is required.' });
    }

    const cleanFileName = (file_name || 'document.pdf').replace(/[^a-zA-Z0-9._-]/g, '_');
    const isAdmissionForm = doc_key === 'admission_form' || cleanFileName.toLowerCase() === 'admission_form.pdf';

    // Extract base64 buffer
    let base64Content = file_data;
    if (file_data.includes('base64,')) {
      base64Content = file_data.split('base64,')[1];
    }
    const buffer = Buffer.from(base64Content, 'base64');
    const fileSize = buffer.length;

    let savedRelativePath = '';

    if (isAdmissionForm) {
      // 1. Save to backend data/admission_form.pdf
      const backendTarget = path.join(DATA_DIR, 'admission_form.pdf');
      fs.writeFileSync(backendTarget, buffer);
      savedRelativePath = 'data/admission_form.pdf';

      // 2. Synchronize to frontend public/admission_form.pdf
      try {
        if (fs.existsSync(FRONTEND_PUBLIC_DIR)) {
          fs.writeFileSync(path.join(FRONTEND_PUBLIC_DIR, 'admission_form.pdf'), buffer);
        }
        if (fs.existsSync(FRONTEND_DIST_DIR)) {
          fs.writeFileSync(path.join(FRONTEND_DIST_DIR, 'admission_form.pdf'), buffer);
        }
      } catch (syncErr) {
        console.warn('Frontend public folder sync notice:', syncErr.message);
      }
    } else {
      // Save custom/prospectus/routine PDF to data/documents/
      const uniqueName = `${Date.now()}_${cleanFileName}`;
      const targetPath = path.join(DOCS_DIR, uniqueName);
      fs.writeFileSync(targetPath, buffer);
      savedRelativePath = `data/documents/${uniqueName}`;
    }

    // Upsert into documents table
    let existingDoc = null;
    if (doc_key) {
      const match = await query('SELECT * FROM documents WHERE doc_key = ?', [doc_key]);
      if (match && match.length > 0) existingDoc = match[0];
    }

    let finalId;
    if (existingDoc) {
      await query(
        `UPDATE documents 
         SET title = ?, category = ?, file_name = ?, file_path = ?, file_size = ?, updated_at = CURRENT_TIMESTAMP
         WHERE id = ?`,
        [
          title || existingDoc.title,
          category || existingDoc.category,
          isAdmissionForm ? 'admission_form.pdf' : cleanFileName,
          savedRelativePath,
          fileSize,
          existingDoc.id
        ]
      );
      finalId = existingDoc.id;
    } else {
      const ins = await query(
        `INSERT INTO documents (doc_key, title, category, file_name, file_path, file_size, mime_type, is_active)
         VALUES (?, ?, ?, ?, ?, ?, 'application/pdf', 1)`,
        [
          doc_key || null,
          title || cleanFileName.replace(/\.pdf$/i, ''),
          category,
          cleanFileName,
          savedRelativePath,
          fileSize
        ]
      );
      finalId = ins.insertId || ins.lastID;
    }

    const updated = await query('SELECT * FROM documents WHERE id = ?', [finalId]);

    return res.status(201).json({
      success: true,
      message: `Document "${cleanFileName}" uploaded and saved successfully!`,
      document: {
        ...updated[0],
        download_url: isAdmissionForm ? '/admission_form.pdf' : `/api/documents/${finalId}/download`
      }
    });
  } catch (error) {
    console.error('Error uploading document:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/documents/:id
exports.updateDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, category, is_active } = req.body;

    const existing = await query('SELECT * FROM documents WHERE id = ?', [id]);
    if (!existing || existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Document not found.' });
    }

    const cur = existing[0];
    await query(
      `UPDATE documents 
       SET title = ?, category = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [
        title ? title.trim() : cur.title,
        category ? category.trim() : cur.category,
        is_active !== undefined ? (is_active ? 1 : 0) : cur.is_active,
        id
      ]
    );

    const updated = await query('SELECT * FROM documents WHERE id = ?', [id]);
    return res.json({
      success: true,
      message: 'Document metadata updated.',
      document: updated[0]
    });
  } catch (error) {
    console.error('Error updating document:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/documents/:id
exports.deleteDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await query('SELECT * FROM documents WHERE id = ?', [id]);
    if (!existing || existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Document not found.' });
    }

    if (existing[0].doc_key === 'admission_form') {
      return res.status(400).json({
        success: false,
        message: 'The official Admission Form is a core institutional file and cannot be deleted. You may upload a replacement PDF anytime.'
      });
    }

    // Remove file if inside data/documents/
    if (existing[0].file_path && existing[0].file_path.includes('data/documents/')) {
      const fullPath = path.resolve(DATA_DIR, '..', existing[0].file_path);
      if (fs.existsSync(fullPath)) {
        try { fs.unlinkSync(fullPath); } catch {}
      }
    }

    await query('DELETE FROM documents WHERE id = ?', [id]);
    return res.json({ success: true, message: 'Document deleted successfully.' });
  } catch (error) {
    console.error('Error deleting document:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/documents/:id/download
exports.downloadDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await query('SELECT * FROM documents WHERE id = ?', [id]);
    if (!existing || existing.length === 0) {
      return res.status(404).send('Document not found.');
    }

    const doc = existing[0];
    let fullPath = path.resolve(DATA_DIR, '..', doc.file_path || 'data/admission_form.pdf');

    if (!fs.existsSync(fullPath)) {
      // Fallback to data/admission_form.pdf if missing
      fullPath = path.join(DATA_DIR, 'admission_form.pdf');
    }

    if (!fs.existsSync(fullPath)) {
      return res.status(404).send('Document file not found on server.');
    }

    return res.download(fullPath, doc.file_name || 'document.pdf');
  } catch (error) {
    console.error('Error downloading document:', error);
    return res.status(500).send('Error downloading document.');
  }
};
