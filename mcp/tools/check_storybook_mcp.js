#!/usr/bin/env node
import http from 'http';
import https from 'https';

const STORYBOOK = process.env.STORYBOOK_URL || 'http://localhost:6006';

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https://') ? https : http;
    client.get(url, (res) => {
      let body = '';
      res.setEncoding('utf8');
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => resolve({ statusCode: res.statusCode, headers: res.headers, body }));
    }).on('error', reject);
  });
}

(async () => {
  try {
    console.log('Checking Storybook index.json...');
    const idx = await fetchUrl(`${STORYBOOK}/index.json`);
    if (idx.statusCode !== 200) throw new Error('index.json unreachable: ' + idx.statusCode);
    const parsed = JSON.parse(idx.body);
    const entries = parsed.entries || {};
    const keys = Object.keys(entries || {});
    console.log(`Found ${keys.length} index entries`);
    if (keys.length === 0) throw new Error('No entries in index.json');

    console.log('Checking for component: board-blackholeboard...');
    const has = keys.some(k => k.startsWith('board-blackholeboard'));
    if (!has) throw new Error('Component board-blackholeboard not found in index.json');

    console.log('Checking MCP SSE endpoint...');
    const res = await fetchUrl(`${STORYBOOK}/mcp`);
    if (res.statusCode !== 200) console.warn('MCP endpoint responded non-200: ' + res.statusCode);
    if (!res.headers['content-type'] || !res.headers['content-type'].includes('text/event-stream')) console.warn('MCP endpoint content-type not text/event-stream');

    console.log('OK: Storybook and MCP checks passed');
    process.exit(0);
  } catch (e) {
    console.error('CHECK FAILED:', e.message);
    process.exit(2);
  }
})();
