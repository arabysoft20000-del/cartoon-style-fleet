// films/vermeer_forger/props/painting.js: a framed "Vermeer-style" painting (gold frame + painted canvas texture).
// Origin = bottom-centre of the frame, front faces +Z. opts: w 1.9, h 2.3, frame colour, variant (texture seed).
import { THREE, flat, basic, part, finish, canvasTex } from '../../../engine/props/_kit.js';
export const free = true;

// A stylised Vermeer-like interior painted with flat 2D shapes: window light left, blue-dress figure, table, jug.
export function vermeerTex(variant = 0) {
  return canvasTex(512, 640, (c, w, h) => {
    const v = ((variant % 5) + 5) % 5;
    if (v === 1) {  // landscape: sky, fields, windmill, canal
      c.fillStyle = '#aebfc6'; c.fillRect(0, 0, w, h * .55);
      c.fillStyle = '#c8d4d8'; c.fillRect(0, h * .18, w, h * .1); c.fillRect(0, h * .36, w, h * .07);
      c.fillStyle = '#7a8a5e'; c.fillRect(0, h * .55, w, h * .45);
      c.fillStyle = '#5e7048'; c.fillRect(0, h * .55, w, h * .08);
      c.fillStyle = '#8a9a68'; c.fillRect(0, h * .72, w, h * .1);
      c.fillStyle = '#6a7a8a'; c.fillRect(0, h * .82, w, h * .1);                    // canal
      c.fillStyle = '#d8e2e4'; c.fillRect(0, h * .82, w, h * .02);
      const mx = w * .68, my = h * .55;
      c.fillStyle = '#5a4632'; c.beginPath(); c.moveTo(mx - w * .05, my); c.lineTo(mx - w * .025, my - h * .3); c.lineTo(mx + w * .025, my - h * .3); c.lineTo(mx + w * .05, my); c.closePath(); c.fill();
      c.strokeStyle = '#3e2f20'; c.lineWidth = 7;
      for (const a of [.4, 1.97, 3.54, 5.11]) { c.beginPath(); c.moveTo(mx, my - h * .3); c.lineTo(mx + Math.cos(a) * w * .16, my - h * .3 + Math.sin(a) * w * .16); c.stroke(); }
      c.fillStyle = '#4a5a3a'; for (const tx of [.12, .2, .3]) { c.beginPath(); c.arc(w * tx, h * .58, w * .045, 0, 7); c.fill(); c.fillRect(w * tx - 3, h * .58, 6, h * .07); }
    } else if (v === 2) {  // still life: table, jug, bread, drape
      c.fillStyle = '#2e2620'; c.fillRect(0, 0, w, h);
      c.fillStyle = '#3e342a'; c.fillRect(0, 0, w, h * .6);
      c.fillStyle = '#7a2e2e'; c.fillRect(w * .08, h * .58, w * .84, h * .3);        // drape
      c.fillStyle = '#5e2222'; c.fillRect(w * .08, h * .58, w * .84, h * .05);
      c.fillStyle = '#c8ccd2'; c.beginPath(); c.ellipse(w * .38, h * .5, w * .09, h * .1, 0, 0, 7); c.fill(); c.fillRect(w * .35, h * .36, w * .06, h * .06); // jug
      c.fillStyle = '#a8824a'; c.beginPath(); c.ellipse(w * .62, h * .56, w * .13, h * .045, 0, 0, 7); c.fill(); // bread
      c.fillStyle = '#8a6a34'; c.beginPath(); c.ellipse(w * .62, h * .545, w * .12, h * .04, 0, 0, 7); c.fill();
      c.fillStyle = '#d9a83c'; c.beginPath(); c.arc(w * .78, h * .52, w * .04, 0, 7); c.fill();  // lemon
      c.fillStyle = '#e8e2d2'; c.fillRect(w * .2, h * .52, w * .1, h * .02);        // knife glint
      c.fillStyle = 'rgba(255,240,200,.13)'; c.beginPath(); c.moveTo(0, 0); c.lineTo(w * .5, 0); c.lineTo(w * .85, h); c.lineTo(w * .2, h); c.closePath(); c.fill();
    } else if (v === 3) {  // portrait: dark ground, head and shoulders, white collar
      c.fillStyle = '#241e18'; c.fillRect(0, 0, w, h);
      c.fillStyle = '#322820'; c.beginPath(); c.ellipse(w * .5, h * .42, w * .34, h * .3, 0, 0, 7); c.fill();
      c.fillStyle = '#1e1a16'; c.beginPath(); c.moveTo(w * .18, h); c.lineTo(w * .34, h * .58); c.lineTo(w * .66, h * .58); c.lineTo(w * .82, h); c.closePath(); c.fill(); // coat
      c.fillStyle = '#e8e2d2'; c.beginPath(); c.moveTo(w * .4, h * .58); c.lineTo(w * .6, h * .58); c.lineTo(w * .5, h * .72); c.closePath(); c.fill(); // collar
      c.fillStyle = '#d9b896'; c.beginPath(); c.ellipse(w * .5, h * .42, w * .13, h * .13, 0, 0, 7); c.fill(); // face
      c.fillStyle = '#3a2c1c'; c.beginPath(); c.ellipse(w * .5, h * .33, w * .14, h * .07, 0, Math.PI, 0); c.fill(); // hair
      c.fillStyle = 'rgba(255,240,200,.10)'; c.fillRect(0, 0, w * .4, h);
    } else if (v === 4) {  // seascape: ships under a big sky
      c.fillStyle = '#b8c4c8'; c.fillRect(0, 0, w, h * .6);
      c.fillStyle = '#d4dcda'; c.fillRect(0, h * .12, w, h * .08); c.fillRect(0, h * .3, w, h * .06);
      c.fillStyle = '#5e7078'; c.fillRect(0, h * .6, w, h * .4);
      c.fillStyle = '#e8ecea'; for (let i = 0; i < 9; i++) c.fillRect(w * (.06 + i * .11), h * (.64 + (i % 3) * .09), w * .07, 3);
      for (const [sx, ss] of [[.3, 1], [.66, .7]]) { const bx = w * sx, by = h * .6;
        c.fillStyle = '#3e2f20'; c.beginPath(); c.moveTo(bx - w * .09 * ss, by); c.lineTo(bx + w * .09 * ss, by); c.lineTo(bx + w * .05 * ss, by + h * .05 * ss); c.lineTo(bx - w * .05 * ss, by + h * .05 * ss); c.closePath(); c.fill();
        c.fillStyle = '#efe8d8'; c.beginPath(); c.moveTo(bx, by - h * .2 * ss); c.lineTo(bx, by); c.lineTo(bx + w * .07 * ss, by); c.closePath(); c.fill();
        c.beginPath(); c.moveTo(bx, by - h * .16 * ss); c.lineTo(bx, by); c.lineTo(bx - w * .055 * ss, by); c.closePath(); c.fill(); }
    } else {  // v0: the forged Vermeer — woman at a window (the story painting)
      c.fillStyle = '#3a3226'; c.fillRect(0, 0, w, h);
      c.fillStyle = '#4a3f2c'; c.fillRect(0, h * .62, w, h * .38);
      c.fillStyle = '#d9e2e4'; c.fillRect(w * .06, h * .08, w * .3, h * .52);
      c.fillStyle = '#8fa5a8'; c.fillRect(w * .195, h * .08, w * .015, h * .52); c.fillRect(w * .06, h * .33, w * .3, h * .014);
      c.fillStyle = '#e8e2d2'; c.fillRect(w * .06, h * .08, w * .3, h * .06);
      const fx = w * .56, fy = h * .3;
      c.fillStyle = '#2e4a8a'; c.beginPath(); c.moveTo(fx - w * .13, h * .88); c.lineTo(fx - w * .05, fy + h * .18); c.lineTo(fx + w * .05, fy + h * .18); c.lineTo(fx + w * .14, h * .88); c.closePath(); c.fill();
      c.fillStyle = '#d9a83c'; c.fillRect(fx - w * .055, fy + h * .1, w * .11, h * .1);
      c.fillStyle = '#e8cdb4'; c.beginPath(); c.arc(fx, fy + h * .05, w * .045, 0, 7); c.fill();
      c.fillStyle = '#f2ead8'; c.beginPath(); c.arc(fx, fy + h * .02, w * .05, Math.PI, 0); c.fill();
      c.fillStyle = '#6e4a2c'; c.fillRect(w * .3, h * .66, w * .5, h * .05);
      c.fillStyle = '#54381f'; c.fillRect(w * .34, h * .71, w * .04, h * .2); c.fillRect(w * .72, h * .71, w * .04, h * .2);
      c.fillStyle = '#c8ccd2'; c.fillRect(w * .62, h * .56, w * .07, h * .1);
      c.fillStyle = 'rgba(255,244,200,.16)'; c.beginPath(); c.moveTo(w * .1, h * .1); c.lineTo(w * .36, h * .1); c.lineTo(w * .75, h * .95); c.lineTo(w * .3, h * .95); c.closePath(); c.fill();
    }
    c.strokeStyle = 'rgba(20,16,10,.55)'; c.lineWidth = 10; c.strokeRect(0, 0, w, h);
  });
}

export function build(o = {}) {
  const g = new THREE.Group(); g.name = 'prop.painting';
  const W = o.w ?? 1.9, H = o.h ?? 2.3, gold = flat(o.frame ?? '#a8822f'), goldD = flat('#7d5f1e');
  const add = (geo, mat, x, y, z) => { const m = part(geo, mat, .02); m.position.set(x, y, z); g.add(m); return m; };
  add(new THREE.BoxGeometry(W, H, .07), goldD, 0, H / 2, -.02);                    // backing
  const fr = .14;                                                                  // frame rails
  add(new THREE.BoxGeometry(W, fr, .1), gold, 0, H - fr / 2, 0);
  add(new THREE.BoxGeometry(W, fr, .1), gold, 0, fr / 2, 0);
  add(new THREE.BoxGeometry(fr, H, .1), gold, -(W / 2 - fr / 2), H / 2, 0);
  add(new THREE.BoxGeometry(fr, H, .1), gold, (W / 2 - fr / 2), H / 2, 0);
  const cv = new THREE.Mesh(new THREE.PlaneGeometry(W - fr * 1.6, H - fr * 1.6), basic('#ffffff', { map: vermeerTex(o.variant ?? 0) }));
  cv.position.set(0, H / 2, .035); g.add(cv);
  return finish(g, { centre: [0, H / 2, 0], top: [0, H, 0] });
}
