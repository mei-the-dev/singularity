# Accessibility & Keyboard UX

This document describes keyboard interactions and accessibility considerations for the Kanban UI.

## Keyboard DnD (current behavior)
- Issue cards are focusable (tabIndex=0) and respond to keyboard events when focused.
- ArrowRight: attempts to move issue to the next column (eg. Backlog -> In Progress -> Done). It triggers a POST to `/api/issues` with `{ id, status }`.
- ArrowLeft: attempts to move issue to the previous column.
- Enter: reserved for opening details (placeholder — not implemented yet).

## Testing keyboard UX
- Unit tests exist in `ui/__tests__/KanbanColumn.test.tsx` that verify ArrowRight triggers the API call and ArrowLeft is a no-op where applicable.

## Focus management & ARIA
- Columns use `role="list"` and have descriptive aria-labels (eg. `aria-label="Backlog issues"`).
- Cards use `role="button"` and set `aria-label` to the issue title for screen readers.

## Future improvements (recommended)
- Add an ARIA live region to announce move confirmations ("Moved 'Fix login flow' to In Progress") to assistive technology.
- Implement Enter to open an accessible details panel (modal or drawer) with `aria-modal`.
- Add unit and integration tests that assert screen reader announcements via live region.

---

Document last updated: December 20, 2025
