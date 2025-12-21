# 🔧 Complete UX Development Lifecycle Patch

Hey Singularity! I need you to implement a complete upgrade to our development infrastructure. This adds production-ready Storybook + Playwright visual regression testing with full AI agent automation.

## 🎯 Mission

Patch the repository to enable autonomous component development with visual regression testing. Follow this exact sequence:

---

## Phase 1: Verify Current State

```
/explore ui
/explore mcp/tools
/explore scripts
```

Read current structure and identify what exists. Report:
- ✅ What we have
- ❌ What's missing
- ⚠️ What needs updating

---

## Phase 2: Update Agent Configuration

### Step 1: Update Copilot Instructions

Read the current file:
```
/read copilot_instructions.md
```

Then replace it with the enhanced version that includes:
- New `/component`, `/storybook`, `/vr-test` commands
- Complete UX development lifecycle workflows
- Enhanced diagnostic protocols
- 40+ tool references

**File:** `copilot_instructions.md`
**Content:** [Use the "Enhanced Copilot Instructions V21.5" artifact I created]

### Step 2: Update Agent Manifest

Read current:
```
/read singularity.agent.md
```

Then replace with enhanced manifest that includes:
- Complete tool registry with schemas
- Pre-defined workflows
- Error recovery strategies
- Behavioral rules

**File:** `singularity.agent.md`
**Content:** [Use the "Enhanced Agent Manifest V21.5" artifact I created]

---

## Phase 3: Add Enhanced MCP Tools

### Step 1: Create Storybook Tools Module

**File:** `mcp/tools/storybook.js`

**Content:** Complete implementation with these functions:
```javascript
export const diagnoseStorybookPreview = async () => { /* ... */ }
export const fixStorybookPreview = async () => { /* ... */ }
export const startStorybook = async ({ port, ci, detached }) => { /* ... */ }
export const stopStorybook = async ({ port }) => { /* ... */ }
export const checkStorybookStatus = async ({ port }) => { /* ... */ }
export const runPlaywrightDocker = async ({ testsPath, project, updateSnapshots }) => { /* ... */ }
export const generateBaselines = async ({ project }) => { /* ... */ }
export const commitBaselines = async ({ message }) => { /* ... */ }
export const analyzeTestResults = async ({ format }) => { /* ... */ }
```

Copy the full implementation from the "Enhanced Storybook & Playwright MCP Tools" artifact.

### Step 2: Update MCP Index to Register New Tools

**File:** `mcp/index.js`

Add imports:
```javascript
import * as Storybook from './tools/storybook.js';
```

Register new tools in TOOLS array:
```javascript
const TOOLS = [
  // ... existing tools ...
  
  // Storybook & Visual Regression
  { name: "diagnose_storybook_preview", handler: Storybook.diagnoseStorybookPreview, schema: { type: "object", properties: {} } },
  { name: "fix_storybook_preview", handler: Storybook.fixStorybookPreview, schema: { type: "object", properties: {} } },
  { name: "start_storybook", handler: Storybook.startStorybook, schema: { type: "object", properties: { port:{type:"number"}, ci:{type:"boolean"}, detached:{type:"boolean"} } } },
  { name: "stop_storybook", handler: Storybook.stopStorybook, schema: { type: "object", properties: { port:{type:"number"} } } },
  { name: "check_storybook_status", handler: Storybook.checkStorybookStatus, schema: { type: "object", properties: { port:{type:"number"} } } },
  { name: "run_playwright_docker", handler: Storybook.runPlaywrightDocker, schema: { type: "object", properties: { testsPath:{type:"string"}, project:{type:"string"}, updateSnapshots:{type:"boolean"}, storybookUrl:{type:"string"} } } },
  { name: "generate_baselines", handler: Storybook.generateBaselines, schema: { type: "object", properties: { project:{type:"string"} } } },
  { name: "commit_baselines", handler: Storybook.commitBaselines, schema: { type: "object", properties: { message:{type:"string"} } } },
  { name: "analyze_test_results", handler: Storybook.analyzeTestResults, schema: { type: "object", properties: { format:{type:"string"} } } },
];
```

### Step 3: Update ops.js with Enhanced Functions

**File:** `mcp/tools/ops.js`

Add/update these functions (check if they exist first):
```javascript
export const checkStorybookPlaywrightReadiness = async () => { /* ... */ }
export const buildStorybookStatic = async ({ configDir, outDir }) => { /* ... */ }
export const checkBuiltStorybook = async ({ outDir, componentId }) => { /* ... */ }
```

---

## Phase 4: Configuration Files

### Step 1: Enhanced Playwright Config

**File:** `playwright.config.ts`

```typescript
import { defineConfig, devices } from '@playwright/test';

const STORYBOOK_URL = process.env.STORYBOOK_URL || 'http://localhost:6006';
const CI = process.env.CI === 'true';

export default defineConfig({
  testDir: './ui/e2e/tests',
  snapshotDir: './ui/e2e/baselines',
  
  timeout: 30000,
  fullyParallel: !CI,
  forbidOnly: CI,
  retries: CI ? 2 : 0,
  workers: CI ? 1 : undefined,
  
  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['json', { outputFile: 'test-results/results.json' }],
    ['list']
  ],
  
  use: {
    baseURL: STORYBOOK_URL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  expect: {
    toHaveScreenshot: {
      maxDiffPixels: 100,
      threshold: 0.01,
      animations: 'disabled',
    },
  },

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],

  webServer: CI ? undefined : {
    command: 'npm run storybook',
    url: STORYBOOK_URL,
    reuseExistingServer: true,
    timeout: 120000,
  },
});
```

### Step 2: Enhanced Storybook Config

**File:** `ui/.storybook/main.ts`

```typescript
import type { StorybookConfig } from '@storybook/react-vite';
import { mergeConfig } from 'vite';

const config: StorybookConfig = {
  stories: ['../components/**/*.stories.@(js|jsx|ts|tsx|mdx)'],
  
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-links',
  ],
  
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  
  core: {
    disableTelemetry: true,
  },
  
  viteFinal: async (config) => {
    return mergeConfig(config, {
      server: {
        host: '0.0.0.0',
        strictPort: true,
        port: 6006,
      },
    });
  },
  
  staticDirs: ['../public'],
};

export default config;
```

**File:** `ui/.storybook/preview.ts`

```typescript
import type { Preview } from '@storybook/react';
import '../src/index.css';

// Error boundary for debugging
window.addEventListener('error', (e) => {
  console.error('🔴 PREVIEW ERROR:', e.error);
  console.error('Stack:', e.error?.stack);
});

console.log('✓ Preview loading...', {
  clientAPI: typeof window.__STORYBOOK_CLIENT_API__,
  location: window.location.href
});

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    layout: 'centered',
  },
};

export default preview;
```

### Step 3: Update Package.json Scripts

**File:** `package.json`

Add these scripts (merge with existing):
```json
{
  "scripts": {
    "storybook": "storybook dev -p 6006 --ci",
    "storybook:build": "storybook build -o ui/storybook-static",
    
    "playwright:install": "./scripts/setup-playwright.sh",
    "playwright:docker": "./scripts/playwright-docker.sh",
    
    "test:visual": "playwright test",
    "test:visual:update": "playwright test --update-snapshots",
    "test:visual:docker": "DOCKER=1 ./scripts/playwright-docker.sh",
    "test:visual:docker:update": "UPDATE_SNAPSHOTS=1 DOCKER=1 ./scripts/playwright-docker.sh",
    
    "baselines:generate": "./scripts/generate-baselines.sh",
    "baselines:commit": "git add ui/e2e/baselines && git commit -m 'chore: update visual regression baselines'",
    
    "dev:all": "concurrently \"npm run storybook\" \"npm run dev --workspace=ui\"",
    "setup:full": "npm install && npm run playwright:install && npm run storybook:build"
  },
  "devDependencies": {
    "@playwright/test": "^1.48.0",
    "@storybook/addon-essentials": "^8.4.7",
    "@storybook/addon-interactions": "^8.4.7",
    "@storybook/addon-links": "^8.4.7",
    "@storybook/blocks": "^8.4.7",
    "@storybook/react": "^8.4.7",
    "@storybook/react-vite": "^8.4.7",
    "@storybook/test": "^8.4.7",
    "concurrently": "^8.2.2",
    "storybook": "^8.4.7"
  }
}
```

---

## Phase 5: Shell Scripts

### Step 1: Playwright Docker Runner

**File:** `scripts/playwright-docker.sh`

Make executable: `chmod +x scripts/playwright-docker.sh`

**Content:** [Use the "Playwright Docker Script (Fixed)" artifact - it's production-ready with health checks, retries, permission fixes]

Key features:
- Multi-stage health checks (port + HTTP + index.json)
- Exponential backoff retry logic
- Automatic permission fixing
- Artifact collection
- Color-coded output

### Step 2: Setup Script

**File:** `scripts/setup-playwright.sh`

```bash
#!/bin/bash
set -e

echo "🎭 Setting up Playwright..."

if command -v docker &> /dev/null; then
    echo "✓ Docker detected - pulling Playwright image..."
    docker pull mcr.microsoft.com/playwright:v1.48.0-jammy
    echo "✓ Docker image ready"
else
    echo "⚠️  Docker not found - installing Playwright locally..."
    npx playwright install --with-deps chromium
    echo "✓ Playwright installed locally"
fi

echo "✓ Playwright setup complete"
```

Make executable: `chmod +x scripts/setup-playwright.sh`

### Step 3: Baseline Generator

**File:** `scripts/generate-baselines.sh`

```bash
#!/bin/bash
set -e

echo "📸 Generating visual regression baselines..."

# Ensure Storybook is running
if ! curl -s http://localhost:6006 > /dev/null; then
    echo "⚠️  Starting Storybook..."
    npm run storybook &
    STORYBOOK_PID=$!
    sleep 10
else
    echo "✓ Storybook already running"
    STORYBOOK_PID=""
fi

# Generate baselines
UPDATE_SNAPSHOTS=1 ./scripts/playwright-docker.sh

# Cleanup
if [ -n "$STORYBOOK_PID" ]; then
    kill $STORYBOOK_PID || true
fi

echo "✓ Baselines generated in ui/e2e/baselines/"
echo "📝 Review changes and commit: npm run baselines:commit"
```

Make executable: `chmod +x scripts/generate-baselines.sh`

---

## Phase 6: Create Directory Structure

Create these directories if they don't exist:

```bash
mkdir -p ui/.storybook
mkdir -p ui/components
mkdir -p ui/e2e/tests
mkdir -p ui/e2e/baselines
mkdir -p scripts
mkdir -p docs
mkdir -p .task-context/logs
```

---

## Phase 7: Documentation

### Step 1: Setup Guide

**File:** `docs/SETUP.md`

```markdown
# UX Development Lifecycle Setup

## Prerequisites
- Node.js 20+
- Docker 24+ (recommended for Playwright)
- Git 2.40+

## Installation

\`\`\`bash
# Install dependencies
npm install

# Setup Playwright (Docker or local)
npm run playwright:install

# Build Storybook
npm run storybook:build
\`\`\`

## Starting Development

\`\`\`bash
# Start all services (Storybook + Next.js)
npm run dev:all

# Or individually
npm run storybook    # Port 6006
npm run dev          # Port 3000
\`\`\`

## Running Visual Tests

\`\`\`bash
# Run tests locally
npm run test:visual

# Run in Docker (recommended)
npm run test:visual:docker

# Update baselines
npm run test:visual:docker:update
\`\`\`

## Troubleshooting

### Storybook won't start
\`\`\`bash
rm -rf node_modules/.cache/storybook
npm run storybook
\`\`\`

### Visual tests failing
\`\`\`bash
# Check Storybook health
curl http://localhost:6006/index.json

# Regenerate baselines
npm run baselines:generate
\`\`\`
```

### Step 2: Component Development Guide

**File:** `docs/COMPONENT_DEVELOPMENT.md`

```markdown
# Component Development Guide

## Creating a New Component

1. Use the AI agent: `/component YourComponent`
2. Or manually scaffold:
   - Create `ui/components/YourComponent/YourComponent.tsx`
   - Create `ui/components/YourComponent/YourComponent.stories.tsx`
   - Create `ui/components/YourComponent/index.ts`

## Component Template

\`\`\`typescript
import React from 'react';

export interface YourComponentProps {
  title: string;
  variant?: 'default' | 'primary' | 'secondary';
}

export const YourComponent: React.FC<YourComponentProps> = ({
  title,
  variant = 'default'
}) => {
  return (
    <div className="rounded-lg p-4">
      <h3>{title}</h3>
    </div>
  );
};
\`\`\`

## Story Template

\`\`\`typescript
import type { Meta, StoryObj } from '@storybook/react';
import { YourComponent } from './YourComponent';

const meta: Meta<typeof YourComponent> = {
  title: 'Components/YourComponent',
  component: YourComponent,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { title: 'Hello World' },
};
\`\`\`

## Visual Test Template

\`\`\`typescript
import { test, expect } from '@playwright/test';

test('YourComponent - Default', async ({ page }) => {
  await page.goto('http://localhost:6006/iframe.html?id=components-yourcomponent--default');
  await page.waitForSelector('[class*="rounded-lg"]');
  await expect(page).toHaveScreenshot('yourcomponent-default.png');
});
\`\`\`
```

### Step 3: Visual Regression Guide

**File:** `docs/VISUAL_REGRESSION.md`

```markdown
# Visual Regression Testing Guide

## Overview

We use Playwright for visual regression testing of all UI components in Storybook.

## Workflow

1. **Create Component** - Build your component with stories
2. **Generate Baselines** - Capture initial screenshots
3. **Make Changes** - Update component code
4. **Run Tests** - Detect visual changes
5. **Review Diffs** - Check if changes are intentional
6. **Update Baselines** - If changes are intentional

## Commands

\`\`\`bash
# Generate baselines (first time)
npm run baselines:generate

# Run tests
npm run test:visual:docker

# Update baselines (after intentional changes)
npm run test:visual:docker:update

# Commit baselines
npm run baselines:commit
\`\`\`

## When to Update Baselines

✅ **Update baselines when:**
- Adding new components
- Making intentional style changes
- Updating design system

❌ **Don't update baselines when:**
- Tests are failing unexpectedly
- Many unrelated tests fail
- Unsure if changes are correct

## Debugging Failures

1. Check `playwright-report/index.html` for visual diffs
2. Review expected vs actual screenshots
3. Run `/doctor` in AI agent for diagnostics
4. Check Storybook health: `curl http://localhost:6006/index.json`
```

---

## Phase 8: CI/CD Integration

**File:** `.github/workflows/visual-regression.yml`

```yaml
name: Visual Regression Tests

on:
  pull_request:
  push:
    branches: [main]
  workflow_dispatch:
    inputs:
      update_baselines:
        description: 'Update baseline snapshots'
        type: boolean
        default: false

jobs:
  visual-tests:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build Storybook
        run: npm run storybook:build
      
      - name: Install Playwright
        run: npx playwright install --with-deps chromium
      
      - name: Start Storybook
        run: |
          npx http-server ui/storybook-static -p 6006 &
          sleep 5
        
      - name: Run visual tests
        run: |
          if [ "${{ github.event.inputs.update_baselines }}" = "true" ]; then
            npx playwright test --update-snapshots
          else
            npx playwright test
          fi
        env:
          STORYBOOK_URL: http://localhost:6006
      
      - name: Upload test results
        if: failure()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report
          path: |
            playwright-report/
            test-results/
          retention-days: 7
      
      - name: Commit baseline updates
        if: github.event.inputs.update_baselines == 'true'
        run: |
          git config user.name "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"
          git add ui/e2e/baselines/
          git commit -m "chore: update visual regression baselines" || echo "No changes"
          git push
```

---

## Phase 9: Validation & Testing

After all patches are applied, run these validation steps:

### Step 1: Verify File Structure

```
/explore .
```

Confirm all files are in place.

### Step 2: Install Dependencies

```
/execute npm install
```

### Step 3: Make Scripts Executable

```
/execute chmod +x scripts/*.sh
```

### Step 4: Test MCP Server

```
/execute node mcp/list-tools.js
```

Should show 40+ tools including new Storybook tools.

### Step 5: Test Storybook

```
/execute npm run storybook
```

Wait 30 seconds, then check:
```
/execute curl http://localhost:6006/index.json
```

### Step 6: Test Playwright Setup

```
/execute npm run playwright:install
```

### Step 7: Run Full Health Check

Use the new `/doctor` command to run diagnostics.

---

## Phase 10: Create Test Component

To verify everything works, create a test component:

### Step 1: Scaffold Component

Create `ui/components/TestCard/TestCard.tsx`:
```typescript
import React from 'react';

export interface TestCardProps {
  title: string;
  value: string;
}

export const TestCard: React.FC<TestCardProps> = ({ title, value }) => {
  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">
      <h3 className="text-sm text-slate-400 mb-2">{title}</h3>
      <div className="text-3xl font-bold text-slate-100">{value}</div>
    </div>
  );
};
```

### Step 2: Create Stories

Create `ui/components/TestCard/TestCard.stories.tsx`:
```typescript
import type { Meta, StoryObj } from '@storybook/react';
import { TestCard } from './TestCard';

const meta: Meta<typeof TestCard> = {
  title: 'Test/TestCard',
  component: TestCard,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { title: 'Revenue', value: '$45k' },
};
```

### Step 3: Create Visual Test

Create `ui/e2e/tests/TestCard.spec.ts`:
```typescript
import { test, expect } from '@playwright/test';

test('TestCard renders correctly', async ({ page }) => {
  await page.goto('http://localhost:6006/iframe.html?id=test-testcard--default');
  await page.waitForSelector('[class*="rounded-xl"]');
  await expect(page).toHaveScreenshot('testcard-default.png');
});
```

### Step 4: Generate Baseline

```
/execute npm run baselines:generate
```

### Step 5: Run Visual Tests

```
/execute npm run test:visual:docker
```

Should pass with 1 test.

---

## Success Criteria

✅ All files created and in correct locations
✅ MCP server shows 40+ tools
✅ Storybook starts and shows components
✅ Playwright tests can run in Docker
✅ Visual regression baselines can be generated
✅ Test component works end-to-end
✅ Scripts are executable
✅ Documentation is complete

---

## Rollback Plan

If anything fails:
1. All changes are in git - easy to revert
2. Original files are backed up with .backup extension
3. Can restore from git history

---

## Post-Patch Tasks

After successful patching:

1. **Commit Changes**
   ```
   /diff
   git add -A
   git commit -m "feat: add complete UX development lifecycle with visual regression"
   ```

2. **Test in CI**
   - Push to feature branch
   - Verify GitHub Actions workflow runs
   - Check that visual tests pass

3. **Update Team**
   - Share docs/SETUP.md
   - Demo new `/component` command
   - Show visual regression workflow

---

## Support

If any step fails:
1. Use `/doctor` for diagnostics
2. Check logs in `.task-context/logs/`
3. Review `docs/VISUAL_REGRESSION.md`
4. Run `diagnose_storybook_preview` tool

---

## Summary

This patch adds:
- ✅ 40+ new MCP tools for UX development
- ✅ Complete Storybook + Playwright integration
- ✅ Visual regression testing workflow
- ✅ Auto-diagnosis and fixing capabilities
- ✅ Production-ready Docker scripts
- ✅ CI/CD integration
- ✅ Comprehensive documentation

**Your AI agent can now autonomously develop, test, and ship UI components!** 🚀