// vermeer_forger_v2 set.js (ENVIRONMENT PASS, Blender build): the studio modelled in Blender
// (films/vermeer_forger_v2/blender/build_studio_v2.py -> assets/set/studio.glb), loaded live with
// the kit ground/marks as the base. Layout per ENV_CONTRACT.md. Depth strategy: ALIGNED lamp row
// (x=0) as the vanishing line, light pools with falloff along the depth (rig points at lamps),
// darker far wall, modelled layers (posts/arch/shelves/screen) between faces and far wall.
// Handedness: cameras look down -Z from +Z, so +X = frame RIGHT (table left x-2.6, easel right x2.2).
import { createLightRig } from '../../world/look/lights.js';
import { createPost } from '../../world/look/post.js';
import { createRigShade } from '../../world/look/rigshade.js';
import { readGlb } from '../../world/look/glb.js';
import { createKit } from '../../world/look/rigkit.js';
import { basic, flat, part } from '../../engine/props/_kit.js';
import { vermeerTex } from './props/painting.js';

const DESC = { name: 'studio', sky: 'indoor', sun: { dir: [-0.5, 0.75, 0.45] },
  ground: [{ kind: 'boards', color: '#a87f55', x: [-8, 8], z: [-16, 60], tile: 2.6 }, { color: '#8a6a48', y: -0.01 }],
  stripes: [{ at: [-2.6, 1.2], size: [7.5, 5.2], color: '#7a3a34', tex: 'cloth' }],
  marks: { table_c: [-2.6, 1.2], han_home: [-1.8, 2.4], inv_home: [-3.6, 0.0], easel: [3.6, -1.2],
    counter: [5.2, -3.6], door: [-6.4, -15.3], window: [0.6, -15.3], center: [0, 1.0], enter_l: [-7, 3], enter_r: [7, 3] },
  points: { tableH: 1.15, counterH: 1.25, seatY: 0.55, wallZ: -16 },
  bounds: { x: [-8.5, 8.5], z: [-16, 8] }, boxes: [] };

// One place: pools of light along the depth. Colours LINEAR (lights.js). Ambient lowered so the
// far end falls dark; lamp points with strong falloff alternate bright pools with dark stretches.
// Post/shading read this via rig.at/sample in later passes.
// env fix round 1 (critic env1 fault 3: no visible pools, even brown light): ambient cut hard
// (sky .44->.30, ground .21->.13) so gaps between lamps go dark; lamp points raised near source
// with faster falloff + shorter range (local pools, bright disc under each lamp); desk lamp
// doubled with tight falloff (table pool in f1100); corridor raised (bright far accent, fault 1);
// cool 'bounce' replaced by the floor-lamp practical (6.6,-3.2) so every lit fixture casts.
// Still 8 lights (MAX_LIGHTS); lamps 2/4 (z -1.5/-9.5) remain unlit fixtures between pools.
const PLACES = { studio: { sky: [0.30, 0.26, 0.19], ground: [0.13, 0.10, 0.07], fog: { color: '#b8a888', density: 0.0045 },
  ao: { floor: 0, h: 1.6, amt: 0.45 },
  lights: [
    { id: 'sun', kind: 'sun', dir: [-0.5, 0.75, 0.45], color: [1.0, 0.92, 0.78], power: 0.5, wrap: 0.25 },
    { id: 'window', kind: 'spot', pos: [0.6, 4.2, -15.5], dir: [-0.1, -0.35, 0.9], cone: [40, 75], color: [1.0, 0.9, 0.72], power: 2.6, fall: 0.045, range: 30, wrap: 0.2 },
    { id: 'lampA', kind: 'point', pos: [0, 5.2, 2.5], color: [1.0, 0.85, 0.55], power: 5.4, fall: 0.3, range: 8, wrap: 0.3 },
    { id: 'lampB', kind: 'point', pos: [0, 5.2, -5.5], color: [1.0, 0.85, 0.55], power: 4.9, fall: 0.3, range: 8, wrap: 0.3 },
    { id: 'lampC', kind: 'point', pos: [0, 5.2, -13.5], color: [1.0, 0.85, 0.55], power: 4.4, fall: 0.3, range: 8, wrap: 0.3 },
    { id: 'desk', kind: 'point', pos: [-3.6, 1.9, 1.2], color: [1.0, 0.85, 0.55], power: 4.5, fall: 0.42, range: 4.5, wrap: 0.4 },
    { id: 'corridor', kind: 'point', pos: [-6.4, 2.5, -21], color: [1.0, 0.85, 0.55], power: 2.0, fall: 0.12, range: 9, wrap: 0.4 },
    { id: 'floorlamp', kind: 'point', pos: [6.6, 2.9, -3.2], color: [1.0, 0.85, 0.55], power: 2.2, fall: 0.25, range: 6.5, wrap: 0.4 } ] } };

const EMIT = new Set(['bulb_warm', 'shade_warm', 'sky_pale', 'corridor_end', 'win_lit']);
const hexOf = c => '#' + c.map(v => Math.round(Math.min(1, v) * 255).toString(16).padStart(2, '0')).join('');

export function buildSet(THREE, scene, opts, kit) {
  const o = opts || {};
  const base = kit(DESC, o);
  const rig = createLightRig(THREE, PLACES, {});
  const look = o.post ? createPost(THREE, rig, o.post) : undefined;
  if (look && o.post.shade) look.shading = createRigShade(THREE, rig, o.post.shade);

  // code-drawn textures (textures-without-flow: no Flow -> draw in code, tiling, low contrast)
  const canvasTex = (size, draw) => { const c = document.createElement('canvas'); c.width = c.height = size; draw(c.getContext('2d'), size);
    const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.anisotropy = 8; t.colorSpace = THREE.NoColorSpace; return t; };
  const rng = sd => () => ((sd = (sd * 1664525 + 1013904223) >>> 0) / 4294967296);
  const blotches = (g, S, n, a, r0, r1, seed, cols) => { const R = rng(seed); for (let i = 0; i < n; i++) { g.globalAlpha = a * R(); g.fillStyle = cols[Math.floor(R() * cols.length)];
    const r = r0 + R() * (r1 - r0); g.beginPath(); g.ellipse(R() * S, R() * S, r, r * (.4 + R()), R() * 3, 0, 7); g.fill(); } g.globalAlpha = 1; };
  const plasterTex = canvasTex(512, (g, S) => { g.fillStyle = '#e8e2d4'; g.fillRect(0, 0, S, S);
    blotches(g, S, 1400, .04, 2, 20, 5, ['#cbbfa4', '#fff8ea', '#b8a888']); blotches(g, S, 26, .07, 18, 60, 9, ['#a89070', '#8a7454']);
    g.strokeStyle = 'rgba(90,74,52,.3)'; g.lineWidth = 2; for (let i = 0; i < 7; i++) { const x = (i * 173) % S; g.beginPath(); g.moveTo(x, 0); g.lineTo(x + 14, S * .4); g.lineTo(x - 6, S * .75); g.stroke(); } });
  const planksTex = canvasTex(512, (g, S) => { g.fillStyle = '#d8c8a8'; g.fillRect(0, 0, S, S); const R = rng(11);
    for (let p = 0; p < 5; p++) { const y = p * S / 5; g.fillStyle = `rgba(${120 + R() * 40 | 0},${90 + R() * 30 | 0},${50 + R() * 20 | 0},.25)`; g.fillRect(0, y, S, S / 5);
      g.fillStyle = 'rgba(40,26,12,.8)'; g.fillRect(0, y, S, 3);
      for (let i = 0; i < 26; i++) { g.globalAlpha = .10 + R() * .12; g.strokeStyle = '#6a4a28'; g.lineWidth = 1 + R() * 2; g.beginPath();
        const gy = y + R() * S / 5; g.moveTo(0, gy); g.bezierCurveTo(S * .3, gy + 4 * (R() - .5), S * .7, gy + 4 * (R() - .5), S, gy); g.stroke(); } g.globalAlpha = 1; } });
  const stoneTex = canvasTex(512, (g, S) => { g.fillStyle = '#dedbd2'; g.fillRect(0, 0, S, S); blotches(g, S, 2000, .08, 1, 10, 21, ['#b8b4a6', '#f4f2ea', '#98927f']); });
  // 6x6 decal sheet: cells 0-11 floor dirt, 12-17 wall stains/damp, 18-23 scuffs/wear (ENV_CONTRACT)
  const decalTex = canvasTex(768, (g, S) => { g.fillStyle = '#ffffff'; g.fillRect(0, 0, S, S); const C = S / 6, R = rng(31);
    for (let cell = 0; cell < 36; cell++) { const cx = (cell % 6) * C + C / 2, cy = Math.floor(cell / 6) * C + C / 2;
      const kind = cell < 12 ? 0 : cell < 18 ? 1 : 2;
      if (kind === 0) { for (let i = 0; i < 9; i++) { g.globalAlpha = .10 + R() * .16; g.fillStyle = '#5a4630'; g.beginPath();
        g.ellipse(cx + (R() - .5) * C * .5, cy + (R() - .5) * C * .5, 8 + R() * C * .3, 6 + R() * C * .24, R() * 3, 0, 7); g.fill(); } }
      else if (kind === 1) { for (let i = 0; i < 6; i++) { g.globalAlpha = .12 + R() * .18; g.fillStyle = '#4a3a28'; const x = cx + (R() - .5) * C * .6;
        g.fillRect(x, cy - C * .45, 2 + R() * 4, C * (.4 + R() * .5)); } }
      else { for (let i = 0; i < 12; i++) { g.globalAlpha = .10 + R() * .2; g.strokeStyle = '#3a2e20'; g.lineWidth = 1 + R() * 2; g.beginPath();
        const x = cx + (R() - .5) * C * .6, y = cy + (R() - .5) * C * .6; g.moveTo(x, y); g.lineTo(x + (R() - .5) * C * .5, y + (R() - .5) * C * .5); g.stroke(); } } }
    g.globalAlpha = 1; });
  decalTex.wrapS = decalTex.wrapT = THREE.ClampToEdgeWrapping;

  // canvas-back texture (env fix 1, fault 4): primed canvas back with stretcher shadow, wood
  // grain at edges, paint smears — trolley/stack backs read modelled, never blank slabs.
  const canvasBackTex = canvasTex(512, (g, S) => { g.fillStyle = '#e2d8c2'; g.fillRect(0, 0, S, S); const R = rng(47);
    blotches(g, S, 700, .05, 2, 14, 53, ['#cbbfa4', '#f2ead8', '#b8a888']);
    g.strokeStyle = 'rgba(110,82,48,.55)'; g.lineWidth = 26; g.strokeRect(20, 20, S - 40, S - 40);  // stretcher shadow
    g.strokeStyle = 'rgba(110,82,48,.4)'; g.lineWidth = 16; g.beginPath(); g.moveTo(S / 2, 24); g.lineTo(S / 2, S - 24); g.moveTo(24, S / 2); g.lineTo(S - 24, S / 2); g.stroke();  // cross bars
    for (let i = 0; i < 40; i++) { g.globalAlpha = .08 + R() * .12; g.strokeStyle = '#8a6a48'; g.lineWidth = 1 + R() * 2; g.beginPath();
      const y = R() * S; g.moveTo(0, y); g.bezierCurveTo(S * .3, y + 6 * (R() - .5), S * .7, y + 6 * (R() - .5), S, y); g.stroke(); } g.globalAlpha = 1;  // grain
    const smears = ['#2e4a8a', '#d9a83c', '#7a2e2e', '#4a6a4a'];
    for (let i = 0; i < 14; i++) { g.globalAlpha = .25 + R() * .3; g.fillStyle = smears[i % 4]; g.beginPath();
      g.ellipse(R() * S, R() * S, 6 + R() * 26, 4 + R() * 10, R() * 3, 0, 7); g.fill(); } g.globalAlpha = 1; });  // paint smears

  const rkit = createKit(THREE, rig, { shadow: base.uniforms || {}, group: base.group });

  // light-pool discs (env fix 2, critic env2 fault 3, f1100): the 8-light cap + 5.2 D lamp
  // height made real pools too subtle to read in a 600x800 still. Each LIT practical now also
  // lays a code-drawn radial-gradient disc on the surface under it (bright warm core, hard
  // falloff to transparent at ~2 D) — the READ is unmistakable in a still, point lights kept.
  const poolTex = canvasTex(256, (g, S) => { const gr = g.createRadialGradient(S/2, S/2, 0, S/2, S/2, S/2);
    gr.addColorStop(0, 'rgba(255,236,180,0.95)'); gr.addColorStop(0.35, 'rgba(255,214,130,0.75)');
    gr.addColorStop(0.65, 'rgba(255,190,100,0.32)'); gr.addColorStop(1, 'rgba(255,180,90,0)');
    g.fillStyle = gr; g.fillRect(0, 0, S, S); });
  poolTex.wrapS = poolTex.wrapT = THREE.ClampToEdgeWrapping;
  const poolMat = new THREE.MeshBasicMaterial({ map: poolTex, transparent: true, depthWrite: false });
  const pool = (x, y, z, size) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(size, size), poolMat);
    m.position.set(x, y, z); m.rotation.x = -Math.PI / 2; m.renderOrder = 2; m.frustumCulled = false; base.group.add(m); };
  pool(-3.6, 1.16, 1.2, 2.3);            // desk lamp pool on the table (f1100)
  pool(0, 0.03, 2.5, 4.6);               // hanging lamp A floor pool
  pool(0, 0.03, -5.5, 4.6);              // hanging lamp B floor pool
  pool(0, 0.03, -13.5, 4.6);             // hanging lamp C floor pool
  pool(6.6, 0.03, -3.2, 2.9);            // floor-lamp pool by the counter
  for (const z of [2.5, -5.5, -13.5]) pool(0, 5.02, z, 1.7);  // bright cone mouth under each lit shade
  // uv modes: 1 world xz, 2 world zy (side walls), 3 world xy (far wall), 0 mesh uv (furniture faces)
  const FINISH = {
    wall_plaster: { map: plasterTex, uv: 2, tile: [5, 5], grime: .35, bump: .05 },
    wall_far: { map: plasterTex, uv: 3, tile: [5, 5], grime: .55, bump: .05 },
    reveal: { map: plasterTex, uv: 3, tile: [2, 2], grime: .2 },
    ceiling_dark: { map: planksTex, uv: 1, tile: [4, 4], grime: .35 },
    floor_board: { map: planksTex, uv: 1, tile: [3, 3], grime: .3 },
    wood_dark: { map: planksTex, uv: 0, tile: [1.5, 1.5], grime: .3, gloss: 18, spec: .25 },
    wood_mid: { map: planksTex, uv: 0, tile: [1.5, 1.5], grime: .3, gloss: 14, spec: .2 },
    wood_light: { map: planksTex, uv: 0, tile: [1.5, 1.5], grime: .25, gloss: 14, spec: .2 },
    stone: { map: stoneTex, uv: 0, tile: [2, 2], grime: .25 },
    iron: { gloss: 40, spec: .5, grime: .3 }, brass: { gloss: 70, spec: 1.1, grime: .2 },
    gold_frame: { gloss: 55, spec: .8, grime: .2 },
    house_wall: { map: plasterTex, uv: 3, tile: [6, 6], grime: .3, emit: .45 }, roof_dark: { grime: .3, emit: .2 },
    house_far: { map: plasterTex, uv: 3, tile: [7, 7], grime: .2, emit: .7 },
    hill_dark: { grime: .15, emit: .18 }, spire_dark: { grime: .2, emit: .3 },
    tree_green: { grime: .15, emit: .25 }, canvas_cream: { grime: .25 }, paper: { grime: .12 },
    canvas_back: { map: canvasBackTex, uv: 0, tile: [1, 1], grime: .2 },
    drape_dark: { map: plasterTex, uv: 3, tile: [3, 3], grime: .4 }, rug_edge: { grime: .4 },
  };

  // compact previz fallback (film always renders while the GLB is missing): far wall + lamp cones
  const fallback = () => {
    const G = base.group;
    const add = (geo, mat, x, y, z) => { const m = part(geo, mat, .015); m.position.set(x, y, z); m.frustumCulled = false; G.add(m); return m; };
    add(new THREE.BoxGeometry(16, 8, .5), flat('#8a6f4d'), 0, 4, -16);
    add(new THREE.BoxGeometry(.5, 8, 24), flat('#b89a6e'), -8, 4, -4);
    add(new THREE.BoxGeometry(.5, 8, 24), flat('#b89a6e'), 8, 4, -4);
    add(new THREE.BoxGeometry(16.5, .5, 24), flat('#4a3a28'), 0, 8.25, -4);
    for (const z of [2.5, -1.5, -5.5, -9.5, -13.5]) {
      add(new THREE.CylinderGeometry(.03, .03, 2.5, 6), flat('#3a3a40'), 0, 6.7, z);
      add(new THREE.ConeGeometry(.5, .48, 14, 1, true), basic('#ffdf8a'), 0, 5.45, z);
      add(new THREE.SphereGeometry(.13, 12, 10), basic('#fff6d0'), 0, 5.21, z); }
  };

  // the Blender studio: geometry + material names; rigkit surfaces (lit by the rig: pools along
  // the depth), basic() for emitters. Decals where dirt gathers (seams, corners, under windows).
  const ready = (async () => {
    const glb = await readGlb(THREE, new URL('./assets/set/studio.glb', import.meta.url).href);
    if (!glb) { fallback(); return { glb: false }; }
    const mats = {};
    const G = new THREE.Group(); G.name = 'glb.studio'; base.group.add(G);
    for (const root of glb.roots) for (const p of root.prims) {
      const key = (p.material || root.name).split('.')[0];
      const hex = hexOf(p.color || [0.5, 0.5, 0.5]);
      const m = mats[key] || (mats[key] = EMIT.has(key) ? basic(hex) : rkit.surface('studio', hex, FINISH[key] || { grime: .3 }));
      const mesh = new THREE.Mesh(p.geometry, m);
      mesh.applyMatrix4(root.matrix); mesh.frustumCulled = false; G.add(mesh);
    }
    const D = [];
    const put = (cell, pos, normal, size, alpha = .95, spin = 0) => D.push({ cell, pos, normal, size: size * 1.3, alpha, spin });
    for (const x of [-4.2, 0.6, 4.4]) put(13, [x, 0.9, -15.7], [0, 0, 1], 1.6, .7, x);        // damp streaks under windows
    for (const x of [-6.5, -2.2, 1.8, 5.5]) put(12, [x, 0.45, -15.7], [0, 0, 1], 2.2, .75, x * 2); // stains at far-wall base
    put(20, [-6.4, 0.35, -15.7], [0, 0, 1], 1.8, .8, 1); put(20, [-6.4, 2.9, -15.7], [0, 0, 1], 1.4, .6, 3); // door scuffs
    for (const z of [-12, -7, -2, 3]) { put(14, [-7.7, 0.5, z], [1, 0, 0], 2.0, .7, z); put(14, [7.7, 0.5, z + 1], [-1, 0, 0], 2.0, .7, z + 1); }
    for (const z of [-10, -5, 0]) { put(15, [-7.7, 4.4, z], [1, 0, 0], 1.5, .55, z); put(15, [7.7, 4.2, z + 2], [-1, 0, 0], 1.5, .55, z + 2); }
    for (const [x, z] of [[-2.6, 1.2], [2.2, -2.6], [0, 1.0], [-4, -2], [5.2, -4.5], [1, -5]]) put(21, [x, 0.02, z], [0, 1, 0], 1.7, .65, x + z); // floor wear
    put(2, [-2.6, 0.02, 1.2], [0, 1, 0], 2.4, .7, 5); put(3, [2.2, 0.02, -2.6], [0, 1, 0], 2.0, .75, 7);  // rug centre + easel paint wear
    // env fix 1 (fault 5): paint splatters + scuffs where work happens (easel apron, counter
    // front, trolley, table legs) — floor tells the studio story; all flat decals, keep-clear safe.
    for (const [cell, x, z, s] of [[0, 1.6, -1.2, 1.4], [1, 2.9, -1.5, 1.2], [4, 1.1, -3.6, 1.3], [5, 3.2, -3.4, 1.1],
      [6, 4.6, -3.3, 1.4], [7, 5.8, -3.4, 1.2], [8, 3.4, 0.4, 1.3], [9, -1.2, 0.4, 1.2], [10, -4.2, 2.6, 1.3],
      [11, 0.2, -0.4, 1.1], [2, 6.9, 1.6, 1.4], [3, -6.2, -5.2, 1.2]]) put(cell, [x, 0.02, z], [0, 1, 0], s, .8, x * 3 + z);
    // env fix 2 (fault 1): wear + stains on the south floor slab and cabinet fronts so the
    // S28 foreground floor never reads as a flat cream band (all flat decals, keep-clear safe).
    for (const [cell, x, z, s] of [[0, -1.7, 6.6, 1.5], [4, 1.5, 6.7, 1.4], [8, -4.5, 6.4, 1.3], [10, 4.8, 6.5, 1.3], [2, 0.2, 5.6, 1.6]]) put(cell, [x, 0.05, z], [0, 1, 0], s, .8, x * 2 + z);
    put(13, [-1.7, 0.5, 7.18], [0, 0, -1], 1.6, .6, 1); put(14, [1.5, 0.5, 7.18], [0, 0, -1], 1.6, .6, 4);  // cabinet-front scuffs (facing north cameras)
    put(16, [-1.8, 5.6, -15.7], [0, 0, 1], 1.8, .5, 2); put(16, [2.1, 5.8, -15.7], [0, 0, 1], 1.8, .5, 5); // above paintings
    for (const [x, z] of [[-5.5, -6], [5.5, -6], [-5.5, -11], [5.5, -11]]) put(22, [x, 0.02, z], [0, 1, 0], 1.4, .6, x); // post bases
    rkit.decals('studio', D, decalTex, { parent: G });
    return { glb: true };
  })();

  // painted canvases inside the Blender gold/wood frames (unique scene per frame in any view).
  // env fix 1 (critic env1 fault 2: 3+ identical in one frame): every set canvas has its OWN
  // variant and size; far-wall canvases tinted darker (basic() is unlit — value from tint).
  // env fix 2 (critic env2 fault 4, f2260/f1859/f0): the Delft map (v8) + house-row drawings
  // (v4 rooftops, v13 gables) repeated across shots at the same size+frame and read as reused
  // assets. Fix: map moved to the south band (S28-only view, never co-appears with north
  // walls); far-left is now the NEW canal scene (v16) at a new size; hanging gables (v13)
  // replaced by the NEW polder landscape (v18); left wall gets the NEW figure study 2 (v17)
  // at a new size; far-right frame is dark wood (Blender) vs gold far-left. Zero identical
  // size+frame+content triples across f0/f490/f1859/f2260. Story easel v0 untouched.
  // Audit: far 16/2, high 3/4/5/6, right 7, left 17/12, easel2 10, south 1/8, hang 18/14/9,
  // east 15, lean-far 11.
  const FAR = '#b3a586', SIDE = '#c9bda3', NEAR = '#e6ddcb';
  const paint = (w, h, v, x, y, z, ry = 0, rx = 0, tint = NEAR) => {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), basic(tint, { map: vermeerTex(v) }));
    m.position.set(x, y, z); m.rotation.set(rx, ry, 0); m.frustumCulled = false; base.group.add(m); };
  paint(1.3, 1.85, 16, -1.8, 3.9, -15.64, 0, 0, FAR); paint(1.25, 1.75, 2, 2.1, 3.8, -15.64, 0, 0, FAR);  // far pair (canal + church; map v8 moved south, milkmaid v1 south too — neither shares a frame with story v0)
  paint(1.45, 2.05, 7, 7.62, 3.6, -2, -Math.PI / 2, 0, SIDE);                                          // right wall
  paint(1.3, 1.7, 3, -5.6, 4.95, -15.64, 0, 0, FAR); paint(1.1, 1.45, 4, -0.6, 4.95, -15.64, 0, 0, FAR);
  paint(1.3, 1.7, 5, 3.1, 4.95, -15.64, 0, 0, FAR); paint(1.1, 1.45, 6, 6.0, 4.95, -15.64, 0, 0, FAR);  // high sketches
  paint(0.95, 1.25, 17, -7.62, 4.9, -1.5, Math.PI / 2, 0, SIDE); paint(0.85, 1.1, 12, -7.62, 4.9, -4.2, Math.PI / 2, 0, SIDE); // left wall (figure study 2 + portrait woman)
  paint(1.1, 1.5, 10, -6.5, 2.1, -9.38, 0, 0.12, SIDE);                                                // second easel (finished sketch study)
  paint(1.3, 1.8, 1, -3.4, 4.6, 7.64, Math.PI, 0, FAR); paint(1.45, 2.05, 8, 1.6, 4.6, 7.64, Math.PI, 0, FAR); // south band (S28 bg, lowered with the band in fix 2; map lives here now)
  paint(1.0, 1.3, 18, -1.8, 4.55, -8.42, 0, 0, SIDE); paint(0.9, 1.15, 14, 1.8, 4.63, -8.42, 0, 0, SIDE);      // canvases hanging from arch lintel (mid layer)
  paint(0.75, 0.95, 9, 0, 4.73, -8.42, 0, 0, SIDE);                                                    // centre hanging canvas (env fix 2, f1859 interior layer)
  paint(1.0, 1.4, 15, 6.92, 1.02, -1.8, -Math.PI / 2, 0, SIDE);                                        // east leaning canvas (counter-view mid layer)
  paint(0.85, 1.3, 11, 6.6, 0.87, -15.26, 0, -0.1, SIDE);                                              // far-wall leaning canvas (env fix 2, f1859 interior layer)
  // south backdrop paintings (env fix 2b, S28-only view at z20; distinct from the south-band
  // pair v1/v8 in the same frame; v11/v6 also appear in north views, never co-appear here)
  paint(1.45, 1.95, 11, -4.5, 4.2, 19.64, Math.PI, 0, FAR); paint(1.05, 1.45, 13, 0.5, 4.4, 19.64, Math.PI, 0, FAR); paint(1.25, 1.75, 6, 5.0, 4.1, 19.64, Math.PI, 0, FAR);

  return { ...base, rig, look, ready, update(t) { rig.update(t); base.update?.(t); } };
}
