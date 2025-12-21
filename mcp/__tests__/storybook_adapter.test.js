import { listComponents, getComponentDocumentation, listTools } from '../tools/storybook_adapter.js';
import http from 'http';

// Simple test server that serves a minimal index.json and iframe
const INDEX = JSON.stringify({ v: 5, entries: { 'board-blackholeboard--default': { id: 'board-blackholeboard--default', title: 'Board/BlackholeBoard', name: 'Default', importPath: './components/BlackholeBoard/BlackholeBoard.stories.tsx', type: 'story', tags: ['autodocs'] }, 'board-blackholeboard--docs': { id: 'board-blackholeboard--docs', title: 'Board/BlackholeBoard', name: 'Docs', type: 'docs', tags: ['autodocs'] } } });

let server;

beforeAll(done => {
  server = http.createServer((req, res) => {
    if (req.url === '/index.json') {
      res.writeHead(200, {'Content-Type': 'application/json'}); res.end(INDEX); return;
    }
    if (req.url && req.url.startsWith('/iframe.html')) {
      res.writeHead(200, {'Content-Type': 'text/html'}); res.end('<html><body><h1>Event Horizon</h1></body></html>'); return;
    }
    if (req.url === '/mcp' && req.method === 'POST') {
      let body=''; req.on('data',c=>body+=c); req.on('end', ()=>{ res.writeHead(200, {'Content-Type':'application/json'}); res.end(JSON.stringify({ jsonrpc:'2.0', id:1, result: { tools: ['tools/list','tools/call'] } })); }); return;
    }
    res.writeHead(404); res.end('not found');
  }).listen(0, () => { const port = server.address().port; process.env.TEST_BASE = `http://localhost:${port}`; done(); });
});

afterAll(() => new Promise(resolve => server.close(resolve)));

test('listComponents returns components', async () => {
  const base = process.env.TEST_BASE;
  const res = await listComponents(base);
  expect(res.components).toBeDefined();
  expect(res.components.length).toBeGreaterThan(0);
  expect(res.components[0].title).toMatch(/Board/);
});

test('getComponentDocumentation returns docs/html', async () => {
  const base = process.env.TEST_BASE;
  const res = await getComponentDocumentation('board-blackholeboard', base);
  expect(res.html).toBeDefined();
  expect(res.html).toMatch(/Event Horizon/);
});

test('listTools returns JSON', async () => {
  const base = process.env.TEST_BASE;
  const res = await listTools(base);
  expect(res).toHaveProperty('jsonrpc');
});
