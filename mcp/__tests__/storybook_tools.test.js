import http from 'http';
import { getUiBuildingInstructions } from '../tools/get-ui-building-instructions.js';
import { getStoryUrls } from '../tools/get-story-urls.js';
import { listAllComponents } from '../tools/list-all-components.js';
import { getComponentDocumentation } from '../tools/get-component-documentation.js';

// Reuse the same minimal index and iframe server from adapter tests
const INDEX = JSON.stringify({ v: 5, entries: { 'molecules-button--primary': { id: 'molecules-button--primary', title: 'Molecules/Button', name: 'Primary', importPath: './components/Button/Button.stories.tsx', type: 'story', tags: ['autodocs'] }, 'board-blackholeboard--docs': { id: 'board-blackholeboard--docs', title: 'Board/BlackholeBoard', name: 'Docs', type: 'docs', tags: ['autodocs'] } } });
let server;

beforeAll(done => {
  server = http.createServer((req, res) => {
    if (req.url === '/index.json') {
      res.writeHead(200, {'Content-Type': 'application/json'}); res.end(INDEX); return;
    }
    if (req.url && req.url.startsWith('/iframe.html')) {
      res.writeHead(200, {'Content-Type': 'text/html'}); res.end('<html><body><h1>Event Horizon Docs</h1></body></html>'); return;
    }
    if (req.url === '/mcp' && req.method === 'POST') {
      let body=''; req.on('data',c=>body+=c); req.on('end', ()=>{ res.writeHead(200, {'Content-Type':'application/json'}); res.end(JSON.stringify({ jsonrpc:'2.0', id:1, result: { tools: ['get_ui_building_instructions','get_story_urls','list-all-components','get-component-documentation'] } })); }); return;
    }
    res.writeHead(404); res.end('not found');
  }).listen(0, () => { const port = server.address().port; process.env.TEST_BASE = `http://localhost:${port}`; done(); });
});

afterAll(() => new Promise(resolve => server.close(resolve)));

test('getUiBuildingInstructions returns guidelines', async () => {
  const res = await getUiBuildingInstructions();
  expect(res.content[0].text).toMatch(/Component Story Format/);
});

test('getStoryUrls finds story by importPath+exportName', async () => {
  const res = await getStoryUrls({ absoluteStoryPath: './components/Button/Button.stories.tsx', exportName: 'Primary', baseUrl: process.env.TEST_BASE });
  expect(res.urls && res.urls.length).toBeGreaterThan(0);
  expect(res.urls[0].iframeUrl).toMatch(/iframe.html\?id=/);
});

test('list-all-components returns components list', async () => {
  const res = await listAllComponents({ baseUrl: process.env.TEST_BASE });
  expect(res.content[0].text).toMatch(/Molecules\/Button/);
});

test('get-component-documentation returns docs html', async () => {
  const res = await getComponentDocumentation({ componentId: 'board-blackholeboard', baseUrl: process.env.TEST_BASE });
  expect(res.content[0].text).toMatch(/Event Horizon Docs/);
});
