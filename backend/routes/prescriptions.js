const express = require('express');
const { getPool, memoryDb } = require('../config/db');
const { authenticate, requireRole } = require('../middleware/auth');

const router = express.Router();

// GET /api/prescriptions
router.get('/', authenticate, requireRole('PATIENT', 'DOCTOR'), async (req, res, next) => {
  try {
    const { role, patientId, doctorId } = req.user;
    const pool = getPool();

    if (pool) {
      let query = `
        SELECT pr.id, pr.appointment_id AS appointmentId, pr.notes, pr.medicines
        FROM prescriptions pr
        JOIN appointments a ON pr.appointment_id = a.id
      `;
      const params = [];

      if (role === 'PATIENT') {
        query += ' WHERE a.patient_id = ?';
        params.push(patientId);
      } else if (role === 'DOCTOR') {
        query += ' WHERE a.doctor_id = ?';
        params.push(doctorId);
      }
      query += ' ORDER BY pr.id DESC';

      const [rows] = await pool.query(query, params);
      return res.status(200).json({ data: rows });
    }

    // In-memory fallback
    const list = memoryDb.prescriptions.filter((pr) => {
      const appt = memoryDb.appointments.find((a) => a.id === pr.appointment_id);
      if (!appt) return false;
      if (role === 'PATIENT') return appt.patient_id === patientId;
      if (role === 'DOCTOR') return appt.doctor_id === doctorId;
      return true;
    });

    const data = list.map((pr) => ({
      id: pr.id,
      appointmentId: pr.appointment_id,
      notes: pr.notes,
      medicines: pr.medicines
    }));

    return res.status(200).json({ data });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
