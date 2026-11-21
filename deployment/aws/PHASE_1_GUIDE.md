# CloudCare AWS Phase 1 Guide: Deployment, Teammate Coordination & Verification

**Author:** Sarthak (Application Development & Technical Integration Lead)  
**Target Region:** `ap-south-1` (Mumbai)  
**Scope:** Simplified TY CCF v3.0 Phase 1 Foundation  

---

## 1. Prerequisites & Secure Authentication

### A. AWS CLI v2 Installation
The official AWS installer has been downloaded to:
`$env:TEMP\AWSCLIV2.msi`

To install on Windows (requires human administrator approval):
```powershell
msiexec.exe /i "$env:TEMP\AWSCLIV2.msi" /qn
```
Verify path resolution after restarting PowerShell:
```powershell
aws --version
```

### B. Secure Sign-In (Zero Secrets in Chat / Git)
Execute locally in PowerShell:
- **If using AWS IAM Identity Center (SSO):**
  ```powershell
  aws configure sso --profile cloudcare
  aws sso login --profile cloudcare
  ```
- **If using IAM Access Keys:**
  ```powershell
  aws configure --profile cloudcare
  # Prompted for:
  # AWS Access Key ID: [HIDDEN]
  # AWS Secret Access Key: [HIDDEN]
  # Default region name: ap-south-1
  # Default output format: json
  ```

### C. Caller Identity Verification
```powershell
$awsArgs = @('--profile', 'cloudcare', '--region', 'ap-south-1', '--no-cli-pager')
aws @awsArgs sts get-caller-identity
```

---

## 2. Preflight Checks (Avoid Duplicate Resources)

Verify that no overlapping CloudCare resources exist before creating CloudFormation stacks:

```powershell
# Check for existing VPCs
aws @awsArgs ec2 describe-vpcs --filters Name=tag:Name,Values=cloudcare-vpc --query 'Vpcs[].{VpcId:VpcId,Cidr:CidrBlock}'

# Check for existing subnets
aws @awsArgs ec2 describe-subnets --filters "Name=tag:Name,Values=cloudcare-public-a,cloudcare-private-a,cloudcare-private-b" --query 'Subnets[].{SubnetId:SubnetId,Name:Tags[?Key==`Name`].Value|[0]}'

# Check for existing Security Groups
aws @awsArgs ec2 describe-security-groups --filters "Name=tag:Name,Values=cloudcare-app-sg,cloudcare-db-sg" --query 'SecurityGroups[].{GroupId:GroupId,Name:GroupName}'

# Check for existing CloudFormation stacks
aws @awsArgs cloudformation list-stacks --query "StackSummaries[?StackStatus!='DELETE_COMPLETE'].[StackName,StackStatus]"

# List available Availability Zones in Mumbai
aws @awsArgs ec2 describe-availability-zones --filters Name=state,Values=available --query 'AvailabilityZones[].ZoneName'
```

---

## 3. Teammate Coordination Matrix

```
                          SARTHAK (Technical Lead)
                         [cloudcare-network stack]
                                    |
            +-----------------------+-----------------------+
            |                                               |
            v                                               v
    SHREYA (RDS Owner)                             ANUSHKA (S3 & QA Owner)
```

### A. Handoff to Shreya (for Private RDS MySQL)
Provide Shreya with the following IDs immediately after Phase 1 stack deployment:
1. **VpcId**: `cloudcare-vpc` ID (CIDR `10.20.0.0/16`)
2. **PrivateSubnetAId**: `cloudcare-private-a` ID (in AZ A, e.g., `ap-south-1a`)
3. **PrivateSubnetBId**: `cloudcare-private-b` ID (in AZ B, e.g., `ap-south-1b`)
4. **DbSecurityGroupId**: `cloudcare-db-sg` ID (allows inbound 3306 from app SG)

**Required from Shreya:**
- RDS MySQL Endpoint (`cloudcare-db.xxxxx.ap-south-1.rds.amazonaws.com`)
- Port (`3306`)
- Database Name (`cloudcare`)
- Confirmation: `Publicly Accessible = No`

### B. Handoff to Anushka (for Private S3 & QA)
Provide Anushka with:
1. **AppRoleArn**: `arn:aws:iam::<account-id>:role/cloudcare-ec2-role`
2. **AppSecurityGroupId**: `cloudcare-app-sg` ID

**Required from Anushka:**
- Confirmed Private S3 Bucket Name (`cloudcare-docs-<unique-suffix>`)
- Bucket ARN (`arn:aws:s3:::cloudcare-docs-<unique-suffix>`)
- Confirmation: Block All Public Access = **ON**, SSE-S3 encryption = **ON**
- Synthetic SQL test scripts: `schema.sql` and `seed.sql`

---

## 4. CloudFormation Automation (`Stack.ps1`)

### Template Validation
```powershell
.\deployment\aws\Stack.ps1 -Stage Network -Mode Validate -AwsProfile cloudcare
.\deployment\aws\Stack.ps1 -Stage App -Mode Validate -AwsProfile cloudcare
```

### Dry-Run / Preview ChangeSet (Requires Approval)
```powershell
.\deployment\aws\Stack.ps1 -Stage Network -Mode Deploy -PreviewChangeSet -AwsProfile cloudcare `
  -PublicAvailabilityZone ap-south-1a `
  -SecondPrivateAvailabilityZone ap-south-1b `
  -BucketName '<anushka-bucket-name>'
```

### Execute Deployment (Requires Sarthak's Explicit Approval)
```powershell
.\deployment\aws\Stack.ps1 -Stage Network -Mode Deploy -AwsProfile cloudcare `
  -PublicAvailabilityZone ap-south-1a `
  -SecondPrivateAvailabilityZone ap-south-1b `
  -BucketName '<anushka-bucket-name>'

# Query generated stack outputs
.\deployment\aws\Stack.ps1 -Stage Network -Mode Outputs -AwsProfile cloudcare
```

---

## 5. Phase 1 Verification Checklist

- [ ] **AWS CLI**: Version 2 verified via `aws --version`.
- [ ] **STS Identity**: `aws sts get-caller-identity` matches intended team AWS account.
- [ ] **Region**: Explicitly targeting `ap-south-1` (Mumbai).
- [ ] **VPC**: `10.20.0.0/16` with DNS Hostnames and Resolution enabled.
- [ ] **Internet Gateway**: Attached to `cloudcare-vpc`.
- [ ] **Public Subnet**: `10.20.1.0/24` with default route `0.0.0.0/0` -> `cloudcare-igw`.
- [ ] **Private DB Subnets**: Two subnets (`10.20.11.0/24` and `10.20.12.0/24`) in separate AZs with **no IGW route**.
- [ ] **Security Group Isolation**:
  - `cloudcare-db-sg` allows TCP 3306 **only** from `cloudcare-app-sg`.
  - `cloudcare-app-sg` has default closed ingress in Phase 1.
- [ ] **IAM Role**:
  - Attached `AmazonSSMManagedInstanceCore` for secure Systems Manager terminal.
  - S3 policy restricted strictly to `reports/*` and `deployment/cloudcare/*`.
- [ ] **Teammate Handoff Logged**: IDs transmitted to Shreya and Anushka.
- [ ] **Zero Live Changes**: No AWS resources provisioned without human confirmation.
