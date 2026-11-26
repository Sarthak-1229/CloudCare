const express = require('express');
const { getPool, memoryDb } = require('../config/db');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

const DOCTOR_SLOTS = {
  1: ['09:00', '10:00', '11:00', '12:00', '14:00'],
  2: ['10:00', '11:30', '13:00', '15:00', '16:00'],
  3: ['09:30', '11:00', '14:30', '16:00', '17:00'],
  4: ['09:00', '10:30', '12:00', '15:30', '17:00'],
  5: ['10:00', '11:00', '14:00', '15:30', '16:30'],
};
const DEFAULT_SLOTS = ['09:00', '10:00', '11:00', '14:00', '16:00'];

// GET /api/doctors
router.get('/', authenticate, async (req, res, next) => {
  try {
    const pool = getPool();
    if (pool) {
      const [rows] = await pool.query(`
        SELECT d.id, u.name, d.specialization
        FROM doctors d
        JOIN users u ON d.user_id = u.id
        ORDER BY d.id ASC
      `);
      const enriched = rows.map((d) => ({
        ...d,
        availableSlots: DOCTOR_SLOTS[d.id] || DEFAULT_SLOTS,
      }));
      return res.status(200).json({ data: enriched });
    }

    // In-memory fallback
    const doctors = memoryDb.doctors.map((d) => {
      const u = memoryDb.users.find((user) => user.id === d.user_id);
      return {
        id: d.id,
        name: u ? u.name : `Dr. Doctor ${d.id}`,
        specialization: d.specialization,
        availableSlots: DOCTOR_SLOTS[d.id] || DEFAULT_SLOTS,
      };
    });

    return res.status(200).json({ data: doctors });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
