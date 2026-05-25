#!/usr/bin/env bash
# Kill stale Next.js dev servers and clear corrupted .next cache
set -euo pipefail
cd "$(dirname "$0")/.."

echo "Stopping processes on port 3000..."
for _ in 1 2 3; do
  if lsof -ti :3000 >/dev/null 2>&1; then
    lsof -ti :3000 | xargs kill -9 2>/dev/null || true
    sleep 1
  fi
done

pkill -9 -f "poker-soul-ai.*next dev" 2>/dev/null || true
sleep 1

echo "Removing .next cache..."
rm -rf .next

PORT=3000
if lsof -ti :3000 >/dev/null 2>&1; then
  echo "Port 3000 still in use — using 3002 instead."
  echo "Close other terminals running 'npm run dev', or run: kill -9 \$(lsof -ti :3000)"
  PORT=3002
fi

echo "Starting dev server at http://127.0.0.1:${PORT}"
exec npx next dev -H 127.0.0.1 -p "${PORT}"
