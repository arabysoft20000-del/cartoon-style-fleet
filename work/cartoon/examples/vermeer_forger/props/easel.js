// films/vermeer_forger/props/easel.js: a wooden artist's easel with a BLANK canvas.
// Origin = ground point between the feet, canvas front faces +Z. opts: w 1.7, h 2.1 (canvas), wood, canvas colour.
import { THREE, flat, basic, part, finish } from '../../../engine/props/_kit.js';
export const free = true;

export function build(o = {}) {
  const g = new THREE.Group(); g.name = 'prop.easel';
  const wood = flat(o.wood ?? '#8a5a33'), woodD = flat(o.woodDark ?? '#6e4525');
  const W = o.w ?? 1.7, H = o.h ?? 2.1, baseY = .95;            // canvas bottom height
  const add = (geo, mat, x, y, z, rx = 0, rz = 0) => { const m = part(geo, mat, .02); m.position.set(x, y, z); m.rotation.x = rx; m.rotation.z = rz; g.add(m); return m; };
  // front uprights (slight lean back)
  for (const sx of [-1, 1]) add(new THREE.BoxGeometry(.11, 3.5, .11), wood, sx * (W / 2 - .12), 1.72, -.12, -.1, sx * .02);
  // back leg
  add(new THREE.BoxGeometry(.11, 3.3, .11), woodD, 0, 1.6, -.85, .42);
  // crossbar / shelf the canvas rests on
  add(new THREE.BoxGeometry(W + .25, .1, .3), wood, 0, baseY - .05, .02);
  // top clamp
  add(new THREE.BoxGeometry(.5, .12, .18), woodD, 0, baseY + H + .12, -.2);
  // blank canvas: board + pale front
  const cv = add(new THREE.BoxGeometry(W, H, .07), flat(o.canvas ?? '#efe6d2'), 0, baseY + H / 2, -.05, -.1);
  cv.material = flat(o.canvas ?? '#efe6d2');
  // a few faint sketch strokes on the blank canvas (very pale, reads as "started")
  const sketch = new THREE.Mesh(new THREE.PlaneGeometry(W * .8, H * .7), basic(o.sketch ?? '#d8cbb2'));
  sketch.position.set(0, baseY + H / 2, -.005); sketch.rotation.x = -.1; g.add(sketch);
  return finish(g, { canvas: [0, baseY + H / 2, 0], top: [0, baseY + H, 0] });
}
