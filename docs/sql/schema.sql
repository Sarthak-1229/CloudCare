
CREATE DATABASE IF NOT EXISTS cloudcare;
USE cloudcare;

-- 1. Users table
CREATE TABLE users (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('PATIENT', 'DOCTOR', 'ADMIN') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 2. Patients table
CREATE TABLE patients (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL UNIQUE,

    CONSTRAINT fk_patients_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE
) ENGINE=InnoDB;

-- 3. Doctors table
CREATE TABLE doctors (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL UNIQUE,
    specialization VARCHAR(100) NOT NULL,

    CONSTRAINT fk_doctors_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE
) ENGINE=InnoDB;

-- 4. Appointments table
CREATE TABLE appointments (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    patient_id BIGINT UNSIGNED NOT NULL,
    doctor_id BIGINT UNSIGNED NOT NULL,
    visit_date DATE NOT NULL,
    slot TIME NOT NULL,
    status ENUM(
        'PENDING',
        'CONFIRMED',
        'COMPLETED',
        'CANCELLED'
    ) NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT uq_doctor_date_slot
        UNIQUE (doctor_id, visit_date, slot),

    CONSTRAINT fk_appointments_patient
        FOREIGN KEY (patient_id) REFERENCES patients(id),

    CONSTRAINT fk_appointments_doctor
        FOREIGN KEY (doctor_id) REFERENCES doctors(id)
) ENGINE=InnoDB;

-- 5. Prescriptions table
CREATE TABLE prescriptions (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    appointment_id BIGINT UNSIGNED NOT NULL UNIQUE,
    notes TEXT,
    medicines TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_prescriptions_appointment
        FOREIGN KEY (appointment_id) REFERENCES appointments(id)
        ON DELETE CASCADE
) ENGINE=InnoDB;

-- 6. Documents table
CREATE TABLE documents (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    patient_id BIGINT UNSIGNED NOT NULL,
    uploaded_by BIGINT UNSIGNED NOT NULL,
    s3_key VARCHAR(500) NOT NULL,
    filename VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_documents_patient
        FOREIGN KEY (patient_id) REFERENCES patients(id),

    CONSTRAINT fk_documents_uploader
        FOREIGN KEY (uploaded_by) REFERENCES users(id)
) ENGINE=InnoDB;
