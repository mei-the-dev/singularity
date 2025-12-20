# Plan: Storybook + Playwright Rollout

Meta-epic: https://github.com/mei-the-dev/singularity/issues/101

## Goal
Implement a Storybook-driven workflow and Playwright visual/interaction testing for all UI components.

## Epics created
- Inventory & Manifest: https://github.com/mei-the-dev/singularity/issues/94
- Addons & MCP: https://github.com/mei-the-dev/singularity/issues/95
- Stories & CSF3 Migration: https://github.com/mei-the-dev/singularity/issues/96
- Playwright Tests: https://github.com/mei-the-dev/singularity/issues/97
- CI Smoke-Checks: https://github.com/mei-the-dev/singularity/issues/98
- Accessibility & A11y: https://github.com/mei-the-dev/singularity/issues/99
- Docs & Onboarding: https://github.com/mei-the-dev/singularity/issues/100

## Next actions (short-term)
1. Run `node mcp/tools/list-all-components.js` and push `refs/storybook-components-inventory.json`.
2. Create per-component issues for missing stories (start with top 10 components). 
3. Add Storybook MCP config in `ui/.storybook` and validate with `mcp/tools/check_storybook_mcp.js`.
4. Draft `playwright` tests for 3 critical stories (Board, IssueCard, BlackholeBackground), run in Docker.
5. Add GH Actions job to run `check_storybook_mcp.js` as a pre-check for Playwright tests.

## Contact
If you'd like, I can begin by running the inventory and opening the first set of per-component tasks.
