#!/usr/bin/env bash
# Repeatable deploy/update for kowa_website_rag on the Sakura VPS (non-Docker path).
# Run on the VPS itself (invoked over ssh). Requires bootstrap_vps.sh to have
# run at least once (systemd unit + .env in place).
#
# Usage: deploy.sh [branch] [repo_dir]
#   branch    defaults to main
#   repo_dir  defaults to /opt/kowa_website_rag

set -euo pipefail

BRANCH="${1:-main}"
REPO_DIR="${2:-/opt/kowa_website_rag}"
SERVICE_NAME="kowa-website-rag"
HEALTH_URL="http://127.0.0.1:3000"
HEALTH_TIMEOUT_SECS=15

log() { echo "==> $*"; }
fail() { echo "ERROR: $*" >&2; exit 1; }

cd "$REPO_DIR" || fail "$REPO_DIR does not exist — run bootstrap_vps.sh first"

if [[ ! -f "$REPO_DIR/.env" ]]; then
  fail ".env missing at $REPO_DIR/.env — run bootstrap_vps.sh and fill in secrets first"
fi

log "Fetching latest from origin"
git fetch origin

log "Fast-forwarding to origin/${BRANCH}"
git merge --ff-only "origin/${BRANCH}" \
  || fail "local checkout has diverged from origin/${BRANCH} — resolve manually (do not auto-discard state on a production box)"

log "Installing dependencies (npm ci)"
npm ci

log "Building production bundle"
npm run build

log "Restarting ${SERVICE_NAME}"
sudo systemctl restart "$SERVICE_NAME"

log "Waiting for ${HEALTH_URL} to respond (timeout ${HEALTH_TIMEOUT_SECS}s)"
elapsed=0
until curl -sf "$HEALTH_URL" >/dev/null 2>&1; do
  sleep 1
  elapsed=$((elapsed + 1))
  if (( elapsed >= HEALTH_TIMEOUT_SECS )); then
    echo "---- recent logs for ${SERVICE_NAME} ----" >&2
    sudo journalctl -u "$SERVICE_NAME" -n 50 --no-pager >&2 || true
    fail "app did not become healthy on ${HEALTH_URL} within ${HEALTH_TIMEOUT_SECS}s"
  fi
done

log "Deploy successful — ${HEALTH_URL} is responding"
sudo systemctl status "$SERVICE_NAME" --no-pager
