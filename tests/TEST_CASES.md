# CloudCare - Test Cases (Execution Results)

## Project
CloudCare - Cloud-Based Hospital Management System (Simplified TY CCF Edition v3.0)

## Purpose
To verify the functionality, security and integration of the CloudCare application across the public EC2 host, private RDS MySQL instance, and private S3 bucket.

All test data is strictly synthetic. Tested against live EC2 deployment at `http://43.205.194.94:3000`.

---

## Test Cases & Live Execution Evidence

| Test ID | Test Scenario | Expected Result | Status | Actual Live Evidence (from `http://43.205.194.94:3000`) |
|---|---|---|---|---|
| **TC01** | Check application health endpoint | API returns HTTP 200 and status "ok" | **PASS** | `GET /api/health` returned HTTP 200: `{"status":"ok"}`. |
| **TC02** | Login with valid patient credentials | Patient login succeeds and JWT token is generated | **PASS** | `POST /api/auth/login` with `aarav@cloudcare.test` returned HTTP 200 with JWT token for user Aarav Patil (`role: PATIENT`). |
| **TC03** | Login with invalid credentials | API returns HTTP 401 | **PASS** | `POST /api/auth/login` with wrong password returned HTTP 401: `{"error":{"code":"INVALID_CREDENTIALS"}}`. |
| **TC04** | Register a new patient | Patient account is created successfully | **PASS** | `POST /api/auth/register` returned HTTP 201: created patient record with role `PATIENT`. |
| **TC05** | Book an appointment with valid doctor, date and slot | Appointment is created with PENDING status | **PASS** | `POST /api/appointments` returned HTTP 201: created appointment with `status: "PENDING"`. |
| **TC06** | Book an already occupied doctor/date/slot | API returns HTTP 409 SLOT_CONFLICT | **PASS** | `POST /api/appointments` on duplicate `(doctor_id, visit_date, slot)` returned HTTP 409: `{"error":{"code":"SLOT_CONFLICT"}}`. |
| **TC07** | Doctor views assigned appointments | Only appointments assigned to that doctor are displayed | **PASS** | `GET /api/appointments` with Dr. Rahul Sharma's token returned HTTP 200 with appointments assigned strictly to doctor ID 1. |
| **TC08** | Doctor updates appointment status | Appointment status is updated successfully | **PASS** | `PATCH /api/appointments/:id/status` returned HTTP 200: updated appointment status from `PENDING` to `CONFIRMED`. |
| **TC09** | Doctor adds prescription or medical note | Prescription is saved successfully | **PASS** | `POST /api/appointments/:id/prescription` returned HTTP 201: saved notes and medicines in MySQL `prescriptions` table. |
| **TC10** | Doctor uploads a valid synthetic PDF | PDF is stored in the private S3 bucket | **PASS** | `POST /api/reports/upload` returned HTTP 201: synthetic PDF uploaded to `s3://cloudcare-docs-anushka-unique-03/reports/` with metadata in MySQL `documents` table. |
| **TC11** | Patient accesses their own report | Patient can download their own PDF | **PASS** | `GET /api/reports/:id/download` by owning patient returned HTTP 200 with `Content-Type: application/pdf` and matching file stream. |
| **TC12** | Patient tries to access another patient's report | Access is denied | **PASS** | `GET /api/reports/:id/download` with non-owning patient token returned HTTP 404 (resource inaccessible/hidden per security design). |
| **TC13** | Unauthenticated user accesses a protected API | API returns HTTP 401 | **PASS** | `GET /api/appointments` without Bearer token returned HTTP 401: `{"error":{"code":"UNAUTHENTICATED"}}`. |
| **TC14** | Patient tries to access an admin-only API | API returns HTTP 403 | **PASS** | `GET /api/admin/summary` with patient token returned HTTP 403: `{"error":{"code":"FORBIDDEN"}}`. |
| **TC15** | Upload a file larger than 5 MiB | API returns HTTP 413 | **PASS** | `POST /api/reports/upload` with > 5 MiB payload returned HTTP 413: `{"error":{"code":"FILE_TOO_LARGE"}}`. |
| **TC16** | Upload an unsupported file type | API returns HTTP 415 | **PASS** | `POST /api/reports/upload` with non-PDF text file returned HTTP 415: `{"error":{"code":"UNSUPPORTED_FILE_TYPE"}}`. |
| **TC17** | Verify RDS network security | RDS is private and accepts database traffic only from the application security group | **PASS** | Verified via AWS CLI: `PubliclyAccessible: false`. Inbound MySQL 3306 restricted strictly to source security group `sg-075ff8633ab726994` (`cloudcare-app-sg`). No public CIDRs. |
| **TC18** | Verify S3 bucket security | Block Public Access is enabled and objects are not publicly accessible | **PASS** | Verified via AWS CLI: `cloudcare-docs-anushka-unique-03` has all 4 Block Public Access flags `true`. Default SSE-S3 encryption `AES256` enabled. |
| **TC19** | Admin views dashboard summary | Patient, doctor and appointment counts are displayed | **PASS** | `GET /api/admin/summary` with admin token returned HTTP 200: `{"data":{"patients":4,"doctors":2,"appointments":4}}`. |

---

## Result Summary

- **Total Test Cases**: 19
- **Passed**: 19
- **Failed**: 0
- **Not Executed**: 0
- **Test Success Rate**: 100%
