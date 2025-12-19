/**
 * 1. SETUP_SINGULARITY_CORE_V21.JS
 * The Engine Room.
 * * UPGRADES from V20:
 * - Restored Context System (.task-context).
 * - Restored 'start_task' (Auto-branching).
 * - Restored 'run_tests' & 'get_diff'.
 * - Restored CLI Binary (bin/nexus).
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = process.cwd();
const log = (m) => console.log(`[CORE] ${m}`);

function write(relPath, content) {
    const p = path.join(ROOT, relPath);
    fs.mkdirSync(path.dirname(p), { recursive: true });
    fs.writeFileSync(p, content.trim());
    log(`Created: ${relPath}`);
}

function makeExec(relPath) {
    try { if (process.platform !== 'win32') execSync(`chmod +x ${path.join(ROOT, relPath)}`); } catch (e) {}
}

console.log(">>> INITIALIZING SINGULARITY CORE V21...");

// ==============================================================================
// A. CONTEXT & FILES (The Memory)
// ==============================================================================

write('mcp/tools/files.js', `
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const CTX_FILE = path.resolve(process.cwd(), '.task-context', 'active.json');

export const readContext = () => { try { return JSON.parse(fs.readFileSync(CTX_FILE, 'utf8')); } catch { return {}; } };
export const writeContext = (d) => {
    fs.mkdirSync(path.dirname(CTX_FILE), {recursive:true});
    const current = readContext();
    fs.writeFileSync(CTX_FILE, JSON.stringify({...current, ...d}, null, 2));
};

export const searchCode = async ({ query }) => {
    try { 
        return { matches: execSync(\`grep -rn "\${query}" . --exclude-dir={node_modules,.git,.next,dist} --include=\*.{js,ts,tsx,css,json}\`, {encoding:'utf8'}).slice(0, 1000) }; 
    } catch { return { matches: "No matches found." }; }
};

export const exploreTree = async ({ path: p = '.', depth = 2 }) => {
    const getTree = (d, l) => {
       if (l > depth) return [];
       try { 
           return fs.readdirSync(d, {withFileTypes:true})
            .filter(f => !f.name.startsWith('.') && f.name !== 'node_modules' && f.name !== '.git')
            .map(f => f.isDirectory() ? {[f.name]: getTree(path.join(d,f.name), l+1)} : f.name);
       } catch { return []; }
    };
    return { tree: getTree(p, 1) };
};
`);

// ==============================================================================
// B. GIT & TASKS (The Action)
// ==============================================================================

write('mcp/tools/git.js', `
import { execSync } from 'child_process';
import { writeContext } from './files.js';

export const listIssues = async ({ limit }) => {
    try { execSync('gh auth status'); } catch { return { error: "GitHub CLI not authenticated." }; }
    try { 
        return { json: execSync(\`gh issue list --limit \${limit||10} --json number,title,state,body\`, {encoding:'utf8'}) }; 
    } catch(e) { return { error: e.message }; }
};

export const createIssue = async ({ title, body }) => {
    return { url: execSync(\`gh issue create --title "\${title}" --body "\${body}"\`, {encoding:'utf8'}).trim() };
};

export const createPR = async ({ title }) => {
    try {
        execSync('git push -u origin HEAD');
        return { url: execSync(\`gh pr create --title "\${title}" --fill\`, {encoding:'utf8'}).trim() };
    } catch(e) { return { error: e.message }; }
};

export const getDiff = async () => {
    try { return { diff: execSync('git diff --stat', {encoding:'utf8'}) || "No changes." }; } 
    catch { return { diff: "Not a git repo." }; }
};

export const startTask = async ({ issue_id }) => {
    try { 
        execSync('git stash'); 
        execSync('git checkout main'); 
        execSync('git pull'); 
        execSync(\`git checkout -b task/issue-\${issue_id}\`); 
    } catch(e) {}
    writeContext({ currentTask: issue_id, startTime: Date.now(), status: "in-progress" });
    return { msg: \`Switched to branch task/issue-\${issue_id} and reset context.\` };
};
`);

// ==============================================================================
// C. SERVICE & TESTING (The Operations)
// ==============================================================================

write('mcp/tools/ops.js', `
import { spawn, execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const killPort = (port) => {
    try {
        const pid = execSync(\`lsof -t -i:\${port}\`, {encoding:'utf8'}).trim();
        if(pid) { process.kill(pid); }
    } catch(e) {}
};

export const startService = async ({ command, port }) => {
    if (port) killPort(port);
    const logFile = path.resolve(process.cwd(), '.task-context', 'logs', \`svc_\${port}.log\`);
    fs.mkdirSync(path.dirname(logFile), {recursive:true});
    const out = fs.openSync(logFile, 'w');
    const proc = spawn(command, { detached: true, stdio: ['ignore', out, out], shell: true });
    proc.unref();
    return { msg: \`Service Online (PID \${proc.pid})\`, log: logFile };
};

export const runTests = async () => {
    try { 
        const output = execSync('npm test', {encoding:'utf8', timeout: 30000}); 
        return { status: "PASS", output: output.slice(-500) };
    } catch(e) { 
        return { status: "FAIL", output: (e.stdout || "") + (e.stderr || "") }; 
    }
};
`);

// ==============================================================================
// D. SERVER ENTRY POINT
// ==============================================================================

write('mcp/index.js', `
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
`);

write('mcp/package.json', JSON.stringify({ "type": "module", "dependencies": { "@modelcontextprotocol/sdk": "^0.6.0" } }, null, 2));

// ==============================================================================
// E. THE CLI BINARY (Restored from V11)
// ==============================================================================

write('bin/nexus', `
#!/usr/bin/env node
const { spawn } = require('child_process');
console.log(">>> LAUNCHING SINGULARITY UI...");
spawn('npm', ['run', 'dev', '--prefix', 'ui'], { stdio: 'inherit', shell: true });
`);
makeExec('bin/nexus');

// INSTALLATION
console.log("[CORE] Installing dependencies...");
execSync('npm install', { cwd: path.join(ROOT, 'mcp'), stdio: 'inherit' });
console.log("[CORE] Ready.");