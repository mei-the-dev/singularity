# MCP Server & Agent Integration: Diagnostic Report

This file documents the main issues encountered while using `my-mcp-server` (the local MCP server at `mcp/index.js`) together with the agent instructions in `/.github/agents/singularity.agent.md`. The goal is to provide an actionable, detailed list you can use to patch the MCP server implementation and the code-agent instructions to improve reliability and developer experience.

---

## Executive summary

- Primary runtime failures stem from shell-escaping problems when invoking `gh` via `execSync` with inline argument strings (especially `create_issue` with multi-line bodies). The quick fix is to use `execFileSync` and pass arguments as arrays.
- VS Code agent metadata in `/.github/agents/singularity.agent.md` had formatting/frontmatter problems (extraneous code fences, missing `appliesTo`), which broke agent discovery and mapping to MCP server IDs.
- Several MCP tools assume a particular working directory (the `mcp` subfolder) which breaks `gh` and `git` invocations; tools need robust repo-root detection (walk up for `.git`) and/or explicit `--repo` fallbacks.
- The UI bridge that spawns the MCP server expects structured JSON payloads but some tool implementations return raw text blobs or improperly encoded content; standardize tool outputs (JSON object) and the bridge parsing.
- File access tooling needed hardening (realpath canonicalization and whitelist), and `read_file` should support binary files (base64) and explicit max-size limits.

---

## Full list of problems (with repro and evidence)

1) create_issue fails when `body` contains newlines or quotes
   - Repro: calling MCP `create_issue` with a multi-line body resulted in gh CLI syntax errors or truncated input. Observed shell error: `failed to run git: fatal: not a git repository` or `Error: ...` depending on cwd.
   - Cause: `execSync` was used with an interpolated string. Newlines and quotes in the `body` are interpreted by the shell and break the command.
   - Evidence: `ref_git.js` (provided) demonstrates correct usage of `execFileSync` with argument arrays.

2) GH CLI/git commands run from `mcp` directory (not repo root)
   - Repro: `gh issue create` returned `fatal: not a git repository` when run by MCP tool handlers.
   - Cause: `execInRepo` used `path.resolve(__dirname, '..')` as `GIT_REPO_DIR` which is brittle in some setups (symlinks, mounts, or when repo root is further up). Also some places call `execSync` without reliable cwd.
   - Fix: detect repo root by walking parent directories for `.git` (and for bare non-worktree setups use env/GITHUB_REPOSITORY or `--repo` flag to gh). Provide robust fallback to `--repo owner/repo` when `GIT_REPO_DIR` not found.

3) Agent metadata file formatting and `appliesTo` mapping
   - Repro: The agent file contained code fences and malformed YAML frontmatter; VS Code agent matching failed or used stale tool lists.
   - Cause: The file was generated/edited with wrapper fences and inconsistent `tools` structure (an array of names vs `- name: ...` entries), and lacked `appliesTo` mapping for the local MCP server IDs used in `vscode-userdata:/home/mei/.config/Code/User/mcp.json` and `.vscode/settings.json`.
   - Fix: Ensure `/.github/agents/singularity.agent.md` has valid YAML frontmatter (no wrapping code fences), `appliesTo` listing server globs (e.g., `my-mcp-server-*`, `singularity-v21/*`), and `tools` as `- name: ...` with `description:`.

# MCP Server & Agent Integration: Diagnostic Report (V27)

Updated: 2025-12-19 — This file contains an up-to-date diagnostic for the local MCP server at `singularity/mcp` and the agent configuration in `/.github/agents/singularity.agent.md`. It records recent fixes, new issues discovered (Directory Misalignment), and an implementation plan to reach a robust V27 "Singularity Stable".

---

## Snapshot — fixes applied this session

- Replaced unsafe shell interpolation with `execFileSync`-based calls for GitHub CLI invocations.
- Added repo-root discovery (walk for `.git`) to avoid running `gh`/`git` inside the `mcp` folder.
- Implemented `read_file` and `stat_file` with a basic whitelist and encoding detection (utf8/base64).
- Added `update_issue` and `check_pipeline` handlers to `mcp/tools/git.js` and registered them in `mcp/index.js`.
- Rewrote `/.github/agents/singularity.agent.md` to a clean, actionable configuration (starters, tools, OODA protocol).

These removed the highest-impact failures (shell quoting, missing registrations, blind file reads).

---

## New critical issue: Directory Misalignment (root cause)

Root problem: the MCP server runs from `singularity/mcp` but many git/gh workflows must run from the repository root. Commands executed from `mcp` can yield `fatal: not a git repository` and cause cascading failures.

Symptoms:
- `gh issue create` and `git` commands failing when spawned by MCP tools.
- `start_task` attempted `git checkout main` and failed on repos with different default branches.

Resolution (already partially applied):
- Add robust `findRepoRoot()` logic and use it as the `cwd` for all git/gh invocations.
- Provide a `--repo owner/repo` fallback or `MCP_REPO_OVERRIDE` env var when repo root cannot be discovered.

---

## Full list of issues (updated)

1) Directory Misalignment (see above) — requires repo-root detection and `--repo` fallback.

2) Shell injection / quoting issues — resolved by using `execFileSync` with argument arrays for `gh` calls.

3) Missing tool registration mismatch — ensure `mcp/index.js` registers: `read_file`, `stat_file`, `update_issue`, `check_pipeline` (done in session; verify via `list-tools.js`).

4) `start_task` default branch assumptions — adjust to detect default branch instead of hardcoding `main`.

5) `read_file` hardening — canonicalize with `fs.realpathSync`, enforce `maxBytes` (e.g., 5MB), and return `{ binary:true, encoding:'base64', data }` for non-UTF8 files.

6) Tool output typing — standardize content types: `application/json` for JSON payloads and `application/octet-stream` for base64 binaries. Update UI bridge to respect `type`.

7) Spawn-per-request fragility in UI bridge — prefer long-lived MCP process or add connection pooling/timeouts.

8) GH CLI preflight — run `gh auth status` and return a clear error message when unauthenticated.

9) CI check for agent<>MCP parity — add an `npm script` that runs `list-tools.js` and compares against `singularity.agent.md` tool list, failing CI on mismatch.

---

## Concrete code changes recommended (priority)

1. Ensure every git/gh invocation uses `REPO_ROOT` discovered via `findRepoRoot()`; add `MCP_REPO_OVERRIDE` env var for explicit repo path.
2. In `mcp/tools/git.js`: detect default remote branch (origin/HEAD) and use it in `startTask` instead of `main`.
3. In `mcp/tools/files.js`: implement strong canonicalization (`fs.realpathSync`), `maxBytes`, and base64 encoding for binaries.
4. In `mcp/index.js`: standardize emitted `content` types (JSON vs binary) and update the UI bridge to parse `type` fields.
5. Add a CI check script that compares declared agent tools with `tools/list` output.

---

## Smoke tests / verification (commands)

Run these after deploying V27 changes:

```bash
node singularity/mcp/list-tools.js
node singularity/mcp/test-readfile-stat.js
node singularity/mcp/test-issue-workflow.js
```

Check default branch detection manually:

```bash
cd /path/to/repo && git symbolic-ref refs/remotes/origin/HEAD || git rev-parse --abbrev-ref origin/HEAD
```

---

## Agent instructions (how the agent must behave to avoid hallucination)

- Always call `tools/list` on startup and verify the requested tool exists before calling it. If missing, report the mismatch and do not emulate the tool.
- Always run `read_context` at session start; if empty, ask the user for the task or call `list_issues` to pick one.
- For GH/Git operations use the MCP `git` tool methods (which use `execFileSync`), never attempt to shell-escape arguments in prompts.
- If `check_pipeline` fails, provide the user the `gh run view <id> --log` command and ask for manual verification.

---

If you'd like, I can now apply the remaining priority fixes (1–4 above), run the three smoke tests, and add the CI parity check script. Which steps should I implement next? 
