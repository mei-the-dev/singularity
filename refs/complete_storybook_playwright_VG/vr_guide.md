# Complete Visual Regression Testing Guide
## Storybook v10+ & Playwright on Arch Linux

---

## 🎯 Quick Setup

### Option 1: Automated Setup (Recommended)

```bash
# Make the script executable
chmod +x setup-storybook-playwright.sh

# Run the setup script
./setup-storybook-playwright.sh
```

### Option 2: Manual Setup

```bash
# 1. Install system dependencies
sudo pacman -S nodejs npm base-devel git

# 2. Install browser dependencies
sudo pacman -S nss nspr atk cups gtk3 pango cairo mesa alsa-lib

# 3. Initialize project
npm init -y

# 4. Install dependencies
npm install react react-dom lucide-react
npm install -D typescript @types/react @types/react-dom
npm install -D vite @vitejs/plugin-react
npm install -D @playwright/test playwright
npm install -D tailwindcss postcss autoprefixer

# 5. Initialize Storybook
npx storybook@latest init --yes

# 6. Install Playwright browsers
npx playwright install --with-deps chromium
```

---

## 📁 Project Structure

After setup, your project will look like this:

```
project-root/
├── components/
│   └── SimpleButton/
│       ├── SimpleButton.tsx           # Component implementation
│       ├── SimpleButton.stories.tsx   # Storybook stories
│       └── index.ts                   # Barrel export
│
├── tests/
│   ├── SimpleButton.spec.ts           # Playwright visual tests
│   └── SimpleButton.spec.ts-snapshots/ # Baseline screenshots
│       ├── chromium/
│       │   ├── button-primary.png
│       │   ├── button-secondary.png
│       │   └── ...
│       ├── firefox/
│       └── webkit/
│
├── .storybook/
│   ├── main.ts                        # Storybook configuration
│   └── preview.ts                     # Global decorators & parameters
│
├── src/
│   └── index.css                      # Global styles (Tailwind)
│
├── playwright.config.ts               # Playwright configuration
├── vite.config.ts                     # Vite configuration
├── tailwind.config.js                 # Tailwind configuration
├── tsconfig.json                      # TypeScript configuration
└── package.json                       # Dependencies & scripts
```

---

## 🚀 Usage Workflow

### 1. Start Storybook

```bash
npm run storybook
```

Storybook will be available at: `http://localhost:6006`

### 2. View Your Component

Navigate to your component in Storybook:
- Components → SimpleButton
- View different stories (Primary, Secondary, etc.)
- Interact with controls

### 3. Generate Baseline Screenshots

**First time only:**

```bash
npm run test:visual:update
```

This creates baseline screenshots in `tests/SimpleButton.spec.ts-snapshots/`

### 4. Run Visual Regression Tests

```bash
# Run all tests
npm run test:visual

# Run with UI (recommended for debugging)
npm run test:visual:ui

# Run only Chromium tests
npm run test:visual:chromium

# Run in headed mode (see browser)
npm run test:visual:headed
```

### 5. Review Results

If tests fail (visual differences detected):

```bash
# View HTML report
npm run test:visual:report
```

The report shows:
- ✅ Passed tests
- ❌ Failed tests with diff images
- 📊 Side-by-side comparison

---

## 🎨 Creating Your Own Component

### Step 1: Create Component File

`components/YourComponent/YourComponent.tsx`

```tsx
import React from 'react';

export interface YourComponentProps {
  title: string;
  variant?: 'primary' | 'secondary';
}

export const YourComponent: React.FC<YourComponentProps> = ({
  title,
  variant = 'primary'
}) => {
  return (
    <div className={`p-4 ${variant === 'primary' ? 'bg-blue-500' : 'bg-gray-500'}`}>
      <h2>{title}</h2>
    </div>
  );
};
```

### Step 2: Create Stories

`components/YourComponent/YourComponent.stories.tsx`

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { YourComponent } from './YourComponent';

const meta = {
  title: 'Components/YourComponent',
  component: YourComponent,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof YourComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    title: 'Hello World',
    variant: 'primary',
  },
};

export const Secondary: Story = {
  args: {
    title: 'Hello World',
    variant: 'secondary',
  },
};
```

### Step 3: Create Visual Tests

`tests/YourComponent.spec.ts`

```typescript
import { test, expect } from '@playwright/test';

const STORYBOOK_URL = 'http://localhost:6006';

test.describe('YourComponent Visual Regression', () => {
  test('Primary variant', async ({ page }) => {
    await page.goto(`${STORYBOOK_URL}/iframe.html?id=components-yourcomponent--primary`);
    await page.waitForSelector('div', { state: 'visible' });
    
    const component = page.locator('div').first();
    await expect(component).toHaveScreenshot('yourcomponent-primary.png');
  });

  test('Secondary variant', async ({ page }) => {
    await page.goto(`${STORYBOOK_URL}/iframe.html?id=components-yourcomponent--secondary`);
    await page.waitForSelector('div', { state: 'visible' });
    
    const component = page.locator('div').first();
    await expect(component).toHaveScreenshot('yourcomponent-secondary.png');
  });
});
```

### Step 4: Generate Baselines & Test

```bash
# Generate baseline screenshots
npm run test:visual:update

# Run tests
npm run test:visual

# View report
npm run test:visual:report
```

---

## 🔧 Configuration

### Playwright Configuration

`playwright.config.ts` - Key settings:

```typescript
export default defineConfig({
  // Visual regression sensitivity
  expect: {
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.01,  // 1% threshold
      threshold: 0.2,            // Per-pixel threshold
      animations: 'disabled',    // Disable animations
    },
  },

  // Browser projects
  projects: [
    { name: 'chromium' },
    { name: 'firefox' },
    { name: 'webkit' },
  ],

  // Auto-start Storybook
  webServer: {
    command: 'npm run storybook',
    url: 'http://localhost:6006',
    reuseExistingServer: !process.env.CI,
  },
});
```

### Storybook Configuration

`.storybook/main.ts` - Addon configuration:

```typescript
const config: StorybookConfig = {
  stories: ['../components/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-a11y',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
};
```

### Tailwind Configuration

`tailwind.config.js`:

```javascript
export default {
  content: [
    "./components/**/*.{js,ts,jsx,tsx}",
    "./.storybook/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
};
```

---

## 🧪 Testing Best Practices

### 1. Wait for Content

```typescript
// ❌ Bad - might capture before render
await expect(element).toHaveScreenshot('test.png');

// ✅ Good - wait for visibility
await page.waitForSelector('button', { state: 'visible' });
await expect(element).toHaveScreenshot('test.png');
```

### 2. Disable Animations

```typescript
// In individual tests
await expect(element).toHaveScreenshot('test.png', {
  animations: 'disabled',
});

// Or globally in playwright.config.ts
expect: {
  toHaveScreenshot: {
    animations: 'disabled',
  },
}
```

### 3. Test Different States

```typescript
test('hover state', async ({ page }) => {
  const button = page.locator('button');
  await button.hover();
  await page.waitForTimeout(300); // Wait for transition
  await expect(button).toHaveScreenshot('button-hover.png');
});

test('focus state', async ({ page }) => {
  const button = page.locator('button');
  await button.focus();
  await expect(button).toHaveScreenshot('button-focus.png');
});
```

### 4. Test Responsive Views

```typescript
test('mobile viewport', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto('...');
  await expect(element).toHaveScreenshot('mobile.png');
});
```

### 5. Organize Screenshots

```typescript
// Use descriptive names
await expect(button).toHaveScreenshot('button-primary-default.png');
await expect(button).toHaveScreenshot('button-primary-hover.png');
await expect(button).toHaveScreenshot('button-primary-disabled.png');
```

---

## 📊 Understanding Test Results

### When Tests Pass ✅

```
✓ [chromium] › SimpleButton.spec.ts:12:3 › Primary variant (1.2s)
✓ [chromium] › SimpleButton.spec.ts:20:3 › Secondary variant (0.9s)
```

All screenshots match baselines.

### When Tests Fail ❌

```
✗ [chromium] › SimpleButton.spec.ts:12:3 › Primary variant (2.1s)

Expected: button-primary.png
Received: button-primary-actual.png
    Diff: button-primary-diff.png
```

Visual differences detected. Check the diff image.

### Viewing Failure Details

```bash
npm run test:visual:report
```

Opens HTML report with:
- Expected image (baseline)
- Actual image (current)
- Diff image (highlighted differences)
- Pixel diff percentage

---

## 🔄 Updating Baselines

### When to Update

Update baselines when:
- ✅ Intentional design changes
- ✅ New features added
- ✅ Bug fixes that change appearance
- ❌ NOT for random failures

### How to Update

```bash
# Update all baselines
npm run test:visual:update

# Update specific test
npm run test:visual:update -- --grep "Primary variant"

# Update specific browser
npm run test:visual:update -- --project=chromium
```

### Selective Updates

```bash
# Run tests first to see failures
npm run test:visual

# Review failures in report
npm run test:visual:report

# Update only if changes are intentional
npm run test:visual:update
```

---

## 🚨 Troubleshooting

### Issue: Tests fail with "toHaveScreenshot timeout"

**Solution:**
```typescript
// Increase timeout
test('slow test', async ({ page }) => {
  test.setTimeout(60000); // 60 seconds
  // ... test code
});
```

### Issue: Screenshots differ between runs

**Causes & Solutions:**

1. **Animations not disabled**
   ```typescript
   await expect(element).toHaveScreenshot({
     animations: 'disabled',
   });
   ```

2. **Fonts not loaded**
   ```typescript
   await page.waitForLoadState('networkidle');
   await page.waitForTimeout(500);
   ```

3. **Dynamic content**
   ```typescript
   // Mock dates/times in tests
   await page.addInitScript(() => {
     Date.now = () => 1234567890000;
   });
   ```

### Issue: Playwright browsers not installing

```bash
# Install with dependencies
npx playwright install --with-deps chromium

# Or system-wide
sudo pacman -S playwright

# Check installation
npx playwright --version
```

### Issue: Storybook not starting

```bash
# Clear cache
rm -rf node_modules/.cache

# Reinstall
rm -rf node_modules package-lock.json
npm install

# Check port
lsof -i :6006  # Kill process if needed
```

### Issue: TypeScript errors

```bash
# Regenerate types
npx storybook@latest automigrate

# Check tsconfig.json includes correct paths
```

---

## 🎯 CI/CD Integration

### GitHub Actions Example

`.github/workflows/visual-regression.yml`

```yaml
name: Visual Regression Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Install Playwright browsers
        run: npx playwright install --with-deps chromium
      
      - name: Run visual tests
        run: npm run test:visual
      
      - name: Upload test results
        if: failure()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: playwright-report/
```

### GitLab CI Example

`.gitlab-ci.yml`

```yaml
visual-tests:
  image: mcr.microsoft.com/playwright:v1.49.0
  script:
    - npm ci
    - npm run test:visual
  artifacts:
    when: on_failure
    paths:
      - playwright-report/
    expire_in: 1 week
```

---

## 📚 Advanced Topics

### Testing Animations

```typescript
test('button animation', async ({ page }) => {
  const button = page.locator('button');
  
  // Capture multiple frames
  for (let i = 0; i < 5; i++) {
    await page.waitForTimeout(100);
    await expect(button).toHaveScreenshot(`button-frame-${i}.png`);
  }
});
```

### Testing Dark/Light Modes

```typescript
test('dark mode', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.goto('...');
  await expect(element).toHaveScreenshot('dark-mode.png');
});

test('light mode', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light' });
  await page.goto('...');
  await expect(element).toHaveScreenshot('light-mode.png');
});
```

### Testing with User Interactions

```typescript
test('dropdown opened', async ({ page }) => {
  await page.goto('...');
  
  const dropdown = page.locator('[data-testid="dropdown"]');
  await dropdown.click();
  
  await page.waitForSelector('[data-testid="dropdown-menu"]');
  await expect(page).toHaveScreenshot('dropdown-open.png');
});
```

### Parallel Testing

```typescript
// playwright.config.ts
export default defineConfig({
  fullyParallel: true,
  workers: process.env.CI ? 1 : 4, // 4 parallel workers locally
});
```

---

## 📖 Resources

### Official Documentation
- [Storybook Documentation](https://storybook.js.org/docs)
- [Playwright Documentation](https://playwright.dev/docs/intro)
- [Playwright Visual Comparisons](https://playwright.dev/docs/test-snapshots)

### Community Resources
- [Storybook Discord](https://discord.gg/storybook)
- [Playwright Discord](https://discord.gg/playwright)

### Arch Linux Specific
- [Arch Wiki - Node.js](https://wiki.archlinux.org/title/Node.js)
- [Arch Wiki - Playwright](https://wiki.archlinux.org/title/Playwright)

---

## 🎉 Summary

You now have:
- ✅ Storybook v10+ with React & Vite
- ✅ Playwright visual regression testing
- ✅ Automated setup script for Arch Linux
- ✅ Example component with full test coverage
- ✅ CI/CD ready configuration
- ✅ Best practices guide

**Next Steps:**
1. Run the setup script
2. Add your component code
3. Generate baseline screenshots
4. Start testing!

Happy testing! 🚀