# CloudCare - Demonstration, Speaking Scripts & Viva Q&A Guide

## Project Overview
- **Project**: CloudCare - Cloud-Based Hospital Management System (Simplified TY CCF Edition v3.0)
- **Live Demo URL**: `http://43.205.194.94:3000/`
- **Region**: `ap-south-1` (Mumbai)
- **Team**: Sarthak (Lead & Architecture/EC2/Fullstack), Shreya (Private RDS & CloudWatch), Anushka (Private S3, SQL Data & Testing)

---

## 1. 10-Minute Team Demonstration Script

### Act 1: Sarthak (3 Minutes) — Architecture & System Overview
- **Opening**: "Good morning/afternoon evaluators. We present CloudCare, a secure, cloud-native hospital management system designed strictly following cloud computing fundamentals on AWS."
- **Architecture Highlight**: "Our deployment utilizes a custom VPC (`10.20.0.0/16`) in `ap-south-1`. We segregated public and private tiers: the public subnet hosts our EC2 instance (`t3.micro`) running Node.js Express and our React iOS 16-inspired UI on port 3000. All backend databases and storage are completely isolated from the internet."
- **Live UI Demo**:
  1. Open `http://43.205.194.94:3000/` in the browser.
  2. Show `/api/health` returning 200 `{"status":"ok"}` and `/api/ready` returning 200 `{"status":"ready"}`.
  3. Log in as patient `aarav@cloudcare.test` (`Patient@123`).
  4. Book a new appointment with Dr. Rahul Sharma on a specific date/slot.

### Act 2: Shreya (3 Minutes) — Private RDS, Security Groups & CloudWatch
- **RDS Isolation**: "I was responsible for our database tier. The MySQL database (`cloudcare-db`) is deployed across two private subnets in distinct availability zones (`ap-south-1a` and `ap-south-1b`). `PubliclyAccessible` is set to `No`."
- **Least-Privilege Security Group**: "Our database security group (`cloudcare-db-sg`) permits inbound TCP 3306 **only from the EC2 application security group**, never from IP CIDRs. Direct internet access to the database is mathematically impossible."
- **CloudWatch Evidence**: "In CloudWatch, we monitor EC2 CPUUtilization (averaging under 1%) and RDS DatabaseConnections. Basic monitoring was chosen to avoid unnecessary cloud costs while maintaining operational visibility."

### Act 3: Anushka (3 Minutes) — Private S3, Synthetic Data & Test Acceptance
- **Private S3 Storage**: "I managed the document storage and test suite. The S3 bucket `cloudcare-docs-anushka-unique-03` has all four Block Public Access flags strictly enabled with SSE-S3 encryption. The EC2 instance accesses it without static keys, using an IAM instance profile (`cloudcare-app-profile`)."
- **Synthetic Data**: "All patient records are 100% synthetic. Passwords use salted bcrypt hashes (`Admin@123`, `Doctor@123`, `Patient@123`)."
- **Test Acceptance**: "We executed 19 comprehensive test cases (TC01–TC19) covering appointment conflict detection, status updates, doctor notes, report upload to S3, report download, unauthorized cross-patient blocking, and role-based access control. All 19 test cases passed on the live cloud host."

### Act 4: Sarthak (1 Minute) — Summary & Cost-Effective Cloud Design
- **Summary**: "CloudCare proves that robust security, clear multi-tier separation, and modern UI can be achieved entirely within the AWS Free Tier without incurring expensive NAT gateway or multi-ALB fees."

---

## 2. Key Viva Q&A Guide

### Q1: Why did you not use a NAT Gateway?
> **Answer**: A NAT Gateway incurs a fixed hourly charge (~$32/month) plus data processing fees, which exceeds typical student project budgets. Instead, our public EC2 instance directly accesses the internet through an Internet Gateway (IGW) for package updates, while our database remains completely private in subnets with local-only routes. EC2 connects to RDS internally over the AWS VPC private network with zero data transfer costs.

### Q2: How does the EC2 instance access S3 without access keys?
> **Answer**: We use an **IAM Instance Profile** (`cloudcare-app-profile`) associated with `cloudcare-ec2-role`. The AWS SDK on EC2 automatically retrieves temporary, rotating credentials from the EC2 Instance Metadata Service (IMDSv2). No AWS access keys or secrets are stored in `.env` files or source code.

### Q3: How is database security enforced if RDS is in the same VPC?
> **Answer**: Security is enforced at two layers:
> 1. **Network Layer**: The private subnets have route tables with only local VPC routing (`10.20.0.0/16 -> local`) and no default route to the IGW.
> 2. **Security Group Layer**: The DB Security Group (`cloudcare-db-sg`) allows inbound port 3306 **only from the EC2 Security Group ID (`sg-075ff8633ab726994`)**, not from CIDR IP ranges. Even other instances inside the VPC cannot connect to RDS unless they possess the app security group.

### Q4: Why is port 3000 used directly instead of port 80/443 with an ALB?
> **Answer**: The Simplified TY CCF v3.0 project specification defines the core mandatory architecture as single-EC2 public demo mode. An Application Load Balancer (ALB) requires two public subnets and adds hourly charges. By serving the production React build directly via Express on port 3000 with a strict demo security group, we achieved a working end-to-end cloud deployment within project resource limits. ALB is documented as an optional scaling extension.

### Q5: How is patient data privacy guaranteed in the application?
> **Answer**: All test data is completely synthetic. At the API level, the server validates JWT tokens and decodes user role and patient ID. Report download endpoints verify that `documents.patient_id` matches the authenticated caller's patient ID before streaming the file from S3; unauthorized cross-patient requests return a 404/denial.

---

## 3. Post-Evaluation Cleanup Plan (Task S14 / SH10 / A10)

To avoid recurring AWS charges after final project grading, execute the following teardown sequence:

1. **S3 Bucket Objects**: Delete all objects in `cloudcare-docs-anushka-unique-03` under `reports/` and `prescriptions/`, then delete the bucket.
2. **EC2 Instance**: Terminate instance `i-054768b5baf83e81e` (`cloudcare-app`).
3. **RDS Database**: Delete database instance `cloudcare-db` (skip final snapshot for disposable demo database).
4. **Security Groups**: Delete `cloudcare-db-sg` and `cloudcare-app-sg`.
5. **IAM Role**: Delete inline policy `CloudCarePrivateBucketAccess`, remove role from instance profile `cloudcare-app-profile`, and delete role `cloudcare-ec2-role`.
6. **VPC & Networking**: Detach and delete `cloudcare-igw`, delete route tables, delete subnets, and delete VPC `vpc-096171a558df31b07`.
