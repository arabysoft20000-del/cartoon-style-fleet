// scenes/set.js — previz set for the NEW Mincemeat film (made new from this voice only).
// 7 places, 400 D apart, lights as data (world/look/lights.js), surfaces from world/look/rigkit.js.
// Pure in t: seeded rng at build only, no wall-clock reads, update(t) computes from t alone.
// Places (origins [x,z]): A Spanish shore dawn [0,0] · B submarine deck night [400,0] · C London office [800,0]
//   D Spanish morgue [0,-400] · E German map room [400,-400] · F Sicily beach [800,-400] · G cemetery [0,400]
// Camera looks -Z; faces stand at z ~ +1 local, every place runs >= 25 D deep behind them.
import { createLightRig } from '../world/look/lights.js';
import { createKit } from '../world/look/rigkit.js';

const ORIGINS = { A: [0, 0], B: [400, 0], C: [800, 0], D: [0, -400], E: [400, -400], F: [800, -400], G: [0, 400] };
const norm = v => { const l = Math.hypot(...v) || 1; return v.map(x => x / l); };
const W = (o, x, y, z) => [o[0] + x, y, o[1] + z];              // local -> world (lights live in world space)
const rnd = s => () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);   // seeded, build-time scatter only
const smooth = (a, b, x) => { const u = Math.min(1, Math.max(0, (x - a) / Math.max(.001, b - a))); return u * u * (3 - 2 * u); };

// ---- light drivers: pure functions of t (a flickering lantern, a blinking signal lamp)
const drivers = {
  lantern: t => .88 + .12 * Math.sin(t * 11.3) * Math.sin(t * 5.7 + 1.3),
  signal: t => .2 + .8 * Math.pow(Math.max(0, Math.sin(t * 2.4)), 3),
};

// ---- lights as data: one entry per place, colours linear, at most 8 lights, 2+ visible practicals each
const SUN_A = norm([-.3, .14, -1]), MOON_B = norm([.4, .8, -.3]), SUN_F = norm([-.5, .74, .45]), SUN_G = norm([.35, .16, -1]);
const PLACES = {
  A: { sky: [.30, .36, .46], ground: [.16, .15, .12], fog: { color: '#8fa0ae', density: .004 },
    lights: [
      { id: 'sun', kind: 'sun', dir: SUN_A, color: [1, .62, .34], power: 1.1, wrap: .3 },
      { id: 'lantern', kind: 'point', pos: W(ORIGINS.A, -.6, 1.0, 1.9), color: [1, .58, .24], power: 2.4, fall: .12, range: 15, wrap: .2, drive: 'lantern', gobo: { kind: 'cage', bars: 6, rings: 3, depth: .6 } },
      { id: 'boatlamp', kind: 'point', pos: W(ORIGINS.A, -6, 2.0, -8), color: [1, .6, .28], power: 1.3, fall: .08, range: 18, wrap: .25, drive: 'lantern' } ] },
  B: { sky: [.03, .05, .08], ground: [.01, .015, .02], fog: { color: '#06121c', density: .006 },
    lights: [
      { id: 'moon', kind: 'sun', dir: MOON_B, color: [.55, .68, .9], power: .5, wrap: .35 },
      { id: 'towerlamp', kind: 'point', pos: W(ORIGINS.B, 0, 4.8, -13), color: [1, .72, .4], power: 3.2, fall: .06, range: 32, wrap: .15, gobo: { kind: 'cage', bars: 8, rings: 3, depth: .7 } },
      { id: 'decklantern', kind: 'point', pos: W(ORIGINS.B, -.4, 1.8, 1.7), color: [1, .6, .26], power: 2.6, fall: .12, range: 15, wrap: .2, drive: 'lantern', gobo: { kind: 'cage', bars: 6, rings: 3, depth: .6 } },
      { id: 'sternlamp', kind: 'point', pos: W(ORIGINS.B, 1.5, 1.6, -26), color: [.6, .75, 1], power: .9, fall: .07, range: 20, wrap: .3 } ] },
  C: { sky: [.10, .09, .07], ground: [.05, .04, .03], fog: { color: '#17130e', density: .01 }, ao: { floor: 0, h: 1.6, amt: .4 },
    lights: [
      { id: 'desklamp', kind: 'spot', pos: W(ORIGINS.C, 1.5, 2.7, -1.5), dir: [0, -1, .15], cone: [30, 65], color: [1, .66, .3], power: 3.4, fall: .1, range: 17, wrap: .15 },
      { id: 'maplamp', kind: 'point', pos: W(ORIGINS.C, -2.2, 2.5, -4.5), color: [1, .62, .28], power: 2.1, fall: .1, range: 15, wrap: .2 },
      { id: 'corridor', kind: 'point', pos: W(ORIGINS.C, 3.4, 3.2, -24), color: [.95, .8, .55], power: 2.8, fall: .05, range: 28, wrap: .25 },
      { id: 'window', kind: 'spot', pos: W(ORIGINS.C, -6.6, 4.6, -6), dir: [.55, -.6, .2], cone: [25, 55], color: [.45, .58, .85], power: 1.5, fall: .06, range: 22, wrap: .3 } ] },
  D: { sky: [.14, .18, .17], ground: [.06, .07, .06], fog: { color: '#10181a', density: .008 }, ao: { floor: 0, h: 1.6, amt: .35 },
    lights: [
      { id: 'ceiling1', kind: 'point', pos: W(ORIGINS.D, 0, 5.2, -3), color: [.85, .95, .9], power: 2.8, fall: .07, range: 20, wrap: .25 },
      { id: 'ceiling2', kind: 'point', pos: W(ORIGINS.D, -2, 5.2, -18), color: [.8, .92, .88], power: 2.0, fall: .06, range: 20, wrap: .25 },
      { id: 'desklamp', kind: 'point', pos: W(ORIGINS.D, -1.5, 2.3, -1.5), color: [1, .7, .4], power: 1.7, fall: .12, range: 11, wrap: .2 },
      { id: 'window', kind: 'spot', pos: W(ORIGINS.D, 7.6, 5.0, -8), dir: [-.45, -.8, .1], cone: [20, 50], color: [.75, .85, .95], power: 2.2, fall: .06, range: 24, wrap: .3 } ] },
  E: { sky: [.09, .06, .04], ground: [.04, .03, .02], fog: { color: '#140d07', density: .009 }, ao: { floor: 0, h: 1.6, amt: .45 },
    lights: [
      { id: 'maplamp1', kind: 'spot', pos: W(ORIGINS.E, 0, 4.8, 2), dir: [0, -1, 0], cone: [35, 70], color: [1, .6, .26], power: 3.4, fall: .08, range: 19, wrap: .15 },
      { id: 'maplamp2', kind: 'spot', pos: W(ORIGINS.E, 0, 4.8, -4), dir: [0, -1, 0], cone: [35, 70], color: [1, .6, .26], power: 3.4, fall: .08, range: 19, wrap: .15 },
      { id: 'maplamp3', kind: 'spot', pos: W(ORIGINS.E, 0, 4.8, -10), dir: [0, -1, 0], cone: [35, 70], color: [1, .6, .26], power: 3.2, fall: .08, range: 19, wrap: .15 },
      { id: 'wallspot', kind: 'spot', pos: W(ORIGINS.E, 0, 5.2, -24), dir: [0, -.45, -1], cone: [25, 55], color: [1, .68, .34], power: 2.4, fall: .05, range: 26, wrap: .2 },
      { id: 'backlamp', kind: 'point', pos: W(ORIGINS.E, -4, 3.4, -28), color: [1, .58, .24], power: 1.7, fall: .07, range: 22, wrap: .25 } ] },
  F: { sky: [.5, .56, .62], ground: [.3, .26, .18], fog: { color: '#d8c9a8', density: .003 },
    lights: [
      { id: 'sun', kind: 'sun', dir: SUN_F, color: [1, .95, .82], power: 1.15, wrap: .25 },
      { id: 'signallamp', kind: 'point', pos: W(ORIGINS.F, -3, 3.4, -6), color: [1, .8, .45], power: 1.4, fall: .09, range: 16, wrap: .2, drive: 'signal' },
      { id: 'cratelamp', kind: 'point', pos: W(ORIGINS.F, 3.2, 1.9, -1.6), color: [1, .85, .55], power: .8, fall: .1, range: 11, wrap: .25, drive: 'lantern' } ] },
  G: { sky: [.22, .26, .34], ground: [.08, .09, .07], fog: { color: '#6a7684', density: .005 },
    lights: [
      { id: 'sun', kind: 'sun', dir: SUN_G, color: [.95, .6, .38], power: .85, wrap: .3 },
      { id: 'chapelwindow', kind: 'point', pos: W(ORIGINS.G, 6, 3.2, -17.4), color: [1, .72, .4], power: 1.9, fall: .07, range: 19, wrap: .25 },
      { id: 'gravelantern', kind: 'point', pos: W(ORIGINS.G, 1.3, 1.2, -1.4), color: [1, .6, .26], power: 1.7, fall: .12, range: 13, wrap: .2, drive: 'lantern', gobo: { kind: 'cage', bars: 6, rings: 3, depth: .6 } } ] },
};

export async function buildSet(THREE, scene, opts = {}, kit) {
  const group = new THREE.Group(); group.name = 'set.mincemeat-new'; scene.add(group);
  const lightDir = SUN_A;   // the character shadow pass reads one sun: the opening place's dawn sun
  const SH = { uShadowMap: { value: null }, uShadowMatrix: { value: new THREE.Matrix4() }, uShadowOn: { value: 0 },
    uShadowTexel: { value: 1 / 2048 }, uShadowSoft: { value: 1.2 }, uShadowBias: { value: .0006 }, uSunDir: { value: new THREE.Vector3(...lightDir) } };
  const rig = createLightRig(THREE, PLACES, drivers);
  const K = createKit(THREE, rig, { shadow: SH, group });
  const casters = [];

  // foam/noise picture for the water shader (seeded, no files)
  const foamTex = (() => { const n = 64, d = new Uint8Array(n * n * 4), R = rnd(41);
    for (let i = 0; i < n * n; i++) { const v = 110 + R() * 145 | 0; d[i * 4] = v; d[i * 4 + 1] = v; d[i * 4 + 2] = v; d[i * 4 + 3] = 255; }
    const t = new THREE.DataTexture(d, n, n); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.needsUpdate = true; return t; })();

  const matCache = new Map();
  const M = (place, color, o = {}) => { const k = place + '|' + color + '|' + JSON.stringify(o);
    if (!matCache.has(k)) matCache.set(k, K.surface(place, color, { uv: 1, tile: [4, 4], grime: .3, ...o })); return matCache.get(k); };
  const placeGroup = key => { const g = new THREE.Group(); g.name = 'place.' + key; g.position.set(ORIGINS[key][0], 0, ORIGINS[key][1]); group.add(g); return g; };
  const add = (geo, m, x, y, z, parent, rot) => { const o = new THREE.Mesh(geo, m); o.position.set(x, y, z); if (rot) o.rotation.set(rot[0] || 0, rot[1] || 0, rot[2] || 0); parent.add(o); return o; };
  const box = (w, h, d, m, x, y0, z, parent, o = {}) => { const b = add(new THREE.BoxGeometry(w, h, d), m, x, y0 + h / 2, z, parent, o.rot); if (o.cast) casters.push(b); return b; };
  const cyl = (r, h, m, x, y0, z, parent, o = {}) => { const c = add(new THREE.CylinderGeometry(r, r, h, o.seg || 14), m, x, y0 + h / 2, z, parent, o.rot); if (o.cast) casters.push(c); return c; };
  const plane = (w, d, m, x, y, z, parent) => add(new THREE.PlaneGeometry(w, d), m, x, y, z, parent, [-Math.PI / 2, 0, 0]);
  const water = (place, o, w, d, x, y, z, parent) => plane(w, d, K.water(place, { ...o, map: foamTex }), x, y, z, parent);
  const sky = (key, o) => { const s = K.sky(ORIGINS[key][0], ORIGINS[key][1], 170, o); s.mesh.material.depthWrite = true; s.mesh.renderOrder = -10; return s; };
  // a visible practical: a small emissive fixture where its light sits
  const fixture = (place, x, y, z, parent, color = '#ffca7a', s = .3) => box(s, s * 1.25, s, M(place, color, { emit: 1.4, grime: 0 }), x, y - s * .6, z, parent);
  const deskLamp = (place, x, y, z, parent, shade = '#2e6b4f') => { cyl(.05, .7, M(place, '#3a3a3a', { gloss: 40, spec: .5 }), x, y, z, parent);
    box(.55, .3, .4, M(place, shade, { emit: .5, gloss: 30, spec: .4 }), x, y + .7, z, parent); fixture(place, x, y + .68, z + .1, parent, '#ffd9a0', .16); };
  const hangingLamp = (place, x, y, z, parent) => { cyl(.03, 2.2, M(place, '#2c2a26'), x, y, z, parent); fixture(place, x, y - .1, z, parent, '#ffca7a', .34); };

  // ================= A · Spanish shore at dawn [0,0] — faces: fisherman [-1.2,1]
  { const g = placeGroup('A'), R = rnd(7);
    sky('A', { top: '#3d4f6e', hor: '#e8b07a', low: '#5a6a7a', cloudLit: '#d9c4b0', cloudDark: '#46586e', sun: SUN_A, sunColor: [.9, .5, .25], cover: .45, scale: 1.2 });
    plane(160, 44, M('A', '#d9c49a'), 0, 0, 12, g);                                   // sand, running behind the camera too
    plane(160, 5, M('A', '#b39b72', { wet: .8, gloss: 50, spec: .6 }), 0, .01, -3.5, g); // wet band at the waterline
    water('A', { deep: [.05, .12, .16], skyTop: [.35, .42, .55], skyHor: [.85, .6, .4], chop: .3, foam: .25 }, 260, 130, 0, -.3, -70, g);
    for (let i = 0; i < 12; i++) { const x = -22 + R() * 44, z = -4 - R() * 3.5, s = .5 + R() * 1.1;   // rocks along the waterline
      if (Math.abs(x) < 3.5) continue; const r = add(new THREE.SphereGeometry(.5, 10, 8), M('A', '#6a6f72'), x, s * .25, z, g); r.scale.set(s * 1.4, s * .7, s); casters.push(r); }
    const boat = new THREE.Group(); boat.name = 'A_boat'; boat.position.set(-6, 0, -8); boat.rotation.y = .5; g.add(boat);
    box(5.2, 1.1, 1.9, M('A', '#7a5a3a'), 0, 0, 0, boat, { cast: true }); box(5.6, .25, 2.2, M('A', '#5d4630'), 0, 1.1, 0, boat);
    cyl(.07, 3.4, M('A', '#5d4630'), .6, 1.2, 0, boat, { cast: true }); fixture('A', -2.4, 1.9, 0, boat);   // stern lamp (boatlamp light)
    box(9, 1.0, 1.6, M('A', '#4c565e'), 19, -.55, -32, g);                              // a second boat, far off (depth)
    box(46, 3.2, 10, M('A', '#55606a'), -42, -.4, -48, g);                              // headland
    box(1.1, .8, .9, M('A', '#9a7048'), 3.6, 0, -1, g, { cast: true }); box(.8, .55, .7, M('A', '#a87c52'), 3.5, .8, -.9, g, { cast: true });
    box(1.1, .8, .9, M('A', '#9a7048'), -3.2, 0, 2.6, g, { cast: true });
    cyl(.09, 1.6, M('A', '#5d4630'), -5, 0, -2.5, g, { cast: true }); cyl(.09, 1.6, M('A', '#5d4630'), 5.4, 0, -2.8, g, { cast: true });  // net posts
    box(.5, .45, .5, M('A', '#8a6a44'), -.6, 0, 1.9, g); fixture('A', -.6, .75, 1.9, g);  // the fisherman's lantern on a crate
  }

  // ================= B · British submarine deck at night [400,0] — faces: british_officer [-1,1]
  { const g = placeGroup('B');
    sky('B', { top: '#060b16', hor: '#16222e', low: '#0a141e', cloudLit: '#2a3a4a', cloudDark: '#0a121c', sun: MOON_B, sunColor: [.4, .5, .7], cover: .5, scale: 1.1 });
    water('B', { deep: [.008, .03, .05], skyTop: [.05, .08, .14], skyHor: [.12, .18, .26], chop: .5, foam: .3 }, 280, 280, 0, -1.3, -20, g);
    const sub = new THREE.Group(); sub.name = 'B_sub'; g.add(sub);
    box(6, 1.2, 48, M('B', '#2c3136', { wet: .9, gloss: 60, spec: .8 }), 0, -1.2, -10, sub, { cast: true });        // deck slab, z -34..14
    box(7.5, .8, 48, M('B', '#23272c', { wet: .8, gloss: 50, spec: .6 }), 0, -2.0, -10, sub);                        // hull shoulder into the sea
    box(3.4, 4.4, 7, M('B', '#33383e', { wet: .6, gloss: 40, spec: .5 }), 0, 0, -16.5, sub, { cast: true });          // conning tower
    box(2.4, 1.6, 4, M('B', '#2c3136'), 0, 4.4, -16.5, sub, { cast: true });
    cyl(.09, 2.6, M('B', '#1d2024'), .4, 6.0, -17.5, sub); cyl(.07, 1.8, M('B', '#1d2024'), -.5, 6.0, -15.5, sub);      // periscopes
    fixture('B', 0, 4.9, -12.9, sub, '#ffd9a0', .36);                                                                  // tower lamp
    cyl(.06, 1.8, M('B', '#1d2024'), -.4, 0, 1.7, sub, { cast: true }); fixture('B', -.4, 1.95, 1.7, sub);              // shielded deck lantern
    cyl(.06, 1.6, M('B', '#1d2024'), 1.5, 0, -26, sub, { cast: true }); fixture('B', 1.5, 1.75, -26, sub, '#bcd4ff', .3); // stern lamp
    box(1.6, .5, 1.6, M('B', '#3a3f45'), -1.6, 0, -7, sub, { cast: true });                                            // hatch
    cyl(.55, .5, M('B', '#6b5a3e'), 1.9, 0, -4, sub, { cast: true });                                                  // coiled rope drum
    box(1.1, .8, .9, M('B', '#5d4a32'), 1.8, 0, -10, sub, { cast: true });
    for (let z = -30; z <= 10; z += 4) cyl(.05, 1.1, M('B', '#1d2024'), 2.8, 0, z, sub);                               // rail stanchions
    box(.07, .07, 42, M('B', '#1d2024'), 2.8, 1.05, -10, sub);
  }

  // ================= C · London intelligence office [800,0] — faces: british_officer [-1,1]
  { const g = placeGroup('C');
    sky('C', { top: '#141210', hor: '#1a1712', low: '#100e0b', cover: 0 });
    const wallM = M('C', '#8a7a5e', { uv: 3 }), floorM = M('C', '#6a5138');
    plane(14.4, 18, floorM, 0, 0, -1, g); plane(2.6, 20, floorM, 3.4, .005, -18.5, g);          // room floor + corridor floor (far end -28)
    box(14.4, 7, .4, wallM, 0, 0, -9.2, g); box(.4, 7, 18, wallM, -7.2, 0, -1, g); box(.4, 7, 18, wallM, 7.2, 0, -1, g);
    box(.4, 7, 19, wallM, 2.0, 0, -18.5, g); box(.4, 7, 19, wallM, 4.8, 0, -18.5, g); box(3.2, 7, .4, wallM, 3.4, 0, -28.2, g);
    box(14.4, .3, 18, M('C', '#4a4034'), 0, 7, -1, g); box(3.2, .3, 19, M('C', '#4a4034'), 3.4, 7, -18.5, g);   // ceilings
    box(1.8, 3.4, .15, M('C', '#3f4a3a'), 3.4, 0, -9.0, g);                                     // doorway into the corridor (dark opening read)
    box(2.2, 3.2, .12, M('C', '#ffd9a0', { emit: .8, grime: 0 }), 3.4, 0, -27.9, g);              // lit door at the corridor's end
    fixture('C', 3.4, 3.4, -24, g, '#ffe2b0', .3);                                              // corridor light
    box(3.4, .18, 1.6, M('C', '#7a5c3a'), 1.5, 1.15, -1.5, g, { cast: true });                    // desk at C_desk
    box(.9, 1.15, 1.4, M('C', '#6a4e30'), .1, 0, -1.5, g, { cast: true }); box(.9, 1.15, 1.4, M('C', '#6a4e30'), 2.9, 0, -1.5, g, { cast: true });
    deskLamp('C', 1.5, 1.33, -1.9, g);                                                           // green desk lamp (desklamp light)
    box(4.2, .18, 2.4, M('C', '#7a5c3a'), -2.2, 1.15, -4.5, g, { cast: true });                   // map table
    box(3.6, 1.15, 2.0, M('C', '#6a4e30'), -2.2, 0, -4.5, g, { cast: true });
    plane(3.8, 2.0, M('C', '#d8cfb0', { grime: .15 }), -2.2, 1.34, -4.5, g);                      // the map on it
    deskLamp('C', -2.2, 1.33, -5.3, g);                                                          // second desk lamp (maplamp light)
    box(5.5, 3.4, .15, M('C', '#d8cfb0', { grime: .15 }), -2.2, 2.6, -8.95, g);                    // wall map board
    box(5.9, 3.8, .1, M('C', '#4a3826'), -2.2, 2.4, -9.05, g);
    box(.15, 2.6, 3.4, M('C', '#9fb6d8', { emit: .55, grime: 0 }), -6.95, 2.4, -6, g);             // blackout window glow (window light)
    box(.2, 2.6, 1.2, M('C', '#2c2c34'), -6.9, 2.4, -4.6, g);                                     // curtain half-drawn
    for (let i = 0; i < 4; i++) box(1.1, .7, .9, M('C', '#8a6a44'), 5.9, i * .72, -3.2 - (i % 2) * 1.6, g, { cast: true });  // filing boxes
    box(1.6, 3.4, .9, M('C', '#5a5148'), 6.1, 0, -6.5, g, { cast: true });                        // cabinet
    box(.9, 1.7, .9, M('C', '#7a5c3a'), -.5, 0, -2.2, g, { cast: true });                         // side table with papers
    box(.8, .06, .6, M('C', '#e8e0c8', { grime: .1 }), -.5, 1.7, -2.2, g);
  }

  // ================= D · Spanish morgue / police office [0,-400] — faces: policeman [-1,1.2]
  { const g = placeGroup('D');
    sky('D', { top: '#10161a', hor: '#141c1e', low: '#0c1214', cover: 0 });
    const wallM = M('D', '#c8d4cc', { uv: 3, gloss: 25, spec: .3 }), floorM = M('D', '#9fb3ac', { gloss: 35, spec: .4 });
    plane(16.4, 19, floorM, 0, 0, -1.5, g); plane(2.6, 21, floorM, -2, .005, -19.5, g);           // room + corridor (far end -30)
    box(16.4, 6.4, .4, wallM, 0, 0, -10.2, g); box(.4, 6.4, 19, wallM, -8.2, 0, -1.5, g); box(.4, 6.4, 19, wallM, 8.2, 0, -1.5, g);
    box(.4, 6.4, 20, wallM, -3.4, 0, -19.5, g); box(.4, 6.4, 20, wallM, -.6, 0, -19.5, g); box(3.2, 6.4, .4, wallM, -2, 0, -29.7, g);
    box(16.4, .3, 19, M('D', '#7a8a84'), 0, 6.4, -1.5, g); box(3.2, .3, 20, M('D', '#7a8a84'), -2, 6.4, -19.5, g);
    box(16.4, 1.6, .1, M('D', '#8fa8a0', { gloss: 40, spec: .4 }), 0, 0, -9.95, g);                // tile band low on the back wall
    box(1.8, 3.4, .15, M('D', '#33403c'), -2, 0, -10.0, g);                                       // corridor doorway
    fixture('D', 0, 5.5, -3, g, '#e8f4ec', .5); fixture('D', -2, 5.5, -18, g, '#e8f4ec', .5);      // ceiling panels (ceiling1/2 lights)
    box(2.4, .16, 1.0, M('D', '#b8c4c8', { gloss: 70, spec: .9, wet: .5 }), 1.5, 1.05, -1.0, g, { cast: true });  // examination table at D_table
    box(.18, 1.05, .8, M('D', '#8a969c', { gloss: 50, spec: .6 }), .5, 0, -1.0, g, { cast: true }); box(.18, 1.05, .8, M('D', '#8a969c', { gloss: 50, spec: .6 }), 2.5, 0, -1.0, g, { cast: true });
    box(2.8, .16, 1.4, M('D', '#6a5a44'), -1.5, 1.12, -1.5, g, { cast: true });                    // desk at D_desk
    box(2.4, 1.12, 1.1, M('D', '#5a4c38'), -1.5, 0, -1.5, g, { cast: true });
    deskLamp('D', -1.5, 1.28, -1.9, g, '#4a4a52');                                                // desk lamp
    box(.15, 2.0, 3.2, M('D', '#cfe0ea', { emit: .6, grime: 0 }), 7.95, 3.6, -8, g);               // high window (window light)
    box(.2, 2.2, .18, M('D', '#5a6a64'), 7.9, 3.5, -9.4, g); box(.2, 2.2, .18, M('D', '#5a6a64'), 7.9, 3.5, -6.6, g);
    for (let i = 0; i < 3; i++) box(1.0, .65, .85, M('D', '#9a7c52'), -6.8, i * .67, -4 - i * .4, g, { cast: true });  // file boxes
    box(1.8, 3.6, .8, M('D', '#7a8a84', { gloss: 30, spec: .3 }), -6.9, 0, -7.5, g, { cast: true });  // cabinet
    box(1.4, .1, .7, M('D', '#e8e0c8', { grime: .1 }), -1.2, 1.28, -1.2, g);                       // papers on the desk
  }

  // ================= E · German map room [400,-400] — faces: german_officer [0,1]; counters slide on the table
  const counters = [];
  { const g = placeGroup('E');
    sky('E', { top: '#171009', hor: '#1c130a', low: '#120c06', cover: 0 });
    const wallM = M('E', '#6e5a42', { uv: 3 }), floorM = M('E', '#4e3d2a');
    plane(22.4, 41, floorM, 0, 0, -12, g);                                                        // far wall at -32
    box(22.4, 7.4, .4, wallM, 0, 0, -32.2, g); box(.4, 7.4, 41, wallM, -11.2, 0, -12, g); box(.4, 7.4, 41, wallM, 11.2, 0, -12, g);
    box(22.4, .3, 41, M('E', '#3a2d1e'), 0, 7.4, -12, g);
    box(6.4, .2, 18.5, M('E', '#5d4630'), 0, 1.15, -4, g, { cast: true });                         // the big map table (centre E_map [0,-2])
    box(5.6, 1.15, 17.5, M('E', '#4c3824'), 0, 0, -4, g, { cast: true });
    plane(5.8, 17.8, M('E', '#d3c49c', { grime: .12 }), 0, 1.36, -4, g);                           // the Europe map on top
    plane(5.8, 5.5, M('E', '#b8c4b0', { grime: .12 }), 0, 1.37, -9.5, g);                          // north land mass tone
    box(1.2, .12, .8, M('E', '#a8b898', { grime: .1 }), .4, 1.36, 2.2, g);                         // Sicily, small, at the south end
    box(1.4, .12, 1.0, M('E', '#a8b898', { grime: .1 }), -1.9, 1.36, -3.4, g);                     // Sardinia, west
    box(1.6, .12, 1.1, M('E', '#a8b898', { grime: .1 }), 1.9, 1.36, -5.2, g);                      // Greece, east
    for (const z of [2, -4, -10]) hangingLamp('E', 0, 5.0, z, g);                                 // hanging map lamps (maplamp1..3)
    box(12, 6, .18, M('E', '#d3c49c', { grime: .12 }), 0, 1.2, -31.9, g);                           // far wall map
    box(12.6, 6.6, .12, M('E', '#3a2d1e'), 0, 1.0, -32.0, g);
    fixture('E', 0, 5.5, -23.8, g, '#ffca7a', .4);                                                // wall-map spotlight fixture
    fixture('E', -4, 3.6, -27.8, g, '#ffca7a', .3);                                               // back lamp (backlamp light)
    cyl(.05, 2.6, M('E', '#2c2a26'), -4, 0, -27.8, g, { cast: true });
    for (const [x, z] of [[-4.2, 0], [4.2, -2], [-4.2, -8], [4.2, -10]]) { cyl(.3, .55, M('E', '#5d4630'), x, 0, z, g, { cast: true }); }  // stools
    box(2.2, .14, 1.2, M('E', '#5d4630'), -6.5, 1.1, -6, g, { cast: true }); box(1.8, 1.1, 1.0, M('E', '#4c3824'), -6.5, 0, -6, g, { cast: true });  // side table
    box(1.6, .06, .9, M('E', '#e8e0c8', { grime: .1 }), -6.5, 1.24, -6, g);                        // papers
    const cg = new THREE.Group(); cg.name = 'E_counters'; cg.position.set(0, 1.42, -2); g.add(cg);
    const cm = M('E', '#6b6f6a', { gloss: 20, spec: .2 });
    for (let i = 0; i < 6; i++) { const c = box(.5, .32, .5, cm, 0, 0, 0, cg, { cast: true });
      const start = [(i % 3 - 1) * .7, 0, 4.4 + Math.floor(i / 3) * .7];                          // clustered on Sicily (south end)
      const end = i < 3 ? [1.9 + (i - 1) * .7, 0, -3.2] : [-1.9 + ((i - 3) - 1) * .7, 0, -1.4];   // Greece (east) / Sardinia (west)
      c.position.set(start[0], .16, start[2]); counters.push({ o: c, start, end }); }
    var countersGroup = cg;
  }

  // ================= F · Sicily landing beach [800,-400] — faces: allied_soldier [0,1]
  { const g = placeGroup('F');
    sky('F', { top: '#6fa3dc', hor: '#e8e0c8', low: '#b9b2a0', cloudLit: '#f2ead8', cloudDark: '#9aa8b8', sun: SUN_F, sunColor: [.9, .85, .7], cover: .3, scale: 1.0 });
    plane(180, 46, M('F', '#e2cc9a'), 0, 0, 11, g);
    plane(180, 4, M('F', '#c4a878', { wet: .7, gloss: 45, spec: .5 }), 0, .01, -8.5, g);
    water('F', { deep: [.06, .16, .2], skyTop: [.4, .55, .7], skyHor: [.8, .85, .85], chop: .35, foam: .3 }, 280, 130, 0, -.3, -74, g);
    const craft = new THREE.Group(); craft.name = 'F_craft'; craft.position.set(-3, 0, -6); craft.rotation.y = -.12; g.add(craft);
    box(4.2, 2.0, 9.5, M('F', '#5a645e', { wet: .5, gloss: 35, spec: .4 }), 0, -.6, 0, craft, { cast: true });   // hull at F_craft
    box(4.6, .5, 10, M('F', '#4c554e'), 0, 1.4, 0, craft);
    box(3.6, .18, 3.2, M('F', '#6b756c', { gloss: 30, spec: .3 }), 0, .35, 6.0, craft, { cast: true, rot: [.5, 0, 0] });  // bow ramp down toward the beach
    box(1.2, 1.2, 1.6, M('F', '#4c554e'), -1.2, 1.9, -3.4, craft, { cast: true });                              // wheelhouse block
    fixture('F', 1.4, 3.3, -3.2, craft, '#ffe2b0', .3); cyl(.05, 1.4, M('F', '#2c2a26'), 1.4, 1.9, -3.2, craft);   // signal lamp
    box(7, 1.6, 8, M('F', '#55606a'), 22, -.8, -38, g);                                                          // a second craft, far off
    box(50, 4, 12, M('F', '#8a8a76'), -48, -.3, -52, g);                                                         // headland
    box(1.1, .8, .9, M('F', '#9a7048'), 3.2, 0, -2.2, g, { cast: true }); box(.8, .55, .7, M('F', '#a87c52'), 3.3, .8, -2.1, g, { cast: true });
    box(1.1, .8, .9, M('F', '#9a7048'), 5.2, 0, .8, g, { cast: true });
    cyl(.45, .9, M('F', '#4a5a4a'), 4.4, 0, -3.4, g, { cast: true }); cyl(.45, .9, M('F', '#4a5a4a'), 5.4, 0, -3.0, g, { cast: true });  // barrels
    fixture('F', 3.2, 1.55, -1.6, g, '#ffe2b0', .26);                                                            // lamp on the crates (cratelamp light)
  }

  // ================= G · Spanish cemetery [0,400] — faces: fisherman [-1.2,1], policeman [1.2,1]
  { const g = placeGroup('G'), R = rnd(23);
    sky('G', { top: '#4a5f7a', hor: '#d9a878', low: '#6a7684', cloudLit: '#c9b8a8', cloudDark: '#54627a', sun: SUN_G, sunColor: [.85, .5, .3], cover: .4, scale: 1.1 });
    plane(90, 56, M('G', '#5a6b4a'), 0, 0, 1, g);
    plane(2.2, 30, M('G', '#c9b98f'), 0, .01, -4, g);                                                             // the path
    water('G', { deep: [.05, .1, .14], skyTop: [.3, .38, .5], skyHor: [.8, .62, .45], chop: .25, foam: .15 }, 260, 110, 0, -.8, -80, g);
    box(60, 1.1, .6, M('G', '#8a8474'), 0, 0, -24, g, { cast: true });                                            // sea wall
    const stoneM = M('G', '#9a968a');
    for (let i = 0; i < 16; i++) { const x = -13 + R() * 26, z = -5 - R() * 16; if (Math.abs(x) < 1.8) continue;   // rows of stones receding
      box(.9, 1.3 + R() * .4, .18, stoneM, x, 0, z, g, { cast: true, rot: [0, (R() - .5) * .3, 0] }); }
    const grave = new THREE.Group(); grave.name = 'G_grave'; grave.position.set(0, 0, -2.5); g.add(grave);
    box(1.1, 1.7, .22, M('G', '#a8a49a'), 0, 0, 0, grave, { cast: true });                                        // the new stone at G_grave
    box(1.3, .3, 2.4, M('G', '#6b5a44'), 0, 0, 1.2, grave);                                                       // fresh mound
    fixture('G', 1.3, 1.0, -1.4, g); cyl(.05, .8, M('G', '#2c2a26'), 1.3, 0, -1.4, g, { cast: true });            // grave lantern
    const tree = (x, z, s) => { cyl(.18 * s, 2.6 * s, M('G', '#4c3a28'), x, 0, z, g, { cast: true });
      const c = add(new THREE.SphereGeometry(.5, 12, 10), M('G', '#3e5234'), x, 3.4 * s, z, g); c.scale.set(3.4 * s, 2.8 * s, 3.4 * s); casters.push(c); };
    tree(-8, -10, 1.1); tree(9, -14, 1.3); tree(-12, -20, 1.0);
    for (const [x, z] of [[-5, -6], [6.5, -8], [-3, -16], [11, -4]]) { const b = add(new THREE.SphereGeometry(.5, 10, 8), M('G', '#465c3a'), x, .5, z, g); b.scale.set(1.8, 1.1, 1.8); casters.push(b); }
    box(4.4, 3.4, 5, M('G', '#b8b0a0'), 6, 0, -19.5, g, { cast: true });                                          // chapel
    box(5.0, .25, 3.2, M('G', '#7a4a3a'), 6, 3.9, -20.6, g, { rot: [.6, 0, 0] }); box(5.0, .25, 3.2, M('G', '#7a4a3a'), 6, 3.9, -18.4, g, { rot: [-.6, 0, 0] });
    box(1.0, 1.8, .12, M('G', '#ffca7a', { emit: 1.0, grime: 0 }), 6, 1.0, -16.95, g);                              // chapel window catching light
  }

  // ---- marks [x,z] world (faces stand here) and points [x,y,z] world (story spots)
  const mk = (o, x, z) => [o[0] + x, o[1] + z], pt = (o, x, y, z) => [o[0] + x, y, o[1] + z];
  const marks = {
    A_fisherman: mk(ORIGINS.A, -1.2, 1.0),
    B_british_officer: mk(ORIGINS.B, -1.0, 1.0),
    C_british_officer: mk(ORIGINS.C, -1.0, 1.0),
    D_policeman: mk(ORIGINS.D, -1.0, 1.2),
    E_german_officer: mk(ORIGINS.E, 0, 1.0),
    F_allied_soldier: mk(ORIGINS.F, 0, 1.0),
    G_fisherman: mk(ORIGINS.G, -1.2, 1.0),
    G_policeman: mk(ORIGINS.G, 1.2, 1.0),
  };
  const points = {
    A_body: pt(ORIGINS.A, 1.2, 0, 2.2), A_briefcase: pt(ORIGINS.A, 1.9, 0, 1.6),
    B_body: pt(ORIGINS.B, 1.5, 0, 0.5),
    C_desk: pt(ORIGINS.C, 1.5, 1.33, -1.5),
    D_table: pt(ORIGINS.D, 1.5, 1.21, -1.0), D_desk: pt(ORIGINS.D, -1.5, 1.28, -1.5),
    E_map: pt(ORIGINS.E, 0, 1.36, -2.0),
    F_craft: pt(ORIGINS.F, -3, 0, -6),
    G_grave: pt(ORIGINS.G, 0, 0, -2.5),
    E_counters: countersGroup,
    A_origin: pt(ORIGINS.A, 0, 0, 0), B_origin: pt(ORIGINS.B, 0, 0, 0), C_origin: pt(ORIGINS.C, 0, 0, 0),
    D_origin: pt(ORIGINS.D, 0, 0, 0), E_origin: pt(ORIGINS.E, 0, 0, 0), F_origin: pt(ORIGINS.F, 0, 0, 0), G_origin: pt(ORIGINS.G, 0, 0, 0),
  };

  const countersT0 = opts.countersT0 ?? 38.3, countersT1 = opts.countersT1 ?? 42.0;
  function update(t) {
    rig.update(t);                       // every light + the water's clock, from t alone
    K.update(t);
    const k = smooth(countersT0, countersT1, t);   // troop counters: Sicily -> Greece / Sardinia
    for (const c of counters) c.o.position.set(
      c.start[0] + (c.end[0] - c.start[0]) * k, .16, c.start[2] + (c.end[2] - c.start[2]) * k);
  }
  update(0);

  return { name: 'mincemeat-new', group, lightDir, skyColor: '#8fa0ae', marks, points,
    bounds: { x: [-16, 16], z: [-34, 12] }, casters, uniforms: SH, rig, places: ORIGINS, update, ready: Promise.resolve() };
}
