
import fs from 'fs';
import path from 'path';
import { execFileSync } from 'child_process';
import { fileURLToPath } from 'url';

// Resolve Repo Root (prefer environment override, otherwise derive from file)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = process.env.MCP_REPO_OVERRIDE || process.env.SINGULARITY_ROOT || path.resolve(__dirname, '../../');

const CTX_FILE = path.join(REPO_ROOT, '.task-context', 'active.json');

// --- Helpers ---
const isSafePath = (p) => {
    const fullPath = path.resolve(REPO_ROOT, p);
    // 1. Must be inside Repo Root
    const rel = path.relative(REPO_ROOT, fullPath);
    if (rel.startsWith('..') || path.isAbsolute(rel)) return false;
    // 2. Must not touch .git folder directly
    if (fullPath.split(path.sep).includes('.git')) return false;
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
        // Use execFileSync with args to avoid shell interpolation of `query`
        const args = ['-rn', String(query), '.', '--exclude-dir', 'node_modules', '--exclude-dir', '.git', '--exclude-dir', '.next', '--include', '*.js', '--include', '*.ts', '--include', '*.tsx', '--include', '*.css'];
        const out = execFileSync('grep', args, { cwd: REPO_ROOT, encoding: 'utf8' });
        return { matches: (out || '').toString().slice(0, 1000) };
    } catch { return { matches: 'No matches found.' }; }
};

export const exploreTree = async ({ path: p = '.', depth = 2 }) => {
    const start = isSafePath(p === '.' ? '.' : p);
    if (!start) return { error: 'Access Denied' };

    function walk(dir, d) {
        if (d < 0) return [];
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        return entries.map(e => {
            const full = path.join(dir, e.name);
            if (e.isDirectory()) return { name: e.name, type: 'dir', children: walk(full, d - 1) };
            return { name: e.name, type: 'file' };
        });
    }

    return { tree: walk(start, depth) };
};

// Debug helper for tests
export const debugPath = (p) => {
    const fullPath = path.resolve(REPO_ROOT, p);
    const rel = path.relative(REPO_ROOT, fullPath);
    return { REPO_ROOT, fullPath, rel, exists: fs.existsSync(fullPath), safe: Boolean(isSafePath(p)) };
};