// fire_oxen/props/brush.js: a paint brush for the dressing scene (painting the dragon on the red cloth).
// Origin = the grip (mid-handle), brush points +Y. opts: length (.95), handle colour, paint (bristle tip colour, default dragon red).
import { THREE, flat, part, finish } from '../../../engine/props/_kit.js';
export const free = true;

export function build(o = {}) {
  const g = new THREE.Group(); g.name = 'prop.brush';
  const L = o.length ?? .95;
  const handle = part(new THREE.CylinderGeometry(.03, .037, L * .66, 10), flat(o.handle ?? '#7a4a28', '#54331a'), .012);
  handle.position.y = L * .08; g.add(handle);
  const ferrule = part(new THREE.CylinderGeometry(.04, .04, L * .13, 10), flat('#b8bcc2', '#8f959e'), .01);
  ferrule.position.y = L * .47; g.add(ferrule);
  const bristle = part(new THREE.ConeGeometry(.042, L * .24, 10), flat(o.paint ?? '#b02020', '#7d1414'), .01);
  bristle.position.y = L * .64; g.add(bristle);
  const blob = part(new THREE.SphereGeometry(.05, 8, 6), flat(o.paint ?? '#b02020'), .006);   // paint loaded on the tip
  blob.scale.y = .6; blob.position.y = L * .74; g.add(blob);
  return finish(g, { tip: [0, L * .76, 0] });
}
