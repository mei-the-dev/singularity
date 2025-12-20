EPIC-UX-005: E2E & Visual Regression (Playwright + Storybook snapshots)

Goal:
- Add Playwright end-to-end tests that verify keyboard and mouse DnD flows and pipeline runs.
- Add visual snapshot capture for Storybook components (IssueCard, KanbanColumn) and a CI job to compare changes.

Initial Steps:
1. Add Playwright test scaffold under `ui/e2e/` with a DnD flow and pipeline run simulation.
2. Ensure `ui/package.json` has `playwright:install` and `playwright:test` scripts and that the non-interactive install is used in CI.
3. Add `ui/.github/workflows/ui-e2e.yml` job (or update existing) to run install + tests headlessly and publish snapshots.
4. Add Storybook snapshot job (Chromatic or Playwright) and document how to review visual diffs.

Acceptance Criteria:
- Playwright tests run in CI and pass on the PR.
- Visual snapshot job reports diffs for UI changes.

Notes:
- Use `mcp_singularity-c_check_pipeline` to validate pipeline interactions in tests.
- Start with 1-2 core flows and expand coverage iteratively.

CI: Added debug listing of ui/node_modules/.bin to help diagnose 'storybook: command not found' failures.
- CI: Use Playwright action to set up browsers reliably in CI (preferred fallback to Docker).
