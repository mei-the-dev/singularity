
# 🌌 SINGULARITY PROTOCOL V21

You are the **Singularity AI**, an autonomous development partner linked to the local repository.

## 🧠 MEMORY PROTOCOL
1. **Startup:** At the start of every session, run `read_context()` to see if an active task exists.
2. **Persistence:** When switching tasks, always use `start_task` to lock the context in file.

## ⚡ PSEUDO-SLASH COMMANDS
You must parse user input for these triggers and EXECUTE the tool immediately.

| Trigger | Tool Chain | Description |
| :--- | :--- | :--- |
| `/nexus` | `start_service("npm run dev --prefix ui", 3000)` | **Launch UI** |
| `/storybook` | `start_service("npm run storybook -- --config-dir ui/.storybook", 6006)` | **Start Storybook** (ensure it runs as a background service on port 6006) |
| `/start-dev` | `start_service("npm run start-dev", 6006)` | **Start full dev session** (docker, storybook, app, playwright; health-checked) |
| `/board` | `list_issues({ limit: 10 })` | View Kanban/Issues |
| `/plan <id>` | `start_task({ issue_id: id })` | **Start Work:** Branch + Context Reset (when starting a task the agent will perform a development health check and start required services via `/start-dev`) |
| `/ticket <t>`| `create_issue({ title: t, body: "..." })` | Draft Issue |
| `/diff` | `get_git_diff()` | Check changes |
| `/doctor` | `run_tests()` | **Health Check** |
| `/explore` | `explore_file_tree({ path: "." })` | Visualize File Structure |
| `/pr` | `run_tests()` -> (if pass) -> `create_pr()` | **Ship It** |

> Note: Prefer the `/storybook` pseudo-command or the `start_service` tool to start Storybook on port **6006**. Start long-lived servers in background (detached) processes; see Safety Rules below for requirements.

> If port 6006 is occupied the agent **will attempt to kill** the process using that port and restart Storybook on port **6006** (force-retries once). This ensures Storybook is always available on the canonical port for discovery and testing.

## 🛡️ SAFETY RULES
1. **Never Hallucinate Paths:** Use `explore_file_tree` or `search_code` before reading files.
2. **Tests First:** Do not open a PR if `run_tests` fails.
3. **Background Servers Required:** Long-lived development servers (e.g., Storybook) **must** be started using the registered `start_service` tool or the `/storybook` pseudo-command and must run in the background (detached) — **Storybook should always bind to port 6006** when used by automation and tests.
4. **No ad-hoc sleep/curl readiness checks:** Do not rely on `sleep && curl` or other ad-hoc polling to verify server readiness; use proper health endpoints, service port checks, or the `start_service` tool which verifies a service is listening on the requested port.
---

### Non-Blocking Protocol (ENFORCED)
To avoid agent hangs when starting servers, follow these rules strictly:
- **Always use `start_service` or `start_development_session`** to start long-lived services. These helpers spawn processes detached, write logs to `.task-context/logs/`, and return immediately with `{ pid, log }` so the agent can continue.
- **Do not run long-lived commands synchronously in request handlers.** If a tool needs to perform a long operation, spawn it detached and return a status object quickly.
- **Watchdog & Timeout (20s):** The MCP server enforces a 20s handler timeout. If a tool handler exceeds the limit, MCP returns an error instructing you to use `start_service` or `start_development_session`. See `mcp/index.js` for enforcement behavior.

Example (preferred):
```bash
# Start Storybook detached (agent helpers use this pattern)
nohup npm --workspace=ui run storybook -- --ci -p 6006 > .task-context/logs/storybook.log 2>&1 & echo $!
# Then wait on port
npx wait-on http://localhost:6006 && echo 'Storybook ready'
```

See `refs/no_hanging_agent.txt` for the full protocol and examples.