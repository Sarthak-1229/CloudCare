const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

let pool = null;

// In-memory fallback database for local testing when DB_HOST is not provided
const memoryDb = {
  users: [
    { id: 1, name: 'Admin User', email: 'admin@cloudcare.test', password_hash: bcrypt.hashSync('Admin@123', 10), role: 'ADMIN' },
    { id: 2, name: 'Dr. Rahul Sharma', email: 'rahul@cloudcare.test', password_hash: bcrypt.hashSync('Doctor@123', 10), role: 'DOCTOR' },
    { id: 3, name: 'Dr. Priya Mehta', email: 'priya@cloudcare.test', password_hash: bcrypt.hashSync('Doctor@123', 10), role: 'DOCTOR' },
    { id: 4, name: 'Aarav Patil', email: 'aarav@cloudcare.test', password_hash: bcrypt.hashSync('Patient@123', 10), role: 'PATIENT' },
    { id: 5, name: 'Sneha Joshi', email: 'sneha@cloudcare.test', password_hash: bcrypt.hashSync('Patient@123', 10), role: 'PATIENT' }
  ],
  doctors: [
    { id: 1, user_id: 2, specialization: 'Cardiology' },
    { id: 2, user_id: 3, specialization: 'Dermatology' }
  ],
  patients: [
    { id: 1, user_id: 4 },
    { id: 2, user_id: 5 }
  ],
  appointments: [
    { id: 1, patient_id: 1, doctor_id: 1, visit_date: '2027-01-15', slot: '10:00:00', status: 'CONFIRMED' },
    { id: 2, patient_id: 2, doctor_id: 2, visit_date: '2027-01-16', slot: '11:00:00', status: 'PENDING' }
  ],
  prescriptions: [
    { id: 1, appointment_id: 1, notes: 'Regular checkup. Follow a healthy diet.', medicines: 'Sample Medicine A' },
    { id: 2, appointment_id: 2, notes: 'Skin consultation completed.', medicines: 'Sample Medicine B' }
  ],
  documents: []
};

function getPool() {
  if (pool) return pool;

  if (process.env.DB_HOST) {
    pool = mysql.createPool({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT) || 3306,
      user: process.env.DB_USER || 'cloudcare_user',
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME || 'cloudcare',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      ssl: process.env.DB_SSL === 'false' ? false : { rejectUnauthorized: false }
    });
  }
  return pool;
}

async function isReady() {
  const p = getPool();
  if (!p) {
    // If running in development without DB_HOST, return ready if explicitly allowed, else false
    return process.env.NODE_ENV === 'test-memory';
  }
  try {
    const [rows] = await p.query('SELECT 1 AS ok');
    return rows[0]?.ok === 1;
  } catch (error) {
    return false;
  }
}

module.exports = {
  getPool,
  isReady,
  memoryDb
};
