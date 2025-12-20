# EPIC-UX-006 — Performance & Large Data

Goal: Ensure the board performs well with large datasets, add render tests and consider virtualization strategies.

Milestones:
- Add render test that mounts the board with 1k+ issues and measure render times
- Use React.memo, useCallback to reduce re-renders where necessary
- Evaluate virtualization (react-window) for columns with >500 items
- Add performance budgets and CI alerts

Acceptance criteria:
- Render times are within budget for defined dataset sizes
- Profiling report documents hotspots and fixes
