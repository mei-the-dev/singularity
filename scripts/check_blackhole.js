const { chromium } = require('playwright');
(async () => {
  try {
    console.log('starting check');
    const b = await chromium.launch();
    const p = await b.newPage();
    await p.goto('http://localhost:6006/iframe.html?id=environment-blackholebackground--idle', { waitUntil: 'networkidle' });
    await p.waitForTimeout(500);
    const handle = await p.$('[data-testid="blackhole-bg"]');
    if (!handle) {
      console.log('no handle');
      await b.close();
      return;
    }
    const outer = await p.evaluate(el => el.outerHTML.slice(0,300), handle);
    const rects = await p.evaluate(el => el.getClientRects().length, handle);
    const display = await p.evaluate(el => window.getComputedStyle(el).display, handle);
    const visibility = await p.evaluate(el => window.getComputedStyle(el).visibility, handle);
    const opacity = await p.evaluate(el => window.getComputedStyle(el).opacity, handle);
    console.log('outer:', outer);
    console.log('rects:', rects, 'display:', display, 'visibility:', visibility, 'opacity:', opacity);
    await b.close();
  } catch (err) {
    console.error('error', err.message);
  }
})();