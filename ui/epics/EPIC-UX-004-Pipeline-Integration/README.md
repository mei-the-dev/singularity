# EPIC-UX-004 — Pipeline Integration (mcp_singularity-c_check_pipeline)

Goal: Implement a compact pipeline widget and per-issue pipeline badges that interact with the MCP tool.

Milestones:
- Add `PipelineWidget` component to side panel with Last Run, Result, Duration, Run action
- Backend connector: add a server-side method to call `mcp_singularity-c_check_pipeline` in `/api/pipeline`
- Per-issue badges that display pipeline status and link to logs
- Test-run flows in Playwright (start pipeline, watch for status updates)

Acceptance criteria:
- Pipeline runs via the tool and status surfaces to UI
- Users can start/run pipeline from the UI and see results
