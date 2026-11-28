// scenes/props/briefcase.js: 1943 locked leather briefcase (BIBLE lines 1, 10 — chained to the body, secret documents inside).
// Origin = grip at the handle centre; the case hangs below it. Front (+Z) carries two metal clasps and a centre lock.
// A chain loop hangs from one side (the wrist chain of lines 1/10).
// opts: open 0..1 (0 closed default, 1 lid rotated open), color '#6b4a2f', metal '#8f8f96', side 'R'|'L'
// sockets: grip, centre, lid, chain
import { THREE, flat, basic, part, finish, sideOf } from '../../engine/props/_kit.js';
export const free = true;

export function build(o = {}) {
  const g = new THREE.Group(); g.name = 'prop.briefcase';
  const s = sideOf(o) === 'L' ? -1 : 1;
  const leather = flat(o.color ?? '#6b4a2f', '#4a3220');
  const leatherDark = flat('#543a24', '#382716');
  const metal = flat(o.metal ?? '#8f8f96', '#5d5d64');
  const open = Math.max(0, Math.min(1, o.open ?? 0));

  const W = .9, H = .6, D = .18, topY = -.1; // case top sits just below the handle posts

  // handle: two posts + a bar, grip at its centre (origin)
  [-.16, .16].forEach(x => {
    const post = part(new THREE.BoxGeometry(.05, .12, .05), metal, .016);
    post.position.set(x, -.05, 0); g.add(post);
  });
  const bar = part(new THREE.CylinderGeometry(.028, .028, .4, 10), leatherDark, .018);
  bar.rotation.z = Math.PI / 2; bar.position.y = 0; g.add(bar);

  // lower case body
  const body = part(new THREE.BoxGeometry(W, H * .62, D), leather, .022);
  body.position.y = topY - H * .62 / 2 - H * .38; g.add(body);

  // lid on a hinge group at the back top edge so `open` rotates it up/back
  const hinge = new THREE.Group(); hinge.position.set(0, topY - H * .38, -D / 2); g.add(hinge);
  const lid = part(new THREE.BoxGeometry(W, H * .38, D), leather, .022);
  lid.position.set(0, H * .38 / 2, D / 2); hinge.add(lid);
  hinge.rotation.x = -open * 1.9; // open back past vertical, reads clearly at 300px

  // stitched straps down the front (two vertical bands)
  [-.28, .28].forEach(x => {
    const strap = part(new THREE.BoxGeometry(.09, H, .012), leatherDark, .014);
    strap.position.set(x, topY - H / 2, D / 2 + .004); g.add(strap);
  });

  // clasps + centre lock on the front seam
  [-.28, .28].forEach(x => {
    const clasp = part(new THREE.BoxGeometry(.11, .09, .03), metal, .016);
    clasp.position.set(x, topY - H * .38, D / 2 + .012); g.add(clasp);
  });
  const lock = part(new THREE.BoxGeometry(.13, .11, .035), metal, .016);
  lock.position.set(0, topY - H * .38, D / 2 + .014); g.add(lock);
  const keyhole = new THREE.Mesh(new THREE.CircleGeometry(.018, 10), basic('#2b2b30'));
  keyhole.position.set(0, topY - H * .38, D / 2 + .034); g.add(keyhole);

  // chain loop on the holding side: a ring + three hanging links
  const chainX = s * (W / 2 + .015);
  const ring = part(new THREE.TorusGeometry(.045, .012, 8, 16), metal, .012);
  ring.position.set(chainX, topY - .06, 0); ring.rotation.y = Math.PI / 2; g.add(ring);
  for (let i = 0; i < 3; i++) {
    const link = part(new THREE.TorusGeometry(.04, .011, 8, 14), metal, .012);
    link.position.set(chainX + s * .01, topY - .14 - i * .065, 0);
    link.rotation.y = i % 2 ? Math.PI / 2 : 0; g.add(link);
  }

  return finish(g, {
    centre: [0, topY - H / 2, 0],
    lid: [0, topY - H * .38 / 2, 0],
    chain: [chainX, topY - .2, 0],
  });
}
