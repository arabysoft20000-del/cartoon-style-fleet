// vermeer_forger_v2/props/canvas_painted.js: the same easel with the FINISHED painting (variant 0 scene).
// Origin = ground point between the feet, canvas front faces +Z. opts: w 1.7, h 2.1, wood.
import { THREE, flat, basic, part, finish } from '../../../engine/props/_kit.js';
import { vermeerTex } from './painting.js';
export const free = true;

export function build(o = {}) {
  const g = new THREE.Group(); g.name = 'prop.canvas_painted';
  const wood = flat(o.wood ?? '#8a5a33'), woodD = flat(o.woodDark ?? '#6e4525');
  const W = o.w ?? 1.7, H = o.h ?? 2.1, baseY = .95;
  const add = (geo, mat, x, y, z, rx = 0, rz = 0) => { const m = part(geo, mat, .02); m.position.set(x, y, z); m.rotation.x = rx; m.rotation.z = rz; g.add(m); return m; };
  for (const sx of [-1, 1]) { add(new THREE.BoxGeometry(.17, 3.5, .17), wood, sx * (W / 2 - .12), 1.72, -.12, -.1, sx * .02);
    add(new THREE.BoxGeometry(.5, .09, .34), woodD, sx * (W / 2 - .12), .05, .02); }
  add(new THREE.BoxGeometry(.16, 3.3, .16), woodD, 0, 1.6, -.85, .42);
  add(new THREE.BoxGeometry(W + .25, .1, .34), wood, 0, baseY - .05, .04);
  add(new THREE.BoxGeometry(W + .25, .07, .05), woodD, 0, baseY + .02, .2);
  add(new THREE.BoxGeometry(W - .1, .09, .09), woodD, 0, .45, -.1);
  add(new THREE.CylinderGeometry(.07, .06, .14, 10), flat('#7a2e2e'), W / 2 - .3, baseY + .06, .1);
  add(new THREE.BoxGeometry(.5, .12, .18), woodD, 0, baseY + H + .12, -.2);
  add(new THREE.BoxGeometry(W, H, .14), flat('#efe6d2'), 0, baseY + H / 2, -.05, -.1);
  for (const sx of [-1, 1]) add(new THREE.BoxGeometry(.07, H, .16), woodD, sx * (W / 2 - .03), baseY + H / 2, -.05, -.1);
  add(new THREE.BoxGeometry(W, .07, .16), woodD, 0, baseY + H - .03, -.05, -.1);
  const done = new THREE.Mesh(new THREE.PlaneGeometry(W * .92, H * .92), basic('#ffffff', { map: vermeerTex(0) }));
  done.position.set(0, baseY + H / 2, .03); done.rotation.x = -.1; g.add(done);
  return finish(g, { canvas: [0, baseY + H / 2, 0], top: [0, baseY + H, 0] });
}
