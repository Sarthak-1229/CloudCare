# CloudCare API contract

This is the Phase 1 handoff for Antigravity, Shreya and Anushka. It follows the Simplified TY CCF v3.0 manuals. The core demo uses one EC2 instance on port 3000 with private RDS and private S3. ALB and Auto Scaling are optional extensions.

## Request and response conventions

- Base path `/api`. Use relative URLs in the frontend and forward `/api` to `http://127.0.0.1:3000` through the local Vite proxy.
- JSON field names are camelCase. IDs are positive integers. Dates use `YYYY-MM-DD` and appointment slots use 24-hour `HH:mm` in the clinic's Mumbai time zone (`Asia/Kolkata`).
- Protected routes use `Authorization: Bearer <token>`. The server enforces the role and record ownership on each request. Roles are `PATIENT`, `DOCTOR`, and `ADMIN`.
- Business routes return `{ "data": ... }` on success, with `[]` for empty lists. Uploads use multipart form data. Downloads return the PDF body as an attachment and use `Cache-Control: no-store`.
- Errors use `{ "error": { "code": "NOT_FOUND", "message": "Route not found." } }`. Branch client behavior on HTTP status or `error.code`.

| HTTP status | Error codes and meaning |
| --- | --- |
| `400` | `VALIDATION_ERROR` for invalid input, `INVALID_STATUS_TRANSITION` for an unsupported appointment state change |
| `401` | `UNAUTHENTICATED` for a missing, invalid or expired token, `INVALID_CREDENTIALS` for rejected login |
| `403` | `FORBIDDEN` when the authenticated role lacks permission |
| `404` | `NOT_FOUND` for unknown routes and records outside the caller's permitted scope |
| `409` | `EMAIL_CONFLICT` for duplicate registration, `SLOT_CONFLICT` for a booked doctor/date/slot |
| `413` | `FILE_TOO_LARGE` for a report over 5 MiB |
| `415` | `UNSUPPORTED_FILE_TYPE` for an invalid report PDF |
| `500` | `INTERNAL_ERROR` with a generic message |
| `503` | `NOT_READY` when database readiness is unavailable |

## Available in Phase 1

| Method and path | Access | Response |
| --- | --- | --- |
| `GET /api/health` | Public | `200` with `{ "status": "ok" }`. This liveness response is independent of MySQL and S3. |
| `GET /api/ready` | Public | `503` with `NOT_READY` in Phase 1. Phase 2 can return `200` with `{ "status": "ready" }` after a successful MySQL probe. |

## Phase 2 endpoints for frontend and schema review

The development server currently returns `404 NOT_FOUND` for these paths. Confirm the request and response fields before wiring the frontend to them.

| Method and path | Access | Request | Success `data` |
| --- | --- | --- | --- |
| `POST /api/auth/register` | Public, creates a patient | JSON `name`, `email`, `password`. Role is assigned by the server. | `201` with a user |
| `POST /api/auth/login` | Public, all three roles | JSON `email`, `password`. | `200` with `{ token, expiresIn, user }`. `expiresIn` is the token lifetime in seconds. |
| `GET /api/me` | Authenticated | No body. | `200` with the signed-in user |
| `GET /api/doctors` | Authenticated | No body. | `200` with a list of doctors |
| `GET /api/appointments` | Authenticated | No body. Patients see their own bookings, doctors see assigned bookings, and admins can see all bookings. | `200` with a list of appointments |
| `POST /api/appointments` | Patient | JSON `doctorId`, `visitDate`, `slot`. Patient ID comes from the authenticated account. | `201` with the new `PENDING` appointment |
| `PATCH /api/appointments/:id/status` | Assigned doctor or admin | JSON `status`. `PENDING` can become `CONFIRMED` or `CANCELLED`. `CONFIRMED` can become `COMPLETED` or `CANCELLED`. | `200` with the updated appointment |
| `POST /api/appointments/:id/prescription` | Assigned doctor | JSON `notes`, `medicines`. Both are strings. Notes may be saved on their own by sending an empty `medicines` string. | `201` with a prescription |
| `GET /api/prescriptions` | Patient or doctor | No body. Patients see their own records and doctors see records for their assigned appointments. | `200` with a list of prescriptions |
| `POST /api/reports/upload` | Assigned doctor | Multipart `appointmentId` and one `file`. Synthetic PDF only, up to 5 MiB. The server validates the file contents, derives the patient from the appointment and generates the S3 key. | `201` with a report |
| `GET /api/reports` | Patient | No body. Lists the signed-in patient's reports. | `200` with a list of reports |
| `GET /api/reports/:id/download` | Owning patient | No body. The server verifies ownership before fetching from the private bucket. | `200` with an `application/pdf` attachment |
| `GET /api/admin/summary` | Admin | No body. | `200` with `{ patients, doctors, appointments }` as integer counts |

### Response fields

| Record | Fields |
| --- | --- |
| User | `id`, `name`, `email`, `role` |
| Doctor | `id` (doctor ID), `name`, `specialization` |
| Appointment | `id`, `patientId`, `patientName`, `doctorId`, `doctorName`, `visitDate`, `slot`, `status` |
| Prescription | `id`, `appointmentId`, `notes`, `medicines` |
| Report | `id`, `filename` |

### SQL handoff

- Use the v3.0 tables `users`, `patients`, `doctors`, `appointments`, `prescriptions` and `documents`. Appointments use `visit_date` and `slot`. Prescriptions store `notes` and `medicines` by `appointment_id`.
- Confirm unique `users.email`, unique profile `user_id` values, foreign keys and a unique `(doctor_id, visit_date, slot)` constraint before implementing booking. With that constraint, cancelled appointments continue to reserve their original slot. Confirm this behavior at schema review.
- `documents.patient_id` links to the owning patient and `uploaded_by` links to the uploader's user account. `s3_key` stays server-side. Seed doctor and admin identities privately with bcrypt hashes and use synthetic data throughout.
- MySQL access will use parameterized queries and verified TLS for RDS. Reports will use the EC2 IAM instance profile and private `reports/` keys. Store document metadata in MySQL and PDF bytes in S3.
