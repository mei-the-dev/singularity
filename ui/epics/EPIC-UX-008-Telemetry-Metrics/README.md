# EPIC-UX-008 — Telemetry & Metrics

Goal: Collect usage telemetry for key flows (issue move latency, pipeline runs, errors) to guide performance & UX decisions.

Milestones:
- Add lightweight telemetry hooks (opt-in) for move events and pipeline runs
- Aggregate metrics in an internal metrics endpoint (or external provider)
- Dashboard for basic KPIs (move latency, E2E pass rates, visual regression deltas)

Acceptance criteria:
- Telemetry events captured and viewable in a simple dashboard
- Privacy & opt-in text is added to docs
