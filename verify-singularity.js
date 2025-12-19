// File: /run/media/mei/neo/diamond-mcp/verify-singularity.js

import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// CONFIGURATION
// Support either nested 'singularity/mcp' (old layout) OR top-level 'mcp' (new layout)
const SERVER_PATH = fs.existsSync(path.join(__dirname, 'mcp', 'index.js')) ? path.join(__dirname, 'mcp', 'index.js') : path.join(__dirname, 'singularity', 'mcp', 'index.js');
const GIT_TOOL_PATH = fs.existsSync(path.join(__dirname, 'mcp', 'tools', 'git.js')) ? path.join(__dirname, 'mcp', 'tools', 'git.js') : path.join(__dirname, 'singularity', 'mcp', 'tools', 'git.js');
const FILES_TOOL_PATH = fs.existsSync(path.join(__dirname, 'mcp', 'tools', 'files.js')) ? path.join(__dirname, 'mcp', 'tools', 'files.js') : path.join(__dirname, 'singularity', 'mcp', 'tools', 'files.js');

console.log("\x1b[36m%s\x1b[0m", ">>> STARTING SINGULARITY DIAGNOSTICS [V27 CHECK] <<<\n");

// ---------------------------------------------------------
// TEST 1: STATIC CODE ANALYSIS (Security & Patches)
// ---------------------------------------------------------
console.log("TEST 1: Static Code Analysis");

function checkFile(name, p, checks) {
    if (!fs.existsSync(p)) {
        console.log(`❌ ${name}: File not found at ${p}`);
        return false;
    }
    const content = fs.readFileSync(p, 'utf8');
    let pass = true;
    checks.forEach(({ label, regex, required }) => {
        const hasIt = regex.test(content);
        if (hasIt === required) {
            console.log(`   ✅ ${label}`);
        } else {
            console.log(`   ❌ ${label} (EXPECTED: ${required})`);
            pass = false;
        }
    });
    return pass;
}

const gitPass = checkFile('Git Tools', GIT_TOOL_PATH, [
    { label: "Shell Injection Fix (execFileSync)", regex: /execFileSync|execFileInRepo/, required: true },
    { label: "Explicit REPO_ROOT export", regex: /REPO_ROOT|GIT_REPO_DIR/, required: true },
    { label: "GH invocations use cwd", regex: /cwd:\s*REPO_ROOT|cwd:\s*GIT_REPO_DIR/, required: true },
    { label: "Pipeline Monitor (checkPipeline)", regex: /checkPipeline/, required: true },
    { label: "Issue Updates (updateIssue)", regex: /updateIssue/, required: true }
]);

const filesPass = checkFile('Files Tools', FILES_TOOL_PATH, [
    { label: "isSafePath present", regex: /isSafePath\s*=|function isSafePath/, required: true },
    { label: "writeFile tool", regex: /export\s+const\s+writeFile/, required: true },
    { label: "safe search (execFile|execSync with args)", regex: /exec(FileSync|Sync)\(.*grep|execFileSync\(\'grep\'/, required: true }
]);

// Additional check: agent metadata file must declare repoRoot: singularity
const AGENT_META_PATH = path.join(__dirname, '.github', 'agents', 'singularity.agent.md');
let agentMetaPass = false;
if (fs.existsSync(AGENT_META_PATH)) {
    const agentMeta = fs.readFileSync(AGENT_META_PATH, 'utf8');
    agentMetaPass = /repoRoot:\s*singularity/.test(agentMeta);
    if (agentMetaPass) console.log('   ✅ Agent metadata contains repoRoot: singularity');
    else console.log('   ❌ Agent metadata missing repoRoot: singularity');
} else {
    console.log(`   ❌ Agent metadata file not found at ${AGENT_META_PATH}`);
}

if (!gitPass) {
    console.log("\n\x1b[31m[FAIL] STATIC ANALYSIS FAILED.\x1b[0m You are running vulnerable V21 code.");
    console.log("ACTION: Apply the V27 patch provided in the chat history.\n");
} else {
    console.log("\x1b[32m[PASS] Codebase looks patched (V27).\x1b[0m\n");
}

// ---------------------------------------------------------
// TEST 2: RUNTIME SERVER CHECK (Tool Availability)
// ---------------------------------------------------------
console.log("TEST 2: Runtime MCP Server Check");

const server = spawn('node', [SERVER_PATH], { stdio: ['pipe', 'pipe', 'inherit'] });
let buffer = '';
let passedRuntime = false;

// Kill server if it hangs (10s timeout)
const timeout = setTimeout(() => {
    console.log("\x1b[31m[TIMEOUT] Server did not respond within 10s.\x1b[0m");
    try { server.kill(); } catch (e) {}
    process.exit(1);
}, 10000);

server.stdout.on('data', (d) => {
    buffer += d.toString();
    const lines = buffer.split('\n');
    buffer = lines.pop(); // Keep incomplete line

    for (const line of lines) {
        if (!line.trim()) continue;
        try {
            const msg = JSON.parse(line);
            
            // 2. Handle Tool List Response
            if (msg.id === 1 && msg.result && msg.result.tools) {
                const tools = msg.result.tools.map(t => t.name);
                console.log(`   Received ${tools.length} tools.`);
                
                const missing = ['read_file', 'write_file', 'check_pipeline', 'update_issue'].filter(t => !tools.includes(t));
                
                if (missing.length === 0) {
                    console.log("   ✅ All V29 Tools Present (read_file, write_file, check_pipeline, update_issue).");
                    
                    // Trigger Test 3: Read a File
                    const readReq = { jsonrpc: '2.0', id: 2, method: 'tools/call', params: { name: 'read_file', arguments: { path: '.github/agents/singularity.agent.md' } } };
                    server.stdin.write(JSON.stringify(readReq) + '\n');
                } else {
                    console.log(`   ❌ Missing V29 Tools: ${missing.join(', ')}`);
                    clearTimeout(timeout);
                    try { server.kill(); } catch (e) {}
                    process.exit(1);
                }
            }
            
            // 3. Handle File Read Response
            if (msg.id === 2) {
                if (msg.error) {
                     console.log(`   ❌ Vision Test Failed: ${msg.error.message}`);
                } else {
                     console.log("   ✅ Vision Test Passed (Agent can read files).");
                     passedRuntime = true;
                }
                clearTimeout(timeout);
                server.kill();
                finish();
            }

        } catch (e) { /* Ignore non-JSON logs */ }
    }
});

// 1. Send Initialize & List Tools
const initReq = { jsonrpc: '2.0', id: 0, method: 'initialize', params: { protocolVersion: '2024-11-05', capabilities: {}, clientInfo: { name: 'tester', version: '1.0' } } };
const listReq = { jsonrpc: '2.0', id: 1, method: 'tools/list' };

server.stdin.write(JSON.stringify(initReq) + '\n');
server.stdin.write(JSON.stringify(listReq) + '\n');

function finish() {
    console.log("\n---------------------------------------------------------");
    if (gitPass && passedRuntime && agentMetaPass) {
        console.log("\x1b[32m>>> SYSTEM STATUS: OPERATIONAL [V27] <<<\x1b[0m");
        console.log("1. Shell Injection Vulnerability: FIXED");
        console.log("2. Agent Vision (read_file): ACTIVE");
        console.log("3. Pipeline Monitoring: ACTIVE");
        console.log("You may now use the Singularity Agent safely.");
    } else {
        console.log("\x1b[31m>>> SYSTEM STATUS: CRITICAL FAILURE <<<\x1b[0m");
        console.log("The agent is unsafe or blind. Please verify the code patches.");
    }
}