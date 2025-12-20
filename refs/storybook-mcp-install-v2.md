# AI→AI Knowledge Transfer: Storybook MCP Server Installation & Usage

## EXECUTIVE SUMMARY
Storybook MCP Server = Model Context Protocol integration enabling AI agents to interact with Storybook instances programmatically. Access component metadata, generate stories, capture screenshots, and automate UI development workflows through standardized MCP tools.

**Official Repository**: https://github.com/storybookjs/mcp

---

## PART 1: MCP SERVER ARCHITECTURE

### 1.1 PACKAGE ECOSYSTEM

```
Official Storybook MCP (storybookjs/mcp)
├── @storybook/mcp           # Standalone MCP library
└── @storybook/addon-mcp     # Storybook addon (integrated server)

Community Alternatives
├── storybook-mcp (mcpland)         # Index.json parser
├── storybook-mcp-server (stefanoamorelli)  # Screenshot + metadata
├── mcp-storybook (dannyhw)         # React Native focus
└── hmatt1/storybook-mcp            # Docker-ready server
```

### 1.2 TRANSPORT PROTOCOLS

```
MCP Transport Types:
1. stdio    - Standard input/output (CLI tools)
2. SSE      - Server-Sent Events (streaming)
3. HTTP     - RESTful endpoints (streamable-http)

Storybook MCP Uses: streamable-http
Endpoint: http://localhost:6006/mcp (addon)
Endpoint: http://localhost:13316/mcp (standalone @storybook/mcp)
```

### 1.3 MCP CAPABILITIES

```javascript
// MCP Protocol Structure
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/list",     // List available tools
  "params": {}
}

// Tool Invocation
{
  "jsonrpc": "2.0",
  "id": 2,
  "method": "tools/call",
  "params": {
    "name": "list-all-components",
    "arguments": {}
  }
}
```

---

## PART 2: INSTALLATION METHODS

### 2.1 METHOD 1: @storybook/addon-mcp (RECOMMENDED)

**Use Case**: Integrated server running within Storybook dev server

#### Prerequisites
```bash
# Node.js 18+ (standalone) or 24+ (addon)
node --version  # Should be v18.x+ or v24.x+

# For addon: pnpm 10.19.0+ (required)
# For standalone: any package manager
npm install -g pnpm@10.19.0

# Existing Storybook 9.1.16+ (CRITICAL VERSION)
# Supports: @storybook/react-vite, @storybook/nextjs-vite, @storybook/sveltekit, etc.
# VITE-BASED ONLY for addon
```

#### Installation
```bash
# Automatic installation (recommended)
npx storybook@latest add @storybook/addon-mcp

# Manual installation
pnpm add -D @storybook/addon-mcp
```

#### Configuration
```javascript
// .storybook/main.ts
import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-essentials',
    {
      name: '@storybook/addon-mcp',
      options: {
        toolsets: {
          dev: true,   // Tools for story URL retrieval and UI building instructions (default: true)
          docs: true,  // Tools for component manifest and documentation (default: true, requires experimental feature)
        },
        experimentalFormat: 'markdown', // Output format: 'markdown' (default) or 'xml'
      }
    }
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {}
  },
  // Required for docs toolset
  features: {
    experimentalComponentsManifest: true, // Enable component documentation tools
  }
};

export default config;
```

#### Toolsets Explained

**Dev Toolset** (`dev: true`):
- `get-ui-development-instructions` - Project-specific UI development guidelines
- `get-story-urls` - Retrieve URLs to specific stories for verification

**Docs Toolset** (`docs: true`):
- `get-components-manifest` - List all components in your Storybook
- `get-component-documentation` - Retrieve detailed component documentation
- Requires: `experimentalComponentsManifest: true` in features

#### Start Server
```bash
# Start Storybook with MCP addon
pnpm storybook

# MCP server automatically available at:
# http://localhost:6006/mcp
```

#### Verify Installation
```bash
# Test MCP server endpoint
curl -X POST http://localhost:6006/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "tools/list",
    "params": {}
  }'

# Expected response:
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "tools": [
      {
        "name": "get-ui-development-instructions",
        "description": "Get standardized instructions for UI development",
        "inputSchema": {...}
      },
      {
        "name": "get-story-urls",
        "description": "Get URLs to specific stories",
        "inputSchema": {...}
      }
    ]
  }
}
```

### 2.2 METHOD 2: @storybook/mcp (STANDALONE)

**Use Case**: External MCP server without Storybook integration

#### Installation
```bash
# Install standalone package
pnpm add -D @storybook/mcp

# Or use npx without installation
npx @storybook/mcp@latest
```

#### Usage
```bash
# Point to your Storybook's static files
npx @storybook/mcp \
  --storybook-url http://localhost:6006

# Or use index.json directly
npx @storybook/mcp \
  --index-json ./storybook-static/index.json
```

### 2.3 METHOD 3: Community Servers (Alternative Options)

#### Option A: mcpland/storybook-mcp
```json
// Claude Desktop config.json
{
  "mcpServers": {
    "storybook": {
      "command": "npx",
      "args": ["-y", "storybook-mcp@latest"],
      "env": {
        "STORYBOOK_URL": "http://localhost:6006/index.json"
      }
    }
  }
}
```

#### Option B: stefanoamorelli/storybook-mcp-server (with screenshots)
```json
{
  "mcpServers": {
    "storybook": {
      "command": "npx",
      "args": ["storybook-mcp-server"],
      "env": {
        "STORYBOOK_URL": "http://localhost:6006",
        "OUTPUT_DIR": "./screenshots",
        "LOG_LEVEL": "info"
      }
    }
  }
}
```

#### Option C: hmatt1/storybook-mcp (Docker)
```bash
# Pull Docker image
docker pull hmatt1/storybook-mcp:latest

# Run container
docker run \
  --add-host=host.docker.internal:host-gateway \
  -e STORYBOOK_URL=http://host.docker.internal:6006 \
  -e OUTPUT_DIR=/screenshots \
  hmatt1/storybook-mcp:latest
```

---

## PART 3: CLIENT CONFIGURATION

### 3.1 CLAUDE DESKTOP CONFIGURATION

```json
// macOS: ~/Library/Application Support/Claude/claude_desktop_config.json
// Windows: %APPDATA%\Claude\claude_desktop_config.json
// Linux: ~/.config/Claude/claude_desktop_config.json

{
  "mcpServers": {
    "storybook-mcp": {
      "command": "npx",
      "args": ["-y", "@storybook/mcp@latest"],
      "env": {
        "STORYBOOK_URL": "http://localhost:6006"
      }
    }
  }
}
```

**After configuration**:
1. Restart Claude Desktop
2. Start your Storybook server: `pnpm storybook`
3. Verify connection in Claude Desktop settings

### 3.2 CLAUDE CODE (CURSOR) CONFIGURATION

```bash
# Add MCP server via CLI (recommended)
claude mcp add storybook-mcp \
  --transport http \
  http://localhost:6006/mcp \
  --scope project

# Alternative: Add with JSON format
claude mcp add-json "storybook-mcp" \
  '{"transport":"http","url":"http://localhost:6006/mcp"}'
```

**Or manual configuration**:

```json
// .cursor/mcp.json (project-specific)
// OR ~/.cursor/mcp.json (global)
{
  "mcpServers": {
    "storybook-mcp": {
      "transport": "http",
      "url": "http://localhost:6006/mcp"
    }
  }
}
```

**Configure Toolsets (Optional)**:
```json
// Limit to specific toolsets via headers
{
  "mcpServers": {
    "storybook-mcp": {
      "transport": "http",
      "url": "http://localhost:6006/mcp",
      "headers": {
        "X-MCP-Toolsets": "dev,docs"  // or "dev" or "docs"
      }
    }
  }
}
```

**Verify in Cursor**:
1. Settings → Tools & Integrations → MCP Servers
2. Check available tools in Composer
3. Use Agent mode with Sonnet 4.5 or better

### 3.3 WINDSURF CONFIGURATION

```json
// ~/.windsurf/mcp.json
{
  "mcpServers": {
    "storybook": {
      "command": "npx",
      "args": ["-y", "@storybook/addon-mcp@latest"],
      "env": {
        "STORYBOOK_URL": "http://localhost:6006"
      }
    }
  }
}
```

### 3.4 GENERIC HTTP CLIENT

```javascript
// Any HTTP-capable client
const mcpClient = {
  baseURL: 'http://localhost:6006/mcp',
  
  async listTools() {
    const response = await fetch(this.baseURL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'tools/list',
        params: {}
      })
    });
    return response.json();
  },
  
  async callTool(name, args) {
    const response = await fetch(this.baseURL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: Date.now(),
        method: 'tools/call',
        params: { name, arguments: args }
      })
    });
    return response.json();
  }
};

// Usage
const tools = await mcpClient.listTools();
const components = await mcpClient.callTool('list-all-components', {});
```

---

## PART 4: AVAILABLE TOOLS & USAGE

### 4.1 @storybook/addon-mcp TOOLS

The addon provides two toolsets: **Dev Tools** (always available) and **Docs Tools** (requires experimental feature flag).

#### DEV TOOLSET (toolsets.dev: true)

##### Tool 1: get-ui-development-instructions
```json
{
  "name": "get-ui-development-instructions",
  "description": "Provides standardized instructions for UI component development within your project",
  "inputSchema": {
    "type": "object",
    "properties": {},
    "required": []
  }
}
```

**What it returns**:
- Component structure guidelines (file organization, naming conventions)
- Story creation requirements (what stories to create, naming patterns)
- Code style guidelines (TypeScript patterns, styling approach)
- Testing requirements (data-testid conventions, accessibility)
- Documentation standards (JSDoc, prop descriptions)

**Usage**:
```bash
curl -X POST http://localhost:6006/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "tools/call",
    "params": {
      "name": "get-ui-development-instructions",
      "arguments": {}
    }
  }'
```

**AI Agent Prompt**:
```
Before doing any UI, frontend or React development, 
ALWAYS call the storybook MCP server to get further instructions.
```

##### Tool 2: get-story-urls
```json
{
  "name": "get-story-urls",
  "description": "Retrieve direct URLs to specific stories in your Storybook",
  "inputSchema": {
    "type": "object",
    "properties": {
      "absoluteStoryPaths": {
        "type": "array",
        "items": { "type": "string" },
        "description": "Absolute file paths to story files"
      }
    },
    "required": ["absoluteStoryPaths"]
  }
}
```

**Usage**:
```bash
curl -X POST http://localhost:6006/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 2,
    "method": "tools/call",
    "params": {
      "name": "get-story-urls",
      "arguments": {
        "absoluteStoryPaths": [
          "/absolute/path/to/Button.stories.tsx",
          "/absolute/path/to/Card.stories.tsx"
        ]
      }
    }
  }'
```

**Response Example**:
```json
{
  "result": {
    "content": [
      {
        "type": "text",
        "text": "Story URLs:\n\nButton.stories.tsx:\n- Default: http://localhost:6006/?path=/story/components-button--default\n- Primary: http://localhost:6006/?path=/story/components-button--primary\n- Secondary: http://localhost:6006/?path=/story/components-button--secondary\n\nCard.stories.tsx:\n- Default: http://localhost:6006/?path=/story/components-card--default\n- With Image: http://localhost:6006/?path=/story/components-card--with-image"
      }
    ]
  }
}
```

#### DOCS TOOLSET (toolsets.docs: true, requires experimentalComponentsManifest)

##### Tool 3: get-components-manifest
```json
{
  "name": "get-components-manifest",
  "description": "List all available UI components in your Storybook with their metadata",
  "inputSchema": {
    "type": "object",
    "properties": {},
    "required": []
  }
}
```

**Returns**: List of all components with IDs, names, and story counts

##### Tool 4: get-component-documentation
```json
{
  "name": "get-component-documentation",
  "description": "Get detailed documentation for a specific component",
  "inputSchema": {
    "type": "object",
    "properties": {
      "componentId": {
        "type": "string",
        "description": "The component ID from the manifest"
      }
    },
    "required": ["componentId"]
  }
}
```

**Returns**: 
- Component props and types
- Usage examples from stories
- JSDoc documentation
- Related components

**Note**: To use multiple components, call this tool multiple times with different componentIds.

### 4.2 COMMUNITY SERVER TOOLS

#### storybook-mcp-server Tools (stefanoamorelli)

##### list-components
```json
{
  "name": "list-components",
  "description": "List all Storybook components and variants",
  "parameters": {}
}
```

**Response Example**:
```json
{
  "success": true,
  "count": 12,
  "components": [
    {
      "id": "button",
      "name": "Button",
      "path": "UI/Button",
      "variants": [
        { "id": "button--primary", "name": "Primary" },
        { "id": "button--secondary", "name": "Secondary" }
      ]
    }
  ]
}
```

##### capture-screenshot
```json
{
  "name": "capture-screenshot",
  "description": "Capture component screenshot in specific state",
  "parameters": {
    "component": "button--primary",
    "state": { "hover": true },
    "viewport": { "width": 375, "height": 667 }
  }
}
```

**States Available**:
- `default`: Normal state
- `hover`: Mouse hover
- `focus`: Keyboard focus
- `active`: Click/tap active

**Viewports**:
- Mobile: `{ width: 375, height: 667 }`
- Tablet: `{ width: 768, height: 1024 }`
- Desktop: `{ width: 1920, height: 1080 }`

---

## PART 5: DEVELOPMENT WORKFLOW

### 5.1 AI AGENT WORKFLOW

```
1. AGENT RECEIVES UI TASK
   ↓
2. CALL: get-ui-development-instructions
   → Receive project conventions and guidelines
   ↓
3. CREATE COMPONENT
   → Write TypeScript component with types
   ↓
4. CREATE STORIES
   → Generate comprehensive story examples
   ↓
5. CALL: get-story-urls
   → Get URLs to verify component visually
   ↓
6. ITERATE
   → Make changes based on visual verification
```

### 5.2 COMPONENT GENERATION PROMPT

```
System Prompt (add to Claude/Cursor):

Before doing any UI, frontend or React development, 
ALWAYS call the storybook MCP server to get further instructions.

When creating a new UI component:
1. Call get-ui-development-instructions first
2. Create component with TypeScript and proper types
3. Create .stories.tsx file with examples:
   - Default story
   - All prop variants
   - Edge cases (loading, error, empty states)
   - Responsive variants
4. Call get-story-urls with the new story file path
5. Provide the story URLs to user for visual verification
```

### 5.3 DEBUGGING WORKFLOW

```bash
# Terminal 1: Start Storybook
pnpm storybook
# → http://localhost:6006

# Terminal 2: Test MCP server
curl -X POST http://localhost:6006/mcp \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list","params":{}}'

# Terminal 3: Watch logs
# Check Storybook terminal for MCP server messages

# Common Issues:
# - Port 6006 not available → Change port in package.json
# - MCP tools not showing → Restart client (Claude/Cursor)
# - Connection refused → Ensure Storybook is running
# - Empty tools list → Check addon is in .storybook/main.ts
```

---

## PART 6: ADVANCED CONFIGURATION

### 6.1 CUSTOM PORT CONFIGURATION

```json
// package.json
{
  "scripts": {
    "storybook": "storybook dev -p 9009"
  }
}
```

```json
// MCP client config
{
  "mcpServers": {
    "storybook": {
      "command": "npx",
      "args": ["-y", "@storybook/addon-mcp@latest"],
      "env": {
        "STORYBOOK_URL": "http://localhost:9009"
      }
    }
  }
}
```

### 6.2 REMOTE STORYBOOK

```json
// Connect to deployed Storybook
{
  "mcpServers": {
    "storybook-prod": {
      "command": "npx",
      "args": ["-y", "storybook-mcp@latest"],
      "env": {
        "STORYBOOK_URL": "https://your-storybook.com/index.json"
      }
    }
  }
}
```

### 6.3 MULTIPLE STORYBOOK INSTANCES

```json
{
  "mcpServers": {
    "storybook-local": {
      "command": "npx",
      "args": ["-y", "@storybook/addon-mcp@latest"],
      "env": {
        "STORYBOOK_URL": "http://localhost:6006"
      }
    },
    "storybook-design-system": {
      "command": "npx",
      "args": ["-y", "storybook-mcp@latest"],
      "env": {
        "STORYBOOK_URL": "https://design-system.company.com/index.json"
      }
    },
    "storybook-staging": {
      "command": "npx",
      "args": ["-y", "storybook-mcp@latest"],
      "env": {
        "STORYBOOK_URL": "https://staging-storybook.company.com/index.json"
      }
    }
  }
}
```

### 6.4 ENVIRONMENT VARIABLES

```bash
# .env.local
STORYBOOK_PORT=6006
STORYBOOK_HOST=localhost
MCP_LOG_LEVEL=debug
MCP_OUTPUT_DIR=./screenshots
```

```javascript
// .storybook/main.ts
export default {
  addons: ['@storybook/addon-mcp'],
  env: (config) => ({
    ...config,
    MCP_LOG_LEVEL: process.env.MCP_LOG_LEVEL || 'info'
  })
};
```

---

## PART 7: TROUBLESHOOTING

### 7.1 COMMON ISSUES

#### Issue: MCP server not responding
```bash
# Diagnosis
curl -X POST http://localhost:6006/mcp \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list","params":{}}'

# Solution 1: Verify Storybook is running
lsof -i :6006

# Solution 2: Check addon is installed
cat .storybook/main.ts | grep addon-mcp

# Solution 3: Restart Storybook
pnpm storybook
```

#### Issue: Tools not showing in Claude/Cursor
```bash
# Solution 1: Verify MCP config location
# macOS
cat ~/Library/Application\ Support/Claude/claude_desktop_config.json

# Solution 2: Restart client completely
# Close and reopen Claude Desktop or Cursor

# Solution 3: Check JSON syntax
npx jsonlint ~/Library/Application\ Support/Claude/claude_desktop_config.json
```

#### Issue: CORS errors
```javascript
// .storybook/main.ts
export default {
  viteFinal: async (config) => {
    config.server = {
      ...config.server,
      cors: {
        origin: '*',
        methods: ['GET', 'POST']
      }
    };
    return config;
  }
};
```

#### Issue: Node version mismatch
```bash
# Check version
node --version

# Install correct version
nvm install 24
nvm use 24

# Verify
node --version  # Should be v24.x.x
```

### 7.2 DEBUG MODE

```json
// Enable debug logging
{
  "mcpServers": {
    "storybook": {
      "command": "npx",
      "args": ["-y", "@storybook/addon-mcp@latest"],
      "env": {
        "STORYBOOK_URL": "http://localhost:6006",
        "DEBUG": "true",
        "LOG_LEVEL": "debug"
      }
    }
  }
}
```

### 7.3 HEALTH CHECK SCRIPT

```bash
#!/bin/bash
# storybook-mcp-health-check.sh

echo "=== Storybook MCP Health Check ==="

# Check Node version
echo "Node version:"
node --version

# Check if Storybook is running
echo "\nStorybook status:"
curl -s http://localhost:6006 > /dev/null && echo "✓ Storybook running" || echo "✗ Storybook not running"

# Check MCP endpoint
echo "\nMCP server status:"
response=$(curl -s -X POST http://localhost:6006/mcp \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list","params":{}}')

if echo "$response" | grep -q "tools"; then
  echo "✓ MCP server responding"
  echo "$response" | jq '.result.tools[].name'
else
  echo "✗ MCP server not responding"
  echo "$response"
fi

# Check MCP config
echo "\nMCP configuration:"
if [ -f ~/Library/Application\ Support/Claude/claude_desktop_config.json ]; then
  echo "✓ Claude config found"
  cat ~/Library/Application\ Support/Claude/claude_desktop_config.json | jq '.mcpServers'
else
  echo "✗ Claude config not found"
fi
```

---

## PART 8: BEST PRACTICES

### 8.1 PROJECT SETUP

```bash
# 1. Initialize Storybook (if not exists)
npx storybook@latest init

# 2. Add MCP addon
npx storybook@latest add @storybook/addon-mcp

# 3. Configure MCP client
# Edit Claude Desktop config or .cursor/mcp.json

# 4. Start development
pnpm storybook

# 5. Verify MCP connection
curl -X POST http://localhost:6006/mcp \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list","params":{}}'
```

### 8.2 TEAM WORKFLOW

```markdown
## Team MCP Setup Guide

### Prerequisites
- Node.js 24+
- pnpm 10.19.0+
- Storybook 8.5+ with Vite

### Setup Steps
1. Clone repository
2. Install dependencies: `pnpm install`
3. Start Storybook: `pnpm storybook`
4. Configure your AI client:
   - Claude Desktop: See docs/mcp-setup/claude.md
   - Cursor: See docs/mcp-setup/cursor.md
   - Windsurf: See docs/mcp-setup/windsurf.md

### Verification
Run: `pnpm test:mcp`
Expected: All MCP tools should be listed

### Troubleshooting
See: docs/mcp-troubleshooting.md
```

### 8.3 CI/CD INTEGRATION

```yaml
# .github/workflows/storybook-mcp-test.yml
name: Test Storybook MCP

on: [push, pull_request]

jobs:
  test-mcp:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - uses: actions/setup-node@v4
        with:
          node-version: '24'
      
      - name: Install pnpm
        run: npm install -g pnpm@10.19.0
      
      - name: Install dependencies
        run: pnpm install
      
      - name: Build Storybook
        run: pnpm build-storybook
      
      - name: Start Storybook
        run: pnpm storybook &
        env:
          CI: true
      
      - name: Wait for Storybook
        run: npx wait-on http://localhost:6006
      
      - name: Test MCP endpoint
        run: |
          curl -X POST http://localhost:6006/mcp \
            -H "Content-Type: application/json" \
            -d '{"jsonrpc":"2.0","id":1,"method":"tools/list","params":{}}' \
            | jq '.result.tools | length' \
            | grep -q '^[1-9]' && echo "✓ MCP working" || exit 1
```

---

## PART 9: STORYBOOK VERSION COMPATIBILITY

### 9.1 VERSION MATRIX

```
Storybook MCP Addon (@storybook/addon-mcp)
├── Requires: Storybook 9.1.16+ (CRITICAL MINIMUM VERSION)
├── Requires: Vite-based frameworks
│   ├── @storybook/react-vite ✓
│   ├── @storybook/nextjs-vite ✓ (Next.js 15+ with Turbopack)
│   ├── @storybook/sveltekit ✓
│   ├── @storybook/vue3-vite ✓
│   └── @storybook/react-webpack ✗ (not supported)
├── Requires: Node.js 24+ (for development/contributor)
├── User Install: Node.js 18+
└── Package Manager: pnpm 10.19.0+ (strict requirement)

Standalone MCP (@storybook/mcp)
├── Works with: Any Storybook version with index.json
├── Requires: Node.js 18+
├── Default Port: 13316
└── No framework restrictions

Community Servers
├── storybook-mcp (mcpland): Storybook 6+ (uses stories.json or index.json)
├── storybook-mcp-server (stefanoamorelli): Storybook 6.4+
└── mcp-storybook (dannyhw): React Native Storybook

Tested Clients
├── Claude Code (primary target) ✓✓✓
├── GitHub Copilot ✓✓✓
├── Cursor ✓
├── Windsurf ✓
└── Other MCP clients (with streamable-http support) ✓
```

### 9.2 MIGRATION GUIDE

#### From Storybook 7/8 to 9.1.16+
```bash
# Upgrade Storybook
npx storybook@latest upgrade

# Verify version (must be 9.1.16 or higher)
cat package.json | grep "@storybook"

# Add MCP addon
npx storybook@latest add @storybook/addon-mcp

# Enable experimental features for docs toolset
# Add to .storybook/main.ts:
#   features: {
#     experimentalComponentsManifest: true
#   }
```

#### From Webpack to Vite
```bash
# Install Vite framework
pnpm add -D @storybook/react-vite

# Update main.ts
# FROM: framework: { name: '@storybook/react-webpack5' }
# TO: framework: { name: '@storybook/react-vite' }

# Remove webpack-specific config
# Delete webpack() configuration from main.ts

# Test
pnpm storybook
```

---

## PART 10: PERFORMANCE OPTIMIZATION

### 10.1 MCP SERVER PERFORMANCE

```javascript
// .storybook/main.ts
export default {
  addons: ['@storybook/addon-mcp'],
  
  // Optimize build
  core: {
    disableTelemetry: true,
    enableCrashReports: false
  },
  
  // Optimize viteFinal
  viteFinal: async (config) => {
    config.build = {
      ...config.build,
      sourcemap: false,
      minify: 'esbuild',
      target: 'esnext'
    };
    return config;
  }
};
```

### 10.2 CONNECTION POOLING

```javascript
// mcp-client-optimized.js
class OptimizedMCPClient {
  constructor(baseURL = 'http://localhost:6006/mcp') {
    this.baseURL = baseURL;
    this.requestId = 1;
    this.cache = new Map();
    this.cacheTimeout = 60000; // 1 minute
  }
  
  async callTool(name, args, useCache = true) {
    const cacheKey = `${name}:${JSON.stringify(args)}`;
    
    if (useCache && this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      if (Date.now() - cached.timestamp < this.cacheTimeout) {
        return cached.data;
      }
    }
    
    const response = await fetch(this.baseURL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: this.requestId++,
        method: 'tools/call',
        params: { name, arguments: args }
      })
    });
    
    const data = await response.json();
    
    if (useCache) {
      this.cache.set(cacheKey, {
        data,
        timestamp: Date.now()
      });
    }
    
    return data;
  }
  
  clearCache() {
    this.cache.clear();
  }
}
```

---

## APPENDIX: QUICK REFERENCE

### INSTALLATION COMMANDS
```bash
# Official addon (recommended)
npx storybook@latest add @storybook/addon-mcp

# Standalone
pnpm add -D @storybook/mcp

# Community (screenshots)
pnpm add -D storybook-mcp-server
```

### CONFIGURATION PATHS
```
Claude Desktop:
macOS:   ~/Library/Application Support/Claude/claude_desktop_config.json
Windows: %APPDATA%\Claude\claude_desktop_config.json
Linux:   ~/.config/Claude/claude_desktop_config.json

Cursor:
Global:  ~/.cursor/mcp.json
Project: .cursor/mcp.json

Windsurf:
~/.windsurf/mcp.json
```

### TEST COMMANDS
```bash
# List tools
curl -X POST http://localhost:6006/mcp \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list","params":{}}'

# Call tool
curl -X POST http://localhost:6006/mcp \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":2,"method":"tools/call","params":{"name":"get-ui-development-instructions","arguments":{}}}'
```

### URLS
```
Local Storybook:  http://localhost:6006
MCP Endpoint (addon):     http://localhost:6006/mcp
MCP Endpoint (standalone): http://localhost:13316/mcp
Official Repo:    https://github.com/storybookjs/mcp
MCP Inspector:    https://github.com/modelcontextprotocol/inspector
```

### CRITICAL VERSION REQUIREMENTS

```
MINIMUM VERSIONS:
- Storybook: 9.1.16+ (addon requirement)
- Node.js: 18+ (user install)
- Node.js: 24+ (contributor/development)
- pnpm: 10.19.0+ (addon strict requirement)

EXPERIMENTAL FEATURES:
- experimentalComponentsManifest: true (required for docs toolset)
- experimentalFormat: 'markdown' | 'xml' (output format configuration)
```

### SYSTEM PROMPTS

**For Claude Desktop/API**:
```
Before doing any UI, frontend or React development, 
ALWAYS call the storybook MCP server to get further instructions.

When you create or modify UI components:
1. Call get-ui-development-instructions
2. Follow the returned conventions
3. Create .stories.tsx files for all components
4. Call get-story-urls to provide verification links
```

**For Cursor/Windsurf**:
```
# .cursorrules or .windsurfrules

UI Development Protocol:
- Query storybook MCP before creating components
- All components must have .stories.tsx files
- Include TypeScript types for all props
- Add data-testid attributes for testing
- Follow atomic design principles
- Generate story URLs after component creation
```

---

## CRITICAL SUCCESS FACTORS

### For AI Agents
1. **Always query MCP before UI work** - Get latest conventions
2. **Generate comprehensive stories** - Default + all variants + edge cases
3. **Provide story URLs** - Users need visual verification
4. **Follow project patterns** - MCP instructions are project-specific
5. **Test systematically** - data-testid on all interactive elements

### For Developers
1. **Node 24+** - Non-negotiable requirement
2. **pnpm 10.19+** - Enforced by project
3. **Storybook 8.5+** - For addon support
4. **Vite framework** - Webpack not supported for addon
5. **MCP client restart** - After config changes

### For Teams
1. **Document MCP setup** - In project README
2. **Share MCP config** - Version control .mcp.json
3. **Test MCP in CI** - Ensure server works
4. **Update conventions** - Keep MCP instructions current
5. **Train AI agents** - Add system prompts to templates

---

## PERFORMANCE BENCHMARKS

```
MCP Server Response Times (typical):
- tools/list:                    < 50ms
- get-ui-development-instructions: < 100ms
- get-story-urls:                 < 200ms (per story)

Optimal Settings:
- Cache tool results:             60 seconds
- Connection timeout:             30 seconds
- Max concurrent requests:        10
- Health check interval:          5 minutes
```

---

## SECURITY CONSIDERATIONS

```
✓ MCP server runs on localhost only (default)
✓ No authentication required for local development
✓ CORS configured for localhost origins
✓ No sensitive data in MCP responses

⚠ Production Considerations:
- Deploy Storybook to authenticated staging
- Use VPN/tunnel for remote MCP access
- Rate limit MCP endpoints if public
- Monitor MCP access logs
```

---

## ECOSYSTEM INTEGRATION

```
Storybook MCP integrates with:
├── Chromatic (visual testing)
├── Playwright (E2E testing)
├── GitHub Actions (CI/CD)
├── VS Code (development)
├── Claude Desktop (AI coding)
├── Cursor (AI IDE)
├── Windsurf (AI IDE)
└── Any MCP-compatible AI client

Data flow:
Storybook → index.json → MCP Server → AI Agent → Component Generation
```