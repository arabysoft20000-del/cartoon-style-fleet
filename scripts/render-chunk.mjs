// Cartoon fleet chunk renderer: renders frames [start..end] of the film to PNGs in a headless
// Chromium (SwiftShader WebGL), then encodes a chunk mp4 with ffmpeg.
// Usage: node scripts/render-chunk.mjs <start> <end> <out.mp4> [framesDir]
// Env: CHROME_PATH (optional; default = Playwright's bundled Chromium), FILM_BASE, FILM_FILE, FPS, W, H.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..');           // fleet package root (contains work/, scripts/)
const [startS, endS, outMp4, framesDirArg] = process.argv.slice(2);
const START = +startS, END = +endS;
const FPS = +(process.env.FPS || 30), W = +(process.env.W || 1080), H = +(process.env.H || 1920);
const FRAMES = framesDirArg ? path.resolve(framesDirArg) : path.join(ROOT, 'frames', `chunk-${START}-${END}`);
if (!Number.isFinite(START) || !Number.isFinite(END) || !outMp4) { console.error('usage: render-chunk.mjs <start> <end> <out.mp4> [framesDir]'); process.exit(2); }
fs.mkdirSync(FRAMES, { recursive: true });
fs.mkdirSync(path.dirname(path.resolve(outMp4)), { recursive: true });

const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.wav': 'audio/wav', '.mp3': 'audio/mpeg', '.glb': 'model/gltf-binary', '.css': 'text/css', '.woff2': 'font/woff2', '.woff': 'font/woff', '.ttf': 'font/ttf', '.svg': 'image/svg+xml' };
const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://x');
  if (req.method === 'POST' && url.pathname.startsWith('/frames/')) {
    const name = path.basename(url.pathname);
    const ws = fs.createWriteStream(path.join(FRAMES, name));
    req.pipe(ws); ws.on('finish', () => { res.writeHead(200); res.end('ok'); });
    ws.on('error', () => { res.writeHead(500); res.end('err'); });
    return;
  }
  let p = decodeURIComponent(url.pathname);
  if (p === '/') p = '/scripts/harness.html';
  const file = path.join(ROOT, p);
  if (!file.startsWith(ROOT) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) { res.writeHead(404); res.end('not found'); return; }
  res.writeHead(200, { 'Content-Type': MIME[path.extname(file).toLowerCase()] || 'application/octet-stream' });
  fs.createReadStream(file).pipe(res);
});
await new Promise(r => server.listen(0, '127.0.0.1', r));
const PORT = server.address().port;
console.log(`server on 127.0.0.1:${PORT}, frames -> ${FRAMES}`);

let chromium;
try { ({ chromium } = await import('playwright')); } catch { ({ chromium } = await import('playwright-core')); }
const launchOpts = { headless: true, args: ['--enable-unsafe-swiftshader', '--use-angle=swiftshader', '--no-sandbox', '--disable-dev-shm-usage', '--hide-scrollbars', '--mute-audio'] };
if (process.env.CHROME_PATH) launchOpts.executablePath = process.env.CHROME_PATH;
const browser = await chromium.launch(launchOpts);
try {
  const page = await browser.newPage({ viewport: { width: 540, height: 960 } });
  page.on('console', m => { const t = m.text(); if (t.startsWith('PROGRESS') || t.startsWith('[film]')) console.log('[page]', t.slice(0, 160)); });
  page.on('pageerror', e => console.log('[pageerror]', String(e).slice(0, 300)));
  const base = process.env.FILM_BASE || '/work/cartoon/examples/backrooms_shaded_one_take/';
  const film = process.env.FILM_FILE || 'film.json';
  await page.goto(`http://127.0.0.1:${PORT}/scripts/harness.html?base=${encodeURIComponent(base)}&film=${encodeURIComponent(film)}&w=${W}&h=${H}`, { waitUntil: 'load', timeout: 180000 });
  const ready = await page.evaluate(() => window.ready);
  console.log('INIT OK', JSON.stringify(ready));
  const t0 = Date.now();
  const r = await page.evaluate(([s, e, f]) => window.renderRange(s, e, f), [START, END, FPS]);
  const wall = Date.now() - t0;
  console.log(`RENDERED ${r.frames} frames engine_ms=${r.engineMs} page_wall_ms=${r.wallMs} total_wall_ms=${wall} avg_engine_ms=${(r.engineMs / r.frames).toFixed(1)}`);
  const errs = await page.evaluate(() => window.errors);
  if (errs.length) console.log('PAGE ERRORS:', JSON.stringify(errs.slice(0, 10)));
} finally { await browser.close().catch(() => {}); server.close(); }

// encode chunk mp4
const ff = spawn('ffmpeg', ['-y', '-framerate', String(FPS), '-start_number', String(START), '-i', path.join(FRAMES, '%d.jpg'), '-frames:v', String(END - START + 1), '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '16', '-preset', 'medium', '-r', String(FPS), path.resolve(outMp4)], { stdio: 'inherit' });
await new Promise((res, rej) => ff.on('exit', c => c === 0 ? res() : rej(new Error('ffmpeg exit ' + c))));
console.log('CHUNK MP4 DONE:', outMp4, fs.statSync(path.resolve(outMp4)).size, 'bytes');
