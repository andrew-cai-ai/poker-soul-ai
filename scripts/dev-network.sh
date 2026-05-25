#!/usr/bin/env bash
# Start Next.js dev server on all interfaces for phone testing on LAN
set -euo pipefail
cd "$(dirname "$0")/.."

PORT="${PORT:-3000}"
HOST="0.0.0.0"

get_local_ip() {
  if [[ "$(uname -s)" == "Darwin" ]]; then
    ipconfig getifaddr en0 2>/dev/null || ipconfig getifaddr en1 2>/dev/null || true
  else
    hostname -I 2>/dev/null | awk '{print $1}' || true
  fi
}

LAN_IP="$(get_local_ip)"

echo ""
echo "  Poker Soul AI — dev server"
echo "  ─────────────────────────"
echo "  Local:   http://localhost:${PORT}"
if [[ -n "${LAN_IP}" ]]; then
  echo "  Network: http://${LAN_IP}:${PORT}"
  echo ""
  echo "  Mobile testing (same WiFi):"
  echo "  http://${LAN_IP}:${PORT}/fortune"
else
  echo "  Network: (LAN IP not found — connect WiFi and retry)"
fi
echo "  ─────────────────────────"
echo ""

exec npx next dev -H "${HOST}" -p "${PORT}"
