const express = require('express');
const bcrypt = require('bcryptjs');
const { getPool, memoryDb } = require('../config/db');
const { generateToken, authenticate, JWT_EXPIRES_IN } = require('../middleware/auth');

const router = express.Router();

// POST /api/auth/register (Patient only)
router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password } = req.body || {};
    if (!name || !email || !password) {
      return res.status(400).json({
        error: { code: 'VALIDATION_ERROR', message: 'Name, email, and password are required.' }
      });
    }

    const pool = getPool();
    const passwordHash = await bcrypt.hash(password, 10);

    if (pool) {
      const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
      if (existing.length > 0) {
        return res.status(409).json({
          error: { code: 'EMAIL_CONFLICT', message: 'Email is already registered.' }
        });
      }

      const [userResult] = await pool.query(
        'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, "PATIENT")',
        [name, email, passwordHash]
      );
      const userId = userResult.insertId;

      const [patientResult] = await pool.query(
        'INSERT INTO patients (user_id) VALUES (?)',
        [userId]
      );

      return res.status(201).json({
        data: { id: userId, name, email, role: 'PATIENT' }
      });
    }

    // In-memory fallback
    const exists = memoryDb.users.some((u) => u.email.toLowerCase() === email.toLowerCase());
    if (exists) {
      return res.status(409).json({
        error: { code: 'EMAIL_CONFLICT', message: 'Email is already registered.' }
      });
    }

    const newUserId = memoryDb.users.length + 1;
    const newUser = { id: newUserId, name, email, password_hash: passwordHash, role: 'PATIENT' };
    memoryDb.users.push(newUser);
    memoryDb.patients.push({ id: memoryDb.patients.length + 1, user_id: newUserId });

    return res.status(201).json({
      data: { id: newUserId, name, email, role: 'PATIENT' }
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/auth/login
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(401).json({
        error: { code: 'INVALID_CREDENTIALS', message: 'Email and password are required.' }
      });
    }

    const pool = getPool();
    let user = null;
    let patientId = null;
    let doctorId = null;

    if (pool) {
      const [rows] = await pool.query(
        'SELECT id, name, email, password_hash, role FROM users WHERE email = ?',
        [email]
      );
      if (rows.length === 0) {
        return res.status(401).json({
          error: { code: 'INVALID_CREDENTIALS', message: 'Invalid credentials.' }
        });
      }
      user = rows[0];

      if (user.role === 'PATIENT') {
        const [patients] = await pool.query('SELECT id FROM patients WHERE user_id = ?', [user.id]);
        patientId = patients[0]?.id || null;
      } else if (user.role === 'DOCTOR') {
        const [doctors] = await pool.query('SELECT id FROM doctors WHERE user_id = ?', [user.id]);
        doctorId = doctors[0]?.id || null;
      }
    } else {
      user = memoryDb.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
      if (!user) {
        return res.status(401).json({
          error: { code: 'INVALID_CREDENTIALS', message: 'Invalid credentials.' }
        });
      }
      if (user.role === 'PATIENT') {
        patientId = memoryDb.patients.find((p) => p.user_id === user.id)?.id || 1;
      } else if (user.role === 'DOCTOR') {
        doctorId = memoryDb.doctors.find((d) => d.user_id === user.id)?.id || 1;
      }
    }

    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      return res.status(401).json({
        error: { code: 'INVALID_CREDENTIALS', message: 'Invalid credentials.' }
      });
    }

    const token = generateToken({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      patientId,
      doctorId
    });

    return res.status(200).json({
      data: {
        token,
        expiresIn: JWT_EXPIRES_IN,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/me
router.get('/me', authenticate, (req, res) => {
  return res.status(200).json({
    data: {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role
    }
  });
});

module.exports = router;
