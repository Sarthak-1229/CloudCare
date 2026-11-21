#requires -Version 7.0
[CmdletBinding()]
param(
    [Parameter(Mandatory)] [ValidateSet('Network', 'App')] [string] $Stage,
    [ValidateSet('Validate', 'Outputs', 'Deploy')] [string] $Mode = 'Validate',
    [switch] $PreviewChangeSet,
    [string] $AwsProfile,
    [string] $FoundationStackName = 'cloudcare-network',
    [string] $AppStackName = 'cloudcare-app',
    [string] $PublicAvailabilityZone,
    [string] $SecondPrivateAvailabilityZone,
    [string] $BucketName,
    [string] $DemoIngressCidr = ''
)

$ErrorActionPreference = 'Stop'
if ($PreviewChangeSet -and $Mode -ne 'Deploy') { throw 'Use -PreviewChangeSet with -Mode Deploy.' }
$aws = (Get-Command aws -CommandType Application -ErrorAction Stop | Select-Object -First 1).Source
$awsOptions = @('--region', 'ap-south-1', '--no-cli-pager')
if ($AwsProfile) { $awsOptions += @('--profile', $AwsProfile) }

$stackName = if ($Stage -eq 'Network') { $FoundationStackName } else { $AppStackName }
$templatePath = Join-Path $PSScriptRoot "$($Stage.ToLowerInvariant()).yaml"

switch ($Mode) {
    'Validate' {
        & $aws @awsOptions cloudformation validate-template --template-body "file://$templatePath" --output json
    }
    'Outputs' {
        & $aws @awsOptions cloudformation describe-stacks --stack-name $stackName --query 'Stacks[0].Outputs' --output json
    }
    'Deploy' {
        $deployOptions = @('--template-file', $templatePath, '--stack-name', $stackName, '--no-fail-on-empty-changeset', '--tags', 'Project=CloudCare')
        if ($PreviewChangeSet) { $deployOptions += '--no-execute-changeset' }
        if ($Stage -eq 'Network') {
            if ($PublicAvailabilityZone -notmatch '^ap-south-1[a-z]$' -or
                $SecondPrivateAvailabilityZone -notmatch '^ap-south-1[a-z]$' -or
                $PublicAvailabilityZone -eq $SecondPrivateAvailabilityZone) {
                throw 'Specify two distinct available ap-south-1 zones for the network.'
            }
            $deployOptions += @('--capabilities', 'CAPABILITY_IAM', '--parameter-overrides',
                "PublicAvailabilityZone=$PublicAvailabilityZone", "SecondPrivateAvailabilityZone=$SecondPrivateAvailabilityZone")
            if ($PSBoundParameters.ContainsKey('BucketName')) { $deployOptions += "BucketName=$BucketName" }
        } else {
            $deployOptions += @('--parameter-overrides', "FoundationStackName=$FoundationStackName", "DemoIngressCidr=$DemoIngressCidr")
        }
        & $aws @awsOptions cloudformation deploy @deployOptions
    }
}

if ($LASTEXITCODE -ne 0) { throw "CloudFormation $Mode failed (AWS CLI exit $LASTEXITCODE)." }
