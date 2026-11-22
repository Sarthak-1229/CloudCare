# Sarthak Phase 3 Status & Tracking

| Task | Description | Status | Evidence | Dependency |
|---|---|---|---|---|
| S12 | Fix mandatory defects | COMPLETE | Patient -> Doctor -> Patient workflow verified end-to-end on live cloud deployment. 19/19 test cases passing in `tests/TEST_CASES.md`. Zero active defects. 24/24 backend automated tests + 5/5 frontend tests passing. | S7–S11 |
| S13 | Review AWS security and evidence | COMPLETE | VPC routes verified (local-only for private subnets, IGW for public subnet). Security groups verified: DB SG allows 3306 exclusively from App SG; SSH not exposed to 0.0.0.0/0. IAM role verified with least privilege on S3 bucket. RDS `PubliclyAccessible: false`. S3 Block Public Access all 4 flags ON and SSE-S3 encryption enabled. Secret scan via `git ls-files` confirmed zero `.env` or credential files committed. | S1–S11 |
| S14 | Demo and cleanup decision | COMPLETE | Created [docs/DEMO_AND_VIVA_GUIDE.md](DEMO_AND_VIVA_GUIDE.md) including 10-minute team presentation script, speaking notes for Sarthak, Shreya, and Anushka, comprehensive viva Q&A guide, and safe 6-step cloud resource teardown plan. Architecture diagram documented in [docs/ARCHITECTURE.md](ARCHITECTURE.md). | S12, S13 |
