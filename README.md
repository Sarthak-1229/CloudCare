# CloudCare — Cloud-Based Hospital Management System
**TY Cloud Computing Fundamentals (CCF) Mini-Project | Simplified Architecture v3.0**

[![Node.js Tests](https://img.shields.io/badge/Node.js%20Tests-24%20Passing-brightgreen)]()
[![Frontend Tests](https://img.shields.io/badge/Frontend%20Tests-5%20Passing-brightgreen)]()
[![Cloud Acceptance Tests](https://img.shields.io/badge/Acceptance%20Tests-19%2F19%20PASS-success)]()
[![AWS Region](https://img.shields.io/badge/AWS%20Region-ap--south--1-orange)]()

---

## 🌐 Live Deployment
- **Application URL**: [http://43.205.194.94:3000/](http://43.205.194.94:3000/)
- **Health Check**: [http://43.205.194.94:3000/api/health](http://43.205.194.94:3000/api/health) ➡️ `{"status":"ok"}`
- **Database Readiness**: [http://43.205.194.94:3000/api/ready](http://43.205.194.94:3000/api/ready) ➡️ `{"status":"ready"}`

---

## 👥 Team Ownership & Roles

| Member | Primary Ownership & Responsibilities | Key AWS Resources |
|---|---|---|
| **Sarthak** (Lead) | Architecture, Fullstack Code (Express + React), EC2, VPC, IAM, Networking, Integration | VPC `vpc-096171a558df31b07`, EC2 `i-054768b5baf83e81e`, App SG `sg-075ff8633ab726994`, IAM `cloudcare-ec2-role` |
| **Shreya** | Database Tier, Security Group Isolation, CloudWatch Monitoring, Optional Scaling | RDS MySQL `cloudcare-db`, DB SG `sg-01015310dd6f20bec`, Subnets `cloudcare-private-a/b` |
| **Anushka** | Storage Tier, S3 Security, Synthetic Data / SQL Schemas, Acceptance Testing | S3 `cloudcare-docs-anushka-unique-03`, `schema.sql`, `seed.sql`, Test Suite TC01–TC19 |

---

## 🏗️ Architecture Overview

The application follows the **Simplified TY CCF v3.0** multi-tier cloud pattern in `ap-south-1` (Mumbai):

```
User Browser 
   ⬇ (HTTP Port 3000 / Classroom Demo)
Internet Gateway (cloudcare-igw)
   ⬇
Public EC2 Host (cloudcare-app, t3.micro in 10.20.1.0/24)
   ├─ Express REST API Backend
   ├─ React iOS 16-inspired UI (served from frontend/dist)
   │
   ├──▶ Private RDS MySQL (cloudcare-db in 10.20.11.0/24 & 10.20.12.0/24)
   │     • Publicly Accessible: NO
   │     • Inbound 3306 allowed ONLY from cloudcare-app-sg
   │
   └──▶ Private S3 Bucket (cloudcare-docs-anushka-unique-03)
         • Block Public Access: ON (All 4 settings)
         • Default SSE-S3 Encryption (AES256)
         • Accessed via EC2 IAM Instance Profile (cloudcare-app-profile)
```

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for full Mermaid diagram and security controls.

---

## 🧪 Automated & Live Verification

### 1. Local Automated Tests
```sh
# Run backend foundation & API integration tests (24 tests)
node --test tests/foundation.test.js tests/api.test.js

# Run frontend unit tests (5 tests)
npm test --prefix frontend

# Build production frontend bundle
npm run build --prefix frontend
```

### 2. Live Acceptance Suite (19 / 19 PASS)
Executed against the live EC2 host (`http://43.205.194.94:3000`). All patient data is synthetic.
- **TC01**: Health check endpoint (`GET /api/health`) ➡️ **PASS**
- **TC02–TC04**: Patient registration, login & validation ➡️ **PASS**
- **TC05–TC06**: Appointment booking & conflict prevention (`409 SLOT_CONFLICT`) ➡️ **PASS**
- **TC07–TC09**: Doctor queue, status update & prescriptions ➡️ **PASS**
- **TC10–TC12**: Synthetic PDF upload to S3, patient download & unauthorized denial ➡️ **PASS**
- **TC13–TC16**: Unauthenticated, forbidden, file size (>5MB) & file type validation ➡️ **PASS**
- **TC17–TC18**: RDS private SG isolation & S3 Block Public Access ➡️ **PASS**
- **TC19**: Admin summary analytics ➡️ **PASS**

Full evidence is recorded in [tests/TEST_CASES.md](tests/TEST_CASES.md).

---

## 📚 Documentation Index

- [Architecture & Mermaid Blueprint](docs/ARCHITECTURE.md)
- [Demonstration & Viva Q&A Guide](docs/DEMO_AND_VIVA_GUIDE.md)
- [Team Coordination & Handoff Records (H0–H6)](docs/HANDOFFS.md)
- [API Contract Specification](docs/API_CONTRACT.md)
- [Phase 1 Status Tracking](docs/SARTHAK_PHASE1_STATUS.md)
- [Phase 2 Status Tracking](docs/SARTHAK_PHASE2_STATUS.md)
- [Phase 3 Status Tracking](docs/SARTHAK_PHASE3_STATUS.md)
