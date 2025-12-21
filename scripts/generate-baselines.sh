#!/usr/bin/env bash
set -euo pipefail

echo "📸 Generating visual regression baselines..."

# Ensure Storybook is running (simple health check)
if ! curl -sS http://localhost:6006/index.json > /dev/null; then
  echo "⚠️  Storybook not responding on http://localhost:6006 — starting Storybook in background"
  if [ -d ui/storybook-static ]; then
    echo "✓ Serving static Storybook from ui/storybook-static"
    npx http-server ui/storybook-static -p 6006 &
    STORYBOOK_PID=$!
  else
    npm run storybook &
    STORYBOOK_PID=$!
  fi
  # wait for index.json
  for i in {1..30}; do
    if curl -sS http://localhost:6006/index.json > /dev/null; then
      break
    fi
    sleep 1
  done
else
  STORYBOOK_PID=""
fi

echo "✓ Storybook is available — running Playwright to capture baselines"

UPDATE_SNAPSHOTS=1 DOCKER=1 ./scripts/playwright-docker.sh

if [ -n "${STORYBOOK_PID}" ]; then
  kill "$STORYBOOK_PID" || true
fi

echo "✓ Baselines generated in ui/e2e/baselines/"
echo "📝 Review changes and commit: npm run baselines:commit"
