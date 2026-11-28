// scenes/props/documents.js: identity papers held in hand (BIBLE lines 5, 6, 10, 11, 13).
// Origin = grip at the bottom edge centre; the sheet rises +Y, print faces +Z.
// opts: form 'id' (identity card, WILLIAM MARTIN + photo box) | 'secret' (letter naming GREECE / SARDINIA)
//       | 'stack' (a few sheets, top one printed), paper '#f1e6cc', w/h per kind
// sockets: grip, centre, top
import { THREE, flat, basic, part, finish, canvasTex } from '../../engine/props/_kit.js';
export const free = true;

function printTex(kind, paper) {
  if (kind === 'id') return canvasTex(256, 176, (c, w, h) => {
    c.fillStyle = paper; c.fillRect(0, 0, w, h);
    c.strokeStyle = '#8a7a5c'; c.lineWidth = 4; c.strokeRect(6, 6, w - 12, h - 12);
    // photo box (empty silhouette block — a card photo, never a face portrait)
    c.fillStyle = '#b9ac8f'; c.fillRect(w * .07, h * .18, w * .24, h * .52);
    c.fillStyle = '#7d7159'; c.beginPath(); c.arc(w * .19, h * .38, w * .055, 0, 7); c.fill();
    c.fillRect(w * .125, h * .47, w * .13, h * .2);
    c.fillStyle = '#3d3428'; c.font = 'bold 21px Georgia, serif';
    c.fillText('WILLIAM MARTIN', w * .37, h * .32);
    c.font = '14px Georgia, serif'; c.fillStyle = '#5d5142';
    c.fillText('CAPTAIN, ROYAL MARINES', w * .37, h * .47);
    c.fillStyle = '#8a7a5c';
    [[.37, .58, .5], [.37, .7, .42], [.37, .82, .3]].forEach(([x, y, l]) => c.fillRect(w * x, h * y, w * l, 4));
    c.fillStyle = '#a8302a'; c.beginPath(); c.arc(w * .86, h * .78, 17, 0, 7); c.fill(); // stamp
  });
  if (kind === 'secret') return canvasTex(256, 320, (c, w, h) => {
    c.fillStyle = paper; c.fillRect(0, 0, w, h);
    c.fillStyle = '#a8302a'; c.font = 'bold 20px Georgia, serif';
    c.fillText('MOST SECRET', w * .3, h * .09);
    c.fillStyle = '#4a4033'; c.font = '15px Georgia, serif';
    c.fillText('Operation: landings in', w * .1, h * .2);
    c.font = 'bold 26px Georgia, serif'; c.fillStyle = '#3d3428';
    c.fillText('GREECE', w * .1, h * .31);
    c.fillText('SARDINIA', w * .1, h * .42);
    c.fillStyle = '#8a7a5c';
    [.52, .6, .68, .76, .84].forEach(y => c.fillRect(w * .1, h * y, w * .78, 4));
    c.fillStyle = '#5d5142'; c.font = 'italic 14px Georgia, serif';
    c.fillText('— destroy after reading', w * .1, h * .93);
  });
  return canvasTex(256, 320, (c, w, h) => { // stack top sheet: typed lines + signature scribble
    c.fillStyle = paper; c.fillRect(0, 0, w, h);
    c.fillStyle = '#8a7a5c';
    [.12, .2, .28, .36, .44, .52, .6].forEach(y => c.fillRect(w * .1, h * y, w * .8, 4));
    c.strokeStyle = '#3d3428'; c.lineWidth = 3; c.beginPath();
    c.moveTo(w * .55, h * .85); c.bezierCurveTo(w * .65, h * .78, w * .72, h * .9, w * .85, h * .83); c.stroke();
  });
}

export function build(o = {}) {
  const g = new THREE.Group(); g.name = 'prop.documents';
  const kind = o.form ?? o.variant ?? 'id';   // NOT o.kind: the loader sets opts.kind = 'documents'
  const paper = o.paper ?? '#f1e6cc';
  const sizes = { id: [.55, .38], secret: [.55, .7], stack: [.55, .68] };
  const [W, H] = [o.w ?? sizes[kind]?.[0] ?? .55, o.h ?? sizes[kind]?.[1] ?? .5];
  const edge = flat(paper, '#c9bc9c');

  const sheet = (tex, dx, dy, dz, rz) => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(W, H, .012),
      [edge, edge, edge, edge, basic('#ffffff', { map: tex }), edge]);
    m.position.set(dx, H / 2 + dy, dz); m.rotation.z = rz; g.add(m); return m;
  };

  if (kind === 'stack') {
    sheet(printTex('stack', '#e8dcc0'), -.02, .01, -.024, -.05);
    sheet(printTex('stack', '#eee2c6'), .015, .005, -.012, .04);
    sheet(printTex('stack', paper), 0, 0, 0, 0);
  } else {
    sheet(printTex(kind, paper), 0, 0, 0, 0);
  }

  return finish(g, { centre: [0, H / 2, 0], top: [0, H, 0] });
}
