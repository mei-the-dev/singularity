# Board & Issue Modal Wireframes — UX Spec

**Purpose:** Practical, developer-focused wireframes and interaction spec for the Kanban Board and Issue Modal that map directly to MCP commands and CLI workflows.

---

## 1) Overview

- Primary goal: move issues through the Dev lifecycle (Plan → Code → Test → Ship → Monitor) using direct MCP tool bindings.
- Primary UI surfaces: **Board (Kanban)**, **Issue Modal**, **Dev Panel / Test Console**, and **Pipeline Status**.

---

## 2) Wireframes (ASCII)

Board (desktop)

| Backlog | In Progress | Done |
|---|---|---|
| [#101] Issue title... | [#102] Issue title... | [#103] Issue title... |
| Card: title, meta, drag-handle, actions (Start, PR, Test) |

Issue Modal (opened from card)

---------------------------------
| #102 — Issue title            X |
| State: Open  •  Assignee: mei     |
| -------------------------------- |
| Description (markdown)           |
| -------------------------------- |
| Actions: [Start Task] [Run Tests] [Create PR] [Close] |
---------------------------------

---

## 3) Component Specifications

### IssueCard
- Props: `{ issue: Issue, onAction(type, id) }`
- UI Elements: drag handle, title, id, metadata, action buttons (Start, PR, Tests)
- Events:
  - Drag end: if dropped to In Progress → call `start_task(issue_id)`
  - Drag end: if dropped to Done → call `update_issue(issue_number, 'closed')`
  - Button Start → `start_task(issue_id)`
  - Button PR → `create_pr({title: 'Work on #id: title'})`
- Accessibility:
  - role="article" aria-labelledby
  - keyboard actions: focus + `P` (plan), `C` (close), `R` (run tests)

### IssueModal
- Inputs: issue object
- Actions map to MCP tools:
  - **Start Task** → `start_task({ issue_id })`
  - **Run Tests** → `run_tests()` (show progress & output)
  - **Create PR** → `create_pr({ title })` and then `check_pipeline()`
  - **Close** → `update_issue({ issue_number, state:'closed' })`
- UI Behavior: Focus trap, close on Esc, show structured errors.

---

## 4) Interaction Flows (User → MCP mapping)

1. **Drag Backlog → In Progress**
   - UI: optimistic move, show spinner; call `start_task({issue_id})`; on success show branch/ctx toast; on error revert and show error.
2. **Drag to Done**
   - Call `update_issue({ issue_number, state: 'closed' })`
3. **Click Run Tests**
   - Call `run_tests()`; stream/log result; block PR creation if FAIL.
4. **Create PR**
   - Call `create_pr({ title })` → show returned URL; call `check_pipeline()` to monitor.

---

## 5) Accessibility & Keyboard Controls
- DnD alternatives: focus card → press `P` to Plan, `C` to Close, `M` to open Modal.
- All interactive controls: role, aria-label, aria-pressed where applicable.
- Color contrast: ensure `gold` tokens meet contrast ratios; provide focus rings (2px outline) and skip links.

---

## 6) Acceptance Criteria & Tests
- Unit:
  - IssueCard: emits correct events for buttons and keyboard shortcuts.
  - IssueModal: calls correct MCP API functions and handles errors.
- Integration / E2E (Playwright):
  - DnD flow test: load board, perform drag Backlog→InProgress, assert `start_task` was called (via mocked MCP or verify issue branch created), then drag to Done and assert issue closed.
  - Run Tests flow: click Run Tests and assert test console updates to PASS or FAIL and UI reacts accordingly.
- Visual & A11y:
  - Axe audit: no high/critical violations for Board & Modal.

---

## 7) Implementation Notes & Dev Tasks
- Add `data-testid` attributes to key elements for stable selectors in Playwright.
- Implement optimistic update + reconcile pattern; show toast for background failures.
- Add `ui/theme` tokens file to centralize color & spacing.
- Create `ui/tests/e2e/drag.spec.ts` to simulate DnD and plan flow.
- Add mock mode to MCP bridge for CI E2E (skip GH auth steps).

---

## 8) Example Playwright E2E Steps
1. Launch UI (ensure dev server running)
2. goto('/')
3. waitForSelector text `AWAITING INPUT` or board loaded
4. locate card `data-testid="issue-101"` and drag to `#in-progress` column
5. wait for API call (network or MCP mock) and assert card moved
6. drag to Done and assert `update_issue` was invoked and card removed from active column

---

If you'd like, I can now: **(A)** generate visual wireframe PNGs/Sketch snippets, **(B)** implement the Playwright DnD test and CI job, or **(C)** start building the Issue Modal component. Which should I start with? 
