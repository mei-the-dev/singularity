# Singularity — Complete Project Documentation

## Purpose
Singularity is an AI-augmented developer platform that integrates code generation, Storybook-driven UI development, automated interaction testing (Playwright), and a tool orchestration layer (MCP — Model Context Protocol). This document consolidates project purpose, architecture, development workflow, operational commands, testing matrix, CI guidance, contribution standards, and troubleshooting into a single authoritative reference for engineers.

---

## Table of Contents
- Overview
- Quickstart
- Repository layout
- Architecture overview
- MCP server and tools
- UI & Storybook
- Development environment & workflows
- Scaffolding & codegen patterns
- Testing strategy and matrix
- Continuous integration recommendations
- Release and versioning
- Contribution and PR guidelines
- Security & dependency management
- Troubleshooting
- References and further reading

---

## Overview
Singularity streamlines the developer experience by providing:
- A central MCP server to expose automation tools for scaffolding, testing, and repo operations.
- Opinionated, type-safe scaffolding for UI components and Storybook stories.
- Safe, targeted injection of Playwright `play` tests into stories to enable UI interaction testing.
- Utilities to orchestrate dev sessions, run Playwright tests (locally or in Docker), and manage Storybook/Playwright integration.

Design goals:
- Reliable codegen that produces TypeScript-compilable output.
- Non-destructive edits for code injection (avoid brittle regex where possible).
- Clear developer workflows and repeatable automation for test and CI.

---

## Quickstart (developer)
1. Install prerequisites: Node.js 18+, npm, Git. Optionally Docker for containerized tests.
2. Install repository dependencies:

```bash
npm ci
cd ui && npm ci && cd ..
```

3. Install Playwright browsers (if running E2E locally):

```bash
npx playwright install
```

4. Start Storybook (dev):

```bash
npm --workspace=ui run storybook
```

5. Start the MCP server (for tooling):

```bash
node mcp/index.js
```

6. Run Playwright tests (example):

```bash
STORYBOOK_URL=http://localhost:9001 npx playwright test ui/e2e/tests --project=chromium
```

---

## Repository layout
Top-level directories and purpose:
- `mcp/` — MCP server, tools, registrations, and tests.
- `ui/` — Canonical frontend application, components, Storybook config, and E2E tests. This is the single source of truth for UI development and testing; other UI folders (e.g., `beta_ui_test2`, `unified-ui`) have been archived after consolidation.
- `bin/` — Scripts and helpers for starting services.
- `scripts/` — Utility scripts for setup and CI.
- `refs/` — Design notes, drafts, and references.
- `docs/` — Project documentation (this file, dev guides, architecture).
- `storybook-static/` — Built static Storybook artifacts.

Key files:
- `mcp/index.js` — MCP server entry registering callable tools.
- `mcp/tools/` — Modular tool implementations (file ops, git, storybook adapters, scaffolding).
- `ui/.storybook/` — Storybook configuration.

---

## Architecture overview
High-level components:
- MCP server: An orchestration layer that exposes tools via the Model Context Protocol. Tools accept JSON-validated input and return structured responses. The server operates over stdio or other transports supported by the MCP SDK.
- UI app: React/Next app with an organized component library and Storybook stories that also serve as test harnesses.
- Playwright test runner: Executes E2E tests against Storybook stories or the running app.

Typical flow examples:
- Scaffold a new component via MCP → New component files and story are generated → Storybook picks up story → Inject `play` tests via scaffold tool → Run Playwright against the manifest.
- Start a dev session with `start_dev`/`start_development_session` → MCP orchestrates services (Storybook, Next dev server) → run tests.

---

## MCP server and tools
The MCP server lives at `mcp/index.js` and registers tools in the `TOOLS` array with the following attributes:
- `name` — string command used to invoke tool
- `handler` — function implementing behavior
- `schema` — JSON schema (or Zod equivalent) describing inputs, used for validation

Important built-in tools:
- Service orchestration: `start_service`, `start_dev`, `check_services`.
- Playwright helpers: `run_playwright_docker`, `install_playwright_binaries`.
- File ops: `read_file`, `write_file`, `stat_file`, `search_code`, `explore_file_tree`.
- Git ops: `list_issues`, `create_issue`, `create_pr`, `start_task`, `get_git_diff`, `update_issue`.
- Storybook adapters: `storybook_list_components`, `storybook_get_component_doc`, `get_ui_building_instructions`, `get_story_urls`.
- Scaffolding (new additions): `scaffold_atomic_component` (type-inferred TypeScript scaffolding) and `add_interaction_test` (safe play test injection).

Extending tools:
- Add modules under `mcp/tools/` and register them in `mcp/index.js`.
- Prefer small, testable handlers; validate inputs and return structured results.

---

## UI & Storybook
- Component organization: atomic design with `atoms/`, `molecules/`, and `organisms/` inside `ui/components/`.
- Each component should include a Storybook story and optional tests colocated.
- Use Storybook as living documentation; stories should demonstrate common states and accessibility roles for testability.
- Use `scaffold_atomic_component` to generate components with inferred prop types and valid story args.

Storybook best practices:
- Keep stories focused and composable.
- Use `args` and `controls` for interactive knobs.
- Add `play` functions for important interactions and assertions where appropriate.

---

## Development environment & workflows
Branching model:
- Use feature branches: `task/<issue-number>` or `feature/<short-name>`.
- Keep commits focused and testable.

Local workflow:
1. Create branch.
2. Run tests locally (`npm test` in `mcp`, `npx playwright test` in `ui` as needed).
3. Run Storybook and validate visually.
4. Use MCP tooling to scaffold or modify code as needed.
5. Open PR with description, screenshots, and Storybook link.

Automated workflows:
- CI should run lint, unit tests, Storybook build, and Playwright tests for PRs.

---

## Scaffolding & codegen patterns
Scaffolding goals:
- Output valid TypeScript that compiles without manual edits.
- Avoid brittle string stubbing; generate reasonable mocks based on prop naming conventions.

Key patterns implemented:
- Type inference heuristics: `is*`, `has*` → boolean; `count`, `id`, `index` → number; `on*` → function; `*Data`, `*Object` → any/object; otherwise string.
- Story scaffolding generates valid `args` with function stubs for handlers and usable mock values for primitive props.
- Test injection finds the target story export and inserts a `play` function, avoiding duplicated imports and minimizing syntactic risk.

When adding new scaffolds:
- Add a test that checks output compiles with `tsc`.
- Include an example Storybook story and optional Playwright test.

---

## Testing strategy and matrix
Testing levels:
- Unit tests: Fast, run on every commit (Jest for `mcp/`, component-level tests as applicable).
- Integration tests: Cross-module checks (e.g., MCP tool execution mocking filesystem and verifying output).
- E2E: Playwright tests run against Storybook or running app.

Suggested test matrix for CI:
- Node versions: 18, 20 (matrix runs optional)
- Browsers: chromium (CI), optionally firefox and webkit for full coverage
- OS: linux-latest (CI), macOS/windows optional for broader compatibility

Playwright usage:
- Use `STORYBOOK_URL` environment variable to point at Storybook static server or dev server.
- Prefer running Playwright against built static Storybook in CI to reduce flakiness:

```bash
npx -y storybook build --output-dir ui/storybook-static --config-dir ui/.storybook
npx -y serve ui/storybook-static -l 9001 &
STORYBOOK_URL=http://localhost:9001 npx playwright test ui/e2e/tests --project=chromium
```

Test flakiness mitigations:
- Increase timeouts for slow CI environments.
- Use `retries` conservatively and investigate recurring flakes.
- Pin Playwright and browser versions in CI to avoid unexpected changes.

---

## Continuous integration recommendations
CI stages (suggested):
1. Install dependencies (`npm ci` for repo and `cd ui && npm ci`).
2. Lint and type check (`npm run lint`, `npx tsc --noEmit`).
3. Run unit tests.
4. Build Storybook and serve static output.
5. Run Playwright E2E tests against static Storybook.
6. Package artifacts and report test summaries.

Secrets and environment:
- Use CI secrets for tokens (if creating PRs or calling external APIs).
- Use `STORYBOOK_URL` to provide the Storybook endpoint to Playwright jobs.

Caching:
- Cache `node_modules` and Playwright browsers across CI runs for speed.

---

## Release and versioning
- Follow semantic versioning for public packages. For repo-level artifacts, use tags like `vX.Y.Z`.
- For MCP server and tools, include a CHANGELOG entry per notable change.
- When making backward-incompatible changes to tools, increment major version and document migration steps.

---

## Contribution and PR guidelines
- Include a clear title and description.
- Link any related issues and include testing instructions.
- Provide Storybook links or screenshots for UI changes.
- Add or update tests for new behavior.
- Keep PRs small and focused.

Code review checklist:
- Does the change include tests where applicable?
- Does TypeScript type-check without errors?
- Are new dependencies necessary and vetted?
- Is documentation updated if public behavior changed?

---

## Security & dependency management
- Run `npm audit` in CI and act on critical findings.
- Regularly update dependencies and test for regressions.
- Limit token scopes and use least privilege for CI service accounts.

---

## Troubleshooting
Common issues and fixes:
- Storybook high memory usage: Build static Storybook and serve it instead of running dev server in CI.
- Playwright cannot connect: Verify `STORYBOOK_URL` and that the server is reachable from the test runner.
- Generated scaffolds cause type errors: Ensure the scaffold tool uses the latest inference rules; run `tsc` to diagnose.

How to debug locally:
- Run `node mcp/index.js` and call tools interactively with a small client or script.
- Use `npx playwright test --debug` to reproduce flaky tests.

---

## References and further reading
- Project MCP server docs: [mcp/SERVER_DOCS.md](mcp/SERVER_DOCS.md)
- Software engineer handbook: [docs/SOFTWARE_ENGINEER_GUIDE.md](docs/SOFTWARE_ENGINEER_GUIDE.md)
- Developer setup: [docs/DEV_SETUP.md](docs/DEV_SETUP.md)
- Architecture: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)
- Component spec: [ui/SPECIFICATION.md](ui/SPECIFICATION.md)

---

## Next steps and maintenance
- Finalize CI configuration and add Playwright runs against static Storybook.
- Add `CONTRIBUTING.md` and a PR template file to standardize submissions.
- Expand scaffolding tests to ensure every generated component compiles cleanly.

---

This consolidated documentation is the canonical engineering reference. Keep it updated as the project evolves.