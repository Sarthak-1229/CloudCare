
# CloudCare - Test Cases

## Project
CloudCare - Cloud-Based Hospital Management System

## Purpose
To verify the functionality, security and integration of the CloudCare application.

All test data must be synthetic.

## Test Cases

| Test ID | Test Scenario | Expected Result | Status |
|---|---|---|---|
| TC01 | Check application health endpoint | API returns HTTP 200 and status "ok" | Pending |
| TC02 | Login with valid patient credentials | Patient login succeeds and JWT token is generated | Pending |
| TC03 | Login with invalid credentials | API returns HTTP 401 | Pending |
| TC04 | Register a new patient | Patient account is created successfully | Pending |
| TC05 | Book an appointment with valid doctor, date and slot | Appointment is created with PENDING status | Pending |
| TC06 | Book an already occupied doctor/date/slot | API returns HTTP 409 SLOT_CONFLICT | Pending |
| TC07 | Doctor views assigned appointments | Only appointments assigned to that doctor are displayed | Pending |
| TC08 | Doctor updates appointment status | Appointment status is updated successfully | Pending |
| TC09 | Doctor adds prescription or medical note | Prescription is saved successfully | Pending |
| TC10 | Doctor uploads a valid synthetic PDF | PDF is stored in the private S3 bucket | Pending |
| TC11 | Patient accesses their own report | Patient can download their own PDF | Pending |
| TC12 | Patient tries to access another patient's report | Access is denied | Pending |
| TC13 | Unauthenticated user accesses a protected API | API returns HTTP 401 | Pending |
| TC14 | Patient tries to access an admin-only API | API returns HTTP 403 | Pending |
| TC15 | Upload a file larger than 5 MiB | API returns HTTP 413 | Pending |
| TC16 | Upload an unsupported file type | API returns HTTP 415 | Pending |
| TC17 | Verify RDS network security | RDS is private and accepts database traffic only from the application security group | Pending |
| TC18 | Verify S3 bucket security | Block Public Access is enabled and objects are not publicly accessible | Pending |
| TC19 | Admin views dashboard summary | Patient, doctor and appointment counts are displayed | Pending |

## Test Data

Use fictional records only:

- Patient: Aarav Patil
- Patient: Sneha Joshi
- Doctor: Dr. Rahul Sharma
- Doctor: Dr. Priya Mehta
- Admin: CloudCare Admin

## Sample PDF Files

Prepare two small fictional PDF files for testing report upload and download.

1. sample-report-01.pdf
2. sample-prescription-01.pdf

Do not use real patient reports or personal information.

## Test Execution Notes

- Execute tests after the backend and AWS integration are ready.
- Record actual results as PASS or FAIL.
- Capture screenshots for important successful and failed tests.
- Report failures with the test ID and exact error message.
- Do not mark a test as PASS without executing it.

## Result Summary

Total test cases: 19

Passed: Pending

Failed: Pending

Not Executed: 19
