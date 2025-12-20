#!/usr/bin/env bash
set -euo pipefail

# Build the UI and run a quick sanity check against the root page.
# Intended for CI post-merge checks.

echo "Installing dependencies..."
npm ci

echo "Building UI..."
npm run build

# Start next in background
echo "Starting server..."
npx next start -p 3000 &
SERVER_PID=$!

# wait for server to respond
npx wait-on http://localhost:3000

# check root returns 200
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 || true)
if [ "$HTTP_STATUS" != "200" ]; then
  echo "Smoke test failed: expected HTTP 200 but got $HTTP_STATUS"
  kill $SERVER_PID || true
  exit 1
fi

echo "Smoke test passed (HTTP 200)"
kill $SERVER_PID || true
exit 0
