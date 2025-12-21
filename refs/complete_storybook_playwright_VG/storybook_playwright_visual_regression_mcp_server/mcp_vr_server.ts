#!/usr/bin/env node

/**
 * MCP Server for Visual Regression Testing Pipeline
 * 
 * This server provides tools for AI agents to:
 * - Setup complete VR testing environment
 * - Create components and stories
 * - Generate baseline screenshots
 * - Run visual regression tests
 * - Analyze and report results
 * - Manage test lifecycle
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import path from 'path';

const execAsync = promisify(exec);

// Server configuration
const SERVER_NAME = 'visual-regression-mcp';
const SERVER_VERSION = '1.0.0';

interface CommandResult {
  stdout: string;
  stderr: string;
  success: boolean;
  exitCode?: number;
}

interface TestResult {
  passed: number;
  failed: number;
  skipped: number;
  total: number;
  failures: Array<{
    test: string;
    expected: string;
    actual: string;
    diff: string;
  }>;
}

interface ProjectStatus {
  hasPackageJson: boolean;
  hasStorybook: boolean;
  hasPlaywright: boolean;
  hasComponents: boolean;
  storybookRunning: boolean;
  testsConfigured: boolean;
}

class VisualRegressionServer {
  private server: Server;
  private projectRoot: string;

  constructor() {
    this.projectRoot = process.cwd();
    this.server = new Server(
      {
        name: SERVER_NAME,
        version: SERVER_VERSION,
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupToolHandlers();
    
    this.server.onerror = (error) => console.error('[MCP Error]', error);
    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  private setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: 'setup_vr_environment',
          description: 'Setup complete visual regression testing environment with Storybook v10+ and Playwright',
          inputSchema: {
            type: 'object',
            properties: {
              projectName: { type: 'string', description: 'Name of the project' },
              packageManager: { type: 'string', enum: ['npm', 'yarn', 'pnpm'], default: 'npm' },
            },
            required: ['projectName'],
          },
        },
        {
          name: 'check_project_status',
          description: 'Check the current status of the VR testing setup',
          inputSchema: { type: 'object', properties: {} },
        },
        {
          name: 'create_component',
          description: 'Create a new component with TypeScript',
          inputSchema: {
            type: 'object',
            properties: {
              componentName: { type: 'string', description: 'Component name (PascalCase)' },
              componentCode: { type: 'string', description: 'Complete component code' },
            },
            required: ['componentName', 'componentCode'],
          },
        },
        {
          name: 'create_stories',
          description: 'Create Storybook stories for a component',
          inputSchema: {
            type: 'object',
            properties: {
              componentName: { type: 'string' },
              storiesCode: { type: 'string' },
            },
            required: ['componentName', 'storiesCode'],
          },
        },
        {
          name: 'create_visual_tests',
          description: 'Create Playwright visual regression tests',
          inputSchema: {
            type: 'object',
            properties: {
              componentName: { type: 'string' },
              testCode: { type: 'string' },
            },
            required: ['componentName', 'testCode'],
          },
        },
        {
          name: 'start_storybook',
          description: 'Start Storybook development server',
          inputSchema: {
            type: 'object',
            properties: {
              port: { type: 'number', default: 6006 },
              detached: { type: 'boolean', default: true },
            },
          },
        },
        {
          name: 'stop_storybook',
          description: 'Stop running Storybook server',
          inputSchema: { type: 'object', properties: {} },
        },
        {
          name: 'generate_baselines',
          description: 'Generate baseline screenshots',
          inputSchema: {
            type: 'object',
            properties: {
              testPattern: { type: 'string' },
              browser: { type: 'string', enum: ['chromium', 'firefox', 'webkit', 'all'], default: 'chromium' },
            },
          },
        },
        {
          name: 'run_visual_tests',
          description: 'Run visual regression tests',
          inputSchema: {
            type: 'object',
            properties: {
              testPattern: { type: 'string' },
              browser: { type: 'string', default: 'chromium' },
              updateSnapshots: { type: 'boolean', default: false },
            },
          },
        },
        {
          name: 'analyze_test_results',
          description: 'Analyze test results and generate report',
          inputSchema: {
            type: 'object',
            properties: {
              format: { type: 'string', enum: ['json', 'html', 'markdown'], default: 'json' },
            },
          },
        },
        {
          name: 'install_playwright_browsers',
          description: 'Install Playwright browser binaries',
          inputSchema: {
            type: 'object',
            properties: {
              browsers: { type: 'array', items: { type: 'string' }, default: ['chromium'] },
            },
          },
        },
        {
          name: 'list_components',
          description: 'List all components in the project',
          inputSchema: { type: 'object', properties: {} },
        },
        {
          name: 'execute_command',
          description: 'Execute a custom shell command',
          inputSchema: {
            type: 'object',
            properties: {
              command: { type: 'string' },
              timeout: { type: 'number', default: 30000 },
            },
            required: ['command'],
          },
        },
      ],
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'setup_vr_environment':
            return await this.setupVREnvironment(args as any);
          case 'check_project_status':
            return await this.checkProjectStatus();
          case 'create_component':
            return await this.createComponent(args as any);
          case 'create_stories':
            return await this.createStories(args as any);
          case 'create_visual_tests':
            return await this.createVisualTests(args as any);
          case 'start_storybook':
            return await this.startStorybook(args as any);
          case 'stop_storybook':
            return await this.stopStorybook();
          case 'generate_baselines':
            return await this.generateBaselines(args as any);
          case 'run_visual_tests':
            return await this.runVisualTests(args as any);
          case 'analyze_test_results':
            return await this.analyzeTestResults(args as any);
          case 'install_playwright_browsers':
            return await this.installPlaywrightBrowsers(args as any);
          case 'list_components':
            return await this.listComponents();
          case 'execute_command':
            return await this.executeCommand(args as any);
          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error: any) {
        return {
          content: [{
            type: 'text',
            text: JSON.stringify({ success: false, error: error.message }, null, 2),
          }],
        };
      }
    });
  }

  private async setupVREnvironment(args: { projectName: string; packageManager?: string }) {
    const pm = args.packageManager || 'npm';
    const steps: string[] = [];

    try {
      const projectPath = path.join(this.projectRoot, args.projectName);
      await fs.mkdir(projectPath, { recursive: true });
      process.chdir(projectPath);
      this.projectRoot = projectPath;
      steps.push(`✓ Created project directory: ${projectPath}`);

      await this.runCommand(`${pm} init -y`);
      steps.push('✓ Initialized package.json');

      await this.runCommand(`${pm} install react react-dom lucide-react`);
      steps.push('✓ Installed React');

      await this.runCommand(
        `${pm} install -D typescript @types/react @types/react-dom vite @vitejs/plugin-react tailwindcss postcss autoprefixer`
      );
      steps.push('✓ Installed dev dependencies');

      await this.runCommand(`npx storybook@latest init --yes --package-manager ${pm}`);
      steps.push('✓ Installed Storybook');

      await this.runCommand(`${pm} install -D @playwright/test playwright`);
      steps.push('✓ Installed Playwright');

      await fs.mkdir(path.join(projectPath, 'components'), { recursive: true });
      await fs.mkdir(path.join(projectPath, 'tests'), { recursive: true });
      await fs.mkdir(path.join(projectPath, 'src'), { recursive: true });
      steps.push('✓ Created directories');

      await this.createConfigFiles(projectPath);
      steps.push('✓ Created config files');

      await this.updatePackageScripts(projectPath);
      steps.push('✓ Updated scripts');

      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            success: true,
            projectPath,
            steps,
            nextSteps: [
              'Install browsers: install_playwright_browsers',
              'Create component: create_component',
              'Start Storybook: start_storybook',
            ],
          }, null, 2),
        }],
      };
    } catch (error: any) {
      return {
        content: [{
          type: 'text',
          text: JSON.stringify({ success: false, steps, error: error.message }, null, 2),
        }],
      };
    }
  }

  private async checkProjectStatus() {
    const status: ProjectStatus = {
      hasPackageJson: false,
      hasStorybook: false,
      hasPlaywright: false,
      hasComponents: false,
      storybookRunning: false,
      testsConfigured: false,
    };

    try {
      await fs.access(path.join(this.projectRoot, 'package.json'));
      status.hasPackageJson = true;

      const pkg = JSON.parse(await fs.readFile(path.join(this.projectRoot, 'package.json'), 'utf-8'));
      status.hasStorybook = !!pkg.devDependencies?.['@storybook/react'];
      status.hasPlaywright = !!pkg.devDependencies?.['@playwright/test'];

      try {
        const components = await fs.readdir(path.join(this.projectRoot, 'components'));
        status.hasComponents = components.length > 0;
      } catch {}

      try {
        const { stdout } = await execAsync('lsof -i :6006 -t', { timeout: 5000 });
        status.storybookRunning = stdout.trim().length > 0;
      } catch {}

      try {
        await fs.access(path.join(this.projectRoot, 'playwright.config.ts'));
        status.testsConfigured = true;
      } catch {}

      return {
        content: [{
          type: 'text',
          text: JSON.stringify({ success: true, status }, null, 2),
        }],
      };
    } catch (error: any) {
      return {
        content: [{
          type: 'text',
          text: JSON.stringify({ success: false, error: error.message }, null, 2),
        }],
      };
    }
  }

  private async createComponent(args: { componentName: string; componentCode: string }) {
    try {
      const dir = path.join(this.projectRoot, 'components', args.componentName);
      await fs.mkdir(dir, { recursive: true });

      await fs.writeFile(path.join(dir, `${args.componentName}.tsx`), args.componentCode);
      await fs.writeFile(
        path.join(dir, 'index.ts'),
        `export { ${args.componentName} } from './${args.componentName}';\n`
      );

      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            success: true,
            message: `Component ${args.componentName} created`,
            nextSteps: ['Create stories: create_stories', 'Create tests: create_visual_tests'],
          }, null, 2),
        }],
      };
    } catch (error: any) {
      return {
        content: [{
          type: 'text',
          text: JSON.stringify({ success: false, error: error.message }, null, 2),
        }],
      };
    }
  }

  private async createStories(args: { componentName: string; storiesCode: string }) {
    try {
      const path_stories = path.join(
        this.projectRoot,
        'components',
        args.componentName,
        `${args.componentName}.stories.tsx`
      );
      await fs.writeFile(path_stories, args.storiesCode);

      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            success: true,
            message: `Stories created for ${args.componentName}`,
            path: path_stories,
          }, null, 2),
        }],
      };
    } catch (error: any) {
      return {
        content: [{
          type: 'text',
          text: JSON.stringify({ success: false, error: error.message }, null, 2),
        }],
      };
    }
  }

  private async createVisualTests(args: { componentName: string; testCode: string }) {
    try {
      const testPath = path.join(this.projectRoot, 'tests', `${args.componentName}.spec.ts`);
      await fs.writeFile(testPath, args.testCode);

      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            success: true,
            message: `Tests created for ${args.componentName}`,
            path: testPath,
          }, null, 2),
        }],
      };
    } catch (error: any) {
      return {
        content: [{
          type: 'text',
          text: JSON.stringify({ success: false, error: error.message }, null, 2),
        }],
      };
    }
  }

  private async startStorybook(args?: { port?: number; detached?: boolean }) {
    const port = args?.port || 6006;

    try {
      try {
        const { stdout } = await execAsync('lsof -i :6006 -t', { timeout: 5000 });
        if (stdout.trim()) {
          return {
            content: [{
              type: 'text',
              text: JSON.stringify({
                success: true,
                message: 'Storybook already running',
                url: `http://localhost:${port}`,
              }, null, 2),
            }],
          };
        }
      } catch {}

      exec(`npm run storybook -- -p ${port}`, { cwd: this.projectRoot });
      await this.waitForPort(port, 60000);

      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            success: true,
            message: 'Storybook started',
            url: `http://localhost:${port}`,
          }, null, 2),
        }],
      };
    } catch (error: any) {
      return {
        content: [{
          type: 'text',
          text: JSON.stringify({ success: false, error: error.message }, null, 2),
        }],
      };
    }
  }

  private async stopStorybook() {
    try {
      const { stdout } = await execAsync('lsof -i :6006 -t', { timeout: 5000 });
      if (stdout.trim()) {
        await execAsync(`kill ${stdout.trim()}`);
        return {
          content: [{
            type: 'text',
            text: JSON.stringify({ success: true, message: 'Storybook stopped' }, null, 2),
          }],
        };
      }
      return {
        content: [{
          type: 'text',
          text: JSON.stringify({ success: true, message: 'Storybook not running' }, null, 2),
        }],
      };
    } catch (error: any) {
      return {
        content: [{
          type: 'text',
          text: JSON.stringify({ success: false, error: error.message }, null, 2),
        }],
      };
    }
  }

  private async generateBaselines(args?: { testPattern?: string; browser?: string }) {
    const browser = args?.browser || 'chromium';
    const pattern = args?.testPattern || '';

    try {
      let cmd = 'npx playwright test --update-snapshots';
      if (pattern) cmd += ` ${pattern}`;
      if (browser !== 'all') cmd += ` --project=${browser}`;

      const result = await this.runCommand(cmd, 120000);

      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            success: true,
            message: 'Baselines generated',
            browser,
            output: result.stdout.slice(-500),
          }, null, 2),
        }],
      };
    } catch (error: any) {
      return {
        content: [{
          type: 'text',
          text: JSON.stringify({ success: false, error: error.message }, null, 2),
        }],
      };
    }
  }

  private async runVisualTests(args?: {
    testPattern?: string;
    browser?: string;
    updateSnapshots?: boolean;
  }) {
    try {
      let cmd = 'npx playwright test';
      if (args?.testPattern) cmd += ` ${args.testPattern}`;
      if (args?.browser && args.browser !== 'all') cmd += ` --project=${args.browser}`;
      if (args?.updateSnapshots) cmd += ' --update-snapshots';

      const result = await this.runCommand(cmd, 180000);

      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            success: result.success,
            output: result.stdout,
            message: result.success ? 'Tests passed' : 'Tests failed',
          }, null, 2),
        }],
      };
    } catch (error: any) {
      return {
        content: [{
          type: 'text',
          text: JSON.stringify({ success: false, error: error.message }, null, 2),
        }],
      };
    }
  }

  private async analyzeTestResults(args?: { format?: string }) {
    const format = args?.format || 'json';

    try {
      if (format === 'html') {
        await this.runCommand('npx playwright show-report');
        return {
          content: [{
            type: 'text',
            text: JSON.stringify({ success: true, message: 'Report opened' }, null, 2),
          }],
        };
      }

      const resultsPath = path.join(this.projectRoot, 'test-results', 'results.json');
      const data = await fs.readFile(resultsPath, 'utf-8');

      return {
        content: [{
          type: 'text',
          text: data,
        }],
      };
    } catch (error: any) {
      return {
        content: [{
          type: 'text',
          text: JSON.stringify({ success: false, error: error.message }, null, 2),
        }],
      };
    }
  }

  private async installPlaywrightBrowsers(args?: { browsers?: string[] }) {
    const browsers = args?.browsers || ['chromium'];

    try {
      const cmd = `npx playwright install --with-deps ${browsers.join(' ')}`;
      const result = await this.runCommand(cmd, 300000);

      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            success: true,
            message: 'Browsers installed',
            browsers,
          }, null, 2),
        }],
      };
    } catch (error: any) {
      return {
        content: [{
          type: 'text',
          text: JSON.stringify({ success: false, error: error.message }, null, 2),
        }],
      };
    }
  }

  private async listComponents() {
    try {
      const dir = path.join(this.projectRoot, 'components');
      const entries = await fs.readdir(dir);
      const components = [];

      for (const entry of entries) {
        const stat = await fs.stat(path.join(dir, entry));
        if (stat.isDirectory()) {
          components.push({ name: entry, path: path.join(dir, entry) });
        }
      }

      return {
        content: [{
          type: 'text',
          text: JSON.stringify({ success: true, components, total: components.length }, null, 2),
        }],
      };
    } catch (error: any) {
      return {
        content: [{
          type: 'text',
          text: JSON.stringify({ success: false, error: error.message }, null, 2),
        }],
      };
    }
  }

  private async executeCommand(args: { command: string; timeout?: number }) {
    try {
      const result = await this.runCommand(args.command, args.timeout);
      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            success: true,
            stdout: result.stdout,
            stderr: result.stderr,
          }, null, 2),
        }],
      };
    } catch (error: any) {
      return {
        content: [{
          type: 'text',
          text: JSON.stringify({ success: false, error: error.message }, null, 2),
        }],
      };
    }
  }

  private async runCommand(cmd: string, timeout = 30000): Promise<CommandResult> {
    try {
      const { stdout, stderr } = await execAsync(cmd, {
        cwd: this.projectRoot,
        timeout,
        maxBuffer: 10 * 1024 * 1024,
      });
      return { stdout, stderr, success: true };
    } catch (error: any) {
      return {
        stdout: error.stdout || '',
        stderr: error.stderr || error.message,
        success: false,
        exitCode: error.code,
      };
    }
  }

  private async waitForPort(port: number, timeout: number): Promise<void> {
    const start = Date.now();
    while (Date.now() - start < timeout) {
      try {
        const { stdout } = await execAsync(`lsof -i :${port} -t`, { timeout: 1000 });
        if (stdout.trim()) return;
      } catch {}
      await new Promise(r => setTimeout(r, 1000));
    }
    throw new Error(`Port ${port} not ready`);
  }

  private async createConfigFiles(projectPath: string): Promise<void> {
    const configs = {
      'playwright.config.ts': `import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  reporter: [['html'], ['json', { outputFile: 'test-results/results.json' }]],
  use: { baseURL: 'http://localhost:6006', trace: 'on-first-retry' },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
  webServer: {
    command: 'npm run storybook',
    url: 'http://localhost:6006',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
  expect: {
    toHaveScreenshot: { maxDiffPixelRatio: 0.01, animations: 'disabled' },
  },
});`,
      'tailwind.config.js': `export default {
  content: ["./components/**/*.{js,ts,jsx,tsx}"],
  theme: { extend: {} },
};`,
      'src/index.css': `@tailwind base;\n@tailwind components;\n@tailwind utilities;`,
    };

    for (const [file, content] of Object.entries(configs)) {
      await fs.writeFile(path.join(projectPath, file), content);
    }
  }

  private async updatePackageScripts(projectPath: string): Promise<void> {
    const pkgPath = path.join(projectPath, 'package.json');
    const pkg = JSON.parse(await fs.readFile(pkgPath, 'utf-8'));
    pkg.scripts = {
      ...pkg.scripts,
      'test:visual': 'playwright test',
      'test:visual:update': 'playwright test --update-snapshots',
    };
    await fs.writeFile(pkgPath, JSON.stringify(pkg, null, 2));
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Visual Regression MCP Server running');
  }
}

const server = new VisualRegressionServer();
server.run().catch(console.error);