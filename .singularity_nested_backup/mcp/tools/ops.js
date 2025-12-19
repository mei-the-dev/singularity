import { spawn, execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { REPO_ROOT } from './git.js';

const killPort = (port) => {
    try {
        const pid = execSync(`lsof -t -i:${port}`, {encoding:'utf8'}).trim();
        if(pid) { process.kill(pid); }
    } catch(e) {}
};

export const startService = async ({ command, port }) => {
    if (port) killPort(port);
    const logFile = path.resolve(REPO_ROOT, '.task-context', 'logs', `svc_${port}.log`);
    fs.mkdirSync(path.dirname(logFile), {recursive:true});
    const out = fs.openSync(logFile, 'w');

    // Validate command to avoid shell-injection / dangerous constructs
    if (typeof command !== 'string' && !Array.isArray(command)) {
        return { error: 'Invalid command: must be string or array' };
    }
    const raw = Array.isArray(command) ? command.join(' ') : String(command);
    // Reject obviously dangerous characters
    if (/[`;&|<>]/.test(raw)) {
        return { error: 'Refusing to run potentially unsafe command' };
    }

    // If command is array, call without shell; if string, spawn with shell: false and split into args
    let proc;
    if (Array.isArray(command)) {
        const cmd = command[0];
        const args = command.slice(1);
        proc = spawn(cmd, args, { detached: true, stdio: ['ignore', out, out], cwd: REPO_ROOT });
    } else {
        // Basic split on spaces (note: callers should prefer array form for complex commands)
        const parts = raw.split(' ').filter(Boolean);
        const cmd = parts.shift();
        proc = spawn(cmd, parts, { detached: true, stdio: ['ignore', out, out], cwd: REPO_ROOT });
    }

    proc.unref();
    return { msg: `Service Online (PID ${proc.pid})`, log: logFile };
};

export const runTests = async () => {
    try { 
        const output = execSync('npm test', { cwd: REPO_ROOT, encoding:'utf8', timeout: 30000 }); 
        return { status: "PASS", output: output.slice(-500) };
    } catch(e) { 
        return { status: "FAIL", output: (e.stdout || "") + (e.stderr || "") }; 
    }
};