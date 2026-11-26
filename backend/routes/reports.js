const express = require('express');
const multer = require('multer');
const { getPool, memoryDb } = require('../config/db');
const { uploadPdf, getPdfStream } = require('../config/s3');
const { authenticate, requireRole } = require('../middleware/auth');

const router = express.Router();

// Configure multer memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5 MiB limit
});

function validatePdfHeader(buffer) {
  if (!buffer || buffer.length < 4) return false;
  // Check PDF magic bytes '%PDF' (0x25 0x50 0x44 0x46)
  return buffer.toString('utf8', 0, 4) === '%PDF';
}

// POST /api/reports/upload (Doctor only)
router.post('/upload', authenticate, requireRole('DOCTOR'), (req, res, next) => {
  upload.single('file')(req, res, async (err) => {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(413).json({
          error: { code: 'FILE_TOO_LARGE', message: 'File exceeds 5 MiB limit.' }
        });
      }
      return res.status(400).json({
        error: { code: 'VALIDATION_ERROR', message: err.message }
      });
    }

    try {
      const { appointmentId } = req.body || {};
      const file = req.file;

      if (!appointmentId || !file) {
        return res.status(400).json({
          error: { code: 'VALIDATION_ERROR', message: 'Appointment ID and PDF file are required.' }
        });
      }

      if (!validatePdfHeader(file.buffer)) {
        return res.status(415).json({
          error: { code: 'UNSUPPORTED_FILE_TYPE', message: 'Only valid PDF documents (%PDF) are supported.' }
        });
      }

      const pool = getPool();
      let patientId;

      if (pool) {
        const [appts] = await pool.query('SELECT * FROM appointments WHERE id = ?', [appointmentId]);
        if (appts.length === 0) {
          return res.status(404).json({
            error: { code: 'NOT_FOUND', message: 'Appointment not found.' }
          });
        }
        if (appts[0].doctor_id !== req.user.doctorId) {
          return res.status(403).json({
            error: { code: 'FORBIDDEN', message: 'You are not assigned to this appointment.' }
          });
        }
        patientId = appts[0].patient_id;

        const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
        const s3Key = `reports/report-${Date.now()}-${safeName}`;
        await uploadPdf(s3Key, file.buffer, 'application/pdf');

        const [docResult] = await pool.query(
          'INSERT INTO documents (patient_id, uploaded_by, s3_key, filename) VALUES (?, ?, ?, ?)',
          [patientId, req.user.id, s3Key, file.originalname]
        );

        return res.status(201).json({
          data: {
            id: docResult.insertId,
            filename: file.originalname,
            uploadedBy: req.user.name,
            uploadedAt: new Date().toISOString().slice(0, 10)
          }
        });
      }

      // In-memory fallback
      const appt = memoryDb.appointments.find((a) => a.id === Number(appointmentId));
      if (!appt) {
        return res.status(404).json({
          error: { code: 'NOT_FOUND', message: 'Appointment not found.' }
        });
      }
      if (appt.doctor_id !== req.user.doctorId) {
        return res.status(403).json({
          error: { code: 'FORBIDDEN', message: 'You are not assigned to this appointment.' }
        });
      }
      patientId = appt.patient_id;

      const s3Key = `reports/report-${Date.now()}-${file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
      await uploadPdf(s3Key, file.buffer, 'application/pdf');

      const docId = memoryDb.documents.length + 1;
      memoryDb.documents.push({
        id: docId,
        patient_id: patientId,
        uploaded_by: req.user.id,
        s3_key: s3Key,
        filename: file.originalname
      });

      return res.status(201).json({
        data: {
          id: docId,
          filename: file.originalname,
          uploadedBy: req.user.name,
          uploadedAt: new Date().toISOString().slice(0, 10)
        }
      });
    } catch (error) {
      next(error);
    }
  });
});

// GET /api/reports (Patient only)
router.get('/', authenticate, requireRole('PATIENT'), async (req, res, next) => {
  try {
    const patientId = req.user.patientId;
    const pool = getPool();

    if (pool) {
      const [rows] = await pool.query(
        `SELECT d.id,
                d.filename,
                u.name AS uploadedBy,
                DATE_FORMAT(d.created_at, '%Y-%m-%d') AS uploadedAt
         FROM documents d
         LEFT JOIN users u ON d.uploaded_by = u.id
         WHERE d.patient_id = ?
         ORDER BY d.id DESC`,
        [patientId]
      );
      return res.status(200).json({ data: rows });
    }

    // In-memory fallback
    const reports = memoryDb.documents
      .filter((d) => d.patient_id === patientId)
      .map((d) => {
        const uploader = memoryDb.users.find((u) => u.id === d.uploaded_by);
        return {
          id: d.id,
          filename: d.filename,
          uploadedBy: uploader?.name || 'Attending Physician',
          uploadedAt: new Date().toISOString().slice(0, 10)
        };
      });

    return res.status(200).json({ data: reports });
  } catch (error) {
    next(error);
  }
});

// GET /api/reports/:id/download (Patient only)
router.get('/:id/download', authenticate, requireRole('PATIENT'), async (req, res, next) => {
  try {
    const reportId = Number(req.params.id);
    const patientId = req.user.patientId;
    const pool = getPool();
    let doc = null;

    if (pool) {
      const [rows] = await pool.query('SELECT * FROM documents WHERE id = ?', [reportId]);
      if (rows.length === 0) {
        return res.status(404).json({
          error: { code: 'NOT_FOUND', message: 'Report not found.' }
        });
      }
      doc = rows[0];
    } else {
      doc = memoryDb.documents.find((d) => d.id === reportId);
      if (!doc) {
        return res.status(404).json({
          error: { code: 'NOT_FOUND', message: 'Report not found.' }
        });
      }
    }

    if (doc.patient_id !== patientId) {
      return res.status(404).json({
        error: { code: 'NOT_FOUND', message: 'Report not found.' }
      });
    }

    const { stream, contentType } = await getPdfStream(doc.s3_key);

    res.set({
      'Content-Type': contentType || 'application/pdf',
      'Content-Disposition': `attachment; filename="${encodeURIComponent(doc.filename)}"`,
      'Cache-Control': 'no-store'
    });

    stream.on('error', (streamErr) => {
      if (!res.headersSent) {
        next(streamErr);
      } else {
        res.end();
      }
    });

    stream.pipe(res);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
