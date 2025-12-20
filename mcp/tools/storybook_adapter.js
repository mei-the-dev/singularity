import http from 'http';
import https from 'https';
import { URL } from 'url';

function fetchUrl(url, opts = {}) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const client = u.protocol === 'https:' ? https : http;
    const req = client.request(u, { method: opts.method || 'GET', headers: opts.headers || {} }, (res) => {
      let body = '';
      res.setEncoding('utf8');
      res.on('data', (c) => body += c);
      res.on('end', () => resolve({ statusCode: res.statusCode, headers: res.headers, body }));
    });
    req.on('error', reject);
    if (opts.body) req.write(opts.body);
    req.end();
  });
}

// Normalize index.json entries into a component list
export const fetchIndexJson = async (baseUrl = 'http://localhost:6006') => {
  try {
    const res = await fetchUrl(new URL('/index.json', baseUrl).toString());
    if (res.statusCode !== 200) throw new Error('index.json unreachable: ' + res.statusCode);
    const parsed = JSON.parse(res.body);
    const entries = parsed.entries || {};
    // Group by component (title)
    const components = {};
    for (const [k, v] of Object.entries(entries)) {
      const compId = v.title ? v.title.toLowerCase().replace(/[^a-z0-9\-]/g, '-') : v.importPath || k;
      if (!components[compId]) components[compId] = { id: compId, title: v.title || compId, stories: [] };
      components[compId].stories.push({ id: v.id || k, name: v.name || '', type: v.type, importPath: v.importPath, tags: v.tags });
    }
    return Object.values(components);
  } catch (e) {
    return { error: e.message };
  }
};

export const listComponents = async (baseUrl = 'http://localhost:6006') => {
  const res = await fetchIndexJson(baseUrl);
  if (res && res.error) return { error: res.error };
  return { components: res };
};

export const getComponentDocumentation = async (componentIdOrName, baseUrl = 'http://localhost:6006') => {
  // Try index.json first
  try {
    const res = await fetchUrl(new URL('/index.json', baseUrl).toString());
    if (res.statusCode !== 200) throw new Error('index.json unreachable');
    const parsed = JSON.parse(res.body);
    const entries = parsed.entries || {};
    // Find by title or prefix match
    const matches = Object.values(entries).filter(e => (e.title || '').toLowerCase().includes(String(componentIdOrName).toLowerCase()) || (e.id || '').startsWith(String(componentIdOrName)));
    if (matches.length === 0) return { error: 'No component found' };
    // Prefer docs entry
    const docEntry = matches.find(m => m.type === 'docs') || matches[0];
    // Attempt to fetch iframe docs HTML for this component (if docs story exists)
    try {
      const storyId = docEntry.id;
      const html = await fetchUrl(new URL(`/iframe.html?id=${encodeURIComponent(storyId)}`, baseUrl).toString());
      return { markdown: docEntry.docs || null, html: html.body.slice(0, 10000) };
    } catch (e) {
      return { markdown: docEntry.docs || null, info: 'docs iframe fetch failed: ' + e.message };
    }
  } catch (e) {
    return { error: e.message };
  }
};

// Try to make an MCP tools/list call via JSON-RPC POST; fallback to simple check
export const listTools = async (baseUrl = 'http://localhost:6006') => {
  try {
    const payload = JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'tools/list', params: {} });
    const res = await fetchUrl(new URL('/mcp', baseUrl).toString(), { method: 'POST', body: payload, headers: { 'Content-Type': 'application/json' } });
    if (res.statusCode === 200) {
      // Some MCP endpoints stream SSE; try parse as JSON fallback
      try { return JSON.parse(res.body); } catch (e) { return { info: 'Non-JSON response', raw: res.body.slice(0, 500) }; }
    }
    return { error: 'tools/list returned status ' + res.statusCode };
  } catch (e) { return { error: e.message }; }
};

// Simple CLI helper
if (process.argv[1] && process.argv[1].endsWith('storybook_adapter.js') && require.main === module) {
  (async () => {
    const base = process.env.STORYBOOK_URL || 'http://localhost:6006';
    console.log('Fetching components from', base);
    const comps = await listComponents(base);
    console.log(JSON.stringify(comps, null, 2));
    process.exit(0);
  })();
}
