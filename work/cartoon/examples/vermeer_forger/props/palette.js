// films/vermeer_forger/props/palette.js: an artist's palette with paint blobs. Origin = grip at the thumb edge,
// palette lies flat (XZ plane), paint side up (+Y). opts: r .48.
import { THREE, flat, part, finish } from '../../../engine/props/_kit.js';
export const free = true;

export function build(o = {}) {
  const g = new THREE.Group(); g.name = 'prop.palette';
  const r = o.r ?? .48;
  const board = part(new THREE.CylinderGeometry(r, r, .035, 24), flat(o.wood ?? '#a06a38'), .015);
  board.scale.set(1.25, 1, .85); board.position.x = r * .55; g.add(board);
  const paints = ['#2e4a8a', '#d9a83c', '#f2ead8', '#a8323a', '#4a6e3a', '#3a2e22'];
  paints.forEach((c, i) => {
    const a = (i / paints.length) * Math.PI * 1.5 + .5;
    const blob = part(new THREE.SphereGeometry(.07, 10, 8), flat(c), .008);
    blob.scale.y = .35;
    blob.position.set(r * .55 + Math.cos(a) * r * .72, .03, Math.sin(a) * r * .5);
    g.add(blob);
  });
  return finish(g, { centre: [r * .55, 0, 0] });
}
