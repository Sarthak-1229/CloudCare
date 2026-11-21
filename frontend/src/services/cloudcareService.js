import api from './api.js';
import {
  INITIAL_APPOINTMENTS,
  INITIAL_PRESCRIPTIONS,
  INITIAL_DOCUMENTS,
  MOCK_DOCTORS,
} from './mockData.js';

// Local storage keys for persistent mock store during interactive review
const APPT_KEY = 'cloudcare_mock_appointments';
const PRES_KEY = 'cloudcare_mock_prescriptions';
const DOCS_KEY = 'cloudcare_mock_documents';

const getStored = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const setStored = (key, val) => {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch {
    // Ignore storage errors
  }
};

export const cloudcareService = {
  // Fetch doctors list
  async getDoctors() {
    try {
      const res = await api.get('/doctors');
      if (res.data?.data) return res.data.data;
    } catch {
      // Fallback
    }
    return MOCK_DOCTORS;
  },

  // Fetch appointments (filtered by caller role)
  async getAppointments(user) {
    try {
      const res = await api.get('/appointments');
      if (res.data?.data) return res.data.data;
    } catch {
      // Fallback
    }

    const appts = getStored(APPT_KEY, INITIAL_APPOINTMENTS);
    if (!user) return appts;
    if (user.role === 'ADMIN') return appts;
    if (user.role === 'DOCTOR') {
      return appts.filter((a) => a.doctorId === (user.doctorId || user.id));
    }
    return appts.filter((a) => a.patientId === (user.patientId || user.id));
  },

  // Book an appointment (Patient)
  async bookAppointment({ doctorId, visitDate, slot, notes, user }) {
    try {
      const res = await api.post('/appointments', { doctorId, visitDate, slot });
      if (res.data?.data) return res.data.data;
    } catch {
      // Fallback
    }

    const appts = getStored(APPT_KEY, INITIAL_APPOINTMENTS);
    const doctor = MOCK_DOCTORS.find((d) => d.id === Number(doctorId)) || {
      id: doctorId,
      name: 'Dr. Assigned Specialist',
    };

    // Check slot collision
    const collision = appts.some(
      (a) => a.doctorId === Number(doctorId) && a.visitDate === visitDate && a.slot === slot
    );
    if (collision) {
      throw new Error(`Slot ${slot} on ${visitDate} is already booked for ${doctor.name}.`);
    }

    const newAppt = {
      id: Date.now(),
      patientId: user?.patientId || user?.id || 1,
      patientName: user?.name || 'Patient User',
      doctorId: Number(doctorId),
      doctorName: doctor.name,
      visitDate,
      slot,
      status: 'PENDING',
      notes: notes || 'General Consultation',
    };

    const updated = [newAppt, ...appts];
    setStored(APPT_KEY, updated);
    return newAppt;
  },

  // Update appointment status (Doctor)
  async updateAppointmentStatus(appointmentId, status) {
    try {
      const res = await api.patch(`/appointments/${appointmentId}/status`, { status });
      if (res.data?.data) return res.data.data;
    } catch {
      // Fallback
    }

    const appts = getStored(APPT_KEY, INITIAL_APPOINTMENTS);
    const updated = appts.map((a) => (a.id === appointmentId ? { ...a, status } : a));
    setStored(APPT_KEY, updated);
    return updated.find((a) => a.id === appointmentId);
  },

  // Add prescription / clinical notes (Doctor)
  async addPrescription({ appointmentId, notes, medicines, patientId, doctorName }) {
    try {
      const res = await api.post('/prescriptions', { appointmentId, notes, medicines });
      if (res.data?.data) return res.data.data;
    } catch {
      // Fallback
    }

    const list = getStored(PRES_KEY, INITIAL_PRESCRIPTIONS);
    const newPrescription = {
      id: Date.now(),
      appointmentId,
      patientId: patientId || 1,
      doctorName: doctorName || 'Attending Physician',
      notes,
      medicines: medicines || '',
      createdAt: new Date().toISOString().split('T')[0],
    };
    const updated = [newPrescription, ...list];
    setStored(PRES_KEY, updated);
    return newPrescription;
  },

  // Get prescriptions
  async getPrescriptions(user) {
    try {
      const res = await api.get('/prescriptions');
      if (res.data?.data) return res.data.data;
    } catch {
      // Fallback
    }

    const list = getStored(PRES_KEY, INITIAL_PRESCRIPTIONS);
    if (!user || user.role === 'ADMIN') return list;
    if (user.role === 'DOCTOR') return list;
    return list.filter((p) => p.patientId === (user.patientId || user.id));
  },

  // Get documents (Patient)
  async getDocuments(user) {
    try {
      const res = await api.get('/documents');
      if (res.data?.data) return res.data.data;
    } catch {
      // Fallback
    }

    const list = getStored(DOCS_KEY, INITIAL_DOCUMENTS);
    if (!user || user.role === 'ADMIN') return list;
    return list.filter((d) => d.patientId === (user.patientId || user.id));
  },

  // Upload synthetic report document (Doctor)
  async uploadDocument({ appointmentId, patientId, filename, file, doctorName }) {
    try {
      const formData = new FormData();
      formData.append('appointmentId', appointmentId);
      if (file) formData.append('file', file);
      const res = await api.post('/documents', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (res.data?.data) return res.data.data;
    } catch {
      // Fallback
    }

    const list = getStored(DOCS_KEY, INITIAL_DOCUMENTS);
    const newDoc = {
      id: Date.now(),
      patientId: patientId || 1,
      filename: filename || file?.name || `Diagnostic_Report_${Date.now()}.pdf`,
      uploadedBy: doctorName || 'Dr. Assigned Specialist',
      uploadedAt: new Date().toISOString().split('T')[0],
      size: file ? `${(file.size / 1024 / 1024).toFixed(1)} MB` : '1.2 MB',
      s3Key: `reports/patient-${patientId || 1}/${filename || 'report.pdf'}`,
    };
    const updated = [newDoc, ...list];
    setStored(DOCS_KEY, updated);
    return newDoc;
  },

  // Download document (Patient only)
  async downloadDocument(docId, filename) {
    try {
      const res = await api.get(`/documents/${docId}/download`, {
        responseType: 'blob',
      });
      const blob = new Blob([res.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename || `CloudCare_Report_${docId}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
      return true;
    } catch {
      // In mock/offline mode, generate a lightweight valid synthetic PDF blob
      const dummyPdfContent = `%PDF-1.4
1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj
2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj
3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >> endobj
4 0 obj << /Length 120 >> stream
BT
/F1 18 Tf
50 720 Td
(CloudCare - Synthetic Patient Report) Tj
/F1 12 Tf
0 -30 Td
(Document: ${filename || 'Clinical_Report.pdf'}) Tj
0 -20 Td
(Verified synthetic medical document for Cloud Computing Mini-Project demo.) Tj
ET
endstream
endobj
5 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj
xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000244 00000 n 
0000000414 00000 n 
trailer << /Size 6 /Root 1 0 R >>
startxref
498
%%EOF`;
      const blob = new Blob([dummyPdfContent], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename || `CloudCare_Report_${docId}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
      return true;
    }
  },

  // Admin dashboard summary counts
  async getDashboardSummary() {
    try {
      const res = await api.get('/dashboard');
      if (res.data?.data) return res.data.data;
    } catch {
      // Fallback
    }

    const appts = getStored(APPT_KEY, INITIAL_APPOINTMENTS);
    return {
      patients: 24,
      doctors: MOCK_DOCTORS.length,
      appointments: appts.length,
    };
  },
};
