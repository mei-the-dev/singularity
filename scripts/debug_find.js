const { chromium } = require('playwright');
(async ()=>{
  const b = await chromium.launch();
  const p = await b.newPage();
  await p.goto('http://localhost:6006/iframe.html?id=eventhorizon-newissuebutton--default', { waitUntil: 'networkidle' });
  const handle = await p.$('.nih-button');
  console.log('has handle?', !!handle);
  if (handle) {
    const outer = await p.evaluate(el => el.outerHTML, handle);
    console.log('outerHTML:', outer);
  }
  await b.close();
})();
