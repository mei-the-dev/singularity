import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

// Resolve Repo Root (mcp/tools/files.js -> Repo Root)
const __filename = fileURLToPath(import.meta.url);
const REPO_ROOT = path.resolve(path.dirname(__filename), '../../'); 
const CTX_FILE = path.join(REPO_ROOT, '.task-context', 'active.json');

// --- Helpers ---
const isSafePath = (p) => {
    const fullPath = path.resolve(REPO_ROOT, p);
    // 1. Must be inside Repo Root
    if (!fullPath.startsWith(REPO_ROOT)) return false;
    // 2. Must not touch .git folder directly
    if (fullPath.includes('/.git/') || fullPath.endsWith('/.git')) return false;
    return fullPath;
};

// --- Tools ---

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
        const fullPath = isSafePath(p);
        if (!fullPath) return { error: "Access Denied: Path unsafe or outside repo" };
        if (!fs.existsSync(fullPath)) return { error: "File not found" };
        return { content: fs.readFileSync(fullPath, 'utf8') };
    } catch(e) { return { error: e.message }; }
};

export const writeFile = async ({ path: p, content }) => {
    try {
        const fullPath = isSafePath(p);
        if (!fullPath) return { error: "Access Denied: Path unsafe or outside repo" };
        
        // Ensure dir exists
        fs.mkdirSync(path.dirname(fullPath), { recursive: true });
        fs.writeFileSync(fullPath, content, 'utf8');
        
        return { success: true, path: p, size: content.length };
    } catch (e) { return { error: "Write Failed: " + e.message }; }
};

export const statFile = async ({ path: p }) => {
    try {
        const fullPath = isSafePath(p);
        if (!fullPath) return { error: "Access Denied" };
        const stats = fs.statSync(fullPath);
        return { size: stats.size, mtime: stats.mtime };
    } catch(e) { return { error: "File check failed" }; }
};

export const searchCode = async ({ query }) => {
    try {
        const args = ['-rn', String(query), '.', '--exclude-dir', 'node_modules', '--exclude-dir', '.git', '--exclude-dir', '.next', '--include', '*.js', '--include', '*.ts', '--include', '*.tsx', '--include', '*.css'];
        const out = execSync('grep', args, { cwd: REPO_ROOT, encoding: 'utf8' });
        return { matches: (out || '').toString().slice(0, 1000) };
    } catch { return { matches: 'No matches found.' }; }
};

export const exploreTree = async ({ path: p = '.' }) => {
    try {
        return { tree: execSync(`ls -R ${p} | grep ":$" | head -n 30`, {cwd: REPO_ROOT, encoding:'utf8'}) };
    } catch { return { tree: "Error listing files" }; }
};