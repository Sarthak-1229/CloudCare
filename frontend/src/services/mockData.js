/**
 * CloudCare Synthetic Mock Data Store
 * Matches Simplified TY CCF v3.0 schema and seed definitions.
 * Provides fallback interactivity for development and offline mode.
 */

export const MOCK_USERS = [
  {
    id: 1,
    name: 'System Administrator',
    email: 'admin@cloudcare.test',
    role: 'ADMIN',
  },
  {
    id: 2,
    name: 'Dr. Rahul Sharma',
    email: 'rahul@cloudcare.test',
    role: 'DOCTOR',
    doctorId: 1,
    specialization: 'Cardiology & Vascular Medicine',
  },
  {
    id: 3,
    name: 'Dr. Priya Mehta',
    email: 'priya@cloudcare.test',
    role: 'DOCTOR',
    doctorId: 2,
    specialization: 'Dermatology & Clinical Cosmetology',
  },
  {
    id: 4,
    name: 'Dr. Arjun Reddy',
    email: 'arjun@cloudcare.test',
    role: 'DOCTOR',
    doctorId: 3,
    specialization: 'Orthopedic & Joint Replacement',
  },
  {
    id: 5,
    name: 'Dr. Kavita Rao',
    email: 'kavita@cloudcare.test',
    role: 'DOCTOR',
    doctorId: 4,
    specialization: 'Pediatrics & Child Wellness',
  },
  {
    id: 6,
    name: 'Dr. Sanjay Verma',
    email: 'sanjay@cloudcare.test',
    role: 'DOCTOR',
    doctorId: 5,
    specialization: 'Neurology & Cognitive Health',
  },
  {
    id: 7,
    name: 'Aarav Patil',
    email: 'aarav@cloudcare.test',
    role: 'PATIENT',
    patientId: 1,
  },
  {
    id: 8,
    name: 'Sneha Joshi',
    email: 'sneha@cloudcare.test',
    role: 'PATIENT',
    patientId: 2,
  },
  {
    id: 9,
    name: 'Vikram Malhotra',
    email: 'vikram@cloudcare.test',
    role: 'PATIENT',
    patientId: 3,
  },
];

export const MOCK_DOCTORS = [
  {
    id: 1,
    name: 'Dr. Rahul Sharma',
    specialization: 'Cardiology & Vascular Medicine',
    availableSlots: ['09:00', '10:00', '11:00', '12:00', '14:00'],
  },
  {
    id: 2,
    name: 'Dr. Priya Mehta',
    specialization: 'Dermatology & Clinical Cosmetology',
    availableSlots: ['10:00', '11:30', '13:00', '15:00', '16:00'],
  },
  {
    id: 3,
    name: 'Dr. Arjun Reddy',
    specialization: 'Orthopedic & Joint Replacement',
    availableSlots: ['09:30', '11:00', '14:30', '16:00', '17:00'],
  },
  {
    id: 4,
    name: 'Dr. Kavita Rao',
    specialization: 'Pediatrics & Child Wellness',
    availableSlots: ['09:00', '10:30', '12:00', '15:30', '17:00'],
  },
  {
    id: 5,
    name: 'Dr. Sanjay Verma',
    specialization: 'Neurology & Cognitive Health',
    availableSlots: ['10:00', '11:00', '14:00', '15:30', '16:30'],
  },
];

export const INITIAL_APPOINTMENTS = [
  {
    id: 1,
    patientId: 1,
    patientName: 'Aarav Patil',
    doctorId: 1,
    doctorName: 'Dr. Rahul Sharma',
    visitDate: '2027-01-15',
    slot: '10:00',
    status: 'COMPLETED',
    notes: 'Routine cardiovascular checkup and ECG review',
  },
  {
    id: 2,
    patientId: 2,
    patientName: 'Sneha Joshi',
    doctorId: 2,
    doctorName: 'Dr. Priya Mehta',
    visitDate: '2027-01-16',
    slot: '11:00',
    status: 'COMPLETED',
    notes: 'Consultation for seasonal eczema review',
  },
  {
    id: 3,
    patientId: 3,
    patientName: 'Vikram Malhotra',
    doctorId: 3,
    doctorName: 'Dr. Arjun Reddy',
    visitDate: '2027-02-10',
    slot: '09:30',
    status: 'CONFIRMED',
    notes: 'Post-arthroscopy recovery review',
  },
  {
    id: 4,
    patientId: 1,
    patientName: 'Aarav Patil',
    doctorId: 1,
    doctorName: 'Dr. Rahul Sharma',
    visitDate: '2027-03-01',
    slot: '10:30',
    status: 'PENDING',
    notes: 'Cardiology follow-up consultation',
  },
];

export const INITIAL_PRESCRIPTIONS = [
  {
    id: 1,
    appointmentId: 1,
    patientId: 1,
    doctorName: 'Dr. Rahul Sharma',
    notes: 'Resting ECG normal. Recommended low-sodium diet and 30-minute daily cardio.',
    medicines: 'Atorvastatin 10mg OD (Night), Aspirin 75mg OD (Post Lunch)',
    createdAt: '2027-01-15',
  },
  {
    id: 2,
    appointmentId: 2,
    patientId: 2,
    doctorName: 'Dr. Priya Mehta',
    notes: 'Mild seasonal eczema on left forearm. Avoid perfumed soaps and hot water.',
    medicines: 'Hydrocortisone cream 1% topical, Cetirizine 10mg OD as needed',
    createdAt: '2027-01-16',
  },
];

export const INITIAL_DOCUMENTS = [
  {
    id: 1,
    patientId: 1,
    filename: 'Cardiology_ECG_Report_AaravPatil.pdf',
    uploadedBy: 'Dr. Rahul Sharma',
    uploadedAt: '2027-01-15',
    size: '1.4 MB',
    s3Key: 'reports/Cardiology_ECG_Report_AaravPatil.pdf',
  },
];
