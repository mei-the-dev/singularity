# PROJECT BEST PRACTICES: BLACKHOLE BOARD

## 1. ARCHITECTURAL PATTERNS
### Component Decomposition (Atomic Design)
* **Strict Monolith Ban:** No file shall exceed 250 lines. The current `blackhole-github-board.tsx` is a reference implementation, not a production pattern.
* **Directory Structure:**
    ```text
    src/
    ├── components/
    │   ├── atoms/       (Badge, IconWrapper, GhostButton)
    │   ├── molecules/   (IssueCard, ColumnHeader, SearchBar)
    │   ├── organisms/   (BoardColumn, IssueModal, Sidebar)
    │   └── templates/   (BoardLayout, DashboardView)
    ├── hooks/           (useMousePosition, useDragAndDrop)
    ├── styles/          (Tailwind custom configs)
    └── utils/           (priorityHelpers.ts, formatting.ts)
    ```

### Data Flow & Types
* **Strict Interfaces:** All domain objects must be typed. Never use `any`.
    ```typescript
    // standard_types.ts
    export type Priority = 'critical' | 'high' | 'medium' | 'low';
    export type IssueStatus = 'backlog' | 'todo' | 'inprogress' | 'review' | 'done';
    
    export interface Issue {
      id: number;
      title: string;
      status: IssueStatus;
      priority: Priority;
      points: number;
      assignee: string; // eventually User interface
    }
    ```

## 2. STYLING & THEMING (EVENT HORIZON THEME)
### Color Palette Constraints
* **Primary Backgrounds:** MUST use `bg-black` or `bg-gradient-radial` (center) to maintained the "void" aesthetic.
* **Accent Color:** Strictly `Amber` (`amber-100` to `amber-900`).
* **Glassmorphism:**
    * **Do:** `bg-black/80 backdrop-blur-xl border-amber-900/30`.
    * **Don't:** Solid grays or white backgrounds.
* **Gradients:** Use subtle gradients for cards to simulate lighting from the singularity.
    * *Example:* `bg-gradient-to-br from-amber-950/40 to-amber-900/20`.

### Visual Hierarchy
1.  **Text High:** `text-amber-100` (Titles, Active States).
2.  **Text Medium:** `text-amber-400` or `text-amber-600` (Metadata, Icons).
3.  **Text Low:** `text-amber-900` or `text-amber-800` (Borders, faint details).
4.  **Avoid:** Pure white (`#ffffff`) or Pure Blue/Green (breaks immersion).

## 3. PERFORMANCE & ANIMATION
### The "Mouse Move" Rule (Critical)
* **Problem:** The current implementation uses `useState` for mouse position, triggering a React re-render of the entire tree on every pixel of mouse movement.
* **Solution:** Use **CSS Variables** or **Direct DOM Manipulation** via Refs for background parallax effects.
    ```typescript
    // CORRECT PATTERN
    const handleMove = (e) => {
      // Updates CSS variable, NO React Render Cycle
      document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
      document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
    };
    ```

### CSS Animation Strategy
* **GPU Acceleration:** Always use `transform` and `opacity` for animations (orbits, spins). Avoid animating `top/left/width/height`.
* **Complexity:** Offload continuous animations (spins, orbits) to CSS Modules (`.orbit { animation: ... }`) rather than JS intervals.

## 4. COMPONENT IMPLEMENTATION GUIDELINES

### Icons (Lucide React)
* **Consistency:** Always set stroke width to `1.5` or `2` for a sleek look.
* **Sizing:** Use standard sizing classes (`w-3 h-3`, `w-4 h-4`).
* **Pattern:**
    ```tsx
    // Do
    <GitBranch className="w-4 h-4 text-amber-600" />
    
    // Don't
    <GitBranch size={16} color="orange" /> // Use Tailwind classes instead
    ```

### Accessibility (A11y) in Dark Mode
* **Contrast Check:** `amber-900` text on `black` often fails WCAG. Use `amber-700` minimum for readable text.
* **Focus States:** Custom focus rings are required as browser defaults are often blue.
    * *Rule:* `focus:ring-1 focus:ring-amber-500 focus:outline-none`.

## 5. REFACTORING WORKFLOW
When asking AI to modify code, strict adherence to this sequence is required:

1.  **Analyze Dependencies:** Check what props the component relies on.
2.  **Extract:** Move logic to `src/components/...`.
3.  **Type:** Define the interface in `types.ts`.
4.  **Story:** Create the `.stories.tsx` file immediately.
5.  **Integration:** Import back into the main view.

## 6. TESTING & QUALITY
* **Visual Regression:** Critical for this project due to complex layering (z-index, glassmorphism).
* **Storybook:** Every interactive "Molecule" (Card, Button, Input) must have a story.
* **Smoke Test:** Ensure the "Blackhole" center div is strictly `pointer-events-none` so it doesn't block clicks on the Kanban board.