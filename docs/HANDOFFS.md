# CloudCare Team Handoffs (H0–H4)

This document tracks the formal connection points defined in the [CloudCare Team Coordination and Integration Guide](CloudCare_Team_Coordination_and_Integration_Guide.pdf).

---

### H0 | Kickoff & Scope Agreement
- **From → To**: Sarthak → Everyone (Shreya, Anushka)
- **Timestamp / AWS Region**: 2026-11-21 16:15 IST / `ap-south-1` (Mumbai)
- **Resource / exact ID**:
  - GitHub Repository: `https://github.com/Sarthak-1229/CloudCare`
  - Branches: `main`, `feature/application`
  - Core Manuals: Master Guide, Sarthak Manual, Shreya Manual, Anushka Manual in `docs/`
  - Contract: `docs/API_CONTRACT.md`
- **What recipient must do**: Clone repository, acknowledge Region `ap-south-1` and strict file boundaries.
- **Verification evidence**: Git commits `5fc0f9c`, `f9293ea`, `2a37f00` present on remote `origin/main`.
- **Status**: **VERIFIED**
- **Blocker and owner**: None.

---

### H1 | Phase 1: Before RDS Creation
- **From → To**: Sarthak → Shreya
- **Timestamp / AWS Region**: 2026-11-21 19:10 IST / `ap-south-1` (Mumbai)
- **Resource / exact ID**:
  - VPC ID: `vpc-096171a558df31b07` (CIDR `10.20.0.0/16`)
  - Private Subnet A ID: `subnet-06c0e5c1dd7f6d4b0` (`10.20.11.0/24`, AZ: `ap-south-1a`)
  - Private Subnet B ID: `subnet-0fa453b56e66204c1` (`10.20.12.0/24`, AZ: `ap-south-1b`)
  - DB Security Group ID: `sg-01015310dd6f20bec` (`cloudcare-db-sg`)
  - Target Region: `ap-south-1`
- **What recipient must do**: Confirm both subnets are in different AZs with private routes only. Create DB subnet group and launch private MySQL RDS `cloudcare-db` (`PubliclyAccessible = No`).
- **Verification evidence**: `cloudcare-db-subnets` contains the two private subnets; `cloudcare-db` launched with `PubliclyAccessible: false` and `cloudcare-db-sg` attached.
- **Status**: **VERIFIED**
- **Blocker and owner**: None.

---

### H2 | Phase 1: Before EC2 IAM Role Policy
- **From → To**: Anushka → Sarthak
- **Timestamp / AWS Region**: 2026-11-21 19:00 IST / `ap-south-1` (Mumbai)
- **Resource / exact ID**:
  - S3 Bucket Name: `cloudcare-docs-anushka-unique-03`
  - Bucket ARN: `arn:aws:s3:::cloudcare-docs-anushka-unique-03`
  - Region: `ap-south-1`
  - Prefixes: `reports/` and `deployment/cloudcare/`
- **What recipient must do**: Sarthak creates EC2 IAM role (`cloudcare-ec2-role`) scoped strictly to `cloudcare-docs-anushka-unique-03`.
- **Verification evidence**: AWS CLI `aws s3api get-public-access-block` confirms all 4 flags `true`. `aws iam get-role-policy` confirms policy `CloudCarePrivateBucketAccess` scoped to bucket.
- **Status**: **VERIFIED**
- **Blocker and owner**: None.

---

### H3 | Phase 1: Before DB SQL is Applied
- **From → To**: Anushka → Sarthak + Shreya
- **Timestamp / AWS Region**: 2026-11-21 18:40 IST / `ap-south-1` (Mumbai)
- **Resource / exact ID**:
  - Schema File: `docs/sql/schema.sql` (6 tables: `users`, `patients`, `doctors`, `appointments`, `prescriptions`, `documents`)
  - Seed File: `docs/sql/seed.sql` (synthetic data with bcrypt hash placeholders)
  - Test Cases: `tests/TEST_CASES.md` (TC01–TC19)
- **What recipient must do**: Sarthak verifies schema compatibility with API contract and backend models. Shreya applies SQL during Phase 2 via EC2 MySQL client.
- **Verification evidence**: Git commits `cb57b47` and `3c17063` merged on `main`. Schema audited: 100% match with `docs/API_CONTRACT.md`.
- **Status**: **VERIFIED**
- **Blocker and owner**: None.

---

### H4 | Phase 1 Gate / Phase 2 Start
- **From → To**: Shreya → Sarthak
- **Timestamp / AWS Region**: 2026-11-21 19:15 IST / `ap-south-1` (Mumbai)
- **Resource / exact ID**:
  - RDS Instance ID: `cloudcare-db`
  - RDS Status: `available`
  - Endpoint: `cloudcare-db.cbu82mmyc950.ap-south-1.rds.amazonaws.com`
  - Port: `3306`
  - Database Name: `cloudcare`
  - Publicly Accessible: `false`
  - Security Group: `sg-01015310dd6f20bec`
- **What recipient must do**: Sarthak records configuration securely for Phase 2 EC2 `.env` integration. Credentials delivered via secure private channel.
- **Verification evidence**: `aws rds describe-db-instances` confirms instance status `available`, `PubliclyAccessible: false`, and `SecurityGroups: ["sg-01015310dd6f20bec"]`.
- **Status**: **VERIFIED**
- **Blocker and owner**: Master credentials to be shared out-of-band via team private channel before Phase 2.

---

### H5 | Phase 2: EC2 Instance Deployment & Testing Handoff
- **From → To**: Sarthak → Anushka + Shreya
- **Timestamp / AWS Region**: 2026-11-21 22:10 IST / `ap-south-1` (Mumbai)
- **Resource / exact ID**:
  - EC2 Instance ID: `i-054768b5baf83e81e`
  - EC2 Public IPv4: `43.205.194.94`
  - EC2 Private IPv4: `10.20.1.72`
  - Subnet ID: `subnet-088918b18c8e71b90` (`cloudcare-public-a`)
  - App Security Group: `sg-075ff8633ab726994` (`cloudcare-app-sg`)
  - DB Security Group: `sg-01015310dd6f20bec` (`cloudcare-db-sg`)
  - Inbound 3306 Confirmation: MySQL port 3306 on `cloudcare-db-sg` is authorized strictly from `sg-075ff8633ab726994`.
  - Application URL: `http://43.205.194.94:3000`
- **What recipient must do**: 
  - Anushka: Use EC2 Public IP (`43.205.194.94`) for test verification (TC01–TC19).
  - Shreya: Confirm EC2 Private IP (`10.20.1.72`) / App SG (`sg-075ff8633ab726994`) connectivity to RDS MySQL `cloudcare-db`.
- **Verification evidence**: `aws ec2 describe-instances` confirms instance `i-054768b5baf83e81e` is in `running` state with public IP `43.205.194.94`.
- **Status**: **VERIFIED**
- **Blocker and owner**: None.
