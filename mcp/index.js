#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import * as Ops from './tools/ops.js';
import * as Git from './tools/git.js';
import * as Files from './tools/files.js';

const TOOLS = [
  { name: "start_service", handler: Ops.startService, schema: { type: "object", properties: { command:{type:"string"}, port:{type:"number"} }, required:["command"] } },
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
  { name: "read_context", handler: Files.readContext, schema: { type: "object", properties: {} } }
];

const server = new Server({ name: "singularity-core", version: "21.0.0" }, { capabilities: { tools: {} } });
server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools: TOOLS.map(t => ({ name: t.name, inputSchema: t.schema })) }));
server.setRequestHandler(CallToolRequestSchema, async (req) => {
  const tool = TOOLS.find(t => t.name === req.params.name);
  if (!tool) throw new Error("Unknown tool");
  try { return { content: [{ type: "text", text: JSON.stringify(await tool.handler(req.params.arguments)) }] }; } 
  catch(e) { return { content: [{ type: "text", text: "Error: " + e.message }], isError: true }; }
});
server.connect(new StdioServerTransport()).catch(console.error);