// films/vermeer_forger/props/brush.js: an artist's paint brush. Origin = grip (mid-handle), brush points +Y.
// opts: length .9, handle colour, paint (bristle tip colour).
import { THREE, flat, part, finish } from '../../../engine/props/_kit.js';
export const free = true;

export function build(o = {}) {
  const g = new THREE.Group(); g.name = 'prop.brush';
  const L = o.length ?? .9;
  const handle = part(new THREE.CylinderGeometry(.032, .038, L * .68, 10), flat(o.handle ?? '#7a4a28'), .012);
  handle.position.y = L * .1; g.add(handle);
  const ferrule = part(new THREE.CylinderGeometry(.042, .042, L * .14, 10), flat('#b8bcc2'), .01);
  ferrule.position.y = L * .5; g.add(ferrule);
  const bristle = part(new THREE.ConeGeometry(.045, L * .22, 10), flat(o.paint ?? '#2e4a8a'), .01);
  bristle.position.y = L * .66; g.add(bristle);
  return finish(g, { tip: [0, L * .77, 0] });
}
