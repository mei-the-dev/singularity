import { execSync } from 'child_process';
import { writeContext } from './files.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Git repo is in the parent directory of mcp
const GIT_REPO_DIR = path.resolve(__dirname, '..');

const execInRepo = (command, options = {}) => {
  return execSync(command, { ...options, cwd: GIT_REPO_DIR });
};

export const listIssues = async ({ limit }) => {
    try { execInRepo('gh auth status'); } catch { return { error: "GitHub CLI not authenticated." }; }
    try {
        return { json: execInRepo(`gh issue list --limit ${limit||10} --json number,title,state,body`, {encoding:'utf8'}) };
    } catch(e) { return { error: e.message }; }
};

export const createIssue = async ({ title, body }) => {
    return { url: execInRepo(`gh issue create --title "${title}" --body "${body}"`, {encoding:'utf8'}).trim() };
};

export const createPR = async ({ title }) => {
    try {
        execInRepo('git push -u origin HEAD');
        return { url: execInRepo(`gh pr create --title "${title}" --fill`, {encoding:'utf8'}).trim() };
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