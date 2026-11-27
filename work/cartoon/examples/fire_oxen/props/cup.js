// fire_oxen/props/cup.js: a bronze wine cup for the camp at ease. Origin = the grip (the stem).
// NOTE: kind 'cup' also exists in engine/props/ (a paper take-away cup) and makeProp checks the engine
// first — load this one by direct import in set.js, or the paper cup wins. opts: bronze colour, wine (true fills it).
import { THREE, flat, basic, part, finish } from '../../../engine/props/_kit.js';
export const free = true;

export function build(o = {}) {
  const g = new THREE.Group(); g.name = 'prop.cup';
  const bronze = flat(o.color ?? '#9a7d3c', '#6e5826');
  const foot = part(new THREE.CylinderGeometry(.085, .1, .035, 14), bronze, .01);
  foot.position.y = -.14; g.add(foot);
  const stem = part(new THREE.CylinderGeometry(.03, .038, .12, 10), bronze, .008);
  stem.position.y = -.06; g.add(stem);
  const bowl = part(new THREE.CylinderGeometry(.115, .055, .13, 14), bronze, .012);
  bowl.position.y = .06; g.add(bowl);
  const rim = part(new THREE.TorusGeometry(.115, .014, 6, 18), flat('#c9a24a', '#9a7d3c'), .008);
  rim.rotation.x = Math.PI / 2; rim.position.y = .125; g.add(rim);
  const band = part(new THREE.TorusGeometry(.088, .01, 6, 16), flat('#6e5826'), .006);   // incised band (print)
  band.rotation.x = Math.PI / 2; band.position.y = .03; g.add(band);
  if (o.wine !== false) {
    const wine = new THREE.Mesh(new THREE.CircleGeometry(.1, 16), basic('#5e1420'));
    wine.rotation.x = -Math.PI / 2; wine.position.y = .11; g.add(wine);
  }
  return finish(g, { lip: [0, .13, .08], bowl: [0, .06, 0] });
}
