// ============================================================================
// FILE: ui/components/EventHorizonDashboard/EventHorizonDashboard.stories.tsx
// ============================================================================

import type { Meta, StoryObj } from '@storybook/react';
import { EventHorizonDashboard } from './EventHorizonDashboard';

const meta: Meta<typeof EventHorizonDashboard> = {
  title: 'Dashboard/EventHorizonDashboard',
  component: EventHorizonDashboard,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Main dashboard for Singularity AI development workflow. Displays GitHub issues, MCP tools, and system status in real-time.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default view showing the Kanban board with issues
 */
export const Default: Story = {};

/**
 * Board view with many issues across all columns
 */
export const FullBoard: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Dashboard with multiple issues in each column, demonstrating the full Kanban workflow.',
      },
    },
  },
};

/**
 * Empty state when no issues exist
 */
export const EmptyState: Story = {
  parameters: {
    mockData: {
      issues: [],
    },
    docs: {
      description: {
        story: 'Dashboard showing empty state with helpful onboarding message.',
      },
    },
  },
};

/**
 * Tools view showing available MCP tools
 */
export const ToolsView: Story = {
  args: {
    defaultView: 'tools',
  },
};

/**
 * Status view showing system health
 */
export const StatusView: Story = {
  args: {
    defaultView: 'status',
  },
};

/**
 * Loading state while fetching data
 */
export const Loading: Story = {
  parameters: {
    mockData: {
      isLoading: true,
    },
  },
};

/**
 * Error state when API calls fail
 */
export const Error: Story = {
  parameters: {
    mockData: {
      error: new Error('Failed to fetch data from MCP server'),
    },
  },
};

/**
 * Dark mode variant (default)
 */
export const DarkMode: Story = {};

/**
 * With search query applied
 */
export const WithSearch: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const searchInput = canvas.getByPlaceholderText('Search issues...');
    await userEvent.type(searchInput, 'authentication');
  },
};

/**
 * Mobile viewport
 */
export const Mobile: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

/**
 * Tablet viewport
 */
export const Tablet: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
  },
};

// ============================================================================
// FILE: ui/components/EventHorizonDashboard/index.ts
// ============================================================================

export { EventHorizonDashboard } from './EventHorizonDashboard';
export type {
  Issue,
  MCPTool,
  ServiceStatus,
  ViewType,
  IssueStatus,
  IssuePriority,
  IssueType,
} from './types';

// ============================================================================
// FILE: ui/e2e/tests/EventHorizonDashboard.spec.ts
// ============================================================================

import { test, expect } from '@playwright/test';

const STORYBOOK_URL = process.env.STORYBOOK_URL || 'http://localhost:6006';

test.describe('EventHorizonDashboard Visual Regression', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(STORYBOOK_URL);
    await page.waitForFunction(() => {
      return window.__STORYBOOK_CLIENT_API__ !== undefined;
    }, { timeout: 10000 });
  });

  test('Default view - Board', async ({ page }) => {
    await page.goto(`${STORYBOOK_URL}/iframe.html?id=dashboard-eventhorizondashboard--default&viewMode=story`);
    await page.waitForSelector('[class*="min-h-screen"]', { state: 'visible' });
    await page.waitForTimeout(1000); // Allow animations to complete
    
    await expect(page).toHaveScreenshot('dashboard-board-default.png', {
      fullPage: true,
      timeout: 10000,
    });
  });

  test('Board view - Full board', async ({ page }) => {
    await page.goto(`${STORYBOOK_URL}/iframe.html?id=dashboard-eventhorizondashboard--full-board&viewMode=story`);
    await page.waitForSelector('[class*="grid-cols-5"]', { state: 'visible' });
    await page.waitForTimeout(1000);
    
    await expect(page).toHaveScreenshot('dashboard-board-full.png', {
      fullPage: true,
    });
  });

  test('Board view - Empty state', async ({ page }) => {
    await page.goto(`${STORYBOOK_URL}/iframe.html?id=dashboard-eventhorizondashboard--empty-state&viewMode=story`);
    await page.waitForSelector('[class*="min-h-screen"]', { state: 'visible' });
    await page.waitForTimeout(500);
    
    await expect(page).toHaveScreenshot('dashboard-board-empty.png');
  });

  test('Tools view', async ({ page }) => {
    await page.goto(`${STORYBOOK_URL}/iframe.html?id=dashboard-eventhorizondashboard--tools-view&viewMode=story`);
    await page.waitForSelector('[class*="grid-cols-3"]', { state: 'visible' });
    await page.waitForTimeout(1000);
    
    await expect(page).toHaveScreenshot('dashboard-tools.png', {
      fullPage: true,
    });
  });

  test('Status view', async ({ page }) => {
    await page.goto(`${STORYBOOK_URL}/iframe.html?id=dashboard-eventhorizondashboard--status-view&viewMode=story`);
    await page.waitForSelector('[class*="grid-cols-3"]', { state: 'visible' });
    await page.waitForTimeout(1000);
    
    await expect(page).toHaveScreenshot('dashboard-status.png', {
      fullPage: true,
    });
  });

  test('Loading state', async ({ page }) => {
    await page.goto(`${STORYBOOK_URL}/iframe.html?id=dashboard-eventhorizondashboard--loading&viewMode=story`);
    await page.waitForSelector('[class*="min-h-screen"]', { state: 'visible' });
    await page.waitForTimeout(500);
    
    await expect(page).toHaveScreenshot('dashboard-loading.png');
  });

  test('Issue card hover state', async ({ page }) => {
    await page.goto(`${STORYBOOK_URL}/iframe.html?id=dashboard-eventhorizondashboard--default&viewMode=story`);
    await page.waitForSelector('[class*="rounded-xl"]', { state: 'visible' });
    
    const firstCard = page.locator('[class*="rounded-xl"]').first();
    await firstCard.hover();
    await page.waitForTimeout(300);
    
    await expect(page).toHaveScreenshot('dashboard-card-hover.png');
  });

  test('Mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(`${STORYBOOK_URL}/iframe.html?id=dashboard-eventhorizondashboard--mobile&viewMode=story`);
    await page.waitForSelector('[class*="min-h-screen"]', { state: 'visible' });
    await page.waitForTimeout(1000);
    
    await expect(page).toHaveScreenshot('dashboard-mobile.png', {
      fullPage: true,
    });
  });

  test('Tablet viewport', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto(`${STORYBOOK_URL}/iframe.html?id=dashboard-eventhorizondashboard--tablet&viewMode=story`);
    await page.waitForSelector('[class*="min-h-screen"]', { state: 'visible' });
    await page.waitForTimeout(1000);
    
    await expect(page).toHaveScreenshot('dashboard-tablet.png', {
      fullPage: true,
    });
  });
});

test.describe('EventHorizonDashboard Interactions', () => {
  test('should switch between views', async ({ page }) => {
    await page.goto(`${STORYBOOK_URL}/iframe.html?id=dashboard-eventhorizondashboard--default&viewMode=story`);
    
    // Click Tools tab
    await page.click('text=MCP Tools');
    await expect(page.locator('text=scaffold_component')).toBeVisible();
    
    // Click Status tab
    await page.click('text=Status');
    await expect(page.locator('text=Storybook')).toBeVisible();
    
    // Click Board tab
    await page.click('text=Board');
    await expect(page.locator('text=Backlog')).toBeVisible();
  });

  test('should filter issues by search', async ({ page }) => {
    await page.goto(`${STORYBOOK_URL}/iframe.html?id=dashboard-eventhorizondashboard--default&viewMode=story`);
    
    const searchInput = page.locator('input[placeholder="Search issues..."]');
    await searchInput.fill('authentication');
    
    // Should show only matching issue
    await expect(page.locator('text=Implement authentication module')).toBeVisible();
  });

  test('should open issue modal on card click', async ({ page }) => {
    await page.goto(`${STORYBOOK_URL}/iframe.html?id=dashboard-eventhorizondashboard--default&viewMode=story`);
    
    const firstCard = page.locator('[class*="rounded-xl"]').first();
    await firstCard.click();
    
    // Modal should appear
    await expect(page.locator('text=Suggested MCP Tool')).toBeVisible();
  });
});

// ============================================================================
// FILE: IMPLEMENTATION_GUIDE.md
// ============================================================================

/*
# Event Horizon Dashboard - Implementation Guide

## 🚀 Quick Start for AI Agent

### Step 1: Create Directory Structure

```bash
mkdir -p ui/components/EventHorizonDashboard/{components,hooks,types}
mkdir -p ui/e2e/tests
```

### Step 2: Copy Scaffold Files

1. Copy all type definitions from scaffold files to `types/index.ts`
2. Copy hooks to `hooks/useMCPStatus.ts` and `hooks/useGitHubIssues.ts`
3. Copy component files to `components/` directory
4. Copy main dashboard to `EventHorizonDashboard.tsx`
5. Copy stories to `EventHorizonDashboard.stories.tsx`
6. Copy tests to `ui/e2e/tests/EventHorizonDashboard.spec.ts`

### Step 3: Install Dependencies

```bash
npm install @tanstack/react-query @tanstack/react-virtual zustand
npm install --save-dev @types/react
```

### Step 4: Configure Tailwind

Add to `tailwind.config.js`:

```javascript
module.exports = {
  content: [
    './ui/components/EventHorizonDashboard/**/*.{ts,tsx}',
    // ... other paths
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      animation: {
        'spin-slow': 'spin 28s linear infinite',
        'spin-slower': 'spin 40s linear infinite',
      },
    },
  },
};
```

### Step 5: Start Development

```bash
# Start Storybook
npm run storybook

# In another terminal, verify component appears
curl http://localhost:6006/index.json | grep EventHorizon
```

### Step 6: Generate Baselines

```bash
# Generate visual regression baselines
npm run baselines:generate

# Verify baselines created
ls ui/e2e/baselines/ | grep dashboard
```

## 🔧 Integration with MCP Server

### Replace Mock MCP Client

In `hooks/useMCPStatus.ts`, replace the mock client:

```typescript
// Before (mock):
const mcpClient = {
  checkStorybookStatus: async () => ({ ... }),
  // ...
};

// After (real):
import { createMCPClient } from '@/lib/mcp-client';
const mcpClient = createMCPClient(process.env.MCP_SERVER_URL);
```

### MCP Client Implementation

Create `ui/lib/mcp-client.ts`:

```typescript
export function createMCPClient(serverUrl: string) {
  return {
    async checkStorybookStatus() {
      const response = await fetch(`${serverUrl}/api/mcp/call`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tool: 'check_storybook_status',
          args: {},
        }),
      });
      return response.json();
    },
    
    async checkServices(ports: number[]) {
      const response = await fetch(`${serverUrl}/api/mcp/call`, {
        method: 'POST',
        body: JSON.stringify({
          tool: 'check_services',
          args: { ports },
        }),
      });
      return response.json();
    },
    
    // Add more MCP tool wrappers...
  };
}
```

## 🎨 Customization

### Change Color Scheme

Update colors in `types/index.ts`:

```typescript
export const THEME = {
  primary: 'indigo',
  secondary: 'violet',
  accent: 'purple',
};
```

### Add New Views

1. Create new component in `components/MyView.tsx`
2. Add to view types in `types/index.ts`
3. Update `DashboardHeader` views array
4. Add conditional render in main dashboard

### Custom Issue Statuses

Update `types/index.ts`:

```typescript
export type IssueStatus = 
  | 'backlog' 
  | 'todo' 
  | 'inprogress' 
  | 'review' 
  | 'done'
  | 'blocked'    // Add custom status
  | 'deployed';  // Add custom status
```

## 🧪 Testing Workflow

### 1. Unit Tests

```bash
# Run Vitest tests
npm test -- EventHorizonDashboard
```

### 2. Visual Regression

```bash
# Generate baselines (first time)
npm run baselines:generate

# Run visual tests
npm run test:visual:docker

# Update baselines (after intentional changes)
npm run test:visual:docker:update
```

### 3. Integration Tests

```bash
# Run Playwright interaction tests
npx playwright test EventHorizonDashboard --headed
```

## 📊 Performance Optimization

### Lazy Load Heavy Components

```typescript
const IssueModal = lazy(() => import('./components/IssueModal'));
const ToolsView = lazy(() => import('./components/ToolsView'));
```

### Virtualize Long Lists

For boards with 100+ issues:

```typescript
import { useVirtualizer } from '@tanstack/react-virtual';

const rowVirtualizer = useVirtualizer({
  count: issues.length,
  getScrollElement: () => parentRef.current,
  estimateSize: () => 120,
});
```

### Optimize Re-renders

Use React.memo for expensive components:

```typescript
export const IssueCard = React.memo<IssueCardProps>(({ issue, onClick }) => {
  // ...
}, (prev, next) => prev.issue.id === next.issue.id);
```

## 🔐 Security Checklist

- [ ] Never expose GitHub tokens in frontend
- [ ] Validate all MCP responses with Zod
- [ ] Sanitize user inputs before display
- [ ] Use HTTPS for all API calls
- [ ] Implement rate limiting on MCP calls
- [ ] Add CSRF protection for mutations

## 🐛 Troubleshooting

### Issue: Background animations causing lag

**Solution:** Reduce particle count or disable on low-end devices:

```typescript
const PARTICLE_COUNT = isMobile ? 20 : 80;
```

### Issue: Visual tests flaking

**Solution:** Increase wait times and disable animations:

```typescript
await page.waitForTimeout(1000);
await page.emulateMedia({ reducedMotion: 'reduce' });
```

### Issue: MCP connection timeouts

**Solution:** Add retry logic with exponential backoff:

```typescript
const { data } = useQuery({
  queryKey: ['mcp', 'tools'],
  queryFn: mcpClient.listTools,
  retry: 3,
  retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
});
```

## ✅ Pre-deployment Checklist

- [ ] All visual regression tests passing
- [ ] Lighthouse score > 90
- [ ] No console errors or warnings
- [ ] Tested on Chrome, Firefox, Safari, Edge
- [ ] Mobile responsive (tested on 375px width)
- [ ] Keyboard navigation works
- [ ] Screen reader accessible
- [ ] Error states handled gracefully
- [ ] Loading states implemented
- [ ] Empty states designed
- [ ] Documentation complete

## 📚 Additional Resources

- [MCP Integration Guide](./docs/MCP_INTEGRATION.md)
- [Storybook Best Practices](./docs/STORYBOOK_GUIDE.md)
- [Visual Regression Testing](./docs/VISUAL_REGRESSION.md)
- [Component Architecture](./docs/COMPONENT_ARCHITECTURE.md)

---

**Implementation Status:** Ready  
**Estimated Time:** 4-6 hours  
**Difficulty:** Medium  
**Dependencies:** React Query, Lucide Icons, Tailwind CSS
*/
