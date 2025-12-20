#!/usr/bin/env bash
set -euo pipefail

# Runs Playwright tests inside the official Playwright Docker image and writes artifacts to the repo
# Usage: ./bin/playwright-docker.sh [--tests "ui/e2e/tests"] [--project chromium]

WORKDIR="$(pwd)"
TEST_PATH="${1:-ui/e2e/tests}"
PROJECT="${2:-chromium}"
IMAGE="${PLAYWRIGHT_DOCKER_IMAGE:-mcr.microsoft.com/playwright:v1.57.0-jammy}"

echo "Running Playwright tests inside Docker image ${IMAGE}"

# Ensure baseline output dir exists
mkdir -p "${WORKDIR}/ui/e2e/tests/baselines"

docker run --rm --network host -v "${WORKDIR}:/work" -w /work "${IMAGE}" bash -lc \
  "export STORYBOOK_URL=http://localhost:6006 && npx playwright test ${TEST_PATH} --project=${PROJECT} --config=playwright.config.js --reporter=list"

EXIT=$?
if [ $EXIT -eq 0 ]; then
  echo "Playwright tests finished successfully"
  exit 0
else
  echo "Playwright tests failed with exit code $EXIT" >&2
  exit $EXIT
fi
