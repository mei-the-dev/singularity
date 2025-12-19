/**
 * 2. SETUP_SINGULARITY_CORTEX_V21.JS
 * The Brain.
 * * UPGRADES from V20:
 * - Protocol expanded to cover /plan, /ticket, /diff, /doctor.
 * - Added 'read_context' directive to persistent memory.
 */
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const log = (m) => console.log(`[CORTEX] ${m}`);

console.log(">>> UPGRADING SINGULARITY CORTEX TO V21...");

const INSTRUCTIONS = `
# 🌌 SINGULARITY PROTOCOL V21

You are the **Singularity AI**, an autonomous development partner linked to the local repository.

## 🧠 MEMORY PROTOCOL
1. **Startup:** At the start of every session, run \`read_context()\` to see if an active task exists.
2. **Persistence:** When switching tasks, always use \`start_task\` to lock the context in file.

## ⚡ PSEUDO-SLASH COMMANDS
You must parse user input for these triggers and EXECUTE the tool immediately.

| Trigger | Tool Chain | Description |
| :--- | :--- | :--- |
| \`/nexus\` | \`start_service("npm run dev --prefix ui", 3000)\` | **Launch UI** |
| \`/board\` | \`list_issues({ limit: 10 })\` | View Kanban/Issues |
| \`/plan <id>\` | \`start_task({ issue_id: id })\` | **Start Work:** Branch + Context Reset |
| \`/ticket <t>\`| \`create_issue({ title: t, body: "..." })\` | Draft Issue |
| \`/diff\` | \`get_git_diff()\` | Check changes |
| \`/doctor\` | \`run_tests()\` | **Health Check** |
| \`/explore\` | \`explore_file_tree({ path: "." })\` | Visualize File Structure |
| \`/pr\` | \`run_tests()\` -> (if pass) -> \`create_pr()\` | **Ship It** |

## 🛡️ SAFETY RULES
1. **Never Hallucinate Paths:** Use \`explore_file_tree\` or \`search_code\` before reading files.
2. **Tests First:** Do not open a PR if \`run_tests\` fails.
`;

const instructPath = path.join(ROOT, '.github', 'copilot_instructions.md');
fs.mkdirSync(path.dirname(instructPath), { recursive: true });
fs.writeFileSync(instructPath, INSTRUCTIONS);
log(`Protocol V21 written to ${instructPath}`);

// --- WIRING (VS CODE) ---
const settingsPath = path.join(ROOT, '.vscode', 'settings.json');
let settings = {};

if (fs.existsSync(settingsPath)) {
    try {
        const raw = fs.readFileSync(settingsPath, 'utf8');
        settings = JSON.parse(raw.replace(/\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, ''));
    } catch (e) { log("Resetting corrupted settings.json"); }
} else {
    fs.mkdirSync(path.dirname(settingsPath), { recursive: true });
}

settings["mcp.servers"] = {
    "singularity-v21": {
        "command": process.execPath, // Absolute path to Node
        "args": [path.join(ROOT, "mcp", "index.js")],
        "env": { "PATH": process.env.PATH }
    }
};

settings["github.copilot.chat.codeGeneration.instructions"] = [
    { "file": ".github/copilot_instructions.md" }
];

fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 4));
log(`VS Code wired for V21. Restart required.`);