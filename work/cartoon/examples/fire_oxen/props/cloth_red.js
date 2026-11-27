// fire_oxen/props/cloth_red.js: a folded red silk cloth painted with a dragon (PAINT, never a creature).
// Origin = bottom centre. opts: w, h.
import { THREE, flat, basic, part, finish, canvasTex } from '../../../engine/props/_kit.js';
export const free = true;

function dragonClothTex() {
  return canvasTex(512, 384, (c, w, h) => {
    c.fillStyle = '#b02a20'; c.fillRect(0, 0, w, h);                                        // red silk
    c.fillStyle = 'rgba(255,180,120,.10)'; for (let i = 0; i < 6; i++) c.fillRect(0, i * h / 6, w, 3); // weave bands
    c.strokeStyle = '#e8b83c'; c.lineWidth = 10; c.strokeRect(14, 14, w - 28, h - 28);      // gold border
    // painted dragon (flat motif): gold body curve, head, claws, cloud swirls
    c.strokeStyle = '#e8b83c'; c.lineWidth = 16; c.lineCap = 'round';
    c.beginPath(); c.moveTo(w * .18, h * .72);
    c.bezierCurveTo(w * .4, h * .3, w * .55, h * .85, w * .72, h * .45); c.stroke();        // body
    c.fillStyle = '#e8b83c';
    c.beginPath(); c.arc(w * .76, h * .4, 26, 0, 7); c.fill();                              // head
    c.beginPath(); c.moveTo(w * .76, h * .32); c.lineTo(w * .84, h * .2); c.lineTo(w * .7, h * .26); c.closePath(); c.fill(); // horn
    c.fillStyle = '#7a1a12'; c.beginPath(); c.arc(w * .78, h * .38, 6, 0, 7); c.fill();     // eye
    c.strokeStyle = '#e8b83c'; c.lineWidth = 7;
    c.beginPath(); c.moveTo(w * .3, h * .55); c.lineTo(w * .24, h * .68); c.stroke();       // leg
    c.beginPath(); c.moveTo(w * .55, h * .62); c.lineTo(w * .5, h * .76); c.stroke();       // leg
    c.strokeStyle = 'rgba(232,184,60,.55)'; c.lineWidth = 6;
    for (const [cx, cy] of [[.14, .3], [.88, .68], [.5, .2]]) {                              // clouds
      c.beginPath(); c.arc(w * cx, h * cy, 18, 0, 7); c.stroke();
      c.beginPath(); c.arc(w * (cx + .05), h * cy, 12, 0, 7); c.stroke(); }
    c.strokeStyle = 'rgba(30,16,8,.6)'; c.lineWidth = 3; c.strokeRect(0, 0, w, h);          // ink edge
  });
}

export function build(o = {}) {
  const g = new THREE.Group(); g.name = 'prop.cloth_red';
  const W = o.w ?? 0.9, H = o.h ?? 0.65;
  const add = (geo, mat, x, y, z) => { const m = part(geo, mat, .012); m.position.set(x, y, z); g.add(m); return m; };
  add(new THREE.BoxGeometry(W, H, .05), flat('#8a1f16'), 0, H / 2, -.015);                 // backing
  const face = new THREE.Mesh(new THREE.PlaneGeometry(W - .06, H - .06), basic('#ffffff', { map: dragonClothTex() }));
  face.position.set(0, H / 2, .02); g.add(face);
  return finish(g, { centre: [0, H / 2, 0], top: [0, H, 0] });
}
