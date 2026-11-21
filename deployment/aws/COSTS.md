# Mumbai estimate in USD

Public on-demand rates checked on 21 November 2026. The estimates assume one instance and one public IPv4 address while the app runs, with storage retained for 48 hours or for a nominal 730-hour month. S3 illustrates 1 GB of synthetic files and releases plus 100 PUT-class and 1,000 GET-class requests in the stated period. Estimates are before taxes and credits.

| Resource | Mumbai rate | 48 hours | 730 hours |
| --- | ---: | ---: | ---: |
| EC2 `t3.micro`, Linux shared On-Demand | $0.0112/hour | $0.54 | $8.18 |
| One in-use public IPv4 address | $0.005/hour | $0.24 | $3.65 |
| EC2 root EBS gp3, 8 GiB | $0.0912/GB-month | $0.05 | $0.73 |
| **Sarthak's app stack subtotal** | | **$0.83** | **$12.56** |
| Shreya's RDS MySQL `db.t3.micro`, Single-AZ | $0.025/hour | $1.20 | $18.25 |
| RDS gp3, 20 GiB at baseline | $0.131/GB-month | $0.17 | $2.62 |
| Anushka's S3 Standard example | $0.025/GB-month, $0.005/1,000 PUT-class, $0.004/10,000 GET-class | <$0.01 | $0.03 |
| **Total example for all three owners** | | **$2.20** | **$33.45** |

Totals use unrounded values. The Phase 1 network stack creates VPC primitives, security groups and an IAM role/profile, with no hourly or storage charges for those objects in this proposal. The separate Phase 2 app stack starts the EC2, public IPv4 and root volume charges. Private RDS and S3 are separately owned and billed. Check Shreya's actual DB class, engine support and storage allocation before treating the example as a team budget. [VPC pricing](https://aws.amazon.com/vpc/pricing/) · [CloudFormation pricing](https://aws.amazon.com/cloudformation/pricing/)

Costs vary with uptime, retained storage, snapshots, RDS backup allocation and engine support, RDS burst credits, data transfer, request volume and optional logging. The EC2 template selects standard T3 CPU credits and basic monitoring. No NAT gateway, ALB, Auto Scaling group or CloudWatch alarm is budgeted. An auto-assigned public address is released when EC2 stops. EBS and other retained storage can continue billing. Verify the account's credits and any Free Tier terms in Billing before approval. [EC2 On-Demand pricing](https://aws.amazon.com/ec2/pricing/on-demand/) · [RDS MySQL pricing](https://aws.amazon.com/rds/mysql/pricing/) · [S3 pricing](https://aws.amazon.com/s3/pricing/)

Mumbai rates come from the AWS regional price catalogs. The catalog links are CSV downloads. [EC2 and EBS](https://pricing.us-east-1.amazonaws.com/offers/v1.0/aws/AmazonEC2/current/ap-south-1/index.csv) · [RDS](https://pricing.us-east-1.amazonaws.com/offers/v1.0/aws/AmazonRDS/current/ap-south-1/index.csv) · [S3](https://pricing.us-east-1.amazonaws.com/offers/v1.0/aws/AmazonS3/current/ap-south-1/index.csv)
