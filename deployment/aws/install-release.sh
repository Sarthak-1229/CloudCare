#!/bin/bash
set -euo pipefail

source_dir=$1
sha256=$2
[[ $sha256 =~ ^[a-f0-9]{64}$ ]]

app_root=/opt/cloudcare
release="$app_root/releases/$sha256"
if [[ $(id -u) != 0 ]]; then
  echo 'Run the release installer as root through Systems Manager.' >&2
  exit 1
fi

# Serialize deployments so a concurrent release cannot change the rollback target.
exec 9>"$app_root/deploy.lock"
flock -w 30 9

if [[ ! -d $release ]]; then
  incoming=$(mktemp -d "$app_root/releases/.incoming.XXXXXXXX")
  trap 'rm -rf -- "$incoming"' EXIT
  cp -R -- "$source_dir/backend" "$source_dir/package.json" "$source_dir/package-lock.json" "$incoming/"
  chown -R cloudcare:cloudcare "$incoming"
  (
    cd "$incoming"
    runuser -u cloudcare -- env npm_config_cache="$incoming/.npm-cache" npm ci --omit=dev --ignore-scripts --no-audit --no-fund
  )
  rm -rf -- "$incoming/.npm-cache"
  chown -R root:root "$incoming"
  chmod 0755 "$incoming"
  mv -T -- "$incoming" "$release"
fi

unit=/etc/systemd/system/cloudcare.service
if [[ ! -f $unit ]]; then
  install -m 0644 "$source_dir/deployment/aws/cloudcare.service" "$unit"
fi
systemctl daemon-reload

previous=$(readlink "$app_root/current" || true)
activate_release() {
  ln -sfn -- "$1" "$app_root/.next"
  mv -Tf -- "$app_root/.next" "$app_root/current"
}

activate_release "$release"
if systemctl restart cloudcare.service &&
  curl --fail --silent --show-error --retry 8 --retry-connrefused --retry-delay 1 --max-time 4 \
    http://127.0.0.1:3000/api/health; then
  systemctl enable cloudcare.service
else
  echo 'CloudCare did not pass its local health check. Restoring the previous release.' >&2
  if [[ -n $previous ]]; then
    activate_release "$previous"
    systemctl restart cloudcare.service
  else
    systemctl stop cloudcare.service
    rm -f -- "$app_root/current"
  fi
  exit 1
fi
