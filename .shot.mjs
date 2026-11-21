import { chromium } from '@playwright/test';
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { join, extname } from 'node:path';
const root = process.argv[2], out = process.argv[3];
const types = { '.html':'text/html','.css':'text/css','.js':'text/javascript','.webp':'image/webp','.woff2':'font/woff2','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg' };
const srv = createServer(async (req, res) => {
  let p = join(root, decodeURIComponent(req.url.split('?')[0]));
  try { if ((await stat(p)).isDirectory()) p = join(p, 'index.html'); } catch { p += '.html'; }
  try { res.writeHead(200, { 'content-type': types[extname(p)] || 'application/octet-stream' }); res.end(await readFile(p)); }
  catch { res.writeHead(404); res.end(); }
}).listen(4399);
const b = await chromium.launch();
const pg = await b.newPage({ viewport: { width: 1280, height: 900 } });
await pg.goto('http://localhost:4399/about'); await pg.screenshot({ path: `${out}/about.png` });
await pg.goto('http://localhost:4399/'); await pg.screenshot({ path: `${out}/home.png` });
await pg.setViewportSize({ width: 390, height: 844 });
await pg.goto('http://localhost:4399/about'); await pg.screenshot({ path: `${out}/about-mobile.png` });
await b.close(); srv.close();
