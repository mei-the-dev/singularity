# Event Horizon Dashboard - Technical Specification

## 🎯 Overview

A real-time MCP development dashboard that displays system status, tool categories, active tasks, and provides interactive controls for the Singularity AI agent.

**Component Name:** `EventHorizonDashboard`  
**Version:** 21.5.0  
**Framework Compatibility:** Singularity AI Agent v21.5

---

## 📐 Component Architecture

### Core Modules

```
EventHorizonDashboard/
├── EventHorizonDashboard.tsx          # Main container
├── EventHorizonDashboard.stories.tsx  # Storybook stories
├── index.ts                           # Exports
├── components/
│   ├── BlackHoleBackground.tsx        # Animated background
│   ├── DashboardHeader.tsx            # Navigation and search
│   ├── BoardView.tsx                  # Kanban board
│   ├── ToolsView.tsx                  # MCP tools grid
│   ├── StatusView.tsx                 # System status
│   └── IssueModal.tsx                 # Issue detail modal
├── hooks/
│   ├── useMCPStatus.ts                # Real-time MCP integration
│   ├── useGitHubIssues.ts             # GitHub API integration
│   └── useSystemStatus.ts             # Service health monitoring
└── types/
    ├── mcp.types.ts                   # MCP tool definitions
    ├── issue.types.ts                 # Issue/task types
    └── status.types.ts                # System status types
```

---

## 🔌 MCP Integration Requirements

### Required MCP Tools

The dashboard must integrate with these MCP tools:

**Status Monitoring:**
- `check_storybook_status()` - Storybook health
- `check_services({ ports: [3000, 6006, 8080] })` - Port status
- `dev_status()` - Development session info
- `check_pipeline()` - CI/CD status

**Issue Management:**
- `list_issues({ limit: 50 })` - Fetch GitHub issues
- `create_issue({ title, body })` - Create new issue
- `update_issue({ issue_number, state })` - Update issue
- `start_task({ issue_id })` - Start task branch

**Component Operations:**
- `scaffold_component({ name, props })` - Generate component
- `generate_stories({ component, variants })` - Create stories
- `run_visual_tests({ updateSnapshots })` - Run Playwright
- `generate_baselines({ project })` - Generate VR baselines

**Environment:**
- `diagnose_storybook_preview()` - Diagnostic check
- `run_tests({ scope })` - Test execution
- `collect_artifacts({ paths, name })` - Debug artifacts

---

## 📊 Data Flow Architecture

```
┌─────────────────────────────────────────────────────┐
│          EventHorizonDashboard (Container)          │
└──────────────────┬──────────────────────────────────┘
                   │
         ┌─────────┴─────────┐
         │                   │
    ┌────▼─────┐      ┌─────▼──────┐
    │  MCP     │      │  GitHub    │
    │  Client  │      │  API       │
    └────┬─────┘      └─────┬──────┘
         │                  │
         └────────┬─────────┘
                  │
         ┌────────▼─────────┐
         │  Real-time Data  │
         │  - Tool Status   │
         │  - Issues        │
         │  - Services      │
         └────────┬─────────┘
                  │
    ┌─────────────┼─────────────┐
    │             │             │
┌───▼────┐  ┌────▼────┐  ┌────▼─────┐
│ Board  │  │ Tools   │  │ Status   │
│ View   │  │ View    │  │ View     │
└────────┘  └─────────┘  └──────────┘
```

---

## 🎨 Visual Design Specification

### Color Palette

```css
/* Background */
--bg-primary: #0a0a0f
--bg-secondary: rgba(15, 23, 42, 0.6)
--bg-tertiary: rgba(30, 41, 59, 0.4)

/* Accents */
--accent-indigo: rgb(99, 102, 241)
--accent-violet: rgb(139, 92, 246)
--accent-purple: rgb(168, 85, 247)

/* Status Colors */
--status-success: rgb(52, 211, 153)
--status-warning: rgb(251, 191, 36)
--status-error: rgb(248, 113, 113)
--status-info: rgb(96, 165, 250)

/* Text */
--text-primary: rgb(226, 232, 240)
--text-secondary: rgb(148, 163, 184)
--text-tertiary: rgb(100, 116, 139)
```

### Component States

**Issue Card States:**
```typescript
type IssueState = 
  | 'backlog'   // Slate gradient
  | 'todo'      // Blue gradient
  | 'inprogress' // Violet gradient (pulsing border)
  | 'review'    // Purple gradient (shimmer effect)
  | 'done'      // Emerald gradient (checkmark animation)
```

**Service Health:**
```typescript
type ServiceHealth = 
  | 'healthy'   // Green pulse animation
  | 'degraded'  // Yellow warning icon
  | 'down'      // Red error with alert
  | 'unknown'   // Gray question mark
```

---

## 🔧 Implementation Requirements

### 1. Real-time Updates

**Polling Strategy:**
```typescript
// Aggressive polling for critical status
const POLL_INTERVALS = {
  services: 5000,      // Every 5s
  issues: 30000,       // Every 30s
  tools: 10000,        // Every 10s
  environment: 60000,  // Every 1m
};

// Use React Query or SWR for intelligent caching
const { data: services } = useQuery({
  queryKey: ['services'],
  queryFn: checkServices,
  refetchInterval: POLL_INTERVALS.services,
  refetchOnWindowFocus: true,
});
```

### 2. Error Handling

**Graceful Degradation:**
```typescript
// If MCP connection fails, show cached data + warning banner
if (!mcpConnected) {
  return (
    <WarningBanner message="MCP connection lost. Showing cached data." />
    <Dashboard data={cachedData} readOnly={true} />
  );
}
```

### 3. Performance Optimization

**Virtualization for Large Lists:**
```typescript
// For 100+ issues, use react-virtual
import { useVirtualizer } from '@tanstack/react-virtual';

const rowVirtualizer = useVirtualizer({
  count: issues.length,
  getScrollElement: () => parentRef.current,
  estimateSize: () => 120, // Issue card height
});
```

### 4. Accessibility Requirements

- ✅ Full keyboard navigation (Tab, Arrow keys, Enter, Escape)
- ✅ ARIA labels for all interactive elements
- ✅ Screen reader announcements for status changes
- ✅ Focus management for modals
- ✅ High contrast mode support

---

## 📱 Responsive Breakpoints

```typescript
const BREAKPOINTS = {
  mobile: '640px',   // Stack all columns
  tablet: '1024px',  // 2-column grid
  desktop: '1280px', // 3-column grid
  wide: '1920px',    // 5-column board view
};
```

**Layout Strategy:**
- **Mobile (< 640px):** Single column, bottom sheet modals
- **Tablet (640-1024px):** Two columns, side drawer
- **Desktop (1024-1920px):** Full three-view layout
- **Wide (> 1920px):** Five-column Kanban board

---

## 🔐 Security Considerations

### API Key Management

```typescript
// NEVER expose GitHub tokens in frontend
// Use serverless functions or backend proxy

// ❌ BAD
const GITHUB_TOKEN = 'ghp_xxx';

// ✅ GOOD
const response = await fetch('/api/github/issues', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${session.token}` // Server-side only
  }
});
```

### MCP Communication

```typescript
// Validate all MCP responses
const schema = z.object({
  success: z.boolean(),
  data: z.unknown(),
  error: z.string().optional(),
});

const validated = schema.safeParse(mcpResponse);
if (!validated.success) {
  throw new Error('Invalid MCP response');
}
```

---

## 🧪 Testing Strategy

### Unit Tests (Vitest)

```typescript
// Test business logic, state management, utilities
describe('useMCPStatus', () => {
  it('should fetch tool status', async () => {
    const { result } = renderHook(() => useMCPStatus());
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.tools).toHaveLength(40);
  });
});
```

### Visual Regression (Playwright)

```typescript
// Test each view state
test.describe('EventHorizonDashboard', () => {
  test('Board view - empty state', async ({ page }) => {
    await page.goto('/dashboard?view=board&mock=empty');
    await expect(page).toHaveScreenshot('dashboard-board-empty.png');
  });
  
  test('Tools view - all categories', async ({ page }) => {
    await page.goto('/dashboard?view=tools');
    await expect(page).toHaveScreenshot('dashboard-tools-all.png');
  });
});
```

### Integration Tests

```typescript
// Test MCP integration end-to-end
test('should create issue via MCP', async () => {
  const dashboard = render(<EventHorizonDashboard />);
  
  // Click "New Issue" button
  await userEvent.click(screen.getByText('New Issue'));
  
  // Fill form
  await userEvent.type(screen.getByLabelText('Title'), 'Test Issue');
  
  // Submit
  await userEvent.click(screen.getByText('Create'));
  
  // Verify MCP call
  expect(mockMCP.create_issue).toHaveBeenCalledWith({
    title: 'Test Issue',
    body: expect.any(String),
  });
});
```

---

## 📝 Data Models

### Issue Type

```typescript
export interface Issue {
  id: number;
  title: string;
  body: string;
  state: 'open' | 'closed';
  status: 'backlog' | 'todo' | 'inprogress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high' | 'critical';
  type: 'bug' | 'feature' | 'enhancement' | 'docs' | 'test' | 'infrastructure';
  assignee?: {
    login: string;
    avatar_url: string;
  };
  labels: string[];
  points?: number;
  mcp_tool?: string;
  created_at: string;
  updated_at: string;
}
```

### MCP Tool Type

```typescript
export interface MCPTool {
  name: string;
  description: string;
  category: 'Environment' | 'Development' | 'Storybook' | 'Components' | 'Testing' | 'Git';
  status: 'ready' | 'running' | 'error' | 'disabled';
  args?: Record<string, unknown>;
  lastRun?: {
    timestamp: string;
    success: boolean;
    output?: string;
  };
}
```

### Service Status Type

```typescript
export interface ServiceStatus {
  name: string;
  port: number;
  status: 'running' | 'stopped' | 'starting' | 'error';
  health: 'healthy' | 'degraded' | 'unhealthy' | 'unknown';
  uptime?: string;
  pid?: number;
  url?: string;
}
```

---

## 🚀 Performance Targets

| Metric | Target | Critical |
|--------|--------|----------|
| Initial Load | < 2s | < 3s |
| Time to Interactive | < 3s | < 5s |
| Board View Render | < 500ms | < 1s |
| Modal Open | < 100ms | < 200ms |
| MCP Tool Call | < 2s | < 5s |
| Issue Drag-and-Drop | 60fps | 30fps |

**Optimization Techniques:**
- Code splitting by view
- Lazy load modals and heavy components
- Memoize expensive calculations
- Virtualize long lists
- Debounce search input
- Cache MCP responses

---

## 🔄 State Management

### Recommended: Zustand

```typescript
// stores/dashboardStore.ts
interface DashboardStore {
  // View state
  activeView: 'board' | 'tools' | 'status';
  setActiveView: (view: string) => void;
  
  // Issues
  issues: Issue[];
  setIssues: (issues: Issue[]) => void;
  updateIssue: (id: number, data: Partial<Issue>) => void;
  
  // Selected items
  selectedIssue: Issue | null;
  setSelectedIssue: (issue: Issue | null) => void;
  
  // Tools
  tools: MCPTool[];
  setTools: (tools: MCPTool[]) => void;
  
  // Services
  services: ServiceStatus[];
  setServices: (services: ServiceStatus[]) => void;
  
  // UI state
  isLoading: boolean;
  error: string | null;
}
```

---

## 📦 Dependencies

### Production

```json
{
  "react": "^18.2.0",
  "lucide-react": "^0.263.1",
  "zustand": "^4.5.0",
  "@tanstack/react-query": "^5.17.0",
  "@tanstack/react-virtual": "^3.0.1",
  "date-fns": "^3.0.0",
  "clsx": "^2.1.0"
}
```

### Development

```json
{
  "@storybook/react": "^8.4.7",
  "@playwright/test": "^1.48.0",
  "vitest": "^1.2.0",
  "@testing-library/react": "^14.1.0",
  "@testing-library/user-event": "^14.5.0"
}
```

---

## 🎯 User Stories

### As a Developer

1. **View System Status**
   - I want to see which services are running
   - So I know if my environment is healthy

2. **Monitor Tasks**
   - I want to see my GitHub issues in a Kanban board
   - So I can track progress visually

3. **Execute MCP Tools**
   - I want to click a button to run MCP tools
   - So I don't need to remember CLI commands

4. **Create Components**
   - I want to scaffold new components from the dashboard
   - So I can start development faster

### As the AI Agent

1. **Fetch Current State**
   - I need to poll dashboard data every 10s
   - So I can make informed decisions

2. **Execute Tools**
   - I need to trigger MCP tools programmatically
   - So I can automate workflows

3. **Update Status**
   - I need to update issue status in real-time
   - So the developer sees progress

---

## 🔄 Migration Path

### Phase 1: Core Components (Week 1)
- ✅ BlackHoleBackground
- ✅ DashboardHeader
- ✅ Basic layout structure
- ✅ Static data display

### Phase 2: MCP Integration (Week 2)
- ✅ useMCPStatus hook
- ✅ useGitHubIssues hook
- ✅ Real-time polling
- ✅ Error boundaries

### Phase 3: Interactive Features (Week 3)
- ✅ Drag-and-drop for Kanban
- ✅ Issue modal with full details
- ✅ Tool execution UI
- ✅ Search and filters

### Phase 4: Polish & Testing (Week 4)
- ✅ Visual regression tests
- ✅ Performance optimization
- ✅ Accessibility audit
- ✅ Documentation

---

## 📚 Documentation Requirements

### Storybook Stories

```typescript
export default {
  title: 'Dashboard/EventHorizonDashboard',
  component: EventHorizonDashboard,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Main dashboard for Singularity AI development workflow'
      }
    }
  }
} as Meta;

// Stories for each view
export const BoardView = { /* ... */ };
export const ToolsView = { /* ... */ };
export const StatusView = { /* ... */ };
export const EmptyState = { /* ... */ };
export const LoadingState = { /* ... */ };
export const ErrorState = { /* ... */ };
```

### README.md

Include:
- Quick start guide
- MCP integration examples
- Configuration options
- Troubleshooting
- Contributing guidelines

---

## ✅ Acceptance Criteria

### Functional

- [ ] Dashboard loads in < 2 seconds
- [ ] All three views render correctly
- [ ] Real-time status updates every 5-10s
- [ ] Issue creation/update via MCP works
- [ ] Tool execution shows loading states
- [ ] Drag-and-drop updates issue status
- [ ] Search filters issues correctly
- [ ] Keyboard navigation works throughout

### Non-Functional

- [ ] Passes all visual regression tests
- [ ] 90+ Lighthouse score
- [ ] Zero console errors/warnings
- [ ] WCAG 2.1 AA compliant
- [ ] Works in latest Chrome, Firefox, Safari, Edge
- [ ] Mobile responsive (< 640px)
- [ ] Handles 500+ issues without lag

---

## 🚨 Known Limitations

1. **GitHub API Rate Limiting**
   - 60 requests/hour for unauthenticated
   - 5000 requests/hour for authenticated
   - Implement caching and exponential backoff

2. **MCP Tool Timeouts**
   - Some tools (e.g., `run_playwright_docker`) take 5-10 minutes
   - Show progress indicators and allow cancellation

3. **Real-time Sync**
   - No WebSocket support yet
   - Polling creates delay (up to 10s)
   - Consider Server-Sent Events for future

---

## 🎓 Learning Resources

- [MCP Protocol Docs](https://modelcontextprotocol.io/)
- [Singularity Agent Guide](./singularity.agent.md)
- [Component Development Lifecycle](./docs/COMPONENT_DEVELOPMENT.md)
- [Visual Regression Testing](./docs/VISUAL_REGRESSION.md)

---

**Specification Version:** 1.0.0  
**Last Updated:** 2025-01-15  
**Status:** Ready for Implementation