// vermeer_forger set.js (ENVIRONMENT PASS, Blender build): the studio modelled in Blender
// (films/vermeer_forger/blender/build_studio.py -> assets/set/studio.glb), loaded live with the
// kit ground/marks as the base. Previz fallback: audit_v2/set_previz_backup.js (kit-box set).
// Handedness: cameras look down -Z from +Z, so +X = frame RIGHT (table left x-2.2, easel right x3.4).
import { createLightRig } from '../../world/look/lights.js';
import { createPost } from '../../world/look/post.js';
import { createRigShade } from '../../world/look/rigshade.js';
import { readGlb } from '../../world/look/glb.js';
import { createKit } from '../../world/look/rigkit.js';
import { basic, flat } from '../../engine/props/_kit.js';
import { vermeerTex } from './props/painting.js';

const DESC = {"name": "studio_room", "sky": "indoor", "sun": {"dir": [-0.5, 0.75, 0.45]}, "ground": [{"kind": "boards", "color": "#a87f55", "x": [-8, 8], "z": [-16, 60], "tile": 2.6}, {"color": "#8a6a48", "y": -0.01}], "stripes": [{"at": [0, 0.9], "size": [8, 3.6], "color": "#7a3a34", "tex": "cloth"}], "marks": {"table_c": [-2.2, 0.9], "han_home": [-1.4, 1.8], "inv_home": [-3.0, 0.0], "easel": [3.4, -0.6], "counter": [5.2, -1.4], "door": [-5.6, -15.3], "window": [3.8, -15.3], "center": [0, 1.2], "enter_l": [-7, 3], "enter_r": [7, 3]}, "points": {"tableH": 1.15, "counterH": 1.25, "seatY": 0.55, "wallZ": -3}, "bounds": {"x": [-8.5, 8.5], "z": [-16, 8]}, "boxes": [{"size": [0.3, 0.25, 0.3], "at": [2.9, 1.0, -0.5], "color": "#6e4f30", "tex": "planks"}, {"size": [0.55, 0.07, 0.4], "at": [-0.8, 0.03, 2.2], "color": "#5a3a5e", "ry": 20}, {"size": [1.5, 1.9, 0.06], "at": [7.85, 2.2, -9.0], "color": "#5d4023", "ry": -90}, {"size": [1.3, 1.7, 0.07], "at": [7.85, 2.3, -9.0], "color": "#e8dfc8", "ry": -90}]};

// one place, mirroring the kit sun (desc.sun.dir) so faces agree with walls, plus window spot + cool bounce.
// Colours are LINEAR (lights.js). Post/shading read this via rig.at/sample in later passes.
const PLACES = { studio: { sky: [0.62, 0.56, 0.44], ground: [0.30, 0.24, 0.17], fog: { color: '#e8dcc6', density: 0.004 },
  lights: [
    { id: 'sun', kind: 'sun', dir: [-0.5, 0.75, 0.45], color: [1.0, 0.92, 0.78], power: 1.0, wrap: 0.25 },
    { id: 'window', kind: 'spot', pos: [3.8, 4.2, -15.5], dir: [-0.2, -0.35, 0.9], cone: [40, 75], color: [1.0, 0.9, 0.72], power: 1.6, fall: 0.04, range: 30, wrap: 0.2 },
    { id: 'bounce', kind: 'point', pos: [-4, 1.2, 4], color: [0.4, 0.5, 0.72], power: 0.5, fall: 0.05, range: 22, wrap: 0.5 } ] } };

const EMIT = new Set(['bulb_warm', 'shade_warm', 'sky_pale', 'corridor_end']);
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
    blotches(g, S, 1400, .06, 2, 20, 5, ['#cbbfa4', '#fff8ea', '#b8a888']); blotches(g, S, 26, .10, 18, 60, 9, ['#a89070', '#8a7454']);
    g.strokeStyle = 'rgba(90,74,52,.35)'; g.lineWidth = 2; for (let i = 0; i < 7; i++) { const x = (i * 173) % S; g.beginPath(); g.moveTo(x, 0); g.lineTo(x + 14, S * .4); g.lineTo(x - 6, S * .75); g.stroke(); } });
  const planksTex = canvasTex(512, (g, S) => { g.fillStyle = '#d8c8a8'; g.fillRect(0, 0, S, S); const R = rng(11);
    for (let p = 0; p < 5; p++) { const y = p * S / 5; g.fillStyle = `rgba(${120 + R() * 40 | 0},${90 + R() * 30 | 0},${50 + R() * 20 | 0},.25)`; g.fillRect(0, y, S, S / 5);
      g.fillStyle = 'rgba(40,26,12,.8)'; g.fillRect(0, y, S, 3);
      for (let i = 0; i < 26; i++) { g.globalAlpha = .10 + R() * .12; g.strokeStyle = '#6a4a28'; g.lineWidth = 1 + R() * 2; g.beginPath();
        const gy = y + R() * S / 5; g.moveTo(0, gy); g.bezierCurveTo(S * .3, gy + 4 * (R() - .5), S * .7, gy + 4 * (R() - .5), S, gy); g.stroke(); } g.globalAlpha = 1; } });
  const stoneTex = canvasTex(512, (g, S) => { g.fillStyle = '#dedbd2'; g.fillRect(0, 0, S, S); blotches(g, S, 2000, .08, 1, 10, 21, ['#b8b4a6', '#f4f2ea', '#98927f']); });
  // 6x6 decal sheet: stains, streaks, scuffs (multiply marks on white)
  const decalTex = canvasTex(768, (g, S) => { g.fillStyle = '#ffffff'; g.fillRect(0, 0, S, S); const C = S / 6, R = rng(31);
    for (let cell = 0; cell < 36; cell++) { const cx = (cell % 6) * C + C / 2, cy = Math.floor(cell / 6) * C + C / 2, kind = cell % 3;
      if (kind === 0) { for (let i = 0; i < 9; i++) { g.globalAlpha = .10 + R() * .16; g.fillStyle = '#5a4630'; g.beginPath();
        g.ellipse(cx + (R() - .5) * C * .5, cy + (R() - .5) * C * .5, 8 + R() * C * .3, 6 + R() * C * .24, R() * 3, 0, 7); g.fill(); } }
      else if (kind === 1) { for (let i = 0; i < 6; i++) { g.globalAlpha = .12 + R() * .18; g.fillStyle = '#4a3a28'; const x = cx + (R() - .5) * C * .6;
        g.fillRect(x, cy - C * .45, 2 + R() * 4, C * (.4 + R() * .5)); } }
      else { for (let i = 0; i < 12; i++) { g.globalAlpha = .10 + R() * .2; g.strokeStyle = '#3a2e20'; g.lineWidth = 1 + R() * 2; g.beginPath();
        const x = cx + (R() - .5) * C * .6, y = cy + (R() - .5) * C * .6; g.moveTo(x, y); g.lineTo(x + (R() - .5) * C * .5, y + (R() - .5) * C * .5); g.stroke(); } } }
    g.globalAlpha = 1; });
  decalTex.wrapS = decalTex.wrapT = THREE.ClampToEdgeWrapping;

  const rkit = createKit(THREE, rig, { shadow: base.uniforms || {}, group: base.group });
  const FINISH = {
    wall_plaster: { map: plasterTex, uv: 3, tile: [5, 5], grime: .5, bump: .05 },
    wall_far: { map: plasterTex, uv: 3, tile: [5, 5], grime: .55, bump: .05 },
    reveal: { map: plasterTex, uv: 3, tile: [2, 2], grime: .25 },
    wood_dark: { map: planksTex, uv: 3, tile: [3, 3], grime: .4, gloss: 18, spec: .25 },
    wood_mid: { map: planksTex, uv: 3, tile: [3, 3], grime: .4, gloss: 14, spec: .2 },
    wood_light: { map: planksTex, uv: 3, tile: [3, 3], grime: .3, gloss: 14, spec: .2 },
    stone: { map: stoneTex, uv: 3, tile: [2, 2], grime: .3 },
    iron: { gloss: 40, spec: .5, grime: .35 }, brass: { gloss: 70, spec: 1.1, grime: .2 },
    gold_frame: { gloss: 55, spec: .8, grime: .25 },
    house_wall: { map: plasterTex, uv: 3, tile: [6, 6], grime: .5 }, roof_dark: { grime: .5 },
    tree_green: { grime: .2 }, canvas_cream: { grime: .3 }, paper: { grime: .15 },
  };

  // the Blender studio: geometry + material names; rigkit surfaces (lit by the rig: pools of light along the depth),
  // basic() for emitters. Decals: stains/streaks/scuffs where they gather (seams, corners, under windows, floor edge).
  const ready = (async () => {
    const glb = await readGlb(THREE, new URL('./assets/set/studio.glb', import.meta.url).href);
    if (!glb) return { glb: false };
    const mats = {};
    const G = new THREE.Group(); G.name = 'glb.studio'; base.group.add(G);
    const SHADE_TINTS = ['#ffdf8a', '#d8ecc8', '#e8c88a', '#f4ead2', '#ffdf8a', '#d8ecc8', '#e8c88a', '#f4ead2', '#ffdf8a'];
    for (const root of glb.roots) for (const p of root.prims) {
      const key = (p.material || root.name).split('.')[0];
      const hex = hexOf(p.color || [0.5, 0.5, 0.5]);
      const lm = /^lamp(\d+)_shade$/.exec(p.node || '');
      const m = lm ? (mats['shade' + lm[1]] || (mats['shade' + lm[1]] = basic(SHADE_TINTS[+lm[1] % SHADE_TINTS.length])))
        : (mats[key] || (mats[key] = EMIT.has(key) ? basic(hex) : rkit.surface('studio', hex, FINISH[key] || { grime: .3 })));
      const mesh = new THREE.Mesh(p.geometry, m);
      mesh.applyMatrix4(root.matrix); mesh.frustumCulled = false; G.add(mesh);
    }
    const D = [];
    const put = (cell, pos, normal, size, alpha = .95, spin = 0) => D.push({ cell, pos, normal, size: size * 1.3, alpha, spin });
    for (const x of [-3.6, 0.2, 3.8]) put(1, [x, 1.2, -15.9], [0, 0, 1], 1.6, .7, x);        // damp streaks under windows
    for (const x of [-6.5, -2.2, 1.8, 5.5]) put(0, [x, 0.45, -15.9], [0, 0, 1], 2.2, .75, x * 2); // grime at far-wall base
    put(2, [-5.6, 0.35, -15.9], [0, 0, 1], 1.8, .8, 1); put(2, [-5.6, 2.9, -15.9], [0, 0, 1], 1.4, .6, 3); // door scuffs
    for (const z of [-12, -7, -2, 3]) { put(0, [-7.75, 0.5, z], [1, 0, 0], 2.0, .7, z); put(0, [7.75, 0.5, z + 1], [-1, 0, 0], 2.0, .7, z + 1); }
    for (const z of [-10, -5, 0]) { put(1, [-7.75, 4.4, z], [1, 0, 0], 1.5, .55, z); put(1, [7.75, 4.2, z + 2], [-1, 0, 0], 1.5, .55, z + 2); }
    for (const [x, z] of [[-2.2, 0.55], [3.4, -0.6], [0, 2.5], [-4, -2], [4.5, 1.5], [1, -5]]) put(2, [x, 0.02, z], [0, 1, 0], 1.7, .65, x + z); // floor scuffs
    put(0, [-1.75, 5.6, -15.9], [0, 0, 1], 1.8, .5, 2); put(0, [2.0, 5.8, -15.9], [0, 0, 1], 1.8, .5, 5); // above paintings
    put(2, [3.4, 0.02, -0.6], [0, 1, 0], 2.0, .95, 7); put(0, [3.2, 1.4, -3.4], [0, 0, 1], 1.6, .8, 4); // paint wear at the easel
    put(2, [4.2, 0.02, -1.6], [0, 1, 0], 1.6, .9, 9); put(1, [-2.2, 0.02, 0.55], [0, 1, 0], 1.8, .85, 3);
    rkit.decals('studio', D, decalTex, { parent: G });
    return { glb: true };
  })();

  // painted canvases inside the Blender gold frames (real texture, not colour blocks)
  for (const [x, v] of [[-1.75, 1], [2.0, 2]]) {
    const g = new THREE.Mesh(new THREE.PlaneGeometry(1.45, 2.05), basic('#ffffff', { map: vermeerTex(v) }));
    g.position.set(x, 3.65, -15.82); g.frustumCulled = false; base.group.add(g);
  }
  const lp = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 2.2), basic('#ffffff', { map: vermeerTex(3) }));
  lp.position.set(-7.66, 3.4, -1.2); lp.rotation.y = Math.PI / 2; lp.frustumCulled = false; base.group.add(lp);

  return { ...base, rig, look, ready, update(t) { rig.update(t); base.update?.(t); } };
}
