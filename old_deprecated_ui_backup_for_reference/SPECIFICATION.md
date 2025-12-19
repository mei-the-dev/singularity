# 🌌 SINGULARITY UI SPECIFICATION (V22)

## 🎯 OBJECTIVE
Transform this scaffold into a fully functional **Jira-Clone** connected to the Local MCP Agent.

## 🎨 DESIGN SYSTEM ("Void & Gold")
- **Backgrounds:** Never pure black. Use gradients of `#050505` to `#101010`.
- **Accents:** Gold (`#D4AF37`) is reserved for:
  - Active states.
  - Borders on hover.
  - "In Progress" indicators.
- **Glassmorphism:** All cards/panels must use `backdrop-filter: blur(12px)` and `bg-opacity-10`.

## 🛠️ COMPONENT REQUIREMENTS

### 1. `KanbanBoard.tsx` (The Grid)
- **Drag & Drop:** Must implement `framer-motion` or `@dnd-kit/core`.
- **Columns:**
  - Backlog (Gray)
  - In Progress (Gold Pulse Animation)
  - Done (Green Dimmed)

### 2. `IssueCard.tsx` (The Atom)
- **Props:** `{ id, title, type, priority, assignee }`
- **Interactions:**
  - Clicking opens a Modal (Overlay).
  - Hovering creates a "Gold Glow" effect (Shadow).

### 3. `AgentConnection.tsx` (The Brain)
- **Function:** Polls `http://localhost:3000/api/status` (or similar) to get real issues via MCP.
- **Logic:**
  - On Mount -> Call `list_issues`.
  - On Drop -> Call `update_issue_status`.

## 🚀 IMPLEMENTATION STEPS FOR AGENT
1. Run `npm install`.
2. Connect `page.tsx` state to a `useContext` hook.
3. Replace Mock Data with a `useEffect` that fetches from the file system or MCP server.