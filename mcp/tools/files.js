import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const CTX_FILE = path.resolve(process.cwd(), '.task-context', 'active.json');

export const readContext = () => { try { return JSON.parse(fs.readFileSync(CTX_FILE, 'utf8')); } catch { return {}; } };
export const writeContext = (d) => {
    fs.mkdirSync(path.dirname(CTX_FILE), {recursive:true});
    const current = readContext();
    fs.writeFileSync(CTX_FILE, JSON.stringify({...current, ...d}, null, 2));
};

export const searchCode = async ({ query }) => {
    try { 
        return { matches: execSync(`grep -rn "${query}" . --exclude-dir={node_modules,.git,.next,dist} --include=*.{js,ts,tsx,css,json}`, {encoding:'utf8'}).slice(0, 1000) }; 
    } catch { return { matches: "No matches found." }; }
};

export const exploreTree = async ({ path: p = '.', depth = 2 }) => {
    const getTree = (d, l) => {
       if (l > depth) return [];
       try { 
           return fs.readdirSync(d, {withFileTypes:true})
            .filter(f => !f.name.startsWith('.') && f.name !== 'node_modules' && f.name !== '.git')
            .map(f => f.isDirectory() ? {[f.name]: getTree(path.join(d,f.name), l+1)} : f.name);
       } catch { return []; }
    };
    return { tree: getTree(p, 1) };
};