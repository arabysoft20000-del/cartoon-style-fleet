// fire_oxen/props/spear.js: a soldier's spear (esol1/esol2). Origin = the grip, ~40% up the shaft from the butt; blade +Y.
// opts: length (3.0), shaft colour, tassel (true shows the red tassel under the blade).
import { THREE, flat, part, finish } from '../../../engine/props/_kit.js';
export const free = true;

export function build(o = {}) {
  const g = new THREE.Group(); g.name = 'prop.spear';
  const L = o.length ?? 3.0, gripY = L * .4;
  const shaft = part(new THREE.CylinderGeometry(.032, .038, L, 10), flat(o.color ?? '#6e4a2c', '#4c3018'), .014);
  shaft.position.y = L / 2 - gripY; g.add(shaft);
  const socket = part(new THREE.CylinderGeometry(.045, .035, .22, 10), flat('#8f959e', '#62676e'), .01);
  socket.position.y = L - gripY + .08; g.add(socket);
  const blade = part(new THREE.ConeGeometry(.07, .52, 10), flat('#c8ccd2', '#8f959e'), .012);
  blade.scale.z = .32; blade.position.y = L - gripY + .42; g.add(blade);          // flattened leaf blade
  const ridge = part(new THREE.BoxGeometry(.016, .44, .05), flat('#e2e6ea'), .005);
  ridge.position.y = L - gripY + .4; g.add(ridge);
  if (o.tassel !== false) {
    const tassel = part(new THREE.ConeGeometry(.07, .26, 10), flat('#a82820', '#701812'), .01);
    tassel.position.y = L - gripY - .16; tassel.rotation.x = Math.PI; g.add(tassel);
    const knot = part(new THREE.TorusGeometry(.045, .016, 6, 12), flat('#7a1c14'), .006);
    knot.rotation.x = Math.PI / 2; knot.position.y = L - gripY - .02; g.add(knot);
  }
  const butt = part(new THREE.CylinderGeometry(.04, .04, .1, 10), flat('#45484e'), .008);
  butt.position.y = -gripY + .03; g.add(butt);
  return finish(g, { tip: [0, L - gripY + .68, 0], grip2: [0, -.55, 0] });
}
