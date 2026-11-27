// fire_oxen/props/pot.js: a metal cooking pot, beaten for noise on the wall. Origin = ground centre under the pot.
// opts: r (.34), h (.42), lid (true shows the lid leaning on the rim), metal colour. Sockets: rim (the striking edge).
import { THREE, flat, part, finish } from '../../../engine/props/_kit.js';
export const free = true;

export function build(o = {}) {
  const g = new THREE.Group(); g.name = 'prop.pot';
  const r = o.r ?? .34, h = o.h ?? .42;
  const metal = flat(o.color ?? '#6a6e74', '#45484e');
  const body = part(new THREE.CylinderGeometry(r, r * .82, h, 16), metal, .018);
  body.position.y = h / 2; g.add(body);
  const belly = part(new THREE.SphereGeometry(r * .98, 14, 8), metal, .014);
  belly.scale.y = .45; belly.position.y = h * .3; g.add(belly);
  const rim = part(new THREE.TorusGeometry(r, .028, 8, 20), flat('#8f959e', '#62676e'), .012);
  rim.rotation.x = Math.PI / 2; rim.position.y = h; g.add(rim);
  for (const sx of [-1, 1]) {                                            // loop handles
    const hd = part(new THREE.TorusGeometry(.09, .02, 6, 14, Math.PI), metal, .01);
    hd.position.set(sx * r, h * .78, 0); hd.rotation.z = sx * -.4; g.add(hd);
  }
  const soot = part(new THREE.CylinderGeometry(r * .86, r * .8, .08, 14), flat('#2e2a26'), .008);
  soot.position.y = .05; g.add(soot);                                    // blackened base from the fire
  if (o.lid !== false) {
    const lid = part(new THREE.CylinderGeometry(r * .92, r * .98, .045, 16), flat('#7d8288', '#55585e'), .012);
    lid.position.set(r * .9, .16, .18); lid.rotation.z = 1.15; lid.rotation.x = .3; g.add(lid);   // lid leaning on the pot
    const knob = part(new THREE.SphereGeometry(.045, 8, 6), flat('#3a342c'), .008);
    knob.position.set(r * 1.28, .3, .22); g.add(knob);
  }
  return finish(g, { rim: [0, h, 0], mouth: [0, h + .02, 0] });
}
