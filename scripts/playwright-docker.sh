#!/usr/bin/env bash
set -euo pipefail

# Lightweight Playwright Docker runner - wraps existing bin/playwright-docker.sh if present
ROOT=$(cd "$(dirname "$0")/.." && pwd)
cd "$ROOT"

TESTS_PATH=${1:-ui/e2e/tests}
PROJECT=${2:-chromium}

echo "[playwright-docker] tests=$TESTS_PATH project=$PROJECT"

if [ -x "${ROOT}/bin/playwright-docker.sh" ]; then
  echo "Using existing bin/playwright-docker.sh"
  export UPDATE_SNAPSHOTS=${UPDATE_SNAPSHOTS:-}
  exec "${ROOT}/bin/playwright-docker.sh" "$TESTS_PATH" "$PROJECT"
else
  echo "No bin/playwright-docker.sh found; running npx playwright locally"
  export STORYBOOK_URL=${STORYBOOK_URL:-http://localhost:6006}
  npx playwright test "$TESTS_PATH" --project="$PROJECT" ${UPDATE_SNAPSHOTS:+--update-snapshots}
fi
