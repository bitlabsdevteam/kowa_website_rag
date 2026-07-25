#!/usr/bin/env bash
# One-time Sakura VPS provisioning for kowa_website_rag (non-Docker path).
# Run once per box; safe to re-run (each step is guarded). See deployment.md
# for the full manual runbook this automates, and web_hosting.md for the
# hosting-choice rationale.
#
# Usage: bootstrap_vps.sh <server_name> [repo_dir]
#   server_name  Nginx server_name for the initial (staging) host, e.g. new.kowatrade.com
#   repo_dir     defaults to /opt/kowa_website_rag

set -euo pipefail

SERVER_NAME="${1:?Usage: $0 <server_name> [repo_dir]}"
REPO_DIR="${2:-/opt/kowa_website_rag}"
REPO_URL="https://github.com/bitlabsdevteam/kowa_website_rag.git"
SERVICE_NAME="kowa-website-rag"
DEPLOY_USER="${SUDO_USER:-${USER}}"

log() { echo "==> $*"; }

step_apt_upgrade() {
  log "Updating apt package index and upgrading installed packages"
  sudo apt-get update
  sudo apt-get -y upgrade
}

step_install_node() {
  if command -v node >/dev/null 2>&1 && [[ "$(node -v)" == v22* ]]; then
    log "Node 22 already installed ($(node -v)) — skipping"
    return 0
  fi
  log "Installing Node 22 LTS via NodeSource"
  curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
  sudo apt-get -y install nodejs
  node -v
  npm -v
}

step_install_nginx_certbot() {
  if dpkg -s nginx >/dev/null 2>&1; then
    log "Nginx already installed — skipping"
  else
    log "Installing Nginx"
    sudo apt-get -y install nginx
  fi

  if dpkg -s certbot >/dev/null 2>&1; then
    log "Certbot already installed — skipping"
  else
    log "Installing Certbot (Nginx plugin)"
    sudo apt-get -y install certbot python3-certbot-nginx
  fi
}

step_clone_repo() {
  if [[ -d "$REPO_DIR/.git" ]]; then
    log "$REPO_DIR already a git checkout — leaving as-is (deploy.sh handles updates)"
    return 0
  fi
  log "Cloning $REPO_URL into $REPO_DIR"
  sudo mkdir -p "$REPO_DIR"
  sudo chown "$DEPLOY_USER":"$DEPLOY_USER" "$REPO_DIR"
  git clone "$REPO_URL" "$REPO_DIR"
}

step_env_file() {
  local env_file="$REPO_DIR/.env"
  if [[ -f "$env_file" ]]; then
    log ".env already present at $env_file — leaving as-is"
    return 0
  fi
  log "No .env found — seeding from .env.example (YOU MUST FILL IN REAL SECRETS)"
  cp "$REPO_DIR/.env.example" "$env_file"
  echo "    WARNING: $env_file contains only placeholder values."
  echo "    Fill in real secrets before running deploy.sh, or the app will fail to start correctly."
}

step_systemd_unit() {
  local unit_path="/etc/systemd/system/${SERVICE_NAME}.service"
  log "Writing systemd unit to $unit_path"
  sudo tee "$unit_path" >/dev/null <<EOF
[Unit]
Description=Kowa Website RAG (Next.js)
After=network.target

[Service]
Type=simple
User=${DEPLOY_USER}
WorkingDirectory=${REPO_DIR}
Environment=NODE_ENV=production
Environment=PORT=3000
ExecStart=/usr/bin/npm run start
Restart=on-failure
RestartSec=5

[Install]
WantedBy=multi-user.target
EOF
  sudo systemctl daemon-reload
  sudo systemctl enable "$SERVICE_NAME"
  log "$SERVICE_NAME enabled (not started yet — run deploy.sh once .env is filled in)"
}

step_nginx_site() {
  local avail="/etc/nginx/sites-available/kowa_website_rag"
  local enabled="/etc/nginx/sites-enabled/kowa_website_rag"
  log "Writing Nginx server block for $SERVER_NAME"
  sudo tee "$avail" >/dev/null <<EOF
server {
    listen 80;
    server_name ${SERVER_NAME};

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF
  sudo ln -sf "$avail" "$enabled"
  sudo nginx -t
  sudo systemctl reload nginx
}

step_sudoers() {
  if sudo -n true 2>/dev/null; then
    log "Passwordless sudo already works for $DEPLOY_USER — skipping sudoers drop-in"
    return 0
  fi
  local sudoers_path="/etc/sudoers.d/kowa-deploy"
  log "Installing scoped NOPASSWD sudoers rule for deploy.sh at $sudoers_path"
  local tmp
  tmp="$(mktemp)"
  cat >"$tmp" <<EOF
${DEPLOY_USER} ALL=(root) NOPASSWD: /usr/bin/systemctl restart ${SERVICE_NAME}, /usr/bin/systemctl status ${SERVICE_NAME}, /usr/bin/systemctl reload nginx
EOF
  sudo visudo -c -f "$tmp"
  sudo install -m 0440 "$tmp" "$sudoers_path"
  rm -f "$tmp"
}

main() {
  step_apt_upgrade
  step_install_node
  step_install_nginx_certbot
  step_clone_repo
  step_env_file
  step_systemd_unit
  step_nginx_site
  step_sudoers

  cat <<SUMMARY

==================== bootstrap complete ====================
Still to do manually:
  1. Fill in real secrets in ${REPO_DIR}/.env (see .env.example for the full list).
  2. In the Sakura VPS control panel, confirm the packet filter allows
     inbound TCP 80/443 (パケットフィルター設定) — this cannot be automated.
  3. Point DNS for ${SERVER_NAME} at this box's IP, then run deploy.sh for
     the first start:
       ${REPO_DIR}/scripts/deploy/deploy.sh
  4. Once the staging host is verified, follow deployment.md Step 7 for the
     staged TLS issuance and production domain cutover (kept manual on purpose).
==============================================================
SUMMARY
}

main "$@"
