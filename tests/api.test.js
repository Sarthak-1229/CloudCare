const assert = require('node:assert/strict');
const { once } = require('node:events');
const { after, before, test } = require('node:test');
const { createApp } = require('../backend/app');

let server;
let baseUrl;
let patientToken;
let doctorToken;
let adminToken;
let appointmentId;
let reportId;

before(async () => {
  server = createApp().listen(0, '127.0.0.1');
  await once(server, 'listening');
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
  await new Promise((resolve, reject) => {
    server.close((err) => (err ? reject(err) : resolve()));
  });
});

test('TC01: GET /api/health returns 200 ok', async () => {
  const res = await fetch(`${baseUrl}/api/health`);
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.status, 'ok');
});

test('TC02: POST /api/auth/login succeeds with valid patient credentials', async () => {
  const res = await fetch(`${baseUrl}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'aarav@cloudcare.test', password: 'Patient@123' })
  });
  assert.equal(res.status, 200);
  const json = await res.json();
  assert.ok(json.data.token);
  assert.equal(json.data.user.role, 'PATIENT');
  patientToken = json.data.token;
});

test('TC03: POST /api/auth/login fails with invalid credentials', async () => {
  const res = await fetch(`${baseUrl}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'aarav@cloudcare.test', password: 'WrongPassword' })
  });
  assert.equal(res.status, 401);
  const json = await res.json();
  assert.equal(json.error.code, 'INVALID_CREDENTIALS');
});

test('TC04: POST /api/auth/register creates a new patient account', async () => {
  const res = await fetch(`${baseUrl}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Rohan Sharma',
      email: 'rohan.sharma@cloudcare.test',
      password: 'SecurePassword123'
    })
  });
  assert.equal(res.status, 201);
  const json = await res.json();
  assert.equal(json.data.role, 'PATIENT');
  assert.equal(json.data.name, 'Rohan Sharma');
});

test('Login doctor and admin accounts for downstream testing', async () => {
  const docRes = await fetch(`${baseUrl}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'rahul@cloudcare.test', password: 'Doctor@123' })
  });
  assert.equal(docRes.status, 200);
  const docJson = await docRes.json();
  doctorToken = docJson.data.token;

  const adminRes = await fetch(`${baseUrl}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@cloudcare.test', password: 'Admin@123' })
  });
  assert.equal(adminRes.status, 200);
  const adminJson = await adminRes.json();
  adminToken = adminJson.data.token;
});

test('TC05: POST /api/appointments creates a new appointment in PENDING status', async () => {
  const res = await fetch(`${baseUrl}/api/appointments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${patientToken}`
    },
    body: JSON.stringify({
      doctorId: 1,
      visitDate: '2027-02-20',
      slot: '14:30'
    })
  });
  assert.equal(res.status, 201);
  const json = await res.json();
  assert.equal(json.data.status, 'PENDING');
  assert.equal(json.data.visitDate, '2027-02-20');
  assert.equal(json.data.slot, '14:30');
  appointmentId = json.data.id;
});

test('TC06: POST /api/appointments returns 409 SLOT_CONFLICT on duplicate slot booking', async () => {
  const res = await fetch(`${baseUrl}/api/appointments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${patientToken}`
    },
    body: JSON.stringify({
      doctorId: 1,
      visitDate: '2027-02-20',
      slot: '14:30'
    })
  });
  assert.equal(res.status, 409);
  const json = await res.json();
  assert.equal(json.error.code, 'SLOT_CONFLICT');
});

test('TC07: GET /api/appointments filters by assigned doctor', async () => {
  const res = await fetch(`${baseUrl}/api/appointments`, {
    headers: { Authorization: `Bearer ${doctorToken}` }
  });
  assert.equal(res.status, 200);
  const json = await res.json();
  assert.ok(Array.isArray(json.data));
  for (const appt of json.data) {
    assert.equal(appt.doctorId, 1);
  }
});

test('TC08: PATCH /api/appointments/:id/status updates status', async () => {
  const res = await fetch(`${baseUrl}/api/appointments/${appointmentId}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${doctorToken}`
    },
    body: JSON.stringify({ status: 'CONFIRMED' })
  });
  assert.equal(res.status, 200);
  const json = await res.json();
  assert.equal(json.data.status, 'CONFIRMED');
});

test('TC09: POST /api/appointments/:id/prescription adds prescription', async () => {
  const res = await fetch(`${baseUrl}/api/appointments/${appointmentId}/prescription`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${doctorToken}`
    },
    body: JSON.stringify({
      notes: 'Follow low sodium diet and take medications on time.',
      medicines: 'Aspirin 75mg daily'
    })
  });
  assert.equal(res.status, 201);
  const json = await res.json();
  assert.equal(json.data.appointmentId, appointmentId);
  assert.equal(json.data.medicines, 'Aspirin 75mg daily');
});

test('TC10: POST /api/reports/upload uploads a synthetic PDF report', async () => {
  const formData = new FormData();
  formData.append('appointmentId', String(appointmentId));
  const pdfBytes = Buffer.from('%PDF-1.4\n%Synthetic test report\n%%EOF');
  formData.append('file', new Blob([pdfBytes], { type: 'application/pdf' }), 'test-report.pdf');

  const res = await fetch(`${baseUrl}/api/reports/upload`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${doctorToken}` },
    body: formData
  });
  assert.equal(res.status, 201);
  const json = await res.json();
  assert.ok(json.data.id);
  assert.equal(json.data.filename, 'test-report.pdf');
  reportId = json.data.id;
});

test('TC11: GET /api/reports/:id/download downloads own report', async () => {
  const res = await fetch(`${baseUrl}/api/reports/${reportId}/download`, {
    headers: { Authorization: `Bearer ${patientToken}` }
  });
  assert.equal(res.status, 200);
  assert.equal(res.headers.get('content-type'), 'application/pdf');
  const buffer = await res.arrayBuffer();
  assert.ok(buffer.byteLength > 0);
});

test('TC12: GET /api/reports/:id/download denies another patient access', async () => {
  // Login second patient
  const p2Res = await fetch(`${baseUrl}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'sneha@cloudcare.test', password: 'Patient@123' })
  });
  assert.equal(p2Res.status, 200);
  const p2Json = await p2Res.json();

  const res = await fetch(`${baseUrl}/api/reports/${reportId}/download`, {
    headers: { Authorization: `Bearer ${p2Json.data.token}` }
  });
  assert.equal(res.status, 404);
});

test('TC13: Unauthenticated request to protected route returns 401', async () => {
  const res = await fetch(`${baseUrl}/api/appointments`);
  assert.equal(res.status, 401);
  const json = await res.json();
  assert.equal(json.error.code, 'UNAUTHENTICATED');
});

test('TC14: Patient accessing admin summary returns 403', async () => {
  const res = await fetch(`${baseUrl}/api/admin/summary`, {
    headers: { Authorization: `Bearer ${patientToken}` }
  });
  assert.equal(res.status, 403);
  const json = await res.json();
  assert.equal(json.error.code, 'FORBIDDEN');
});

test('TC15: Uploading file larger than 5 MiB returns 413', async () => {
  const formData = new FormData();
  formData.append('appointmentId', String(appointmentId));
  const bigBytes = Buffer.alloc(5 * 1024 * 1024 + 1024, '%');
  formData.append('file', new Blob([bigBytes], { type: 'application/pdf' }), 'huge.pdf');

  const res = await fetch(`${baseUrl}/api/reports/upload`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${doctorToken}` },
    body: formData
  });
  assert.equal(res.status, 413);
  const json = await res.json();
  assert.equal(json.error.code, 'FILE_TOO_LARGE');
});

test('TC16: Uploading non-PDF file returns 415', async () => {
  const formData = new FormData();
  formData.append('appointmentId', String(appointmentId));
  const nonPdf = Buffer.from('Just plain text file, not a PDF');
  formData.append('file', new Blob([nonPdf], { type: 'text/plain' }), 'note.txt');

  const res = await fetch(`${baseUrl}/api/reports/upload`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${doctorToken}` },
    body: formData
  });
  assert.equal(res.status, 415);
  const json = await res.json();
  assert.equal(json.error.code, 'UNSUPPORTED_FILE_TYPE');
});

test('TC19: Admin summary returns patient, doctor and appointment counts', async () => {
  const res = await fetch(`${baseUrl}/api/admin/summary`, {
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  assert.equal(res.status, 200);
  const json = await res.json();
  assert.ok(typeof json.data.patients === 'number');
  assert.ok(typeof json.data.doctors === 'number');
  assert.ok(typeof json.data.appointments === 'number');
});
