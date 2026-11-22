# CloudCare Architecture & Security Blueprint (Simplified TY CCF Edition v3.0)

## System Architecture Diagram

```mermaid
flowchart TD
    subgraph Internet ["🌐 Public Internet"]
        UserBrowser["User Browser<br/>(Patient / Doctor / Admin)"]
    end

    subgraph AWSCloud ["☁️ AWS Cloud — Region: ap-south-1 (Mumbai)"]
        subgraph VPC ["Custom VPC: cloudcare-vpc (10.20.0.0/16)"]
            IGW["Internet Gateway: cloudcare-igw<br/>igw-087d78c824a5be142"]

            subgraph PublicSubnet ["Public Subnet: cloudcare-public-a (10.20.1.0/24)"]
                EC2Instance["EC2 Application Host: cloudcare-app<br/>i-054768b5baf83e81e<br/>Public IP: 43.205.194.94<br/>Express Backend + React iOS 16 UI<br/>Port: 3000"]
                AppSG["Security Group: cloudcare-app-sg<br/>sg-075ff8633ab726994<br/>Inbound: TCP 3000 from 0.0.0.0/0"]
            end

            subgraph PrivateSubnets ["Private DB Subnets (Local Routing Only)"]
                subgraph SubnetA ["cloudcare-private-a (10.20.11.0/24) [ap-south-1a]"]
                end
                subgraph SubnetB ["cloudcare-private-b (10.20.12.0/24) [ap-south-1b]"]
                end
                RDSInstance["Private RDS MySQL: cloudcare-db<br/>MySQL 8.0 / db.t3.micro / db.t4g.micro<br/>PubliclyAccessible: NO<br/>Port: 3306"]
                DBSG["Security Group: cloudcare-db-sg<br/>sg-01015310dd6f20bec<br/>Inbound: TCP 3306 from cloudcare-app-sg only"]
            end
        end

        subgraph S3Service ["Private Object Storage: AWS S3"]
            S3Bucket["S3 Bucket: cloudcare-docs-anushka-unique-03<br/>Block Public Access: ON (all 4 flags)<br/>Encryption: SSE-S3 (AES256)<br/>Prefixes: reports/, prescriptions/"]
        end

        subgraph IAMService ["Identity & Access Management (IAM)"]
            IAMRole["IAM Role: cloudcare-ec2-role<br/>Instance Profile: cloudcare-app-profile<br/>Policies: AmazonSSMManagedInstanceCore<br/>CloudCarePrivateBucketAccess"]
        end

        subgraph Monitoring ["Monitoring: Amazon CloudWatch"]
            CWMetrics["Basic Monitoring<br/>EC2 CPUUtilization<br/>RDS DatabaseConnections & FreeableMemory"]
        end

        subgraph OptionalExtensions ["Optional Extensions (Deferred / Not Required for Core Demo)"]
            ALB["Application Load Balancer (ALB)"]
            ASG["Auto Scaling Group (ASG)"]
        end
    end

    %% Network Flows
    UserBrowser -->|"HTTP (Port 3000)<br/>Classroom Demo Mode"| IGW
    IGW -->|"Routed via 0.0.0.0/0"| EC2Instance
    EC2Instance -.->|"Assigned SG"| AppSG

    %% Database Flows
    EC2Instance -->|"TCP 3306 (Private VPC Traffic Only)"| RDSInstance
    RDSInstance -.->|"Protected by"| DBSG
    AppSG ==>|"Authorized Source for 3306"| DBSG

    %% Storage Flows
    EC2Instance -->|"IAM Role Temp Credentials (STS)<br/>PutObject / GetObject"| S3Bucket
    EC2Instance -.->|"Assumed Role"| IAMRole

    %% Monitoring Flows
    EC2Instance -.->|"Metrics Streaming"| CWMetrics
    RDSInstance -.->|"Metrics Streaming"| CWMetrics
```

---

## Security Invariants

1. **Database Isolation**: The RDS MySQL database (`cloudcare-db`) is deployed in private subnets with `PubliclyAccessible: false`. Inbound TCP port 3306 is permitted **only from the application security group** (`sg-075ff8633ab726994`), preventing any direct internet access.
2. **S3 Security**: The S3 bucket (`cloudcare-docs-anushka-unique-03`) has **Block Public Access enabled across all four settings** and default Server-Side Encryption (`AES256`). EC2 interacts with S3 exclusively via temporary IAM instance profile credentials (`cloudcare-app-profile`), with zero static access keys stored on disk or committed to Git.
3. **No Secrets in Source Control**: Verified via `git ls-files` that no `.env` files, `.pem` keys, or credentials exist in the Git tree.
