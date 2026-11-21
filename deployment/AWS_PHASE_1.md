# AWS foundation for the CloudCare demo

The v3.0 topology is one public EC2 subnet and two private RDS subnets in different Availability Zones. Verify the chosen AWS Region, account eligibility, credits and costs with the team before provisioning. The manuals propose `ap-south-1`.

| Item | Plan and verification evidence |
| --- | --- |
| VPC | `cloudcare-vpc` with `10.20.0.0/16`. Record its VPC ID. |
| Public subnet | `cloudcare-public-a` with `10.20.1.0/24`. Verify association with the public route table and `0.0.0.0/0` via the attached Internet Gateway. Verify public IPv4 assignment for the demo instance. |
| Private DB subnets | `cloudcare-private-a` with `10.20.11.0/24` and `cloudcare-private-b` with `10.20.12.0/24`, in different AZs. Verify both are in the RDS subnet group and neither has a default route to the Internet Gateway. |
| App security group | `cloudcare-app-sg`. TCP 3000 is the HTTP app port for the short direct-EC2 demo. Any SSH access is restricted to the approved team IP `/32`. Use only synthetic credentials and records in the HTTP demo. If ALB is implemented later, change the app ingress source to the ALB SG after target verification. |
| DB security group | `cloudcare-db-sg`. Verify TCP 3306 ingress from `cloudcare-app-sg` only. Shreya confirms **Publicly accessible = No** for the RDS instance. |
| S3 bucket | Anushka confirms S3 Block Public Access, bucket-owner-enforced Object Ownership and SSE-S3 default encryption. Obtain the actual bucket ARN and confirm the `reports/` prefix. |
| EC2 instance role | `cloudcare-ec2-role` with EC2 trust principal `ec2.amazonaws.com`. Record role ARN and verify application permissions against the confirmed private bucket. The SDK will use the EC2 instance profile. |

## Draft S3 permissions for the EC2 role

Replace `BUCKET_NAME` with Anushka's confirmed bucket name before reviewing this template. The partition shown is for the proposed Mumbai Region. The report upload and download use object operations. The listing statement is scoped to `reports/` for use only if bucket-level listing is needed. [AWS S3 IAM policy examples](https://docs.aws.amazon.com/AmazonS3/latest/userguide/example-policies-s3.html)

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["s3:GetObject", "s3:PutObject"],
      "Resource": "arn:aws:s3:::BUCKET_NAME/reports/*"
    },
    {
      "Effect": "Allow",
      "Action": "s3:ListBucket",
      "Resource": "arn:aws:s3:::BUCKET_NAME",
      "Condition": {
        "StringLike": { "s3:prefix": "reports/*" }
      }
    }
  ]
}
```

Copy confirmed resource identifiers and private-setting evidence to the [handoff](../docs/HANDOFF.md). EC2 launch, app deployment, MySQL and S3 integration, and CloudWatch evidence follow the Phase 1 gate. ALB, Auto Scaling and CloudWatch alarms are optional extensions.
