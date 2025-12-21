import * as Ops from './ops.js';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const REPO_ROOT = path.resolve(new URL('.', import.meta.url).pathname, '..', '..');

// Diagnose preview issues by building static Storybook and checking index.json
export const diagnoseStorybookPreview = async ({ port = 6006 } = {}) => {
  try {
    const build = await Ops.buildStorybookStatic();
    const check = await Ops.checkBuiltStorybook({ outDir: build.outDir });
    return { ok: true, build, check };
  } catch (e) { return { ok: false, error: e.message }; }
};

export const fixStorybookPreview = async ({ tryRemoveAddons = true } = {}) => {
  try {
    // Best-effort: reinstall UI deps and rebuild storybook
    try { execSync('npm --workspace=ui ci', { stdio: 'inherit', cwd: REPO_ROOT }); } catch(e) {}
    const build = await Ops.buildStorybookStatic();
    return { ok: true, build };
  } catch (e) { return { ok: false, error: e.message }; }
};

export const startStorybook = async ({ port = 6006, ci = false, detached = true } = {}) => {
  try {
    const cmd = ci ? 'npm --workspace=ui run storybook:ci' : 'npm --workspace=ui run storybook';
    const svc = await Ops.startServiceWithHealth({ command: cmd, port, name: 'storybook', timeout: 30000 });
    return svc;
  } catch (e) { return { ok: false, error: e.message }; }
};

export const stopStorybook = async ({ port = 6006 } = {}) => {
  try {
    const killed = Ops && Ops.killPort ? Ops.killPort(port) : false;
    return { ok: !!killed };
  } catch (e) { return { ok: false, error: e.message }; }
};

export const checkStorybookStatus = async ({ port = 6006 } = {}) => {
  try {
    const services = await Ops.checkServices({ ports: [port] });
    return { ok: true, services };
  } catch (e) { return { ok: false, error: e.message }; }
};

export const runPlaywrightDocker = async ({ testsPath = 'ui/e2e/tests', project = 'chromium', updateSnapshots = false, storybookUrl } = {}) => {
  try {
    // If STORYBOOK_URL is provided, set env before running
    if (storybookUrl) process.env.STORYBOOK_URL = storybookUrl;
    const res = await Ops.runPlaywrightInDocker({ testsPath, project, updateSnapshots });
    return res;
  } catch (e) { return { ok: false, error: e.message }; }
};

export const generateBaselines = async ({ project = 'chromium' } = {}) => {
  try {
    // Run update snapshots via Playwright (docker preferred)
    const res = await runPlaywrightDocker({ testsPath: 'ui/e2e/tests', project, updateSnapshots: true });
    return res;
  } catch (e) { return { ok: false, error: e.message }; }
};

export const commitBaselines = async ({ message = 'chore: update visual regression baselines' } = {}) => {
  try {
    const baselinesDir = path.join(REPO_ROOT, 'ui', 'e2e', 'baselines');
    if (!fs.existsSync(baselinesDir)) return { ok: false, error: 'baselines dir missing' };
    try { execSync(`git add ${baselinesDir}`, { cwd: REPO_ROOT }); } catch(e) {}
    try { execSync(`git commit -m "${message}" || true`, { cwd: REPO_ROOT }); } catch(e) {}
    try { execSync('git rev-parse --short HEAD', { cwd: REPO_ROOT }); } catch(e) {}
    return { ok: true };
  } catch (e) { return { ok: false, error: e.message }; }
};

export const analyzeTestResults = async ({ format = 'summary' } = {}) => {
  try {
    const r = { format };
    // Best-effort: read Playwright JSON results if present
    const p = path.join(REPO_ROOT, 'test-results', 'results.json');
    if (fs.existsSync(p)) {
      r.results = JSON.parse(fs.readFileSync(p, 'utf8'));
      r.count = Array.isArray(r.results) ? r.results.length : Object.keys(r.results).length;
    } else r.note = 'no results.json found';
    return { ok: true, report: r };
  } catch (e) { return { ok: false, error: e.message }; }
};

export default { diagnoseStorybookPreview, fixStorybookPreview, startStorybook, stopStorybook, checkStorybookStatus, runPlaywrightDocker, generateBaselines, commitBaselines, analyzeTestResults };
