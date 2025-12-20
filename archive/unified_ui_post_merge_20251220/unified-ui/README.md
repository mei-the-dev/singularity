# Unified UI

This folder contains all UI components, stories, tests, and configuration for the Singularity platform.

## Structure
- components/: All React components and their stories/tests
- tests/: Playwright and unit tests
- .storybook/: Storybook configuration (main.js, preview.js)
- styles/: Global styles and Tailwind config
- types/: Shared TypeScript types

## Rules
- Only one node_modules folder at the root
- All new components must have a story and test
- Storybook config follows best practices (see docs/COMPLETE_PROJECT_DOCUMENTATION.md)
- Playwright and unit tests must pass before PRs

## Setup
See docs/COMPLETE_PROJECT_DOCUMENTATION.md for full instructions.
