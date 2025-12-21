import { spawn, execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import net from 'net';

// Determine repository root (assume two levels up from tools dir)
const REPO_ROOT = path.resolve(new URL('.', import.meta.url).pathname, '..', '..');


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
    // Use repository root for logs so logs are inside workspace and accessible
    const logFile = path.resolve(REPO_ROOT, '.task-context', 'logs', `svc_${port || 'na'}.log`);
    fs.mkdirSync(path.dirname(logFile), {recursive:true});
    const out = fs.openSync(logFile, 'w');
    const proc = spawn(command, { detached: true, stdio: ['ignore', out, out], shell: true, cwd: REPO_ROOT });
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

export const startServiceWithHealth = async ({ command, port, name, timeout = 15000, retries = 1, backoffMs = 500 } = {}) => {
    // Ensure port is free before starting service
    if (port) {
        try { killPort(port); } catch(e) {}
    }

    let attempt = 0;
    let svc = null;
    let healthy = false;
    while (attempt <= retries) {
        svc = await startService({ command, port });
        if (!port) {
            healthy = true; // no port to check
            break;
        }
        healthy = await waitForPort(port, timeout);
        if (healthy) break;
        // attempt remediation: kill port and retry
        try {
            killPort(port);
            await new Promise(r => setTimeout(r, Math.max(200, backoffMs)));
        } catch (e) { /* ignore */ }
        attempt++;
    }

    return { ...svc, healthy, attempts: attempt + 1 };
};

// Collect artifacts into .task-context/artifacts/<name>-timestamp and produce a tar.gz + metadata
export const collectArtifacts = async ({ paths = [], name = 'artifacts' } = {}) => {
    try {
        const ts = Date.now();
        const destBase = path.resolve(REPO_ROOT, '.task-context', 'artifacts');
        fs.mkdirSync(destBase, { recursive: true });
        const dest = path.join(destBase, `${name}-${ts}`);
        fs.mkdirSync(dest, { recursive: true });

        // Copy requested paths
        for (const p of paths) {
            const full = path.resolve(REPO_ROOT, p);
            if (!fs.existsSync(full)) continue;
            const basename = path.basename(p);
            const target = path.join(dest, basename);
            // use fs.cpSync to copy recursively when available
            try { fs.cpSync(full, target, { recursive: true }); } catch (e) { /* fallback */
                execSync(`tar -C ${path.dirname(full)} -cf - ${basename} | tar -C ${dest} -xf -`);
            }
        }

        // Capture available service logs (.task-context/logs)
        try {
            const logsDir = path.resolve(REPO_ROOT, '.task-context', 'logs');
            if (fs.existsSync(logsDir)) {
                const target = path.join(dest, 'service-logs');
                fs.mkdirSync(target, { recursive: true });
                try { fs.cpSync(logsDir, path.join(target), { recursive: true }); } catch (e) {
                    // fallback tar copy
                    execSync(`tar -C ${path.dirname(logsDir)} -cf - ${path.basename(logsDir)} | tar -C ${target} -xf -`);
                }
            }
        } catch (e) { /* non-fatal */ }

        // Capture docker logs for relevant containers (best-effort)
        try {
            const dockerLogsDir = path.join(dest, 'docker-logs');
            fs.mkdirSync(dockerLogsDir, { recursive: true });
            const psOut = execSync('docker ps -a --format "{{.ID}} {{.Names}} {{.Image}}"', { encoding: 'utf8' }).trim();
            if (psOut) {
                const lines = psOut.split('\n');
                for (const l of lines) {
                    const parts = l.split(/\s+/);
                    const id = parts[0];
                    const name = parts[1] || id;
                    // only capture logs for containers that look relevant
                    if (/storybook|ui|playwright|mcp|singularity/i.test(l)) {
                        try {
                            const out = execSync(`docker logs ${id}`, { encoding: 'utf8', timeout: 20 * 1000 });
                            fs.writeFileSync(path.join(dockerLogsDir, `${name || id}.log`), out);
                        } catch (e) {
                            fs.writeFileSync(path.join(dockerLogsDir, `${name || id}.log`), `error capturing logs: ${e.message}`);
                        }
                    }
                }
            }
        } catch (e) { /* ignore docker missing or errors */ }

        // Build metadata (file list, git commit)
        const metadata = { name, ts, originPaths: paths, files: [], git: null };
        const walk = (dir) => {
            let res = [];
            for (const f of fs.readdirSync(dir)) {
                const full = path.join(dir, f);
                const st = fs.statSync(full);
                if (st.isDirectory()) {
                    const child = walk(full);
                    res = res.concat(child.map(c => path.join(f, c)));
                } else {
                    res.push(f);
                }
            }
            return res;
        };
        try { metadata.files = walk(dest); } catch (e) { metadata.files = []; }
        try { metadata.git = execSync('git rev-parse --short HEAD', { encoding: 'utf8', cwd: REPO_ROOT }).trim(); } catch (e) { /* ignore */ }
        fs.writeFileSync(path.join(dest, 'metadata.json'), JSON.stringify(metadata, null, 2));

        // Produce compressed archive for easy upload
        const archive = path.join(destBase, `${name}-${ts}.tar.gz`);
        execSync(`tar -C ${dest} -czf ${archive} .`);

        return { ok: true, dest, archive, metadataPath: path.join(dest, 'metadata.json') };
    } catch (e) {
        return { ok: false, error: e.message };
    }
};

export const runTests = async ({ scope = 'all' } = {}) => {
    try {
        // Run tests from repository root to avoid incorrect cwd (e.g., /home/mei)
        // scope: 'all' runs root test:all, 'mcp' runs only mcp tests, 'ui' runs ui tests
        let cmd = 'npm run test:all';
        if (scope === 'mcp') cmd = 'npm --workspace=mcp run test';
        if (scope === 'ui') cmd = 'npm --workspace=ui run test';
        const output = execSync(cmd, { encoding: 'utf8', timeout: 10 * 60 * 1000, cwd: REPO_ROOT });
        return { status: "PASS", output: output.slice(-2000) };
    } catch (e) {
        return { status: "FAIL", output: ((e.stdout || "") + (e.stderr || "")), error: e.message };
    }
};

export const startDevelopmentSession = async ({ skipDocker=false, runPlaywright=false } = {}) => {
    const results = { docker: null, storybook: null, app: null, playwright: null, playwrightRun: null };

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
        // If the UI package is not present, skip Storybook start and warn
        if (!fs.existsSync(path.join(REPO_ROOT, 'ui'))) {
            results.storybook = { ok: false, skipped: true, reason: 'ui package not present' };
        } else {
            // Start storybook in CI/non-interactive mode to avoid CLI prompts when port is occupied
            results.storybook = await startServiceWithHealth({ command: 'npm --workspace=ui run storybook:ci', port: 6006, name: 'storybook', timeout: 30000 });
        }
    } catch(e) { results.storybook = { ok: false, error: e.message } }

    // 3) Ensure App (Next) -- default port 3000
    try {
        if (!fs.existsSync(path.join(REPO_ROOT, 'ui'))) {
            results.app = { ok: false, skipped: true, reason: 'ui package not present' };
        } else {
            results.app = await startServiceWithHealth({ command: 'npm run dev --prefix ui', port: 3000, name: 'app' });
        }
    } catch(e) { results.app = { ok: false, error: e.message } }

    // 4) Check Playwright availability. Prefer Docker (browsers preinstalled) but don't run tests unless requested.
    try {
        try {
            execSync('docker info', { stdio: 'ignore' });
            const image = process.env.PLAYWRIGHT_DOCKER_IMAGE || 'mcr.microsoft.com/playwright:v1.57.0-jammy';
            try {
                // Validate the image & Playwright install inside container
                execSync(`docker run --rm -v "${process.cwd()}:/work" -w /work ${image} npx playwright --version`, { stdio: 'ignore', timeout: 120000 });
                results.playwright = { ok: true, via: 'docker', image };
            } catch (e) {
                results.playwright = { ok: false, via: 'docker', error: e.message };
            }
        } catch (e) {
            // Docker not available: fallback to local install
            try { execSync('npx playwright install --with-deps', { stdio: 'ignore' }); results.playwright = { ok: true, via: 'local' }; } 
            catch (e2) { results.playwright = { ok: false, via: 'local', error: e2.message }; }
        }

        // Optionally run Playwright tests inside Docker when explicitly requested
        if (runPlaywright && results.playwright && results.playwright.via === 'docker' && results.storybook && results.storybook.healthy) {
            try {
                const image = results.playwright.image || process.env.PLAYWRIGHT_DOCKER_IMAGE || 'mcr.microsoft.com/playwright:v1.57.0-jammy';
                try { execSync('mkdir -p ui/e2e/tests/baselines'); } catch(e) {}
                execSync(`docker run --rm --network host -v "${process.cwd()}:/work" -w /work ${image} bash -lc "export STORYBOOK_URL=http://localhost:6006 && npx playwright test ui/e2e/tests --project=chromium --config=playwright.config.js --reporter=list"`, { stdio: 'inherit', timeout: 15 * 60 * 1000 });
                results.playwrightRun = { ok: true, via: 'docker' };
            } catch (e) {
                results.playwrightRun = { ok: false, via: 'docker', error: e.message };
            }
        }
    } catch(e) { results.playwright = { ok: false, error: e.message } }

    // 5) Final health summary
    results.ok = !!(results.storybook && results.storybook.healthy);
    return results;
};

// New helper: start the full development session in a detached background worker
export const startDevelopmentSessionBackground = async ({ skipDocker=false, runPlaywright=false } = {}) => {
    const cmd = `node ${process.cwd()}/mcp/tools/start_development_session_worker.js ${skipDocker ? '--skipDocker' : ''} ${runPlaywright ? '--runPlaywright' : ''}`.trim();
    return await startService({ command: cmd, port: null });
};

export const checkServices = async ({ ports = [6006, 3000] } = {}) => {
    const res = {};
    for (const p of ports) {
        res[p] = await isPortOpen(p);
    }
    return res;
};

export const runPlaywrightInDocker = async ({ testsPath = 'ui/e2e/tests', project = 'chromium', updateSnapshots = false } = {}) => {
    try {
        // Test hook: allow tests to simulate a failure via env var
        if (process.env.TEST_SIMULATE_PLAYWRIGHT_FAIL === '1') {
            return { ok: false, error: 'simulated failure via TEST_SIMULATE_PLAYWRIGHT_FAIL' };
        }

        const image = process.env.PLAYWRIGHT_DOCKER_IMAGE || 'mcr.microsoft.com/playwright:v1.57.0-jammy';
        execSync(`mkdir -p ui/e2e/tests/baselines`);
        const updateEnv = updateSnapshots ? 'UPDATE_SNAPSHOTS=1' : '';
        execSync(`PLAYWRIGHT_DOCKER_IMAGE=${image} ${updateEnv} ./bin/playwright-docker.sh ${testsPath} ${project}`, { stdio: 'inherit', timeout: 15 * 60 * 1000 });

        // If we updated snapshots, try to collect generated screenshots into the baselines dir
        if (updateSnapshots) {
            try {
                // Copy images from __screenshots__ folders created by Playwright
                execSync(`bash -lc "find ${testsPath} -type f -path '*/__screenshots__/*.png' -exec cp {} ui/e2e/tests/baselines/ \\; || true"`);
                // Also copy any PNGs produced under test-results
                execSync(`bash -lc "find test-results -type f -name '*.png' -exec cp {} ui/e2e/tests/baselines/ \\; || true"`);
            } catch (e) {
                // best-effort: ignore copy failures
            }
        }

        return { ok: true };
    } catch (e) { return { ok: false, error: e.message }; }
};

export const installPlaywrightBinaries = async () => {
    try {
        execSync('chmod +x ./scripts/install-playwright.sh || true');
        const out = execSync('./scripts/install-playwright.sh', { encoding: 'utf8' });
        return { ok: true, output: out };
    } catch (e) { return { ok: false, error: e.message, stderr: (e.stderr || '').toString() }; }
};

export const devStatus = async () => {
    try {
        const p = path.resolve(process.cwd(), '.task-context', 'services.json');
        if (fs.existsSync(p)) return { ok: true, services: JSON.parse(fs.readFileSync(p, 'utf8')) };
        return { ok: false, message: 'No services context file found' };
    } catch (e) { return { ok: false, error: e.message }; }
};

// Check readiness for Storybook + Playwright UX development
export const checkStorybookPlaywrightReadiness = async () => {
    const res = { ok: true, checks: {} };
    try {
        // Check if ui package exists
        const uiPath = path.join(REPO_ROOT, 'ui');
        res.checks.ui_exists = fs.existsSync(uiPath);

        // Check for .storybook
        res.checks.storybook_dir = fs.existsSync(path.join(uiPath, '.storybook'));

        // Check for playwright config
        res.checks.playwright_config = fs.existsSync(path.join(REPO_ROOT, 'playwright.config.js'));

        // Check for e2e tests dir
        res.checks.e2e_tests = fs.existsSync(path.join(REPO_ROOT, 'ui', 'e2e', 'tests'));

        // Check that refs rapid tool exists (setup_storybook_playwright/tooling)
        res.checks.refs_rapid_tools = fs.existsSync(path.join(REPO_ROOT, 'refs', 'rapid_storybook_dev_mcp.js'));

        // Check docker availability and Playwright image (best-effort)
        try {
            execSync('docker info', { stdio: 'ignore', timeout: 5000 });
            res.checks.docker = true;
            const image = process.env.PLAYWRIGHT_DOCKER_IMAGE || 'mcr.microsoft.com/playwright:v1.57.0-jammy';
            try {
                execSync(`docker image inspect ${image}`, { stdio: 'ignore', timeout: 8000 });
                res.checks.playwright_image = true;
                res.checks.playwright_image_name = image;
            } catch (e) {
                res.checks.playwright_image = false;
                res.checks.playwright_image_error = e.message;
            }
        } catch (e) {
            res.checks.docker = false;
            res.checks.docker_error = e.message;
        }

        // Check for setup tool availability via mcp tools listing (best-effort)
        // This is a lightweight check: presence of refs file implies tooling available
        res.ok = true;
    } catch (e) {
        res.ok = false;
        res.error = e.message;
    }
    return res;
};

// Build Storybook static output in ui/storybook-static
export const buildStorybookStatic = async ({ configDir = 'ui/.storybook', outDir = 'ui/storybook-static' } = {}) => {
    try {
        const cmd = `node ./node_modules/storybook/dist/bin/core.js build --config-dir ${configDir} -o ${outDir}`;
        execSync(cmd, { cwd: REPO_ROOT, stdio: 'inherit', timeout: 5 * 60 * 1000 });
        // verify index.json
        const idx = path.join(REPO_ROOT, outDir, 'index.json');
        if (!fs.existsSync(idx)) return { ok: false, error: 'index.json not found after build' };
        const json = JSON.parse(fs.readFileSync(idx, 'utf8'));
        return { ok: true, outDir, index: json };
    } catch (e) {
        return { ok: false, error: e.message };
    }
};

// Verify built storybook contains a component id
export const checkBuiltStorybook = async ({ outDir = 'ui/storybook-static', componentId } = {}) => {
    try {
        const idx = path.join(REPO_ROOT, outDir, 'index.json');
        if (!fs.existsSync(idx)) return { ok: false, error: 'index.json missing' };
        const json = JSON.parse(fs.readFileSync(idx, 'utf8')) || {};
        const entries = json.entries || {};
        if (componentId) {
            const found = Object.keys(entries).some(k => k === componentId || k.startsWith(componentId));
            return { ok: found, componentId, total: Object.keys(entries).length };
        }
        return { ok: true, total: Object.keys(entries).length };
    } catch (e) { return { ok: false, error: e.message }; }
};
