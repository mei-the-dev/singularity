const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage();
  await p.goto('http://localhost:6006/?path=/story/board-blackholeboard--default', { waitUntil: 'networkidle' });
  await p.waitForTimeout(2000);
  const frames = await p.$$eval('iframe', iframes => iframes.map(f => ({ name: f.getAttribute('name'), id: f.getAttribute('id'), src: f.getAttribute('src') })));
  console.log('iframes:', frames);
  for (const f of frames) {
    if (f.name) {
      try {
        const frame = await p.frame({ name: f.name });
        const text = await frame.locator('body').innerText();
        console.log(`frame ${f.name} text len:`, text.length);
        console.log(`frame ${f.name} snippet:`, text.slice(0,200));
      } catch (e) {
        console.log('error reading frame', f.name, e.message);
      }
    }
  }
  await b.close();
})();
