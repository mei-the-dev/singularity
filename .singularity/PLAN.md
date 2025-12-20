# PLAN: UX Migration using Storybook (Issue #83)

Summary
-------
Migrate and standardize UI components to be Storybook-first. Add comprehensive stories for each component, include accessibility and data-testid coverage, and add Playwright visual tests that reference story URLs. Ensure MCP tools (addon-mcp) are used to discover components and to guide the AI-assisted authoring workflow.

Objectives
----------
- Ensure Storybook runs on port 6006 with `@storybook/addon-mcp` and `experimentalComponentsManifest: true`.
- Create/verify component stories for all primary components in `ui/components/` (Default + variants + edge cases).
- Add Playwright visual tests for each story and wire CI smoke-checks.
- Provide clear docs & agent instructions (`refs/storybook-mcp-install-v2.md`, `.github/copilot_instructions.md`, `.github/agents/singularity.agent.md`).

Milestones
----------
1. Discovery: call `list-all-components` via MCP and generate inventory.
2. Extraction/Refactor: migrate component code into `ui/components/` and create stories.
3. Testing: create Playwright tests per story, add snapshots and run locally.
4. CI: add MCP smoke-check step (already added) and ensure Playwright runs after it.
5. Docs: update `refs/` and agent instructions; train AI flows.
6. Ship: open PRs per component or small groups; verify pipeline.

Risks & Mitigations
-------------------
- Playwright visual tests are expensive; mitigate with early MCP smoke-check to avoid running them when Storybook is down.
- Version compatibility for `@storybook/addon-mcp`; ensure Storybook >= 9.1.16.

Deliverables
------------
- `ui/components/*` updated stories
- `tests/*` Playwright story-based tests
- `.github/workflows` has smoke-check (done) and visual test steps
- Updated docs and agent instructions

Contact
-------
Owner: @mei
Issue: https://github.com/mei-the-dev/singularity/issues/83

---

Start: In progress (discovery)
