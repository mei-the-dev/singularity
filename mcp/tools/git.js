
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
        if (state === 'closed') {
            runSafe('gh', ['issue', 'close', String(issue_number)]);
        } else if (state === 'open' || state === 'reopen') {
            runSafe('gh', ['issue', 'reopen', String(issue_number)]);
        } else {
            return { error: `Unsupported state: ${state}` };
        }
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
    // Execute git commands explicitly against MCP_REPO_OVERRIDE when present to avoid ambiguity
    const targetRepo = process.env.MCP_REPO_OVERRIDE || REPO_ROOT;
    try {
        // Ensure target is a git repository (require .git folder to exist)
        if (!fs.existsSync(path.join(targetRepo, '.git'))) {
            return { error: 'Not a git repository' };
        }
        // double-check with git command
        try { runSafe('git', ['-C', targetRepo, 'rev-parse', '--is-inside-work-tree']); } catch (e) { return { error: 'Not a git repository' }; }

        runSafe('git', ['-C', targetRepo, 'stash']);

        // Determine default branch robustly
        let defaultBranch = 'main';
        try {
            const out = runSafe('git', ['-C', targetRepo, 'rev-parse', '--abbrev-ref', 'origin/HEAD']);
            if (out) defaultBranch = out.replace('origin/', '');
        } catch (e) {
            try {
                const out2 = runSafe('git', ['-C', targetRepo, 'rev-parse', '--abbrev-ref', 'HEAD']);
                if (out2 && out2 !== 'HEAD') defaultBranch = out2;
                else {
                    const out3 = runSafe('git', ['-C', targetRepo, 'branch', '--show-current']);
                    if (out3) defaultBranch = out3;
                    else {
                        for (const b of ['main', 'master']) {
                            try { runSafe('git', ['-C', targetRepo, 'rev-parse', '--verify', b]); defaultBranch = b; break; } catch (e2) {}
                        }
                    }
                }
            } catch (e2) { /* keep default */ }
        }

        runSafe('git', ['-C', targetRepo, 'checkout', defaultBranch]);
        try { runSafe('git', ['-C', targetRepo, 'pull']); } catch(e) { /* ignore pull errors for local-only repos */ }

        // Create the task branch, or checkout if it exists
        try {
            runSafe('git', ['-C', targetRepo, 'checkout', '-b', `task/issue-${issue_id}`]);
        } catch (e) {
            try { runSafe('git', ['-C', targetRepo, 'checkout', `task/issue-${issue_id}`]); } catch (e2) { return { error: e.message }; }
        }

        // Write context directly into target repo to ensure deterministic tests
        try {
            const ctxPath = path.join(targetRepo, '.task-context');
            fs.mkdirSync(ctxPath, { recursive: true });
            fs.writeFileSync(path.join(ctxPath, 'active.json'), JSON.stringify({ currentTask: issue_id, status: 'in-progress' }, null, 2));
        } catch (e) { /* best-effort, ignore */ }

        // Start a development session and perform health checks for required services
        try {
            // import Ops lazily to avoid circular import issues in some environments
            const Ops = await import('./ops.js');
            const svcResult = await Ops.startDevelopmentSession();
            try {
                fs.writeFileSync(path.join(ctxPath, 'services.json'), JSON.stringify(svcResult, null, 2));
            } catch(e) { /* ignore write errors */ }
        } catch (e) {
            /* best-effort: if the environment can't start services, continue */
        }

    } catch(e) {
        return { error: e.message };
    }
    return { msg: `Switched context to issue #${issue_id}` };
};

// Export helper for tests
export const getRepoRoot = () => REPO_ROOT;
export const resolveRepoRoot = () => findRepoRoot(__dirname);