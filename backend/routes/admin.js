const express = require('express');
const { getPool, memoryDb } = require('../config/db');
const { authenticate, requireRole } = require('../middleware/auth');

const router = express.Router();

// GET /api/admin/summary
router.get('/summary', authenticate, requireRole('ADMIN'), async (req, res, next) => {
  try {
    const pool = getPool();

    if (pool) {
      const [[patientsRow]] = await pool.query('SELECT COUNT(*) AS count FROM patients');
      const [[doctorsRow]] = await pool.query('SELECT COUNT(*) AS count FROM doctors');
      const [[apptsRow]] = await pool.query('SELECT COUNT(*) AS count FROM appointments');

      return res.status(200).json({
        data: {
          patients: patientsRow.count,
          doctors: doctorsRow.count,
          appointments: apptsRow.count
        }
      });
    }

    // In-memory fallback
    return res.status(200).json({
      data: {
        patients: memoryDb.patients.length,
        doctors: memoryDb.doctors.length,
        appointments: memoryDb.appointments.length
      }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
