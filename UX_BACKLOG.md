# UX Backlog — Kanban UI

This backlog tracks next UX and E2E work for the Kanban UI integrated with the MCP server.

1. E2E: Playwright test for DnD → update flow (High)
   - Description: Add Playwright E2E that opens the Kanban page, performs a drag from Backlog → In Progress, and verifies the API call to `/api/issues/update` and that the issue state changes in GitHub (via MCP tools or mocked GH responses).
   - Effort: 5
   - Acceptance: Playwright test passes locally and in CI for dev server.

2. Accessibility Audit & Fixes (High)
   - Description: Run axe/a11y audit, fix keyboard navigation, color contrast, and screen reader labels for Board and IssueCard.
   - Effort: 3
   - Acceptance: Axe score improved and keyboard flows work.

3. CI: Add Verify & Playwright job (Medium)
   - Description: Add GitHub Action job to run `verify-singularity.js` and Playwright E2E on PRs; skip GH authenticated flows when token missing.
   - Effort: 2
   - Acceptance: Workflow runs on PR and reports results.

4. Visual tokens & theme polish (Medium)
   - Description: Extract theme tokens (colors, spacing) and support light/dark mode toggles.
   - Effort: 3

5. Performance: DnD optimization (Low)
   - Description: Measure and optimize framer-motion & re-render hotspots during drag.
   - Effort: 2


---

If you want, I can create GH issues for the top 3 items and start the first task (E2E) by creating a branch and opening a PR. Let me know which tasks you want started immediately.