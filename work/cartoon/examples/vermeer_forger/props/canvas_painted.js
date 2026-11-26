// films/vermeer_forger/props/canvas_painted.js: the same easel, canvas now PAINTED (the finished "new Vermeer").
// Origin = ground point between the feet, canvas front faces +Z.
import { THREE, flat, basic, part, finish } from '../../../engine/props/_kit.js';
import { vermeerTex } from './painting.js';
export const free = true;

export function build(o = {}) {
  const g = new THREE.Group(); g.name = 'prop.canvas_painted';
  const wood = flat(o.wood ?? '#8a5a33'), woodD = flat(o.woodDark ?? '#6e4525');
  const W = o.w ?? 1.7, H = o.h ?? 2.1, baseY = .95;
  const add = (geo, mat, x, y, z, rx = 0, rz = 0) => { const m = part(geo, mat, .02); m.position.set(x, y, z); m.rotation.x = rx; m.rotation.z = rz; g.add(m); return m; };
  for (const sx of [-1, 1]) add(new THREE.BoxGeometry(.11, 3.5, .11), wood, sx * (W / 2 - .12), 1.72, -.12, -.1, sx * .02);
  add(new THREE.BoxGeometry(.11, 3.3, .11), woodD, 0, 1.6, -.85, .42);
  add(new THREE.BoxGeometry(W + .25, .1, .3), wood, 0, baseY - .05, .02);
  add(new THREE.BoxGeometry(.5, .12, .18), woodD, 0, baseY + H + .12, -.2);
  add(new THREE.BoxGeometry(W, H, .07), flat('#e8dfc8'), 0, baseY + H / 2, -.05, -.1);
  const cv = new THREE.Mesh(new THREE.PlaneGeometry(W * .94, H * .94), basic('#ffffff', { map: vermeerTex(o.variant ?? 1) }));
  cv.position.set(0, baseY + H / 2, -.005); cv.rotation.x = -.1; g.add(cv);
  return finish(g, { canvas: [0, baseY + H / 2, 0], top: [0, baseY + H, 0] });
}
