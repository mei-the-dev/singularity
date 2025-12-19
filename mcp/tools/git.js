
import { execSync, execFileSync } from 'child_process';
import { writeContext } from './files.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// 1. ROBUST REPO ROOT DETECTION (Fixes "not a git repo" errors)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function findRepoRoot(start) {
    let d = start;
    while (d !== path.parse(d).root) {
        if (fs.existsSync(path.join(d, '.git'))) return d;
        d = path.dirname(d);
    }
    return process.cwd(); // Fallback
}
const REPO_ROOT = findRepoRoot(__dirname);

// 2. SAFE EXECUTION WRAPPER
const runSafe = (cmd, args) => {
    return execFileSync(cmd, args, { cwd: REPO_ROOT, encoding: 'utf8' }).trim();
};

const runShell = (cmd) => {
    return execSync(cmd, { cwd: REPO_ROOT, encoding: 'utf8' }).trim();
};

// --- TOOLS ---

export const listIssues = async ({ limit }) => {
    try { 
        return { json: runShell(`gh issue list --limit ${limit||10} --json number,title,state,body`) };
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
        const url = runSafe('gh', ['pr', 'create', '--title', title, '--fill']);
        return { url };
    } catch(e) { return { error: e.message }; }
};

export const checkPipeline = async () => {
    try {
        const json = runShell('gh run list --limit 1 --json status,conclusion,url');
        const runs = JSON.parse(json);
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