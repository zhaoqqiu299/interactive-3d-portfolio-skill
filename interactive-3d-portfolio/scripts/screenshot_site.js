// Screenshot a local portfolio site at desktop and phone widths, with WebGL running in software.
// Usage: node screenshot_site.js <site_dir> <out_dir> [section ids...]
//   section ids are the data-go values of menu buttons, e.g. about projects toolkit contact
// Env: THREE_DIR=/path/to/node_modules/three serves the CDN copy of three@x locally (for sandboxes without network).
//      READY_FLAG=__studioReady waits for window[READY_FLAG] before shooting (default: 6 s pause).
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const [siteDir, outDir, ...sections] = process.argv.slice(2);
if (!siteDir || !outDir) { console.error('usage: node screenshot_site.js <site_dir> <out_dir> [section ids...]'); process.exit(1); }
fs.mkdirSync(outDir, { recursive: true });
const types = { '.html': 'text/html', '.js': 'application/javascript', '.json': 'application/json', '.jpg': 'image/jpeg', '.png': 'image/png', '.mp4': 'video/mp4', '.css': 'text/css', '.svg': 'image/svg+xml' };

(async () => {
  // swiftshader renders WebGL without a GPU; it is slow, so timeouts are generous
  const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  for (const [label, viewport] of [['desktop', { width: 1440, height: 900 }], ['phone', { width: 400, height: 860 }]]) {
    const page = await browser.newPage({ viewport });
    page.on('pageerror', e => console.log(`[${label}] page error:`, e.message));
    page.on('console', m => { if (m.type() === 'error') console.log(`[${label}] console:`, m.text().slice(0, 200)); });
    if (process.env.THREE_DIR) {
      await page.route(/cdn\.jsdelivr\.net\/npm\/three@[^/]+\//, r => {
        const rel = r.request().url().replace(/.*three@[^/]+\//, '');
        r.fulfill({ path: path.join(process.env.THREE_DIR, rel), contentType: 'application/javascript' });
      });
    }
    await page.route('http://site.local/**', r => {
      let p = decodeURIComponent(new URL(r.request().url()).pathname); if (p.endsWith('/')) p += 'index.html';
      const file = path.join(siteDir, p);
      if (!fs.existsSync(file)) return r.fulfill({ status: 404, body: 'missing: ' + p });
      r.fulfill({ path: file, contentType: types[path.extname(file)] || 'application/octet-stream' });
    });
    await page.goto('http://site.local/');
    if (process.env.READY_FLAG) await page.waitForFunction(f => window[f], process.env.READY_FLAG, { timeout: 180000 });
    else await page.waitForTimeout(6000);
    await page.screenshot({ path: path.join(outDir, `${label}-home.png`), timeout: 180000 });
    for (const id of sections) {
      const ok = await page.evaluate(i => { const b = document.querySelector(`[data-go="${i}"]`); if (b) b.click(); return !!b; }, id);
      if (!ok) { console.log(`[${label}] no menu button for "${id}"`); continue; }
      await page.waitForTimeout(4500);
      await page.screenshot({ path: path.join(outDir, `${label}-${id}.png`), timeout: 180000 });
      await page.keyboard.press('Escape'); await page.waitForTimeout(1500);
    }
    await page.close();
  }
  await browser.close();
  console.log('screenshots in', outDir);
})();
