#!/usr/bin/env node
import { startDevelopmentSession } from './ops.js';
import fs from 'fs';

const argv = process.argv.slice(2);
const opts = { skipDocker: false, runPlaywright: false };
for (const a of argv) {
  if (a === '--skipDocker') opts.skipDocker = true;
  if (a === '--runPlaywright') opts.runPlaywright = true;
}

(async () => {
  try {
    const res = await startDevelopmentSession(opts);
    // Write services to .task-context/services.json for visibility
    try {
      const p = '.task-context';
      fs.mkdirSync(p, { recursive: true });
      fs.writeFileSync(p + '/services.json', JSON.stringify(res, null, 2));
    } catch (e) { /* ignore */ }
    console.log(JSON.stringify(res, null, 2));
    process.exit(0);
  } catch (e) {
    console.error('Worker failed:', e && e.message ? e.message : e);
    process.exit(2);
  }
})();