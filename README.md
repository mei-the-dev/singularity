# Singularity (project root)

This folder is the canonical repository root for development. If you are using VS Code, open the `..` workspace at the workspace root and select `singularity/` as the folder to work from, or open `singularity.code-workspace` at the repo root.

Run verification and tests here:

- `node verify-singularity.js`
- `npm test` (in the `singularity/` context)

Notes:
- The workspace repository is intentionally nested under `singularity/` to keep server and UI tightly coupled while keeping tooling scoped.
