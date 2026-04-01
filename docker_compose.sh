#!/usr/bin/env bash

set -euo pipefail

COMPOSE_FILE="docker-compose.yml"

if ! command -v docker >/dev/null 2>&1; then
  echo "Error: docker is not installed."
  exit 1
fi

if [[ ! -f "$COMPOSE_FILE" ]]; then
  echo "Error: $COMPOSE_FILE not found in current directory."
  exit 1
fi

kill_port_3000_if_needed() {
  if ! command -v lsof >/dev/null 2>&1; then
    echo "Warning: lsof is not installed. Skipping port 3000 pre-check."
    return 0
  fi

  local pids
  pids="$(lsof -tiTCP:3000 -sTCP:LISTEN || true)"

  if [[ -z "$pids" ]]; then
    echo "Port 3000 is free."
    return 0
  fi

  echo "Port 3000 is in use by PID(s): $pids"
  echo "Killing process(es) on port 3000..."
  # shellcheck disable=SC2086
  kill -9 $pids
  echo "Port 3000 is now available."
}

run_build() {
  docker compose build "$@"
}

run_up() {
  kill_port_3000_if_needed
  docker compose up "$@"
}

run_down() {
  docker compose down "$@"
}

usage() {
  echo "Usage: $0 {build|up|down} [docker-compose-options]"
}

cmd="${1:-}"
shift || true

case "$cmd" in
  build)
    run_build "$@"
    ;;
  up)
    run_up "$@"
    ;;
  down)
    run_down "$@"
    ;;
  *)
    usage
    exit 1
    ;;
esac
