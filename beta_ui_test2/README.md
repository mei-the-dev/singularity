# Beta UI Test2 - Blackhole GitHub Board Scaffold

This scaffold provides a modular React component library for building a Blackhole-themed GitHub board UX, based on the reference design.

## Components

### Environment
- **BlackholeBackground**: Animated blackhole background with orbiting particles and mouse-following effects.

### Molecules
- **IssueCard**: Individual issue card with priority, type, assignee, and story points.

### Organisms
- **Header**: Top navigation with search, filters, and new issue button.
- **Column**: Kanban column containing issue cards.
- **IssueDetailModal**: Modal for viewing issue details.

### Templates
- **Board**: Grid layout of kanban columns.

### Pages
- **BlackholeBoard**: Main page component combining all elements.

## Types

- `Issue`: Interface for issue data structure.

## Stories

Each component has corresponding Storybook stories for development and testing.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start Storybook to view components:
   ```bash
   npm run storybook
   ```

3. For a full app, create an App.tsx:
   ```tsx
   import React from 'react';
   import { BlackholeBoard } from './beta_ui_test2';

   function App() {
     return <BlackholeBoard />;
   }

   export default App;
   ```

4. Import globals.css in your main CSS file:
   ```css
   @import './beta_ui_test2/globals.css';
   ```

## Usage

Import and use the components in your React application:

```tsx
import BlackholeBoard from './BlackholeBoard';

function App() {
  return <BlackholeBoard />;
}
```

## Features

- Fully responsive design
- Animated blackhole background
- Interactive issue cards
- Modal issue details
- Search and filter functionality
- TypeScript support
- Storybook integration