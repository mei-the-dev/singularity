import { spawn, execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import net from 'net';

const killPort = (port) => {
    try {
        // Primary: use lsof to find PIDs
        let pids = [];
        try {
            const out = execSync(`lsof -t -i:${port}`, {encoding:'utf8'}).trim();
            if (out) pids = out.split(/\s+/).filter(Boolean);
        } catch(e) { /* no lsof or no results */ }

        // Fallback: try fuser to kill processes (many systems provide this)
        if (!pids.length) {
            try {
                execSync(`fuser -k ${port}/tcp`, {stdio: 'ignore'});
                // fuser kills directly; try lsof again to see if any remain
                const out2 = execSync(`lsof -t -i:${port}`, {encoding:'utf8'}).trim();
                if (out2) pids = out2.split(/\s+/).filter(Boolean);
            } catch(e) { /* ignore */ }
        }

        // Fallback: try ss and parse PID if available
        if (!pids.length) {
            try {
                const ssOut = execSync(`ss -ltnp 2>/dev/null | grep -E ":${port}\\b" || true`, {encoding:'utf8'}).trim();
                const m = ssOut.match(/pid=(\d+),/);
                if (m) pids.push(m[1]);
            } catch(e) { /* ignore */ }
        }

        if (pids.length) {
            for (const pid of pids) {
                try { process.kill(parseInt(pid, 10), 'SIGTERM'); } catch(e) {}
            }
            // Give processes a moment, then force-kill any remaining
            try { execSync('sleep 0.3'); } catch(e) {}
            for (const pid of pids) {
                try { process.kill(parseInt(pid, 10), 'SIGKILL'); } catch(e) {}
            }
            return true;
        }
    } catch(e) { /* best-effort, ignore */ }
    return false;
};

export const startService = async ({ command, port }) => {
    if (port) killPort(port);
    const logFile = path.resolve(process.cwd(), '.task-context', 'logs', `svc_${port || 'na'}.log`);
    fs.mkdirSync(path.dirname(logFile), {recursive:true});
    const out = fs.openSync(logFile, 'w');
    const proc = spawn(command, { detached: true, stdio: ['ignore', out, out], shell: true });
    proc.unref();
    return { msg: `Service Online (PID ${proc.pid})`, log: logFile, pid: proc.pid };
};

const isPortOpen = (port, host='127.0.0.1', timeout = 2000) => new Promise((resolve) => {
    const socket = new net.Socket();
    let handled = false;
    const onDone = (up) => { if (handled) return; handled = true; try { socket.destroy(); } catch(e){} resolve(up); };
    socket.setTimeout(timeout);
    socket.once('connect', () => onDone(true));
    socket.once('timeout', () => onDone(false));
    socket.once('error', () => onDone(false));
    socket.connect(port, host);
});

const waitForPort = async (port, ms = 10000, interval = 250) => {
    const start = Date.now();
    while (Date.now() - start < ms) {
        if (await isPortOpen(port)) return true;
        await new Promise(r => setTimeout(r, interval));
    }
    return false;
};

export const startServiceWithHealth = async ({ command, port, name }) => {
    // Ensure port is free before starting service
    if (port) {
        try { killPort(port); } catch(e) {}
    }

    const svc = await startService({ command, port });

    let healthy = true;
    if (port) {
        healthy = await waitForPort(port, 15000);
        // If not healthy, attempt kill & retry once (force port free and restart)
        if (!healthy) {
            try {
                const killed = killPort(port);
                if (killed) {
                    // restart
                    await startService({ command, port });
                    healthy = await waitForPort(port, 10000);
                }
            } catch (e) {
                /* ignore and return unhealthy */
            }
        }
    }
    return { ...svc, healthy };
};

export const runTests = async () => {
    try { 
        const output = execSync('npm test', {encoding:'utf8', timeout: 30000}); 
        return { status: "PASS", output: output.slice(-500) };
    } catch(e) { 
        return { status: "FAIL", output: (e.stdout || "") + (e.stderr || "") }; 
    }
};

export const startDevelopmentSession = async ({ skipDocker=false } = {}) => {
    const results = { docker: null, storybook: null, app: null, playwright: null };

    // 1) Start docker if present
    try {
        if (!skipDocker) {
            try {
                execSync('docker info', { stdio: 'ignore' });
                // Try to bring up defined services (best-effort)
                try { execSync('docker compose up -d', { stdio: 'inherit' }); results.docker = { ok: true }; }
                catch(e) { results.docker = { ok: false, error: e.message }; }
            } catch(e) { results.docker = { ok: false, message: 'Docker not available' } }
        } else { results.docker = { ok: true, skipped: true } }
    } catch(e) { results.docker = { ok: false, error: e.message } }

    // 2) Ensure Storybook (port 6006)
    try {
        // Start storybook in CI/non-interactive mode to avoid CLI prompts when port is occupied
        results.storybook = await startServiceWithHealth({ command: 'npm --workspace=ui run storybook -- --ci --port 6006', port: 6006, name: 'storybook' });
    } catch(e) { results.storybook = { ok: false, error: e.message } }

    // 3) Ensure App (Next) -- default port 3000
    try {
        results.app = await startServiceWithHealth({ command: 'npm run dev --prefix ui', port: 3000, name: 'app' });
    } catch(e) { results.app = { ok: false, error: e.message } }

    // 4) Ensure Playwright installed (best-effort)
    try {
        execSync('npx playwright install --with-deps', { stdio: 'ignore' });
        results.playwright = { ok: true };
    } catch(e) { results.playwright = { ok: false, error: e.message } }

    // 5) Final health summary
    results.ok = !!(results.storybook && results.storybook.healthy);
    return results;
};

export const checkServices = async ({ ports = [6006, 3000] } = {}) => {
    const res = {};
    for (const p of ports) {
        res[p] = await isPortOpen(p);
    }
    return res;
};