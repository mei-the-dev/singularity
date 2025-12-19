
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

// Resolve Repo Root for file operations
const __filename = fileURLToPath(import.meta.url);
const REPO_ROOT = path.resolve(path.dirname(__filename), '../../'); // Adjust based on your depth

const CTX_FILE = path.join(REPO_ROOT, '.task-context', 'active.json');

export const readContext = () => { 
    try { return JSON.parse(fs.readFileSync(CTX_FILE, 'utf8')); } catch { return {}; } 
};

export const writeContext = (d) => {
    fs.mkdirSync(path.dirname(CTX_FILE), {recursive:true});
    const current = readContext();
    fs.writeFileSync(CTX_FILE, JSON.stringify({...current, ...d}, null, 2));
};

export const readFile = async ({ path: p }) => {
    try {
        const fullPath = path.resolve(REPO_ROOT, p);
        if (!fullPath.startsWith(REPO_ROOT)) return { error: "Access Denied: Outside Repo" };
        if (!fs.existsSync(fullPath)) return { error: "File not found" };
        return { content: fs.readFileSync(fullPath, 'utf8') };
    } catch(e) { return { error: e.message }; }
};

export const statFile = async ({ path: p }) => {
    try {
        const fullPath = path.resolve(REPO_ROOT, p);
        const stats = fs.statSync(fullPath);
        return { size: stats.size, mtime: stats.mtime };
    } catch(e) { return { error: "File check failed" }; }
};

export const searchCode = async ({ query }) => {
    try { 
        return { matches: execSync(`grep -rn "${query}" . --exclude-dir={node_modules,.git,.next} --include=*.{js,ts,tsx,css}`, {cwd: REPO_ROOT, encoding:'utf8'}).slice(0, 1000) }; 
    } catch { return { matches: "No matches found." }; }
};

export const exploreTree = async ({ path: p = '.', depth = 2 }) => {
    // (Existing implementation, just ensure it uses fs.readdirSync on path.join(REPO_ROOT, p))
    // ...
    // For brevity, assuming previous implementation but ensure root pathing is correct
    return { tree: "Tree view" }; 
};