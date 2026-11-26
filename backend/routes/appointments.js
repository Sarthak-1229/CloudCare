const express = require('express');
const { getPool, memoryDb } = require('../config/db');
const { authenticate, requireRole } = require('../middleware/auth');

const router = express.Router();

function formatDateValue(val) {
  if (!val) return '';
  if (typeof val === 'string') return val.slice(0, 10);
  if (val instanceof Date) return val.toISOString().slice(0, 10);
  return String(val).slice(0, 10);
}

// GET /api/appointments
router.get('/', authenticate, async (req, res, next) => {
  try {
    const { role, patientId, doctorId } = req.user;
    const pool = getPool();

    if (pool) {
      let query = `
        SELECT a.id, a.patient_id AS patientId, pu.name AS patientName,
               a.doctor_id AS doctorId, du.name AS doctorName,
               d.specialization,
               DATE_FORMAT(a.visit_date, '%Y-%m-%d') AS visitDate,
               TIME_FORMAT(a.slot, '%H:%i') AS slot,
               a.status,
               pr.notes AS prescriptionNotes,
               pr.medicines AS prescriptionMedicines,
               IF(pr.id IS NOT NULL, 1, 0) AS hasPrescription
        FROM appointments a
        JOIN patients p ON a.patient_id = p.id
        JOIN users pu ON p.user_id = pu.id
        JOIN doctors d ON a.doctor_id = d.id
        JOIN users du ON d.user_id = du.id
        LEFT JOIN prescriptions pr ON pr.appointment_id = a.id
      `;
      const params = [];

      if (role === 'PATIENT') {
        query += ' WHERE a.patient_id = ?';
        params.push(patientId);
      } else if (role === 'DOCTOR') {
        query += ' WHERE a.doctor_id = ?';
        params.push(doctorId);
      }
      query += ' ORDER BY a.visit_date DESC, a.slot ASC';

      const [rows] = await pool.query(query, params);
      return res.status(200).json({ data: rows });
    }

    // In-memory fallback
    let list = memoryDb.appointments;
    if (role === 'PATIENT') {
      list = list.filter((a) => a.patient_id === patientId);
    } else if (role === 'DOCTOR') {
      list = list.filter((a) => a.doctor_id === doctorId);
    }

    const data = list.map((a) => {
      const patient = memoryDb.patients.find((p) => p.id === a.patient_id);
      const patientUser = patient ? memoryDb.users.find((u) => u.id === patient.user_id) : null;
      const doctor = memoryDb.doctors.find((d) => d.id === a.doctor_id);
      const doctorUser = doctor ? memoryDb.users.find((u) => u.id === doctor.user_id) : null;
      const pres = memoryDb.prescriptions.find((pr) => pr.appointment_id === a.id);

      return {
        id: a.id,
        patientId: a.patient_id,
        patientName: patientUser ? patientUser.name : `Patient ${a.patient_id}`,
        doctorId: a.doctor_id,
        doctorName: doctorUser ? doctorUser.name : `Doctor ${a.doctor_id}`,
        specialization: doctor ? doctor.specialization : '',
        visitDate: formatDateValue(a.visit_date),
        slot: a.slot.substring(0, 5),
        status: a.status,
        prescriptionNotes: pres ? pres.notes : null,
        prescriptionMedicines: pres ? pres.medicines : null,
        hasPrescription: pres ? 1 : 0
      };
    });

    return res.status(200).json({ data });
  } catch (error) {
    next(error);
  }
});

// POST /api/appointments (Patient)
router.post('/', authenticate, requireRole('PATIENT'), async (req, res, next) => {
  try {
    const { doctorId, visitDate, slot } = req.body || {};
    if (!doctorId || !visitDate || !slot) {
      return res.status(400).json({
        error: { code: 'VALIDATION_ERROR', message: 'Doctor ID, visit date, and slot are required.' }
      });
    }

    const patientId = req.user.patientId;
    const pool = getPool();

    // Standardize slot format to HH:mm:00
    const fullSlot = slot.length === 5 ? `${slot}:00` : slot;
    const shortSlot = slot.substring(0, 5);

    if (pool) {
      // Check for slot collision
      const [existing] = await pool.query(
        'SELECT id FROM appointments WHERE doctor_id = ? AND visit_date = ? AND slot = ?',
        [doctorId, visitDate, fullSlot]
      );

      if (existing.length > 0) {
        return res.status(409).json({
          error: { code: 'SLOT_CONFLICT', message: `Time slot ${shortSlot} on ${visitDate} is already booked for this specialist.` }
        });
      }

      const [result] = await pool.query(
        'INSERT INTO appointments (patient_id, doctor_id, visit_date, slot, status) VALUES (?, ?, ?, ?, "PENDING")',
        [patientId, doctorId, visitDate, fullSlot]
      );
      const insertId = result.insertId;

      // Fetch doctor name and specialization
      const [docUser] = await pool.query(
        'SELECT u.name, d.specialization FROM doctors d JOIN users u ON d.user_id = u.id WHERE d.id = ?',
        [doctorId]
      );

      return res.status(201).json({
        data: {
          id: insertId,
          patientId,
          patientName: req.user.name,
          doctorId: Number(doctorId),
          doctorName: docUser[0]?.name || 'Doctor',
          specialization: docUser[0]?.specialization || '',
          visitDate,
          slot: shortSlot,
          status: 'PENDING'
        }
      });
    }

    // In-memory fallback
    const collision = memoryDb.appointments.some(
      (a) => a.doctor_id === Number(doctorId) && a.visit_date === visitDate && a.slot.startsWith(shortSlot)
    );
    if (collision) {
      return res.status(409).json({
        error: { code: 'SLOT_CONFLICT', message: `Time slot ${shortSlot} on ${visitDate} is already booked.` }
      });
    }

    const doctor = memoryDb.doctors.find((d) => d.id === Number(doctorId));
    const doctorUser = doctor ? memoryDb.users.find((u) => u.id === doctor.user_id) : null;
    const newId = memoryDb.appointments.length + 1;

    const newAppt = {
      id: newId,
      patient_id: patientId,
      doctor_id: Number(doctorId),
      visit_date: visitDate,
      slot: fullSlot,
      status: 'PENDING'
    };
    memoryDb.appointments.push(newAppt);

    return res.status(201).json({
      data: {
        id: newId,
        patientId,
        patientName: req.user.name,
        doctorId: Number(doctorId),
        doctorName: doctorUser ? doctorUser.name : 'Doctor',
        specialization: doctor ? doctor.specialization : '',
        visitDate,
        slot: shortSlot,
        status: 'PENDING'
      }
    });
  } catch (error) {
    next(error);
  }
});

// PATCH /api/appointments/:id/status (Doctor or Admin)
router.patch('/:id/status', authenticate, requireRole('DOCTOR', 'ADMIN'), async (req, res, next) => {
  try {
    const appointmentId = Number(req.params.id);
    const { status: targetStatus } = req.body || {};

    const pool = getPool();
    let currentAppt = null;

    if (pool) {
      const [rows] = await pool.query('SELECT * FROM appointments WHERE id = ?', [appointmentId]);
      if (rows.length === 0) {
        return res.status(404).json({
          error: { code: 'NOT_FOUND', message: 'Appointment not found.' }
        });
      }
      currentAppt = rows[0];

      if (req.user.role === 'DOCTOR' && currentAppt.doctor_id !== req.user.doctorId) {
        return res.status(403).json({
          error: { code: 'FORBIDDEN', message: 'You are not assigned to this appointment.' }
        });
      }

      // Check state transition
      const currentStatus = currentAppt.status;
      const valid =
        (currentStatus === 'PENDING' && (targetStatus === 'CONFIRMED' || targetStatus === 'CANCELLED')) ||
        (currentStatus === 'CONFIRMED' && (targetStatus === 'COMPLETED' || targetStatus === 'CANCELLED'));

      if (!valid) {
        return res.status(400).json({
          error: { code: 'INVALID_STATUS_TRANSITION', message: `Cannot transition status from ${currentStatus} to ${targetStatus}.` }
        });
      }

      await pool.query('UPDATE appointments SET status = ? WHERE id = ?', [targetStatus, appointmentId]);

      return res.status(200).json({
        data: {
          id: appointmentId,
          patientId: currentAppt.patient_id,
          doctorId: currentAppt.doctor_id,
          visitDate: formatDateValue(currentAppt.visit_date),
          slot: String(currentAppt.slot).substring(0, 5),
          status: targetStatus
        }
      });
    }

    // In-memory fallback
    currentAppt = memoryDb.appointments.find((a) => a.id === appointmentId);
    if (!currentAppt) {
      return res.status(404).json({
        error: { code: 'NOT_FOUND', message: 'Appointment not found.' }
      });
    }

    if (req.user.role === 'DOCTOR' && currentAppt.doctor_id !== req.user.doctorId) {
      return res.status(403).json({
        error: { code: 'FORBIDDEN', message: 'You are not assigned to this appointment.' }
      });
    }

    const currentStatus = currentAppt.status;
    const valid =
      (currentStatus === 'PENDING' && (targetStatus === 'CONFIRMED' || targetStatus === 'CANCELLED')) ||
      (currentStatus === 'CONFIRMED' && (targetStatus === 'COMPLETED' || targetStatus === 'CANCELLED'));

    if (!valid) {
      return res.status(400).json({
        error: { code: 'INVALID_STATUS_TRANSITION', message: `Cannot transition status from ${currentStatus} to ${targetStatus}.` }
      });
    }

    currentAppt.status = targetStatus;

    return res.status(200).json({
      data: {
        id: appointmentId,
        patientId: currentAppt.patient_id,
        doctorId: currentAppt.doctor_id,
        visitDate: formatDateValue(currentAppt.visit_date),
        slot: String(currentAppt.slot).substring(0, 5),
        status: targetStatus
      }
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/appointments/:id/prescription (Doctor)
router.post('/:id/prescription', authenticate, requireRole('DOCTOR'), async (req, res, next) => {
  try {
    const appointmentId = Number(req.params.id);
    const { notes = '', medicines = '' } = req.body || {};

    const pool = getPool();
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

      const [existing] = await pool.query('SELECT id FROM prescriptions WHERE appointment_id = ?', [appointmentId]);
      let presId;
      if (existing.length > 0) {
        presId = existing[0].id;
        await pool.query('UPDATE prescriptions SET notes = ?, medicines = ? WHERE id = ?', [notes, medicines, presId]);
      } else {
        const [result] = await pool.query(
          'INSERT INTO prescriptions (appointment_id, notes, medicines) VALUES (?, ?, ?)',
          [appointmentId, notes, medicines]
        );
        presId = result.insertId;
      }

      return res.status(201).json({
        data: {
          id: presId,
          appointmentId,
          notes,
          medicines
        }
      });
    }

    // In-memory fallback
    const appt = memoryDb.appointments.find((a) => a.id === appointmentId);
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

    let pres = memoryDb.prescriptions.find((p) => p.appointment_id === appointmentId);
    if (pres) {
      pres.notes = notes;
      pres.medicines = medicines;
    } else {
      pres = {
        id: memoryDb.prescriptions.length + 1,
        appointment_id: appointmentId,
        notes,
        medicines
      };
      memoryDb.prescriptions.push(pres);
    }

    return res.status(201).json({
      data: {
        id: pres.id,
        appointmentId,
        notes,
        medicines
      }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
