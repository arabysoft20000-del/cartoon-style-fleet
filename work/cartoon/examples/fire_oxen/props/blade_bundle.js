// fire_oxen/props/blade_bundle.js: a tied bundle of daggers (blades for the ox horns — never swords).
// Origin = grip centre. opts: n (blade count).
import { THREE, flat, part, finish } from '../../../engine/props/_kit.js';
export const free = true;

export function build(o = {}) {
  const g = new THREE.Group(); g.name = 'prop.blade_bundle';
  const n = o.n ?? 3;
  const steel = flat('#c8ccd4'), steelD = flat('#9aa0aa'), grip = flat('#4a3220'), rope = flat('#a8845a');
  const add = (geo, mat, x, y, z, rz = 0) => { const m = part(geo, mat, .012); m.position.set(x, y, z); m.rotation.z = rz; g.add(m); return m; };
  for (let i = 0; i < n; i++) {
    const a = (i - (n - 1) / 2) * 0.16;
    const x = Math.sin(a) * 0.12;
    add(new THREE.BoxGeometry(.09, .34, .02), i % 2 ? steelD : steel, x, .17, 0, a);      // blade
    add(new THREE.ConeGeometry(.05, .1, 4), steel, x + Math.sin(a) * .2, .39, 0, a);       // tip
    add(new THREE.BoxGeometry(.11, .05, .04), grip, x - Math.sin(a) * .02, -.02, 0, a);    // guard
    add(new THREE.CylinderGeometry(.03, .03, .14, 6), grip, x - Math.sin(a) * .06, -.11, 0, a); // handle
  }
  const tie = new THREE.Mesh(new THREE.TorusGeometry(.09, .018, 6, 12), rope);
  tie.position.set(0, .02, 0); tie.rotation.x = Math.PI / 2; g.add(tie);                    // rope tie
  return finish(g, { centre: [0, .1, 0], top: [0, .45, 0] });
}
