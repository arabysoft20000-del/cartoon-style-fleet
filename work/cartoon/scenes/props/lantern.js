// scenes/props/lantern.js: 1943 oil lantern (BIBLE lines 2, 4 — the fisherman's lantern, the deck lantern).
// Origin = grip at the top of the handle; the lantern hangs below it (~.7 D tall overall).
// Warm light look by colour only (basic pale-yellow glass + flame) — no real light.
// opts: metal '#4a4a52', glass '#ffe9a8', flame '#ffb347', lit true (false = cold grey glass, no flame)
// sockets: grip, centre, flame, base
import { THREE, flat, basic, part, finish } from '../../engine/props/_kit.js';
export const free = true;

export function build(o = {}) {
  const g = new THREE.Group(); g.name = 'prop.lantern';
  const metal = flat(o.metal ?? '#4a4a52', '#2e2e34');
  const lit = o.lit ?? true;

  // handle: half-torus arc, grip at its top (origin)
  const handle = part(new THREE.TorusGeometry(.11, .014, 8, 18, Math.PI), metal, .014);
  handle.position.y = -.11; g.add(handle);
  [-.11, .11].forEach(x => {
    const lug = part(new THREE.BoxGeometry(.03, .05, .03), metal, .012);
    lug.position.set(x, -.12, 0); g.add(lug);
  });

  // cap (chimney top) + vent cone
  const cap = part(new THREE.CylinderGeometry(.085, .115, .07, 12), metal, .016);
  cap.position.y = -.175; g.add(cap);
  const vent = part(new THREE.CylinderGeometry(.035, .07, .07, 12), metal, .016);
  vent.position.y = -.12; g.add(vent);

  // glass chimney: pale yellow basic (warm look), slight bulge via two stacked cylinders
  const glassMat = lit ? basic(o.glass ?? '#ffe9a8') : basic('#b9bcc0');
  const glass = part(new THREE.CylinderGeometry(.075, .095, .2, 12), glassMat, .012);
  glass.position.y = -.31; g.add(glass);

  // flame inside (colour only)
  if (lit) {
    const flame = new THREE.Mesh(new THREE.ConeGeometry(.028, .09, 10), basic(o.flame ?? '#ffb347'));
    flame.position.y = -.33; g.add(flame);
    const core = new THREE.Mesh(new THREE.ConeGeometry(.014, .05, 8), basic('#fff3c4'));
    core.position.y = -.345; g.add(core);
  }

  // side wires from cap to base tank
  [-.105, .105].forEach(x => {
    const wire = part(new THREE.CylinderGeometry(.008, .008, .34, 6), metal, .01);
    wire.position.set(x, -.3, 0); g.add(wire);
  });

  // base oil tank + foot ring
  const tank = part(new THREE.CylinderGeometry(.1, .12, .11, 14), metal, .018);
  tank.position.y = -.465; g.add(tank);
  const foot = part(new THREE.CylinderGeometry(.13, .13, .025, 14), metal, .014);
  foot.position.y = -.53; g.add(foot);
  const knob = part(new THREE.CylinderGeometry(.02, .02, .03, 8), metal, .012);
  knob.rotation.z = Math.PI / 2; knob.position.set(.125, -.46, 0); g.add(knob);

  return finish(g, { centre: [0, -.3, 0], flame: [0, -.33, 0], base: [0, -.54, 0] });
}
