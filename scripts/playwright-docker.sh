#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

echo "🎭 Playwright Docker runner starting..."

if [ "${DOCKER:-}" = "1" ] || [ "${CI:-}" = "true" ]; then
  echo "Using Playwright Docker image"
  IMAGE="mcr.microsoft.com/playwright:v1.48.0-jammy"

  # Pull image if missing
  docker pull "$IMAGE" >/dev/null || true

  # Prepare docker run args
  ARGS=(--rm -v "$PWD":/workspace -w /workspace -e CI -e UPDATE_SNAPSHOTS)
  # Map current user to avoid permission issues
  ARGS+=( -u "$(id -u):$(id -g)" )

  # Run Playwright inside container
  docker run "${ARGS[@]}" "$IMAGE" bash -lc "npm run test:visual ${UPDATE_SNAPSHOTS:+-- --update-snapshots}" || exit 1
else
  echo "Running Playwright locally"
  if [ "${UPDATE_SNAPSHOTS:-}" = "1" ]; then
    npx playwright test --update-snapshots
  else
    npx playwright test
  fi
fi

echo "✅ Playwright run finished"
