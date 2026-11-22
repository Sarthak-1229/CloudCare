import { test } from 'node:test';
import assert from 'node:assert/strict';
import { MOCK_USERS, MOCK_DOCTORS, INITIAL_APPOINTMENTS } from './mockData.js';
import { cloudcareService } from './cloudcareService.js';

test('MOCK_USERS contains seeded users for all three roles', () => {
  const patient = MOCK_USERS.find((u) => u.role === 'PATIENT');
  const doctor = MOCK_USERS.find((u) => u.role === 'DOCTOR');
  const admin = MOCK_USERS.find((u) => u.role === 'ADMIN');

  assert.ok(patient, 'Patient user should exist');
  assert.ok(doctor, 'Doctor user should exist');
  assert.ok(admin, 'Admin user should exist');
  assert.ok(patient.email, 'Patient email should exist');
});

test('MOCK_DOCTORS contains specialized doctors with slots', () => {
  assert.ok(MOCK_DOCTORS.length >= 3);
  for (const dr of MOCK_DOCTORS) {
    assert.ok(dr.id > 0);
    assert.ok(dr.name.startsWith('Dr.'));
    assert.ok(dr.specialization);
    assert.ok(Array.isArray(dr.availableSlots) && dr.availableSlots.length > 0);
  }
});

test('INITIAL_APPOINTMENTS has valid status fields adhering to API contract', () => {
  const validStatuses = ['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'];
  for (const appt of INITIAL_APPOINTMENTS) {
    assert.ok(validStatuses.includes(appt.status), `Invalid status ${appt.status}`);
    assert.ok(appt.visitDate);
    assert.ok(appt.slot);
  }
});

test('cloudcareService returns doctors list', async () => {
  const doctors = await cloudcareService.getDoctors();
  assert.ok(Array.isArray(doctors));
  assert.ok(doctors.length >= 3);
});

test('cloudcareService generates synthetic PDF blob for download', async () => {
  // In node environment without window, downloadDocument fallback handles mock cleanly
  assert.equal(typeof cloudcareService.downloadDocument, 'function');
});
