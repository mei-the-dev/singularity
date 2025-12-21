# 🎯 AI Agent Task: Implement Event Horizon Dashboard

## Mission Brief

Implement the **Event Horizon Dashboard** - a real-time MCP development dashboard that integrates with all Singularity AI tools and provides visual monitoring for the entire development workflow.

**Priority:** HIGH  
**Estimated Time:** 4-6 hours autonomous work  
**Dependencies:** Complete UX lifecycle already patched

---

## 📋 Pre-Flight Checklist

Before starting, verify the environment:

```bash
/doctor
```

**Required:**
- ✅ Storybook v8.4+ installed
- ✅ Playwright v1.48+ configured
- ✅ MCP tools registered (40+)
- ✅ Tailwind CSS configured
- ✅ React Query installed

**If any missing, run:**
```bash
/vr-setup
npm install @tanstack/react-query lucide-react zustand
```

---

## 🚀 Phase 1: Create Directory Structure

### Execute:

```bash
mkdir -p ui/components/EventHorizonDashboard/{components,hooks,types}
mkdir -p ui/e2e/tests
```

### Verify:

```
/explore ui/components/EventHorizonDashboard
```

Should show:
```
EventHorizonDashboard/
├── components/
├── hooks/
└── types/
```

---

## 📝 Phase 2: Scaffold Type Definitions

### Create: `ui/components/EventHorizonDashboard/types/index.ts`

**Content:** Use the complete type definitions from the "Scaffold Files" artifact.

**Key types to include:**
```typescript
- ViewType
- IssueStatus, IssuePriority, IssueType
- Issue interface
- MCPTool interface
- ServiceStatus interface
- EnvironmentCheck interface
- RecentOperation interface
```

### Verify:

```typescript
/read ui/components/EventHorizonDashboard/types/index.ts
```

Should export 8+ types.

---

## 🔌 Phase 3: Implement MCP Integration Hooks

### Step 3.1: Create MCP Status Hook

**File:** `ui/components/EventHorizonDashboard/hooks/useMCPStatus.ts`

**Implementation Notes:**
- Copy the scaffold version first (with mock client)
- Use React Query for caching and polling
- Set refetch intervals: tools=10s, services=5s
- Handle loading and error states

**Key Features:**
```typescript
- Fetch MCP tools list
- Check service health (ports 6006, 3000, 8080)
- Auto-refresh every 5-10 seconds
- Graceful error handling
```

### Step 3.2: Create GitHub Issues Hook

**File:** `ui/components/EventHorizonDashboard/hooks/useGitHubIssues.ts`

**Implementation Notes:**
- Start with mock data from scaffold
- Use React Query mutations for updates
- Implement optimistic updates for snappy UI
- Add create/update/delete issue functions

**Later:** Replace mock with actual GitHub API calls via MCP tools.

### Verify:

```bash
/read ui/components/EventHorizonDashboard/hooks/useMCPStatus.ts
/read ui/components/EventHorizonDashboard/hooks/useGitHubIssues.ts
```

Both should use `@tanstack/react-query`.

---

## 🎨 Phase 4: Build Core Components

### Step 4.1: Black Hole Background

**File:** `ui/components/EventHorizonDashboard/components/BlackHoleBackground.tsx`

**Visual Requirements:**
- Animated black hole with accretion disk
- Mouse parallax effect
- Glowing particles orbiting center
- 80+ twinkling stars
- Performance: 60fps target

**Copy from scaffold and ensure:**
- Uses CSS animations (not JS for performance)
- Memoized to prevent re-renders
- Respects `prefers-reduced-motion`

### Step 4.2: Dashboard Header

**File:** `ui/components/EventHorizonDashboard/components/DashboardHeader.tsx`

**Features:**
- Three view tabs: Board, Tools, Status
- Search bar (board view only)
- "New Issue" button
- Real-time status indicator (green pulse)

**Props:**
```typescript
{
  activeView: ViewType;
  onViewChange: (view: ViewType) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onNewIssue: () => void;
}
```

### Step 4.3: Issue Card Component

**File:** `ui/components/EventHorizonDashboard/components/IssueCard.tsx`

**Visual Design:**
- Glassmorphism effect
- Priority badge (color-coded)
- Type icon (bug/feature/enhancement)
- Assignee avatar
- Story points badge
- Hover state: lift + glow + show MCP tool

**Hover Behavior:**
```typescript
hover:border-indigo-500/50 
hover:shadow-xl 
hover:-translate-y-1 
hover:scale-[1.02]
```

### Verify:

```bash
/read ui/components/EventHorizonDashboard/components/BlackHoleBackground.tsx
/read ui/components/EventHorizonDashboard/components/DashboardHeader.tsx
/read ui/components/EventHorizonDashboard/components/IssueCard.tsx
```

All should be properly typed with TypeScript.

---

## 🏗️ Phase 5: Build Main Dashboard Container

### Create: `ui/components/EventHorizonDashboard/EventHorizonDashboard.tsx`

**Architecture:**
```
EventHorizonDashboard (Container)
├── QueryClientProvider (React Query)
├── BlackHoleBackground
├── DashboardHeader
└── Views:
    ├── BoardView (5-column Kanban)
    ├── ToolsView (3-column grid)
    └── StatusView (system health)
```

**State Management:**
```typescript
const [activeView, setActiveView] = useState<ViewType>('board');
const [searchQuery, setSearchQuery] = useState('');
const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
```

**Data Fetching:**
```typescript
const { tools, services, isLoading } = useMCPStatus();
const { issues, updateIssue, createIssue } = useGitHubIssues();
```

**Key Implementation Details:**

1. **Board View:**
   - 5 columns: Backlog, To Do, In Progress, Review, Done
   - Filterable by search query
   - Click card to open modal

2. **Tools View:**
   - Group tools by category (from spec)
   - Show status badge (ready/running/error)
   - Click to execute (placeholder for now)

3. **Status View:**
   - Show running services (3 cards)
   - Show environment checks (node, git, docker)
   - Show recent operations (last 5)

### Verify:

```bash
/read ui/components/EventHorizonDashboard/EventHorizonDashboard.tsx
```

Should be 200-300 lines, well-organized.

---

## 📦 Phase 6: Create Index and Export

### Create: `ui/components/EventHorizonDashboard/index.ts`

```typescript
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
```

### Verify:

```bash
/read ui/components/EventHorizonDashboard/index.ts
```

Should export component + types.

---

## 📖 Phase 7: Create Storybook Stories

### Create: `ui/components/EventHorizonDashboard/EventHorizonDashboard.stories.tsx`

**Required Stories:**
1. Default (Board view)
2. FullBoard (many issues)
3. EmptyState (no issues)
4. ToolsView
5. StatusView
6. Loading
7. Error
8. Mobile
9. Tablet

**Copy from the stories artifact** - it's production-ready.

### Verify:

```bash
/storybook
```

Wait 10 seconds, then:

```bash
curl http://localhost:6006/index.json | grep -i "eventhorizon"
```

Should show the component in Storybook index.

Visit: `http://localhost:6006/?path=/story/dashboard-eventhorizondashboard--default`

---

## 🧪 Phase 8: Create Visual Regression Tests

### Create: `ui/e2e/tests/EventHorizonDashboard.spec.ts`

**Copy the complete test suite from the artifact.**

**Test Coverage:**
- ✅ Board view (default, full, empty)
- ✅ Tools view
- ✅ Status view
- ✅ Loading state
- ✅ Card hover state
- ✅ Mobile viewport (375px)
- ✅ Tablet viewport (768px)
- ✅ View switching interaction
- ✅ Search filtering interaction
- ✅ Issue modal interaction

### Verify Tests Exist:

```bash
/read ui/e2e/tests/EventHorizonDashboard.spec.ts
```

Should have 12+ test cases.

---

## 📸 Phase 9: Generate Visual Regression Baselines

### Step 9.1: Ensure Storybook is Running

```bash
/check_storybook_status
```

If not running:
```bash
/storybook
```

Wait 30 seconds for full initialization.

### Step 9.2: Generate Baselines

```bash
/vr-update
```

This will:
1. Start Storybook if not running
2. Run Playwright with `--update-snapshots`
3. Capture 12+ baseline images
4. Save to `ui/e2e/baselines/`

### Verify Baselines Created:

```bash
ls ui/e2e/baselines/ | grep dashboard
```

Should show:
```
dashboard-board-default.png
dashboard-board-full.png
dashboard-board-empty.png
dashboard-tools.png
dashboard-status.png
dashboard-loading.png
dashboard-card-hover.png
dashboard-mobile.png
dashboard-tablet.png
```

---

## ✅ Phase 10: Run Visual Regression Tests

### Execute:

```bash
/vr-test
```

This will:
1. Verify Storybook is healthy
2. Run all EventHorizonDashboard tests
3. Compare against baselines
4. Generate report

### Expected Output:

```
✅ 12 tests passed
📸 All screenshots match baselines
⏱️ Completed in 45 seconds
```

### If Failures Occur:

```bash
/analyze_test_results
```

Review the diff images in `playwright-report/`.

**If changes are intentional:**
```bash
/vr-update
```

**If changes are bugs:**
- Fix the component
- Rerun `/vr-test`
- Verify pass

---

## 🎨 Phase 11: Visual Polish & Refinement

### Checklist:

- [ ] **Animations:** Smooth 60fps, no jank
- [ ] **Colors:** Match spec (indigo/violet/purple)
- [ ] **Typography:** Proper font weights and sizes
- [ ] **Spacing:** Consistent padding/margins
- [ ] **Hover States:** All interactive elements have hover
- [ ] **Focus States:** Keyboard navigation visible
- [ ] **Loading States:** Spinners or skeletons
- [ ] **Empty States:** Helpful messages
- [ ] **Error States:** Clear error messages

### Test in Browser:

```bash
/storybook
```

Visit each story and verify:
1. Smooth animations
2. Hover effects work
3. Click interactions work
4. Search filtering works
5. View switching works

---

## 🔧 Phase 12: Integrate Real MCP Calls

### Step 12.1: Create MCP Client

**File:** `ui/lib/mcp-client.ts`

```typescript
export function createMCPClient(baseUrl: string) {
  return {
    async call(tool: string, args: unknown) {
      const response = await fetch(`${baseUrl}/api/mcp/call`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tool, args }),
      });
      if (!response.ok) throw new Error(`MCP call failed: ${response.statusText}`);
      return response.json();
    },
    
    checkStorybookStatus: () => this.call('check_storybook_status', {}),
    checkServices: (ports: number[]) => this.call('check_services', { ports }),
    listTools: () => this.call('list_tools', {}),
    listIssues: (limit: number) => this.call('list_issues', { limit }),
    updateIssue: (issue_number: number, state: string) => 
      this.call('update_issue', { issue_number, state }),
  };
}
```

### Step 12.2: Replace Mock Clients

Update `useMCPStatus.ts` and `useGitHubIssues.ts` to use real MCP client.

### Step 12.3: Test Real Integration

```bash
/start_dev
```

Open dashboard in browser and verify:
- Real issue data loads
- Services show actual status
- Tools list is accurate

---

## 📊 Phase 13: Performance Optimization

### Run Lighthouse Audit:

```bash
npm run build
npx serve ui/out
npx lighthouse http://localhost:3000/dashboard --view
```

**Target Scores:**
- Performance: 90+
- Accessibility: 100
- Best Practices: 95+
- SEO: 90+

### Optimizations:

1. **Code Splitting:**
```typescript
const IssueModal = lazy(() => import('./components/IssueModal'));
```

2. **Memoization:**
```typescript
const IssueCard = React.memo(IssueCardComponent);
```

3. **Virtualization (if 100+ issues):**
```typescript
import { useVirtualizer } from '@tanstack/react-virtual';
```

4. **Image Optimization:**
- Use WebP for backgrounds
- Lazy load images
- Proper sizing

---

## 📝 Phase 14: Documentation

### Create: `ui/components/EventHorizonDashboard/README.md`

**Include:**
- Component overview
- Usage examples
- Props documentation
- MCP integration guide
- Troubleshooting
- Contributing guidelines

### Update Main Docs:

Add to `docs/COMPONENT_DEVELOPMENT.md`:
```markdown
## Event Horizon Dashboard

The main MCP development dashboard. See detailed docs in 
`ui/components/EventHorizonDashboard/README.md`.
```

---

## ✅ Phase 15: Final Verification

### Run Complete Test Suite:

```bash
/doctor
```

This will:
- ✅ Check environment
- ✅ Run unit tests
- ✅ Run visual regression tests
- ✅ Check Storybook health
- ✅ Verify MCP tools
- ✅ Check CI/CD status

### Manual Verification:

Visit each view in Storybook:
- [ ] Default board loads in < 2s
- [ ] All 5 columns render
- [ ] Issue cards are interactive
- [ ] Tools view shows 40+ tools
- [ ] Status view shows services
- [ ] Search filters issues
- [ ] View switching smooth
- [ ] Mobile layout works
- [ ] No console errors

---

## 🚢 Phase 16: Commit & Ship

### Commit Changes:

```bash
/diff
```

Review all changes, then:

```bash
git add ui/components/EventHorizonDashboard
git add ui/e2e/tests/EventHorizonDashboard.spec.ts
git add ui/e2e/baselines/dashboard-*.png
git commit -m "feat: implement Event Horizon dashboard with visual regression

- Complete MCP development dashboard
- Real-time status monitoring
- GitHub issue Kanban board
- MCP tools interface
- System health display
- 12+ visual regression tests
- Fully responsive design
- Integrated with all MCP tools"
```

### Create PR:

```bash
/pr
```

**PR Title:** `feat: Event Horizon Dashboard - MCP Development Interface`

**PR Description:**
```markdown
## 🎯 Summary

Implements the Event Horizon Dashboard - a real-time MCP development dashboard that provides:

- **Kanban Board** for GitHub issues
- **MCP Tools** interface for all 40+ tools
- **System Status** monitoring (services, environment, operations)
- **Visual Regression Testing** with 12+ test cases
- **Real-time Updates** via React Query polling
- **Responsive Design** (mobile, tablet, desktop)

## 📸 Screenshots

[Include screenshots of all three views]

## ✅ Testing

- All visual regression tests passing
- Lighthouse score: 95+
- No console errors
- Tested on Chrome, Firefox, Safari, Edge
- Mobile responsive verified

## 🔧 MCP Integration

Uses these MCP tools:
- check_storybook_status
- check_services
- list_tools
- list_issues
- update_issue

## 📚 Documentation

See `ui/components/EventHorizonDashboard/README.md`
```

### Wait for CI:

```bash
/check_pipeline
```

Wait for all checks to pass. If failures:
- Review logs
- Fix issues
- Push updates
- Wait for re-run

---

## 🎉 Success Criteria

Dashboard is complete when:

- ✅ All 12+ visual regression tests passing
- ✅ Lighthouse score > 90
- ✅ No console errors or warnings
- ✅ Real-time data updates working
- ✅ All three views functional
- ✅ Mobile responsive
- ✅ Keyboard accessible
- ✅ Documentation complete
- ✅ CI/CD pipeline green
- ✅ PR approved and merged

---

## 🆘 Troubleshooting

### Issue: Storybook won't start

**Solution:**
```bash
/diagnose_storybook_preview
/fix_storybook_preview
/storybook
```

### Issue: Visual tests failing

**Solution:**
```bash
/analyze_test_results
```

Review diffs in `playwright-report/index.html`.

If changes intentional: `/vr-update`

### Issue: Performance issues

**Solution:**
- Reduce particle count in BlackHoleBackground
- Add React.memo to components
- Implement virtualization for large lists
- Code split heavy components

### Issue: MCP calls timing out

**Solution:**
- Increase React Query timeout
- Add retry logic with exponential backoff
- Check MCP server logs

---

## 📚 Reference Materials

- **Technical Spec:** [First artifact]
- **Scaffold Files:** [Second artifact]
- **Stories & Tests:** [Third artifact]
- **Singularity Agent Guide:** `singularity.agent.md`
- **Visual Regression Guide:** `docs/VISUAL_REGRESSION.md`

---

## 🎓 Learning Outcomes

After completing this task, you will have:

- ✅ Built a complex React dashboard
- ✅ Integrated with MCP protocol
- ✅ Implemented real-time data fetching
- ✅ Created comprehensive visual regression tests
- ✅ Achieved 90+ Lighthouse score
- ✅ Followed Singularity development lifecycle

---

**Estimated Time:** 4-6 hours  
**Difficulty:** Medium-High  
**Priority:** HIGH  
**Status:** Ready to Implement

**Go build something amazing!** 🚀