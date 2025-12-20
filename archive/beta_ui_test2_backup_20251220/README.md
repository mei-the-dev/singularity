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

## GitHub Integration

The board fetches real issues from a GitHub repository using the GitHub API.

### Authentication

**Recommended: Use GitHub CLI to get your token:**
```bash
# Install GitHub CLI: https://cli.github.com/
gh auth login
gh auth token  # Copy this token
```

**Then set as environment variable:**
```bash
export REACT_APP_GITHUB_TOKEN=your_token_here
```

### Setup

1. **Get GitHub token** (see Authentication section above)

2. **Configure repository**:
   ```bash
   export REACT_APP_GITHUB_REPO_OWNER=your_username
   export REACT_APP_GITHUB_REPO_NAME=your_repo
   ```

3. **Run the app**:
   ```bash
   npm install
   npm run storybook
   ```

### Label Mapping

Issues are categorized using GitHub labels:

- **Status**: `status:backlog`, `status:todo`, `status:inprogress`, `status:review`, `status:done`
- **Priority**: `priority:critical`, `priority:high`, `priority:medium`, `priority:low`
- **Type**: `type:bug`, `type:feature`, `type:enhancement`, `type:design`, `type:docs`, `type:test`, `type:infrastructure`
- **Story Points**: `points:5` (any number)

Example issue with labels: `status:inprogress`, `priority:high`, `type:feature`, `points:8`

### Features

- Real-time data from GitHub
- Automatic categorization based on labels
- Direct links to GitHub issues
- Loading and error states
- Fallback to sample data if API fails
- Fully responsive design
- Animated blackhole background with mouse interaction
- Interactive issue cards with hover effects
- Modal issue details
- Search and filter functionality
- TypeScript support
- Storybook integration for component development