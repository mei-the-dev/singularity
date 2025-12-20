# EPIC-UX-005 — E2E & Visual Regression (Playwright + Chromatic)

Goal: Ensure end-to-end flows and visual regressions are tested in CI reliably and non-interactively.

Milestones:
- Harden Playwright config and add headless Chromium project in CI
- Add Playwright console capture and screenshot tests for DnD and pipeline flows
- Integrate Storybook snapshots with Chromatic or Playwright image comparison
- Add flakiness mitigation strategies and retries in CI

Acceptance criteria:
- E2E job is reliable and passes on PRs
- Visual diffs are surfaced in PRs for design review
