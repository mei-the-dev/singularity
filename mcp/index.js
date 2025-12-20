#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import * as Ops from './tools/ops.js';
import * as Git from './tools/git.js';
import * as Files from './tools/files.js';

// Import new scaffold tools (conditionally)
import fs from 'fs';
let registerScaffoldComponent = () => {};
let registerGenerateStoryTest = () => {};
if (fs.existsSync(new URL('./tools/scaffold/index.js', import.meta.url))) {
  const scaffold = await import('./tools/scaffold/index.js');
  registerScaffoldComponent = scaffold.registerScaffoldComponent;
  registerGenerateStoryTest = scaffold.registerGenerateStoryTest;
}

const TOOLS = [
  { name: "start_service", handler: Ops.startService, schema: { type: "object", properties: { command:{type:"string"}, port:{type:"number"} }, required:["command"] } },
  { name: "start_dev", handler: async ({ skipDocker=false }) => Ops.startDevelopmentSession({ skipDocker, runPlaywright: false }), schema: { type: "object", properties: { skipDocker:{type:"boolean"} } } },
  { name: "start_development_session", handler: Ops.startDevelopmentSessionBackground, schema: { type: "object", properties: { skipDocker:{type:"boolean"}, runPlaywright:{type:"boolean"} } } },
  { name: "check_services", handler: Ops.checkServices, schema: { type: "object", properties: { ports:{ type: "array", items: { type: "number" } } } } },
  { name: "run_playwright_docker", handler: Ops.runPlaywrightInDocker, schema: { type: "object", properties: { testsPath:{type:"string"}, project:{type:"string"} } } },
  { name: "install_playwright_binaries", handler: Ops.installPlaywrightBinaries, schema: { type: "object", properties: {} } },
  { name: "dev_status", handler: Ops.devStatus, schema: { type: "object", properties: {} } },
  { name: "run_tests", handler: Ops.runTests, schema: { type: "object", properties: {} } },
  
  { name: "list_issues", handler: Git.listIssues, schema: { type: "object", properties: { limit:{type:"number"} } } },
  { name: "create_issue", handler: Git.createIssue, schema: { type: "object", properties: { title:{type:"string"}, body:{type:"string"} }, required:["title","body"] } },
  { name: "create_pr", handler: Git.createPR, schema: { type: "object", properties: { title:{type:"string"} }, required:["title"] } },
  { name: "start_task", handler: Git.startTask, schema: { type: "object", properties: { issue_id:{type:"number"} }, required:["issue_id"] } },
  { name: "get_git_diff", handler: Git.getDiff, schema: { type: "object", properties: {} } },

  // V27: Register new tools
  { name: "read_file", handler: Files.readFile, schema: { type: "object", properties: { path:{type:"string"} }, required:["path"] } },
  { name: "write_file", handler: Files.writeFile, schema: { type: "object", properties: { path:{type:"string"}, content:{type:"string"} }, required:["path","content"] } },
  { name: "stat_file", handler: Files.statFile, schema: { type: "object", properties: { path:{type:"string"} }, required:["path"] } },
  { name: "check_pipeline", handler: Git.checkPipeline, schema: { type: "object", properties: {} } },
  { name: "update_issue", handler: Git.updateIssue, schema: { type: "object", properties: { issue_number:{type:"number"}, state:{type:"string"} }, required:["issue_number", "state"] } },

  { name: "search_code", handler: Files.searchCode, schema: { type: "object", properties: { query:{type:"string"} }, required:["query"] } },
  { name: "explore_file_tree", handler: Files.exploreTree, schema: { type: "object", properties: { path:{type:"string"} } } },
  { name: "read_context", handler: Files.readContext, schema: { type: "object", properties: {} } },

  // Storybook MCP adapter tools
  { name: "storybook_list_components", handler: async ({ baseUrl }) => (await import('./tools/storybook_adapter.js')).listComponents(baseUrl), schema: { type: "object", properties: { baseUrl:{type:"string"} } } },
  { name: "storybook_get_component_doc", handler: async ({ componentId, baseUrl }) => (await import('./tools/storybook_adapter.js')).getComponentDocumentation(componentId, baseUrl), schema: { type: "object", properties: { componentId:{type:"string"}, baseUrl:{type:"string"} }, required:["componentId"] } },
  { name: "storybook_list_tools", handler: async ({ baseUrl }) => (await import('./tools/storybook_adapter.js')).listTools(baseUrl), schema: { type: "object", properties: { baseUrl:{type:"string"} } } },

  // Official MCP-like Storybook tools
  { name: "get_ui_building_instructions", handler: async () => (await import('./tools/get-ui-building-instructions.js')).getUiBuildingInstructions(), schema: { type: "object", properties: {} } },
  { name: "get_story_urls", handler: async ({ absoluteStoryPath, exportName, explicitStoryName, baseUrl }) => (await import('./tools/get-story-urls.js')).getStoryUrls({ absoluteStoryPath, exportName, explicitStoryName, baseUrl }), schema: { type: "object", properties: { absoluteStoryPath:{type:"string"}, exportName:{type:"string"}, explicitStoryName:{type:"string"}, baseUrl:{type:"string"} }, required:["absoluteStoryPath","exportName"] } },
  { name: "list-all-components", handler: async ({ baseUrl }) => (await import('./tools/list-all-components.js')).listAllComponents({ baseUrl }), schema: { type: "object", properties: { baseUrl:{type:"string"} } } },
{ name: "get-component-documentation", description: "Fetches detailed docs (HTML) for a specific component ID from Storybook MCP", handler: async ({ componentId, baseUrl }) => (await import('./tools/get-component-documentation.js')).getComponentDocumentation({ componentId, baseUrl }), schema: { type: "object", properties: { componentId:{type:"string"}, baseUrl:{type:"string"}, }, required:["componentId"] } }
];

// Register new scaffold tools (TypeScript codegen and test injection)
const scaffoldTools = [];
const mockServer = {
  tool: (name, schema, handler) => {
    scaffoldTools.push({ name, handler, schema });
  }
};
registerScaffoldComponent(mockServer);
registerGenerateStoryTest(mockServer);
scaffoldTools.forEach(t => TOOLS.push({ name: t.name, handler: t.handler, schema: t.schema }));

// Helpful startup logs
console.log('MCP: registering tools:', TOOLS.map(t => t.name).join(', '));
console.log('MCP: starting up at', new Date().toISOString());

const server = new Server({ name: "singularity-core", version: "21.0.0" }, { capabilities: { tools: {} } });
server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools: TOOLS.map(t => ({ name: t.name, inputSchema: t.schema })) }));
server.setRequestHandler(CallToolRequestSchema, async (req) => {
  const tool = TOOLS.find(t => t.name === req.params.name);
  if (!tool) throw new Error("Unknown tool");

  // Enforce non-blocking: wait up to WATCHDOG_MS for the handler to respond.
  const WATCHDOG_MS = 20000;
  try {
    const handlerPromise = (async () => ({ result: await tool.handler(req.params.arguments) }))();
    const timeoutPromise = new Promise((resolve) => setTimeout(() => resolve({ timeout: true }), WATCHDOG_MS));
    const raced = await Promise.race([handlerPromise, timeoutPromise]);
    if (raced && raced.timeout) {
      const msg = `Tool '${tool.name}' exceeded ${WATCHDOG_MS}ms. Long-running operations should be started with 'start_service' or 'start_development_session' and run detached. See refs/no_hanging_agent.txt`;
      console.warn('MCP TIMEOUT:', msg);
      return { content: [{ type: "text", text: msg }], isError: true };
    }
    return { content: [{ type: "text", text: JSON.stringify(raced.result) }] };
  } catch (e) {
    return { content: [{ type: "text", text: "Error: " + e.message }], isError: true };
  }
});
server.connect(new StdioServerTransport()).catch(console.error);