USE cloudcare;

-- ============================================================================
-- CloudCare Demonstration Seed Dataset (Simplified TY CCF v3.0)
-- All patient, doctor, and medical records are 100% synthetic.
-- Active Bcrypt Passwords:
--   Admin:    Admin@123
--   Doctors:  Doctor@123
--   Patients: Patient@123
-- ============================================================================

SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE prescriptions;
TRUNCATE TABLE documents;
TRUNCATE TABLE appointments;
TRUNCATE TABLE patients;
TRUNCATE TABLE doctors;
TRUNCATE TABLE users;
SET FOREIGN_KEY_CHECKS = 1;

-- 1. Seed Users (1 Administrator, 5 Medical Specialists, 12 Synthetic Patients)
INSERT INTO users (id, name, email, password_hash, role)
VALUES
-- Administrator
(1, 'System Administrator', 'admin@cloudcare.test', '$2b$10$JreVUJuM5jJ5birG9kMQM.1NiXJ3Cna/jH1YvFeyHD3Ti2U7M/CNi', 'ADMIN'),

-- Doctors across 5 core clinical specialties
(2, 'Dr. Rahul Sharma', 'rahul@cloudcare.test', '$2b$10$fiO8yHuCmEgi.cvp4qYYOuj8NeGUYrM/KP/ayli1uOFGr58mgePQq', 'DOCTOR'),
(3, 'Dr. Priya Mehta', 'priya@cloudcare.test', '$2b$10$fiO8yHuCmEgi.cvp4qYYOuj8NeGUYrM/KP/ayli1uOFGr58mgePQq', 'DOCTOR'),
(4, 'Dr. Arjun Reddy', 'arjun@cloudcare.test', '$2b$10$fiO8yHuCmEgi.cvp4qYYOuj8NeGUYrM/KP/ayli1uOFGr58mgePQq', 'DOCTOR'),
(5, 'Dr. Kavita Rao', 'kavita@cloudcare.test', '$2b$10$fiO8yHuCmEgi.cvp4qYYOuj8NeGUYrM/KP/ayli1uOFGr58mgePQq', 'DOCTOR'),
(6, 'Dr. Sanjay Verma', 'sanjay@cloudcare.test', '$2b$10$fiO8yHuCmEgi.cvp4qYYOuj8NeGUYrM/KP/ayli1uOFGr58mgePQq', 'DOCTOR'),

-- Synthetic Patient Accounts
(7, 'Aarav Patil', 'aarav@cloudcare.test', '$2b$10$M0lS15w1UAolD2EjYf0iYOWfbBvncn5kWW4n9R7j4ffizxVmQFAwm', 'PATIENT'),
(8, 'Sneha Joshi', 'sneha@cloudcare.test', '$2b$10$M0lS15w1UAolD2EjYf0iYOWfbBvncn5kWW4n9R7j4ffizxVmQFAwm', 'PATIENT'),
(9, 'Vikram Malhotra', 'vikram@cloudcare.test', '$2b$10$M0lS15w1UAolD2EjYf0iYOWfbBvncn5kWW4n9R7j4ffizxVmQFAwm', 'PATIENT'),
(10, 'Ananya Deshmukh', 'ananya@cloudcare.test', '$2b$10$M0lS15w1UAolD2EjYf0iYOWfbBvncn5kWW4n9R7j4ffizxVmQFAwm', 'PATIENT'),
(11, 'Rohan Kulkarni', 'rohan@cloudcare.test', '$2b$10$M0lS15w1UAolD2EjYf0iYOWfbBvncn5kWW4n9R7j4ffizxVmQFAwm', 'PATIENT'),
(12, 'Neha Sharma', 'neha.sharma@cloudcare.test', '$2b$10$M0lS15w1UAolD2EjYf0iYOWfbBvncn5kWW4n9R7j4ffizxVmQFAwm', 'PATIENT'),
(13, 'Aditya Nair', 'aditya.nair@cloudcare.test', '$2b$10$M0lS15w1UAolD2EjYf0iYOWfbBvncn5kWW4n9R7j4ffizxVmQFAwm', 'PATIENT'),
(14, 'Pooja Iyer', 'pooja.iyer@cloudcare.test', '$2b$10$M0lS15w1UAolD2EjYf0iYOWfbBvncn5kWW4n9R7j4ffizxVmQFAwm', 'PATIENT'),
(15, 'Karan Singhania', 'karan.s@cloudcare.test', '$2b$10$M0lS15w1UAolD2EjYf0iYOWfbBvncn5kWW4n9R7j4ffizxVmQFAwm', 'PATIENT'),
(16, 'Meera Patel', 'meera.patel@cloudcare.test', '$2b$10$M0lS15w1UAolD2EjYf0iYOWfbBvncn5kWW4n9R7j4ffizxVmQFAwm', 'PATIENT'),
(17, 'Devendra Rao', 'devendra.rao@cloudcare.test', '$2b$10$M0lS15w1UAolD2EjYf0iYOWfbBvncn5kWW4n9R7j4ffizxVmQFAwm', 'PATIENT'),
(18, 'Ishaan Kapoor', 'ishaan.kapoor@cloudcare.test', '$2b$10$M0lS15w1UAolD2EjYf0iYOWfbBvncn5kWW4n9R7j4ffizxVmQFAwm', 'PATIENT');

-- 2. Seed Doctor Profiles (5 Specialties)
INSERT INTO doctors (id, user_id, specialization)
VALUES
(1, 2, 'Cardiology & Vascular Medicine'),
(2, 3, 'Dermatology & Clinical Cosmetology'),
(3, 4, 'Orthopedic & Joint Replacement'),
(4, 5, 'Pediatrics & Child Wellness'),
(5, 6, 'Neurology & Cognitive Health');

-- 3. Seed Patient Profiles (12 Patients)
INSERT INTO patients (id, user_id)
VALUES
(1, 7),
(2, 8),
(3, 9),
(4, 10),
(5, 11),
(6, 12),
(7, 13),
(8, 14),
(9, 15),
(10, 16),
(11, 17),
(12, 18);

-- 4. Seed Demonstrative Appointments (Across statuses and specialties)
INSERT INTO appointments (id, patient_id, doctor_id, visit_date, slot, status)
VALUES
(1, 1, 1, '2027-01-15', '10:00:00', 'COMPLETED'),
(2, 2, 2, '2027-01-16', '11:00:00', 'COMPLETED'),
(3, 3, 3, '2027-02-10', '09:30:00', 'COMPLETED'),
(4, 4, 4, '2027-02-15', '14:00:00', 'COMPLETED'),
(5, 5, 5, '2027-02-18', '11:00:00', 'COMPLETED'),
(6, 6, 5, '2027-03-01', '14:00:00', 'CONFIRMED'),
(7, 7, 1, '2027-03-05', '09:00:00', 'CONFIRMED'),
(8, 8, 2, '2027-03-10', '13:00:00', 'CONFIRMED'),
(9, 9, 3, '2027-03-15', '11:00:00', 'CONFIRMED'),
(10, 10, 4, '2027-03-20', '10:30:00', 'CONFIRMED'),
(11, 11, 5, '2027-03-25', '15:30:00', 'PENDING'),
(12, 12, 1, '2027-03-28', '11:00:00', 'PENDING'),
(13, 1, 3, '2027-04-02', '14:30:00', 'PENDING'),
(14, 2, 4, '2027-04-05', '09:00:00', 'PENDING'),
(15, 3, 2, '2027-04-08', '15:00:00', 'PENDING'),
(16, 6, 1, '2027-04-12', '12:00:00', 'CANCELLED'),
(17, 7, 3, '2027-04-15', '16:00:00', 'CONFIRMED'),
(18, 8, 5, '2027-04-18', '10:00:00', 'PENDING'),
(19, 9, 1, '2027-04-22', '14:00:00', 'CONFIRMED'),
(20, 10, 2, '2027-04-25', '11:30:00', 'PENDING');

-- 5. Seed Demonstrative Prescriptions
INSERT INTO prescriptions (id, appointment_id, notes, medicines)
VALUES
(1, 1, 'Resting ECG normal. Recommended low-sodium diet and 30-minute daily cardio.', 'Atorvastatin 10mg OD (Night), Aspirin 75mg OD (Post Lunch)'),
(2, 2, 'Mild seasonal eczema on left forearm. Avoid perfumed soaps and hot water.', 'Hydrocortisone cream 1% topical, Cetirizine 10mg OD as needed'),
(3, 3, 'Post-arthroscopy knee ligament recovery review. Range of motion improved by 25%.', 'Calcium Citrate + Vitamin D3 OD, Paracetamol 650mg SOS'),
(4, 4, 'Routine pediatric booster vaccination administered. Growth percentiles healthy.', 'Multivitamin pediatric syrup 5ml OD, Montelukast chewable 4mg OD (Night)'),
(5, 5, 'Tension cephalalgia. Cranial nerves intact. Advised ergonomic posture and sleep schedule.', 'Magnesium glycinate 400mg OD, Naproxen 250mg SOS');
