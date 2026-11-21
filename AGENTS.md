CloudCare - Shared AI Agent Instructions (Simplified v3.0)
Source of truth
Read the four new PDFs in this kit first. They supersede older CloudCare plans for scope and ownership. The original handoff is historical reference only where not conflicting. Do not claim to have read unavailable PDFs.
Project
Project: CloudCare - TY Cloud Computing Fundamentals mini project. Team: Sarthak, Shreya, Anushka. Deadline: 2 days / 12-16 elapsed working hours. GitHub: https://github.com/Sarthak-1229/CloudCare. All patient data must be synthetic. Sarthak alone owns all React and Express code. Codex handles backend, AWS SDK and tests; Antigravity handles frontend with iOS 16-inspired styling. AWS hands-on is shared, with Sarthak leading VPC, EC2, IAM, networking and integration; Shreya leading private RDS and optional ALB; Anushka leading private S3, SQL test data, verification and evidence. No teammate edits frontend/ or backend/ without Sarthak approval.
Architecture
Simplified mandatory deployment: Browser -> public EC2 (React build served by Express on port 3000) -> private RDS MySQL, and -> private S3 through EC2 IAM role. One custom VPC, one public EC2 subnet, two private DB subnets in distinct AZs, IGW and public route, app SG, DB SG, no NAT. Optional only after core passes: ALB with two public subnets, launch template/ASG, CloudWatch alarm. EC2 public inbound HTTP 3000 is allowed for the short demo only if no ALB; restrict SSH to own IP. No production patient data; HTTP login is not production-secure.
Scope
Mandatory: patient login/registration; doctor/admin seeded accounts; patient books appointment; doctor views and updates appointment; doctor adds short note/prescription; doctor uploads synthetic PDF to private S3; patient can access only own documents; admin sees counts and basic doctor list. Optional: invoices, detailed analytics, notifications, advanced doctor scheduling, ALB/ASG and scale-out. Keep JWT/bcrypt, parameterized SQL, authorization and ownership checks.
Agent ownership
- Codex: edit backend/, deployment/, backend tests, API_CONTRACT.md; implement all backend/API/MySQL/S3 code and automated checks. Do not modify frontend unless Sarthak explicitly coordinates.
- Antigravity (Gemini High): edit frontend/ only. React + Vite + Tailwind CSS + React Router + Axios + Lucide React. Use iOS 16-inspired design, with Figma reference: https://www.figma.com/design/NbjFODRH3Wijgf3N4QS0i8/iOS-16-UI-Kit-for-Figma--Community-?node-id=1319-26168 . Do not claim pixel-perfect match without accessing reference.
- Sarthak owns all frontend/backend code and most AWS setup; Shreya owns private RDS and optional ALB/ASG/CloudWatch; Anushka owns private S3, SQL test data, testing and evidence.
API contract (minimal)
GET /api/health -> 200 {"status":"ok"}; POST /api/auth/login; POST /api/auth/register (patient only); GET /api/me; GET/POST /api/appointments; PATCH /api/appointments/:id/status (doctor/admin); POST /api/appointments/:id/prescription; POST /api/reports/upload; GET /api/reports/:id/download; GET /api/admin/summary. All protected routes require JWT and server-side role/ownership checks. Update docs/API_CONTRACT.md before changing endpoint shapes.
Database
Tables: users, patients, doctors, appointments, prescriptions, documents. Follow Anushka-reviewed SQL. Use mysql2 prepared statements; avoid SQL string concatenation. Document keys stored in RDS; bytes in private S3. No public admin signup.
Safe execution
- Run phases sequentially; within a phase work in parallel.
- Never provision AWS without human approval. Never use real patient data. Never commit .env, credentials, tokens or keys.
- S3 Block Public Access ON, RDS Public access No, DB SG 3306 from app SG only, IAM role for EC2 S3 access.
- For direct EC2 demo, HTTP 3000 public only with disposable synthetic credentials; production HTTPS is out of scope. ALB/ASG are optional, not implemented unless proven.
- Execute tests/build, report exact results and blockers, never fabricate cloud outcomes.
- Keep code simple and modular; do not add Docker, Kubernetes, Terraform, payment gateway or advanced features without approval.
Start prompts
Codex: Read AGENTS.md and the four new PDFs. I am Sarthak. Start Phase 1 backend/API contract only. Edit backend/ and deployment/ only, run local tests, stop at phase gate. Do not touch live AWS.

Antigravity: Read AGENTS.md and the four new PDFs. I am Sarthak. Start Phase 1 React frontend only, following iOS 16 Figma reference. Edit frontend/ only, build and preview, stop at phase gate.