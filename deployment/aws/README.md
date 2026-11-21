# CloudCare AWS deployment proposal

Region `ap-south-1` (Mumbai), subject to the team's AWS account access and capacity. This is the Simplified v3.0 plan. The commands that deploy stacks or publish a release require Sarthak's approval.

## Proposed resources

| Stage | Resources and ownership |
| --- | --- |
| Phase 1, `cloudcare-network` | VPC `10.20.0.0/16`, one public subnet `10.20.1.0/24` with an internet gateway route, and two private DB subnets `10.20.11.0/24` and `10.20.12.0/24` in different AZs. The private subnets share a route table with only local routing. CloudFormation exports the public subnet, app SG and instance profile. |
| Phase 1, IAM and security groups | The DB SG allows TCP 3306 from the app SG. The app SG begins with no inbound rules. The EC2 role uses Systems Manager and, once the bucket is confirmed, can read/write under `reports/` and read under `deployment/cloudcare/`. It has no S3 listing or deletion permission. |
| Phase 2, `cloudcare-app` | One Amazon Linux 2023 `t3.micro`, x86-64, standard CPU credits, encrypted 8 GiB gp3 root disk, IMDSv2 required, one auto-assigned public IPv4, and basic monitoring. SSM handles management. Port 3000 can be opened to an approved temporary IPv4 CIDR for the synthetic-data demo. |
| Team-managed dependencies | Shreya creates single-AZ private RDS MySQL in the two supplied DB subnets, attaches the supplied DB SG and verifies CloudWatch. Anushka owns the existing private S3 bucket, encryption, synthetic schema/data and report tests. Both stacks omit RDS and S3 provisioning. |

The proposal uses no NAT gateway, load balancer, Auto Scaling, paid detailed monitoring, Elastic IP, or public SSH rule. The subnet does not assign public IPs by default. The application instance requests one explicitly for outbound HTTPS to Systems Manager, S3 and the package repositories.

## Read-only checks before approval

Install [AWS CLI v2 for Windows](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html) and open a new PowerShell 7 terminal. Use the team's approved federated profile. For IAM Identity Center, the first-time command is `aws configure sso --profile cloudcare`, followed by `aws sso login --profile cloudcare`. If the team uses a different login method, use its existing profile. [AWS CLI SSO setup](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-sso.html)

```powershell
aws --version
$awsArgs = @('--profile', 'cloudcare', '--region', 'ap-south-1', '--no-cli-pager')
aws @awsArgs sts get-caller-identity
aws @awsArgs ec2 describe-availability-zones --filters Name=state,Values=available --query 'AvailabilityZones[].ZoneName'
aws @awsArgs ec2 describe-instance-type-offerings --location-type availability-zone --filters Name=instance-type,Values=t3.micro --query 'InstanceTypeOfferings[].Location'
aws @awsArgs ssm get-parameter --name /aws/service/ami-amazon-linux-latest/al2023-ami-kernel-default-x86_64 --query 'Parameter.Value'
aws @awsArgs ec2 describe-vpcs --filters Name=tag:Name,Values=cloudcare-vpc --query 'Vpcs[].{Vpc:VpcId,CIDR:CidrBlock}'
aws @awsArgs cloudformation list-stacks --query "StackSummaries[?StackStatus!='DELETE_COMPLETE'].[StackName,StackStatus]"
.\deployment\aws\Stack.ps1 -Stage Network -AwsProfile cloudcare
.\deployment\aws\Stack.ps1 -Stage App -AwsProfile cloudcare
```

Verify the account returned by STS, choose two different available AZs, and place EC2 in an AZ offering `t3.micro`. These checks do not reserve instance capacity. Review existing networking before creating a new VPC. Check EC2 vCPU quota, account credits, and available balance in Billing. The two templates require IAM and EC2/CloudFormation permissions and the app stack needs permission to pass the instance role.

After explicit approval to create a CloudFormation change set, add `-PreviewChangeSet` to either deploy command below. It creates a change set without applying it. Inspect the change set CloudFormation returns and execute that exact set only after approval. Running `-Mode Deploy` without this switch creates and executes a change set.

## Phase 1 network deploy and handoff after approval

Use the actual AZs from preflight and Anushka's confirmed same-account Mumbai bucket name. Omitting `-BucketName` on the initial network deployment grants no S3 access. Reapply with the confirmed name once available. Pass `-BucketName ''` only when intentionally removing app S3 permissions.

```powershell
.\deployment\aws\Stack.ps1 -Stage Network -Mode Deploy -AwsProfile cloudcare `
  -PublicAvailabilityZone $publicAz -SecondPrivateAvailabilityZone $privateAz -BucketName $bucketName
.\deployment\aws\Stack.ps1 -Stage Network -Mode Outputs -AwsProfile cloudcare
```

Give Shreya the VPC ID, private subnet IDs and DB SG ID. Give Anushka the role ARN and allowed prefixes. Anushka confirms all four Block Public Access settings, SSE-S3 default encryption, no public bucket policy, and same-account ownership. The deployment operator needs `s3:PutObject` for `deployment/cloudcare/*`. The instance profile retrieves only the deployment objects. No credentials go into CloudFormation parameters, user data, or SSM command arguments.

```powershell
aws @awsArgs ec2 describe-route-tables --filters "Name=vpc-id,Values=$vpcId"
aws @awsArgs ec2 describe-security-groups --group-ids $appSgId $dbSgId
aws @awsArgs rds describe-db-instances --db-instance-identifier $dbId --query 'DBInstances[0].{Public:PubliclyAccessible,SubnetGroup:DBSubnetGroup,Groups:VpcSecurityGroups,Status:DBInstanceStatus}'
aws @awsArgs s3api get-bucket-location --bucket $bucketName
aws @awsArgs s3api get-public-access-block --bucket $bucketName
aws @awsArgs s3api get-bucket-encryption --bucket $bucketName
aws @awsArgs s3api get-bucket-policy-status --bucket $bucketName
```

A `NoSuchBucketPolicy` response to the final check means there is no bucket policy. Expect the DB status to be `available`, the public flag to be `false`, and port 3306 to be reachable only from the app SG. Shreya controls DB initialization and endpoint delivery. Use a separate limited application user.

## Phase 2 host and backend release after approval

After Phase 1 acceptance and CloudFormation approval, deploy the host with the default closed ingress. Supply `-DemoIngressCidr $approvedCidr` only for a planned direct HTTP demo. Updating the app stack with the default empty CIDR removes the demo rule. The AMI parameter tracks the current AWS AL2023 image, so inspect any update change set for instance replacement before applying.

```powershell
.\deployment\aws\Stack.ps1 -Stage App -Mode Deploy -AwsProfile cloudcare
.\deployment\aws\Stack.ps1 -Stage App -Mode Outputs -AwsProfile cloudcare
aws @awsArgs ec2 wait instance-status-ok --instance-ids $instanceId
aws @awsArgs ssm describe-instance-information --filters "Key=InstanceIds,Values=$instanceId" --query 'InstanceInformationList[].PingStatus'
```

Use a reviewed commit that contains the installer, service unit and backend. Run `npm test` before packaging. The first command packages the commit locally and prints its digest. The second publishes the bundle to Anushka's private bucket with SSE-S3 and uses SSM to install the same commit. The instance checks the SHA-256 digest, installs locked runtime dependencies, starts the unprivileged `cloudcare` systemd service, and restores the previous release if the new one fails its liveness check. The script installs the service unit on the first deploy. Review unit changes separately.

```powershell
.\deployment\aws\Deploy-Backend.ps1 -Commit $reviewedCommit
.\deployment\aws\Deploy-Backend.ps1 -Commit $reviewedCommit -Deploy `
  -AwsProfile cloudcare -BucketName $bucketName -InstanceId $instanceId
```

The bundle packages the Express backend. Health can be verified with the Phase 1 code. The SPA build, JWT, MySQL and S3 business routes still need the Phase 2 application implementation. The current readiness placeholder returns `503`.

### Configure RDS and S3 once the business routes exist

Provision `/etc/cloudcare/cloudcare.env` as `root:root` with mode `0600` using the team's private secret delivery method. Use the variables in the root `.env.example`. Set `DB_HOST`, `DB_PORT=3306`, `DB_NAME`, the limited `DB_USER` and its password, `JWT_SECRET`, `AWS_REGION=ap-south-1` and `S3_BUCKET`. Use `DB_SSL_CA_FILE=/etc/pki/cloudcare/rds-ca-bundle.pem` and ensure hostname verification is enabled in the application pool. The process uses the instance profile for S3. Keep secrets out of command lines, shell history and session transcripts.

Run the following from the EC2 host after approved configuration. Replace the two quoted RDS placeholders with the nonsecret endpoint and limited username. Use a MySQL client that supports `VERIFY_IDENTITY`. Enter its password only at the private prompt. [RDS MySQL TLS verification](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_ConnectToInstanceSSL.CLI.html)

```bash
sudo install -d -m 0755 /etc/pki/cloudcare
sudo curl --fail --silent --show-error \
  https://truststore.pki.rds.amazonaws.com/ap-south-1/ap-south-1-bundle.pem \
  --output /etc/pki/cloudcare/rds-ca-bundle.pem
sudo chmod 0644 /etc/pki/cloudcare/rds-ca-bundle.pem
sudo systemctl restart cloudcare.service
sudo systemctl is-active cloudcare.service
curl -fsS http://127.0.0.1:3000/api/health
mysql --host='confirmed-rds-endpoint' --port=3306 --user='limited-app-user' --password \
  --ssl-mode=VERIFY_IDENTITY --ssl-ca=/etc/pki/cloudcare/rds-ca-bundle.pem cloudcare \
  --execute='SELECT 1 AS connection_ok;'
```

Use the deployed report flow with a synthetic PDF after the API exists. Verify Anushka can see the private `reports/` object, the owning patient can download it and another patient cannot. Run Shreya's basic CloudWatch checks after traffic exists.

### Verify the app from Windows

Install the local Session Manager plugin for the CLI tunnel. Keep the tunnel open and run the `curl.exe` command in a second shell. If an SSM release fails, inspect its recorded status and use host-side logs through an approved session. [AWS Session Manager instructions](https://docs.aws.amazon.com/systems-manager/latest/userguide/session-manager-working-with-sessions-start.html)

```powershell
aws @awsArgs ssm start-session --target $instanceId --document-name AWS-StartPortForwardingSession --parameters 'portNumber=3000,localPortNumber=3000'
curl.exe --fail --show-error http://127.0.0.1:3000/api/health
aws @awsArgs ssm get-command-invocation --command-id $commandId --instance-id $instanceId --query '{Status:Status,ResponseCode:ResponseCode}'
$metricsEnd = [DateTime]::UtcNow
aws @awsArgs cloudwatch get-metric-statistics --namespace AWS/EC2 --metric-name CPUUtilization `
  --dimensions "Name=InstanceId,Value=$instanceId" --period 300 --statistics Average `
  --start-time ($metricsEnd.AddHours(-1).ToString('o')) --end-time ($metricsEnd.ToString('o'))
```

## Cost and cleanup

Review the [Mumbai cost estimate](COSTS.md). After the demo and separate cleanup approval, close demo ingress, save evidence, and coordinate deletion with both resource owners. The app stack depends on the network stack. Shreya's RDS subnet group, attached SG and other VPC dependencies must be removed before deleting the network stack. Anushka owns S3 cleanup and S3 release objects persist until her team removes them. Check EBS, snapshots, RDS backup retention and S3 versions for continued charges.
