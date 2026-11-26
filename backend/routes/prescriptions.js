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
        SELECT pr.id,
               pr.appointment_id AS appointmentId,
               a.patient_id AS patientId,
               pu.name AS patientName,
               du.name AS doctorName,
               d.specialization,
               DATE_FORMAT(a.visit_date, '%Y-%m-%d') AS visitDate,
               DATE_FORMAT(pr.created_at, '%Y-%m-%d') AS createdAt,
               pr.notes,
               pr.medicines
        FROM prescriptions pr
        JOIN appointments a ON pr.appointment_id = a.id
        JOIN patients p ON a.patient_id = p.id
        JOIN users pu ON p.user_id = pu.id
        JOIN doctors d ON a.doctor_id = d.id
        JOIN users du ON d.user_id = du.id
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

    const data = list.map((pr) => {
      const appt = memoryDb.appointments.find((a) => a.id === pr.appointment_id);
      const patient = appt ? memoryDb.patients.find((p) => p.id === appt.patient_id) : null;
      const patientUser = patient ? memoryDb.users.find((u) => u.id === patient.user_id) : null;
      const doctor = appt ? memoryDb.doctors.find((d) => d.id === appt.doctor_id) : null;
      const doctorUser = doctor ? memoryDb.users.find((u) => u.id === doctor.user_id) : null;

      return {
        id: pr.id,
        appointmentId: pr.appointment_id,
        patientId: appt?.patient_id || null,
        patientName: patientUser?.name || 'Patient',
        doctorName: doctorUser?.name || 'Attending Physician',
        specialization: doctor?.specialization || '',
        visitDate: appt?.visit_date || '',
        createdAt: appt?.visit_date || new Date().toISOString().slice(0, 10),
        notes: pr.notes,
        medicines: pr.medicines
      };
    });

    return res.status(200).json({ data });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
