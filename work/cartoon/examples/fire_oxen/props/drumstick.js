// fire_oxen/props/drumstick.js: a held drumstick for the wall-drum knock run (csol1).
// Origin = the grip (butt end), stick points +Y. opts: length (.55), handle colour, tip colour.
import { THREE, flat, part, finish } from '../../../engine/props/_kit.js';
export const free = true;

export function build(o = {}) {
  const g = new THREE.Group(); g.name = 'prop.drumstick';
  const L = o.length ?? .55;
  const handle = part(new THREE.CylinderGeometry(.022, .03, L, 10), flat(o.handle ?? '#7a4a28', '#54331a'), .01);
  handle.position.y = L / 2; g.add(handle);
  const tip = part(new THREE.SphereGeometry(.045, 10, 8), flat(o.tip ?? '#8a2f24', '#5e1f18'), .008);
  tip.position.y = L; g.add(tip);
  return finish(g, { tip: [0, L, 0] });
}
