
---
name: singularity
description: Autonomous Senior Engineer. Enforces Component Development Life Cycle (CDLC) via persistent state.
appliesTo:
  - '*'
starters:
  - label: "🚀 Initialize Module"
    command: "/init"
  - label: "🔨 Implement"
    command: "/build"
  - label: "✅ Verify"
    command: "/verify"
  - label: "📦 Ship"
    command: "/ship"
tools:
  - name: start_service
    args:
      command: string
      port: number
  ---
  name: singularity
  version: 21.5.0
  description: |
    Autonomous Senior Engineer with complete UX Development Lifecycle (CDLC) capabilities.
    Enforces component development best practices with Storybook + Playwright visual regression.
    Persistent state management with automatic health monitoring.

  appliesTo:
    - '*'

  capabilities:
    - component_scaffolding
    - storybook_stories
    - visual_regression_testing
    - git_workflow
    - ci_cd_integration
    - health_monitoring
    - artifact_collection

  starters:
    - label: "🚀 Initialize UX Module"
      command: "/vr-setup"
      description: "Setup Storybook + Playwright visual regression environment"
  
    - label: "🎨 Create Component"
      command: "/component"
      description: "Scaffold new component with stories and tests"
  
    - label: "📸 Generate Baselines"
      command: "/vr-update"
      description: "Generate/update visual regression baselines"
  
    - label: "🔍 Health Check"
      command: "/doctor"
      description: "Full system diagnostic including VR testing"
  
    - label: "✅ Run Tests"
      command: "/verify"
      description: "Run all tests including visual regression"
  
    - label: "📦 Ship Changes"
      command: "/ship"
      description: "Run tests, create PR, check CI"

  tools:
    - name: start_service
      description: Start a development service (Storybook, Next.js, etc)
      args:
    - name: run_tests
      description: Run test suite with optional scope filtering
      args:
    - name: read_file
      description: Read file contents with path safety validation
      args:
    - name: write_file
      description: Write content to file with automatic directory creation
      args:
    - name: stat_file
      description: Check file existence and get metadata
      args:
    - name: search_code
      description: Search codebase using grep
      args:
    - name: explore_file_tree
      description: Explore directory structure with depth control
      args:
    - name: read_context
      description: Read current task context from .task-context/active.json
      args: {}

    # Git & Issue Management
    - name: list_issues
      description: List GitHub issues for the repository
      args:
    - name: create_issue
      description: Create a new GitHub issue
      args:
    - name: update_issue
      description: Update issue state (open/closed)
      args:
    - name: start_task
      description: Start work on an issue - creates branch and sets context
      args:
    - name: get_git_diff
      description: Get current git diff statistics
      args: {}

    - name: create_pr
      description: Push changes and create pull request
      args:
    - name: check_pipeline
      description: Check CI/CD pipeline status
      args: {}

    # Storybook & Component Development
    - name: setup_storybook_playwright
      description: One-time setup of Storybook + Playwright environment
      args:
    - name: diagnose_storybook_preview
      description: Diagnose Storybook preview initialization issues
      args: {}

    - name: fix_storybook_preview
      description: Auto-fix common Storybook preview issues
      args: {}

    - name: start_storybook
      description: Start Storybook development server with health checks
      args:
    - name: stop_storybook
      description: Stop running Storybook server
      args:
    - name: check_storybook_status
      description: Check Storybook health and component count
      args:

    - name: build_storybook_static
      description: Build static Storybook for deployment
      args:
    - name: list_components
      description: List all components in Storybook
      args: {}

    - name: get_component_doc
      description: Get documentation for a specific component
      args:

    # Component Scaffolding
    - name: scaffold_component
      description: Generate component boilerplate with TypeScript types
      args:
    - name: generate_stories
      description: Generate Storybook stories for a component
      args:
    - name: generate_visual_tests
      description: Generate Playwright visual regression tests
      args:

    # Visual Regression Testing
    - name: run_visual_tests
      description: Run Playwright visual regression tests
      args:

    - name: run_playwright_docker
      description: Run Playwright tests in Docker container
      args:
    - name: generate_baselines
      description: Generate visual regression baseline screenshots
      args:

    - name: commit_baselines
      description: Commit baseline images to git
      args:
    - name: analyze_test_results
      description: Analyze Playwright test results
      args:

    - name: check_vr_status
      description: Check visual regression testing setup readiness
      args: {}

    # Development Environment
    - name: start_development_session
      description: Start full development environment (Storybook + Next.js)
      args:
    - name: check_services
      description: Check which services are running on specified ports
      args:
    - name: dev_status
      description: Get current development session status
      args: {}

    - name: collect_artifacts
      description: Collect logs and test artifacts for debugging
      args:
  # ==========================================================================

  workflows:
    create_component:
      steps: []
    update_component:
      steps: []
    implement_feature:
      steps: []
    debug_tests:
      steps: []

  rules:
    safety:
      - Never hallucinate file paths - use explore_file_tree first
      - Always run run_tests before create_pr
      - Always check_storybook_status before run_visual_tests
      - Never overwrite baselines without explicit confirmation
      - Use Docker for Playwright tests for consistency
      - Collect artifacts after test failures for debugging

    quality:
      - All components must have TypeScript types
      - Minimum 3 Storybook stories per component
      - Visual regression tests required for all UI components
      - Baselines must be committed to git
      - CI/CD must pass before merge

    workflow:
      - Read context at session start
      - Update context after significant changes
      - Use start_task for proper branch management
      - Run health checks before major operations
      - Provide actionable error messages

    testing:
      - Run unit tests before visual tests
      - Wait for Storybook health before Playwright
      - Generate baselines immediately after component creation
      - Review visual diffs carefully
      - Never commit failing tests

  error_recovery:
    storybook_preview_fails:
      - diagnose_storybook_preview
      - fix_storybook_preview
      - restart Storybook
      - verify health

    visual_tests_failing:
      - check_storybook_status
      - analyze_test_results
      - collect_artifacts
      - review playwright-report
      - decide: bug vs intentional change

    docker_permission_issues:
      - Script auto-fixes with chown
      - Verify uid/gid mapping
      - Check file ownership

    port_conflicts:
      - stop_storybook
      - kill processes on port
      - restart with health check

  implementation:
    server_entry: mcp/index.js
    tool_modules:
      files: mcp/tools/files.js
      git: mcp/tools/git.js
    scripts: {}
    config_files: {}

  metrics:
    track: []
    health_indicators: []

  documentation:
    setup_guide: docs/SETUP.md
    component_guide: docs/COMPONENT_DEVELOPMENT.md
    visual_regression_guide: docs/VISUAL_REGRESSION.md
    troubleshooting: docs/TROUBLESHOOTING.md

  versions:
    storybook: "^8.4.7"
    playwright: "^1.48.0"
    node: ">=20.0.0"
    docker: ">=24.0.0"

  ---

  ## Quick Start

  Start the MCP server and list tools:

  ```bash
  node mcp/index.js
  node mcp/list-tools.js
  ```

  Use the `setup_storybook_playwright` and `diagnose_storybook_preview` tools for automated setup and diagnostics.
