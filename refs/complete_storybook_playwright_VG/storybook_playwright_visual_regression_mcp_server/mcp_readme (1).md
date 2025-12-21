# Visual Regression MCP Server

A powerful MCP (Model Context Protocol) server that enables AI agents to set up and run complete visual regression testing pipelines with Storybook v10+ and Playwright.

## 🎯 Features

- **Complete Environment Setup**: Automatically configure Storybook, Playwright, and all dependencies
- **Component Management**: Create components, stories, and visual tests
- **Test Execution**: Generate baselines and run visual regression tests
- **Result Analysis**: Parse and analyze test results with detailed failure reports
- **Lifecycle Management**: Start/stop Storybook, manage browsers, cleanup artifacts
- **AI-Friendly**: Designed for autonomous AI agent workflows

## 📦 Installation

```bash
# Clone or download the MCP server
cd visual-regression-mcp-server

# Install dependencies
npm install

# Build the server
npm run build

# Or run in development mode
npm run dev
```

## 🔧 Configuration

### Claude Desktop Configuration

Add to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "visual-regression": {
      "command": "node",
      "args": [
        "/absolute/path/to/visual-regression-mcp-server/build/index.js"
      ]
    }
  }
}
```

### Cline/Other MCP Clients

Add to your MCP client configuration:

```json
{
  "name": "visual-regression",
  "type": "stdio",
  "command": "node",
  "args": ["/path/to/build/index.js"]
}
```

## 🚀 Available Tools

### Setup & Configuration

#### `setup_vr_environment`
Set up complete visual regression testing environment.

**Input:**
```json
{
  "projectName": "my-project",
  "packageManager": "npm"
}
```

**Output:**
```json
{
  "success": true,
  "projectPath": "/path/to/my-project",
  "steps": [
    "✓ Created project directory",
    "✓ Installed dependencies",
    ...
  ],
  "nextSteps": [...]
}
```

#### `check_project_status`
Check the current status of the VR testing setup.

**Output:**
```json
{
  "success": true,
  "status": {
    "hasPackageJson": true,
    "hasStorybook": true,
    "hasPlaywright": true,
    "hasComponents": true,
    "storybookRunning": true,
    "testsConfigured": true
  }
}
```

### Component Management

#### `create_component`
Create a new React component with TypeScript.

**Input:**
```json
{
  "componentName": "Button",
  "componentCode": "import React from 'react';\n..."
}
```

#### `create_stories`
Create Storybook stories for a component.

**Input:**
```json
{
  "componentName": "Button",
  "storiesCode": "import type { Meta } from '@storybook/react';\n..."
}
```

#### `create_visual_tests`
Create Playwright visual regression tests.

**Input:**
```json
{
  "componentName": "Button",
  "testCode": "import { test, expect } from '@playwright/test';\n..."
}
```

#### `list_components`
List all components in the project.

**Output:**
```json
{
  "success": true,
  "components": [
    { "name": "Button", "path": "/path/to/components/Button" },
    ...
  ],
  "total": 5
}
```

### Storybook Management

#### `start_storybook`
Start Storybook development server.

**Input:**
```json
{
  "port": 6006,
  "detached": true
}
```

**Output:**
```json
{
  "success": true,
  "message": "Storybook started",
  "url": "http://localhost:6006"
}
```

#### `stop_storybook`
Stop running Storybook server.

### Test Execution

#### `generate_baselines`
Generate baseline screenshots for visual regression tests.

**Input:**
```json
{
  "testPattern": "Button.spec.ts",
  "browser": "chromium"
}
```

**Output:**
```json
{
  "success": true,
  "message": "Baselines generated",
  "browser": "chromium"
}
```

#### `run_visual_tests`
Run visual regression tests and compare against baselines.

**Input:**
```json
{
  "testPattern": "Button.spec.ts",
  "browser": "chromium",
  "updateSnapshots": false
}
```

**Output:**
```json
{
  "success": true,
  "message": "Tests passed",
  "output": "..."
}
```

#### `analyze_test_results`
Analyze test results and generate report.

**Input:**
```json
{
  "format": "json"
}
```

Options: `json`, `html`, `markdown`

### Browser Management

#### `install_playwright_browsers`
Install Playwright browser binaries.

**Input:**
```json
{
  "browsers": ["chromium", "firefox", "webkit"]
}
```

### Utilities

#### `execute_command`
Execute a custom shell command in the project directory.

**Input:**
```json
{
  "command": "npm run build",
  "timeout": 30000
}
```

## 📋 Example Workflow

Here's a complete workflow an AI agent might execute:

```typescript
// 1. Setup environment
await mcp.call_tool('setup_vr_environment', {
  projectName: 'my-app',
  packageManager: 'npm'
});

// 2. Install browsers
await mcp.call_tool('install_playwright_browsers', {
  browsers: ['chromium']
});

// 3. Create component
await mcp.call_tool('create_component', {
  componentName: 'Button',
  componentCode: `...complete component code...`
});

// 4. Create stories
await mcp.call_tool('create_stories', {
  componentName: 'Button',
  storiesCode: `...complete stories code...`
});

// 5. Create visual tests
await mcp.call_tool('create_visual_tests', {
  componentName: 'Button',
  testCode: `...complete test code...`
});

// 6. Start Storybook
await mcp.call_tool('start_storybook', {
  port: 6006,
  detached: true
});

// 7. Generate baselines
await mcp.call_tool('generate_baselines', {
  browser: 'chromium'
});

// 8. Run tests
await mcp.call_tool('run_visual_tests', {
  browser: 'chromium'
});

// 9. Analyze results
await mcp.call_tool('analyze_test_results', {
  format: 'json'
});
```

## 🤖 AI Agent Usage Tips

### For Component Creation

When creating components, ensure:
- Complete TypeScript definitions
- Proper exports in index.ts
- All imports are valid

### For Stories

Include multiple stories covering:
- Different variants/states
- Edge cases
- Interactive scenarios

### For Visual Tests

Best practices:
- Test each story variant
- Include hover/focus states
- Test responsive viewports
- Disable animations for consistency

### Error Handling

All tools return structured JSON with:
```json
{
  "success": true/false,
  "error": "error message if failed",
  "...": "additional data"
}
```

## 🔍 Troubleshooting

### Tool Returns Error

Check the error message in the response:
```json
{
  "success": false,
  "error": "Detailed error message"
}
```

### Storybook Won't Start

1. Check if port 6006 is in use: `check_storybook_status`
2. Stop existing instance: `stop_storybook`
3. Try starting again: `start_storybook`

### Tests Failing

1. Ensure Storybook is running: `check_storybook_status`
2. Check test results: `analyze_test_results`
3. Regenerate baselines if changes are intentional: `generate_baselines`

### Browser Installation Issues

Use platform-specific installation:
```bash
# Linux
npx playwright install --with-deps chromium

# macOS
npx playwright install chromium
```

## 🏗️ Project Structure

When a project is set up, the structure will be:

```
my-project/
├── components/
│   └── Button/
│       ├── Button.tsx
│       ├── Button.stories.tsx
│       └── index.ts
├── tests/
│   ├── Button.spec.ts
│   └── Button.spec.ts-snapshots/
│       └── chromium/
│           ├── button-primary.png
│           └── ...
├── .storybook/
│   ├── main.ts
│   └── preview.ts
├── playwright.config.ts
├── package.json
└── ...
```

## 🧪 Testing the MCP Server

```bash
# Build the server
npm run build

# Test with MCP inspector
npx @modelcontextprotocol/inspector node build/index.js

# Or use with Claude Desktop (see Configuration section)
```

## 📝 Development

```bash
# Watch mode for development
npm run dev

# Build for production
npm run build

# Run the built server
node build/index.js
```

## 🤝 Contributing

This MCP server is designed to be extended. To add new tools:

1. Add tool definition to `ListToolsRequestSchema` handler
2. Implement tool logic in a new private method
3. Add case to `CallToolRequestSchema` handler switch
4. Update documentation

## 📄 License

MIT

## 🔗 Related Projects

- [Model Context Protocol](https://modelcontextprotocol.io/)
- [Storybook](https://storybook.js.org/)
- [Playwright](https://playwright.dev/)
- [Claude Desktop](https://claude.ai/)

## 💡 Use Cases

Perfect for:
- Automated component development workflows
- AI-assisted UI development
- Continuous visual regression testing
- Design system maintenance
- Component library management

## 🎓 Learn More

- [MCP Documentation](https://modelcontextprotocol.io/docs)
- [Storybook Docs](https://storybook.js.org/docs)
- [Playwright Docs](https://playwright.dev/docs/intro)
- [Visual Testing Guide](https://playwright.dev/docs/test-snapshots)