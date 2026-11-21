const express = require('express');
const { getPool, memoryDb } = require('../config/db');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

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
      return res.status(200).json({ data: rows });
    }

    // In-memory fallback
    const doctors = memoryDb.doctors.map((d) => {
      const u = memoryDb.users.find((user) => user.id === d.user_id);
      return {
        id: d.id,
        name: u ? u.name : `Dr. Doctor ${d.id}`,
        specialization: d.specialization
      };
    });

    return res.status(200).json({ data: doctors });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
