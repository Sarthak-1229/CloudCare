const express = require('express');
const bcrypt = require('bcryptjs');
const { getPool, memoryDb } = require('../config/db');
const { generateToken, authenticate, JWT_EXPIRES_IN } = require('../middleware/auth');

const router = express.Router();

function sanitizeEmail(raw) {
  if (typeof raw !== 'string') return '';
  // Strip accidental quotes, backticks, angle brackets, and whitespace from copy-paste
  return raw.replace(/[\s"'`<>]+/g, '').toLowerCase();
}

// POST /api/auth/register (Patient only)
router.post('/register', async (req, res, next) => {
  try {
    const rawBody = req.body || {};
    const name = typeof rawBody.name === 'string' ? rawBody.name.trim() : '';
    const email = sanitizeEmail(rawBody.email);
    const password = typeof rawBody.password === 'string' ? rawBody.password.trim() : '';

    if (!name || !email || !password) {
      return res.status(400).json({
        error: { code: 'VALIDATION_ERROR', message: 'Name, email, and password are required.' }
      });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({
        error: { code: 'VALIDATION_ERROR', message: 'Please enter a valid email address.' }
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        error: { code: 'VALIDATION_ERROR', message: 'Password must be at least 6 characters.' }
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
        data: { id: userId, patientId: patientResult.insertId, name, email, role: 'PATIENT' }
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
    const newPatientId = memoryDb.patients.length + 1;
    const newUser = { id: newUserId, name, email, password_hash: passwordHash, role: 'PATIENT' };
    memoryDb.users.push(newUser);
    memoryDb.patients.push({ id: newPatientId, user_id: newUserId });

    return res.status(201).json({
      data: { id: newUserId, patientId: newPatientId, name, email, role: 'PATIENT' }
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/auth/login
router.post('/login', async (req, res, next) => {
  try {
    const rawBody = req.body || {};
    const email = sanitizeEmail(rawBody.email);
    const password = typeof rawBody.password === 'string' ? rawBody.password.trim() : '';

    if (!email || !password) {
      return res.status(401).json({
        error: { code: 'INVALID_CREDENTIALS', message: 'Email and password are required.' }
      });
    }

    const pool = getPool();
    let user = null;
    let patientId = null;
    let doctorId = null;
    let specialization = null;

    if (pool) {
      const [rows] = await pool.query(
        'SELECT id, name, email, password_hash, role FROM users WHERE LOWER(email) = ?',
        [email]
      );
      if (rows.length === 0) {
        return res.status(401).json({
          error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password.' }
        });
      }
      user = rows[0];

      if (user.role === 'PATIENT') {
        const [patients] = await pool.query('SELECT id FROM patients WHERE user_id = ?', [user.id]);
        patientId = patients[0]?.id || null;
      } else if (user.role === 'DOCTOR') {
        const [doctors] = await pool.query(
          'SELECT id, specialization FROM doctors WHERE user_id = ?',
          [user.id]
        );
        doctorId = doctors[0]?.id || null;
        specialization = doctors[0]?.specialization || null;
      }
    } else {
      user = memoryDb.users.find((u) => u.email.toLowerCase() === email);
      if (!user) {
        return res.status(401).json({
          error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password.' }
        });
      }
      if (user.role === 'PATIENT') {
        patientId = memoryDb.patients.find((p) => p.user_id === user.id)?.id || 1;
      } else if (user.role === 'DOCTOR') {
        const doc = memoryDb.doctors.find((d) => d.user_id === user.id);
        doctorId = doc?.id || 1;
        specialization = doc?.specialization || null;
      }
    }

    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      return res.status(401).json({
        error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password.' }
      });
    }

    const token = generateToken({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      patientId,
      doctorId,
      specialization
    });

    return res.status(200).json({
      data: {
        token,
        expiresIn: JWT_EXPIRES_IN,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          ...(patientId ? { patientId } : {}),
          ...(doctorId ? { doctorId } : {}),
          ...(specialization ? { specialization } : {})
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
      role: req.user.role,
      ...(req.user.patientId ? { patientId: req.user.patientId } : {}),
      ...(req.user.doctorId ? { doctorId: req.user.doctorId } : {}),
      ...(req.user.specialization ? { specialization: req.user.specialization } : {})
    }
  });
});

module.exports = router;
