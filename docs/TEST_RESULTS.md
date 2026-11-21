# Phase 1 verification

Verified locally on 21 November 2026 with Node.js `v24.13.0`, npm `11.6.2` and Express `5.3.0`.

| Command or check | Observed result |
| --- | --- |
| `npm install --save-exact --ignore-scripts express@5` | Installed 65 packages. npm reported 0 vulnerabilities at install time. |
| `npm ci --ignore-scripts` | Reinstalled 65 packages from the lockfile. |
| `npm test` | 6 passed, 0 failed. The initial sandboxed run passed 3 configuration tests and denied the 3 loopback requests with `EACCES`. The rerun with loopback access passed all 6. |
| `npm start` | Express listened on `127.0.0.1:3000` without a `.env` file. |
| `curl.exe -i http://127.0.0.1:3000/api/health` | `200 OK` with `{"status":"ok"}`. |
| `curl.exe -i http://127.0.0.1:3000/api/ready` | `503 Service Unavailable` with `NOT_READY`, as expected for the placeholder. |
| `curl.exe -i -X POST http://127.0.0.1:3000/api/auth/login` | `404 Not Found` with the standard `NOT_FOUND` JSON response. |
| `git check-ignore .env backend/.env .env.local docs/evidence/private.key` | All four sample secret paths were ignored. |

The HTTP checks ran at 16:11 IST through the `npm start` process. The Phase 1 backend runs directly in Node.js. Frontend build verification is pending with Antigravity. Authentication, MySQL, S3, EC2 and CloudWatch checks require their respective implementations and resources.
