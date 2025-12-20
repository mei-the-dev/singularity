# Release Process (UI)

This file documents the release process and post-merge checks for the Singularity UI.

## Labels (recommendation)
- `type: bug` — bugfix
- `type: feat` — feature
- `type: chore` — maintenance
- `release: minor` — include in minor release
- `release: patch` — include in patch release

Use these labels when creating PRs to make changelog generation clearer.

## Merge & Release Steps
1. Ensure all required checks pass (unit tests, E2E, Storybook build, visual checks).
2. Request at least one review from UX or frontend owner.
3. Once approved and CI is green, merge to `main` using a merge commit or squash (as per team convention).
4. Post-merge, the **post-merge smoke test job** runs automatically to verify the build serves and the main route returns 200.
5. The Release Drafter (configured in the repo) will draft a release on each merge to `main`. The release manager should review the drafted release, update titles if needed, and publish.

## Post-merge smoke tests
- Smoke test steps (automated by `post-merge-smoke.yml`):
  - Install dependencies and build the UI (`npm ci && npm run build`).
  - Start the production server and verify root path returns HTTP 200.

## Quick rollback & hotfix guidance
- If smoke tests or monitoring indicate a regression, open an urgent hotfix branch (`hotfix/…`), fix, and create a PR targeting `main` with `release: patch` label.

---

Document last updated: December 20, 2025
