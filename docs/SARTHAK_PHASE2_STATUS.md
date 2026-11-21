# Sarthak Phase 2 Status & Tracking

| Task | Description | Status | Evidence | Dependency |
|---|---|---|---|---|
| S7 | Build core application | COMPLETE | Full Express API implemented in `backend/` (`/api/auth`, `/api/doctors`, `/api/appointments`, `/api/prescriptions`, `/api/reports`, `/api/admin`). 24/24 backend integration tests passing (`node --test tests/foundation.test.js tests/api.test.js`). 5/5 frontend tests passing. Vite frontend built into `frontend/dist`. | None |
| S8 | Launch EC2 | COMPLETE | Instance `i-054768b5baf83e81e` (`cloudcare-app`) launched in `subnet-088918b18c8e71b90` (`cloudcare-public-a`, `ap-south-1a`). Public IPv4: `43.205.194.94`. Private IPv4: `10.20.1.72`. Attached to `sg-075ff8633ab726994` and IAM profile `cloudcare-app-profile`. SSM Online. | Sarthak approval (Granted) |
| S9 | Install and deploy Node app | COMPLETE | Node.js v22.23.5, npm 10.9.9, MariaDB client, Git installed on EC2. Repo cloned, dependencies installed, Vite frontend built, systemd service `cloudcare.service` enabled and active. Live URL verified: `http://43.205.194.94:3000/` returns HTTP 200, `/api/health` returns `{"status":"ok"}`. | S7, S8 |
| S10 | Connect RDS and S3 | IN PROGRESS | S3 IAM access verified via PutObject/GetObject probe on `cloudcare-docs-anushka-unique-03/reports/`. RDS network connectivity verified (TCP 3306 open from EC2 to `cloudcare-db.cbu82mmyc950.ap-south-1.rds.amazonaws.com`). Awaiting master DB password from Shreya to apply `docs/sql/schema.sql` and `docs/sql/seed.sql`. | Shreya master DB password |
| S11 | Publish stable release | COMPLETE | Working commit `b5cf0f1` pushed to `origin/main`. All tests passing. EC2 live URL operational. | S7–S10 |
