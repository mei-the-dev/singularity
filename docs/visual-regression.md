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

### Note about `@storybook/addon-essentials`

Storybook v10 does not have a published `@storybook/addon-essentials@^10.x` package. If your `.storybook/main.*` references `@storybook/addon-essentials` you may see install errors. The recommended workaround is to include the specific addons you need instead of `addon-essentials` — for example:

- `@storybook/addon-actions`
- `@storybook/addon-controls`
- `@storybook/addon-backgrounds`

In this repository we replaced `@storybook/addon-essentials` with the explicit addons above and installed compatible versions. To reproduce locally:

```bash
# add specific addons (the repo uses versions compatible with the current setup)
npm --workspace=ui install --save-dev @storybook/addon-actions@^9.0.8 @storybook/addon-controls@^9.0.8 @storybook/addon-backgrounds@^9.0.8 --legacy-peer-deps
```

This avoids the `No matching version found for @storybook/addon-essentials@^10.1.10` error when installing Storybook-related packages.
