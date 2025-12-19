import { execSync, execFileSync } from 'child_process';
import { writeContext } from './files.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper: Find the actual git repo root (walking up) to avoid 'not a git repository' errors
function findRepoRoot(start = __dirname) {
    const override = process.env.MCP_REPO_OVERRIDE || process.env.SINGULARITY_ROOT;
    if (override) return path.resolve(override);

    let d = path.resolve(start);
    const root = path.parse(d).root;
    while (d && d !== root) {
        if (path.basename(d) === 'singularity') return d;
        if (fs.existsSync(path.join(d, '.git'))) return d;
        d = path.dirname(d);
    }
    // Fallback to one level up (legacy)
    return path.resolve(__dirname, '..');
}

const GIT_REPO_DIR = findRepoRoot();
export { GIT_REPO_DIR, findRepoRoot };

// Helper: Execute command in repo (Legacy support for simple commands)
const execInRepo = (command, options = {}) => {
  return execSync(command, { ...options, cwd: GIT_REPO_DIR, encoding: 'utf8' }).toString();
};

// Helper: Safe execution using argument arrays (Bypasses shell to fix quoting issues)
const execFileInRepo = (cmd, args, opts = {}) => {
    return execFileSync(cmd, args, { cwd: GIT_REPO_DIR, encoding: 'utf8', ...opts }).toString();
};

export const listIssues = async ({ limit }) => {
    try { execInRepo('gh auth status'); } catch { return { error: "GitHub CLI not authenticated." }; }
    try {
        const args = ['issue', 'list', '--limit', String(limit || 10), '--json', 'number,title,state,body'];
        if (process.env.MCP_GH_REPO) args.push('--repo', process.env.MCP_GH_REPO);
        return { json: execFileInRepo('gh', args) };
    } catch(e) { return { error: e.message }; }
};

export const createIssue = async ({ title, body }) => {
    try {
        // FIX: Use execFileInRepo to pass title and body as distinct array elements.
        // This prevents the shell from interpreting quotes or newlines inside the content.
        const url = execFileInRepo('gh', ['issue', 'create', '--title', title, '--body', body]);
        return { url: url.trim() };
    } catch (e) {
        return { error: e.message };
    }
};

export const createPR = async ({ title }) => {
    try {
        execInRepo('git push -u origin HEAD');
        // FIX: Also applied safe execution to PR creation
        const url = execFileInRepo('gh', ['pr', 'create', '--title', title, '--fill']);
        return { url: url.trim() };
    } catch(e) { return { error: e.message }; }
};

export const getDiff = async () => {
    try { return { diff: execInRepo('git diff --stat', {encoding:'utf8'}) || "No changes." }; }
    catch { return { diff: "Not a git repo." }; }
};

export const startTask = async ({ issue_id }) => {
    try {
        execInRepo('git stash');
        execInRepo('git checkout main');
        execInRepo('git pull');
        execInRepo(`git checkout -b task/issue-${issue_id}`);
    } catch(e) {}
    writeContext({ currentTask: issue_id, startTime: Date.now(), status: "in-progress" });
    return { msg: `Switched to branch task/issue-${issue_id} and reset context.` };
};