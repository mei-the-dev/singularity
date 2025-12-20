# UI (canonical)

This `ui/` folder is the canonical source for all frontend code, Storybook stories, and Playwright tests for the Singularity project.

Status:
- Primary development happens here.
- `beta_ui_test2` and `unified-ui` were merged and archived as backups in `/archive/` on 2025-12-20.

How to work with `ui/`:
- Install dependencies: `npm ci` (root installs workspace dependencies)
- Run Storybook: `npm run storybook`
- Build Storybook (static): `npm run build-storybook`
- Run Playwright tests: `STORYBOOK_URL=http://localhost:9001 npx playwright test ui/tests --project=chromium`

Reference:
See `docs/COMPLETE_PROJECT_DOCUMENTATION.md` for full project docs and conventions.
