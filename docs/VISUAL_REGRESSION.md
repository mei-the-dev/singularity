# Visual Regression Testing Guide

We use Playwright for visual regression testing of all UI components in Storybook.

## Workflow

1. Create Component - Build your component with stories
2. Generate Baselines - Capture initial screenshots
3. Make Changes - Update component code
4. Run Tests - Detect visual changes
5. Review Diffs - Check if changes are intentional
6. Update Baselines - If changes are intentional

## Commands

Generate baselines (first time):

npm run baselines:generate

Run tests:

npm run test:visual:docker

Update baselines (after intentional changes):

npm run test:visual:docker:update

Commit baselines:

npm run baselines:commit

## When to Update Baselines

Update baselines when adding new components, making intentional style changes, or updating design system.

## Debugging Failures

1. Check `playwright-report/index.html` for visual diffs
2. Review expected vs actual screenshots
3. Run `/doctor` in AI agent for diagnostics
4. Check Storybook health: `curl http://localhost:6006/index.json`
