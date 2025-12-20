#!/usr/bin/env node
import { startDevelopmentSession } from '../mcp/tools/ops.js';

(async () => {
  console.log('Starting development session (docker, storybook, app, playwright) — best-effort.');
  try {
    const res = await startDevelopmentSession();
    console.log(JSON.stringify(res, null, 2));
    if (!res.ok) process.exit(1);
    process.exit(0);
  } catch (e) {
    console.error('Failed to start development session:', e);
    process.exit(2);
  }
})();
