# CloudCare

CloudCare is a TY Cloud Computing Fundamentals mini-project. The Simplified v3.0 demo uses Express on a single EC2 instance, private RDS MySQL and private S3 for synthetic PDF reports.

## Run the Phase 1 backend

Use Node.js 22.9 or newer on a supported LTS release. From the repository root run

```sh
npm ci
npm test
npm start
```

In a second terminal run `curl -i http://127.0.0.1:3000/api/health`. On Windows, use `curl.exe`. The endpoint returns `200` with `{"status":"ok"}`. `GET /api/ready` returns `503` until the MySQL readiness check is implemented.

The backend defaults to `127.0.0.1:3000`. Optional local overrides go in a root `.env` based on [`.env.example`](.env.example). Phase 1 needs no AWS or database credentials.

- [API contract for Antigravity and the data team](docs/API_CONTRACT.md)
- [Phase 1 handoffs and gate status](docs/HANDOFF.md)
- [AWS foundation checklist and IAM draft](deployment/AWS_PHASE_1.md)
- [Executed verification](docs/TEST_RESULTS.md)
