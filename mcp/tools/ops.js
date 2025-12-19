import { spawn, execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const killPort = (port) => {
    try {
        const pid = execSync(`lsof -t -i:${port}`, {encoding:'utf8'}).trim();
        if(pid) { process.kill(pid); }
    } catch(e) {}
};

export const startService = async ({ command, port }) => {
    if (port) killPort(port);
    const logFile = path.resolve(process.cwd(), '.task-context', 'logs', `svc_${port}.log`);
    fs.mkdirSync(path.dirname(logFile), {recursive:true});
    const out = fs.openSync(logFile, 'w');
    const proc = spawn(command, { detached: true, stdio: ['ignore', out, out], shell: true });
    proc.unref();
    return { msg: `Service Online (PID ${proc.pid})`, log: logFile };
};

export const runTests = async () => {
    try { 
        const output = execSync('npm test', {encoding:'utf8', timeout: 30000}); 
        return { status: "PASS", output: output.slice(-500) };
    } catch(e) { 
        return { status: "FAIL", output: (e.stdout || "") + (e.stderr || "") }; 
    }
};