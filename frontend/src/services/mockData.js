/**
 * CloudCare Synthetic Mock Data Store
 * Matches Simplified TY CCF v3.0 schema and seed definitions.
 * Provides full fallback interactivity for development, review, and offline mode.
 */

export const MOCK_USERS = [
  {
    id: 1,
    name: 'Rahul Sharma',
    email: 'patient@cloudcare.local',
    role: 'PATIENT',
    patientId: 1,
  },
  {
    id: 2,
    name: 'Dr. Aakash Sharma',
    email: 'doctor.aakash@cloudcare.local',
    role: 'DOCTOR',
    doctorId: 1,
    specialization: 'Cardiology',
  },
  {
    id: 3,
    name: 'Dr. Neha Patel',
    email: 'doctor.neha@cloudcare.local',
    role: 'DOCTOR',
    doctorId: 2,
    specialization: 'Neurology',
  },
  {
    id: 4,
    name: 'Dr. Vikram Malhotra',
    email: 'doctor.vikram@cloudcare.local',
    role: 'DOCTOR',
    doctorId: 3,
    specialization: 'Orthopedics',
  },
  {
    id: 5,
    name: 'CloudCare Administrator',
    email: 'admin@cloudcare.local',
    role: 'ADMIN',
  },
];

export const MOCK_DOCTORS = [
  {
    id: 1,
    name: 'Dr. Aakash Sharma',
    specialization: 'Cardiology',
    availableSlots: ['09:00', '10:00', '11:00', '12:00', '14:00'],
  },
  {
    id: 2,
    name: 'Dr. Neha Patel',
    specialization: 'Neurology',
    availableSlots: ['10:00', '11:30', '13:00', '15:00', '16:00'],
  },
  {
    id: 3,
    name: 'Dr. Vikram Malhotra',
    specialization: 'Orthopedics',
    availableSlots: ['09:30', '11:00', '14:30', '16:00', '17:00'],
  },
];

export const INITIAL_APPOINTMENTS = [
  {
    id: 1,
    patientId: 1,
    patientName: 'Rahul Sharma',
    doctorId: 1,
    doctorName: 'Dr. Aakash Sharma',
    visitDate: '2026-11-22',
    slot: '10:00',
    status: 'CONFIRMED',
    notes: 'Routine cardiovascular checkup and ECG review',
  },
  {
    id: 2,
    patientId: 1,
    patientName: 'Rahul Sharma',
    doctorId: 2,
    doctorName: 'Dr. Neha Patel',
    visitDate: '2026-11-25',
    slot: '11:30',
    status: 'PENDING',
    notes: 'Consultation for recurring tension headaches',
  },
  {
    id: 3,
    patientId: 2,
    patientName: 'Priya Nair',
    doctorId: 1,
    doctorName: 'Dr. Aakash Sharma',
    visitDate: '2026-11-20',
    slot: '09:00',
    status: 'COMPLETED',
    notes: 'Post-hypertension follow-up',
  },
  {
    id: 4,
    patientId: 3,
    patientName: 'Amit Verma',
    doctorId: 1,
    doctorName: 'Dr. Aakash Sharma',
    visitDate: '2026-11-21',
    slot: '14:00',
    status: 'PENDING',
    notes: 'Initial cardiac stress assessment',
  },
  {
    id: 5,
    patientId: 1,
    patientName: 'Rahul Sharma',
    doctorId: 3,
    doctorName: 'Dr. Vikram Malhotra',
    visitDate: '2026-11-15',
    slot: '14:30',
    status: 'COMPLETED',
    notes: 'Right knee arthroscopy follow-up',
  },
];

export const INITIAL_PRESCRIPTIONS = [
  {
    id: 1,
    appointmentId: 3,
    patientId: 2,
    doctorName: 'Dr. Aakash Sharma',
    notes: 'Blood pressure stabilised at 128/82. Maintain low sodium Mediterranean diet and 30 mins brisk walking.',
    medicines: 'Amlodipine 5mg (1 tablet once daily morning after breakfast), Omega-3 1000mg (1 capsule daily)',
    createdAt: '2026-11-20',
  },
  {
    id: 2,
    appointmentId: 5,
    patientId: 1,
    doctorName: 'Dr. Vikram Malhotra',
    notes: 'Ligament healing properly. Continue knee support brace during physical activities. Mild physiotherapy exercises recommended.',
    medicines: 'Paracetamol 650mg (SOS for pain, max 2 daily), Glucosamine Chondroitin (once daily)',
    createdAt: '2026-11-15',
  },
];

export const INITIAL_DOCUMENTS = [
  {
    id: 1,
    patientId: 1,
    filename: 'Cardiology_ECG_Report_RahulSharma.pdf',
    uploadedBy: 'Dr. Aakash Sharma',
    uploadedAt: '2026-11-20',
    size: '1.4 MB',
    s3Key: 'reports/patient-1/Cardiology_ECG_Report_RahulSharma.pdf',
  },
  {
    id: 2,
    patientId: 1,
    filename: 'Comprehensive_Metabolic_Blood_Panel.pdf',
    uploadedBy: 'Dr. Aakash Sharma',
    uploadedAt: '2026-11-18',
    size: '850 KB',
    s3Key: 'reports/patient-1/Comprehensive_Metabolic_Blood_Panel.pdf',
  },
];
