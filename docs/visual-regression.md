# Visual Regression Testing (Design)

## Goal
Add deterministic visual regression testing for Storybook components using Playwright running in Docker. The pipeline should:

- Build a static Storybook (`build-storybook`) and serve it for Playwright.
- Run Playwright tests in Docker to ensure consistent browser binaries.
- Use Playwright's `toHaveScreenshot` to assert visual correctness.
- Support generating baselines (update snapshots) and comparing in PRs.
- Bundle artifacts and metadata for CI uploads on failure.

## Acceptance Criteria
- Playwright tests include at least one `toHaveScreenshot` assertion targeting a story iframe.
- CLI support: `npm --workspace=ui run test:e2e:update` to generate baselines (works in Docker wrapper).
- Baselines are stored under `ui/e2e/tests/baselines/` and can be uploaded as artifacts.
- PR job downloads baseline artifact and fails if diffs are detected, uploading a diff bundle with metadata.

## How to generate baselines (local / CI)

- Local (Docker):
  - Ensure Storybook static is built and served: `npm --workspace=ui run build-storybook && npx serve ui/storybook-static -l 6006` (or use the project helper).
  - Run Playwright in update mode inside the project's Docker wrapper:

    PLAYWRIGHT_DOCKER_IMAGE=mcr.microsoft.com/playwright:v1.57.0-jammy UPDATE_SNAPSHOTS=1 ./bin/playwright-docker.sh ui/e2e/tests chromium

  - After the run, any generated screenshot files will be copied into `ui/e2e/tests/baselines/` (best-effort via the ops helper).

- CI:
  - Add a baseline job that runs the same command and uploads `ui/e2e/tests/baselines/` as an artifact for PR jobs to download and compare against.

## Implementation Notes
- Use `UPDATE_SNAPSHOTS=1` env var passed into `bin/playwright-docker.sh` to toggle update mode.
- Bundle baselines along with test-results and docker logs into `.task-context/artifacts/` as a tar.gz with `metadata.json`.
