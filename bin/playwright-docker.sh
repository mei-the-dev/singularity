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

# Determine config file: prefer a config in the same folder as tests
TEST_DIR="$(dirname "${TEST_PATH}")"
CONFIG_ARG="playwright.config.js"
if [ -f "${WORKDIR}/${TEST_DIR}/playwright.config.js" ]; then
  CONFIG_ARG="${TEST_DIR}/playwright.config.js"
fi

# If tests are inside a ui-sandbox variant, start a lightweight Python server to serve the built storybook inside the container
PRE_CMD=""
if echo "${TEST_PATH}" | grep -q "ui-sandbox"; then
  # If host already has a service on 6006, prefer that; otherwise start a container-local python server
  if curl -sS --max-time 2 http://127.0.0.1:6006/ > /dev/null 2>&1; then
    PRE_CMD="";
  else
    PRE_CMD="python3 -m http.server -d ${TEST_DIR}/../storybook-static 6006 & sleep 2;"
  fi
fi

# Prefer playwright.config.cjs in test dir when present
TEST_DIR="$(dirname "${TEST_PATH}")"
CONFIG_ARG="playwright.config.js"
if [ -f "${WORKDIR}/${TEST_DIR}/playwright.config.js" ]; then
  CONFIG_ARG="${TEST_DIR}/playwright.config.js"
elif [ -f "${WORKDIR}/${TEST_DIR}/playwright.config.cjs" ]; then
  CONFIG_ARG="${TEST_DIR}/playwright.config.cjs"
fi

# Should we pass --update-snapshots?
EXTRA_SNAPSHOT_ARG=""
if [ "${UPDATE_SNAPSHOTS:-}" = "1" ]; then
  EXTRA_SNAPSHOT_ARG="--update-snapshots"
fi

echo "Docker run command: docker run --rm --network host -v \"${WORKDIR}:/work\" -w /work \"${IMAGE}\" bash -lc 'export STORYBOOK_URL=http://localhost:6006 && ${PRE_CMD} npx playwright test ${TEST_PATH} --project=${PROJECT} --config=${CONFIG_ARG} --reporter=list ${EXTRA_SNAPSHOT_ARG}'"
# Run container as current host user to avoid root-owned artifacts. Fall back to 1000:1000 if id isn't available
UID_VAL=1000
GID_VAL=1000
if command -v id >/dev/null 2>&1; then
  UID_VAL=$(id -u)
  GID_VAL=$(id -g)
fi
USER_ARG="-u ${UID_VAL}:${GID_VAL}"

echo "Docker run command: docker run --rm ${USER_ARG} --network host -v \"${WORKDIR}:/work\" -w /work \"${IMAGE}\" bash -lc 'export STORYBOOK_URL=http://localhost:6006 && ${PRE_CMD} npx playwright test ${TEST_PATH} --project=${PROJECT} --config=${CONFIG_ARG} --reporter=list ${EXTRA_SNAPSHOT_ARG}'"

# Ensure test-results files are writable by target user: run a short chown as root in a throwaway container
if [ -d "${WORKDIR}/test-results" ]; then
  echo "Ensuring /work/test-results ownership for UID ${UID_VAL}:${GID_VAL}"
  docker run --rm -v "${WORKDIR}:/work" -w /work "${IMAGE}" bash -lc "chown -R ${UID_VAL}:${GID_VAL} /work/test-results || true"
fi

# Run tests as non-root user to avoid creating root-owned artifacts
docker run --rm ${USER_ARG} --network host -v "${WORKDIR}:/work" -w /work "${IMAGE}" bash -lc \
  "export STORYBOOK_URL=http://localhost:6006 && ${PRE_CMD} npx playwright test ${TEST_PATH} --project=${PROJECT} --config=${CONFIG_ARG} --reporter=list ${EXTRA_SNAPSHOT_ARG}"

EXIT=$?
if [ $EXIT -eq 0 ]; then
  echo "Playwright tests finished successfully"
  exit 0
else
  echo "Playwright tests failed with exit code $EXIT" >&2
  exit $EXIT
fi
