// fire_oxen set.js (BUILD pass, previz with depth): three places 400 D apart, each in its own
// dome + fog, lit by lights-as-data. One night: cold blue-grey siege (field + city) against a
// warm amber camp; dawn gold and attack red arrive as light states. Depth strategy per place:
// a far end 25 D+ behind the faces (wall run / plain to camp glow / courtyard to rooftops /
// tents ring), vanishing lines (wall parapet merlons, run path, walkway, house rows), pools
// of light (torch / bowl / lantern points with tight falloff along the depth), modelled layers
// between faces and far end. Later passes enrich; walls never move after this.
//
// Layout contract (BIBLE.md): ground y=0, camera side +Z.
//   field [0,0]      wall along X at z=-24 (holes at x -2, +3), plain z -24..+34, Yan glow z +34..
//   city  [400,0]    wall at z=-6, walkway top y=5 (z -6..-3), courtyard z 0..18, houses z 18..30,
//                    relief map board 14x10 at z=+34 facing the courtyard
//   camp  [400,-400] tents ring x -18..18, z -14..14 (gap at back centre for the ox entry),
//                    banner pole (0,-10)
// Keep-clear: field run lane x -3..+3, z -24..+34; city walkway z -6..-3 at y5; courtyard
// centre x -2..+2. Nothing thin ends at a head height in the lanes.
//
// Oxen: built by ./props/ox.js when it lands (dynamic import in `ready`); until then a plain
// fallback ox keeps the film rendering. Either way the SET owns placement: update(t) positions
// every ox from the time table (opts.oxTable, defaults below) and calls the builder's
// userData.update(obj, opts) with phase = travelled(t) — pure in t, seeded rng only, no state.
import { createLightRig } from '../../world/look/lights.js';
import { createPost } from '../../world/look/post.js';
import { createRigShade } from '../../world/look/rigshade.js';
import { createKit } from '../../world/look/rigkit.js';
import { readGlb } from '../../world/look/glb.js';
import { basic, flat, part } from '../../engine/props/_kit.js';

// place origins (world)
const FX = 0, FZ = 0, CX = 400, CZ = 0, KX = 400, KZ = -400;
const MOON_DIR = [-0.35, 0.8, -0.3];

export async function buildSet(THREE, scene, opts, kit) {
  const o = opts || {};
  // ---- the one time table (film.js may override via setOpts; defaults = BIBLE line times)
  const dawnT = o.dawnT ?? 56.2;            // line 9: dawn gold
  const attackT = o.attackT ?? 48.7;        // line 8: camp attack red
  const bannerFallT = o.bannerFallT ?? 57.5;
  const mapOff = o.mapOff || [6.26, 13.19]; // line 2: gold markers go dark, staggered
  const mapOn = o.mapOn || [60.2, 63.2];    // line 9: markers relight, staggered
  const OT = { heroRun: [0.5, 5.5], herdStand: [34.4, 38.9], fireOn: 37.3, stampede: [38.9, 47.9],
    campAdvance: [48.7, 55.4], grazeFrom: 59, dressFrom: 26.43, ...(o.oxTable || {}) };

  // ---- kit base (marks/uniforms/group plumbing); its camera-following dome is removed below
  // in favour of one fixed dome per place (depthWrite true, renderOrder -10: sets.md).
  const DESC = { name: 'fire_oxen', sky: { top: '#0a1428', hor: '#1a2a4a', low: '#0d1526' },
    sun: { dir: MOON_DIR },
    ground: [{ color: '#141a26', x: [-500, 500], z: [-600, 200], y: -0.08 }],
    marks: {}, points: {}, bounds: { x: [-20, 20], z: [-28, 36] }, boxes: [] };
  const base = kit(DESC, o);
  for (const m of [...base.group.children]) // drop the kit's single following dome (r=300)
    if (m.isMesh && m.renderOrder === -10 && m.geometry?.parameters?.radius === 300) base.group.remove(m);

  // ---- lights as data. Colours LINEAR. Positions are WORLD (place origin + local).
  // Flicker drivers: pure in t, seeded sines (no Math.random anywhere in this file).
  const flick = (a, b, p) => t => 0.86 + 0.10 * Math.sin(t * a + p) + 0.06 * Math.sin(t * b + p * 2.7);
  const seg01 = (t, a, b) => Math.min(1, Math.max(0, (t - a) / (b - a)));
  const smooth = (t, a, b) => { const u = seg01(t, a, b); return u * u * (3 - 2 * u); };
  const lerp = (a, b, u) => a + (b - a) * u;
  // hero ox world position as a function of t (shared by the fire light's `move` driver and update)
  const heroPosAt = t => {
    if (t < 20) return [0, 1.6, lerp(-18, 28, smooth(t, OT.heroRun[0], OT.heroRun[1]))];
    if (t < 58) return [0.5, 1.6, lerp(-22, 30, smooth(t, OT.stampede[0], OT.stampede[1]))];
    return [2, 1.6, 8];
  };
  const heroFireAt = t => ((t >= OT.heroRun[0] && t <= 6.2) || (t >= OT.fireOn && t <= 55.4)) ? 1 : 0;
  const drivers = { flickA: flick(11.3, 23.7, 0.0), flickB: flick(12.7, 21.1, 2.1), flickC: flick(10.1, 25.3, 4.2),
    flickD: flick(13.9, 19.7, 1.3), heroPos: heroPosAt, heroFire: heroFireAt };

  const PLACES = {
    field: { sky: [0.06, 0.09, 0.16], ground: [0.02, 0.03, 0.05], fog: { color: '#0e1a33', density: 0.007 },
      ao: { floor: 0, h: 1.6, amt: 0.4 },
      lights: [
        { id: 'moon', kind: 'sun', dir: MOON_DIR, color: [0.55, 0.65, 0.85], power: 0.55, wrap: 0.3 },
        { id: 'torchL', kind: 'point', pos: [FX - 2, 2.2, FZ - 23.2], color: [1.0, 0.55, 0.2], power: 3.2, fall: 0.18, range: 14, wrap: 0.35, drive: 'flickA' },
        { id: 'torchR', kind: 'point', pos: [FX + 3, 2.2, FZ - 23.2], color: [1.0, 0.55, 0.2], power: 3.2, fall: 0.18, range: 14, wrap: 0.35, drive: 'flickB' },
        { id: 'campGlow', kind: 'point', pos: [FX, 3, FZ + 40], color: [1.0, 0.6, 0.25], power: 2.0, fall: 0.02, range: 45, wrap: 0.4 },
        { id: 'oxFire', kind: 'point', pos: [0, 1.6, -18], move: 'heroPos', drive: 'heroFire', color: [1.0, 0.5, 0.16], power: 2.4, fall: 0.22, range: 9, wrap: 0.4 } ],
      states: [ { from: dawnT, sky: [0.5, 0.42, 0.3], ground: [0.2, 0.16, 0.1], fog: { color: '#e8c898', density: 0.004 },
        lights: { moon: { power: 1.1, color: [1.0, 0.8, 0.5] }, torchL: { power: 0.6 }, torchR: { power: 0.6 }, campGlow: { power: 0.5 }, oxFire: { power: 0 } } } ] },
    city: { sky: [0.07, 0.09, 0.15], ground: [0.025, 0.03, 0.05], fog: { color: '#101c30', density: 0.006 },
      ao: { floor: 0, h: 1.6, amt: 0.4 },
      lights: [
        { id: 'moon', kind: 'sun', dir: MOON_DIR, color: [0.5, 0.6, 0.8], power: 0.4, wrap: 0.3 },
        { id: 'wallTorchL', kind: 'point', pos: [CX - 6, 6.2, CZ - 5.2], color: [1.0, 0.58, 0.22], power: 3.0, fall: 0.16, range: 13, wrap: 0.35, drive: 'flickA' },
        { id: 'wallTorchR', kind: 'point', pos: [CX + 6, 6.2, CZ - 5.2], color: [1.0, 0.58, 0.22], power: 3.0, fall: 0.16, range: 13, wrap: 0.35, drive: 'flickB' },
        { id: 'bowlL', kind: 'point', pos: [CX - 5, 1.6, CZ + 8], color: [1.0, 0.5, 0.18], power: 2.6, fall: 0.2, range: 11, wrap: 0.4, drive: 'flickC' },
        { id: 'bowlR', kind: 'point', pos: [CX + 5, 1.6, CZ + 12], color: [1.0, 0.5, 0.18], power: 2.6, fall: 0.2, range: 11, wrap: 0.4, drive: 'flickD' },
        { id: 'idea', kind: 'point', pos: [CX, 3.2, CZ + 6], color: [1.0, 0.72, 0.38], power: 0, fall: 0.18, range: 10, wrap: 0.45 } ],
      states: [ { from: 16.76, lights: { idea: { power: 1.6 } } },   // line 4: the one warm light on Tian Dan's face
        { from: 25.86, lights: { idea: { power: 0 } } },
        { from: dawnT, sky: [0.5, 0.42, 0.3], ground: [0.2, 0.16, 0.1], fog: { color: '#e8c898', density: 0.004 },
          lights: { moon: { power: 1.05, color: [1.0, 0.8, 0.5] }, wallTorchL: { power: 0.5 }, wallTorchR: { power: 0.5 }, bowlL: { power: 0.6 }, bowlR: { power: 0.6 } } } ] },
    camp: { sky: [0.09, 0.07, 0.06], ground: [0.04, 0.03, 0.02], fog: { color: '#241a12', density: 0.007 },
      ao: { floor: 0, h: 1.6, amt: 0.4 },
      lights: [
        { id: 'moon', kind: 'sun', dir: MOON_DIR, color: [0.5, 0.6, 0.8], power: 0.25, wrap: 0.3 },
        { id: 'lantern1', kind: 'point', pos: [KX - 8, 3.4, KZ + 2], color: [1.0, 0.62, 0.26], power: 3.0, fall: 0.14, range: 13, wrap: 0.35, drive: 'flickA' },
        { id: 'lantern2', kind: 'point', pos: [KX, 3.4, KZ - 6], color: [1.0, 0.62, 0.26], power: 3.0, fall: 0.14, range: 13, wrap: 0.35, drive: 'flickB' },
        { id: 'lantern3', kind: 'point', pos: [KX + 8, 3.4, KZ + 4], color: [1.0, 0.62, 0.26], power: 3.0, fall: 0.14, range: 13, wrap: 0.35, drive: 'flickC' },
        { id: 'fire1', kind: 'point', pos: [KX - 4, 1.2, KZ + 6], color: [1.0, 0.48, 0.16], power: 2.8, fall: 0.2, range: 11, wrap: 0.4, drive: 'flickD' },
        { id: 'fire2', kind: 'point', pos: [KX + 5, 1.2, KZ - 2], color: [1.0, 0.48, 0.16], power: 2.8, fall: 0.2, range: 11, wrap: 0.4, drive: 'flickA' } ],
      states: [ { from: attackT, sky: [0.16, 0.05, 0.04], fog: { color: '#3a1410', density: 0.009 },
          lights: { lantern1: { power: 3.6, color: [1.0, 0.35, 0.12] }, lantern2: { power: 3.6, color: [1.0, 0.35, 0.12] },
            lantern3: { power: 3.6, color: [1.0, 0.35, 0.12] }, fire1: { power: 4.2 }, fire2: { power: 4.2 } } },
        { from: dawnT, sky: [0.45, 0.4, 0.32], ground: [0.18, 0.15, 0.11], fog: { color: '#d8b888', density: 0.004 },
          lights: { moon: { power: 1.0, color: [1.0, 0.8, 0.5] }, lantern1: { power: 0.4 }, lantern2: { power: 0.4 }, lantern3: { power: 0.4 }, fire1: { power: 0.8 }, fire2: { power: 0.8 } } } ] },
  };
  const rig = createLightRig(THREE, PLACES, drivers);
  const look = o.post ? createPost(THREE, rig, o.post) : undefined;   // inactive until the Post pass sets opts.post
  if (look && o.post.shade) look.shading = createRigShade(THREE, rig, o.post.shade);
  const rkit = createKit(THREE, rig, { shadow: base.uniforms || {}, group: base.group });

  // ---- code-drawn canvas textures (no Flow in Build: tiling, low contrast, seeded)
  const rng = sd => () => ((sd = (sd * 1664525 + 1013904223) >>> 0) / 4294967296);
  const R1 = (k, s = 1) => { const h = Math.sin(k * 12.9898 + s * 78.233) * 43758.5453; return h - Math.floor(h); };
  const canvasTex = (size, draw) => { const c = document.createElement('canvas'); c.width = c.height = size; draw(c.getContext('2d'), size);
    const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.anisotropy = 8; t.colorSpace = THREE.NoColorSpace; return t; };
  const blotches = (g, S, n, a, r0, r1, seed, cols) => { const R = rng(seed); for (let i = 0; i < n; i++) { g.globalAlpha = a * R(); g.fillStyle = cols[Math.floor(R() * cols.length)];
    const r = r0 + R() * (r1 - r0); g.beginPath(); g.ellipse(R() * S, R() * S, r, r * (.4 + R()), R() * 3, 0, 7); g.fill(); } g.globalAlpha = 1; };
  const stoneTex = canvasTex(512, (g, S) => { g.fillStyle = '#cfd2d6'; g.fillRect(0, 0, S, S); const R = rng(7);
    blotches(g, S, 900, .06, 2, 18, 3, ['#a8adb4', '#e8eaec', '#8f959e']);
    g.strokeStyle = 'rgba(40,44,52,.55)'; g.lineWidth = 4; const rows = 6, rh = S / rows;
    for (let r = 0; r <= rows; r++) { g.beginPath(); g.moveTo(0, r * rh); g.lineTo(S, r * rh); g.stroke();
      for (let c = 0; c < 4; c++) { const x = ((c + (r % 2) * .5) % 4) * S / 4; g.beginPath(); g.moveTo(x, r * rh); g.lineTo(x, (r + 1) * rh); g.stroke(); } }
    for (let i = 0; i < 260; i++) { g.globalAlpha = .05 + R() * .08; g.fillStyle = '#5a6068'; g.fillRect(R() * S, R() * S, 2 + R() * 8, 1 + R() * 3); } g.globalAlpha = 1; });
  const dirtTex = canvasTex(512, (g, S) => { g.fillStyle = '#d8d2c2'; g.fillRect(0, 0, S, S);
    blotches(g, S, 1600, .07, 1, 12, 11, ['#b8ae96', '#efe9da', '#9a8f74']); blotches(g, S, 40, .09, 16, 60, 13, ['#8a7f64', '#6e6450']);
    const R = rng(17); g.fillStyle = 'rgba(70,62,48,.5)'; for (let i = 0; i < 220; i++) g.fillRect(R() * S, R() * S, 1.5 + R() * 3, 1 + R() * 2); });
  const woodTex = canvasTex(512, (g, S) => { g.fillStyle = '#d8c8a8'; g.fillRect(0, 0, S, S); const R = rng(19);
    for (let p = 0; p < 5; p++) { const y = p * S / 5; g.fillStyle = `rgba(${120 + R() * 40 | 0},${90 + R() * 30 | 0},${50 + R() * 20 | 0},.25)`; g.fillRect(0, y, S, S / 5);
      g.fillStyle = 'rgba(40,26,12,.8)'; g.fillRect(0, y, S, 3);
      for (let i = 0; i < 22; i++) { g.globalAlpha = .10 + R() * .12; g.strokeStyle = '#6a4a28'; g.lineWidth = 1 + R() * 2; g.beginPath();
        const gy = y + R() * S / 5; g.moveTo(0, gy); g.bezierCurveTo(S * .3, gy + 4 * (R() - .5), S * .7, gy + 4 * (R() - .5), S, gy); g.stroke(); } g.globalAlpha = 1; } });
  const tentTex = canvasTex(512, (g, S) => { g.fillStyle = '#e2dccb'; g.fillRect(0, 0, S, S);
    blotches(g, S, 700, .05, 2, 16, 23, ['#c9c0a8', '#f2ecdc', '#b0a68c']);
    g.strokeStyle = 'rgba(90,80,60,.4)'; g.lineWidth = 3; for (let i = 0; i <= 4; i++) { g.beginPath(); g.moveTo(i * S / 4, 0); g.lineTo(i * S / 4, S); g.stroke(); } });
  const roofTex = canvasTex(512, (g, S) => { g.fillStyle = '#c4c8cc'; g.fillRect(0, 0, S, S); const R = rng(29);
    blotches(g, S, 500, .06, 2, 14, 31, ['#9aa0a6', '#e2e6e8']);
    g.strokeStyle = 'rgba(50,56,64,.5)'; g.lineWidth = 3; const rows = 8;
    for (let r = 0; r <= rows; r++) { g.beginPath(); g.moveTo(0, r * S / rows); g.lineTo(S, r * S / rows); g.stroke(); }
    for (let i = 0; i < 300; i++) { g.globalAlpha = .06 + R() * .08; g.fillStyle = '#6a7078'; g.fillRect(R() * S, R() * S, 3 + R() * 10, 2); } g.globalAlpha = 1; });
  const mapTex = (() => { const c = document.createElement('canvas'); c.width = 1024; c.height = 732; const g = c.getContext('2d'); const W = 1024, H = 732; const R = rng(37);
    g.fillStyle = '#e8dcc0'; g.fillRect(0, 0, W, H); blotches(g, W, 500, .06, 4, 40, 41, ['#cbb98f', '#f6eed4', '#b89f6e']);
    g.strokeStyle = 'rgba(90,70,40,.75)'; g.lineWidth = 10; g.strokeRect(18, 18, W - 36, H - 36);
    g.strokeStyle = 'rgba(70,90,110,.65)'; g.lineWidth = 7; g.beginPath(); g.moveTo(W * .06, H * .78); g.bezierCurveTo(W * .3, H * .55, W * .55, H * .72, W * .94, H * .3); g.stroke(); // river
    g.strokeStyle = 'rgba(110,90,55,.5)'; g.lineWidth = 4; for (let i = 0; i < 7; i++) { g.beginPath(); const x = W * (.12 + i * .12); g.moveTo(x, H * .9); g.bezierCurveTo(x + 30, H * .6, x - 24, H * .35, x + 14, H * .1); g.stroke(); } // roads
    g.fillStyle = 'rgba(120,60,40,.8)'; for (let i = 0; i < 70; i++) { const x = W * (.1 + .8 * R()), y = H * (.12 + .76 * R()); g.fillRect(x - 5, y - 5, 10, 10); } // faint city squares under the gold pins
    g.fillStyle = 'rgba(90,70,40,.9)'; g.font = '900 44px Georgia, serif'; g.textAlign = 'center'; g.fillText('齊', W * .5, H * .16);
    const t = new THREE.CanvasTexture(c); t.anisotropy = 8; t.colorSpace = THREE.NoColorSpace; return t; })();

  // ---- material + geometry helpers
  const surf = (place, color, oo = {}) => rkit.surface(place, color, oo);
  const add = (geo, m, x, y, z, parent, rot) => { const mesh = new THREE.Mesh(geo, m); mesh.position.set(x, y, z); if (rot) mesh.rotation.set(rot[0] || 0, rot[1] || 0, rot[2] || 0); mesh.frustumCulled = false; parent.add(mesh); return mesh; };
  const box = (w, h, d, m, x, y0, z, parent, rot) => add(new THREE.BoxGeometry(w, h, d), m, x, y0 + h / 2, z, parent, rot);
  const cyl = (r0, r1, h, m, x, y0, z, parent, seg = 12) => add(new THREE.CylinderGeometry(r0, r1, h, seg), m, x, y0 + h / 2, z, parent);
  const flames = []; // {mesh, seed, s} — flicker scale in update, pure in t
  const flame = (parent, x, y, z, s, seed) => { const f = add(new THREE.ConeGeometry(.22 * s, .8 * s, 8), basic('#ff9a3c'), x, y, z, parent);
    const inner = add(new THREE.ConeGeometry(.11 * s, .5 * s, 8), basic('#ffd98a'), x, y - .05 * s, z, parent); flames.push({ mesh: f, seed, s }, { mesh: inner, seed: seed + 1.7, s: s * .8 }); return f; };
  const torch = (place, parent, x, y0, z, h, seed) => { cyl(.07, .09, h, surf(place, '#4a3626', { map: woodTex, uv: 0, tile: [1, 1], grime: .4 }), x, y0, z, parent, 8);
    cyl(.16, .1, .22, surf(place, '#2e2a26', { gloss: 30, spec: .4, grime: .3 }), x, y0 + h, z, parent, 8); flame(parent, x, y0 + h + .45, z, 1, seed); };
  const glowDisc = (parent, x, y, z, size, color = '#ffb45e', op = .5) => { const m = new THREE.Mesh(new THREE.CircleGeometry(size, 20),
    new THREE.MeshBasicMaterial({ color, transparent: true, opacity: op, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide }));
    m.position.set(x, y, z); m.frustumCulled = false; parent.add(m); return m; };

  // ---- domes: one per place, depthWrite true, renderOrder -10 (rkit.sky already sets -10)
  const SKY_NIGHT = { top: '#060d20', hor: '#16264a', low: '#0a1226', cloudLit: '#2c3f66', cloudDark: '#050a18', sun: MOON_DIR, sunColor: [.18, .22, .34], cover: .38, scale: 1.1 };
  const SKY_DAWN = { top: '#5a7aa8', hor: '#f2c98e', low: '#c99a68', cloudLit: '#ffdcae', cloudDark: '#7a6a72', sun: [.3, .22, .6], sunColor: [.55, .36, .16], cover: .3, scale: 1.1 };
  const SKY_CAMP = { top: '#0a0d1c', hor: '#2a2233', low: '#14101c', cloudLit: '#3d3550', cloudDark: '#080a16', sun: MOON_DIR, sunColor: [.14, .17, .28], cover: .3, scale: 1.1 };
  const SKY_ATTACK = { top: '#1c0a10', hor: '#4a1c14', low: '#241016', cloudLit: '#5c2a20', cloudDark: '#12060a', sun: MOON_DIR, sunColor: [.3, .1, .06], cover: .45, scale: 1.1 };
  const skyField = rkit.sky(FX, FZ, 170, SKY_NIGHT), skyCity = rkit.sky(CX, CZ, 170, SKY_NIGHT), skyCamp = rkit.sky(KX, KZ, 170, SKY_CAMP);
  for (const s of [skyField, skyCity, skyCamp]) s.mesh.material.depthWrite = true;

  const fieldG = new THREE.Group(); fieldG.name = 'place.field'; fieldG.position.set(FX, 0, FZ); base.group.add(fieldG);
  const cityG = new THREE.Group(); cityG.name = 'place.city'; cityG.position.set(CX, 0, CZ); base.group.add(cityG);
  const campG = new THREE.Group(); campG.name = 'place.camp'; campG.position.set(KX, 0, KZ); base.group.add(campG);

  // ============================================================ FIELD [0,0]
  {
    const G = fieldG;
    const groundM = surf('field', '#5a6577', { map: dirtTex, uv: 1, tile: [7, 7], grime: .45 });
    add(new THREE.PlaneGeometry(150, 110), groundM, 0, 0, 5, G, [-Math.PI / 2, 0, 0]);
    // worn run path down the lane (vanishing line toward the holes; flat, lane stays clear)
    add(new THREE.PlaneGeometry(5.4, 58), surf('field', '#6e7a8e', { map: dirtTex, uv: 1, tile: [3, 10], grime: .3 }), .4, .02, 5, G, [-Math.PI / 2, 0, 0]);
    // the city wall: long run along X at z=-24, parapet + merlons (the vanishing line)
    const wallM = surf('field', '#8d97a8', { map: stoneTex, uv: 3, tile: [6, 6], grime: .5, bump: .05 });
    const wallDark = surf('field', '#6a7488', { map: stoneTex, uv: 3, tile: [6, 6], grime: .6 });
    box(80, 7, 2.5, wallM, 0, 0, -24, G);
    box(80, .5, 3.1, wallDark, 0, 7, -24, G);                       // walkway slab
    box(80, 1.1, .5, wallM, 0, 7.5, -22.95, G);                     // parapet (front)
    for (let x = -38; x <= 38; x += 4) box(1.6, .8, .55, wallM, x, 8.6, -22.95, G); // merlons
    for (const tx of [-20, 20]) { box(5, 9.4, 4.4, wallM, tx, 0, -24, G); box(5.6, .6, 5, wallDark, tx, 9.4, -24, G); } // towers break the skyline
    // two dug HOLES at the base (x -2, +3): dark mouth, broken rim, rubble — holes, NOT gates
    const holeM = surf('field', '#0c0e14', { grime: .2 });
    for (const hx of [-2, 3]) {
      box(3.4, 3.1, .3, holeM, hx, 0, -22.72, G);                   // dark mouth proud of the face (enlarged: must read behind the herd)
      box(3.0, 2.8, 2.2, holeM, hx, 0, -24.6, G);                   // dark throat behind (depth, not a flat card)
      for (let i = 0; i < 7; i++) { const a = i / 7 * Math.PI;       // broken rim stones round the mouth
        box(.6, .5, .35, wallDark, hx + Math.cos(a) * 2.05, Math.sin(a) * 3.0, -22.66, G, [0, 0, (R1(i, hx) - .5) * .6]); }  // broken rim round the enlarged mouth
      for (let i = 0; i < 8; i++) box(.3 + R1(i, hx + 2) * .4, .22, .3, wallDark, hx + (R1(i, hx + 3) - .5) * 3.4, 0, -21.6 + R1(i, hx + 4) * 1.2, G, [0, R1(i, hx + 5) * 3, 0]); // rubble
      const mound = add(new THREE.SphereGeometry(1, 10, 7), surf('field', '#5f6a7c', { map: dirtTex, uv: 1, tile: [2, 2], grime: .5 }), hx + 1.9, -.35, -21.8, G); mound.scale.set(1.6, .55, 1.2); // dug earth
    }
    torch('field', G, -3.4, 0, -22.4, 2.0, 3.1); torch('field', G, 4.4, 0, -22.4, 2.0, 5.7); // practicals at the holes (lights torchL/R)
    // mid-plain dressing, clear of the run lane (|x| >= 5): rocks, bushes, grass clumps
    const rockM = surf('field', '#707c90', { grime: .5, bump: .06 }), bushM = surf('field', '#3d4c42', { grime: .4 }), grassM = surf('field', '#4c5e4a', { grime: .3 });
    const R = rng(101);
    for (let i = 0; i < 10; i++) { const x = (5 + R() * 22) * (i % 2 ? 1 : -1), z = -16 + R() * 44, s = .5 + R() * 1.1;
      const r = add(new THREE.SphereGeometry(s, 9, 7), rockM, x, s * .3, z, G); r.scale.y = .55; r.rotation.y = R() * 3; }
    for (let i = 0; i < 9; i++) { const x = (5.5 + R() * 20) * (i % 2 ? -1 : 1), z = -14 + R() * 42, s = .8 + R() * 1.2;
      const b = add(new THREE.SphereGeometry(s, 10, 8), bushM, x, s * .55, z, G); b.scale.y = .7; }
    for (let i = 0; i < 16; i++) { const x = (4.6 + R() * 18) * (i % 2 ? 1 : -1), z = -18 + R() * 48;
      add(new THREE.ConeGeometry(.32, .75, 6), grassM, x, .36, z, G); add(new THREE.ConeGeometry(.22, .55, 6), grassM, x + .3, .26, z + .2, G); }
    // distant Yan camp glow (z +34..+44): tent silhouettes + lantern dots — the far end the other way
    const farTentM = surf('field', '#39435a', { grime: .3 });
    for (let i = 0; i < 7; i++) { const x = -18 + i * 6 + (R1(i, 61) - .5) * 2, z = 37 + R1(i, 62) * 6, s = .9 + R1(i, 63) * .5;
      box(3.4 * s, 1.5 * s, 2.8 * s, farTentM, x, 0, z, G); add(new THREE.ConeGeometry(2.4 * s, 1.7 * s, 4), farTentM, x, 1.5 * s + .85 * s, z, G, [0, Math.PI / 4, 0]); }
    for (let i = 0; i < 14; i++) { const x = -20 + R1(i, 71) * 40, z = 35 + R1(i, 72) * 8;
      add(new THREE.SphereGeometry(.14, 8, 6), basic('#ffc06a'), x, 1 + R1(i, 73) * 1.6, z, G); glowDisc(G, x, 1.4, z, .8, '#ff9a3c', .28); }
    // moon + halo, high behind the wall; low side ridges so the horizon is never a bare line
    add(new THREE.CircleGeometry(3.2, 24), basic('#dfe8f4'), -26, 34, -78, G); glowDisc(G, -26, 34, -77.5, 7, '#9fb8dd', .18);
    const ridgeM = surf('field', '#2e3a52', { grime: .2 });
    for (const [x, z, w, h] of [[-58, -30, 44, 5], [58, -26, 40, 4], [-52, 40, 36, 3.4], [54, 44, 38, 3.8]]) box(w, h, 8, ridgeM, x, 0, z, G);
  }

  // ============================================================ CITY [400,0]
  let mapMarkers = [], mapBoard = null, drumMesh = null;
  {
    const G = cityG;
    add(new THREE.PlaneGeometry(120, 90), surf('city', '#5c6474', { map: dirtTex, uv: 1, tile: [7, 7], grime: .45 }), 0, 0, 10, G, [-Math.PI / 2, 0, 0]);
    // wall along X at z=-6, walkway top y=5 spanning z -6..-3, parapet on the field edge
    const wallM = surf('city', '#8d97a8', { map: stoneTex, uv: 3, tile: [6, 6], grime: .5, bump: .05 });
    const wallDark = surf('city', '#6a7488', { map: stoneTex, uv: 3, tile: [6, 6], grime: .6 });
    box(70, 4.65, 4, wallM, 0, 0, -5, G);                           // body z -7..-3
    box(70, .35, 4.4, wallDark, 0, 4.65, -5, G);                    // walkway slab: top y = 5 exactly
    box(70, 1.1, .5, wallM, 0, 5, -6.85, G);                        // parapet, field edge
    for (let x = -33; x <= 33; x += 4) box(1.6, .75, .55, wallM, x, 6.1, -6.85, G);
    box(70, .7, .4, wallDark, 0, 5, -3.1, G);                       // low inner kerb, courtyard edge
    for (const tx of [-22, 22]) { box(4.6, 7.2, 5, wallM, tx, 0, -5, G); box(5.2, .55, 5.6, wallDark, tx, 7.2, -5, G); }
    // ramp up to the walkway at the side (x +13; walkway lane stays clear)
    const ramp = box(3.2, .4, 9, wallDark, 13, 2.2, 1.5, G); ramp.rotation.x = -.52;
    torch('city', G, -6, 5, -5.4, 1.5, 7.3); torch('city', G, 6, 5, -5.4, 1.5, 9.1); // wall torches (lights wallTorchL/R)
    // the drum on the walkway (line 7: drumming on the wall) — at the side, off the walk lane centre
    drumMesh = new THREE.Group(); drumMesh.name = 'wallDrum'; drumMesh.position.set(-10, 5, -4.6); G.add(drumMesh);
    cyl(1.05, 1.05, 1.1, surf('city', '#7a4a30', { map: woodTex, uv: 0, tile: [2, 1], grime: .35 }), 0, .35, 0, drumMesh, 16);
    cyl(1.08, 1.08, .1, surf('city', '#e2d4b4', { grime: .25 }), 0, 1.45, 0, drumMesh, 16);
    box(2.4, .35, 1.4, surf('city', '#5a4630', { map: woodTex, uv: 0, tile: [1, 1], grime: .4 }), 0, 0, 0, drumMesh);
    // courtyard fire bowls x2 (lights bowlL/R), centre lane x -2..+2 kept clear
    const bowl = (x, z, seed) => { cyl(.95, .55, .7, surf('city', '#3a3430', { gloss: 26, spec: .35, grime: .35 }), x, .25, z, G, 14);
      cyl(.5, .62, .3, surf('city', '#2c2824', { grime: .4 }), x, 0, z, G, 10); flame(G, x, 1.35, z, 1.25, seed); flame(G, x + .3, 1.2, z + .2, .8, seed + 2.2); glowDisc(G, x, .06, z, 1.7, '#ff9a3c', .3).rotation.x = -Math.PI / 2; };
    bowl(-5, 8, 11.1); bowl(5, 12, 13.7);
    // courtyard dressing at the sides: crates, jars, stacked poles
    const crateM = surf('city', '#8a6c48', { map: woodTex, uv: 0, tile: [1, 1], grime: .4 });
    for (const [x, z, ry] of [[-8.5, 4, .2], [-8.2, 5.4, -.3], [8.6, 6, .5], [8.3, 14, .1], [-9, 15, .4]]) box(1.3, 1.3, 1.3, crateM, x, 0, z, G, [0, ry, 0]);
    box(1.0, 1.0, 1.0, crateM, -8.4, 1.3, 4.6, G, [0, .7, 0]);
    for (const [x, z] of [[-7, 11], [7.2, 9.5], [-7.4, 17]]) { cyl(.5, .38, 1.15, surf('city', '#7a5a48', { grime: .4 }), x, 0, z, G, 12); cyl(.34, .34, .18, surf('city', '#5e4638', { grime: .4 }), x, 1.15, z, G, 12); }
    // houses z 18..30 with lit windows + roofs; a darker second row behind (depth layers)
    const houseM = surf('city', '#7e8898', { map: stoneTex, uv: 3, tile: [4, 4], grime: .5 });
    const houseM2 = surf('city', '#69738a', { map: stoneTex, uv: 3, tile: [4, 4], grime: .55 });
    const roofM = surf('city', '#4c5468', { map: roofTex, uv: 1, tile: [3, 3], grime: .4 });
    const winM = basic('#ffca72'), winDark = basic('#141a26');
    const house = (x, z, w, h, d, m, lit) => { box(w, h, d, m, x, 0, z, G);
      const roof = add(new THREE.ConeGeometry(Math.hypot(w, d) * .62, 1.9, 4), roofM, x, h + .95, z, G, [0, Math.PI / 4, 0]); roof.scale.set(w / (Math.hypot(w, d) * .88), 1, d / (Math.hypot(w, d) * .88));
      box(1.1, 2.0, .12, surf('city', '#3e3428', { grime: .4 }), x - w * .22, 0, z - d / 2 - .04, G);
      for (let i = 0; i < 3; i++) add(new THREE.PlaneGeometry(.85, 1.05), (lit && (i + Math.round(x)) % 2 === 0) ? winM : winDark, x + (i - 1) * w * .28, h * .58, z - d / 2 - .07, G, [0, Math.PI, 0]); };
    house(-13, 22, 6.5, 4.6, 5, houseM, true); house(-6, 23, 5.5, 5.4, 5, houseM2, true); house(1, 22, 6, 4.2, 5, houseM, true);
    house(8, 23.5, 5.5, 5.8, 5, houseM2, true); house(15, 22, 6.5, 4.8, 5, houseM, false);
    house(-9, 31, 7, 6.2, 5, houseM2, true); house(3, 32, 7.5, 6.8, 5, houseM, true); house(13, 31, 6.5, 6.0, 5, houseM2, false);
    // relief MAP board: 14x10, tilted ~30 deg, at z=+34 facing the courtyard; ~70 gold pins ON it
    mapBoard = new THREE.Group(); mapBoard.name = 'mapBoard'; mapBoard.position.set(0, 4.9, 34); mapBoard.rotation.y = Math.PI; mapBoard.rotation.x = .52; G.add(mapBoard);
    const boardM = surf('city', '#6e5238', { map: woodTex, uv: 0, tile: [2, 2], grime: .35 });
    box(14.6, 10.6, .35, boardM, 0, -5.3, -.22, mapBoard);
    const parch = add(new THREE.PlaneGeometry(14, 10), new THREE.MeshBasicMaterial({ map: mapTex }), 0, 0, .02, mapBoard);
    parch.material.color.set('#d8cdb2'); // dimmed parchment: the gold pins carry the read at night
    const pinLit = basic('#ffd35e'), pinDark = basic('#4a4038');
    const pinGeo = new THREE.SphereGeometry(.13, 8, 6);
    mapMarkers = [];
    { const R = rng(401); for (let i = 0; i < 70; i++) { const px = -6 + R() * 12, py = -4.2 + R() * 8.4;
      const pin = new THREE.Mesh(pinGeo, pinLit); pin.position.set(px, py, .16); pin.frustumCulled = false; mapBoard.add(pin); mapMarkers.push(pin); } }
    mapBoard.userData.pinLit = pinLit; mapBoard.userData.pinDark = pinDark;
    for (const sx of [-5.5, 5.5]) { const leg = box(.45, 5.2, .45, boardM, sx, 0, 35.6, G); leg.rotation.x = .3; }
    box(13, .45, .45, boardM, 0, 1.1, 35.4, G);
  }

  // ============================================================ CAMP [400,-400]
  let bannerPivot = null;
  {
    const G = campG;
    add(new THREE.PlaneGeometry(110, 90), surf('camp', '#6a5f4e', { map: dirtTex, uv: 1, tile: [7, 7], grime: .5 }), 0, 0, 0, G, [-Math.PI / 2, 0, 0]);
    const tentM = surf('camp', '#9a8f74', { map: tentTex, uv: 0, tile: [2, 2], grime: .45 });
    const tentM2 = surf('camp', '#8a7f68', { map: tentTex, uv: 0, tile: [2, 2], grime: .5 });
    const doorM = surf('camp', '#241e18', { grime: .3 });
    const tent = (x, z, s, ry, m) => { const tg = new THREE.Group(); tg.position.set(x, 0, z); tg.rotation.y = ry; G.add(tg);
      box(3.6 * s, 1.7 * s, 3.0 * s, m, 0, 0, 0, tg);
      const roof = add(new THREE.ConeGeometry(2.5 * s, 1.8 * s, 4), m, 0, 1.7 * s + .9 * s, 0, tg, [0, Math.PI / 4, 0]); roof.scale.set(1.05, 1, .88);
      box(1.0 * s, 1.5 * s, .1, doorM, 0, 0, 1.52 * s, tg);
      cyl(.06, .06, 1.1 * s, surf('camp', '#4a3a28', { grime: .4 }), 0, 3.4 * s, 0, tg, 6); };
    // ring with a gap at back centre (x -3..3, z -14) where the oxen enter in line 8
    tent(-13, -11, 1.1, .5, tentM); tent(-7, -12.5, 1.0, .2, tentM2); tent(7, -12.5, 1.05, -.3, tentM); tent(13, -11, 1.1, -.5, tentM2);
    tent(-16, -3, 1.15, 1.2, tentM2); tent(16, -3, 1.15, -1.2, tentM); tent(-15, 6, 1.0, 1.6, tentM); tent(15, 6, 1.0, -1.6, tentM2);
    tent(-10, 12, 1.05, 2.6, tentM); tent(0, 13.5, 1.2, 3.1, tentM2); tent(10, 12, 1.05, -2.6, tentM);
    tent(-20, -16, 1.2, .8, tentM2); tent(20, -16, 1.2, -.8, tentM); // outer silhouettes: depth past the ring
    // 3 lanterns on poles (lights lantern1..3)
    const lantern = (x, z, seed) => { cyl(.09, .12, 3.2, surf('camp', '#4a3a28', { map: woodTex, uv: 0, tile: [1, 1], grime: .4 }), x, 0, z, G, 8);
      box(.62, .8, .62, basic('#ffc873'), x, 3.0, z, G); box(.8, .14, .8, surf('camp', '#33291e', { grime: .4 }), x, 3.82, z, G); flame(G, x, 3.42, z, .55, seed); glowDisc(G, x, 3.42, z, 1.15, '#ffb45e', .3); };
    lantern(-8, 2, 17.3); lantern(0, -6, 19.9); lantern(8, 4, 21.5);
    // 2 fire pits (lights fire1/2): stone ring, logs, layered flames
    const pit = (x, z, seed) => { for (let i = 0; i < 9; i++) { const a = i / 9 * Math.PI * 2; box(.42, .3, .3, surf('camp', '#6a6258', { grime: .5 }), x + Math.cos(a) * 1.05, 0, z + Math.sin(a) * 1.05, G, [0, -a, 0]); }
      for (let i = 0; i < 4; i++) { const log = cyl(.09, .09, 1.3, surf('camp', '#4a3422', { grime: .5 }), x, .18, z, G, 6); log.rotation.z = Math.PI / 2; log.rotation.y = i * .8; }
      flame(G, x, 1.0, z, 1.5, seed); flame(G, x + .35, .85, z - .2, 1.0, seed + 2.9); glowDisc(G, x, .06, z, 2.0, '#ff9a3c', .3).rotation.x = -Math.PI / 2; };
    pit(-4, 6, 23.1); pit(5, -2, 25.7);
    // banner pole at (0,-10): pivoted at the base so update(t) can fell it (line 9)
    bannerPivot = new THREE.Group(); bannerPivot.name = 'banner'; bannerPivot.position.set(0, 0, -10); G.add(bannerPivot);
    cyl(.14, .18, 7.2, surf('camp', '#4a3a28', { map: woodTex, uv: 0, tile: [1, 2], grime: .4 }), 0, 0, 0, bannerPivot, 10);
    const cross = cyl(.07, .07, 3.4, surf('camp', '#4a3a28', { grime: .4 }), 0, 6.5, 0, bannerPivot, 8); cross.rotation.z = Math.PI / 2;
    const cloth = add(new THREE.PlaneGeometry(3.0, 2.2), new THREE.MeshBasicMaterial({ color: '#8a2432', side: THREE.DoubleSide }), 0, 5.3, 0, bannerPivot);
    add(new THREE.CircleGeometry(.55, 16), basic('#e8d8a8'), 0, 5.3, .02, bannerPivot);
    add(new THREE.SphereGeometry(.2, 10, 8), basic('#d9b860'), 0, 7.35, 0, bannerPivot);
    cyl(.55, .7, .5, surf('camp', '#5a5044', { grime: .5 }), 0, 0, -10, G, 10); // base stone (stays when the pole falls)
    // weapon racks + crates + barrels at the sides (centre stays clear)
    const rack = (x, z, ry) => { const rg = new THREE.Group(); rg.position.set(x, 0, z); rg.rotation.y = ry; G.add(rg);
      const rm = surf('camp', '#5e4630', { map: woodTex, uv: 0, tile: [1, 1], grime: .4 });
      box(.18, 1.7, .18, rm, -1.4, 0, 0, rg); box(.18, 1.7, .18, rm, 1.4, 0, 0, rg); box(3.0, .16, .16, rm, 0, 1.5, 0, rg); box(3.0, .16, .16, rm, 0, .5, 0, rg);
      for (let i = 0; i < 5; i++) { const sp = cyl(.035, .035, 2.6, surf('camp', '#6a5238', { grime: .35 }), -1.1 + i * .55, 0, .22, rg, 6); sp.rotation.x = -.18;
        add(new THREE.ConeGeometry(.09, .4, 6), surf('camp', '#b8bec6', { gloss: 60, spec: .8, grime: .2 }), -1.1 + i * .55, 2.75, .68, rg); } };
    rack(-11, 2, .9); rack(11, -6, -1.1);
    const crateM = surf('camp', '#8a6c48', { map: woodTex, uv: 0, tile: [1, 1], grime: .45 });
    for (const [x, z, ry] of [[-9, 9, .3], [-8, 10.2, -.2], [9.5, 8.5, .6], [12, 2, .1], [-12.5, -7, .4]]) box(1.3, 1.3, 1.3, crateM, x, 0, z, G, [0, ry, 0]);
    box(1.0, 1.0, 1.0, crateM, -8.6, 1.3, 9.4, G, [0, .8, 0]);
    for (const [x, z] of [[-6.5, -9], [6.8, 10], [13, -9.5]]) { cyl(.52, .46, 1.25, surf('camp', '#7a5a38', { map: woodTex, uv: 0, tile: [2, 1], grime: .45 }), x, 0, z, G, 12); }
    // low table + cups near the centre-back (line 3 story dressing; low, off the entry lane)
    box(2.6, .14, 1.4, crateM, -3.2, .85, -8.5, G); for (const [dx, dz] of [[-1.1, -.5], [1.1, -.5], [-1.1, .5], [1.1, .5]]) box(.14, .85, .14, crateM, -3.2 + dx, 0, -8.5 + dz, G);
    for (const dx of [-.7, 0, .7]) cyl(.13, .1, .2, surf('camp', '#c8ccd2', { gloss: 50, spec: .6, grime: .2 }), -3.2 + dx, .99, -8.5, G, 10);
  }

  // ============================================================ OXEN
  // Fallback ox (used until ./props/ox.js lands): origin ground centre, faces +Z, ~2.3 D at the back.
  // Same update contract the set calls on the real builder: userData.update(obj, opts).
  const buildFallbackOx = seed => {
    const g = new THREE.Group();
    const hide = flat('#6b4a33'), hideD = flat('#543826'), hornM = flat('#d8cfc0'), darkM = flat('#241a14');
    const body = part(new THREE.BoxGeometry(1.5, 1.45, 3.0), hide, .02); body.position.set(0, 1.55, 0); g.add(body);
    const hump = part(new THREE.SphereGeometry(.62, 10, 8), hide, .02); hump.position.set(0, 2.25, .75); hump.scale.set(1, .7, 1.1); g.add(hump);
    const headG = new THREE.Group(); headG.position.set(0, 1.75, 1.85); g.add(headG);
    const head = part(new THREE.BoxGeometry(.85, .9, 1.05), hideD, .02); headG.add(head);
    const muzzle = part(new THREE.BoxGeometry(.62, .5, .4), flat('#8a6a52'), .015); muzzle.position.set(0, -.22, .62); headG.add(muzzle);
    for (const sx of [-1, 1]) { const ear = part(new THREE.BoxGeometry(.4, .16, .24), hideD, .012); ear.position.set(sx * .58, .18, -.1); ear.rotation.z = sx * -.4; headG.add(ear);
      const horn = part(new THREE.CylinderGeometry(.05, .09, .85, 7), hornM, .01); horn.position.set(sx * .52, .42, -.05); horn.rotation.z = sx * -1.05; headG.add(horn);
      const eye = new THREE.Mesh(new THREE.SphereGeometry(.085, 8, 6), darkM); eye.position.set(sx * .34, .12, .46); headG.add(eye); }
    const legs = [];
    for (const [lx, lz] of [[-.5, 1.05], [.5, 1.05], [-.5, -1.05], [.5, -1.05]]) { const lg = new THREE.Group(); lg.position.set(lx, 1.05, lz); g.add(lg);
      const leg = part(new THREE.CylinderGeometry(.13, .1, 1.05, 8), hideD, .012); leg.position.y = -.52; lg.add(leg); legs.push(lg); }
    const tailG = new THREE.Group(); tailG.position.set(0, 1.95, -1.5); g.add(tailG);
    const tail = part(new THREE.CylinderGeometry(.05, .04, 1.1, 6), hideD, .008); tail.position.y = -.5; tailG.add(tail);
    const straw = part(new THREE.ConeGeometry(.3, .8, 8), flat('#c9a84c'), .012); straw.position.y = -1.15; straw.rotation.x = Math.PI; tailG.add(straw);
    const flameM = new THREE.Mesh(new THREE.ConeGeometry(.3, 1.0, 8), basic('#ff8a2e')); flameM.position.y = -1.5; flameM.rotation.x = Math.PI; tailG.add(flameM);
    const clothG = new THREE.Group(); g.add(clothG);
    const clothTop = part(new THREE.BoxGeometry(1.75, .09, 2.3), flat('#b03024'), .015); clothTop.position.set(0, 2.32, -.1); clothG.add(clothTop);
    for (const sx of [-1, 1]) { const side = part(new THREE.BoxGeometry(.07, .95, 2.3), flat('#9c2a20'), .012); side.position.set(sx * .86, 1.85, -.1); clothG.add(side); }
    const blades = [];
    for (const sx of [-1, 1]) { const bl = part(new THREE.BoxGeometry(.07, .5, .16), flat('#c2c8d0'), .008); bl.position.set(sx * .86, 2.32, 1.78); bl.rotation.z = sx * -.5; g.add(bl); blades.push(bl); }
    g.traverse(m => { m.frustumCulled = false; });
    g.userData.update = (obj, u = {}) => { const gait = u.gait ?? 0, ph = u.phase ?? 0;
      legs.forEach((lg, i) => { lg.rotation.x = Math.sin(ph + (i % 2) * Math.PI + (i > 1 ? .5 : 0)) * .62 * gait; });
      headG.rotation.y = u.headYaw ?? 0; headG.rotation.x = (u.graze ? .72 : .06 * Math.sin(ph) * gait) + (u.headPitch ?? 0);
      body.position.y = 1.55 + .07 * Math.abs(Math.sin(ph)) * gait; hump.position.y = 2.25 + .07 * Math.abs(Math.sin(ph)) * gait;
      clothG.visible = !!u.cloth; blades.forEach(b => { b.visible = !!u.blades; }); straw.visible = !!u.straw;
      flameM.visible = !!u.fire; if (flameM.visible) { const s = 1 + .28 * Math.sin(ph * 3.1 + seed); flameM.scale.set(s, 1 + .3 * Math.sin(ph * 4.3 + seed * 2), s); }
      tailG.rotation.x = .25 + .3 * Math.sin(ph * .5 + seed) * (gait ? 1 : .3); };
    return g;
  };

  // one wrapper per ox: the set positions the wrapper; the builder's ox rides inside it.
  const oxen = []; // {wrap, inner, upd, seed, kind, slot}
  const makeOx = (parent, kind, slot, name) => { const wrap = new THREE.Group(); if (name) wrap.name = name; parent.add(wrap);
    const inner = buildFallbackOx(slot * 1.37 + 1); wrap.add(inner);
    const rec = { wrap, inner, upd: inner.userData.update, seed: slot * 1.37 + 1, kind, slot }; oxen.push(rec); return rec; };
  const heroRec = makeOx(fieldG, 'hero', 0, 'heroOx');
  const herd = []; for (let i = 0; i < 13; i++) herd.push(makeOx(fieldG, 'herd', i + 1));
  const cityOx = []; for (let i = 0; i < 8; i++) cityOx.push(makeOx(cityG, 'city', i + 21));
  const campOx = []; for (let i = 0; i < 6; i++) campOx.push(makeOx(campG, 'camp', i + 41));
  // herd slots: two clusters at the holes + seeded lateral spread (pure constants)
  const herdSlot = i => { const holeX = i % 2 ? 3 : -2; let x = holeX + (R1(i, 201) - .5) * 8; for (const hx of [-2, 3]) { if (Math.abs(x - hx) < 2.4) x = hx + (x < hx ? -2.4 - Math.abs(x - hx) * .3 : 2.4 + Math.abs(x - hx) * .3); } return { x, z: -15.5 + (R1(i, 202) - .5) * 2.4, delay: R1(i, 203) * .8, drift: (R1(i, 204) - .5) * 5 }; };  // GLOBAL clear zones at both hole mouths (clusters overlapped)
  const citySlot = i => ({ x: (i % 2 ? 5.2 : -5.2) + (R1(i, 211) - .5) * 1.2, z: 4.5 + Math.floor(i / 2) * 3.2, ry: Math.PI + (R1(i, 212) - .5) * .5 });
  const campSlot = i => ({ x: (R1(i, 221) - .5) * 7, delay: R1(i, 222) * .7 });

  // real ox builder, when it lands: swap each fallback child for the real ox (wrapper + name stay)
  // + Environment pass: Blender detail layer (assets/set/fire_set.glb, world coords baked in).
  // Previz stays the fallback: if the GLB is missing the film renders exactly as before.
  const EMIT = new Set(['ember', 'win_lit', 'lantern_glow']);
  const FINISH = { stone_mid: { grime: .5, bump: .05 }, stone_dark: { grime: .55, bump: .05 }, stone_light: { grime: .45, bump: .04 },
    dark_inset: { grime: .2 }, wood_dark: { grime: .4 }, wood_mid: { grime: .4 }, wood_light: { grime: .35 },
    iron: { gloss: 30, spec: .4, grime: .3 }, brass: { gloss: 40, spec: .5, grime: .25 },
    canvas_tent: { grime: .45 }, canvas_tent2: { grime: .5 }, roof_tile: { grime: .4 }, thatch: { grime: .4 },
    earth: { grime: .5 }, grass: { grime: .3 }, leaf: { grime: .3 }, banner_red: { grime: .35 }, rope: { grime: .4 } };
  const hexOf = c => '#' + c.map(v => Math.round(Math.min(1, v) * 255).toString(16).padStart(2, '0')).join('');
  const placeOf = (x, z) => x < 200 ? 'field' : (z < -200 ? 'camp' : 'city');
  const ready = (async () => {
    const out = {};
    try {
      const mod = await import('./props/ox.js');
      const build = mod.build || mod.buildOx || mod.default;
      if (typeof build === 'function') {
        for (const rec of oxen) { const real = build(THREE, { seed: rec.seed }); if (!real) continue;
          rec.wrap.remove(rec.inner); rec.wrap.add(real); rec.inner = real;
          rec.upd = real.userData?.update || mod.update || rec.upd; }
        out.ox = 'props/ox.js';
      } else out.ox = 'fallback (no build export)';
    } catch { out.ox = 'fallback (props/ox.js missing)'; }
    try {
      const glb = await readGlb(THREE, new URL('./assets/set/fire_set.glb', import.meta.url).href);
      if (glb) {
        const mats = {};
        const G = new THREE.Group(); G.name = 'glb.fire_set'; base.group.add(G);
        let n = 0;
        for (const root of glb.roots) for (const p of root.prims) {
          const key = (p.material || root.name).split('.')[0];
          const hex = hexOf(p.color || [0.5, 0.5, 0.5]);
          const mesh = new THREE.Mesh(p.geometry);
          mesh.applyMatrix4(root.matrix);
          mesh.geometry.computeBoundingBox();
          const c = mesh.geometry.boundingBox.getCenter(new THREE.Vector3());
          const place = placeOf(c.x, c.z), mk = place + ':' + key;
          mesh.material = mats[mk] || (mats[mk] = EMIT.has(key) ? basic(hex) : rkit.surface(place, hex, FINISH[key] || { grime: .4 }));
          mesh.frustumCulled = false; G.add(mesh); n++;
        }
        out.glb = `fire_set.glb (${n} meshes)`;
      } else out.glb = 'previz fallback (no GLB)';
    } catch (e) { out.glb = 'previz fallback (' + String(e).slice(0, 80) + ')'; }
    return out;
  })();

  // ---- marks (world [x,z]) + points (camera targets)
  const marks = {
    field_holeL: [FX - 2, FZ - 21], field_holeR: [FX + 3, FZ - 21], field_plain: [FX, FZ + 4], field_glow: [FX, FZ + 38],
    city_walkway: [CX, CZ - 4.5], city_walkwayL: [CX - 8, CZ - 4.5], city_walkwayR: [CX + 8, CZ - 4.5],
    city_courtyard: [CX, CZ + 9], city_map: [CX, CZ + 30], city_drum: [CX - 10, CZ - 4.6],
    camp_centre: [KX, KZ], camp_banner: [KX, KZ - 9], camp_entry: [KX, KZ - 13], camp_table: [KX - 3.2, KZ - 8.5],
  };
  const points = { heroOx: heroRec.wrap, mapBoard, banner: bannerPivot, wallDrum: drumMesh, fieldWallZ: -24, cityWalkwayY: 5 };

  // ---- update: PURE in t. Positions, gait phase (= travelled), flames, pins, banner, skies.
  const callOx = (rec, u) => { if (!rec.upd) return; try { rec.upd(rec.inner, u); } catch { try { rec.upd(u); } catch { /* builder fault: keep rendering */ } } };
  function update(t) {
    rig.update(t); rkit.update(t); base.update?.(t);
    // skies follow the light states (hard steps land on cuts, like rig states)
    skyField.set(t >= dawnT ? SKY_DAWN : SKY_NIGHT); skyCity.set(t >= dawnT ? SKY_DAWN : SKY_NIGHT);
    skyCamp.set(t >= dawnT ? SKY_DAWN : t >= attackT ? SKY_ATTACK : SKY_CAMP);
    // flame flicker (seeded sines)
    for (const f of flames) { const s = f.s * (.86 + .18 * Math.sin(t * 12.3 + f.seed * 3.1) + .08 * Math.sin(t * 27.7 + f.seed));
      f.mesh.scale.set(s, s * (1 + .16 * Math.sin(t * 16.9 + f.seed * 1.7)), s); }
    // map pins: dark through line 2 (staggered), relit at the end (staggered)
    { const lit = mapBoard.userData.pinLit, dark = mapBoard.userData.pinDark, n = mapMarkers.length;
      for (let i = 0; i < n; i++) { const off = mapOff[0] + (i / n) * (mapOff[1] - mapOff[0]) * .92, on = mapOn[0] + (i / n) * (mapOn[1] - mapOn[0]) * .92;
        mapMarkers[i].material = (t >= off && t < on) ? dark : lit; } }
    // banner falls over 1.5 s from bannerFallT, toward the camp centre (+Z)
    bannerPivot.rotation.x = 1.45 * smooth(t, bannerFallT, bannerFallT + 1.5);
    // HERO OX: hook run (line 1) -> herd front + stampede (lines 6-7) -> grazing at dawn (line 9).
    // Position jumps sit at t=20 / t=58, while city/camp are on screen (field is not).
    { const w = heroRec.wrap; let gait = 0, fire = 0, graze = false, dressed = true, travelled = 0;
      if (t < 20) { const u = smooth(t, OT.heroRun[0], OT.heroRun[1]); w.position.set(0, 0, lerp(-18, 28, u)); w.rotation.y = 0;
        gait = (t >= OT.heroRun[0] && t <= OT.heroRun[1]) ? 1 : 0; fire = t <= 6.2 ? 1 : 0; travelled = 46 * u; }
      else if (t < 58) { const u = smooth(t, OT.stampede[0], OT.stampede[1]); w.position.set(.5, 0, lerp(-22, 30, u)); w.rotation.y = 0;
        gait = (t >= OT.stampede[0] && t <= OT.stampede[1]) ? 1 : 0; fire = (t >= OT.fireOn && t <= 55.4) ? 1 : 0; travelled = 46 + 52 * u; }
      else { w.position.set(2, 0, 8); w.rotation.y = -.5; graze = true; dressed = false; travelled = 98; }
      callOx(heroRec, { t, gait, phase: travelled * 2.1, legPhase: travelled * 2.1, fire: !!fire, cloth: dressed, blades: dressed, straw: dressed, graze, headDown: graze ? 1 : 0, headYaw: graze ? .25 * Math.sin(t * .5) : 0 }); }
    // FIELD HERD: waiting at the holes, dressed from line 5, tails lit 37.3, stampede line 7
    herd.forEach((rec, i) => { const s = herdSlot(i); const u = smooth(t, OT.stampede[0] + s.delay, OT.stampede[1] + s.delay);
      rec.wrap.position.set(s.x + s.drift * u, 0, lerp(s.z, 30, u)); rec.wrap.rotation.y = (R1(i, 205) - .5) * .2;
      const gait = (t >= OT.stampede[0] + s.delay && t <= OT.stampede[1] + s.delay) ? 1 : 0;
      const dressed = t >= OT.dressFrom, fire = t >= OT.fireOn && t <= 55.4;
      callOx(rec, { t, gait, phase: (52 * u + i * 1.7) * 2.1, legPhase: (52 * u + i * 1.7) * 2.1, fire, cloth: dressed, blades: dressed, straw: dressed, graze: false, headDown: 0, headYaw: .18 * Math.sin(t * .45 + i * 2.3) }); });
    // CITY OXEN: standing rows in the courtyard, plain then dressed (line 5)
    cityOx.forEach((rec, i) => { const s = citySlot(i); rec.wrap.position.set(s.x, 0, s.z); rec.wrap.rotation.y = s.ry;
      const dressed = t >= OT.dressFrom;
      callOx(rec, { t, gait: 0, phase: i * 1.7, legPhase: i * 1.7, fire: false, cloth: dressed, blades: dressed, straw: dressed, graze: false, headDown: 0, headYaw: .2 * Math.sin(t * .4 + i * 1.9) }); });
    // CAMP OXEN: silhouettes with fire advancing from -Z through the ring gap (line 8)
    campOx.forEach((rec, i) => { const s = campSlot(i); rec.wrap.visible = t >= OT.campAdvance[0] - 0.01; const u = smooth(t, OT.campAdvance[0] + s.delay, OT.campAdvance[1] + s.delay);
      rec.wrap.position.set(s.x, 0, lerp(-16, -4, u)); rec.wrap.rotation.y = 0;
      const gait = (t >= OT.campAdvance[0] + s.delay && t <= OT.campAdvance[1] + s.delay) ? 1 : 0;
      callOx(rec, { t, gait, phase: (12 * u + i * 1.7) * 2.1, legPhase: (12 * u + i * 1.7) * 2.1, fire: t >= OT.campAdvance[0] && t <= 57, cloth: true, blades: true, straw: true, graze: false, headDown: 0, headYaw: .15 * Math.sin(t * .5 + i * 2.7) }); });
  }

  return { ...base, marks, points, rig, look, ready, update };
}
