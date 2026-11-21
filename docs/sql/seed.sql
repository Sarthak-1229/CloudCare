
USE cloudcare;

-- Insert fictional users
-- Replace the password_hash placeholders with bcrypt hashes
-- generated locally before testing login.

INSERT INTO users (id, name, email, password_hash, role)
VALUES
(1, 'Admin User', 'admin@cloudcare.test', 'REPLACE_WITH_BCRYPT_HASH', 'ADMIN'),
(2, 'Dr. Rahul Sharma', 'rahul@cloudcare.test', 'REPLACE_WITH_BCRYPT_HASH', 'DOCTOR'),
(3, 'Dr. Priya Mehta', 'priya@cloudcare.test', 'REPLACE_WITH_BCRYPT_HASH', 'DOCTOR'),
(4, 'Aarav Patil', 'aarav@cloudcare.test', 'REPLACE_WITH_BCRYPT_HASH', 'PATIENT'),
(5, 'Sneha Joshi', 'sneha@cloudcare.test', 'REPLACE_WITH_BCRYPT_HASH', 'PATIENT');

-- Insert doctor profiles
INSERT INTO doctors (id, user_id, specialization)
VALUES
(1, 2, 'Cardiology'),
(2, 3, 'Dermatology');

-- Insert patient profiles
INSERT INTO patients (id, user_id)
VALUES
(1, 4),
(2, 5);

-- Insert sample appointments
INSERT INTO appointments
(patient_id, doctor_id, visit_date, slot, status)
VALUES
(1, 1, '2027-01-15', '10:00:00', 'CONFIRMED'),
(2, 2, '2027-01-16', '11:00:00', 'PENDING');

-- Insert sample prescriptions
INSERT INTO prescriptions
(appointment_id, notes, medicines)
VALUES
(1, 'Regular checkup. Follow a healthy diet.', 'Sample Medicine A'),
(2, 'Skin consultation completed.', 'Sample Medicine B');
