
USE cloudcare;

-- Insert fictional users with active bcrypt hashes for testing
-- Admin: Admin@123
-- Doctor: Doctor@123
-- Patient: Patient@123

INSERT INTO users (id, name, email, password_hash, role)
VALUES
(1, 'Admin User', 'admin@cloudcare.test', '$2b$10$LKw4LQjB.vdna3MNR2B1/e3qGDwTijBKWM.Si1HMqG1hA6qC.NpPa', 'ADMIN'),
(2, 'Dr. Rahul Sharma', 'rahul@cloudcare.test', '$2b$10$aDRtssfuh.tUXPu6HVY5H.cb4iYp4xeOS08jIvWQuTItpukWQB/he', 'DOCTOR'),
(3, 'Dr. Priya Mehta', 'priya@cloudcare.test', '$2b$10$aDRtssfuh.tUXPu6HVY5H.cb4iYp4xeOS08jIvWQuTItpukWQB/he', 'DOCTOR'),
(4, 'Aarav Patil', 'aarav@cloudcare.test', '$2b$10$gS7JVjzJmxTGVM1DFdaScezMGV1qzpceEw6XKXT8g/iErgR0ltR3m', 'PATIENT'),
(5, 'Sneha Joshi', 'sneha@cloudcare.test', '$2b$10$gS7JVjzJmxTGVM1DFdaScezMGV1qzpceEw6XKXT8g/iErgR0ltR3m', 'PATIENT')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- Insert doctor profiles
INSERT INTO doctors (id, user_id, specialization)
VALUES
(1, 2, 'Cardiology'),
(2, 3, 'Dermatology')
ON DUPLICATE KEY UPDATE specialization=VALUES(specialization);

-- Insert patient profiles
INSERT INTO patients (id, user_id)
VALUES
(1, 4),
(2, 5)
ON DUPLICATE KEY UPDATE user_id=VALUES(user_id);

-- Insert sample appointments
INSERT INTO appointments
(patient_id, doctor_id, visit_date, slot, status)
VALUES
(1, 1, '2027-01-15', '10:00:00', 'CONFIRMED'),
(2, 2, '2027-01-16', '11:00:00', 'PENDING')
ON DUPLICATE KEY UPDATE status=VALUES(status);

-- Insert sample prescriptions
INSERT INTO prescriptions
(appointment_id, notes, medicines)
VALUES
(1, 'Regular checkup. Follow a healthy diet.', 'Sample Medicine A'),
(2, 'Skin consultation completed.', 'Sample Medicine B')
ON DUPLICATE KEY UPDATE notes=VALUES(notes);
