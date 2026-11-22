USE cloudcare;

-- ============================================================================
-- CloudCare Demonstration Seed Dataset (Simplified TY CCF v3.0)
-- All patient, doctor, and medical records are 100% synthetic.
-- Active Bcrypt Passwords:
--   Admin:   Admin@123
--   Doctors: Doctor@123
--   Patients: Patient@123
-- ============================================================================

-- 1. Seed Users (1 Admin, 5 Doctors, 5 Patients)
INSERT INTO users (id, name, email, password_hash, role)
VALUES
-- Administrator
(1, 'System Administrator', 'admin@cloudcare.test', '$2b$10$LKw4LQjB.vdna3MNR2B1/e3qGDwTijBKWM.Si1HMqG1hA6qC.NpPa', 'ADMIN'),

-- Doctors across specialties
(2, 'Dr. Rahul Sharma', 'rahul@cloudcare.test', '$2b$10$aDRtssfuh.tUXPu6HVY5H.cb4iYp4xeOS08jIvWQuTItpukWQB/he', 'DOCTOR'),
(3, 'Dr. Priya Mehta', 'priya@cloudcare.test', '$2b$10$aDRtssfuh.tUXPu6HVY5H.cb4iYp4xeOS08jIvWQuTItpukWQB/he', 'DOCTOR'),
(4, 'Dr. Arjun Reddy', 'arjun@cloudcare.test', '$2b$10$aDRtssfuh.tUXPu6HVY5H.cb4iYp4xeOS08jIvWQuTItpukWQB/he', 'DOCTOR'),
(5, 'Dr. Kavita Rao', 'kavita@cloudcare.test', '$2b$10$aDRtssfuh.tUXPu6HVY5H.cb4iYp4xeOS08jIvWQuTItpukWQB/he', 'DOCTOR'),
(6, 'Dr. Sanjay Verma', 'sanjay@cloudcare.test', '$2b$10$aDRtssfuh.tUXPu6HVY5H.cb4iYp4xeOS08jIvWQuTItpukWQB/he', 'DOCTOR'),

-- Patients
(7, 'Aarav Patil', 'aarav@cloudcare.test', '$2b$10$gS7JVjzJmxTGVM1DFdaScezMGV1qzpceEw6XKXT8g/iErgR0ltR3m', 'PATIENT'),
(8, 'Sneha Joshi', 'sneha@cloudcare.test', '$2b$10$gS7JVjzJmxTGVM1DFdaScezMGV1qzpceEw6XKXT8g/iErgR0ltR3m', 'PATIENT'),
(9, 'Vikram Malhotra', 'vikram@cloudcare.test', '$2b$10$gS7JVjzJmxTGVM1DFdaScezMGV1qzpceEw6XKXT8g/iErgR0ltR3m', 'PATIENT'),
(10, 'Ananya Deshmukh', 'ananya@cloudcare.test', '$2b$10$gS7JVjzJmxTGVM1DFdaScezMGV1qzpceEw6XKXT8g/iErgR0ltR3m', 'PATIENT'),
(11, 'Rohan Kulkarni', 'rohan@cloudcare.test', '$2b$10$gS7JVjzJmxTGVM1DFdaScezMGV1qzpceEw6XKXT8g/iErgR0ltR3m', 'PATIENT')
ON DUPLICATE KEY UPDATE name=VALUES(name), password_hash=VALUES(password_hash);

-- 2. Seed Doctor Profiles (5 Specialties)
INSERT INTO doctors (id, user_id, specialization)
VALUES
(1, 2, 'Cardiology & Vascular Medicine'),
(2, 3, 'Dermatology & Clinical Cosmetology'),
(3, 4, 'Orthopedic & Joint Replacement'),
(4, 5, 'Pediatrics & Child Wellness'),
(5, 6, 'Neurology & Cognitive Health')
ON DUPLICATE KEY UPDATE specialization=VALUES(specialization);

-- 3. Seed Patient Profiles
INSERT INTO patients (id, user_id)
VALUES
(1, 7),
(2, 8),
(3, 9),
(4, 10),
(5, 11)
ON DUPLICATE KEY UPDATE user_id=VALUES(user_id);

-- 4. Seed Demonstrative Appointments (Across statuses)
INSERT INTO appointments (id, patient_id, doctor_id, visit_date, slot, status)
VALUES
(1, 1, 1, '2027-01-15', '10:00:00', 'COMPLETED'),
(2, 2, 2, '2027-01-16', '11:00:00', 'COMPLETED'),
(3, 3, 3, '2027-02-10', '09:30:00', 'CONFIRMED'),
(4, 4, 4, '2027-02-15', '14:00:00', 'CONFIRMED'),
(5, 5, 5, '2027-02-18', '11:30:00', 'PENDING'),
(6, 1, 3, '2027-03-01', '10:30:00', 'PENDING'),
(7, 2, 4, '2027-03-05', '16:00:00', 'CONFIRMED'),
(8, 3, 1, '2027-03-12', '11:00:00', 'CANCELLED'),
(9, 4, 2, '2027-03-20', '15:30:00', 'PENDING'),
(10, 5, 3, '2027-03-25', '10:00:00', 'CONFIRMED')
ON DUPLICATE KEY UPDATE status=VALUES(status);

-- 5. Seed Demonstrative Prescriptions
INSERT INTO prescriptions (id, appointment_id, notes, medicines)
VALUES
(1, 1, 'Resting ECG normal. Recommended low-sodium diet and 30-minute daily cardio.', 'Atorvastatin 10mg OD (Night), Aspirin 75mg OD (Post Lunch)'),
(2, 2, 'Mild seasonal eczema on left forearm. Avoid perfumed soaps and hot water.', 'Hydrocortisone cream 1% topical, Cetirizine 10mg OD as needed'),
(3, 3, 'Post-arthroscopy recovery review. Range of motion improved by 25%.', 'Calcium Citrate + Vitamin D3 OD, Paracetamol 650mg SOS'),
(4, 4, 'Routine pediatric booster vaccination administered. Growth percentiles normal.', 'Multivitamin pediatric syrup 5ml OD for 30 days')
ON DUPLICATE KEY UPDATE notes=VALUES(notes), medicines=VALUES(medicines);
