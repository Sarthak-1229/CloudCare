#requires -Version 7.0
[CmdletBinding()]
param(
    [Parameter(Mandatory)] [string] $Commit,
    [string] $OutputDirectory = [System.IO.Path]::GetTempPath(),
    [switch] $Deploy,
    [ValidatePattern('^[a-z0-9][a-z0-9.-]{1,61}[a-z0-9]$')] [string] $BucketName,
    [ValidatePattern('^i-(?:[0-9a-f]{8}|[0-9a-f]{17})$')] [string] $InstanceId,
    [string] $AwsProfile
)

$ErrorActionPreference = 'Stop'
if ($Deploy -and (!$BucketName -or !$InstanceId)) {
    throw 'Specify the confirmed bucket name and instance ID to deploy.'
}

$repo = (Resolve-Path -LiteralPath (Join-Path $PSScriptRoot '../..')).ProviderPath
$git = (Get-Command git -CommandType Application -ErrorAction Stop | Select-Object -First 1).Source
$revision = & $git -C $repo rev-parse --verify --end-of-options "${Commit}^{commit}"
if ($LASTEXITCODE -ne 0) { throw 'Select a verified Git commit to package.' }

$releaseInputs = @('package.json', 'package-lock.json', 'backend',
    'deployment/aws/install-release.sh', 'deployment/aws/cloudcare.service')
$trackedFiles = & $git -C $repo ls-tree -r --name-only $revision -- @releaseInputs
if ($LASTEXITCODE -ne 0) { throw 'Could not inspect the release inputs.' }
$requiredFiles = @($releaseInputs | Where-Object { $_ -ne 'backend' }) + 'backend/server.js'
if ($requiredFiles | Where-Object { $_ -notin $trackedFiles }) {
    throw 'Select a commit that includes the package manifests and the EC2 installer and service files.'
}
if ($trackedFiles -match '(^|/)\.env($|\.)|\.(pem|key|pfx|p12)$') {
    throw 'The selected commit contains a private configuration or key path in the release inputs.'
}

$output = (Resolve-Path -LiteralPath $OutputDirectory).ProviderPath
$archive = Join-Path $output ('cloudcare-{0}-{1}.tar.gz' -f $revision.Substring(0, 12), [guid]::NewGuid().ToString('N'))
& $git -C $repo archive --format=tar.gz "--output=$archive" $revision -- @releaseInputs
if ($LASTEXITCODE -ne 0) { throw 'Could not create the backend release archive.' }

$sha256 = (Get-FileHash -Algorithm SHA256 -LiteralPath $archive).Hash.ToLowerInvariant()
[pscustomobject]@{ Commit = $revision; Archive = $archive; Sha256 = $sha256 }
if (!$Deploy) { return }

$aws = (Get-Command aws -CommandType Application -ErrorAction Stop | Select-Object -First 1).Source
$awsOptions = @('--region', 'ap-south-1', '--no-cli-pager')
if ($AwsProfile) { $awsOptions += @('--profile', $AwsProfile) }

$ping = & $aws @awsOptions ssm describe-instance-information --filters "Key=InstanceIds,Values=$InstanceId" --query 'InstanceInformationList[0].PingStatus' --output text
if ($LASTEXITCODE -ne 0 -or $ping -ne 'Online') { throw 'The target is not an online SSM managed instance.' }

$artifactUri = "s3://$BucketName/deployment/cloudcare/$sha256.tar.gz"
& $aws @awsOptions s3 cp $archive $artifactUri --only-show-errors --sse AES256
if ($LASTEXITCODE -ne 0) { throw 'Could not upload the release to the approved private bucket.' }

$remoteScript = @'
#!/bin/bash
set -euo pipefail
cloud-init status --wait
work=$(mktemp -d)
trap 'rm -rf -- "$work"' EXIT
aws s3 cp '__ARTIFACT_URI__' "$work/release.tar.gz" --region ap-south-1 --only-show-errors
printf '%s  %s\n' '__SHA256__' "$work/release.tar.gz" | sha256sum --check --status
tar -xzf "$work/release.tar.gz" -C "$work"
bash "$work/deployment/aws/install-release.sh" "$work" '__SHA256__'
'@
$remoteScript = $remoteScript.Replace('__ARTIFACT_URI__', $artifactUri).Replace('__SHA256__', $sha256).Replace("`r`n", "`n")
$commandInput = @{
    DocumentName = 'AWS-RunShellScript'
    InstanceIds = @($InstanceId)
    Comment = "CloudCare backend $($revision.Substring(0, 12))"
    Parameters = @{ commands = @($remoteScript); executionTimeout = @('600') }
}

$commandFile = New-TemporaryFile
try {
    $commandInput | ConvertTo-Json -Depth 5 | Set-Content -LiteralPath $commandFile.FullName -Encoding utf8NoBOM
    $commandId = & $aws @awsOptions ssm send-command --cli-input-json "file://$($commandFile.FullName)" --query 'Command.CommandId' --output text
    if ($LASTEXITCODE -ne 0) { throw 'Could not submit the installation to Systems Manager.' }
} finally {
    Remove-Item -LiteralPath $commandFile.FullName
}

Write-Host "SSM command ID $commandId"
$deadline = (Get-Date).AddMinutes(12)
do {
    $status = & $aws @awsOptions ssm list-command-invocations --command-id $commandId --instance-id $InstanceId --query 'CommandInvocations[0].Status' --output text
    if ($LASTEXITCODE -ne 0) { throw "Could not read status for SSM command $commandId." }
    if ($status -eq 'Success') { return }
    if ($status -notin @('None', 'Pending', 'InProgress', 'Delayed', 'Cancelling')) {
        throw "Backend deployment finished with SSM status $status for command $commandId."
    }
    Start-Sleep -Seconds 5
} while ((Get-Date) -lt $deadline)

throw "Timed out waiting for SSM command $commandId. Check its status before retrying."
