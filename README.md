# Cartoon-style fleet render

GitHub Actions package that renders a charsys "3D Cartoon Shorts" film on the fleet:
the film is split into 20 frame-range chunks rendered in parallel on 20 runners
(headless Chromium + SwiftShader WebGL running the engine in `work/cartoon`), then
concatenated and muxed with the film's voice wav.

Current film: `work/cartoon/examples/backrooms_shaded_one_take` (974 frames, 1080x1920, 30 fps, 32.48 s).

## Layout
- `work/cartoon/` — the engine copy (charsys) + example films, from the approved production backup.
- `scripts/harness.html` — page that inits the film (`initFilm`) and renders frame ranges.
- `scripts/render-chunk.mjs` — serves `work/`, drives Chromium, saves PNG frames, encodes a chunk mp4.
- `.github/workflows/cartoon-fleet.yml` — 20-chunk matrix + assemble. Manual trigger only.

## Local proof
```
npm ci
npx playwright install chromium   # or set CHROME_PATH to an existing Chrome/Chromium
node scripts/render-chunk.mjs 0 29 proof/chunk-proof.mp4
```
