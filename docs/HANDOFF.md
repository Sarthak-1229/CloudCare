# Phase 1 handoff

The Simplified TY CCF v3.0 manuals govern the architecture, team ownership and phase gates. Sarthak owns VPC, networking, IAM, EC2 and application integration. Shreya owns private RDS and CloudWatch. Anushka owns private S3, synthetic SQL data and independent testing.

Planning sources are the [Master Guide](CloudCare_01_Simplified_Master_Guide.pdf), the [Sarthak manual](CloudCare_02_Sarthak_Step_by_Step_Manual.pdf), the [Shreya manual](CloudCare_03_Shreya_Step_by_Step_Manual.pdf) and the [Anushka manual](CloudCare_04_Anushka_Step_by_Step_Manual.pdf).

| Owner | Phase 1 work and handoff | Status |
| --- | --- | --- |
| Sarthak / Codex | GitHub `origin`, application branch, local Express liveness and API contract | Local implementation is ready for team review. See [verification](TEST_RESULTS.md). |
| Antigravity | Start the React skeleton and use relative `/api` paths with the local Vite proxy. Review the proposed fields in the [API contract](API_CONTRACT.md). | Frontend startup and build evidence pending from Antigravity. |
| Sarthak | Verify region and costs, then provide VPC ID, two private DB subnet IDs and DB SG ID to Shreya. Share role ARN and scoped bucket requirements with Anushka. | AWS resource IDs and settings unverified. See the [foundation checklist](../deployment/AWS_PHASE_1.md). |
| Shreya | Verify RDS is private and that its SG permits 3306 from the app SG. Share endpoint, port, database name and instance status with Sarthak and Anushka. | Private RDS evidence and endpoint pending. Basic CloudWatch metrics follow EC2 deployment. |
| Anushka | Share private bucket name, ARN and `reports/` prefix with Sarthak. Share reviewed schema and synthetic seed plan, with keys and constraints aligned to the API contract. | S3 evidence, SQL and independent test checklist pending. |

Share credentials and JWT secrets through the team's private channel. Keep them out of Git, screenshots and agent prompts.

Phase 1 remains open pending local frontend verification, API and schema agreement, and AWS foundation evidence. Phase 2 starts after Sarthak accepts the gate.
