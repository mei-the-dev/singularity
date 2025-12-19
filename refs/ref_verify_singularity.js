import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// CONFIGURATION
const SERVER_PATH = path.join(__dirname, 'mcp/index.js');
const GIT_TOOL_PATH = path.join(__dirname, 'mcp/tools/git.js');

console.log("\x1b[36m%s\x1b[0m", ">>> STARTING SINGULARITY DIAGNOSTICS [V29 CHECK] <<<\n");

// TEST 1: STATIC CODE ANALYSIS
console.log("TEST 1: Static Code Analysis");
if (!fs.existsSync(GIT_TOOL_PATH)) { console.log(`❌ File not found: ${GIT_TOOL_PATH}`); process.exit(1); }

const content = fs.readFileSync(GIT_TOOL_PATH, 'utf8');
const checks = [
    { label: "Shell Injection Fix", regex: /execFileSync/ },
    { label: "Repo Root Detection", regex: /findRepoRoot/ },
    { label: "Pipeline Monitor", regex: /checkPipeline/ }
];

let pass = true;
checks.forEach(c => {
    if (c.regex.test(content)) console.log(`   ✅ ${c.label}`);
    else { console.log(`   ❌ ${c.label}`); pass = false; }
});

// TEST 2: RUNTIME CHECK
console.log("\nTEST 2: Runtime MCP Server Check");
const server = spawn('node', [SERVER_PATH], { stdio: ['pipe', 'pipe', 'inherit'] });
let buffer = '';

server.stdout.on('data', (d) => {
    buffer += d.toString();
    const lines = buffer.split('\n');
    buffer = lines.pop();

    for (const line of lines) {
        if (!line.trim()) continue;
        try {
            const msg = JSON.parse(line);
            if (msg.id === 1 && msg.result && msg.result.tools) {
                const tools = msg.result.tools.map(t => t.name);
                console.log(`   Received ${tools.length} tools.`);
                
                // V29 REQUIREMENT: write_file MUST be present
                const required = ['write_file', 'check_pipeline', 'start_task'];
                const missing = required.filter(t => !tools.includes(t));
                
                if (missing.length === 0) {
                    console.log("   ✅ All V29 Tools Present (write_file confirmed).");
                    finish(true);
                } else {
                    console.log(`   ❌ Missing Tools: ${missing.join(', ')}`);
                    finish(false);
                }
            }
        } catch (e) {}
    }
});

const initReq = { jsonrpc: '2.0', id: 0, method: 'initialize', params: { protocolVersion: '2024-11-05', capabilities: {}, clientInfo: { name: 'tester', version: '1.0' } } };
const listReq = { jsonrpc: '2.0', id: 1, method: 'tools/list' };
server.stdin.write(JSON.stringify(initReq) + '\n');
server.stdin.write(JSON.stringify(listReq) + '\n');

function finish(success) {
    server.kill();
    console.log("\n---------------------------------------------------------");
    if (pass && success) {
        console.log("\x1b[32m>>> SYSTEM STATUS: OPERATIONAL [V29] <<<\x1b[0m");
        console.log("The Singularity is fully autonomous.");
    } else {
        console.log("\x1b[31m>>> SYSTEM STATUS: UPGRADE REQUIRED <<<\x1b[0m");
    }
    process.exit(success ? 0 : 1);
}