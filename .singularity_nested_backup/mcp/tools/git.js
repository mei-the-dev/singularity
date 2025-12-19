
import { execSync, execFileSync } from 'child_process';
import { writeContext } from './files.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// 1. ROBUST REPO ROOT DETECTION (Fixes "not a git repo" errors)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function findRepoRoot(start) {
    // Allow an explicit override via environment for edge cases
    const override = process.env.MCP_REPO_OVERRIDE || process.env.SINGULARITY_ROOT;
    if (override) return path.resolve(override);

    // Walk up looking specifically for the 'singularity' folder first, then .git
    let d = path.resolve(start);
    const root = path.parse(d).root;
    while (d && d !== root) {
        if (path.basename(d) === 'singularity') return d;
        if (fs.existsSync(path.join(d, '.git'))) return d;
        d = path.dirname(d);
    }

    // Final fallback: the singularity folder relative to this file
    return path.resolve(__dirname, '..', '..');
}
const REPO_ROOT = findRepoRoot(__dirname);
export { REPO_ROOT, findRepoRoot };

// 2. SAFE EXECUTION WRAPPER
const runSafe = (cmd, args = [], opts = {}) => {
    return execFileSync(cmd, args, { cwd: REPO_ROOT, encoding: 'utf8', ...opts }).toString().trim();
};

const runShell = (cmd, opts = {}) => {
    return execSync(cmd, { cwd: REPO_ROOT, encoding: 'utf8', ...opts }).toString().trim();
};

// --- TOOLS ---

export const listIssues = async ({ limit }) => {
    try {
        const args = ['issue', 'list', '--limit', String(limit || 10), '--json', 'number,title,state,body'];
        if (process.env.MCP_GH_REPO) args.push('--repo', process.env.MCP_GH_REPO);
        const out = runSafe('gh', args);
        try { return { issues: JSON.parse(out) }; } catch (e) { return { json: out }; }
    } catch(e) { return { error: "GH CLI Error: " + e.message }; }
};

export const createIssue = async ({ title, body }) => {
    try {
        // FIX: Passes args as array to prevent shell injection crashes
        const url = runSafe('gh', ['issue', 'create', '--title', title, '--body', body]);
        return { url };
    } catch (e) { return { error: e.message }; }
};

export const updateIssue = async ({ issue_number, state }) => {
    try {
        runSafe('gh', ['issue', 'edit', issue_number.toString(), '--state', state]);
        return { success: true };
    } catch (e) { return { error: e.message }; }
};

export const createPR = async ({ title }) => {
    try {
        runShell('git push -u origin HEAD');
        const ghArgs = ['pr', 'create', '--title', title, '--fill'];
        if (process.env.MCP_GH_REPO) ghArgs.push('--repo', process.env.MCP_GH_REPO);
        const url = runSafe('gh', ghArgs);
        return { url };
    } catch(e) { return { error: e.message }; }
};

export const checkPipeline = async () => {
    try {
        const ghArgs = ['run', 'list', '--limit', '1', '--json', 'status,conclusion,url'];
        if (process.env.MCP_GH_REPO) ghArgs.push('--repo', process.env.MCP_GH_REPO);
        const json = runSafe('gh', ghArgs);
        const runs = JSON.parse(json || '[]');
        return { latest_run: runs[0] || "No runs found" };
    } catch (e) { return { error: "Failed to check pipeline: " + e.message }; }
};

export const getDiff = async () => {
    try { return { diff: runShell('git diff --stat') || "No changes." }; }
    catch { return { diff: "Git error." }; }
};

export const startTask = async ({ issue_id }) => {
    try {
        runShell('git stash');
        runShell('git checkout main');
        runShell('git pull');
        runShell(`git checkout -b task/issue-${issue_id}`);
    } catch(e) {}
    writeContext({ currentTask: issue_id, status: "in-progress" });
    return { msg: `Switched context to issue #${issue_id}` };
};