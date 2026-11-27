// fire_oxen/props/drum.js: a war drum beaten on the wall. Origin = ground centre under the drum.
// opts: r (.55), h (.7), body colour, head colour. Sockets: top (the striking point), sticks rest on the head.
import { THREE, flat, basic, part, finish } from '../../../engine/props/_kit.js';
export const free = true;

export function build(o = {}) {
  const g = new THREE.Group(); g.name = 'prop.drum';
  const r = o.r ?? .55, h = o.h ?? .7;
  const body = part(new THREE.CylinderGeometry(r, r * .94, h, 18), flat(o.color ?? '#8a2f24', '#5e1f18'), .02);
  body.position.y = h / 2; g.add(body);
  const head = part(new THREE.CylinderGeometry(r * 1.02, r * 1.02, .05, 18), flat(o.head ?? '#e8dcc0', '#c9b995'), .014);
  head.position.y = h + .02; g.add(head);
  for (const y of [h * .18, h * .82]) {                                  // rope hoops
    const hoop = part(new THREE.TorusGeometry(r * 1.01, .025, 6, 24), flat('#7a5a33'), .01);
    hoop.rotation.x = Math.PI / 2; hoop.position.y = y; g.add(hoop);
  }
  for (let i = 0; i < 8; i++) {                                          // studs round the rim
    const a = i / 8 * Math.PI * 2;
    const stud = part(new THREE.SphereGeometry(.035, 8, 6), flat('#c9a24a'), .008);
    stud.position.set(Math.cos(a) * r, h * .9, Math.sin(a) * r); g.add(stud);
  }
  // painted ring motif on the head (print, never a blank slab)
  const ring = new THREE.Mesh(new THREE.TorusGeometry(r * .55, .018, 6, 24), basic('#8a2f24'));
  ring.rotation.x = Math.PI / 2; ring.position.y = h + .048; g.add(ring);
  for (const sx of [-1, 1]) {                                            // two drumsticks resting crossed on the head
    const stick = part(new THREE.CylinderGeometry(.022, .03, .62, 8), flat('#6e4a2c'), .01);
    stick.position.set(sx * .14, h + .09, .05); stick.rotation.z = sx * 1.25; stick.rotation.y = sx * .4; g.add(stick);
    const tip = part(new THREE.SphereGeometry(.045, 8, 6), flat('#8a2f24'), .008);
    tip.position.set(sx * .42, h + .1, .16); g.add(tip);
  }
  return finish(g, { top: [0, h + .05, 0], rim: [r, h, 0] });
}
