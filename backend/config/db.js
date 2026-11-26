const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

let pool = null;

// In-memory fallback database for local testing when DB_HOST is not provided
const memoryDb = {
  users: [
    { id: 1, name: 'System Administrator', email: 'admin@cloudcare.test', password_hash: bcrypt.hashSync('Admin@123', 10), role: 'ADMIN' },
    { id: 2, name: 'Dr. Rahul Sharma', email: 'rahul@cloudcare.test', password_hash: bcrypt.hashSync('Doctor@123', 10), role: 'DOCTOR' },
    { id: 3, name: 'Dr. Priya Mehta', email: 'priya@cloudcare.test', password_hash: bcrypt.hashSync('Doctor@123', 10), role: 'DOCTOR' },
    { id: 4, name: 'Dr. Arjun Reddy', email: 'arjun@cloudcare.test', password_hash: bcrypt.hashSync('Doctor@123', 10), role: 'DOCTOR' },
    { id: 5, name: 'Dr. Kavita Rao', email: 'kavita@cloudcare.test', password_hash: bcrypt.hashSync('Doctor@123', 10), role: 'DOCTOR' },
    { id: 6, name: 'Dr. Sanjay Verma', email: 'sanjay@cloudcare.test', password_hash: bcrypt.hashSync('Doctor@123', 10), role: 'DOCTOR' },
    { id: 7, name: 'Aarav Patil', email: 'aarav@cloudcare.test', password_hash: bcrypt.hashSync('Patient@123', 10), role: 'PATIENT' },
    { id: 8, name: 'Sneha Joshi', email: 'sneha@cloudcare.test', password_hash: bcrypt.hashSync('Patient@123', 10), role: 'PATIENT' },
    { id: 9, name: 'Vikram Malhotra', email: 'vikram@cloudcare.test', password_hash: bcrypt.hashSync('Patient@123', 10), role: 'PATIENT' },
    { id: 10, name: 'Ananya Deshmukh', email: 'ananya@cloudcare.test', password_hash: bcrypt.hashSync('Patient@123', 10), role: 'PATIENT' },
    { id: 11, name: 'Rohan Kulkarni', email: 'rohan@cloudcare.test', password_hash: bcrypt.hashSync('Patient@123', 10), role: 'PATIENT' },
    { id: 12, name: 'Neha Sharma', email: 'neha.sharma@cloudcare.test', password_hash: bcrypt.hashSync('Patient@123', 10), role: 'PATIENT' },
    { id: 13, name: 'Aditya Nair', email: 'aditya.nair@cloudcare.test', password_hash: bcrypt.hashSync('Patient@123', 10), role: 'PATIENT' },
    { id: 14, name: 'Pooja Iyer', email: 'pooja.iyer@cloudcare.test', password_hash: bcrypt.hashSync('Patient@123', 10), role: 'PATIENT' },
    { id: 15, name: 'Karan Singhania', email: 'karan.s@cloudcare.test', password_hash: bcrypt.hashSync('Patient@123', 10), role: 'PATIENT' },
    { id: 16, name: 'Meera Patel', email: 'meera.patel@cloudcare.test', password_hash: bcrypt.hashSync('Patient@123', 10), role: 'PATIENT' },
    { id: 17, name: 'Devendra Rao', email: 'devendra.rao@cloudcare.test', password_hash: bcrypt.hashSync('Patient@123', 10), role: 'PATIENT' },
    { id: 18, name: 'Ishaan Kapoor', email: 'ishaan.kapoor@cloudcare.test', password_hash: bcrypt.hashSync('Patient@123', 10), role: 'PATIENT' }
  ],
  doctors: [
    { id: 1, user_id: 2, specialization: 'Cardiology & Vascular Medicine' },
    { id: 2, user_id: 3, specialization: 'Dermatology & Clinical Cosmetology' },
    { id: 3, user_id: 4, specialization: 'Orthopedic & Joint Replacement' },
    { id: 4, user_id: 5, specialization: 'Pediatrics & Child Wellness' },
    { id: 5, user_id: 6, specialization: 'Neurology & Cognitive Health' }
  ],
  patients: [
    { id: 1, user_id: 7 },
    { id: 2, user_id: 8 },
    { id: 3, user_id: 9 },
    { id: 4, user_id: 10 },
    { id: 5, user_id: 11 },
    { id: 6, user_id: 12 },
    { id: 7, user_id: 13 },
    { id: 8, user_id: 14 },
    { id: 9, user_id: 15 },
    { id: 10, user_id: 16 },
    { id: 11, user_id: 17 },
    { id: 12, user_id: 18 }
  ],
  appointments: [
    { id: 1, patient_id: 1, doctor_id: 1, visit_date: '2027-01-15', slot: '10:00:00', status: 'COMPLETED' },
    { id: 2, patient_id: 2, doctor_id: 2, visit_date: '2027-01-16', slot: '11:00:00', status: 'COMPLETED' },
    { id: 3, patient_id: 3, doctor_id: 3, visit_date: '2027-02-10', slot: '09:30:00', status: 'COMPLETED' },
    { id: 4, patient_id: 4, doctor_id: 4, visit_date: '2027-02-15', slot: '14:00:00', status: 'COMPLETED' },
    { id: 5, patient_id: 5, doctor_id: 5, visit_date: '2027-02-18', slot: '11:00:00', status: 'COMPLETED' },
    { id: 6, patient_id: 6, doctor_id: 5, visit_date: '2027-03-01', slot: '14:00:00', status: 'CONFIRMED' },
    { id: 7, patient_id: 7, doctor_id: 1, visit_date: '2027-03-05', slot: '09:00:00', status: 'CONFIRMED' },
    { id: 8, patient_id: 8, doctor_id: 2, visit_date: '2027-03-10', slot: '13:00:00', status: 'CONFIRMED' },
    { id: 9, patient_id: 9, doctor_id: 3, visit_date: '2027-03-15', slot: '11:00:00', status: 'CONFIRMED' },
    { id: 10, patient_id: 10, doctor_id: 4, visit_date: '2027-03-20', slot: '10:30:00', status: 'CONFIRMED' },
    { id: 11, patient_id: 11, doctor_id: 5, visit_date: '2027-03-25', slot: '15:30:00', status: 'PENDING' },
    { id: 12, patient_id: 12, doctor_id: 1, visit_date: '2027-03-28', slot: '11:00:00', status: 'PENDING' }
  ],
  prescriptions: [
    { id: 1, appointment_id: 1, notes: 'Resting ECG normal. Recommended low-sodium diet and 30-minute daily cardio.', medicines: 'Atorvastatin 10mg OD (Night), Aspirin 75mg OD (Post Lunch)' },
    { id: 2, appointment_id: 2, notes: 'Mild seasonal eczema on left forearm. Avoid perfumed soaps and hot water.', medicines: 'Hydrocortisone cream 1% topical, Cetirizine 10mg OD as needed' },
    { id: 3, appointment_id: 3, notes: 'Post-arthroscopy knee ligament recovery review. Range of motion improved by 25%.', medicines: 'Calcium Citrate + Vitamin D3 OD, Paracetamol 650mg SOS' },
    { id: 4, appointment_id: 4, notes: 'Routine pediatric booster vaccination administered. Growth percentiles healthy.', medicines: 'Multivitamin pediatric syrup 5ml OD, Montelukast chewable 4mg OD (Night)' },
    { id: 5, appointment_id: 5, notes: 'Tension cephalalgia. Cranial nerves intact. Advised ergonomic posture and sleep schedule.', medicines: 'Magnesium glycinate 400mg OD, Naproxen 250mg SOS' }
  ],
  documents: []
};

function getPool() {
  if (pool) return pool;

  if (process.env.DB_HOST) {
    pool = mysql.createPool({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT) || 3306,
      user: process.env.DB_USER || 'admin',
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
