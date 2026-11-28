// scenes/set.js — six places 400 D apart, each with depth (far end 25 D+), 2+ practicals, lights as data via kit sun/sky.
// Build previz: kit description objects + a few boxes. The Environment overhaul makes it rich.
const SHORE = {
  name: 'shore', sky: { top: '#5e7d99', hor: '#d8c9a8', low: '#8a7a5e' },
  sun: { dir: [-0.6, 0.35, 0.5], warm: '#ffe8c0', cool: '#7a8aa8' },
  ground: [ { kind: 'sand', color: '#c9b183', x: [-40, 40], z: [-6, 12], tile: 4 }, { color: '#b49a6e', z: [-8, -5.5], y: -0.15 } ],
  water: { z0: -8, z1: -160, y: -0.5, color: '#4d7d99' },
  boxes: [
    { size: [2.4, 0.55, 1.0], at: [1.5, 0, 0.4], color: '#7a6a52' },              // the covered shape (blanket over it, never a body) — revealed in shot 2, clear of shot 1's tight frame
    { size: [3.2, 0.5, 1.2], at: [-6, 0, -2], color: '#6e4f33' },                // beached rowboat hull
    { size: [0.5, 0.5, 0.5], at: [-2.2, 0, 1.2], color: '#8a6a3a' },              // crate
    { size: [0.45, 0.45, 0.45], at: [-2.2, 0.5, 1.2], color: '#7a5c30' },         // crate on crate
    { size: [1.2, 5.5, 1.2], at: [-16, 0, -14], color: '#d8d2c4' },               // lighthouse tower (far, left)
    { size: [1.5, 0.8, 1.5], at: [-16, 5.5, -14], color: '#ffe9a8' },             // lighthouse lamp room
  ],
  lamps: [ { x: -3.8, z: -0.6, h: 1.6 } ],                                        // fisherman's lantern post (low, clear of shot 1's face)
  trees: [ { x: 9, z: -4, h: 7 } ],
  fences: [ { from: [-10, -4.5], to: [10, -4.5], h: 1.1, gap: 3, rails: 2, color: '#9a8464' } ],
};
const SUB = {
  name: 'sub', sky: { top: '#12283e', hor: '#2e4a63', low: '#1c2f42' },
  sun: { dir: [-0.4, 0.5, 0.6], warm: '#bcd4ea', cool: '#3a5a7a' },
  ground: [ { color: '#274a66', x: [-40, 40], z: [-30, 30], y: -1.2 } ],
  water: { z0: -30, z1: 30, y: -1.0, color: '#1f4258' },
  boxes: [
    { size: [34, 2.2, 3.4], at: [0, -0.4, 0], color: '#3d4a55' },                 // hull
    { size: [30, 0.5, 2.6], at: [0, 1.8, 0], color: '#4a5864' },                  // deck
    { size: [4.5, 2.6, 2.2], at: [-3, 2.3, 0], color: '#46525e' },                // conning tower
    { size: [0.3, 2.2, 0.3], at: [-3.6, 4.9, 0], color: '#39444e' },              // periscope mast
    { size: [2.4, 0.4, 0.9], at: [2.9, 2.3, 0.4], color: '#6a5c44' },             // covered stretcher on deck (clear of the sailor's feet)
    { size: [0.8, 0.8, 0.8], at: [4.5, 2.3, -0.6], color: '#55626e' },            // deck gear
  ],
  lamps: [ { x: -1.2, z: 1.4, h: 3.4 } ],                                          // deck lamp
};
const LONDON = {
  name: 'london', sky: 'indoor',
  sun: { dir: [-0.5, 0.6, 0.5], warm: '#ffe2b0', cool: '#8a7a66' },
  ground: [ { kind: 'floor', color: '#6e5638', x: [-12, 12], z: [-14, 8], tile: 3 } ],
  walls: [
    { x: 0, z: -9, w: 18, h: 6.5, th: 0.6, color: '#8a7452', door: { x: -4.5, h: 3.3, color: '#4a3a28' }, windows: [ { x: -3.5, y: 1.2, w: 3.4, h: 2.6 } ] },
    { x: -8, z: -1, w: 10, h: 6.5, th: 0.6, ry: 90, color: '#7d684a' },
    { x: 8, z: -1, w: 10, h: 6.5, th: 0.6, ry: -90, color: '#7d684a' },
  ],
  boxes: [
    { size: [7, 4.2, 0.3], at: [-1.5, 1.2, -8.6], color: '#c9bd9e' },             // map board (6+ D behind the officers)
    { size: [2.2, 1.1, 0.25], at: [-3.4, 2.2, -8.4], color: '#a8433a' },          // red arrow block (the lie)
    { size: [2.2, 1.1, 0.25], at: [0.4, 2.2, -8.4], color: '#3a6e8a' },           // blue arrow block (the truth)
    { size: [3.4, 2.4, 0.4], at: [-4.5, 0, -12.5], color: '#e8d9ae' },             // lit corridor beyond the door
    { size: [1.4, 1.8, 0.5], at: [5.6, 0, -3.6], color: '#5a4630' },              // filing cabinet
  ],
  counters: [ { x: 0, z: -1.2, w: 5.2, d: 1.5, h: 1.15 } ],                        // the desk
  lamps: [ { x: -2.2, z: -0.8, h: 2.4 }, { x: 3.4, z: 2.4, h: 3.2 } ],             // desk lamp + room lamp
  stools: [ { x: -1.2, z: 0.4 }, { x: 1.4, z: 0.4 } ],
};
const BERLIN = {
  name: 'berlin', sky: 'indoor',
  sun: { dir: [-0.3, 0.7, 0.4], warm: '#d8dcc8', cool: '#5a6658' },
  ground: [ { kind: 'floor', color: '#565a50', x: [-13, 13], z: [-14, 8], tile: 3 } ],
  walls: [
    { x: 0, z: -9.5, w: 20, h: 6.5, th: 0.6, color: '#6a6e60', windows: [ { x: 6.5, y: 1.4, w: 3.6, h: 2.6 } ] },
    { x: -9, z: -1, w: 10, h: 6.5, th: 0.6, ry: 90, color: '#606457' },
    { x: 9, z: -1, w: 10, h: 6.5, th: 0.6, ry: -90, color: '#606457' },
  ],
  boxes: [
    { size: [10, 4.6, 0.3], at: [-1, 1.1, -9.1], color: '#b8bdaa' },              // the big map board (7+ D behind the officers)
    { size: [2.6, 1.2, 0.25], at: [-3.8, 2.4, -8.9], color: '#a8433a' },          // arrows to Greece
    { size: [2.6, 1.2, 0.25], at: [-0.6, 2.4, -8.9], color: '#a8433a' },          // arrows to Sardinia
    { size: [1.6, 1.6, 0.5], at: [5.8, 0, -3.4], color: '#4c5044' },              // cabinet
  ],
  tables: [ { x: 0.6, z: -0.6, w: 4.6, d: 1.8, h: 1.1 } ],
  lamps: [ { x: 3.8, z: -0.6, h: 4.2 }, { x: -5.4, z: 2.2, h: 3.0 } ],            // overhead lamp + wall lamp
  stools: [ { x: -0.6, z: 0.8 }, { x: 1.8, z: 0.8 } ],
};
const SICILY = {
  name: 'sicily', sky: { top: '#4a8fd0', hor: '#f0e2bc', low: '#c9b183' },
  sun: { dir: [-0.55, 0.75, 0.45], warm: '#fff2d0', cool: '#8aa8c8' },
  ground: [ { kind: 'sand', color: '#d9c08e', x: [-40, 40], z: [-4, 16], tile: 4 } ],
  water: { z0: -4, z1: -120, y: -0.6, color: '#3f7fa8' },
  boxes: [
    { size: [7, 2.6, 3.2], at: [-3, -0.2, -3.4], color: '#5c6650' },              // landing craft
    { size: [5.5, 0.3, 2.2], at: [-3, 0.1, -1.2], color: '#4c5544' },             // its ramp
    { size: [1.6, 0.9, 1.0], at: [3.4, 0, 1.8], color: '#7a6a48' },               // crates ashore
    { size: [1.2, 0.7, 0.8], at: [4.6, 0, 2.2], color: '#6a5c3e' },
    { size: [26, 4.5, 3], at: [4, 0, 24], color: '#b49a6a' },                     // dunes / hills far side
  ],
  lamps: [ { x: -6.2, z: -2.2, h: 3.0 } ],                                         // boat lamp
  trees: [ { x: 10, z: 6, h: 8 }, { x: -11, z: 5, h: 7 } ],
};
const CEMETERY = {
  name: 'cemetery', sky: { top: '#7a6a8a', hor: '#e8b98a', low: '#6a5a48' },
  sun: { dir: [-0.7, 0.3, 0.5], warm: '#ffce9a', cool: '#7a6a8a' },
  ground: [ { kind: 'grass', color: '#6e7a4e', x: [-24, 24], z: [-20, 12], tile: 3 } ],
  boxes: [
    { size: [1.5, 2.0, 0.35], at: [0, 0, -1.2], color: '#c9c2b2' },               // the gravestone
    { size: [1.1, 1.4, 0.3], at: [-3.4, 0, -3], color: '#b8b0a0' },
    { size: [1.1, 1.5, 0.3], at: [3.2, 0, -3.4], color: '#b8b0a0' },
    { size: [1.0, 1.3, 0.3], at: [-3.2, 0, -7], color: '#aca494' },
    { size: [1.0, 1.4, 0.3], at: [3.4, 0, -7.4], color: '#aca494' },
    { size: [1.0, 1.2, 0.3], at: [-3.0, 0, -11], color: '#a09888' },
    { size: [1.0, 1.3, 0.3], at: [3.2, 0, -11.4], color: '#a09888' },
    { size: [0.9, 1.1, 0.3], at: [-2.8, 0, -15], color: '#948c7c' },
    { size: [0.9, 1.2, 0.3], at: [3.0, 0, -15.4], color: '#948c7c' },
  ],
  signs: [ { text: 'W. MARTIN', x: 0, y: 1.5, z: -0.98, w: 1.3, h: 0.4, post: false } ],
  lamps: [ { x: 0.9, z: -0.4, h: 0.9 } ],                                          // candle lantern by the grave
  trees: [ { x: -7, z: -9, h: 11 }, { x: 7.5, z: -12, h: 12 } ],                   // cypresses
  fences: [ { from: [-10, -18], to: [10, -18], h: 1.2, gap: 2.5, rails: 2, color: '#5a5248' } ],
};

const PLACES = [
  [SHORE, 0, 0], [SUB, 400, 0], [LONDON, 400, -400],
  [BERLIN, 400, 400], [SICILY, -400, 0], [CEMETERY, -400, -400],
];

export async function buildSet(THREE, scene, opts, kit) {
  const root = new THREE.Group(); root.name = 'mincemeat-set'; scene.add(root);
  const casters = []; const groups = [];
  for (const [desc, ox, oz] of PLACES) {
    const s = kit(desc, opts);
    if (s.group) { s.group.position.set(ox, 0, oz); root.add(s.group); groups.push(s.group);
      s.group.traverse(o => { if (o.isMesh && o.material?.uniforms?.uTop) { o.material.depthWrite = true; o.onBeforeRender = () => {}; o.position.set(0, 0, 0); o.frustumCulled = false; } }); }
    for (const c of s.casters || []) casters.push(c);
  }
  // one place on screen at a time: the kit domes do not occlude other places in this renderer (verified on frames),
  // so update(t) shows only the current place (opts.placeWindows from film.js: [t0, t1, placeIndex]) and hides
  // characters/props standing in other places.
  const update = (t) => {
    const w = (opts.placeWindows || []).find(w => t >= w[0] && t < w[1]); if (!w) return;
    const [, cx, cz] = PLACES[w[2]];
    groups.forEach((g, i) => { g.visible = i === w[2]; });
    if (!update._nodes) { update._nodes = { chars: [], props: [] }; scene.traverse(o => { if (o.name?.startsWith('character.')) update._nodes.chars.push(o); else if (o.name?.startsWith('prop.')) update._nodes.props.push(o); }); }
    const v = update._v || (update._v = new THREE.Vector3()); const homes = opts.charHomes || {};
    for (const o of update._nodes.chars) { const h = homes[o.name.slice(10)]; if (h) o.visible = Math.hypot(h[0] - cx, h[1] - cz) < 200; }
    for (const o of update._nodes.props) { o.updateWorldMatrix(true, false); o.getWorldPosition(v); o.visible = Math.hypot(v.x - cx, v.z - cz) < 200; }
  };
  return { group: root, lightDir: [-0.5, 0.6, 0.5], casters, marks: {}, points: {}, update };
}
