# Singularity UI — UX Design Specification ("Void & Gold")

🎯 **Goal**: Design a modern, minimalist, and powerful dashboard that makes interacting with the MCP pipeline (e.g., `mcp_singularity-c_check_pipeline`) and issue movement fast, informative, and delightfully lightweight. The look-and-feel follows the "Void & Gold" theme (space black + gold accents) and prioritizes clarity, accessibility, and performance.

---

## 1. Visual System & Design Tokens 🔧

- Palette
  - Background: #05060a (var: `--bg-900`) — deep void
  - Surface / Panels: #0b0d12 (var: `--panel`) — slightly lighter
  - Gold Accent: #caa44a (var: `--gold`) — primary accent, used sparingly
  - Muted text: #9aa3b2 (var: `--muted`)
  - Success: #1db954 (var: `--success`), Warning: #ffb86b, Danger: #ff6b6b

- Typography
  - System font stack with `font-mono` for logs and technical readouts; headings use geometric sans for clarity.
  - Scale: H1 (32-48px), H2 (20-28px), H3 (16-20px), body 14-16px.

- Motion & Easing
  - Subtle, short (160–240ms) transitions for hover/press.
  - Natural easing (cubic-bezier(0.2, 0.9, 0.2, 1)).
  - DnD ghost and column highlight are quick fades + scale (0.96 -> 1.00).

- Tokens file
  - Keep tokens in `ui/DESIGN_TOKENS.md` and CSS variables in `ui/app/globals.css` as `--bg`, `--panel`, `--gold`, `--muted`, `--success` etc.

---

## 2. Layout & Information Hierarchy 🧭

- Global layout
  - Three-column responsive layout: (Main Board | Side panels). On small screens, board collapses to single column with horizontal scroll for multiple boards.
  - Kanban board is primary content: prominent header, counts and quick-filters above columns.

- Board & Columns
  - Columns: compact header (title + count), body with stacked Issue Cards.
  - Use subtle separators and depth (backdrop blur + border) to emphasize primary content.

- Side panels
  - Compact pipeline / system status widget that surfaces `mcp_singularity-c_check_pipeline` results: last run time, green/yellow/red indicator, one-line summary and quick action (Run pipeline / View logs).
  - Logs feed and repo status in secondary panels.

---

## 3. Issue Card Design & Interaction ✨

- Card anatomy
  - Top-left: Issue type (badge) and priority marker
  - Title (bold), short description truncated to 2 lines
  - Meta row: assignee avatar, tags, small indicators for PR/CI/pipeline

- States & affordances
  - Hover: slight lift (translateY -4px) + gold highlight edge
  - Dragging: ghost with low opacity, original place shows placeholder slot
  - Keyboard focus: ring with `--gold` at 3px; pressing Enter or Space activates context menu

- Keyboard DnD
  - While focused, use ArrowLeft/Right to move columns (with confirmation visually), and Ctrl+Enter to open detail.
  - Provide audible announcements via live regions: "Moved Issue X to In Progress".

---

## 4. Drag-and-Drop & Movement UX 🚚

- Primary interaction: HTML5 DnD with graceful fallback for keyboard and touch.
- Visual feedback
  - Column highlight (soft gold tint + subtle glow) when an item is over it.
  - Insertion indicator: small animated bar showing where card will land.
- Optimistic update: update UI immediately, send PATCH to `/api/issues` and reconcile on failure (toast + undo).
- Conflict handling: if server rejects (concurrent move), show toast with action: "Reset" or "Retry".

---

## 5. Pipeline Integration UX (mcp_singularity-c_check_pipeline) 🧪

- Pipeline widget (compact)
  - Small card in the right-side panel showing: Last run (time), Result (icon + color), Duration, Quick action (Run) and small "Details" link.
  - For pipeline runs related to a specific issue, show an inline badge on the Issue Card with status and link to logs.

- Visual signals
  - Green dot (success), Amber (warning/unstable), Red (failure).
  - Animated spinner during run; final state area shows steps summary.

- Interaction flow
  - Clicking "Run" triggers `mcp_singularity-c_check_pipeline` via back-end tool. While running, disable repeated runs and show progress.
  - If a pipeline fails, link to logs and an action to create a pipeline-fix task (prefilled Issue).

---

## 6. Accessibility & Keyboard Support ♿️

- ARIA roles: `role="list"` for columns, `role="listitem"` for cards; columns include `aria-label="Backlog issues"` etc.
- Focus management: keyboard DnD and focus traps where needed; visible focus ring with high-contrast.
- Contrast ratios: ensure text vs. background >= 4.5:1 (use muted for secondary text only).
- Screen reader announcements for: move success/failure, pipeline run start/end, new comments.

---

## 7. Testing & Quality ✅

- Unit tests: components, state transitions, small helpers.
- Integration: IssuesProvider + API + KanbanBoard flows (move, create, delete)
- E2E: Playwright tests for DnD flows, keyboard moves, and pipeline-run flows.
- Visual regression: Storybook + Chromatic/Playwright snapshot comparisons focusing on token-driven themes and animation frames.
- Performance: render tests with large lists (1000 issues), profiling for re-renders (React Profiler), and incremental virtualization if needed.

---

## 8. Metrics & Acceptance Criteria 📊

- Acceptance
  - Board renders in <200ms for 50 issues on a development machine.
  - Keyboard DnD works end-to-end and is covered by tests.
  - Pipeline widget shows accurate last-run status within 5s of completion.
  - Storybook stories for all components with visual snapshots pass.

- KPIs
  - Time to move an issue (visual + server confirm) < 1s under normal load.
  - E2E flakiness < 3% per 100 runs.

---

## 9. Implementation Plan (Epics, Milestones & Quick Tasks) 🛠️

1. Epic: Design Spec & Tokens (owner: UX) — 2 days
   - Add `ui/DESIGN_SPEC_UX.md` (this file), refine `ui/DESIGN_TOKENS.md`, publish tokens.
2. Epic: Theme & Component Polish — 5 days
   - Implement `--gold` accents, motion primitives, panel styling; update `IssueCard`, `KanbanColumn` visuals.
3. Epic: Accessibility & Keyboard DnD — 5 days
   - Add keyboard move, ARIA live announcements, focus management.
4. Epic: Pipeline Integration — 4 days
   - Pipeline widget, run action, inline badges on issues, backend tool hook for `mcp_singularity-c_check_pipeline`.
5. Epic: E2E & Visual Regression — 4 days
   - Playwright tests for DnD, pipeline checks; Storybook snapshots + Chromatic.
6. Epic: Performance & Large Data — 4 days
   - Render tests, virtualization or windowing if needed, memoization.

Each epic should be split into 2–6 issues for incremental PRs and CI verification.

---

## 10. Notes & Rollout Strategy 🚀

- Feature flag pipeline widget during iteration; default to hidden for experimental runs.
- Keep PRs small and test-first: write tests before changing components where possible.
- Ensure `playwright:install` is added to CI as non-interactive (already added in package.json).

---

> Contact: UX & Component owner: `@mei` and `@alex` — please review and we can start breaking the first epic into issues and PRs.
