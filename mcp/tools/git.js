import { execSync } from 'child_process';
import { writeContext } from './files.js';

export const listIssues = async ({ limit }) => {
    try { execSync('gh auth status'); } catch { return { error: "GitHub CLI not authenticated." }; }
    try { 
        return { json: execSync(`gh issue list --limit ${limit||10} --json number,title,state,body`, {encoding:'utf8'}) }; 
    } catch(e) { return { error: e.message }; }
};

export const createIssue = async ({ title, body }) => {
    return { url: execSync(`gh issue create --title "${title}" --body "${body}"`, {encoding:'utf8'}).trim() };
};

export const createPR = async ({ title }) => {
    try {
        execSync('git push -u origin HEAD');
        return { url: execSync(`gh pr create --title "${title}" --fill`, {encoding:'utf8'}).trim() };
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
        execSync(`git checkout -b task/issue-${issue_id}`); 
    } catch(e) {}
    writeContext({ currentTask: issue_id, startTime: Date.now(), status: "in-progress" });
    return { msg: `Switched to branch task/issue-${issue_id} and reset context.` };
};