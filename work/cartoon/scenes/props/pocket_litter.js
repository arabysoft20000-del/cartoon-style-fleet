// scenes/props/pocket_litter.js: the planted pocket items as one held bundle (BIBLE lines 8, 9 —
// love letters, a bank receipt and theatre tickets going into / laid out from the pocket).
// Origin = grip at the bottom edge centre; the fanned bundle rises +Y, print faces +Z. ~.5 D wide.
// opts: paper '#f1e6cc', seed 7 (seeded scatter only — pure)
// sockets: grip, centre, top
import { THREE, flat, basic, part, finish, canvasTex, rng } from '../../engine/props/_kit.js';
export const free = true;

function scribbleTex(paper, head) {
  return canvasTex(160, 200, (c, w, h) => {
    c.fillStyle = paper; c.fillRect(0, 0, w, h);
    if (head) { c.fillStyle = '#5d5142'; c.font = 'bold 15px Georgia, serif'; c.fillText(head, w * .12, h * .14); }
    c.fillStyle = '#9a8a6c';
    [.3, .42, .54, .66].forEach(y => c.fillRect(w * .12, h * y, w * .74, 3));
    c.strokeStyle = '#6a5a48'; c.lineWidth = 2; c.beginPath();
    c.moveTo(w * .5, h * .86); c.bezierCurveTo(w * .6, h * .8, w * .68, h * .9, w * .82, h * .84); c.stroke();
  });
}

export function build(o = {}) {
  const g = new THREE.Group(); g.name = 'prop.pocket_litter';
  const paper = o.paper ?? '#f1e6cc';
  const r = rng(o.seed ?? 7);
  const edge = flat(paper, '#c9bc9c');

  // each item: [w, h, head, colour, fan angle] — held at the shared bottom-edge grip
  const items = [
    [.34, .46, 'My dearest,', paper, -.22],          // love letter 1
    [.3, .42, '', '#efe3c4', -.07],                   // love letter 2 / envelope
    [.2, .44, 'BANK', '#f6f0dc', .08],                // bank receipt (narrow)
    [.36, .2, 'THEATRE', '#e8d8a8', .24],             // theatre tickets (wide, short)
  ];

  items.forEach(([W, H, head, col, fan], i) => {
    const jitter = (r() - .5) * .04; // seeded, tiny — same opts = same bundle
    const holder = new THREE.Group(); holder.rotation.z = fan + jitter; g.add(holder);
    const m = new THREE.Mesh(new THREE.BoxGeometry(W, H, .01),
      [edge, edge, edge, edge, basic('#ffffff', { map: scribbleTex(col, head) }), edge]);
    m.position.set(0, H / 2, i * .008); holder.add(m);
    if (head === 'THEATRE') { // perforation line down the ticket strip
      const perf = new THREE.Mesh(new THREE.BoxGeometry(.006, H * .9, .004), basic('#8a7a5c'));
      perf.position.set(0, H / 2, i * .008 + .008); holder.add(perf);
    }
  });

  // a rubber band / string around the bundle at the grip so it reads as one held bunch
  const band = part(new THREE.BoxGeometry(.3, .05, .05), flat('#a8302a', '#7d241f'), .014);
  band.position.y = .045; g.add(band);

  return finish(g, { centre: [0, .24, 0], top: [0, .46, 0] });
}
