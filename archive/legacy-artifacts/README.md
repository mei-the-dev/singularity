This folder contains legacy, temporary, and backup artifacts consolidated from the repository to keep the working tree clean.

Moved items:
- `.repo-refactor-backup/` snapshots
- `.singularity_nested_backup/` snapshots
- `old_deprecated_ui_backup_for_reference/`
- `tmp_git_repo_*` directories created during testing

Policy:
- These artifacts are archived for historical reference and **should not be modified** in normal workflow.
- Prefer creating reproducible, small fixtures under `mcp/__tests__` instead of leaving temp folders in the repo root.

If you need any file from the archive, extract it locally; consider moving relevant bits into a proper fixture or removing them.
